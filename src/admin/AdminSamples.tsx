import React from 'react';
import { Box, CheckCircle2, Clock } from 'lucide-react';
import { SampleRequest } from '../types';

interface AdminSamplesProps {
  samples: SampleRequest[];
  onUpdateStatus: (sampleId: string, status: string) => void;
}

export const AdminSamples: React.FC<AdminSamplesProps> = ({ samples, onUpdateStatus }) => {
  return (
    <div className="space-y-6 text-stone-100">
      <div>
        <h2 className="text-xl font-extrabold text-white">Solicitudes de Muestras Físicas</h2>
        <p className="text-xs text-stone-400">
          Envíos de muestras de superficies solicitadas por arquitectos y contratistas para sus proyectos.
        </p>
      </div>

      <div className="rounded-xl bg-stone-900 border border-stone-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300 divide-y divide-stone-800">
            <thead className="bg-stone-950 text-stone-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="p-3.5"># Folio</th>
                <th className="p-3.5">Fecha</th>
                <th className="p-3.5">Producto Solicitado</th>
                <th className="p-3.5">Destinatario</th>
                <th className="p-3.5">Dirección de Envío</th>
                <th className="p-3.5">Estado de Despacho</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800">
              {samples.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-stone-500">
                    No hay solicitudes de muestras registradas.
                  </td>
                </tr>
              ) : (
                samples.map((s) => (
                  <tr key={s.id || s.sampleNumber} className="hover:bg-stone-800/40 transition">
                    <td className="p-3.5 font-mono font-bold text-blue-400">
                      {s.sampleNumber || s.id}
                    </td>

                    <td className="p-3.5 text-stone-400">
                      {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '—'}
                    </td>

                    <td className="p-3.5">
                      <strong className="text-white block font-sans">{s.productName}</strong>
                    </td>

                    <td className="p-3.5">
                      <strong className="text-white block">{s.fullName}</strong>
                      <span className="text-[11px] text-stone-400">{s.company || s.email}</span>
                      <span className="text-[11px] text-stone-500 block font-mono">{s.phone}</span>
                    </td>

                    <td className="p-3.5 text-stone-300">
                      <span className="block">{s.shippingAddress}</span>
                      <span className="text-stone-500">{s.city}, {s.state} {s.zipCode}</span>
                    </td>

                    <td className="p-3.5">
                      <select
                        value={s.status || 'Requested'}
                        onChange={(e) => s.id && onUpdateStatus(s.id, e.target.value)}
                        className="bg-stone-950 border border-stone-800 rounded px-2.5 py-1 text-xs text-stone-200 font-semibold focus:outline-hidden"
                      >
                        <option value="Requested">Requested (Solicitada)</option>
                        <option value="Dispatched">Dispatched (Enviada)</option>
                        <option value="Delivered">Delivered (Entregada)</option>
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
