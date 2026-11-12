import { useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2, Ticket } from 'lucide-react'
import { Link } from 'react-router'
import Button from '@/components/ui/Button'
import Field from '@/components/ui/Field'
import Input from '@/components/ui/Input'
import { apiRequest } from '@/lib/api'

export default function Voucher() {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    const voucherCode = code.trim().toUpperCase()
    if (!/^VCH-[A-Z0-9]{8}$/.test(voucherCode)) {
      setError('Enter your voucher code in the format VCH-XXXXXXXX.')
      setSuccess('')
      return
    }
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const result = await apiRequest('/portal/vouchers/redeem', {
        method: 'POST',
        body: { code: voucherCode },
      })
      setSuccess(result?.message || 'Voucher accepted. You are connected.')
    } catch (requestError) {
      setError(requestError.message || 'We could not redeem this voucher.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="portal-page narrow-page">
      <Link to="/" className="back-link"><ArrowLeft size={16} aria-hidden="true" /> Back home</Link>
      <header className="portal-page-heading">
        <span className="eyebrow">Got a voucher?</span>
        <h1>Connect with a voucher</h1>
        <p>Enter the code exactly as it appears on your voucher.</p>
      </header>

      <form className="portal-form portal-panel" onSubmit={handleSubmit} noValidate>
        <Field label="Voucher code" htmlFor="voucher-code" hint="Your code starts with VCH-." error={error} required>
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              value={code}
              onChange={(event) => {
                setCode(event.target.value.toUpperCase().replace(/\s/g, ''))
                setError('')
                setSuccess('')
              }}
              autoCapitalize="characters"
              autoComplete="off"
              placeholder="VCH-XXXXXXXX"
              maxLength={12}
              leading={<Ticket size={18} aria-hidden="true" />}
              inputClassName="voucher-input"
              describedBy={describedBy}
              invalid={invalid}
              required
            />
          )}
        </Field>
        {success && <div className="form-success" role="status"><CheckCircle2 size={18} aria-hidden="true" /> {success}</div>}
        <Button type="submit" size="lg" loading={loading} className="form-submit">
          Redeem voucher <ArrowRight size={17} aria-hidden="true" />
        </Button>
      </form>
      <p className="portal-footnote">Need help with your voucher? <Link to="/customer-care">Talk to customer care</Link>.</p>
    </div>
  )
}