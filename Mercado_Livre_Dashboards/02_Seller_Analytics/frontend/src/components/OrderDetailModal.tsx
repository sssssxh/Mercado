import React, { useEffect } from 'react';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  MapPin,
  Megaphone,
  Package,
  Receipt,
  Scale,
  ShieldAlert,
  Truck,
  User,
  X,
} from 'lucide-react';
import type { OrderRecord } from '../types/dashboard';
import {
  formatCurrencyBRL,
  formatDateTimeBR,
  formatDaysBR,
  formatIntegerBR,
} from '../utils/formatters';
import { StatusBadge } from './StatusBadge';

interface OrderDetailModalProps {
  order: OrderRecord | null;
  onClose: () => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  onClose,
}) => {
  useEffect(() => {
    if (!order) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [order, onClose]);

  if (!order) return null;

  const netShipping = Number(
    (order.shipping_revenue + order.shipping_fee_deduction).toFixed(2),
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-order-title"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Strip */}
        <div className="h-1.5 w-full bg-ml-yellow" />

        {/* Modal Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/95">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Order no.
              </span>
              <h2
                id="modal-order-title"
                className="font-mono text-base font-bold text-slate-900 dark:text-white"
              >
                #{order.order_id}
              </h2>
              <StatusBadge status={order.status} size="sm" showFullLabel />
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Placed on {order.sale_date_br} • {order.status_description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close order details"
            className="rounded-lg border border-slate-200 p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="space-y-5 p-6">
          {/* Section 1: Financial Reconciliation */}
          <section className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Receipt className="h-4 w-4 text-ml-blue" aria-hidden="true" />
                Order settlement breakdown (BRL)
              </h3>
              <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                {order.units} {order.units === 1 ? 'unit' : 'units'} ×{' '}
                {formatCurrencyBRL(order.unit_price)}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">
                  (+) Product revenue (BRL):
                </span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">
                  +{formatCurrencyBRL(order.product_revenue)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">
                  (+) Shipping revenue (BRL):
                </span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">
                  +{formatCurrencyBRL(order.shipping_revenue)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">
                  (−) Selling fees and taxes:
                </span>
                <span className="font-mono font-semibold text-amber-700 dark:text-amber-400">
                  {formatCurrencyBRL(order.sale_fee_deduction)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">
                  (−) Shipping fees (net shipping:{' '}
                  {formatCurrencyBRL(netShipping)}):
                </span>
                <span className="font-mono font-semibold text-amber-700 dark:text-amber-400">
                  {formatCurrencyBRL(order.shipping_fee_deduction)}
                </span>
              </div>

              {order.cancellation_amount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-red-600 dark:text-red-400">
                    (−) Cancellations and refunds (BRL):
                  </span>
                  <span className="font-mono font-semibold text-red-600 dark:text-red-400">
                    {formatCurrencyBRL(order.cancellation_deduction)}
                  </span>
                </div>
              )}

              <div className="mt-2 flex items-center justify-between border-t border-slate-200 pt-2.5 text-sm font-bold dark:border-slate-700">
                <span className="text-slate-900 dark:text-white">
                  (=) Net settlement (BRL):
                </span>
                <span className="font-mono text-base text-emerald-700 dark:text-emerald-400">
                  {formatCurrencyBRL(order.net_revenue)}
                </span>
              </div>
            </div>
          </section>

          {/* Section 2: Product, SKU & Channel Info */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <h3 className="mb-2.5 flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Package className="h-4 w-4 text-ml-blue" aria-hidden="true" />
                Product, SKU and listing
              </h3>
              <dl className="space-y-1.5 text-xs">
                <div>
                  <dt className="text-[11px] text-slate-500 dark:text-slate-400">
                    Listing title
                  </dt>
                  <dd className="font-semibold text-slate-900 dark:text-white">
                    {order.listing_title}
                  </dd>
                </div>
                <div className="flex justify-between pt-1">
                  <dt className="text-slate-500 dark:text-slate-400">SKU:</dt>
                  <dd className="font-mono font-bold text-ml-blue dark:text-blue-400">
                    {order.sku}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500 dark:text-slate-400">
                    Listing ID:
                  </dt>
                  <dd className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                    {order.listing_id} ({order.listing_type})
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500 dark:text-slate-400">
                    Flavor (from SKU):
                  </dt>
                  <dd className="font-semibold text-slate-900 dark:text-white">
                    {order.flavor}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500 dark:text-slate-400">
                    Variant (CSV):
                  </dt>
                  <dd className="text-slate-700 dark:text-slate-300">
                    {order.variation}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500 dark:text-slate-400">
                    Sales channel:
                  </dt>
                  <dd className="inline-flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
                    <Megaphone className="h-3 w-3 text-ml-blue" aria-hidden="true" />
                    {order.is_ad_sale
                      ? 'Advertising (Mercado Ads)'
                      : 'Organic'}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Section 3: Customer, Geography & Logistics */}
            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <h3 className="mb-2.5 flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Truck className="h-4 w-4 text-ml-blue" aria-hidden="true" />
                Customer, destination and shipping
              </h3>
              <dl className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <dt className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                    <User className="h-3 w-3" aria-hidden="true" />
                    Customer ID:
                  </dt>
                  <dd className="font-mono font-semibold text-slate-900 dark:text-white">
                    {order.customer_id}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                    <MapPin className="h-3 w-3" aria-hidden="true" />
                    State:
                  </dt>
                  <dd className="font-semibold text-slate-900 dark:text-white">
                    {order.state} ({order.state_code}) — {order.country}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500 dark:text-slate-400">
                    Shipping method:
                  </dt>
                  <dd className="font-medium text-slate-800 dark:text-slate-200">
                    {order.delivery_method}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-1.5 dark:border-slate-800">
                  <dt className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                    <Calendar className="h-3 w-3" aria-hidden="true" />
                    Dispatched on:
                  </dt>
                  <dd className="font-mono text-slate-800 dark:text-slate-200">
                    {order.is_canceled
                      ? 'Not dispatched (canceled)'
                      : formatDateTimeBR(order.shipped_date)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                    <Calendar className="h-3 w-3" aria-hidden="true" />
                    Delivered on:
                  </dt>
                  <dd className="font-mono text-slate-800 dark:text-slate-200">
                    {order.is_canceled
                      ? 'Not delivered (canceled)'
                      : formatDateTimeBR(order.delivered_date)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500 dark:text-slate-400">
                    Lead time (dispatch / transit / total):
                  </dt>
                  <dd className="font-mono font-bold text-sky-700 dark:text-sky-300">
                    {order.is_canceled
                      ? 'Excluded (canceled)'
                      : `${formatDaysBR(order.dispatch_days)} / ${formatDaysBR(
                          order.transit_days,
                        )} / ${formatDaysBR(order.delivery_days)}`}
                  </dd>
                </div>
              </dl>
            </div>
          </section>

          {/* Section 4: Claims & Mediation */}
          <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs dark:border-slate-800 dark:bg-slate-800/30">
            <div className="flex items-center gap-2">
              {order.has_open_claim || order.in_mediation ? (
                <ShieldAlert
                  className="h-4 w-4 text-amber-600 dark:text-amber-400"
                  aria-hidden="true"
                />
              ) : order.has_closed_claim ? (
                <Scale
                  className="h-4 w-4 text-amber-600 dark:text-amber-400"
                  aria-hidden="true"
                />
              ) : (
                <CheckCircle2
                  className="h-4 w-4 text-emerald-600 dark:text-emerald-400"
                  aria-hidden="true"
                />
              )}
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Claims and mediation history:
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Open claim: {order.has_open_claim ? 'Yes' : 'No'}
              </span>
              <span className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Closed claim: {order.has_closed_claim ? 'Yes' : 'No'}
              </span>
              <span className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                In mediation: {order.in_mediation ? 'Yes' : 'No'}
              </span>
              <span className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Multi-item package:{' '}
                {order.is_bundle ? `Yes (${formatIntegerBR(order.units)})` : 'No'}
              </span>
            </div>
          </section>

          {order.is_canceled && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-200">
              <AlertCircle
                className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400"
                aria-hidden="true"
              />
              <span>
                <strong>Data note:</strong> Canceled orders have identical order, dispatch and delivery timestamps in the original CSV. Their{' '}
                <code className="font-mono">product revenue (BRL)</code>{' '}
                is reversed under{' '}
                <code className="font-mono">cancellations and refunds (BRL)</code>.
                This order is excluded from average delivery time and realized sales.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
