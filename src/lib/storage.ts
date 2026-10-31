import fs from 'fs';
import path from 'path';
import { Product, Order, StoreSettings, Installment } from '@/types';
import { fetchAndSyncCatalog } from './sync-service';

const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

// Default initial settings
export const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'Alberto Shoes Collection',
  ownerWhatsApp: '584248057420',
  ownerWhatsAppDisplay: '+58 424-8057420',
  defaultShoePrice: 50,
  catalogSourceUrl: 'https://loading-stylee.ola.click/products/?type=read',
  whatsappCatalogUrl: 'https://wa.me/c/584124717225',
  paymentDetails: {
    pagoMovil: {
      banco: 'Banesco (0134)',
      cedula: 'V-24.805.742',
      telefono: '0424-8057420',
      titular: 'Alberto Calzados',
    },
    binancePay: {
      payId: '849201948',
      email: 'pagos.albertozapatos@gmail.com',
    },
    zelle: {
      email: 'albertozapatos.ve@gmail.com',
      titular: 'Alberto Store',
    },
    efectivo: {
      instrucciones: 'Pago en dólares en efectivo exactos contra entrega personal o en tienda.',
    },
  },
  creditRules: {
    defaultInstallments: 2,
    defaultIntervalDays: 15,
    allowCustomSplits: true,
  },
};

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// SETTINGS
export async function getSettings(): Promise<StoreSettings> {
  ensureDataDir();
  if (!fs.existsSync(SETTINGS_FILE)) {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2), 'utf-8');
    return DEFAULT_SETTINGS;
  }
  try {
    const raw = fs.readFileSync(SETTINGS_FILE, 'utf-8');
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: Partial<StoreSettings>): Promise<StoreSettings> {
  ensureDataDir();
  const current = await getSettings();
  const updated: StoreSettings = { ...current, ...settings };
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  return updated;
}

// PRODUCTS
export async function getProducts(): Promise<Product[]> {
  ensureDataDir();
  if (!fs.existsSync(PRODUCTS_FILE)) {
    // First time bootstrap: fetch from online catalog immediately
    console.log('Bootstrapping products from online catalog...');
    const settings = await getSettings();
    const result = await fetchAndSyncCatalog(settings.defaultShoePrice, []);
    if (result.products.length > 0) {
      fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(result.products, null, 2), 'utf-8');
      return result.products;
    }
    return [];
  }

  try {
    const raw = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading products file', err);
    return [];
  }
}

export async function saveProducts(products: Product[]): Promise<void> {
  ensureDataDir();
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find(p => p.id === id) || null;
}

// ORDERS
export async function getOrders(): Promise<Order[]> {
  ensureDataDir();
  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2), 'utf-8');
    return [];
  }

  try {
    const raw = fs.readFileSync(ORDERS_FILE, 'utf-8');
    const orders: Order[] = JSON.parse(raw);
    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    console.error('Error reading orders file', err);
    return [];
  }
}

export async function saveOrder(order: Order): Promise<Order> {
  ensureDataDir();
  const orders = await getOrders();
  const existingIdx = orders.findIndex(o => o.id === order.id);
  if (existingIdx >= 0) {
    orders[existingIdx] = order;
  } else {
    orders.unshift(order);
  }
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
  return order;
}

export async function getOrderById(id: string): Promise<Order | null> {
  const orders = await getOrders();
  return orders.find(o => o.id === id || o.orderNumber === id) || null;
}

export async function updateOrderStatus(id: string, status: Order['status']): Promise<Order | null> {
  const order = await getOrderById(id);
  if (!order) return null;
  order.status = status;
  return saveOrder(order);
}

export async function updateOrderCreditPlan(
  orderId: string,
  creditPlan: Order['creditPlan']
): Promise<Order | null> {
  const order = await getOrderById(orderId);
  if (!order) return null;
  order.isCredit = true;
  order.creditPlan = creditPlan;
  return saveOrder(order);
}

export async function updateInstallmentPayment(
  orderId: string,
  installmentId: string,
  status: Installment['status'],
  paymentMethod?: string,
  notes?: string
): Promise<Order | null> {
  const order = await getOrderById(orderId);
  if (!order || !order.creditPlan) return null;

  const installment = order.creditPlan.installments.find(i => i.id === installmentId);
  if (!installment) return null;

  installment.status = status;
  if (status === 'paid') {
    installment.paidAt = new Date().toISOString();
    if (paymentMethod) installment.paymentMethod = paymentMethod;
  } else {
    installment.paidAt = undefined;
  }
  if (notes) installment.notes = notes;

  return saveOrder(order);
}
