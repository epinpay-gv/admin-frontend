import { LegalPage } from "@/features/legal-pages/types";
import { LANGUAGE } from "@/types";

export const MOCK_LEGAL_PAGES: LegalPage[] = [
  {
    id: 1,
    pageName: "Gizlilik Politikası",
    pageUrl: "gizlilik-politikasi",
    contents: [
      {
        id: 101,
        language: LANGUAGE.TR,
        metaTitle: "Gizlilik Politikası | Epinpay",
        metaDescription: "Epinpay gizlilik politikası ve kişisel veri işleme koşulları.",
        text: "<p>Gizlilik politikası içeriği...</p>",
      },
      {
        id: 102,
        language: LANGUAGE.EN,
        metaTitle: "Privacy Policy | Epinpay",
        metaDescription: "Epinpay privacy policy and personal data processing terms.",
        text: "<p>Privacy policy content...</p>",
      },
    ],
    createdAt: "2024-11-01T10:00:00Z",
    updatedAt: "2024-11-15T08:00:00Z",
  },
  {
    id: 2,
    pageName: "Kullanım Koşulları",
    pageUrl: "kullanim-kosullari",
    contents: [
      {
        id: 103,
        language: LANGUAGE.TR,
        metaTitle: "Kullanım Koşulları | Epinpay",
        metaDescription: "Epinpay platform kullanım koşulları.",
        text: "<p>Kullanım koşulları içeriği...</p>",
      },
      {
        id: 104,
        language: LANGUAGE.EN,
        metaTitle: "Terms of Use | Epinpay",
        metaDescription: "Epinpay platform terms of use.",
        text: "<p>Terms of use content...</p>",
      },
    ],
    createdAt: "2024-11-01T10:00:00Z",
    updatedAt: "2024-11-20T12:00:00Z",
  },
  {
    id: 3,
    pageName: "Çerez Politikası",
    pageUrl: "cerez-politikasi",
    contents: [
      {
        id: 105,
        language: LANGUAGE.TR,
        metaTitle: "Çerez Politikası | Epinpay",
        metaDescription: "Epinpay çerez kullanım politikası.",
        text: "<p>Çerez politikası içeriği...</p>",
      },
    ],
    createdAt: "2024-11-05T09:00:00Z",
    updatedAt: "2024-11-05T09:00:00Z",
  },
  {
    id: 4,
    pageName: "İade ve İptal Politikası",
    pageUrl: "iade-ve-iptal-politikasi",
    contents: [
      {
        id: 106,
        language: LANGUAGE.TR,
        metaTitle: "İade ve İptal Politikası | Epinpay",
        metaDescription: "Epinpay iade ve iptal koşulları.",
        text: "<p>İade ve iptal politikası içeriği...</p>",
      },
      {
        id: 107,
        language: LANGUAGE.EN,
        metaTitle: "Refund & Cancellation Policy | Epinpay",
        metaDescription: "Epinpay refund and cancellation terms.",
        text: "<p>Refund and cancellation policy content...</p>",
      },
    ],
    createdAt: "2024-11-10T11:00:00Z",
    updatedAt: "2024-12-01T14:00:00Z",
  },
  {
    id: 5,
    pageName: "KVKK Aydınlatma Metni",
    pageUrl: "kvkk-aydinlatma-metni",
    contents: [
      {
        id: 108,
        language: LANGUAGE.TR,
        metaTitle: "KVKK Aydınlatma Metni | Epinpay",
        metaDescription: "Kişisel verilerin korunması kanunu kapsamında aydınlatma metni.",
        text: "<p>KVKK aydınlatma metni içeriği...</p>",
      },
    ],
    createdAt: "2024-11-12T09:00:00Z",
    updatedAt: "2024-11-12T09:00:00Z",
  },
];