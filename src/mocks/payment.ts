// mocks/payment.ts

import { PaymentMethod, FEE_TYPE } from "@/features/payment/types";

export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 1,
    name: "Kredi Kartı",
    slug: "credit-card",
    forbiddenCountries: ["IR", "SY", "KP"],
    providers: [
      {
        id: 1,
        name: "Lidio",
        feeType: FEE_TYPE.PERCENTAGE,
        feeValue: 2.5,
        isActive: true,
      },
      {
        id: 2,
        name: "Ziina",
        feeType: FEE_TYPE.PERCENTAGE,
        feeValue: 3.0,
        isActive: true,
      },
    ],
  },
  {
    id: 2,
    name: "EFT / Havale",
    slug: "bank-transfer",
    forbiddenCountries: [],
    providers: [
      {
        id: 1,
        name: "Lidio",
        feeType: FEE_TYPE.FIXED,
        feeValue: 5.0,
        isActive: true,
      },
    ],
  },
  {
    id: 3,
    name: "Kripto Para",
    slug: "crypto",
    forbiddenCountries: ["CN", "RU", "TR"],
    providers: [
      {
        id: 3,
        name: "Coingate",
        feeType: FEE_TYPE.PERCENTAGE,
        feeValue: 1.0,
        isActive: false,
      },
    ],
  },
  {
    id: 4,
    name: "Cüzdan",
    slug: "wallet",
    forbiddenCountries: [],
    providers: [
      {
        id: 1,
        name: "Lidio",
        feeType: FEE_TYPE.PERCENTAGE,
        feeValue: 0.0,
        isActive: true,
      },
    ],
  },
];