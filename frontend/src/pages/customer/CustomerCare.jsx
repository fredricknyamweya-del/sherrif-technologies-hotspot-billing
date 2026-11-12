import { useState } from 'react'
import { ArrowLeft, ArrowRight, Headphones, Mail, MessageCircle, Phone } from 'lucide-react'
import { Link } from 'react-router'
import Button from '@/components/ui/Button'
import Field from '@/components/ui/Field'
import Input from '@/components/ui/Input'
import { isValidKenyanPhone } from '@/lib/format'
import { apiRequest } from '@/lib/api'

export default function CustomerCare() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [errors, setErrors] = useState({})
  const [requestError, setRequestError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Enter your name.'
    if (!isValidKenyanPhone(form.phone)) nextErrors.phone = 'Enter a valid Kenyan mobile number.'
    if (form.message.trim().length < 8) nextErrors.message = 'Please include a little more detail (at least 8 characters).'
    setErrors(nextErrors)
    setRequestError('')
    if (Object.keys(nextErrors).length) return

    setLoading(true)
    try {
      await apiRequest('/portal/support', {
        method: 'POST',
        body: { ...form, name: form.name.trim(), message: form.message.trim() },
      })
      setSuccess('Thanks — your message has been received. Our team will be in touch.')
      setForm({ name: '', phone: '', message: '' })
    } catch (error) {
      setRequestError(error.message || 'Your message could not be sent.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="portal-page">
      <Link to="/" className="back-link"><ArrowLeft size={16} aria-hidden="true" /> Back home</Link>
      <header className="portal-page-heading">
        <span className="eyebrow">We are here for you</span>
        <h1>Customer care</h1>
        <p>Questions about payment or connection? Our team can help.</p>
      </header>

      <div className="care-layout">
        <section className="care-contact-card" aria-label="Contact details">
          <span className="care-main-icon"><Headphones size={25} aria-hidden="true" /></span>
          <h2>Talk to a real person</h2>
          <p>Reach our support team by phone, or send a message and we will follow up.</p>
          <a className="care-contact-link" href="tel:0719221177">
            <span><Phone size={18} aria-hidden="true" /></span>
            <span><small>Call us</small><strong>0719221177</strong></span>
            <ArrowRight size={16} aria-hidden="true" />
          </a>
          <a className="care-contact-link" href="sms:0719221177">
            <span><MessageCircle size={18} aria-hidden="true" /></span>
            <span><small>Send an SMS</small><strong>0719221177</strong></span>
            <ArrowRight size={16} aria-hidden="true" />
          </a>
          <div className="care-hours"><Mail size={16} aria-hidden="true" /> Customer care is available daily.</div>
        </section>

        <form className="portal-form portal-panel care-form" onSubmit={handleSubmit} noValidate>
          <h2>Send us a message</h2>
          <Field label="Your name" htmlFor="care-name" error={errors.name} required>
            {({ id, describedBy, invalid }) => (
              <Input
                id={id}
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                autoComplete="name"
                placeholder="Full name"
                describedBy={describedBy}
                invalid={invalid}
                required
              />
            )}
          </Field>
          <Field label="Phone number" htmlFor="care-phone" error={errors.phone} required>
            {({ id, describedBy, invalid }) => (
              <Input
                id={id}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                placeholder="+254 7XX XXX XXX"
                describedBy={describedBy}
                invalid={invalid}
                required
              />
            )}
          </Field>
          <Field label="How can we help?" htmlFor="care-message" error={errors.message} required>
            {({ id, describedBy, invalid }) => (
              <textarea
                id={id}
                value={form.message}
                onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                placeholder="Tell us what happened..."
                rows={4}
                aria-describedby={describedBy}
                aria-invalid={invalid || undefined}
                required
              />
            )}
          </Field>
          {requestError && <p className="form-alert" role="alert">{requestError}</p>}
          {success && <p className="form-success" role="status">{success}</p>}
          <Button type="submit" loading={loading} className="form-submit">
            Send message <ArrowRight size={17} aria-hidden="true" />
          </Button>
        </form>
      </div>
    </div>
  )
}