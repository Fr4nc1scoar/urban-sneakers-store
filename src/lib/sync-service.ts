import { Product } from '@/types';

// Detect brand from product title
export function detectBrand(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('nike') || lower.includes('air force') || lower.includes('air forcé') || lower.includes('air max') || lower.includes('vomero') || lower.includes('dunk')) {
    return 'Nike';
  }
  if (lower.includes('jordan')) {
    return 'Jordan';
  }
  if (lower.includes('adidas') || lower.includes('campus') || lower.includes('samba') || lower.includes('super star') || lower.includes('superstar')) {
    return 'Adidas';
  }
  if (lower.includes('new balance')) {
    return 'New Balance';
  }
  if (lower.includes('alexander mcqueen') || lower.includes('mcqueen')) {
    return 'Alexander McQueen';
  }
  if (lower.includes('salomon') || lower.includes('salomón')) {
    return 'Salomon';
  }
  if (lower.includes('asics') || lower.includes('ascis')) {
    return 'Asics';
  }
  if (lower.includes('oncloud') || lower.includes('on cloud')) {
    return 'On Cloud';
  }
  if (lower.includes('vans')) {
    return 'Vans';
  }
  if (lower.includes('calvin klein')) {
    return 'Calvin Klein';
  }
  if (lower.includes('armani') || lower.includes('ax')) {
    return 'Armani Exchange';
  }
  if (lower.includes('hugo boss') || lower.includes('boss')) {
    return 'Hugo Boss';
  }
  if (lower.includes('lacoste')) {
    return 'Lacoste';
  }
  if (lower.includes('reebok') || lower.includes('reebook')) {
    return 'Reebok';
  }
  if (lower.includes('valentino')) {
    return 'Valentino';
  }
  return 'Multimarca';
}

// Clean and extract sizes from description
// e.g. "Talla:36-37-38-39-40-41-42-43-44-45" or "Talla 40, 41, 42"
export function extractSizes(description: string = ''): number[] {
  if (!description) return [38, 39, 40, 41, 42, 43];

  const matches = description.match(/\b(2[5-9]|3[0-9]|4[0-8])\b/g);
  if (matches && matches.length > 0) {
    const nums = Array.from(new Set(matches.map(m => parseInt(m, 10)))).sort((a, b) => a - b);
    if (nums.length > 0) return nums;
  }

  // Fallback if none parsed
  return [37, 38, 39, 40, 41, 42, 43, 44];
}

// Generate a deterministic slug ID
function generateId(name: string, image: string): string {
  const imgSlug = image.split('/').pop()?.split('.')[0] || '';
  const cleanName = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30);
  return `${cleanName}-${imgSlug.slice(0, 12)}`.replace(/-+$/, '');
}

export interface SyncResult {
  success: boolean;
  totalSynced: number;
  newAdded: number;
  updated: number;
  products: Product[];
  errors: string[];
}

export async function fetchAndSyncCatalog(
  defaultPrice = 50,
  existingProducts: Product[] = []
): Promise<SyncResult> {
  const url = 'https://loading-stylee.ola.click/products/?type=read';
  const errors: string[] = [];
  
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Cache-Control': 'no-cache',
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      throw new Error(`Error al conectar con el catálogo externo (HTTP ${response.status})`);
    }

    const html = await response.text();
    const ldJsonMatch = html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/);

    if (!ldJsonMatch) {
      throw new Error('No se encontró la estructura de catálogo (ld+json) en la respuesta del proveedor');
    }

    const ldData = JSON.parse(ldJsonMatch[1]);
    const sections = ldData.hasMenuSection || [];

    const existingMap = new Map<string, Product>();
    existingProducts.forEach(p => existingMap.set(p.id, p));

    const syncedProducts: Product[] = [];
    const seenKeys = new Set<string>();
    let newCount = 0;
    let updatedCount = 0;

    for (const section of sections) {
      const sectionName = section.name || 'Zapatos';
      const items = section.hasMenuItem || [];

      for (const item of items) {
        const name = (item.name || '').trim();
        const image = (item.image || '').trim();
        const description = (item.description || '').trim();
        const originalWholesalePrice = item.offers?.price ? Number(item.offers.price) : 25;
        const inStock = item.offers?.availability?.includes('InStock') ?? true;

        if (!name || !image) continue;

        const uniqueKey = `${name}_${image}`;
        if (seenKeys.has(uniqueKey)) continue;
        seenKeys.add(uniqueKey);

        const id = generateId(name, image);
        const sizes = extractSizes(description);
        const brand = detectBrand(name);
        const existing = existingMap.get(id);

        if (existing) {
          // Update stock and sizes while maintaining customized price if any
          syncedProducts.push({
            ...existing,
            description,
            sizes,
            inStock,
            category: sectionName,
            originalPrice: originalWholesalePrice,
            lastUpdated: new Date().toISOString(),
          });
          updatedCount++;
        } else {
          // New product
          syncedProducts.push({
            id,
            name,
            brand,
            description,
            price: defaultPrice, // $50 default as requested
            originalPrice: originalWholesalePrice,
            image,
            sizes,
            category: sectionName,
            inStock,
            featured: brand === 'Nike' || brand === 'Jordan' || brand === 'Adidas',
            lastUpdated: new Date().toISOString(),
          });
          newCount++;
        }
      }
    }

    return {
      success: true,
      totalSynced: syncedProducts.length,
      newAdded: newCount,
      updated: updatedCount,
      products: syncedProducts,
      errors,
    };
  } catch (err: any) {
    errors.push(err.message || 'Error desconocido durante la sincronización');
    return {
      success: false,
      totalSynced: existingProducts.length,
      newAdded: 0,
      updated: 0,
      products: existingProducts,
      errors,
    };
  }
}
