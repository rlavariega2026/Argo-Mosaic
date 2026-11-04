export type CategoryType = 'LVP' | 'Wooden' | 'Matte Series' | 'Polished';
export type BadgeType = 'New Arrival' | 'Best Seller' | 'Featured' | 'none';
export type ProductStatus = 'published' | 'draft' | 'hidden';
export type GalleryStyle = 'editorial' | 'carousel' | 'mosaic' | 'fullscreen' | 'thumbnails-side';
export type Language = 'en' | 'es';

export interface GalleryItem {
  id: string;
  url: string;
  title?: string;
  type?: 'main' | 'ambient' | 'detail' | 'installation' | 'application';
}

export interface CustomSpec {
  labelEn: string;
  labelEs: string;
  value: string;
}

export interface CustomPackaging {
  labelEn: string;
  labelEs: string;
  value: string;
}

export interface TechnicalSpecs {
  material?: string;
  edgeType?: string;
  finish?: string;
  shadeVariation?: string;
  randomFaces?: string;
  peiRating?: string;
  printingTechnology?: string;
  frostResistant?: string;
  waterResistant?: string;
  waterAbsorption?: string;
  wearResistance?: string;
  slipResistance?: string;
  residentialUse?: string;
  commercialUse?: string;
  indoorApplication?: string;
  outdoorApplication?: string;
  wallApplication?: string;
  floorApplication?: string;
  customSpecs?: CustomSpec[];
}

export interface PackagingInfo {
  piecesPerBox?: number;
  sqFtPerBox?: number;
  weightLbsPerBox?: number;
  boxDimensions?: string;
  piecesPerPallet?: number;
  sqFtPerPallet?: number;
  weightLbsPerPallet?: number;
  palletDimensions?: string;
  customPackaging?: CustomPackaging[];
}

export interface ProductDocuments {
  catalogPdfUrl?: string;
  techSheetPdfUrl?: string;
  installationGuideUrl?: string;
  catalogWebLink?: string;
  tour360Url?: string;
}

export interface Product {
  id: string;
  nameEn: string;
  nameEs: string;
  model: string;
  category: CategoryType;
  brand: string;
  descriptionEn: string;
  descriptionEs: string;
  size: string;
  productType: string;
  availability: string;
  price: number;
  pricePerBox: number;
  pricePerSqFt: number;
  sku: string;
  badge: BadgeType;
  status: ProductStatus;
  stock: number;
  youtubeVideoUrl?: string;
  primaryImage: string;
  ambientImage?: string;
  gallery: GalleryItem[];
  galleryStyle: GalleryStyle;
  specs: TechnicalSpecs;
  packaging: PackagingInfo;
  documents: ProductDocuments;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  unitType: 'box' | 'sqft';
  unitPrice: number;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  companyName?: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  city: string;
  state: string;
  zipCode: string;
}

export type OrderStatus = 'Received' | 'In Preparation' | 'Ready for Pickup' | 'Shipped' | 'Delivered' | 'Cancelled';
export type PaymentStatus = 'Pending' | 'Approved' | 'Failed' | 'Quoted';
export type DeliveryMethod = 'warehouse_pickup' | 'freight_delivery';

export interface Order {
  id: string;
  orderNumber: string;
  customer: CustomerInfo;
  items: Array<{
    productId: string;
    productName: string;
    sku: string;
    unitType: 'box' | 'sqft';
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  deliveryMethod: DeliveryMethod;
  subtotal: number;
  shippingCost: number;
  salesTax: number;
  total: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  paymentDetails?: any;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface QuoteRequest {
  id?: string;
  quoteNumber?: string;
  customerName: string;
  companyName?: string;
  email: string;
  phone: string;
  projectType: string;
  deliveryCity: string;
  deliveryState: string;
  estimatedSqFt?: number;
  productsRequested: Array<{
    productId: string;
    productName: string;
    quantityBoxes?: number;
    sqFt?: number;
  }>;
  status?: 'Pending' | 'In Review' | 'Sent' | 'Accepted' | 'Declined';
  notes?: string;
  createdAt?: string;
}

export interface SampleRequest {
  id?: string;
  sampleNumber?: string;
  productId: string;
  productName: string;
  fullName: string;
  company?: string;
  email: string;
  phone: string;
  shippingAddress: string;
  city: string;
  state: string;
  zipCode: string;
  status?: 'Requested' | 'Dispatched' | 'Delivered';
  createdAt?: string;
}

export interface SalesRep {
  id: string;
  name: string;
  title: string;
  photoUrl: string;
  phone: string;
  whatsapp: string;
  email: string;
  languages: string;
  assignedCategories: string[];
}

export interface CompanySettings {
  companyName: string;
  logoUrl: string;
  brandTagline?: string;
  descriptionEn: string;
  descriptionEs: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  warehouseAddress: string;
  city: string;
  state: string;
  zipCode: string;
  businessHours: string;
  googleMapsEmbedUrl: string;
  paypalClientId: string;
  paypalSecretKey: string;
  paypalMode: 'sandbox' | 'live';
  lowStockThreshold: number;
  homeHeroTitleEn: string;
  homeHeroTitleEs: string;
  homeHeroSubtitleEn: string;
  homeHeroSubtitleEs: string;
  homeHeroImage: string;
  // Hero Typography & Style Customization
  heroFontFamily?: 'sans' | 'serif' | 'mono' | 'system';
  heroFontSize?: 'sm' | 'md' | 'lg' | 'xl';
  heroAlignment?: 'left' | 'center' | 'right';
  heroTitleColor?: string;
  heroSubtitleColor?: string;
  heroBadgeText?: string;
  heroBullet1?: string;
  heroBullet2?: string;
  heroBullet3?: string;
  // Commercial Pillars / Logistics Cards (Home & Footer)
  pillar1Title?: string;
  pillar1Desc?: string;
  pillar2Title?: string;
  pillar2Desc?: string;
  pillar3Title?: string;
  pillar3Desc?: string;
  // Destination Channels & Action Routing (Orders, Samples, Quotes)
  orderWhatsApp?: string;
  orderNotificationEmail?: string;
  orderActionType?: 'whatsapp' | 'email' | 'both';
  orderRedirectUrl?: string;
  sampleWhatsApp?: string;
  sampleNotificationEmail?: string;
  sampleActionType?: 'whatsapp' | 'email' | 'both';
  sampleRedirectUrl?: string;
  quoteWhatsApp?: string;
  quoteNotificationEmail?: string;
  quoteActionType?: 'whatsapp' | 'email' | 'both';
  quoteRedirectUrl?: string;
}

