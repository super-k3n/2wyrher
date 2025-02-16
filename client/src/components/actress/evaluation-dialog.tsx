import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertEvaluationSchema, type InsertEvaluation } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface EvaluationDialogProps {
  actressId: number;
  open: boolean;
  onClose: () => void;
}

type EvaluationFormData = Omit<InsertEvaluation, "userId" | "actressId">;

export function EvaluationDialog({
  actressId,
  open,
  onClose,
}: EvaluationDialogProps) {
  const { toast } = useToast();

  const form = useForm<EvaluationFormData>({
    resolver: zodResolver(
      insertEvaluationSchema.omit({ userId: true, actressId: true })
    ),
    defaultValues: {
      looksRating: 5,
      sexyRating: 5,
      elegantRating: 5,
      comment: "",
    },
  });

  const evaluationMutation = useMutation({
    mutationFn: async (data: EvaluationFormData) => {
      const res = await apiRequest(
        "POST",
        `/api/actresses/${actressId}/evaluate`,
        data
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/actresses/${actressId}`] });
      toast({
        title: "評価を送信しました",
        description: "あなたの評価が正常に保存されました。",
      });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "エラーが発生しました",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>新しい評価を追加</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) =>
              evaluationMutation.mutate(data)
            )}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="looksRating"
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <FormLabel>ルックス (1-10)</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <Slider
                        min={0}
                        max={10}
                        step={0.1}
                        value={[value]}
                        onValueChange={([v]) => onChange(v)}
                      />
                      <span className="w-12 text-right">{value.toFixed(1)}</span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sexyRating"
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <FormLabel>セクシー (1-10)</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <Slider
                        min={0}
                        max={10}
                        step={0.1}
                        value={[value]}
                        onValueChange={([v]) => onChange(v)}
                      />
                      <span className="w-12 text-right">{value.toFixed(1)}</span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="elegantRating"
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <FormLabel>エレガント (1-10)</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <Slider
                        min={0}
                        max={10}
                        step={0.1}
                        value={[value]}
                        onValueChange={([v]) => onChange(v)}
                      />
                      <span className="w-12 text-right">{value.toFixed(1)}</span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>コメント（任意）</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={evaluationMutation.isPending}
              >
                キャンセル
              </Button>
              <Button type="submit" loading={evaluationMutation.isPending}>
                評価を送信
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
