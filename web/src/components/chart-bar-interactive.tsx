"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
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
import { Skeleton } from "@/components/ui/skeleton";

export const description = "An interactive bar chart";

const chartConfig = {
  flashcards_reviewed: {
    label: "Flashcards",
    color: "var(--chart-1)",
  },
  quizzes_completed: {
    label: "Quizzes",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

type ChartData = {
  date: string;
  cards?: number;
  time?: number;
  accuracy?: number;
  flashcards_reviewed?: number;
  quizzes_completed?: number;
};

type ChartBarInteractiveProps = {
  data?: ChartData[];
  title?: string;
  description?: string;
};

export function ChartBarInteractive({ data: externalData, title = "Atividade de Estudos", description = "Suas atividades nos últimos 7 dias" }: ChartBarInteractiveProps = {}) {
  const { data: statistics, isLoading } = useUserStatistics();

  const chartData = React.useMemo(() => {
    if (externalData) return externalData;
    if (!statistics?.recent_activity) return [];
    return statistics.recent_activity.map((activity) => ({
      date: activity.date,
      flashcards_reviewed: activity.flashcards_reviewed,
      quizzes_completed: activity.quizzes_completed,
    }));
  }, [statistics, externalData]);

  if (isLoading && !externalData) {
    return (
      <Card className="justify-center p-5">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if ((!statistics && !externalData) || chartData.length === 0) {
    return (
      <Card className="justify-center p-5">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[250px]">
          <p className="text-sm text-muted-foreground">
            Nenhuma atividade registrada ainda
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="justify-center p-5">
      <CardHeader className="!p-0 flex flex-col items-stretch border-b border-none sm:flex-row">
        <div className="sm:!py-0 flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3">
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            {description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          className="aspect-auto h-[250px] w-full"
          config={chartConfig}
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="date"
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value + 'T12:00:00');
                return date.toLocaleDateString("pt-BR", {
                  day: "numeric",
                  month: "short",
                });
              }}
              tickLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[180px]"
                  labelFormatter={(value) =>
                    new Date(value + 'T12:00:00').toLocaleDateString("pt-BR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  }
                />
              }
            />
            <Bar dataKey="flashcards_reviewed" fill="var(--color-flashcards_reviewed)" />
            <Bar dataKey="quizzes_completed" fill="var(--color-quizzes_completed)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
