

import {
  Offer,
  OfferListItem,
  OFFER_STATUS,
  DELIVERY_TYPE,
} from "@/features/store/types";




const PRODUCT_PUBG_660: Offer["product"] = {
  id: 1,
  name: "PUBG Mobile 660 UC",
  slug: "pubg-mobile-660-uc",
  type: "UC",
  platform: "Mobile",
  region: "TR",
};

const PRODUCT_PUBG_1800: Offer["product"] = {
  id: 2,
  name: "PUBG Mobile 1800 UC",
  slug: "pubg-mobile-1800-uc",
  type: "UC",
  platform: "Mobile",
  region: "TR",
};

const PRODUCT_VALORANT_1700: Offer["product"] = {
  id: 4,
  name: "Valorant 1700 VP",
  slug: "valorant-1700-vp",
  type: "VP",
  platform: "PC",
  region: "EU",
};

const PRODUCT_VALORANT_2925: Offer["product"] = {
  id: 5,
  name: "Valorant 2925 VP",
  slug: "valorant-2925-vp",
  type: "VP",
  platform: "PC",
  region: "EU",
};

// Teklifler

export const mockOffers: Offer[] = [
  // 1) AUTOMATIC — Aktif, stok var
  {
    id: 101,
    product: PRODUCT_PUBG_660,
    price: { amount: 319.99, currency: "TRY" },
    status: OFFER_STATUS.ACTIVE,
    deliveryType: DELIVERY_TYPE.AUTOMATIC,
    stock: { total: 48, lowStockAlert: 10 },
    commissionRate: 5,
    deliveryTime: null,       // otomatik teslimat — süre yok
    note: null,
    updatedAt: "2025-03-10T10:00:00Z",
    createdAt: "2025-01-10T10:00:00Z",
  },

  // 2) AUTOMATIC — Aktif, stok 0 → otomatik pasife alınabilir kural senaryosu
  {
    id: 102,
    product: PRODUCT_PUBG_1800,
    price: { amount: 799.99, currency: "TRY" },
    status: OFFER_STATUS.ACTIVE,
    deliveryType: DELIVERY_TYPE.AUTOMATIC,
    stock: { total: 0, lowStockAlert: 5 },
    commissionRate: 5,
    deliveryTime: null,
    note: null,
    updatedAt: "2025-03-09T08:00:00Z",
    createdAt: "2025-01-11T10:00:00Z",
  },

  // 3) AUTOMATIC — Pasif, stok var → mağaza manuel pasife almış
  {
    id: 103,
    product: PRODUCT_PUBG_660,
    price: { amount: 309.99, currency: "TRY" },
    status: OFFER_STATUS.PASSIVE,
    deliveryType: DELIVERY_TYPE.AUTOMATIC,
    stock: { total: 20, lowStockAlert: null },
    commissionRate: 5,
    deliveryTime: null,
    note: "Fiyat güncellemesi için geçici olarak durduruldu.",
    updatedAt: "2025-03-08T14:00:00Z",
    createdAt: "2025-01-12T10:00:00Z",
  },

  // 4) ID_UPLOAD — Aktif, ID alanları tanımlı
  {
    id: 104,
    product: PRODUCT_VALORANT_1700,
    price: { amount: 209.99, currency: "TRY" },
    status: OFFER_STATUS.ACTIVE,
    deliveryType: DELIVERY_TYPE.ID_UPLOAD,
    // stock yok 
    idFields: [
      { key: "riot_id",  label: "Riot ID",  isRequired: true,  isEditable: false },
      { key: "tagline",  label: "Tagline",  isRequired: true,  isEditable: false },
    ],
    commissionRate: 7,
    deliveryTime: "24 saat",
    note: null,
    updatedAt: "2025-03-08T09:00:00Z",
    createdAt: "2025-01-13T10:00:00Z",
  },

  // 5) ID_UPLOAD — Pasif
  {
    id: 105,
    product: PRODUCT_VALORANT_2925,
    price: { amount: 529.99, currency: "TRY" },
    status: OFFER_STATUS.PASSIVE,
    deliveryType: DELIVERY_TYPE.ID_UPLOAD,
    idFields: [
      { key: "riot_id",  label: "Riot ID",  isRequired: true,  isEditable: false },
      { key: "tagline",  label: "Tagline",  isRequired: true,  isEditable: false },
    ],
    commissionRate: 7,
    deliveryTime: "24 saat",
    note: "Stok temin edilince aktif edilecek.",
    updatedAt: "2025-03-07T11:00:00Z",
    createdAt: "2025-01-14T10:00:00Z",
  },
];

// Liste görünümü için hafif mock

export const mockOfferListItems: OfferListItem[] = mockOffers.map((offer) => ({
  id:           offer.id,
  productName:  offer.product.name,
  price:        offer.price,
  status:       offer.status,
  deliveryType: offer.deliveryType,
  stock:        offer.stock ? { total: offer.stock.total } : undefined,
  updatedAt:    offer.updatedAt,
}));