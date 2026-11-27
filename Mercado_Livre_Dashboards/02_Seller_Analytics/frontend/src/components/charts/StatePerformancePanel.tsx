import React, { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { DollarSign, MapPin, Truck } from 'lucide-react';
import type { StateBreakdownItem } from '../../types/dashboard';
import {
  formatCompactCurrencyBRL,
  formatCurrencyBRL,
  formatDecimalBR,
  formatIntegerBR,
  formatPercentBR,
} from '../../utils/formatters';

interface StatePerformancePanelProps {
  states: StateBreakdownItem[];
  selectedState: string;
  onSelectState: (stateName: string) => void;
  isDark: boolean;
}

type StateViewMetric = 'revenue' | 'logistics';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: StateBreakdownItem }>;
}

const StateTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) return null;
  const st = payload[0].payload;

  return (
    <div className="min-w-[235px] rounded-xl border border-slate-200 bg-white/95 p-3 text-xs shadow-lg backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/95">
      <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 dark:border-slate-800">
        <span className="font-bold text-slate-900 dark:text-white">
          {st.state} ({st.state_code})
        </span>
        <span className="rounded bg-ml-blue-light px-1.5 py-0.5 font-mono text-[11px] font-bold text-ml-navy dark:bg-ml-blue/25 dark:text-blue-200">
          {formatPercentBR(st.share_pct)} of net settlement
        </span>
      </div>

      <div className="mt-2 space-y-1">
        <div className="flex justify-between gap-4">
          <span className="text-slate-600 dark:text-slate-400">
            Net settlement:
          </span>
          <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
            {formatCurrencyBRL(st.net_revenue)}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-600 dark:text-slate-400">
            Gross sales:
          </span>
          <span className="font-mono font-semibold text-slate-900 dark:text-white">
            {formatCurrencyBRL(st.gross_revenue)}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-600 dark:text-slate-400">
            Realized orders:
          </span>
          <span className="font-semibold text-slate-900 dark:text-white">
            {formatIntegerBR(st.orders)} ({formatIntegerBR(st.units)} units)
          </span>
        </div>
        <div className="my-1 border-t border-slate-100 pt-1 dark:border-slate-800">
          <div className="flex justify-between gap-4">
            <span className="text-slate-600 dark:text-slate-400">
              Average delivery time:
            </span>
            <span className="font-mono font-semibold text-sky-700 dark:text-sky-300">
              {formatDecimalBR(st.avg_delivery_days, 1)} days
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-600 dark:text-slate-400">
              Average dispatch time:
            </span>
            <span className="font-mono text-slate-700 dark:text-slate-300">
              {formatDecimalBR(st.avg_dispatch_days, 1)} days
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-600 dark:text-slate-400">
              Average shipping fee:
            </span>
            <span className="font-mono font-medium text-amber-700 dark:text-amber-400">
              {formatCurrencyBRL(st.avg_shipping_fee)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const StatePerformancePanel: React.FC<StatePerformancePanelProps> = ({
  states,
  selectedState,
  onSelectState,
  isDark,
}) => {
  const [metricView, setMetricView] = useState<StateViewMetric>('revenue');

  const axisColor = isDark ? '#94A3B8' : '#64748B';
  const gridColor = isDark ? '#1E293B' : '#F1F5F9';

  const topStates = states.slice(0, 10);

  const handleStateClick = (stateName: string) => {
    const isCurrentlySelected =
      selectedState.toLowerCase() === stateName.toLowerCase();
    onSelectState(isCurrentlySelected ? 'all' : stateName);
  };

  return (
    <article className="flex h-full w-full flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-surface-dark-card">
      <div className="flex flex-1 flex-col justify-between">
        {/* Header & Dual View Toggle */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <MapPin
                className="h-4 w-4 text-ml-blue shrink-0"
                aria-hidden="true"
              />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Sales and fulfillment by state
              </h3>
            </div>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Select a state to filter sales, delivery times and shipping costs.
            </p>
          </div>

          <div
            role="group"
            aria-label="State chart metric"
            className="inline-flex self-start rounded-lg border border-slate-200 bg-slate-100 p-0.5 dark:border-slate-700 dark:bg-slate-800"
          >
            <button
              type="button"
              onClick={() => setMetricView('revenue')}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                metricView === 'revenue'
                  ? 'bg-ml-blue text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              <DollarSign className="h-3.5 w-3.5" aria-hidden="true" />
              Net settlement
            </button>
            <button
              type="button"
              onClick={() => setMetricView('logistics')}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                metricView === 'logistics'
                  ? 'bg-ml-blue text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              <Truck className="h-3.5 w-3.5" aria-hidden="true" />
              Delivery time (days)
            </button>
          </div>
        </div>

        {/* Horizontal Bar Chart */}
        <div className="h-[210px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topStates}
              layout="vertical"
              margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                stroke={gridColor}
              />
              <XAxis
                type="number"
                tickFormatter={
                  metricView === 'revenue'
                    ? formatCompactCurrencyBRL
                    : (v) => `${v} d`
                }
                tick={{ fill: axisColor, fontSize: 10 }}
                tickLine={false}
                axisLine={{ stroke: gridColor }}
              />
              <YAxis
                type="category"
                dataKey="state_code"
                width={42}
                tick={{ fill: axisColor, fontSize: 11, fontWeight: 600 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<StateTooltip />} />
              <Bar
                dataKey={
                  metricView === 'revenue' ? 'net_revenue' : 'avg_delivery_days'
                }
                name={
                  metricView === 'revenue'
                    ? 'Net settlement'
                    : 'Average time (days)'
                }
                radius={[0, 4, 4, 0]}
                maxBarSize={20}
                className="cursor-pointer"
                onClick={(barData) => {
                  if (barData && barData.state) {
                    handleStateClick(String(barData.state));
                  }
                }}
              >
                {topStates.map((entry) => {
                  const isSelected =
                    selectedState.toLowerCase() === entry.state.toLowerCase() ||
                    selectedState.toLowerCase() ===
                      entry.state_code.toLowerCase();
                  const defaultFill =
                    metricView === 'revenue' ? '#3483FA' : '#0EA5E9';
                  return (
                    <Cell
                      key={entry.state}
                      fill={isSelected ? '#10B981' : defaultFill}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* State Breakdown Table */}
        <div className="mt-3 max-h-[215px] overflow-y-auto rounded-lg border border-slate-100 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-slate-50 text-[11px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <tr>
                <th className="px-3 py-2">State code</th>
                <th className="px-2 py-2 text-right">Orders</th>
                <th className="px-2 py-2 text-right">Average time</th>
                <th className="px-2 py-2 text-right">Average shipping</th>
                <th className="px-2 py-2 text-right">Revenue share</th>
                <th className="px-3 py-2 text-right">Settlement (BRL)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {states.map((st) => {
                const isSelected =
                  selectedState.toLowerCase() === st.state.toLowerCase() ||
                  selectedState.toLowerCase() === st.state_code.toLowerCase();

                return (
                  <tr
                    key={st.state}
                    onClick={() => handleStateClick(st.state)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-ml-blue-light/80 dark:bg-ml-blue/20'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex w-7 items-center justify-center rounded bg-ml-navy/10 px-1.5 py-0.5 font-mono text-[11px] font-bold text-ml-navy dark:bg-slate-800 dark:text-ml-yellow">
                          {st.state_code}
                        </span>
                        <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                          {st.state}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-2 text-right font-mono text-slate-700 dark:text-slate-300">
                      {formatIntegerBR(st.orders)}
                    </td>
                    <td className="px-2 py-2 text-right font-mono text-sky-700 dark:text-sky-300">
                      {st.orders > 0
                        ? `${formatDecimalBR(st.avg_delivery_days, 1)} d`
                        : '—'}
                    </td>
                    <td className="px-2 py-2 text-right font-mono text-amber-700 dark:text-amber-400">
                      {st.orders > 0
                        ? formatCurrencyBRL(st.avg_shipping_fee)
                        : '—'}
                    </td>
                    <td className="px-2 py-2 text-right font-mono text-slate-500 dark:text-slate-400">
                      {formatPercentBR(st.share_pct)}
                    </td>
                    <td className="px-3 py-2 text-right font-mono font-bold text-slate-900 dark:text-white">
                      {formatCurrencyBRL(st.net_revenue)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </article>
  );
};
