import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Copy, 
  Trash2, 
  Eye, 
  EyeOff, 
  Filter, 
  Sparkles, 
  Layers,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { Product, CategoryType } from '../types';

interface AdminProductsProps {
  products: Product[];
  onAddNew: () => void;
  onEdit: (product: Product) => void;
  onDuplicate: (product: Product) => void;
  onDelete: (productId: string) => void;
  onToggleStatus: (product: Product) => void;
  categoryFilter?: CategoryType | 'all';
}

export const AdminProducts: React.FC<AdminProductsProps> = ({
  products,
  onAddNew,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleStatus,
  categoryFilter = 'all',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>(categoryFilter);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const mTitle = (p.nameEn?.toLowerCase().includes(q)) || (p.nameEs?.toLowerCase().includes(q));
        const mModel = p.model?.toLowerCase().includes(q);
        const mSku = p.sku?.toLowerCase().includes(q);
        if (!mTitle && !mModel && !mSku) return false;
      }
      return true;
    });
  }, [products, selectedCategory, searchQuery]);

  const categories: (CategoryType | 'all')[] = ['all', 'LVP', 'Wooden', 'Matte Series', 'Polished'];

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white">Administrar Modelos y Colecciones</h2>
          <p className="text-xs text-stone-400">
            Agrega nuevos modelos, modifica sus datos o elimina los que ya no formen parte del catálogo.
          </p>
        </div>

        <button
          onClick={onAddNew}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-blue-900/40"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Nuevo Modelo</span>
        </button>
      </div>

      {/* Toolbar: Category pills & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-xl bg-stone-900 border border-stone-800">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                selectedCategory === c
                  ? 'bg-blue-600 border-blue-500 text-white shadow-xs'
                  : 'bg-stone-950 border-stone-800 text-stone-300 hover:bg-stone-800'
              }`}
            >
              {c === 'all' ? 'Todas las Categorías' : c}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
          <input
            type="text"
            placeholder="Buscar por modelo, SKU o nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-stone-950 border border-stone-800 rounded-lg text-xs text-white placeholder-stone-500 focus:outline-hidden focus:border-blue-500"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-xl bg-stone-900 border border-stone-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300 divide-y divide-stone-800">
            <thead className="bg-stone-950 text-stone-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="p-3.5">Producto</th>
                <th className="p-3.5">Categoría</th>
                <th className="p-3.5">Modelo / SKU</th>
                <th className="p-3.5">Dimensiones</th>
                <th className="p-3.5">Precio / Sq Ft</th>
                <th className="p-3.5">Precio / Caja</th>
                <th className="p-3.5">Existencia</th>
                <th className="p-3.5">Estado</th>
                <th className="p-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800">
              {filteredProducts.map((p) => {
                const isPublished = p.status === 'published';
                return (
                  <tr key={p.id} className="hover:bg-stone-800/40 transition">
                    <td className="p-3.5 flex items-center gap-3">
                      <img
                        src={p.primaryImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=100&q=80'}
                        alt=""
                        className="w-12 h-10 object-cover rounded bg-stone-950 border border-stone-800 shrink-0"
                      />
                      <div>
                        <strong className="text-white block font-sans text-xs line-clamp-1">
                          {p.nameEs || p.nameEn}
                        </strong>
                        <span className="text-[11px] text-stone-500 line-clamp-1">
                          {p.nameEn}
                        </span>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 font-bold border border-blue-900 font-mono text-[10px]">
                        {p.category}
                      </span>
                    </td>

                    <td className="p-3.5 font-mono text-[11px]">
                      <span className="text-stone-200 block">{p.model || 'N/A'}</span>
                      <span className="text-stone-500">{p.sku}</span>
                    </td>

                    <td className="p-3.5 font-mono text-stone-300">
                      {p.size || '—'}
                    </td>

                    <td className="p-3.5 font-mono font-bold text-white">
                      ${(p.pricePerSqFt || p.price).toFixed(2)}
                    </td>

                    <td className="p-3.5 font-mono text-stone-300">
                      ${(p.pricePerBox || 0).toFixed(2)}
                    </td>

                    <td className="p-3.5 font-mono">
                      <span className={p.stock <= 50 ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                        {p.stock} cajas
                      </span>
                    </td>

                    <td className="p-3.5">
                      <button
                        onClick={() => onToggleStatus(p)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border flex items-center gap-1 transition ${
                          isPublished
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-700/60'
                            : 'bg-stone-800 text-stone-400 border-stone-700'
                        }`}
                      >
                        {isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{isPublished ? 'Publicado' : 'Borrador'}</span>
                      </button>
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEdit(p)}
                          className="p-1.5 rounded-md bg-stone-800 hover:bg-blue-600 hover:text-white text-stone-300 transition"
                          title="Editar Modelo"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDuplicate(p)}
                          className="p-1.5 rounded-md bg-stone-800 hover:bg-stone-700 text-stone-300 transition"
                          title="Duplicar Modelo"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`¿Estás seguro de eliminar "${p.nameEs || p.nameEn}"? Esta acción no se puede deshacer.`)) {
                              onDelete(p.id);
                            }
                          }}
                          className="p-1.5 rounded-md bg-stone-800 hover:bg-red-600 hover:text-white text-stone-400 transition"
                          title="Eliminar Modelo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
