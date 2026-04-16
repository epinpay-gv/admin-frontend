"use client";

import Modal from "@/components/common/modal/Modal";
import { UserListItem } from "../types";
import { Button } from "@/components/ui/button";
import { Users, Mail, User as UserIcon } from "lucide-react";

interface UserReferralsModalProps {
  open: boolean;
  onClose: () => void;
  user: UserListItem | null;
}

export default function UserReferralsModal({
  open,
  onClose,
  user,
}: UserReferralsModalProps) {
  const referrals = user?.referrals || [];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Referans Listesi"
      description={`${user?.firstname} ${user?.lastname} kullanıcısının davetleri`}
      size="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <p className="text-xs font-mono text-(--text-muted)">
            {referrals.length} kayıtlı referans
          </p>
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-(--text-muted)"
          >
            Kapat
          </Button>
        </div>
      }
    >
      <div className="space-y-3">
        {referrals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 rounded-xl border border-dashed border-(--border) gap-2">
            <Users size={24} className="text-(--text-muted) opacity-20" />
            <p className="text-sm font-mono text-(--text-muted)">
              Henüz referans kaydı bulunmuyor.
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
            {referrals.map((ref, index) => (
              <div
                key={ref.id}
                className="flex items-center justify-between px-4 py-3 rounded-xl border border-(--border) bg-(--background-secondary)"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="text-xs font-mono text-(--text-muted) w-4">
                    {index + 1}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-(--background-card) flex items-center justify-center border border-(--border) shrink-0">
                    <UserIcon size={14} className="text-[#00C6A2]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate text-(--text-primary)">
                      {ref.firstName} {ref.lastName}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Mail size={10} className="text-(--text-muted)" />
                      <p className="text-[11px] font-mono truncate text-(--text-muted)">
                        {ref.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}