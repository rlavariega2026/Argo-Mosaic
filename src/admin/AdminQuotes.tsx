import React from 'react';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import { QuoteRequest } from '../types';

interface AdminQuotesProps {
  quotes: QuoteRequest[];
  onUpdateStatus: (quoteId: string, status: string) => void;
}

export const AdminQuotes: React.FC<AdminQuotesProps> = ({ quotes, onUpdateStatus }) => {
  return (
    <div className="space-y-6 text-stone-100">
      <div>
        <h2 className="text-xl font-extrabold text-white">Solicitudes de Cotización Comercial</h2>
        <p className="text-xs text-stone-400">
          Proyectos, constructoras y contratistas que han solicitado presupuestos para obras.
        </p>
      </div>

      <div className="rounded-xl bg-stone-900 border border-stone-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300 divide-y divide-stone-800">
            <thead className="bg-stone-950 text-stone-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="p-3.5"># Folio</th>
                <th className="p-3.5">Fecha</th>
                <th className="p-3.5">Cliente / Empresa</th>
                <th className="p-3.5">Proyecto / Ciudad</th>
                <th className="p-3.5">Superficie / Producto</th>
                <th className="p-3.5">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800">
              {quotes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-stone-500">
                    No hay solicitudes de cotización registradas.
                  </td>
                </tr>
              ) : (
                quotes.map((q) => (
                  <tr key={q.id || q.quoteNumber} className="hover:bg-stone-800/40 transition">
                    <td className="p-3.5 font-mono font-bold text-blue-400">
                      {q.quoteNumber || q.id}
                    </td>

                    <td className="p-3.5 text-stone-400">
                      {q.createdAt ? new Date(q.createdAt).toLocaleDateString() : '—'}
                    </td>

                    <td className="p-3.5">
                      <strong className="text-white block font-sans">{q.customerName}</strong>
                      <span className="text-[11px] text-stone-500">{q.companyName || q.email}</span>
                      <span className="text-[11px] text-stone-500 block font-mono">{q.phone}</span>
                    </td>

                    <td className="p-3.5">
                      <span className="text-white font-medium block">{q.projectType}</span>
                      <span className="text-stone-400 text-[11px]">{q.deliveryCity}, {q.deliveryState}</span>
                    </td>

                    <td className="p-3.5 font-mono">
                      <span className="text-blue-300 font-bold block">{q.estimatedSqFt} sq ft</span>
                      <span className="text-stone-400 text-[11px]">
                        {q.productsRequested && q.productsRequested[0]?.productName}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <select
                        value={q.status || 'Pending'}
                        onChange={(e) => q.id && onUpdateStatus(q.id, e.target.value)}
                        className="bg-stone-950 border border-stone-800 rounded px-2.5 py-1 text-xs text-stone-200 font-semibold focus:outline-hidden"
                      >
                        <option value="Pending">Pending (Pendiente)</option>
                        <option value="In Review">In Review (En Revisión)</option>
                        <option value="Sent">Sent (Cotización Enviada)</option>
                        <option value="Accepted">Accepted (Aceptada)</option>
                        <option value="Declined">Declined (Rechazada)</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
