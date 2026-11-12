import { useState } from 'react'
import { ArrowLeft, ArrowRight, KeyRound, Smartphone, Wifi } from 'lucide-react'
import { Link } from 'react-router'
import Button from '@/components/ui/Button'
import Field from '@/components/ui/Field'
import Input from '@/components/ui/Input'
import { formatPhoneNumber, isValidKenyanPhone } from '@/lib/format'
import { apiRequest } from '@/lib/api'

export default function Reconnect() {
  const [code, setCode] = useState('')
  const [phone, setPhone] = useState('')
  const [errors, setErrors] = useState({})
  const [requestError, setRequestError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = {}
    if (!/^[A-Z0-9]{6,16}$/.test(code.trim().toUpperCase())) {
      nextErrors.code = 'Enter the payment confirmation code from your M-Pesa message.'
    }
    if (!isValidKenyanPhone(phone)) {
      nextErrors.phone = 'Enter a valid Kenyan mobile number.'
    }
    setErrors(nextErrors)
    setRequestError('')
    setSuccess('')
    if (Object.keys(nextErrors).length) return

    setLoading(true)
    try {
      const result = await apiRequest('/portal/reconnect', {
        method: 'POST',
        body: { code: code.trim().toUpperCase(), phone: formatPhoneNumber(phone) },
      })
      setSuccess(result?.message || 'Your connection is active again.')
    } catch (error) {
      setRequestError(error.message || 'We could not reconnect your session.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="portal-page narrow-page">
      <Link to="/" className="back-link"><ArrowLeft size={16} aria-hidden="true" /> Back home</Link>
      <header className="portal-page-heading">
        <span className="eyebrow">Already paid?</span>
        <h1>Reconnect to Wi-Fi</h1>
        <p>Use the M-Pesa confirmation code and the phone number used for payment.</p>
      </header>

      <form className="portal-form portal-panel" onSubmit={handleSubmit} noValidate>
        <Field label="M-Pesa confirmation code" htmlFor="payment-code" hint="Find the code in your payment confirmation message." error={errors.code} required>
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              value={code}
              onChange={(event) => {
                setCode(event.target.value.toUpperCase())
                setErrors((current) => ({ ...current, code: '' }))
              }}
              autoCapitalize="characters"
              autoComplete="off"
              placeholder="e.g. QWE7K2LM9P"
              leading={<KeyRound size={18} aria-hidden="true" />}
              describedBy={describedBy}
              invalid={invalid}
              required
            />
          )}
        </Field>
        <Field label="Phone number used to pay" htmlFor="reconnect-phone" error={errors.phone} required>
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={(event) => {
                setPhone(event.target.value)
                setErrors((current) => ({ ...current, phone: '' }))
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
        {success && (
          <div className="form-success" role="status">
            <Wifi size={18} aria-hidden="true" /> {success}
          </div>
        )}
        <Button type="submit" size="lg" loading={loading} className="form-submit">
          Reconnect <ArrowRight size={17} aria-hidden="true" />
        </Button>
      </form>

      <p className="portal-footnote">
        Lost your payment code? <Link to="/customer-care">Contact customer care</Link>.
      </p>
    </div>
  )
}