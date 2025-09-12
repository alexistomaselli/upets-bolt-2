export interface ProductImage {
  id: number;
  src: string;
  alt: string;
}

export interface ProductAttribute {
  id: number;
  name: string;
  options: string[];
  variation: boolean;
  visible: boolean;
}

export interface ProductVariation {
  id: number;
  price: string;
  regular_price: string;
  sale_price?: string;
  stock_quantity: number;
  attributes: { [key: string]: string };
  image?: ProductImage;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  type: 'simple' | 'variable' | 'grouped';
  status: 'publish' | 'draft';
  featured: boolean;
  catalog_visibility: string;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price?: string;
  on_sale: boolean;
  purchasable: boolean;
  stock_quantity: number;
  stock_status: 'instock' | 'outofstock';
  weight?: string;
  dimensions?: {
    length: string;
    width: string;
    height: string;
  };
  shipping_required: boolean;
  reviews_allowed: boolean;
  average_rating: string;
  rating_count: number;
  upsell_ids: number[];
  cross_sell_ids: number[];
  categories: ProductCategory[];
  tags: ProductTag[];
  images: ProductImage[];
  attributes: ProductAttribute[];
  variations?: number[];
  menu_order: number;
  meta_data?: Array<{
    id: number;
    key: string;
    value: string;
  }>;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: ProductImage;
  count: number;
}

export interface ProductTag {
  id: number;
  name: string;
  slug: string;
  description?: string;
  count: number;
}

export interface CartItem {
  key: string;
  id: number;
  quantity: number;
  name: string;
  price: number;
  line_total: number;
  variation?: { [key: string]: string };
  product_data: Product;
}

export interface Cart {
  items: CartItem[];
  item_count: number;
  total: number;
  subtotal: number;
  shipping_total: number;
  tax_total: number;
}

export interface Order {
  id: number;
  number: string;
  status: string;
  currency: string;
  total: string;
  total_tax: string;
  shipping_total: string;
  line_items: Array<{
    id: number;
    name: string;
    product_id: number;
    quantity: number;
    price: number;
    total: string;
  }>;
  billing: BillingAddress;
  shipping: ShippingAddress;
  payment_method: string;
  payment_method_title: string;
  date_created: string;
}

export interface BillingAddress {
  first_name: string;
  last_name: string;
  company?: string;
  address_1: string;
  address_2?: string;
  city: string;
  state?: string;
  postcode: string;
  country: string;
  email: string;
  phone: string;
}

export interface ShippingAddress {
  first_name: string;
  last_name: string;
  company?: string;
  address_1: string;
  address_2?: string;
  city: string;
  state?: string;
  postcode: string;
  country: string;
}