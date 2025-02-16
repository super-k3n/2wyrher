
import { useAuth } from "@/hooks/use-auth";
import Sidebar from "@/components/layout/sidebar";
import { useQuery } from "@tanstack/react-query";
import { EvaluationCard } from "@/components/actress/evaluation-card";
import { EvaluationDialog } from "@/components/actress/evaluation-dialog";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import { useState } from "react";
import type { Actress, Evaluation, User } from "@shared/schema";

type ActressWithEvaluations = Actress & {
  averageRatings: {
    avgLooks: number;
    avgSexy: number;
    avgElegant: number;
  };
  evaluations: (Evaluation & { user: User })[];
};

export default function HomePage() {
  const { user } = useAuth();
  const [selectedActressId, setSelectedActressId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: actresses, isLoading } = useQuery<ActressWithEvaluations[]>({
    queryKey: ["/api/actresses"],
  });

  const filteredActresses = actresses?.filter((actress) =>
    actress.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 p-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-background overflow-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold">ようこそ, {user?.username}さん</h1>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="名前で検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredActresses?.map((actress) => (
                <EvaluationCard
                  key={actress.id}
                  actress={actress}
                  onEvaluate={() => setSelectedActressId(actress.id)}
                />
              ))}
            </div>
          </div>

          {selectedActressId && (
            <EvaluationDialog
              actressId={selectedActressId}
              open={true}
              onClose={() => setSelectedActressId(null)}
            />
          )}
        </div>
      </main>
    </div>
  );
}
