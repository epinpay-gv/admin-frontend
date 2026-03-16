"use client";

import { useEffect, useState } from "react";
import { UserListItem, UserFilters } from "@/features/users/types";
import { userService } from "../services/users.service";


export function useUsers(filters?: UserFilters) {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    userService
      .getAll(filters)
      .then(setUsers)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [JSON.stringify(filters)]);

  return { users, loading, error };
}