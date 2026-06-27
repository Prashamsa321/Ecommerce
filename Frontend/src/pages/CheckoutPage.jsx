import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, ChevronRight, MapPin, CreditCard, Package } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

const STEPS = [
  { id: 1, label: 'Shipping', icon: Package },
  { id: 2, label: 'Address', icon: MapPin },
  { id: 3, label: 'Payment', icon: CreditCard },
  { id: 4, label: 'Confirm', icon: Check },
]

const CheckoutPage = () => {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: '', phone: '', address: '', city: '', payment: 'cod' })
  const [coupon, setCoupon] = useState('')
  const { cartItems, getCartTotal, loading } = useCart()
  const { user } = useAuth()
  const { success } = useToast()
  const navigate = useNavigate()

  const items = Array.isArray(cartItems) ? cartItems : []
  const subtotal = getCartTotal()
  const discount = coupon === 'MEROGADGET10' ? subtotal * 0.1 : 0
  const total = subtotal - discount

  const update = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handlePlaceOrder = () => {
    success('Order placed successfully! 🎉')
    navigate('/profile')
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-surface-primary flex items-center justify-center section-container">
        <div className="text-center card-premium p-10">
          <p className="text-text-secondary mb-4">Please sign in to checkout</p>
          <Link to="/login" className="btn-cta">Sign In</Link>
        </div>
      </div>
    )
  }

  if (!loading && items.length === 0) {
    return (
      <div className="min-h-screen bg-surface-primary flex items-center justify-center section-container">
        <div className="text-center card-premium p-10">
          <p className="text-6xl mb-4">🛒</p>
          <p className="text-text-primary text-xl font-semibold mb-2">Your cart is empty</p>
          <Link to="/products" className="btn-cta mt-4 inline-flex">Start Shopping</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-primary py-10 pb-24">
      <div className="section-container">
        <h1 className="text-3xl font-bold text-text-primary mb-8">Checkout</h1>

        <div className="flex items-center justify-between mb-10 max-w-2xl">
          {STEPS.map(({ id, label, icon: Icon }, i) => (
            <div key={id} className="flex items-center flex-1">
              <button onClick={() => id <= step && setStep(id)} className="flex flex-col items-center gap-1.5 transition-all">
                <div className={`stepper-dot ${
                  step > id ? 'stepper-dot-done' :
                  step === id ? 'stepper-dot-active' : 'stepper-dot-pending'
                }`}>
                  {step > id ? <Check size={16} /> : <Icon size={16} />}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${step >= id ? 'text-brand-orange' : 'text-text-muted'}`}>{label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 rounded ${step > id ? 'bg-brand-orange' : 'bg-divider'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card-premium p-8">
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-text-primary mb-4">Shipping Method</h2>
                  {['Standard Delivery (3-5 days) — Free', 'Express Delivery (1-2 days) — रु200'].map((opt, i) => (
                    <label key={i} className="flex items-center gap-3 p-4 bg-brand-light rounded-2xl cursor-pointer hover:border-brand-orange/30 border border-transparent transition-all">
                      <input type="radio" name="shipping" defaultChecked={i === 0} className="accent-brand-orange" />
                      <span className="text-text-secondary text-sm">{opt}</span>
                    </label>
                  ))}
                </div>
              )}
              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-text-primary mb-4">Delivery Address</h2>
                  <input className="input-field" placeholder="Full Name" value={form.name} onChange={update('name')} />
                  <input className="input-field" placeholder="Phone Number" value={form.phone} onChange={update('phone')} />
                  <input className="input-field" placeholder="Street Address" value={form.address} onChange={update('address')} />
                  <input className="input-field" placeholder="City" value={form.city} onChange={update('city')} />
                </div>
              )}
              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-text-primary mb-4">Payment Method</h2>
                  {[{ id: 'cod', label: 'Cash on Delivery' }, { id: 'esewa', label: 'eSewa' }, { id: 'khalti', label: 'Khalti' }].map(({ id, label }) => (
                    <label key={id} className="flex items-center gap-3 p-4 bg-brand-light rounded-2xl cursor-pointer border border-transparent hover:border-brand-orange/30 transition-all">
                      <input type="radio" name="payment" value={id} checked={form.payment === id} onChange={update('payment')} className="accent-brand-orange" />
                      <span className="text-text-secondary">{label}</span>
                    </label>
                  ))}
                </div>
              )}
              {step === 4 && (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={32} className="text-status-success" />
                  </div>
                  <h2 className="text-xl font-semibold text-text-primary mb-2">Ready to place your order?</h2>
                  <p className="text-text-muted text-sm">Review your order and click Place Order to confirm.</p>
                </div>
              )}

              <div className="flex justify-between mt-8">
                {step > 1 ? (
                  <button onClick={() => setStep(s => s - 1)} className="btn-ghost">Back</button>
                ) : <div />}
                {step < 4 ? (
                  <button onClick={() => setStep(s => s + 1)} className="btn-cta">Continue <ChevronRight size={16} /></button>
                ) : (
                  <button onClick={handlePlaceOrder} className="btn-promo">Place Order</button>
                )}
              </div>
            </motion.div>
          </div>

          <div>
            <div className="card-premium p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Order Summary</h2>
              <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
                {items.map(item => (
                  <div key={item.productId || item._id} className="flex gap-3">
                    <div className="w-12 h-12 rounded-xl bg-brand-light overflow-hidden shrink-0">
                      {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary line-clamp-1">{item.name}</p>
                      <p className="text-xs text-text-muted">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm text-text-primary font-medium">रु{((item.price || 0) * (item.quantity || 0)).toFixed(0)}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mb-4">
                <input className="input-field py-2.5 text-sm" placeholder="Coupon code" value={coupon} onChange={e => setCoupon(e.target.value)} />
                <button onClick={() => coupon === 'MEROGADGET10' && success('Coupon applied!')} className="btn-ghost px-4 py-2 text-sm shrink-0">Apply</button>
              </div>
              <p className="text-xs text-text-muted mb-4">Try: MEROGADGET10 for 10% off</p>

              <div className="space-y-2 border-t border-divider pt-4">
                <div className="flex justify-between text-text-secondary text-sm"><span>Subtotal</span><span>रु{subtotal.toFixed(2)}</span></div>
                {discount > 0 && <div className="flex justify-between text-status-success text-sm"><span>Discount</span><span>-रु{discount.toFixed(2)}</span></div>}
                <div className="flex justify-between text-text-secondary text-sm"><span>Shipping</span><span className="text-status-success">Free</span></div>
                <div className="flex justify-between text-text-primary font-bold text-lg pt-2 border-t border-divider"><span>Total</span><span>रु{total.toFixed(2)}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
