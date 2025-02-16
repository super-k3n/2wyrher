import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Actress, Evaluation } from "@shared/schema";
import { Edit } from "lucide-react";

interface EvaluationCardProps {
  actress: Actress & {
    averageRatings: {
      avgLooks: number;
      avgSexy: number;
      avgElegant: number;
    };
    evaluations: (Evaluation & { user: { username: string } })[];
  };
  onEvaluate: () => void;
}

export function EvaluationCard({ actress, onEvaluate }: EvaluationCardProps) {
  const { averageRatings } = actress;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">{actress.name}</CardTitle>
        <Button
          onClick={onEvaluate}
          variant="outline"
          size="icon"
          className="h-8 w-8"
        >
          <Edit className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {actress.description && (
            <p className="text-sm text-muted-foreground">{actress.description}</p>
          )}
          
          <div className="space-y-2">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">ルックス</span>
                <span className="text-sm text-muted-foreground">
                  {averageRatings.avgLooks.toFixed(1)}/10
                </span>
              </div>
              <Progress value={averageRatings.avgLooks * 10} />
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">セクシー</span>
                <span className="text-sm text-muted-foreground">
                  {averageRatings.avgSexy.toFixed(1)}/10
                </span>
              </div>
              <Progress value={averageRatings.avgSexy * 10} />
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">エレガント</span>
                <span className="text-sm text-muted-foreground">
                  {averageRatings.avgElegant.toFixed(1)}/10
                </span>
              </div>
              <Progress value={averageRatings.avgElegant * 10} />
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-sm font-medium">最新の評価</h3>
            <div className="space-y-2">
              {actress.evaluations.slice(0, 3).map((evaluation) => (
                <div key={evaluation.id} className="text-sm">
                  <p className="font-medium">{evaluation.user.username}</p>
                  {evaluation.comment && (
                    <p className="text-muted-foreground">{evaluation.comment}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
