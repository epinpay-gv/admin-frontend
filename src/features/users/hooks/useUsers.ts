"use client";

import { useEffect, useState } from "react";
import { UserListItem, UserFilters, PaginatedResponse, PaginationInfo } from "@/features/users/types";
import { userService } from "../services/users.service";

export function useUsers(filters?: UserFilters) {
  const [users, setUsers] = useState<UserListItem[]>([]);  
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);  
    userService
      .getAll(filters)
      .then((response: PaginatedResponse<UserListItem[]>) => {
        if (isMounted) {
          setUsers(response.data);
          setPagination(response.pagination);
        }
      })
      .catch((err: Error) => {
        if (isMounted) setError(err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [JSON.stringify(filters)]);

  return { users, pagination, loading, error };
}