import { UserButton } from "@clerk/nextjs";

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard (Protected)</h1>
      <UserButton afterSignOutUrl="/"/>
    </div>
  );
}
