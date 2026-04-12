import { Redirect } from "@/features/redirect/types";

export const mockRedirects: Redirect[] = [
  {
    id: 1,
    url_from: "/eski-urun",
    url_to: "/yeni-urun",
    createdAt: "2024-11-20T10:00:00Z",
    updatedAt: "2024-11-20T10:00:00Z",
  },
  {
    id: 2,
    url_from: "/kampanya-2023",
    url_to: "/kampanyalar",
    createdAt: "2024-11-21T09:00:00Z",
    updatedAt: "2024-11-21T09:00:00Z",
  },
  {
    id: 3,
    url_from: "/pubg-mobile-uc",
    url_to: "/urunler/pubg-mobile",
    createdAt: "2024-11-22T11:30:00Z",
    updatedAt: "2024-11-22T11:30:00Z",
  },
  {
    id: 4,
    url_from: "/steam-cards",
    url_to: "/urunler/steam",
    createdAt: "2024-11-23T08:45:00Z",
    updatedAt: "2024-11-23T08:45:00Z",
  },
  {
    id: 5,
    url_from: "/free-fire-elmas",
    url_to: "/urunler/free-fire",
    createdAt: "2024-11-24T14:00:00Z",
    updatedAt: "2024-11-24T14:00:00Z",
  },
];