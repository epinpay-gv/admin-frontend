"use client";

import { SearchBar, NotificationBell, UserMenu, useCurrentUser } from "@/features/header";
import { BurgerButton, MobileMenu, useMobileMenu } from "@/features/navigation";
import ThemeToggle from "@/components/common/theme-toggle/ThemeToggle";
import UserProfileCard from "./UserProfileCard";

export default function Header() {
  const { isOpen, toggle, close } = useMobileMenu();

  return (
    <>
      <header
        className="flex items-center h-16 px-6 gap-4 border-b shrink-0"
        style={{ background: "var(--background)", borderColor: "var(--border-subtle)" }}
      >
        <BurgerButton isOpen={isOpen} onClick={toggle} />
        <SearchBar />

        <div className="flex items-center gap-4 ml-auto">
          <ThemeToggle />
          <div className="hidden sm:block">
             <UserProfileCard />
          </div>
        </div>
      </header>

      <MobileMenu isOpen={isOpen} onClose={close} />
    </>
  );
}