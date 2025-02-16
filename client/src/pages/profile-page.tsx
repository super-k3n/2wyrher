
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EvaluationCard } from "@/components/actress/evaluation-card";
import { Twitter } from "lucide-react";

export default function ProfilePage() {
  const { username } = useParams();

  const { data: profile } = useQuery({
    queryKey: [`/api/users/${username}`],
    queryFn: async () => {
      const res = await fetch(`/api/users/${username}`);
      return res.json();
    },
  });

  if (!profile) return <div className="container mx-auto py-8">Loading...</div>;

  const { topActresses = [], evaluatedActresses = [] } = profile;

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* プロフィール情報 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{profile.username}</CardTitle>
          {profile.xUrl && (
            <a
              href={profile.xUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary"
            >
              <Twitter size={20} />
              X (Twitter)
            </a>
          )}
        </CardHeader>
        <CardContent>
          {profile.bio && <p className="text-muted-foreground">{profile.bio}</p>}
        </CardContent>
      </Card>

      {/* TOP5ランキング */}
      <Card>
        <CardHeader>
          <CardTitle>TOP5 評価ランキング</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {profile.topActresses.map((actress, index) => (
              <div key={actress.id} className="flex items-center gap-4">
                <span className="font-bold w-8">#{index + 1}</span>
                <span>{actress.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 評価一覧 */}
      <Card>
        <CardHeader>
          <CardTitle>評価一覧</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profile.evaluatedActresses.map((actress) => (
            <EvaluationCard key={actress.id} actress={actress} onEvaluate={() => {}} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
