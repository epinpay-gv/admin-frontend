import { User } from "@/types/layout";

//! LOGIN 

export const MOCK_USERS: User[] = [
  {
    uid: "mock-uid-001",
    email: "admin@epinpay.com",
    displayName: "Ahmet Yılmaz",
    role: "super_admin",
    avatarInitials: "AY",
  },
  {
    uid: "mock-uid-002",
    email: "moderator@epinpay.com",
    displayName: "Mehmet Kaya",
    role: "moderator",
    avatarInitials: "MK",
  },
];