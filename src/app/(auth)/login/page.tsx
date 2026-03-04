import { LoginCard, DecorativePanel } from "@/features/auth";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-[#0A0C12]">
      <DecorativePanel />
      <LoginCard />
    </div>
  );
}