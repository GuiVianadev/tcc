"use client";

import { Legend, Pie, PieChart } from "recharts";

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

export const description = "A pie chart with a custom label";

// Agora usamos rótulos reais no lugar de browsers
const chartData = [
  { label: "Fácil", value: 275, fill: "var(--chart-1)" },
  { label: "Difícil", value: 200, fill: "var(--chart-2)" },
  { label: "Bom", value: 187, fill: "var(--chart-3)" },
  { label: "Novamente", value: 173, fill: "var(--chart-4)" },
];

const chartConfig = {
  value: {
    label: "Quantidade",
  },
  facil: {
    label: "Fácil",
    color: "var(--chart-1)",
  },
  dificil: {
    label: "Difícil",
    color: "var(--chart-2)",
  },
  bom: {
    label: "Bom",
    color: "var(--chart-3)",
  },
  novamente: {
    label: "Novamente",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

export function ChartPieLabelCustom() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Distribuição de Precisão</CardTitle>
        <CardDescription>Como você avaliou seus cards</CardDescription>
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
                  {payload.label} {/* <-- mostra Fácil, Difícil, etc */}
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
