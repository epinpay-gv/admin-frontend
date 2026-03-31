export enum OFFER_STATUS {
    ACTIVE = "active",
    PASSIVE = "passive",
    DRAFT = "draft",
}

export enum DELIVERY_TYPE {
    AUTOMATIC = "automatic",
    ID_UPLOAD = "id_upload",
    DROPSHIPPING = "dropshipping"
}

export type Currency = string;

export interface OfferProduct {
    id: number;
    name: string;
    slug: string;
    type: string;
    platform: string;
    region: string;
}

export interface OfferPrice {
    amount: number;
    currency: Currency;
}

export interface StockInfo {
    total: number;
    lowStockAlert: number | null;
}

export interface IdUploadField {
    key: string;
    label: string;
    isRequired: boolean;
    isEditable: boolean;
}



export interface Offer {
  id:           number;
  product:      OfferProduct;
  price:        OfferPrice;
  status:       OFFER_STATUS;
  deliveryType: DELIVERY_TYPE;

  // Sadece AUTOMATIC tipinde dolu gelir
  stock?:       StockInfo;

  // Sadece ID_UPLOAD tipinde dolu gelir
  idFields?:    IdUploadField[];

  // Meta
  commissionRate: number;      
  deliveryTime:   string | null; 
  note:           string | null; 
  updatedAt:      string;
  createdAt:      string;
}

// Liste görünümü için hafif model (tablo satırları)
export interface OfferListItem {
  id:           number;
  productName:  string;
  price:        OfferPrice;
  status:       OFFER_STATUS;
  deliveryType: DELIVERY_TYPE;
  stock?:       Pick<StockInfo, "total">; 
  updatedAt:    string;
}

// Form tipleri 

// Teklif oluşturma/güncelleme formu
export interface OfferFormValues {
  productId:    number;
  price:        number;
  currency:     Currency;
  status:       OFFER_STATUS;
  deliveryType: DELIVERY_TYPE;
  epins?:       string[];           
  lowStockAlert?: number;            
  idFields?:    IdUploadField[];     
  note?:        string;
}

// Filtre state'i
export interface OfferFilters {
  status?:       OFFER_STATUS;
  deliveryType?: DELIVERY_TYPE;
  minPrice?:     number;
  maxPrice?:     number;
  currency?:     Currency;
  search?:       string;
}
