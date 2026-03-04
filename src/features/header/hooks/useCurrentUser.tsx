"use client";

import { useEffect, useState } from "react";
import { User } from "@/types/layout";

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("/api/user/me")
      .then((res) => res.json())
      .then((data: User) => setUser(data));
  }, []);

  return { user };
}