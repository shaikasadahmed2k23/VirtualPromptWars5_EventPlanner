import { useState, type ReactNode } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/format';
import type { CurrencyCode } from '@shared/domain';
import type { BudgetChartRow } from '../lib/budgetChartData';

/** Category colours, all theme tokens so charts follow the design system. */
const CHART_COLORS = [
  'var(--color-rose-ink)',
  'var(--color-lavender-ink)',
  'var(--color-gold-ink)',
  'var(--color-success)',
  'var(--color-rose-deep)',
  'var(--color-lavender)',
  'var(--color-gold)',
  'var(--color-muted)',
] as const;
const AXIS_TICK = { fontSize: 11 };
const X_AXIS_LABEL_ANGLE = -25;
const X_AXIS_HEIGHT = 65;
const BAR_RADIUS: [number, number, number, number] = [4, 4, 0, 0];

interface BudgetChartsProps {
  rows: readonly BudgetChartRow[];
  currency: CurrencyCode;
}

function BudgetTable({ rows, currency }: BudgetChartsProps) {
  return (
    <table className="w-full text-left text-sm">
      <caption className="sr-only">Budget chart data</caption>
      <thead className="text-muted">
        <tr>
          <th scope="col" className="pb-2 font-medium">
            Category
          </th>
          <th scope="col" className="pb-2 text-right font-medium">
            Estimated
          </th>
          <th scope="col" className="pb-2 text-right font-medium">
            Actual
          </th>
          <th scope="col" className="pb-2 text-right font-medium">
            Forecast
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.category} className="border-t border-line">
            <th scope="row" className="py-2 font-medium">
              {row.label}
            </th>
            <td className="py-2 text-right">{formatCurrency(row.estimated, currency)}</td>
            <td className="py-2 text-right">{formatCurrency(row.actual, currency)}</td>
            <td className="py-2 text-right">{formatCurrency(row.forecast, currency)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

interface ChartCardProps extends BudgetChartsProps {
  title: string;
  /** Text alternative announced for the chart image. */
  description: string;
  children: ReactNode;
}

/** Card with a chart and a "View as table" toggle for screen reader and keyboard users. */
function ChartCard({ title, description, rows, currency, children }: ChartCardProps) {
  const [showTable, setShowTable] = useState(false);
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <Button
          variant="link"
          size="sm"
          aria-pressed={showTable}
          onClick={() => {
            setShowTable((visible) => !visible);
          }}
        >
          {showTable ? 'View chart' : 'View as table'}
        </Button>
      </CardHeader>
      <CardContent>
        {showTable ? (
          <BudgetTable rows={rows} currency={currency} />
        ) : (
          <div className="h-72" role="img" aria-label={description}>
            <ResponsiveContainer width="100%" height="100%">
              {children}
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/** Budget visualisations (lazy-loaded with Recharts), each with an accessible table alternative. */
export function BudgetCharts({ rows, currency }: BudgetChartsProps) {
  const money = (value: unknown) => formatCurrency(Number(value ?? 0), currency);
  const donutRows = rows.map((row, index) => ({ ...row, fill: CHART_COLORS[index % CHART_COLORS.length] }));

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <ChartCard
        title="Forecast spend by category"
        description="Donut chart of forecast spend by category"
        rows={rows}
        currency={currency}
      >
        <PieChart>
          <Pie
            data={donutRows}
            dataKey="forecast"
            nameKey="label"
            innerRadius="55%"
            outerRadius="78%"
            paddingAngle={2}
          />
          <Tooltip formatter={money} />
          <Legend />
        </PieChart>
      </ChartCard>
      <ChartCard
        title="Estimated vs actual"
        description="Bar chart comparing estimated and actual spend by category"
        rows={rows}
        currency={currency}
      >
        <BarChart data={[...rows]} margin={{ bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" />
          <XAxis dataKey="label" angle={X_AXIS_LABEL_ANGLE} textAnchor="end" height={X_AXIS_HEIGHT} tick={AXIS_TICK} />
          <YAxis tickFormatter={(value: number) => formatCurrency(value, currency, true)} tick={AXIS_TICK} />
          <Tooltip formatter={money} />
          <Legend />
          <Bar dataKey="estimated" name="Estimated" fill="var(--color-blush)" radius={BAR_RADIUS} />
          <Bar dataKey="actual" name="Actual" fill="var(--color-rose-ink)" radius={BAR_RADIUS} />
        </BarChart>
      </ChartCard>
    </div>
  );
}
