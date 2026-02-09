import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, Truck, ClipboardCheck, Check, ArrowLeft, ArrowRight, ShoppingBag, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ordersApi } from '@/utils/api';
import { formatCurrency } from '@/utils/formatCurrency';
import { isRequired, isValidEmail, isValidPhone, isValidZip } from '@/utils/validators';

type Step = 'shipping' | 'payment' | 'review';

const STEPS: { key: Step; label: string; icon: typeof Truck }[] = [
  { key: 'shipping', label: 'Shipping', icon: Truck },
  { key: 'payment', label: 'Payment', icon: CreditCard },
  { key: 'review', label: 'Review', icon: ClipboardCheck },
];

function InputField({ label, name, value, onChange, type = 'text', placeholder = '', error }: {
  label: string; name: string; value: string; onChange: (val: string) => void; type?: string; placeholder?: string; error?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-200'
        }`}
        aria-label={label}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, total, discount, subtotal, promoCode, promoApplied, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [step, setStep] = useState<Step>('shipping');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [shipping, setShipping] = useState({
    firstName: '', lastName: '', email: '', phone: '', address: '', city: '', state: '', zipCode: '',
  });
  const [payment, setPayment] = useState({
    cardNumber: '', cardName: '', expiry: '', cvv: '',
  });

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Nothing to Checkout</h1>
        <p className="text-gray-500 mb-6">Add some products to your cart first.</p>
        <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors">
          Browse Products
        </Link>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-500 mb-2">Order #{orderId.slice(0, 8).toUpperCase()}</p>
        <p className="text-gray-500 mb-8">Thank you for your purchase. You will receive a confirmation email shortly.</p>
        <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors">
          Return Home
        </Link>
      </div>
    );
  }

  const validateShipping = (): boolean => {
    const e: Record<string, string> = {};
    const req = (field: string, label: string) => {
      const r = isRequired((shipping as Record<string, string>)[field], label);
      if (!r.valid) e[field] = r.message;
    };
    req('firstName', 'First name');
    req('lastName', 'Last name');
    if (!isValidEmail(shipping.email)) e.email = 'Valid email is required.';
    if (!isValidPhone(shipping.phone)) e.phone = 'Valid phone number is required.';
    req('address', 'Address');
    req('city', 'City');
    req('state', 'State');
    if (!isValidZip(shipping.zipCode)) e.zipCode = 'Valid zip code is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePayment = (): boolean => {
    const e: Record<string, string> = {};
    if (payment.cardNumber.replace(/\s/g, '').length < 16) e.cardNumber = 'Enter a valid 16-digit card number.';
    if (!payment.cardName.trim()) e.cardName = 'Name on card is required.';
    if (!/^\d{2}\/\d{2}$/.test(payment.expiry)) e.expiry = 'Use MM/YY format.';
    if (!/^\d{3,4}$/.test(payment.cvv)) e.cvv = 'Enter a valid CVV.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 'shipping' && validateShipping()) setStep('payment');
    else if (step === 'payment' && validatePayment()) setStep('review');
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      setErrors({ general: 'Please sign in to place an order.' });
      return;
    }

    setPlacingOrder(true);
    try {
      const order = await ordersApi.create({
        items: items.map(i => ({ productId: i.product.id, quantity: i.quantity })),
        shippingAddress: shipping,
        promoCode: promoApplied ? promoCode : undefined,
      });
      setOrderId(order.id);
      setOrderPlaced(true);
      clearCart();
    } catch (err: any) {
      setErrors({ general: err.message || 'Failed to place order. Please try again.' });
    } finally {
      setPlacingOrder(false);
    }
  };

  const currentIndex = STEPS.findIndex(s => s.key === step);

  const shippingCost = subtotal >= 49 ? 0 : 5.99;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      {/* Step Indicator */}
      <div className="flex items-center justify-center mb-10">
        {STEPS.map((s, i) => (
          <div key={s.key} className="flex items-center">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              i <= currentIndex ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'
            }`}>
              <s.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-12 h-0.5 mx-2 ${i < currentIndex ? 'bg-indigo-600' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {errors.general && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl p-3 mb-6">
          {errors.general}
        </div>
      )}

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          {/* Shipping */}
          {step === 'shipping' && (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Shipping Information</h2>
              {!isAuthenticated && (
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-5 text-sm text-indigo-700">
                  <Link to="/login" className="font-medium underline">Sign in</Link> for a faster checkout experience.
                </div>
              )}
              <div className="grid sm:grid-cols-2 gap-4">
                <InputField label="First Name" name="firstName" value={shipping.firstName} onChange={v => setShipping({ ...shipping, firstName: v })} error={errors.firstName} />
                <InputField label="Last Name" name="lastName" value={shipping.lastName} onChange={v => setShipping({ ...shipping, lastName: v })} error={errors.lastName} />
                <InputField label="Email" name="email" type="email" value={shipping.email} onChange={v => setShipping({ ...shipping, email: v })} error={errors.email} />
                <InputField label="Phone" name="phone" type="tel" value={shipping.phone} onChange={v => setShipping({ ...shipping, phone: v })} placeholder="(555) 555-5555" error={errors.phone} />
                <div className="sm:col-span-2">
                  <InputField label="Address" name="address" value={shipping.address} onChange={v => setShipping({ ...shipping, address: v })} error={errors.address} />
                </div>
                <InputField label="City" name="city" value={shipping.city} onChange={v => setShipping({ ...shipping, city: v })} error={errors.city} />
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="State" name="state" value={shipping.state} onChange={v => setShipping({ ...shipping, state: v })} error={errors.state} />
                  <InputField label="Zip Code" name="zipCode" value={shipping.zipCode} onChange={v => setShipping({ ...shipping, zipCode: v })} placeholder="73301" error={errors.zipCode} />
                </div>
              </div>
            </div>
          )}

          {/* Payment */}
          {step === 'payment' && (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Payment Information</h2>
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-5 text-sm text-amber-700">
                Payment processing is being set up. Your order will be recorded securely.
              </div>
              <div className="space-y-4">
                <InputField label="Card Number" name="cardNumber" value={payment.cardNumber} onChange={v => setPayment({ ...payment, cardNumber: v })} placeholder="4242 4242 4242 4242" error={errors.cardNumber} />
                <InputField label="Name on Card" name="cardName" value={payment.cardName} onChange={v => setPayment({ ...payment, cardName: v })} error={errors.cardName} />
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Expiry Date" name="expiry" value={payment.expiry} onChange={v => setPayment({ ...payment, expiry: v })} placeholder="MM/YY" error={errors.expiry} />
                  <InputField label="CVV" name="cvv" value={payment.cvv} onChange={v => setPayment({ ...payment, cvv: v })} placeholder="123" error={errors.cvv} />
                </div>
              </div>
            </div>
          )}

          {/* Review */}
          {step === 'review' && (
            <div className="space-y-4">
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Order Review</h2>
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item.product.id} className="flex items-center gap-4">
                      <img src={item.product.image} alt={item.product.name} className="w-16 h-16 rounded-xl object-cover" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.product.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">{formatCurrency(item.product.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">Shipping To</h3>
                <p className="text-sm text-gray-600">{shipping.firstName} {shipping.lastName}</p>
                <p className="text-sm text-gray-600">{shipping.address}</p>
                <p className="text-sm text-gray-600">{shipping.city}, {shipping.state} {shipping.zipCode}</p>
                <p className="text-sm text-gray-600">{shipping.phone}</p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            {step !== 'shipping' ? (
              <button
                onClick={() => setStep(step === 'review' ? 'payment' : 'shipping')}
                className="flex items-center gap-1.5 px-5 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : <div />}
            {step === 'review' ? (
              <button
                onClick={handlePlaceOrder}
                disabled={placingOrder}
                className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-60"
              >
                {placingOrder ? <><Loader2 className="w-5 h-5 animate-spin" /> Placing Order...</> : <><Check className="w-5 h-5" /> Place Order</>}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
              {promoApplied && <div className="flex justify-between text-green-600"><span>{promoCode}</span><span>-{formatCurrency(discount)}</span></div>}
              <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span className={shippingCost === 0 ? 'text-green-600' : ''}>{shippingCost === 0 ? 'Free' : formatCurrency(shippingCost)}</span></div>
              <hr className="border-gray-100" />
              <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="text-indigo-600">{formatCurrency(total + shippingCost)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
