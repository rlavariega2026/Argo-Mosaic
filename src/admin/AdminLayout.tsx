import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  ShoppingCart, 
  FileText, 
  Box, 
  Users, 
  Settings, 
  CreditCard, 
  Globe, 
  LogOut, 
  ExternalLink, 
  Layers, 
  Menu, 
  X,
  ShieldCheck,
  Server,
  Lock,
  Download
} from 'lucide-react';
import { Product, Order, QuoteRequest, SampleRequest, SalesRep, CompanySettings, CategoryType } from '../types';
import { AdminDashboard } from './AdminDashboard';
import { AdminProducts } from './AdminProducts';
import { AdminProductForm } from './AdminProductForm';
import { AdminOrders } from './AdminOrders';
import { AdminQuotes } from './AdminQuotes';
import { AdminSamples } from './AdminSamples';
import { AdminSalesReps } from './AdminSalesReps';
import { AdminSettings } from './AdminSettings';
import { apiClient } from '../api/client';

interface AdminLayoutProps {
  products: Product[];
  orders: Order[];
  quotes: QuoteRequest[];
  samples: SampleRequest[];
  salesReps: SalesRep[];
  settings: CompanySettings;
  onExitAdmin: () => void;
  onRefreshData: () => void;
  onSaveProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onToggleProductStatus: (product: Product) => void;
  onUpdateOrderStatus: (orderId: string, status: any) => void;
  onUpdateQuoteStatus: (quoteId: string, status: string) => void;
  onUpdateSampleStatus: (sampleId: string, status: string) => void;
  onSaveSalesRep: (rep: SalesRep) => void;
  onDeleteSalesRep: (repId: string) => void;
  onSaveSettings: (settings: CompanySettings) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  products,
  orders,
  quotes,
  samples,
  salesReps,
  settings,
  onExitAdmin,
  onRefreshData,
  onSaveProduct,
  onDeleteProduct,
  onToggleProductStatus,
  onUpdateOrderStatus,
  onUpdateQuoteStatus,
  onUpdateSampleStatus,
  onSaveSalesRep,
  onDeleteSalesRep,
  onSaveSettings,
}) => {
  // Navigation State (Direct & Open Access - No password barrier required)
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Sidebar navigation menu items
  const menuItems: { id: string; label: string; icon: any; count?: number; categoryFilter?: CategoryType }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Todos los Modelos', icon: Package, count: products.length },
    { id: 'products-lvp', label: 'LVP', icon: Layers, categoryFilter: 'LVP' },
    { id: 'products-wooden', label: 'Wooden', icon: Layers, categoryFilter: 'Wooden' },
    { id: 'products-matte', label: 'Matte Series', icon: Layers, categoryFilter: 'Matte Series' },
    { id: 'products-polished', label: 'Polished', icon: Layers, categoryFilter: 'Polished' },
    { id: 'products-new', label: 'Agregar Producto', icon: PlusCircle },
    { id: 'orders', label: 'Pedidos / Orders', icon: ShoppingCart, count: orders.length },
    { id: 'quotes', label: 'Cotizaciones', icon: FileText, count: quotes.filter(q => q.status === 'Pending').length },
    { id: 'samples', label: 'Muestras Físicas', icon: Box, count: samples.filter(s => s.status === 'Requested').length },
    { id: 'sales-reps', label: 'Vendedores / Reps', icon: Users, count: salesReps.length },
    { id: 'settings', label: 'Configuración y Hostinger', icon: Settings },
  ];

  const handleDuplicateProduct = (p: Product) => {
    const duplicated: Product = {
      ...p,
      id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      nameEn: `${p.nameEn} (Copy)`,
      nameEs: `${p.nameEs} (Copia)`,
      sku: `${p.sku}-CPY`,
      status: 'draft',
      createdAt: new Date().toISOString(),
    };
    onSaveProduct(duplicated);
    alert(`Producto duplicado como borrador: "${duplicated.nameEs}"`);
  };

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col md:flex-row text-stone-100">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-stone-900 border-r border-stone-800 shrink-0">
        {/* Brand header */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={settings.logoUrl || '/assets/aistudio/Argo_Mosaic_Logo_Transparente_0aa6f2ad.png'}
              alt="ARGO MOSAIC"
              className="h-10 w-auto object-contain"
            />
            <div>
              <h1 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                ARGO MOSAIC
              </h1>
              <span className="text-[10px] text-stone-400 font-mono">Admin Portal</span>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'products-new') {
                    setEditingProduct(null);
                    setIsFormOpen(true);
                  } else {
                    setIsFormOpen(false);
                    setCurrentTab(item.id);
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition ${
                  isActive && !isFormOpen
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-stone-400 group-hover:text-white" />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white text-blue-700 font-bold' : 'bg-stone-800 text-stone-300'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer with return to site and logout */}
        <div className="p-4 border-t border-stone-800 space-y-2 text-xs">
          <button
            onClick={onExitAdmin}
            className="w-full py-2 px-3 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg flex items-center justify-center gap-2 transition"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
            <span>Ver Tienda Pública</span>
          </button>

          <button
            onClick={onExitAdmin}
            className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition shadow-md"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Volver a la Tienda</span>
          </button>
        </div>
      </aside>

      {/* Mobile Topbar */}
      <div className="md:hidden bg-stone-900 border-b border-stone-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={settings.logoUrl} alt="" className="h-8 w-auto object-contain" />
          <span className="text-xs font-bold text-white font-mono uppercase">ARGO MOSAIC ADMIN</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onExitAdmin} className="p-2 text-stone-400 hover:text-white text-xs">
            <ExternalLink className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded bg-stone-800 text-stone-200"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Dropdown */}
      {mobileSidebarOpen && (
        <div className="md:hidden bg-stone-900 border-b border-stone-800 p-4 space-y-1 text-xs">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'products-new') {
                  setEditingProduct(null);
                  setIsFormOpen(true);
                } else {
                  setIsFormOpen(false);
                  setCurrentTab(item.id);
                }
                setMobileSidebarOpen(false);
              }}
              className="w-full text-left p-2.5 rounded text-stone-200 hover:bg-stone-800 font-medium flex justify-between"
            >
              <span>{item.label}</span>
              {item.count !== undefined && <span className="font-mono text-stone-400">{item.count}</span>}
            </button>
          ))}
          <button
            onClick={onExitAdmin}
            className="w-full text-left p-2.5 rounded text-blue-400 hover:bg-stone-800 pt-3 border-t border-stone-800 font-bold"
          >
            ← Volver a la Tienda
          </button>
        </div>
      )}

      {/* Main Admin Working Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        {isFormOpen ? (
          <AdminProductForm
            initialProduct={editingProduct}
            onSave={(prod) => {
              onSaveProduct(prod);
              setIsFormOpen(false);
              setEditingProduct(null);
            }}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingProduct(null);
            }}
          />
        ) : currentTab === 'dashboard' ? (
          <AdminDashboard
            products={products}
            orders={orders}
            quotes={quotes}
            samples={samples}
            onNavigateTab={(tab) => {
              if (tab === 'products-new') {
                setEditingProduct(null);
                setIsFormOpen(true);
              } else {
                setCurrentTab(tab);
              }
            }}
            onEditProduct={(p) => {
              setEditingProduct(p);
              setIsFormOpen(true);
            }}
          />
        ) : currentTab.startsWith('products') ? (
          <AdminProducts
            products={products}
            onAddNew={() => {
              setEditingProduct(null);
              setIsFormOpen(true);
            }}
            onEdit={(p) => {
              setEditingProduct(p);
              setIsFormOpen(true);
            }}
            onDuplicate={handleDuplicateProduct}
            onDelete={onDeleteProduct}
            onToggleStatus={onToggleProductStatus}
            categoryFilter={
              currentTab === 'products-lvp' ? 'LVP'
              : currentTab === 'products-wooden' ? 'Wooden'
              : currentTab === 'products-matte' ? 'Matte Series'
              : currentTab === 'products-polished' ? 'Polished'
              : 'all'
            }
          />
        ) : currentTab === 'orders' ? (
          <AdminOrders
            orders={orders}
            onUpdateStatus={onUpdateOrderStatus}
          />
        ) : currentTab === 'quotes' ? (
          <AdminQuotes
            quotes={quotes}
            onUpdateStatus={onUpdateQuoteStatus}
          />
        ) : currentTab === 'samples' ? (
          <AdminSamples
            samples={samples}
            onUpdateStatus={onUpdateSampleStatus}
          />
        ) : currentTab === 'sales-reps' ? (
          <AdminSalesReps
            salesReps={salesReps}
            onSaveRep={onSaveSalesRep}
            onDeleteRep={onDeleteSalesRep}
          />
        ) : currentTab === 'settings' ? (
          <AdminSettings
            settings={settings}
            onSaveSettings={onSaveSettings}
          />
        ) : null}
      </main>
    </div>
  );
};
