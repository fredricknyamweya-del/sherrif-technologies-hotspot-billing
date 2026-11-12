import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, LockKeyhole, Smartphone } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import Button from '@/components/ui/Button'
import ErrorState from '@/components/ui/ErrorState'
import Field from '@/components/ui/Field'
import Input from '@/components/ui/Input'
import LoadingState from '@/components/ui/LoadingState'
import { formatCurrency, formatPhoneNumber, isValidKenyanPhone } from '@/lib/format'
import { apiRequest } from '@/lib/api'

export default function Payment() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const packageId = searchParams.get('package')
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [phone, setPhone] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [requestError, setRequestError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let active = true
    apiRequest('/portal/packages')
      .then((result) => {
        if (active) setPackages(Array.isArray(result) ? result : result?.packages ?? [])
      })
      .catch((error) => {
        if (active) setLoadError(error)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const selectedPackage = useMemo(
    () => packages.find((item) => item.id === packageId),
    [packages, packageId],
  )

  async function handleSubmit(event) {
    event.preventDefault()
    setPhoneError('')
    setRequestError('')
    if (!selectedPackage) {
      setRequestError('Choose an available package before continuing.')
      return
    }
    if (!isValidKenyanPhone(phone)) {
      setPhoneError('Enter a valid Kenyan mobile number, such as 0712 345 678.')
      return
    }

    setSubmitting(true)
    try {
      const result = await apiRequest('/portal/payments', {
        method: 'POST',
        body: {
          packageId: selectedPackage.id,
          phone: formatPhoneNumber(phone),
          amount: selectedPackage.price,
          paymentMethod: 'mpesa',
        },
      })
      const paymentId = result?.paymentId ?? result?.id
      if (!paymentId) {
        throw new Error('The payment request did not return a reference. Please try again.')
      }
      navigate(`/payment/status?id=${encodeURIComponent(paymentId)}`)
    } catch (error) {
      setRequestError(error.message || 'Unable to start the payment. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="portal-page"><LoadingState label="Preparing your payment" /></div>
  if (loadError) {
    return (
      <div className="portal-page">
        <ErrorState
          title="Packages unavailable"
          message={loadError.message}
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }
  if (!selectedPackage) {
    return (
      <div className="portal-page">
        <ErrorState
          title="Choose a package first"
          message="Select a current package to continue to M-Pesa payment."
        />
        <div className="portal-centered-action"><Button as={Link} to="/packages">Browse packages</Button></div>
      </div>
    )
  }

  return (
    <div className="portal-page narrow-page">
      <Link to="/packages" className="back-link"><ArrowLeft size={16} aria-hidden="true" /> Back to packages</Link>
      <header className="portal-page-heading">
        <span className="eyebrow">Secure checkout</span>
        <h1>Pay with M-Pesa</h1>
        <p>Enter the mobile number you want to use for payment.</p>
      </header>

      <section className="checkout-card" aria-label="Order summary">
        <div>
          <span className="checkout-label">Your package</span>
          <strong>{selectedPackage.name}</strong>
          <span className="checkout-detail">{selectedPackage.description}</span>
        </div>
        <strong className="checkout-total">{formatCurrency(selectedPackage.price)}</strong>
      </section>

      <form className="portal-form checkout-form" onSubmit={handleSubmit} noValidate>
        <Field
          label="M-Pesa phone number"
          htmlFor="phone"
          hint="Use a Safaricom number registered with M-Pesa."
          error={phoneError}
          required
        >
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={(event) => {
                setPhone(event.target.value)
                setPhoneError('')
              }}
              placeholder="+254 7XX XXX XXX"
              leading={<Smartphone size={18} aria-hidden="true" />}
              describedBy={describedBy}
              invalid={invalid}
              required
            />
          )}
        </Field>
        {requestError && <p className="form-alert" role="alert">{requestError}</p>}
        <div className="payment-secure-note">
          <LockKeyhole size={16} aria-hidden="true" />
          <span>We will send an M-Pesa prompt to your phone. Never share your PIN.</span>
        </div>
        <Button type="submit" size="lg" loading={submitting} className="form-submit">
          Send payment prompt <ArrowRight size={17} aria-hidden="true" />
        </Button>
      </form>
    </div>
  )
}