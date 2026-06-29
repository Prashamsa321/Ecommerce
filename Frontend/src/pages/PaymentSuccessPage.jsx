import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import FaIcon from '../components/common/FaIcon'
import { paymentService } from '../services/paymentService'
import { orderService } from '../services/orderService'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { formatNpr } from '../utils/helpers'

import { getPendingOrder, clearPendingOrder } from '../utils/pendingOrder'

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { fetchCart } = useCart()
  const { success, error: toastError } = useToast()
  const [status, setStatus] = useState('loading')
  const [paymentData, setPaymentData] = useState(null)
  const [orderNumber, setOrderNumber] = useState(null)

  useEffect(() => {
    const pidx = searchParams.get('pidx') || searchParams.get('Pidx')

    if (!pidx) {
      setStatus('error')
      return
    }

    const completePayment = async () => {
      try {
        const verifyResult = await paymentService.verifyKhalti(pidx)

        if (!verifyResult.success) {
          setStatus('failed')
          setPaymentData(verifyResult.data)
          return
        }

        setPaymentData(verifyResult.data)

        const pending = getPendingOrder()
        if (pending?.shippingAddress) {
          const orderResult = await orderService.createOrder({
            shippingAddress: pending.shippingAddress,
            paymentMethod: 'khalti',
            notes: `Khalti pidx: ${pidx}`,
          })
          setOrderNumber(orderResult.order?.orderNumber || null)
          clearPendingOrder()
          await fetchCart()
        }

        setStatus('success')
        success('Payment verified successfully!')
      } catch (err) {
        console.error(err)
        setStatus('error')
        toastError(err.response?.data?.message || 'Payment verification failed')
      }
    }

    completePayment()
  }, [searchParams, success, toastError, fetchCart])

  if (status === 'loading') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-surface-primary section-container">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-brand-orange border-t-transparent" />
          <p className="mt-4 text-text-muted">Verifying Khalti payment...</p>
        </div>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="min-h-[60vh] bg-surface-primary py-12 section-container">
        <div className="card-premium mx-auto max-w-lg p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
            <FaIcon icon="circle-check" size={32} className="text-status-success" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Payment Successful</h1>
          <p className="mt-2 text-text-muted">Your Khalti payment was verified.</p>
          {paymentData?.total_amount != null && (
            <p className="mt-4 text-lg font-semibold text-brand-orange">
              {formatNpr(Number(paymentData.total_amount) / 100)}
            </p>
          )}
          {orderNumber && (
            <p className="mt-2 text-sm text-text-secondary">
              Order: <span className="font-mono text-brand-orange">{orderNumber}</span>
            </p>
          )}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link to="/profile" className="btn-cta">View Profile</Link>
            <Link to="/products" className="btn-ghost">Continue Shopping</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[60vh] bg-surface-primary py-12 section-container">
      <div className="card-premium mx-auto max-w-lg p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <FaIcon icon="circle-xmark" size={32} className="text-status-error" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary">
          {status === 'failed' ? 'Payment Not Completed' : 'Verification Failed'}
        </h1>
        <p className="mt-2 text-text-muted">
          {status === 'failed'
            ? 'Khalti payment was not completed. You can try again from checkout.'
            : 'We could not verify your payment. Please contact support if amount was deducted.'}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button type="button" onClick={() => navigate('/checkout')} className="btn-cta">
            Back to Checkout
          </button>
          <Link to="/" className="btn-ghost">Go Home</Link>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccessPage
