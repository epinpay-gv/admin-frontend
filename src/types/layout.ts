export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: "super_admin" | "admin" | "moderator";
  avatarInitials: string;
}
