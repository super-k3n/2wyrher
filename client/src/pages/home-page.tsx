import { useAuth } from "@/hooks/use-auth";
import Sidebar from "@/components/layout/sidebar";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-background">
        <h1 className="text-2xl font-bold mb-6">Welcome, {user?.username}</h1>
        <p className="text-muted-foreground">
          Start exploring and rating profiles using our comprehensive evaluation system.
        </p>
      </main>
    </div>
  );
}
