import React, { useState } from 'react';
import { 
  Save, 
  ArrowLeft, 
  Upload, 
  Trash2, 
  Plus, 
  Star, 
  Layers, 
  Box, 
  FileText, 
  Video, 
  MoveUp, 
  MoveDown,
  Sparkles,
  Check,
  AlertCircle
} from 'lucide-react';
import { Product, CategoryType, BadgeType, ProductStatus, GalleryItem, CustomSpec, Language } from '../types';
import { apiClient } from '../api/client';

interface AdminProductFormProps {
  initialProduct?: Product | null;
  onSave: (product: Product) => void;
  onCancel: () => void;
}

export const AdminProductForm: React.FC<AdminProductFormProps> = ({
  initialProduct,
  onSave,
  onCancel,
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'specs' | 'packaging' | 'gallery' | 'docs'>('general');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Form State initialized from initialProduct or blank
  const [product, setProduct] = useState<Product>(
    initialProduct || {
      id: `prod-${Date.now()}`,
      nameEn: '',
      nameEs: '',
      model: '',
      category: 'LVP',
      brand: 'ARGO MOSAIC',
      descriptionEn: '',
      descriptionEs: '',
      size: '',
      productType: '',
      availability: 'In Stock',
      price: 0,
      pricePerBox: 0,
      pricePerSqFt: 0,
      sku: '',
      badge: 'none',
      status: 'published',
      stock: 100,
      youtubeVideoUrl: '',
      gallery: [],
      galleryStyle: 'editorial',
      primaryImage: '',
      ambientImage: '',
      specs: {
        material: '',
        edgeType: '',
        finish: '',
        shadeVariation: '',
        randomFaces: '',
        peiRating: '',
        printingTechnology: '',
        frostResistant: '',
        waterResistant: '',
        waterAbsorption: '',
        wearResistance: '',
        slipResistance: '',
        residentialUse: '',
        commercialUse: '',
        indoorApplication: '',
        outdoorApplication: '',
        wallApplication: '',
        floorApplication: '',
        customSpecs: [],
      },
      packaging: {
        piecesPerBox: 0,
        sqFtPerBox: 0,
        weightLbsPerBox: 0,
        boxDimensions: '',
        piecesPerPallet: 0,
        sqFtPerPallet: 0,
        weightLbsPerPallet: 0,
        palletDimensions: '',
        customPackaging: [],
      },
      documents: {
        catalogPdfUrl: '',
        techSheetPdfUrl: '',
        installationGuideUrl: '',
        catalogWebLink: '',
        tour360Url: '',
      },
    }
  );

  // Handle Multi-file Upload via API
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadError('');

    try {
      const newItems: GalleryItem[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await apiClient.uploadFile(file);
        newItems.push({
          id: `img-${Date.now()}-${i}`,
          url: res.fileUrl,
          title: file.name.replace(/\.[^/.]+$/, ''),
          type: i === 0 && !product.primaryImage ? 'main' : 'ambient',
        });
      }

      setProduct((prev) => {
        const updatedGallery = [...(prev.gallery || []), ...newItems];
        return {
          ...prev,
          gallery: updatedGallery,
          primaryImage: prev.primaryImage || newItems[0]?.url || '',
        };
      });
    } catch (err: any) {
      console.error('Upload failed', err);
      setUploadError(err.message || 'Error al subir la imagen');
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  // Reorder gallery items
  const moveGalleryItem = (index: number, direction: 'up' | 'down') => {
    const current = [...(product.gallery || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= current.length) return;
    const temp = current[index];
    current[index] = current[targetIndex];
    current[targetIndex] = temp;
    setProduct({ ...product, gallery: current });
  };

  const removeGalleryItem = (id: string) => {
    const current = (product.gallery || []).filter((g) => g.id !== id);
    setProduct({
      ...product,
      gallery: current,
      primaryImage: product.primaryImage === id ? (current[0]?.url || '') : product.primaryImage,
    });
  };

  const setPrimaryImage = (url: string) => {
    setProduct({ ...product, primaryImage: url });
  };

  // Add custom specification
  const addCustomSpec = () => {
    const custom = [...(product.specs.customSpecs || []), { labelEn: '', labelEs: '', value: '' }];
    setProduct({
      ...product,
      specs: { ...product.specs, customSpecs: custom },
    });
  };

  const removeCustomSpec = (index: number) => {
    const custom = (product.specs.customSpecs || []).filter((_, i) => i !== index);
    setProduct({
      ...product,
      specs: { ...product.specs, customSpecs: custom },
    });
  };

  const updateCustomSpec = (index: number, field: keyof CustomSpec, val: string) => {
    const custom = [...(product.specs.customSpecs || [])];
    custom[index] = { ...custom[index], [field]: val };
    setProduct({
      ...product,
      specs: { ...product.specs, customSpecs: custom },
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product.nameEn && !product.nameEs) {
      alert('Por favor ingresa al menos el nombre del producto.');
      return;
    }
    // Set fallback primary image if empty
    let finalProduct = { ...product };
    if (!finalProduct.primaryImage && finalProduct.gallery?.length > 0) {
      finalProduct.primaryImage = finalProduct.gallery[0].url;
    }
    onSave(finalProduct);
  };

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-2xl text-stone-100">
      {/* Header bar */}
      <div className="p-5 border-b border-stone-800 bg-stone-950/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-base font-bold text-white">
              {initialProduct ? 'Editar Producto / Edit Surface' : 'Registrar Nuevo Producto / Add New Surface'}
            </h2>
            <span className="text-xs text-stone-400 font-mono">
              {product.category} • SKU: {product.sku || 'Pendiente'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs font-semibold transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-blue-900/30"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Producto</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex overflow-x-auto border-b border-stone-800 bg-stone-950 text-xs font-semibold scrollbar-none">
        {[
          { key: 'general', label: '1. Información General', icon: FileText },
          { key: 'specs', label: '2. Características Técnicas', icon: Sparkles },
          { key: 'packaging', label: '3. Empaque y Logística', icon: Box },
          { key: 'gallery', label: '4. Galería Fotográfica', icon: Layers },
          { key: 'docs', label: '5. Documentos y Video', icon: Video },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 transition whitespace-nowrap ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-400 bg-stone-900/70'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSave} className="p-6 space-y-6 text-xs">
        {/* TAB 1: GENERAL INFORMATION */}
        {activeTab === 'general' && (
          <div className="space-y-4 max-w-4xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-400 mb-1 font-semibold">
                  Nombre del Producto (Español) *
                </label>
                <input
                  type="text"
                  required
                  value={product.nameEs}
                  onChange={(e) => setProduct({ ...product, nameEs: e.target.value })}
                  placeholder="Porcelanato Pulido Texas Gold"
                  className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1 font-semibold">
                  Product Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={product.nameEn}
                  onChange={(e) => setProduct({ ...product, nameEn: e.target.value })}
                  placeholder="Texas Gold Polished Porcelain"
                  className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-white font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-stone-400 mb-1 font-semibold">
                  Categoría / Collection *
                </label>
                <select
                  value={product.category}
                  onChange={(e) => setProduct({ ...product, category: e.target.value as CategoryType })}
                  className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-white font-semibold"
                >
                  <option value="LVP">LVP</option>
                  <option value="Wooden">Wooden</option>
                  <option value="Matte Series">Matte Series</option>
                  <option value="Polished">Polished</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-400 mb-1 font-semibold">
                  Modelo / Model Number
                </label>
                <input
                  type="text"
                  value={product.model}
                  onChange={(e) => setProduct({ ...product, model: e.target.value })}
                  placeholder="AM-CTG-2448"
                  className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1 font-semibold">
                  SKU / Product Code *
                </label>
                <input
                  type="text"
                  required
                  value={product.sku}
                  onChange={(e) => setProduct({ ...product, sku: e.target.value })}
                  placeholder="POL-CTG-2448"
                  className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-stone-400 mb-1 font-semibold">
                  Dimensiones / Size
                </label>
                <input
                  type="text"
                  value={product.size}
                  onChange={(e) => setProduct({ ...product, size: e.target.value })}
                  placeholder='24" x 48"'
                  className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1 font-semibold">
                  Tipo de Producto / Product Type
                </label>
                <input
                  type="text"
                  value={product.productType}
                  onChange={(e) => setProduct({ ...product, productType: e.target.value })}
                  placeholder="Rectified Porcelain Tile"
                  className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1 font-semibold">
                  Marca / Brand
                </label>
                <input
                  type="text"
                  value={product.brand}
                  onChange={(e) => setProduct({ ...product, brand: e.target.value })}
                  className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-white"
                />
              </div>
            </div>

            {/* Pricing and Stock */}
            <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-3">
              <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider font-mono">
                Precios e Inventario
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-stone-400 mb-1">Precio por Sq Ft ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={product.pricePerSqFt}
                    onChange={(e) => setProduct({ ...product, pricePerSqFt: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-lg text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 mb-1">Precio por Caja ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={product.pricePerBox}
                    onChange={(e) => setProduct({ ...product, pricePerBox: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-lg text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 mb-1">Existencia (Cajas)</label>
                  <input
                    type="number"
                    min="0"
                    value={product.stock}
                    onChange={(e) => setProduct({ ...product, stock: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-lg text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 mb-1">Disponibilidad</label>
                  <select
                    value={product.availability}
                    onChange={(e) => setProduct({ ...product, availability: e.target.value })}
                    className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-lg text-white"
                  >
                    <option value="In Stock">In Stock (En Existencia)</option>
                    <option value="Low Stock">Low Stock (Últimas Cajas)</option>
                    <option value="Made to Order / Contact Us">Made to Order (Bajo Pedido)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Badges and Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-400 mb-1 font-semibold">
                  Etiqueta Comercial
                </label>
                <select
                  value={product.badge}
                  onChange={(e) => setProduct({ ...product, badge: e.target.value as BadgeType })}
                  className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-white"
                >
                  <option value="none">Sin Etiqueta (None)</option>
                  <option value="New Arrival">New Arrival (Novedad)</option>
                  <option value="Best Seller">Best Seller (Más Vendido)</option>
                  <option value="Featured">Featured (Destacado)</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-400 mb-1 font-semibold">
                  Estado de Publicación
                </label>
                <select
                  value={product.status}
                  onChange={(e) => setProduct({ ...product, status: e.target.value as ProductStatus })}
                  className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-white font-semibold"
                >
                  <option value="published">Publicado (Visible en Tienda)</option>
                  <option value="draft">Borrador (Solo visible en Admin)</option>
                  <option value="hidden">Oculto</option>
                </select>
              </div>
            </div>

            {/* Descriptions in EN and ES */}
            <div className="space-y-3">
              <div>
                <label className="block text-stone-400 mb-1 font-semibold">
                  Descripción Comercial en Español
                </label>
                <textarea
                  rows={3}
                  value={product.descriptionEs}
                  onChange={(e) => setProduct({ ...product, descriptionEs: e.target.value })}
                  placeholder="Superficie de porcelanato de gran formato con acabado pulido espejo..."
                  className="w-full p-3 bg-stone-950 border border-stone-800 rounded-lg text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1 font-semibold">
                  Commercial Description in English
                </label>
                <textarea
                  rows={3}
                  value={product.descriptionEn}
                  onChange={(e) => setProduct({ ...product, descriptionEn: e.target.value })}
                  placeholder="Ultra-refined architectural surface engineered for luxury interiors..."
                  className="w-full p-3 bg-stone-950 border border-stone-800 rounded-lg text-white resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TECHNICAL SPECIFICATIONS (Requirement 4) */}
        {activeTab === 'specs' && (
          <div className="space-y-4 max-w-4xl">
            <div className="p-3 bg-blue-950/30 border border-blue-900/50 rounded-lg text-stone-300 text-xs">
              <strong>Importante:</strong> Solo los campos con información capturada aparecerán en la publicación final del producto.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { key: 'material', label: 'Material / Material Type', placeholder: 'Glazed Porcelain / SPC Core' },
                { key: 'edgeType', label: 'Tipo de Borde / Edge Type', placeholder: 'Precision Rectified / Micro Bevel' },
                { key: 'finish', label: 'Acabado / Finish', placeholder: 'Mirror Polish / Matte Silk' },
                { key: 'shadeVariation', label: 'Variación de Color / Shade', placeholder: 'V2 - Slight / V3 - Moderate' },
                { key: 'randomFaces', label: 'Caras Aleatorias / Faces', placeholder: '8 Dynamic Faces' },
                { key: 'peiRating', label: 'Clasificación PEI', placeholder: 'PEI IV / PEI V' },
                { key: 'printingTechnology', label: 'Tecnología de Impresión', placeholder: 'High-Definition Digital Inkjet' },
                { key: 'frostResistant', label: 'Resistencia a Heladas', placeholder: 'Frost Proof ASTM C1026' },
                { key: 'waterResistant', label: 'Resistencia al Agua', placeholder: 'Impervious Porcelain / 100% Waterproof' },
                { key: 'waterAbsorption', label: 'Absorción de Agua', placeholder: '< 0.5% (Impervious)' },
                { key: 'wearResistance', label: 'Resistencia al Desgaste', placeholder: 'Class 4 Commercial' },
                { key: 'slipResistance', label: 'Antideslizante / Slip (DCOF)', placeholder: 'DCOF >= 0.42 / R10' },
                { key: 'residentialUse', label: 'Uso Residencial', placeholder: 'High Traffic Residential, Foyers' },
                { key: 'commercialUse', label: 'Uso Comercial', placeholder: 'Hotels, Offices, Retail' },
                { key: 'indoorApplication', label: 'Aplicación en Interiores', placeholder: 'Yes - Interior Floors & Walls' },
                { key: 'outdoorApplication', label: 'Aplicación en Exteriores', placeholder: 'Covered Porches / Direct Sun' },
                { key: 'wallApplication', label: 'Aplicación en Paredes', placeholder: 'Yes - Feature Walls, Bathrooms' },
                { key: 'floorApplication', label: 'Aplicación en Pisos', placeholder: 'Yes - Heavy Traffic Floors' },
              ].map((spec) => (
                <div key={spec.key}>
                  <label className="block text-stone-400 mb-1 font-semibold truncate" title={spec.label}>
                    {spec.label}
                  </label>
                  <input
                    type="text"
                    value={(product.specs as any)[spec.key] || ''}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        specs: { ...product.specs, [spec.key]: e.target.value },
                      })
                    }
                    placeholder={spec.placeholder}
                    className="w-full p-2 bg-stone-950 border border-stone-800 rounded-lg text-white"
                  />
                </div>
              ))}
            </div>

            {/* Custom Specifications section */}
            <div className="pt-4 border-t border-stone-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white uppercase font-mono">
                  Características Personalizadas Adicionales
                </h4>
                <button
                  type="button"
                  onClick={addCustomSpec}
                  className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-semibold flex items-center gap-1 border border-stone-700"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-400" />
                  <span>Agregar Característica</span>
                </button>
              </div>

              {product.specs.customSpecs?.map((cs, idx) => (
                <div key={idx} className="flex gap-2 items-center bg-stone-950 p-3 rounded-lg border border-stone-800">
                  <input
                    type="text"
                    placeholder="Etiqueta EN (e.g. Acoustic Rating)"
                    value={cs.labelEn}
                    onChange={(e) => updateCustomSpec(idx, 'labelEn', e.target.value)}
                    className="flex-1 p-2 bg-stone-900 border border-stone-800 rounded text-white"
                  />
                  <input
                    type="text"
                    placeholder="Etiqueta ES (e.g. Membrana Acústica)"
                    value={cs.labelEs}
                    onChange={(e) => updateCustomSpec(idx, 'labelEs', e.target.value)}
                    className="flex-1 p-2 bg-stone-900 border border-stone-800 rounded text-white"
                  />
                  <input
                    type="text"
                    placeholder="Valor (e.g. IIC 72 dB)"
                    value={cs.value}
                    onChange={(e) => updateCustomSpec(idx, 'value', e.target.value)}
                    className="flex-1 p-2 bg-stone-900 border border-stone-800 rounded text-white"
                  />
                  <button
                    type="button"
                    onClick={() => removeCustomSpec(idx)}
                    className="p-2 text-stone-500 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PACKAGING AND LOGISTICS (Requirement 5) */}
        {activeTab === 'packaging' && (
          <div className="space-y-6 max-w-4xl">
            <div className="p-3 bg-stone-950 border border-stone-800 rounded-lg text-stone-400 text-xs">
              Utiliza el sistema de medidas estadounidense: pulgadas (&quot;), pies cuadrados (sq ft) y libras (lbs).
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Box Information */}
              <div className="p-5 bg-stone-950 border border-stone-800 rounded-xl space-y-4">
                <span className="font-bold text-white font-mono uppercase text-sm block border-b border-stone-800 pb-2">
                  BOX INFORMATION (Por Caja)
                </span>

                <div>
                  <label className="block text-stone-400 mb-1">Pieces per Box (Piezas por caja)</label>
                  <input
                    type="number"
                    min="0"
                    value={product.packaging.piecesPerBox || ''}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        packaging: { ...product.packaging, piecesPerBox: parseInt(e.target.value) || 0 },
                      })
                    }
                    className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 mb-1">Sq Ft per Box (Pies cuadrados por caja)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={product.packaging.sqFtPerBox || ''}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        packaging: { ...product.packaging, sqFtPerBox: parseFloat(e.target.value) || 0 },
                      })
                    }
                    className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 mb-1">Weight lbs per Box (Peso en libras por caja)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={product.packaging.weightLbsPerBox || ''}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        packaging: { ...product.packaging, weightLbsPerBox: parseFloat(e.target.value) || 0 },
                      })
                    }
                    className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 mb-1">Box Dimensions (Dimensiones de caja en pulgadas)</label>
                  <input
                    type="text"
                    value={product.packaging.boxDimensions || ''}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        packaging: { ...product.packaging, boxDimensions: e.target.value },
                      })
                    }
                    placeholder='24.5" x 48.5" x 0.9"'
                    className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded text-white"
                  />
                </div>
              </div>

              {/* Pallet Information */}
              <div className="p-5 bg-stone-950 border border-stone-800 rounded-xl space-y-4">
                <span className="font-bold text-white font-mono uppercase text-sm block border-b border-stone-800 pb-2">
                  PALLET INFORMATION (Por Palet / Tarima)
                </span>

                <div>
                  <label className="block text-stone-400 mb-1">Boxes per Pallet (Cajas por pallet)</label>
                  <input
                    type="number"
                    min="0"
                    value={product.packaging.piecesPerPallet || ''}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        packaging: { ...product.packaging, piecesPerPallet: parseInt(e.target.value) || 0 },
                      })
                    }
                    className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 mb-1">Sq Ft per Pallet (Pies cuadrados por pallet)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={product.packaging.sqFtPerPallet || ''}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        packaging: { ...product.packaging, sqFtPerPallet: parseFloat(e.target.value) || 0 },
                      })
                    }
                    className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 mb-1">Weight lbs per Pallet (Peso en libras por pallet)</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={product.packaging.weightLbsPerPallet || ''}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        packaging: { ...product.packaging, weightLbsPerPallet: parseFloat(e.target.value) || 0 },
                      })
                    }
                    className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 mb-1">Pallet Dimensions (Dimensiones de pallet en pulgadas)</label>
                  <input
                    type="text"
                    value={product.packaging.palletDimensions || ''}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        packaging: { ...product.packaging, palletDimensions: e.target.value },
                      })
                    }
                    placeholder='42" x 50" x 36"'
                    className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PHOTO GALLERY (Requirement 6) */}
        {activeTab === 'gallery' && (
          <div className="space-y-6 max-w-4xl">
            {/* Gallery presentation selector */}
            <div className="p-4 bg-stone-950 border border-stone-800 rounded-xl space-y-2">
              <label className="block text-stone-300 font-bold uppercase tracking-wider font-mono">
                Estilo de Presentación de Galería
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { key: 'editorial', label: 'Editorial Gran Formato' },
                  { key: 'carousel', label: 'Carrusel Premium' },
                  { key: 'mosaic', label: 'Galería Mosaico' },
                  { key: 'fullscreen', label: 'Pantalla Completa' },
                  { key: 'thumbnails-side', label: 'Miniaturas Laterales' },
                ].map((st) => (
                  <button
                    key={st.key}
                    type="button"
                    onClick={() => setProduct({ ...product, galleryStyle: st.key as any })}
                    className={`p-2.5 rounded-lg border text-xs font-semibold transition text-left ${
                      product.galleryStyle === st.key
                        ? 'bg-blue-950 border-blue-500 text-blue-300'
                        : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-white'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* High-Resolution Image Uploader */}
            <div className="border-2 border-dashed border-stone-700 hover:border-blue-500 rounded-2xl p-8 text-center bg-stone-950 transition">
              <Upload className="w-10 h-10 text-blue-400 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-white mb-1">
                Subir Fotografías de Alta Calidad
              </h4>
              <p className="text-xs text-stone-400 mb-4 max-w-md mx-auto">
                Carga múltiples fotos de ambientes, detalles de textura, instalación y tomas arquitectónicas.
              </p>

              {uploadError && (
                <div className="mb-4 p-2 bg-red-950 text-red-300 rounded text-xs">
                  {uploadError}
                </div>
              )}

              <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold cursor-pointer transition shadow-md">
                <span>{uploading ? 'Subiendo archivos...' : 'Seleccionar Archivos'}</span>
                <input
                  type="file"
                  multiple
                  accept="image/*,application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Gallery Items List with Drag/Reorder and Primary Tag */}
            <div className="space-y-3">
              <h4 className="font-bold text-white font-mono uppercase text-xs">
                Fotografías Registradas ({product.gallery?.length || 0})
              </h4>

              {(!product.gallery || product.gallery.length === 0) ? (
                <p className="text-stone-500 text-xs py-4 text-center">
                  Aún no has agregado fotografías para este producto.
                </p>
              ) : (
                <div className="space-y-2">
                  {product.gallery.map((item, idx) => {
                    const isPrimary = product.primaryImage === item.url;
                    return (
                      <div
                        key={item.id || idx}
                        className={`p-3 bg-stone-950 rounded-xl border flex items-center gap-4 transition ${
                          isPrimary ? 'border-blue-500/80 bg-blue-950/20' : 'border-stone-800'
                        }`}
                      >
                        <img
                          src={item.url}
                          alt=""
                          className="w-16 h-14 object-cover rounded-md bg-stone-900 border border-stone-800 shrink-0"
                        />

                        <div className="flex-1 min-w-0 space-y-1">
                          <input
                            type="text"
                            value={item.title || ''}
                            onChange={(e) => {
                              const updated = [...(product.gallery || [])];
                              updated[idx].title = e.target.value;
                              setProduct({ ...product, gallery: updated });
                            }}
                            placeholder="Título de la fotografía (e.g. Ambiente Sala)"
                            className="w-full p-1.5 bg-stone-900 border border-stone-800 rounded text-white text-xs"
                          />
                          <div className="flex items-center gap-2 text-[10px]">
                            <select
                              value={item.type || 'ambient'}
                              onChange={(e) => {
                                const updated = [...(product.gallery || [])];
                                updated[idx].type = e.target.value as any;
                                setProduct({ ...product, gallery: updated });
                              }}
                              className="bg-stone-900 border border-stone-800 text-stone-300 rounded px-1.5 py-0.5"
                            >
                              <option value="main">Principal</option>
                              <option value="ambient">Ambiente</option>
                              <option value="detail">Detalle / Textura</option>
                              <option value="installation">Instalación</option>
                              <option value="application">Aplicación</option>
                            </select>

                            {isPrimary ? (
                              <span className="text-blue-400 font-bold flex items-center gap-1 font-mono">
                                <Check className="w-3 h-3" /> FOTO PRINCIPAL
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setPrimaryImage(item.url)}
                                className="text-stone-400 hover:text-white underline"
                              >
                                Establecer como principal
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Reorder Buttons */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveGalleryItem(idx, 'up')}
                            className="p-1.5 text-stone-400 hover:text-white disabled:opacity-30"
                          >
                            <MoveUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === (product.gallery?.length || 1) - 1}
                            onClick={() => moveGalleryItem(idx, 'down')}
                            className="p-1.5 text-stone-400 hover:text-white disabled:opacity-30"
                          >
                            <MoveDown className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeGalleryItem(item.id)}
                            className="p-1.5 text-stone-400 hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: DOCUMENTS AND VIDEO (Requirement 7) */}
        {activeTab === 'docs' && (
          <div className="space-y-4 max-w-4xl">
            <div className="p-4 bg-stone-950 border border-stone-800 rounded-xl space-y-4">
              <span className="font-bold text-white font-mono uppercase text-xs block border-b border-stone-800 pb-2">
                Enlaces y Recursos Multimedia (Opcionales)
              </span>

              <div>
                <label className="block text-stone-400 mb-1 font-semibold">
                  Enlace de Video de YouTube
                </label>
                <input
                  type="url"
                  value={product.youtubeVideoUrl || ''}
                  onChange={(e) => setProduct({ ...product, youtubeVideoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded text-white"
                />
                <span className="text-[11px] text-stone-500 mt-0.5 block">
                  Permite reproducir un video de alta calidad del producto directamente en la ficha técnica.
                </span>
              </div>

              <div>
                <label className="block text-stone-400 mb-1 font-semibold">
                  Enlace a Recorrido Virtual / Visualización 360°
                </label>
                <input
                  type="url"
                  value={product.documents?.tour360Url || ''}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      documents: { ...product.documents, tour360Url: e.target.value },
                    })
                  }
                  placeholder="https://matterport.com/discover/..."
                  className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1 font-semibold">
                  Enlace de Catálogo Digital Web
                </label>
                <input
                  type="url"
                  value={product.documents?.catalogWebLink || ''}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      documents: { ...product.documents, catalogWebLink: e.target.value },
                    })
                  }
                  placeholder="https://argomosaic.com/catalogs/..."
                  className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Bottom Save Bar */}
        <div className="pt-6 border-t border-stone-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg font-semibold transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition flex items-center gap-2 shadow-lg shadow-blue-900/40"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Producto</span>
          </button>
        </div>
      </form>
    </div>
  );
};
