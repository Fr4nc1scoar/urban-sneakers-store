import { NextRequest, NextResponse } from 'next/server';
import { getProducts, saveProducts } from '@/lib/storage';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const brand = searchParams.get('brand');
    const size = searchParams.get('size');
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    const inStockOnly = searchParams.get('inStock') === 'true';

    let products = await getProducts();

    if (brand && brand !== 'all') {
      products = products.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
    }

    if (size) {
      const sizeNum = parseInt(size, 10);
      products = products.filter(p => p.sizes.includes(sizeNum));
    }

    if (category && category !== 'all') {
      products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (inStockOnly) {
      products = products.filter(p => p.inStock);
    }

    if (query) {
      const qLower = query.toLowerCase();
      products = products.filter(
        p =>
          p.name.toLowerCase().includes(qLower) ||
          p.brand.toLowerCase().includes(qLower) ||
          p.description.toLowerCase().includes(qLower)
      );
    }

    return NextResponse.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    let products = await getProducts();

    // 1. Bulk pricing update
    if (body.bulkUpdate) {
      const { rule, targetPrice, targetBrand, marginAmount } = body.bulkUpdate;
      let modifiedCount = 0;

      if (rule === 'all' && targetPrice) {
        products = products.map(p => {
          modifiedCount++;
          return { ...p, price: Number(targetPrice), lastUpdated: new Date().toISOString() };
        });
      } else if (rule === 'brand' && targetBrand && targetPrice) {
        products = products.map(p => {
          if (p.brand.toLowerCase() === targetBrand.toLowerCase()) {
            modifiedCount++;
            return { ...p, price: Number(targetPrice), lastUpdated: new Date().toISOString() };
          }
          return p;
        });
      } else if (rule === 'margin' && marginAmount !== undefined) {
        products = products.map(p => {
          const baseCost = p.originalPrice || 25;
          modifiedCount++;
          return { ...p, price: baseCost + Number(marginAmount), lastUpdated: new Date().toISOString() };
        });
      }

      await saveProducts(products);
      return NextResponse.json({ success: true, count: modifiedCount, message: `Se actualizaron ${modifiedCount} productos` });
    }

    // 2. Single product update
    const { id, price, inStock, featured } = body;
    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Producto no encontrado' }, { status: 404 });
    }

    if (price !== undefined) products[index].price = Number(price);
    if (inStock !== undefined) products[index].inStock = Boolean(inStock);
    if (featured !== undefined) products[index].featured = Boolean(featured);
    products[index].lastUpdated = new Date().toISOString();

    await saveProducts(products);

    return NextResponse.json({ success: true, product: products[index] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
