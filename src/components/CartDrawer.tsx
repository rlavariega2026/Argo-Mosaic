import React, { useState } from 'react';
import { 
  X, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Truck, 
  Building, 
  CheckCircle2, 
  AlertCircle, 
  FileText,
  CreditCard,
  ShieldCheck,
  MapPin,
  MessageCircle,
  Mail,
  ExternalLink
} from 'lucide-react';
import { CartItem, Language, CustomerInfo, DeliveryMethod, Order, CompanySettings } from '../types';
import { translations } from '../i18n';
import { apiClient } from '../api/client';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  lang: Language;
  settings?: CompanySettings | null;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOpenQuote: () => void;
  onOrderPlaced: (order: Order) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  lang,
  settings,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOpenQuote,
  onOrderPlaced,
}) => {
  const t = translations[lang];

  // Steps: 1: Cart Items, 2: Delivery & Customer Info, 3: PayPal Payment & Review
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Customer Form
  const [customer, setCustomer] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    phone: '',
    deliveryAddress: '',
    city: 'Dallas',
    state: 'Texas',
    zipCode: '75201',
  });
  const [orderNotes, setOrderNotes] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('warehouse_pickup');

  // Order processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  // Pricing calculations
  const subtotal = cartItems.reduce((acc, item) => {
    return acc + (item.unitPrice * item.quantity);
  }, 0);

  const shippingCost = deliveryMethod === 'freight_delivery' ? 180.00 : 0.00;
  const salesTax = Number((subtotal * 0.0825).toFixed(2)); // Texas 8.25%
  const grandTotal = Number((subtotal + shippingCost + salesTax).toFixed(2));

  // Handle Order Submission & PayPal
  const handleProceedToPayment = async (paymentOption: 'paypal' | 'quote') => {
    setIsProcessing(true);
    setErrorMessage('');

    const orderPayload = {
      customer,
      items: cartItems.map(item => {
        const sqftPerBox = item.product.packaging?.sqFtPerBox || 16.0;
        return {
          productId: item.productId,
          productName: item.product.nameEn,
          sku: item.product.sku,
          category: item.product.category,
          quantity: item.quantity,
          unitType: item.unitType,
          unitPrice: item.unitPrice,
          totalPrice: item.unitPrice * item.quantity,
          sqFtCoverage: item.unitType === 'box' ? item.quantity * sqftPerBox : item.quantity,
        };
      }),
      deliveryMethod,
      shippingCost,
      subtotal,
      salesTax,
      total: grandTotal,
      notes: orderNotes,
      paymentMethod: paymentOption === 'paypal' ? 'paypal' as const : 'manual' as const,
      status: 'pending' as const,
    };

    try {
      const createdOrder = await apiClient.createOrder(orderPayload);

      if (paymentOption === 'paypal') {
        const paypalOrder = await apiClient.createPayPalOrder(createdOrder.id, grandTotal);
        if (paypalOrder && paypalOrder.id) {
          await apiClient.capturePayPalPayment(paypalOrder.id, createdOrder.id);
          createdOrder.paymentStatus = 'Approved';
        }
      }

      setCompletedOrder(createdOrder);
      onOrderPlaced(createdOrder);
      onClearCart();
    } catch (err: any) {
      console.error('Order creation error:', err);
      setErrorMessage(err.message || 'Error al procesar el pedido en el servidor');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="bg-white border-l border-slate-200 w-full max-w-xl h-full flex flex-col shadow-2xl text-slate-800">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                {t.cartTitle}
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                {cartItems.length} {lang === 'es' ? 'productos en orden' : 'items in order list'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEPPER BAR */}
        {!completedOrder && cartItems.length > 0 && (
          <div className="grid grid-cols-3 bg-white text-xs font-bold border-b border-slate-200 text-center">
            <button
              onClick={() => setStep(1)}
              className={`py-3 border-b-2 transition ${step === 1 ? 'border-blue-600 text-blue-700 bg-blue-50/60' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              1. {lang === 'es' ? 'Productos' : 'Items'}
            </button>
            <button
              onClick={() => cartItems.length > 0 && setStep(2)}
              className={`py-3 border-b-2 transition ${step === 2 ? 'border-blue-600 text-blue-700 bg-blue-50/60' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              2. {lang === 'es' ? 'Entrega' : 'Delivery'}
            </button>
            <button
              onClick={() => step >= 2 && setStep(3)}
              className={`py-3 border-b-2 transition ${step === 3 ? 'border-blue-600 text-blue-700 bg-blue-50/60' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              3. {lang === 'es' ? 'Pago PayPal' : 'Payment'}
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {completedOrder ? (
            /* Order Success View */
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-slate-900">{t.orderSuccessTitle}</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  {t.orderSuccessDesc}
                </p>
              </div>

              {/* Order Receipt Box */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 max-w-sm mx-auto text-left space-y-3 font-mono text-xs shadow-xs">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Order Number:</span>
                  <strong className="text-blue-700">{completedOrder.orderNumber}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Customer:</span>
                  <span className="text-slate-800 font-bold">{completedOrder.customer.firstName} {completedOrder.customer.lastName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Fulfillment:</span>
                  <span className="text-slate-800">
                    {completedOrder.deliveryMethod === 'warehouse_pickup' ? 'Dallas Warehouse Pickup' : 'Commercial Freight'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Payment Status:</span>
                  <span className={`font-bold ${completedOrder.paymentStatus === 'Approved' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {completedOrder.paymentStatus}
                  </span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-700 font-bold">Total Amount:</span>
                  <strong className="text-blue-700 text-sm font-extrabold">${completedOrder.total.toFixed(2)} USD</strong>
                </div>
              </div>

              {/* Action Routing Buttons (Editable Destinations from Admin) */}
              <div className="space-y-2.5 max-w-sm mx-auto pt-2">
                {/* WhatsApp Action */}
                {(!settings?.orderActionType || settings.orderActionType === 'whatsapp' || settings.orderActionType === 'both') && (() => {
                  const targetWa = (settings?.orderWhatsApp || settings?.whatsapp || '12147902840').replace(/[^0-9]/g, '');
                  const itemsList = completedOrder.items.map(it => `• ${it.productName} (${it.quantity} ${it.unitType}) - $${it.total.toFixed(2)}`).join('\n');
                  const waMsg = encodeURIComponent(
                    `*ARGO MOSAIC - PEDIDO CONFIRMADO*\n` +
                    `Orden #${completedOrder.orderNumber}\n` +
                    `Cliente: ${completedOrder.customer.firstName} ${completedOrder.customer.lastName}\n` +
                    `Empresa: ${completedOrder.customer.companyName || 'N/A'}\n` +
                    `Teléfono: ${completedOrder.customer.phone}\n` +
                    `Total: $${completedOrder.total.toFixed(2)} USD\n` +
                    `Estado de Pago: ${completedOrder.paymentStatus}\n` +
                    `Entrega: ${completedOrder.deliveryMethod === 'warehouse_pickup' ? 'Recolección en Bodega Dallas' : 'Flete Comercial'}\n` +
                    `Dirección: ${completedOrder.customer.deliveryAddress}, ${completedOrder.customer.city}, ${completedOrder.customer.state} ${completedOrder.customer.zipCode}\n\n` +
                    `Productos:\n${itemsList}`
                  );
                  return (
                    <a
                      href={`https://wa.me/${targetWa}?text=${waMsg}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-md shadow-emerald-600/20"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{lang === 'es' ? 'Enviar Detalles a WhatsApp de Bodega' : 'Send Order to WhatsApp Dispatch'}</span>
                    </a>
                  );
                })()}

                {/* Email Action */}
                {(!settings?.orderActionType || settings.orderActionType === 'email' || settings.orderActionType === 'both') && (() => {
                  const targetEmail = settings?.orderNotificationEmail || settings?.email || 'orders@argomosaic.com';
                  const emailSubj = encodeURIComponent(`Nuevo Pedido #${completedOrder.orderNumber} - ARGO MOSAIC`);
                  const itemsList = completedOrder.items.map(it => `- ${it.productName} (${it.quantity} ${it.unitType}) - $${it.total.toFixed(2)}`).join('\n');
                  const emailBody = encodeURIComponent(
                    `Nuevo pedido en ARGO MOSAIC:\n\n` +
                    `Folio: #${completedOrder.orderNumber}\n` +
                    `Cliente: ${completedOrder.customer.firstName} ${completedOrder.customer.lastName}\n` +
                    `Empresa: ${completedOrder.customer.companyName || 'N/A'}\n` +
                    `Teléfono: ${completedOrder.customer.phone}\n` +
                    `Correo del cliente: ${completedOrder.customer.email}\n` +
                    `Total: $${completedOrder.total.toFixed(2)} USD\n` +
                    `Estado Pago: ${completedOrder.paymentStatus}\n` +
                    `Método Entrega: ${completedOrder.deliveryMethod}\n` +
                    `Dirección: ${completedOrder.customer.deliveryAddress}, ${completedOrder.customer.city}, ${completedOrder.customer.state} ${completedOrder.customer.zipCode}\n\n` +
                    `Productos:\n${itemsList}`
                  );
                  return (
                    <a
                      href={`mailto:${targetEmail}?subject=${emailSubj}&body=${emailBody}`}
                      className="w-full py-2.5 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
                    >
                      <Mail className="w-3.5 h-3.5 text-blue-600" />
                      <span>{lang === 'es' ? 'Enviar Notificación a Correo de Pedidos' : 'Send Notification to Orders Email'}</span>
                    </a>
                  );
                })()}

                {/* Optional Custom Redirect Link */}
                {settings?.orderRedirectUrl && (
                  <a
                    href={settings.orderRedirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{lang === 'es' ? 'Abrir Enlace de Seguimiento Personalizado' : 'Open Custom Order Tracking Link'}</span>
                  </a>
                )}

                <button
                  onClick={() => {
                    setCompletedOrder(null);
                    setStep(1);
                    onClose();
                  }}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  {lang === 'es' ? 'Volver al Catálogo' : 'Back to Catalog'}
                </button>
              </div>
            </div>
          ) : cartItems.length === 0 ? (
            /* Empty Cart View */
            <div className="text-center py-20 space-y-4">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">{t.cartEmpty}</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                {lang === 'es'
                  ? 'Explora las colecciones de LVP, Madera, Series Mate y Pulidos para armar tu pedido.'
                  : 'Browse our LVP, Wooden, Matte and Polished collections to add items to your wholesale order.'}
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                {t.exploreCollections}
              </button>
            </div>
          ) : step === 1 ? (
            /* Step 1: Cart Items List */
            <div className="space-y-4">
              <div className="divide-y divide-slate-100">
                {cartItems.map((item) => {
                  const pTitle = lang === 'es' ? (item.product.nameEs || item.product.nameEn) : item.product.nameEn;
                  const itemTotal = item.unitPrice * item.quantity;
                  const sqftPerBox = item.product.packaging?.sqFtPerBox || 16.0;

                  return (
                    <div key={item.productId} className="py-4 flex gap-4 items-start">
                      <img
                        src={item.product.primaryImage}
                        alt=""
                        className="w-20 h-20 object-cover rounded-xl bg-slate-100 shrink-0 border border-slate-200 shadow-xs"
                      />

                      <div className="flex-1 space-y-1 text-xs">
                        <span className="text-[10px] text-blue-600 font-extrabold uppercase block">
                          {item.product.category}
                        </span>
                        <h4 className="font-extrabold text-slate-900 line-clamp-1">{pTitle}</h4>
                        <div className="text-[11px] text-slate-500 font-mono">
                          MOD: {item.product.model} | SKU: {item.product.sku}
                        </div>
                        <div className="text-slate-700 font-medium">
                          ${item.unitPrice.toFixed(2)} / {item.unitType === 'box' ? 'box' : 'sq ft'}
                          {item.unitType === 'box' && (
                            <span className="text-blue-600 font-semibold ml-1">({sqftPerBox * item.quantity} sq ft)</span>
                          )}
                        </div>

                        {/* Quantity Stepper */}
                        <div className="pt-2 flex items-center justify-between">
                          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg">
                            <button
                              onClick={() => onUpdateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                              className="px-2.5 py-1 text-slate-600 hover:text-slate-900 font-bold"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2.5 py-1 text-xs font-bold text-slate-900">
                              {item.quantity} {item.unitType === 'box' ? t.boxes : t.sqFt}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                              className="px-2.5 py-1 text-slate-600 hover:text-slate-900 font-bold"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="font-extrabold text-blue-600 text-sm">
                              ${itemTotal.toFixed(2)}
                            </span>
                            <button
                              onClick={() => onRemoveItem(item.productId)}
                              className="text-slate-400 hover:text-red-500 transition p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : step === 2 ? (
            /* Step 2: Delivery & Customer Info */
            <div className="space-y-4 text-xs">
              {/* Delivery Method Selector */}
              <div className="space-y-2">
                <label className="block text-slate-700 font-bold uppercase tracking-wider">
                  {t.deliveryMethod}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setDeliveryMethod('warehouse_pickup')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${
                      deliveryMethod === 'warehouse_pickup'
                        ? 'bg-blue-50 border-blue-600 text-blue-900'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Building className="w-4 h-4 text-blue-600" />
                      <strong className="text-slate-900 text-xs font-extrabold">{t.warehousePickup}</strong>
                    </div>
                    <p className="text-[11px] text-slate-500">{t.freePickup}</p>
                    <span className="text-emerald-600 font-extrabold mt-2">$0.00</span>
                  </div>

                  <div
                    onClick={() => setDeliveryMethod('freight_delivery')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${
                      deliveryMethod === 'freight_delivery'
                        ? 'bg-blue-50 border-blue-600 text-blue-900'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Truck className="w-4 h-4 text-blue-600" />
                      <strong className="text-slate-900 text-xs font-extrabold">{t.shippingFreight}</strong>
                    </div>
                    <p className="text-[11px] text-slate-500">{t.calculatedFreight}</p>
                    <span className="text-blue-700 font-extrabold mt-2">$180.00</span>
                  </div>
                </div>
              </div>

              {/* Customer Information Form */}
              <div className="pt-2 space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  {t.billingDetails}
                </h4>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 mb-1 font-bold">{t.firstName} *</label>
                    <input
                      type="text"
                      required
                      value={customer.firstName}
                      onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })}
                      placeholder="John"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-bold">{t.lastName} *</label>
                    <input
                      type="text"
                      required
                      value={customer.lastName}
                      onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })}
                      placeholder="Doe"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-bold">{t.companyName}</label>
                  <input
                    type="text"
                    value={customer.companyName}
                    onChange={(e) => setCustomer({ ...customer, companyName: e.target.value })}
                    placeholder="Texas Luxury Homes LLC"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 mb-1 font-bold">{t.email} *</label>
                    <input
                      type="email"
                      required
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      placeholder="john@builders.com"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-bold">{t.phone} *</label>
                    <input
                      type="tel"
                      required
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      placeholder="+1 (214) 555-0100"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-bold">{t.deliveryAddress} *</label>
                  <input
                    type="text"
                    required
                    value={customer.deliveryAddress}
                    onChange={(e) => setCustomer({ ...customer, deliveryAddress: e.target.value })}
                    placeholder="4521 Elm St, Suite 100"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-slate-600 mb-1 font-bold">{t.city} *</label>
                    <input
                      type="text"
                      required
                      value={customer.city}
                      onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-bold">{t.state} *</label>
                    <input
                      type="text"
                      required
                      value={customer.state}
                      onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-bold">{t.zipCode} *</label>
                    <input
                      type="text"
                      required
                      value={customer.zipCode}
                      onChange={(e) => setCustomer({ ...customer, zipCode: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-bold">{t.orderNotes}</label>
                  <textarea
                    rows={2}
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder={lang === 'es' ? 'Instrucciones para la descarga de paletas...' : 'Forklift required on jobsite, gate code, etc.'}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium resize-none focus:bg-white focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Step 3: PayPal Payment & Review */
            <div className="space-y-5 text-xs">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">
                  {t.orderSummary}
                </h4>

                <div className="flex justify-between text-slate-600 font-medium">
                  <span>{t.subtotal}:</span>
                  <span className="text-slate-900 font-bold">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-slate-600 font-medium">
                  <span>{deliveryMethod === 'warehouse_pickup' ? t.warehousePickup : t.shippingFreight}:</span>
                  <span className="text-slate-900 font-bold">${shippingCost.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-slate-600 font-medium">
                  <span>{t.salesTax}:</span>
                  <span className="text-slate-900 font-bold">${salesTax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>{t.grandTotal}:</span>
                  <span className="text-blue-600 font-extrabold">${grandTotal.toFixed(2)} USD</span>
                </div>
              </div>

              {/* PayPal Official Checkout Section */}
              <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="px-3.5 py-1 rounded bg-[#003087] text-white font-extrabold text-sm italic font-sans shadow-xs">
                    PayPal
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">PayPal Commercial Checkout</h4>
                    <span className="text-[11px] text-slate-500">Secured Server Verification • Sandbox & Live</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {lang === 'es'
                    ? 'El pago se procesará de forma segura a través de los servidores de PayPal con protección al comprador.'
                    : 'Your payment will be securely processed through PayPal servers with verified wholesale tracking.'}
                </p>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  onClick={() => handleProceedToPayment('paypal')}
                  disabled={isProcessing}
                  className="w-full py-4 bg-[#ffc439] hover:bg-[#f4bb34] text-slate-950 font-extrabold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>{lang === 'es' ? 'Validando con PayPal...' : 'Connecting with PayPal...'}</span>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>{t.checkoutWithPaypal} (${grandTotal.toFixed(2)} USD)</span>
                    </>
                  )}
                </button>

                <div className="pt-2 text-center">
                  <button
                    onClick={() => handleProceedToPayment('quote')}
                    disabled={isProcessing}
                    className="text-xs text-blue-600 hover:text-blue-800 underline font-bold"
                  >
                    {t.orRequestQuoteInstead}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Bottom Controls */}
        {!completedOrder && cartItems.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-white space-y-3">
            <div className="flex justify-between items-baseline text-xs font-medium">
              <span className="text-slate-500">{t.subtotal}:</span>
              <span className="text-lg font-extrabold text-blue-600">${subtotal.toFixed(2)} USD</span>
            </div>

            {step === 1 && (
              <button
                onClick={() => setStep(2)}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
              >
                <span>{lang === 'es' ? 'Continuar a Datos de Entrega' : 'Continue to Delivery Info'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 2 && (
              <div className="flex gap-2">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                >
                  {lang === 'es' ? 'Atrás' : 'Back'}
                </button>
                <button
                  onClick={() => {
                    if (!customer.firstName || !customer.email || !customer.deliveryAddress) {
                      alert(lang === 'es' ? 'Por favor completa tu nombre, correo y dirección de entrega.' : 'Please enter your name, email, and delivery address.');
                      return;
                    }
                    setStep(3);
                  }}
                  className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
                >
                  <span>{lang === 'es' ? 'Revisar Pedido y Pagar' : 'Review & Pay'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
