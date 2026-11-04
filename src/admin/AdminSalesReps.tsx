import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Phone, Mail, MessageCircle, UserPlus, Save, ArrowLeft, Upload } from 'lucide-react';
import { SalesRep } from '../types';
import { apiClient } from '../api/client';

interface AdminSalesRepsProps {
  salesReps: SalesRep[];
  onSaveRep: (rep: SalesRep) => void;
  onDeleteRep: (repId: string) => void;
}

export const AdminSalesReps: React.FC<AdminSalesRepsProps> = ({
  salesReps,
  onSaveRep,
  onDeleteRep,
}) => {
  const [editingRep, setEditingRep] = useState<SalesRep | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleStartNew = () => {
    setIsNew(true);
    setEditingRep({
      id: `rep-${Date.now()}`,
      name: '',
      title: 'Texas Commercial Sales Representative',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      phone: '+1 (214) 555-0199',
      whatsapp: '12145550199',
      email: 'sales@argomosaic.com',
      languages: 'English / Español',
      assignedCategories: ['LVP', 'Polished', 'Matte Series', 'Wooden'],
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRep) return;
    onSaveRep(editingRep);
    setEditingRep(null);
    setIsNew(false);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingRep) return;
    setUploading(true);
    try {
      const res = await apiClient.uploadFile(file);
      setEditingRep({ ...editingRep, photoUrl: res.fileUrl });
    } catch (err) {
      console.error('Failed to upload photo', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 text-stone-100">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white">Equipo y Asesores Comerciales</h2>
          <p className="text-xs text-stone-400">
            Administra los representantes comerciales que atienden a clientes y contratistas en Texas.
          </p>
        </div>

        {!editingRep && (
          <button
            onClick={handleStartNew}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-blue-900/40"
          >
            <UserPlus className="w-4 h-4" />
            <span>Registrar Vendedor</span>
          </button>
        )}
      </div>

      {/* Editor Modal or Inline Panel */}
      {editingRep ? (
        <form onSubmit={handleSave} className="p-6 bg-stone-900 border border-stone-800 rounded-2xl space-y-5 max-w-2xl shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <h3 className="text-base font-bold text-white">
              {isNew ? 'Registrar Nuevo Vendedor' : `Editar: ${editingRep.name}`}
            </h3>
            <button
              type="button"
              onClick={() => {
                setEditingRep(null);
                setIsNew(false);
              }}
              className="p-1.5 text-stone-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-stone-400 mb-1 font-semibold">Nombre Completo *</label>
              <input
                type="text"
                required
                value={editingRep.name}
                onChange={(e) => setEditingRep({ ...editingRep, name: e.target.value })}
                className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-stone-400 mb-1 font-semibold">Cargo / Título *</label>
              <input
                type="text"
                required
                value={editingRep.title}
                onChange={(e) => setEditingRep({ ...editingRep, title: e.target.value })}
                className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-stone-400 mb-1 font-semibold">Teléfono *</label>
              <input
                type="tel"
                required
                value={editingRep.phone}
                onChange={(e) => setEditingRep({ ...editingRep, phone: e.target.value })}
                className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-stone-400 mb-1 font-semibold">WhatsApp (Solo dígitos) *</label>
              <input
                type="text"
                required
                value={editingRep.whatsapp}
                onChange={(e) => setEditingRep({ ...editingRep, whatsapp: e.target.value })}
                placeholder="12145550199"
                className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-stone-400 mb-1 font-semibold">Correo Electrónico *</label>
              <input
                type="email"
                required
                value={editingRep.email}
                onChange={(e) => setEditingRep({ ...editingRep, email: e.target.value })}
                className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-stone-400 mb-1 font-semibold">Idioma(s) de Atención</label>
              <input
                type="text"
                value={editingRep.languages}
                onChange={(e) => setEditingRep({ ...editingRep, languages: e.target.value })}
                placeholder="English / Español"
                className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-stone-400 mb-1 font-semibold">Fotografía del Vendedor</label>
              <div className="flex items-center gap-3">
                <img src={editingRep.photoUrl} alt="" className="w-10 h-10 rounded-full object-cover border" />
                <label className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded text-xs cursor-pointer border border-stone-700">
                  <span>{uploading ? 'Subiendo...' : 'Subir Foto'}</span>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                setEditingRep(null);
                setIsNew(false);
              }}
              className="px-4 py-2 bg-stone-800 text-stone-300 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Vendedor</span>
            </button>
          </div>
        </form>
      ) : (
        /* Representatives Cards Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {salesReps.map((rep) => (
            <div
              key={rep.id}
              className="rounded-xl bg-stone-900 border border-stone-800 p-5 space-y-4 flex flex-col justify-between shadow-lg"
            >
              <div className="flex items-start gap-4">
                <img
                  src={rep.photoUrl}
                  alt={rep.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-blue-500 shrink-0"
                />
                <div>
                  <h4 className="text-base font-bold text-white">{rep.name}</h4>
                  <p className="text-xs text-blue-400 font-medium">{rep.title}</p>
                  <span className="text-[11px] text-stone-400 font-mono block mt-1">
                    {rep.languages}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-stone-300 font-mono border-t border-stone-800 pt-3">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-blue-400" />
                  <span>{rep.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>+{rep.whatsapp}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <span className="truncate">{rep.email}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-800 flex justify-end gap-2">
                <button
                  onClick={() => setEditingRep(rep)}
                  className="p-1.5 bg-stone-800 hover:bg-blue-600 hover:text-white text-stone-300 rounded transition"
                  title="Editar Vendedor"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`¿Eliminar al vendedor ${rep.name}?`)) {
                      onDeleteRep(rep.id);
                    }
                  }}
                  className="p-1.5 bg-stone-800 hover:bg-red-600 hover:text-white text-stone-400 rounded transition"
                  title="Eliminar Vendedor"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
