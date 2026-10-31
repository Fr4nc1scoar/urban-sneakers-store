export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  sizes: number[];
  category: string;
  inStock: boolean;
  featured?: boolean;
  lastUpdated: string;
}

export interface CartItem {
  product: Product;
  selectedSize: number;
  quantity: number;
}

export type InstallmentStatus = 'pending' | 'paid' | 'overdue';

export interface Installment {
  id: string;
  number: number;
  totalInstallments: number;
  amount: number;
  dueDate: string; // YYYY-MM-DD
  status: InstallmentStatus;
  paidAt?: string;
  paymentMethod?: string;
  notes?: string;
}

export type OrderStatus =
  | 'pending_confirmation'
  | 'confirmed'
  | 'in_delivery'
  | 'completed'
  | 'cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  brand: string;
  image: string;
  size: number;
  price: number;
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  city: string;
  address: string;
  idNumber?: string; // C.I. or ID for credit tracking
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: CustomerInfo;
  items: OrderItem[];
  totalAmount: number;
  paymentPreference: 'credit' | 'pago_movil' | 'cash' | 'binance' | 'zelle';
  status: OrderStatus;
  isCredit: boolean;
  creditPlan?: {
    frequency: 'quincenal' | 'semanal' | 'mensual';
    totalInstallments: number;
    installments: Installment[];
    notes?: string;
  };
}

export interface StoreSettings {
  storeName: string;
  ownerWhatsApp: string; // e.g. "584248057420"
  ownerWhatsAppDisplay: string; // "+58 424-8057420"
  defaultShoePrice: number; // 50
  catalogSourceUrl: string; // "https://loading-stylee.ola.click/products/?type=read"
  whatsappCatalogUrl: string; // "https://wa.me/c/584124717225"
  paymentDetails: {
    pagoMovil: {
      banco: string;
      cedula: string;
      telefono: string;
      titular: string;
    };
    binancePay: {
      payId: string;
      email: string;
    };
    zelle: {
      email: string;
      titular: string;
    };
    efectivo: {
      instrucciones: string;
    };
  };
  creditRules: {
    defaultInstallments: number; // 2
    defaultIntervalDays: number; // 15 (quincenal)
    allowCustomSplits: boolean;
  };
}
