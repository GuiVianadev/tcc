"use client";

import { Legend, Pie, PieChart } from "recharts";
import { useUserStatistics } from "@/hooks/use-statistics";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "./ui/skeleton";

export const description = "A pie chart with a custom label";

const chartConfig = {
  value: {
    label: "Quantidade",
  },
  easy: {
    label: "Fácil",
    color: "var(--chart-1)",
  },
  hard: {
    label: "Difícil",
    color: "var(--chart-2)",
  },
  good: {
    label: "Bom",
    color: "var(--chart-3)",
  },
  again: {
    label: "Revisar",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

export function ChartPieLabelCustom() {
  const { data: statistics, isLoading } = useUserStatistics();

  const chartData = statistics?.flashcard_stats?.difficulty_distribution
    ? [
      { label: "Fácil", value: statistics.flashcard_stats.difficulty_distribution.easy, fill: "var(--chart-1)" },
      { label: "Bom", value: statistics.flashcard_stats.difficulty_distribution.good, fill: "var(--chart-3)" },
      { label: "Difícil", value: statistics.flashcard_stats.difficulty_distribution.hard, fill: "var(--chart-2)" },
      { label: "Revisar", value: statistics.flashcard_stats.difficulty_distribution.again, fill: "var(--chart-4)" },
    ].filter(item => item.value > 0)
    : [];
  if (isLoading) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Distribuição de Dificuldade</CardTitle>
          <CardDescription>Como você avaliou seus flashcards</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0 flex items-center justify-center min-h-[300px]">
          <Skeleton className="h-[250px] w-[250px] rounded-full" />
        </CardContent>
      </Card>
    );
  }

  if (!statistics || chartData.length === 0) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Distribuição de Dificuldade</CardTitle>
          <CardDescription>Como você avaliou seus flashcards</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0 flex items-center justify-center min-h-[300px]">
          <p className="text-sm text-muted-foreground">
            Nenhum flashcard revisado ainda
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Distribuição de Dificuldade</CardTitle>
        <CardDescription>Como você avaliou seus flashcards</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          className="mx-auto aspect-square max-h-[250px] px-0"
          config={chartConfig}
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent hideLabel nameKey="value" />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              label={({ payload, ...props }) => (
                <text
                  className="fill-foreground text-[8px]"
                  dominantBaseline={props.dominantBaseline}
                  textAnchor={props.textAnchor}
                  x={props.x}
                  y={props.y}
                >
                  {payload.label}
                </text>
              )}
              labelLine={false}
              nameKey="label"
            />
            <Legend />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
