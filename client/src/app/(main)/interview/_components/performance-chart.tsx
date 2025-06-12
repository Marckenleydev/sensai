"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Assessment } from "@/lib/types";

interface PerformanceChartProps {
  assessments: Assessment[] | null;
}

interface ChartDataPoint {
  date: string;
  score: number;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: ChartDataPoint;
  }>;
}

export default function PerformanceChart({ assessments }: PerformanceChartProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  useEffect(() => {
    if (assessments?.length) {
      const formattedData: ChartDataPoint[] = assessments.map((assessment: Assessment) => ({
        date: format(new Date(assessment.createdAt), "MMM dd"),
        score: assessment.quizScore,
      }));
      setChartData(formattedData);
    } else {
      setChartData([]);
    }
  }, [assessments]);

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload?.length) {
      return (
        <div className="bg-background border rounded-lg p-2 shadow-md">
          <p className="text-sm font-medium">
            Score: {payload[0].value}%
          </p>
          <p className="text-xs text-muted-foreground">
            {payload[0].payload.date}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="gradient-title text-3xl md:text-4xl">
          Performance Trend
        </CardTitle>
        <CardDescription>Your quiz scores over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {!chartData.length ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No performance data available yet. Take a quiz to see your progress!
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  domain={[0, 100]} 
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                dataKey="score"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}