import { NextRequest, NextResponse } from 'next/server';
import { getProducts, saveProducts, getSettings } from '@/lib/storage';
import { fetchAndSyncCatalog } from '@/lib/sync-service';

export async function POST(req: NextRequest) {
  try {
    const settings = await getSettings();
    const existingProducts = await getProducts();
    
    // Optional override price passed in request body
    let priceToUse = settings.defaultShoePrice;
    try {
      const body = await req.json();
      if (body.price && !isNaN(body.price)) {
        priceToUse = Number(body.price);
      }
    } catch {
      // Body may be empty
    }

    const result = await fetchAndSyncCatalog(priceToUse, existingProducts);

    if (result.success && result.products.length > 0) {
      await saveProducts(result.products);
    }

    return NextResponse.json({
      success: result.success,
      totalSynced: result.totalSynced,
      newAdded: result.newAdded,
      updated: result.updated,
      errors: result.errors,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
