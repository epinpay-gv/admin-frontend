// Kullanıcı profil görüntüleme
// verifications,premium,activity bu hook'tan beslenir

"use client";

import { useEffect, useState } from "react";
import { User } from "@/features/users/types";
import { userService } from "../services/users.service";


export function useUser(id: number) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    userService
      .getById(id)
      .then(setUser)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { user, setUser, loading, error };
}