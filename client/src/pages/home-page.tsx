import { useAuth } from "@/hooks/use-auth";
import Sidebar from "@/components/layout/sidebar";
import { useQuery } from "@tanstack/react-query";
import { EvaluationCard } from "@/components/actress/evaluation-card";
import { EvaluationDialog } from "@/components/actress/evaluation-dialog";
import { Loader2 } from "lucide-react";
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

  const { data: actresses, isLoading } = useQuery<ActressWithEvaluations[]>({
    queryKey: ["/api/actresses"],
  });

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
          <h1 className="text-2xl font-bold mb-6">ようこそ, {user?.username}さん</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {actresses?.map((actress) => (
              <EvaluationCard
                key={actress.id}
                actress={actress}
                onEvaluate={() => setSelectedActressId(actress.id)}
              />
            ))}
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