import { useState } from 'react';
import { Legend, Pie, PieChart, ResponsiveContainer, Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/format';
import type { CurrencyCode } from '@shared/domain';
import type { BudgetChartRow } from '../lib/budgetChartData';

const CHART_COLORS = [
  'var(--color-rose-ink)',
  'var(--color-lavender-ink)',
  'var(--color-gold-ink)',
  'var(--color-success)',
  'var(--color-rose-deep)',
  'var(--color-lavender)',
  'var(--color-gold)',
  'var(--color-muted)',
];

interface BudgetTableProps {
  rows: BudgetChartRow[];
  currency: CurrencyCode;
}

function BudgetTable({ rows, currency }: BudgetTableProps) {
  return (
    <table className="w-full text-left text-sm">
      <caption className="sr-only">Budget chart data</caption>
      <thead className="text-muted">
        <tr>
          <th className="pb-2 font-medium">Category</th>
          <th className="pb-2 text-right font-medium">Estimated</th>
          <th className="pb-2 text-right font-medium">Actual</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.category} className="border-t border-line">
            <th className="py-2 font-medium">{row.label}</th>
            <td className="py-2 text-right">{formatCurrency(row.estimated, currency)}</td>
            <td className="py-2 text-right">{formatCurrency(row.actual, currency)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ChartToggle({ showTable, onToggle }: { showTable: boolean; onToggle: () => void }) {
  return (
    <Button variant="link" size="sm" onClick={onToggle} aria-pressed={showTable}>
      {showTable ? 'View chart' : 'View as table'}
    </Button>
  );
}

/** Lazy-loaded budget visualisations with a table alternative for accessibility. */
export function BudgetCharts({ rows, currency }: BudgetTableProps) {
  const [donutTable, setDonutTable] = useState(false);
  const [barTable, setBarTable] = useState(false);

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Spend by category</CardTitle>
          <ChartToggle showTable={donutTable} onToggle={() => setDonutTable((visible) => !visible)} />
        </CardHeader>
        <CardContent>
          {donutTable ? (
            <BudgetTable rows={rows} currency={currency} />
          ) : (
            <div className="h-72" role="img" aria-label="Donut chart showing spend by category">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={rows.map((row, index) => ({ ...row, fill: CHART_COLORS[index % CHART_COLORS.length] }))}
                    dataKey="actual"
                    nameKey="label"
                    innerRadius="55%"
                    outerRadius="78%"
                    paddingAngle={2}
                  />
                  <Tooltip formatter={(value) => formatCurrency(Number(value ?? 0), currency)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Estimated vs actual</CardTitle>
          <ChartToggle showTable={barTable} onToggle={() => setBarTable((visible) => !visible)} />
        </CardHeader>
        <CardContent>
          {barTable ? (
            <BudgetTable rows={rows} currency={currency} />
          ) : (
            <div className="h-72" role="img" aria-label="Bar chart comparing estimated and actual spend">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rows} margin={{ bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" />
                  <XAxis dataKey="label" angle={-25} textAnchor="end" height={65} tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(value: number) => formatCurrency(value, currency, true)} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value ?? 0), currency)} />
                  <Legend />
                  <Bar dataKey="estimated" name="Estimated" fill="var(--color-blush)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="actual" name="Actual" fill="var(--color-rose-ink)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
