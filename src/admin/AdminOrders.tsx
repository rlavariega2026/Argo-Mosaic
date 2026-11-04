import React, { useState } from 'react';
import { Download, Search, Eye, CheckCircle2, Clock, AlertCircle, Truck, Building } from 'lucide-react';
import { Order, OrderStatus, PaymentStatus } from '../types';

interface AdminOrdersProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, orderStatus: OrderStatus, paymentStatus?: PaymentStatus) => void;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({ orders, onUpdateStatus }) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = orders.filter((o) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      o.orderNumber.toLowerCase().includes(q) ||
      o.customer.firstName.toLowerCase().includes(q) ||
      o.customer.lastName.toLowerCase().includes(q) ||
      (o.customer.companyName && o.customer.companyName.toLowerCase().includes(q)) ||
      o.customer.email.toLowerCase().includes(q)
    );
  });

  const exportToCsv = () => {
    if (orders.length === 0) {
      alert('No hay pedidos para exportar.');
      return;
    }
    const headers = ['OrderNumber', 'Date', 'Customer', 'Company', 'Email', 'Phone', 'Fulfillment', 'Subtotal', 'Tax', 'Shipping', 'Total', 'PaymentStatus', 'OrderStatus'];
    const rows = orders.map(o => [
      o.orderNumber,
      o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '',
      `"${o.customer.firstName} ${o.customer.lastName}"`,
      `"${o.customer.companyName || ''}"`,
      o.customer.email,
      o.customer.phone,
      o.deliveryMethod,
      o.subtotal.toFixed(2),
      o.salesTax.toFixed(2),
      o.shippingCost.toFixed(2),
      o.total.toFixed(2),
      o.paymentStatus,
      o.orderStatus,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `argo-mosaic-orders-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statusColors: Record<OrderStatus, string> = {
    Received: 'bg-blue-950 text-blue-300 border-blue-800',
    'In Preparation': 'bg-amber-950 text-amber-300 border-amber-800',
    'Ready for Pickup': 'bg-indigo-950 text-indigo-300 border-indigo-800',
    Shipped: 'bg-purple-950 text-purple-300 border-purple-800',
    Delivered: 'bg-emerald-950 text-emerald-300 border-emerald-800',
    Cancelled: 'bg-red-950 text-red-300 border-red-800',
  };

  return (
    <div className="space-y-6 text-stone-100">
      {/* Header and CSV Export button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white">Gestión de Pedidos Comerciales</h2>
          <p className="text-xs text-stone-400">
            Consulta pedidos registrados, actualiza estados y exporta reportes para contabilidad y bodega.
          </p>
        </div>

        <button
          onClick={exportToCsv}
          className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
        >
          <Download className="w-4 h-4 text-blue-400" />
          <span>Exportar Pedidos a CSV</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
        <input
          type="text"
          placeholder="Buscar por # de orden, cliente, empresa o correo..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-xs text-white placeholder-stone-500 focus:outline-hidden focus:border-blue-500"
        />
      </div>

      {/* Orders Table */}
      <div className="rounded-xl bg-stone-900 border border-stone-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300 divide-y divide-stone-800">
            <thead className="bg-stone-950 text-stone-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="p-3.5"># Pedido</th>
                <th className="p-3.5">Fecha</th>
                <th className="p-3.5">Cliente / Empresa</th>
                <th className="p-3.5">Entrega</th>
                <th className="p-3.5">Total</th>
                <th className="p-3.5">Pago PayPal</th>
                <th className="p-3.5">Estado Pedido</th>
                <th className="p-3.5 text-right">Detalles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-stone-500">
                    No se han registrado pedidos todavía.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-800/40 transition">
                    <td className="p-3.5 font-mono font-bold text-blue-400">
                      {order.orderNumber}
                    </td>

                    <td className="p-3.5 text-stone-400">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—'}
                    </td>

                    <td className="p-3.5">
                      <strong className="text-white block font-sans">
                        {order.customer.firstName} {order.customer.lastName}
                      </strong>
                      <span className="text-[11px] text-stone-500">
                        {order.customer.companyName || order.customer.email}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        {order.deliveryMethod === 'warehouse_pickup' ? (
                          <>
                            <Building className="w-3.5 h-3.5 text-blue-400" />
                            <span>Bodega Dallas</span>
                          </>
                        ) : (
                          <>
                            <Truck className="w-3.5 h-3.5 text-purple-400" />
                            <span>Flete ({order.customer.city})</span>
                          </>
                        )}
                      </span>
                    </td>

                    <td className="p-3.5 font-mono font-bold text-white text-sm">
                      ${order.total.toFixed(2)}
                    </td>

                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                        order.paymentStatus === 'Approved' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderStatus, order.paymentStatus)}
                        className={`text-[11px] font-semibold rounded px-2 py-1 border focus:outline-hidden ${statusColors[order.orderStatus] || 'bg-stone-900 border-stone-800'}`}
                      >
                        <option value="Received">Received (Recibido)</option>
                        <option value="In Preparation">In Preparation (En Preparación)</option>
                        <option value="Ready for Pickup">Ready for Pickup (Listo p/ Bodega)</option>
                        <option value="Shipped">Shipped (En Tránsito / Flete)</option>
                        <option value="Delivered">Delivered (Entregado)</option>
                        <option value="Cancelled">Cancelled (Cancelado)</option>
                      </select>
                    </td>

                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 rounded-md bg-stone-800 hover:bg-stone-700 text-stone-300"
                        title="Ver Resumen de Orden"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div>
                <span className="text-[10px] font-mono uppercase text-blue-400 font-bold">Detalle de Pedido</span>
                <h3 className="text-lg font-bold text-white">{selectedOrder.orderNumber}</h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-stone-400 hover:text-white">✕</button>
            </div>

            {/* Customer & Delivery address */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-stone-950 p-4 rounded-xl border border-stone-800">
              <div>
                <strong className="text-stone-400 uppercase text-[10px] font-mono block mb-1">Cliente</strong>
                <p className="text-white font-bold">{selectedOrder.customer.firstName} {selectedOrder.customer.lastName}</p>
                <p className="text-stone-300">{selectedOrder.customer.companyName}</p>
                <p className="text-stone-400">{selectedOrder.customer.email}</p>
                <p className="text-stone-400">{selectedOrder.customer.phone}</p>
              </div>

              <div>
                <strong className="text-stone-400 uppercase text-[10px] font-mono block mb-1">Dirección de Entrega</strong>
                <p className="text-stone-300">{selectedOrder.customer.deliveryAddress}</p>
                <p className="text-stone-300">{selectedOrder.customer.city}, {selectedOrder.customer.state} {selectedOrder.customer.zipCode}</p>
                <p className="text-blue-400 mt-1 font-semibold">
                  Método: {selectedOrder.deliveryMethod === 'warehouse_pickup' ? 'Recogida en Bodega Dallas' : 'Envío de Carga'}
                </p>
              </div>
            </div>

            {/* Items table */}
            <div className="space-y-2">
              <strong className="text-xs font-mono uppercase text-stone-400">Productos en la Orden</strong>
              <div className="rounded-lg border border-stone-800 divide-y divide-stone-800 overflow-hidden text-xs">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="p-3 flex justify-between items-center hover:bg-stone-800/30">
                    <div>
                      <strong className="text-white block">{item.productName}</strong>
                      <span className="text-stone-500 font-mono text-[11px]">SKU: {item.sku}</span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-stone-300 block">
                        {item.quantity} {item.unitType === 'box' ? 'cajas' : 'sq ft'} × ${item.unitPrice.toFixed(2)}
                      </span>
                      <strong className="text-white">${item.total.toFixed(2)}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 font-mono text-xs space-y-1.5">
              <div className="flex justify-between text-stone-400">
                <span>Subtotal:</span>
                <span>${selectedOrder.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Flete / Envío:</span>
                <span>${selectedOrder.shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Impuesto Texas (8.25%):</span>
                <span>${selectedOrder.salesTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white font-extrabold text-sm pt-2 border-t border-stone-800">
                <span>Total:</span>
                <span className="text-blue-400">${selectedOrder.total.toFixed(2)} USD</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-bold transition"
            >
              Cerrar Detalle
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
