// Suspend modal açma/kapama state yönetimi

"use client";

import { useState } from "react";
import { UserListItem } from "@/features/users/types";

export function useUserModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);

  const open = (user: UserListItem) => {
    setSelectedUser(user);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setSelectedUser(null);
  };

  return { isOpen, selectedUser, open, close };
}