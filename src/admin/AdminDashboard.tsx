import React from 'react';
import { 
  Package, 
  ShoppingCart, 
  FileText, 
  Box, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Product, Order, QuoteRequest, SampleRequest } from '../types';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  quotes: QuoteRequest[];
  samples: SampleRequest[];
  onNavigateTab: (tab: string) => void;
  onEditProduct: (product: Product) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  orders,
  quotes,
  samples,
  onNavigateTab,
  onEditProduct,
}) => {
  // Key Metrics
  const totalProducts = products.length;
  const publishedProducts = products.filter(p => p.status === 'published').length;
  const lowStockProducts = products.filter(p => p.stock <= 50);

  const totalWholesaleRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingQuotes = quotes.filter(q => q.status === 'Pending').length;
  const pendingOrders = orders.filter(o => o.orderStatus === 'Received' || o.orderStatus === 'In Preparation').length;
  const pendingSamples = samples.filter(s => s.status === 'Requested').length;

  return (
    <div className="space-y-8 text-stone-100">
      {/* Top Welcome */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400">
            Control Center • Texas Wholesale
          </span>
          <h2 className="text-2xl font-extrabold text-white mt-0.5">
            Panel de Control ARGO MOSAIC
          </h2>
          <p className="text-xs text-stone-400">
            Resumen en tiempo real del catálogo, órdenes mayoristas, cotizaciones de proyectos y muestras a obra.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('products-new')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition shadow-md"
          >
            + Nuevo Producto
          </button>
        </div>
      </div>

      {/* Hostinger Deployment Quick Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/70 via-stone-900 to-stone-900 border border-purple-800/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400 block">
            🚀 ¿Dónde publicar tu sitio en Hostinger?
          </span>
          <h3 className="text-base font-bold text-white">
            Tu paquete completo de producción (React + PHP + MySQL + PayPal) está listo
          </h3>
          <p className="text-xs text-stone-300">
            Descarga el archivo ZIP y súbelo a la carpeta <code className="text-purple-300 bg-purple-950/80 px-1 py-0.5 rounded">public_html</code> de tu hosting en Hostinger para activarlo en tu propio dominio.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('settings')}
          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-purple-950/50 shrink-0"
        >
          <span>Ir a Descargar ZIP Hostinger</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Products */}
        <div
          onClick={() => onNavigateTab('products')}
          className="p-5 rounded-2xl bg-stone-900 border border-stone-800 hover:border-blue-500/60 cursor-pointer transition shadow-lg space-y-3"
        >
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase font-mono">Modelos Activos</span>
            <div className="p-2 rounded-lg bg-blue-950/80 text-blue-400">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-white font-mono">{publishedProducts}</span>
            <span className="text-xs text-stone-400 ml-2">/ {totalProducts} en total</span>
          </div>
          <span className="text-[11px] text-blue-400 font-semibold block">
            Ver catálogo completo →
          </span>
        </div>

        {/* Wholesale Sales */}
        <div
          onClick={() => onNavigateTab('orders')}
          className="p-5 rounded-2xl bg-stone-900 border border-stone-800 hover:border-emerald-500/60 cursor-pointer transition shadow-lg space-y-3"
        >
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase font-mono">Ventas Mayoristas</span>
            <div className="p-2 rounded-lg bg-emerald-950/80 text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-white font-mono">
              ${totalWholesaleRevenue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </span>
            <span className="text-xs text-stone-400 ml-1.5 font-mono">USD</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold block">
            {orders.length} pedidos ({pendingOrders} en proceso) →
          </span>
        </div>

        {/* Commercial Quotes */}
        <div
          onClick={() => onNavigateTab('quotes')}
          className="p-5 rounded-2xl bg-stone-900 border border-stone-800 hover:border-amber-500/60 cursor-pointer transition shadow-lg space-y-3"
        >
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase font-mono">Cotizaciones</span>
            <div className="p-2 rounded-lg bg-amber-950/80 text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-white font-mono">{quotes.length}</span>
            <span className="text-xs text-amber-400 ml-2 font-semibold">({pendingQuotes} pendientes)</span>
          </div>
          <span className="text-[11px] text-amber-400 font-semibold block">
            Atender presupuestos de proyectos →
          </span>
        </div>

        {/* Sample Requests */}
        <div
          onClick={() => onNavigateTab('samples')}
          className="p-5 rounded-2xl bg-stone-900 border border-stone-800 hover:border-indigo-500/60 cursor-pointer transition shadow-lg space-y-3"
        >
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase font-mono">Muestras a Obra</span>
            <div className="p-2 rounded-lg bg-indigo-950/80 text-indigo-400">
              <Box className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-white font-mono">{samples.length}</span>
            <span className="text-xs text-indigo-400 ml-2 font-semibold">({pendingSamples} por enviar)</span>
          </div>
          <span className="text-[11px] text-indigo-400 font-semibold block">
            Ver solicitudes de muestras →
          </span>
        </div>
      </div>

      {/* Two Column Layout: Low Stock Warnings & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Warnings */}
        <div className="rounded-2xl bg-stone-900 border border-stone-800 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                Control de Inventario y Alertas
              </h3>
            </div>
            <span className="text-xs text-amber-400 font-bold font-mono">
              {lowStockProducts.length} productos con stock bajo
            </span>
          </div>

          {lowStockProducts.length === 0 ? (
            <p className="text-xs text-stone-400 py-6 text-center">
              Todos los productos tienen niveles adecuados de inventario en bodega Dallas.
            </p>
          ) : (
            <div className="divide-y divide-stone-800 text-xs">
              {lowStockProducts.slice(0, 5).map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img src={p.primaryImage} alt="" className="w-10 h-10 object-cover rounded bg-stone-950 shrink-0" />
                    <div>
                      <strong className="text-white block line-clamp-1">{p.nameEs || p.nameEn}</strong>
                      <span className="text-[11px] text-stone-500 font-mono">
                        {p.category} • SKU: {p.sku}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-amber-400 font-bold font-mono block">
                      {p.stock} cajas
                    </span>
                    <button
                      onClick={() => onEditProduct(p)}
                      className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold"
                    >
                      Ajustar Stock
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders Overview */}
        <div className="rounded-2xl bg-stone-900 border border-stone-800 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                Últimos Pedidos Registrados
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
            >
              Ver todos →
            </button>
          </div>

          {orders.length === 0 ? (
            <p className="text-xs text-stone-400 py-6 text-center">
              Aún no se han recibido órdenes comerciales.
            </p>
          ) : (
            <div className="divide-y divide-stone-800 text-xs">
              {orders.slice(0, 5).map((o) => (
                <div key={o.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <strong className="text-white block font-mono text-blue-400">{o.orderNumber}</strong>
                    <span className="text-[11px] text-stone-300">
                      {o.customer.firstName} {o.customer.lastName} ({o.customer.city})
                    </span>
                  </div>

                  <div className="text-right font-mono">
                    <strong className="text-white block font-bold">${o.total.toFixed(2)}</strong>
                    <span className={`text-[10px] uppercase font-bold ${o.paymentStatus === 'Approved' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {o.paymentStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
