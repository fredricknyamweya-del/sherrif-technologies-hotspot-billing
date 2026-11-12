import { useEffect, useState } from 'react'
import { ArrowLeft, Check, CircleAlert, Clock3, RefreshCw, Wifi } from 'lucide-react'
import { Link, useSearchParams } from 'react-router'
import Button from '@/components/ui/Button'
import ErrorState from '@/components/ui/ErrorState'
import LoadingState from '@/components/ui/LoadingState'
import StatusBadge from '@/components/ui/StatusBadge'
import { apiRequest } from '@/lib/api'

const steps = [
  { id: 'request', label: 'Payment request sent', detail: 'Your M-Pesa prompt is ready.' },
  { id: 'confirm', label: 'Waiting for confirmation', detail: 'Approve the request on your phone.' },
  { id: 'connect', label: 'Connecting you', detail: 'We will activate your Wi-Fi access.' },
]

function getStatusMessage(status) {
  if (status === 'failed') {
    return {
      title: 'Payment not completed',
      description: 'The payment was declined or cancelled. You can try again with the same package.',
      icon: CircleAlert,
    }
  }
  if (status === 'timeout') {
    return {
      title: 'Still waiting for payment',
      description: 'We did not receive confirmation in time. Check your M-Pesa messages before retrying.',
      icon: Clock3,
    }
  }
  if (status === 'success' || status === 'completed') {
    return {
      title: 'You are connected!',
      description: 'Your payment is confirmed. Enjoy your internet connection.',
      icon: Wifi,
    }
  }
  return {
    title: 'Check your phone',
    description: 'Approve the M-Pesa prompt to activate your Wi-Fi package.',
    icon: Clock3,
  }
}

export default function PaymentStatus() {
  const [searchParams] = useSearchParams()
  const paymentId = searchParams.get('id')
  const requestedStatus = searchParams.get('status')
  const [status, setStatus] = useState(
    ['failed', 'timeout', 'success', 'completed'].includes(requestedStatus)
      ? requestedStatus
      : 'pending',
  )
  const [loading, setLoading] = useState(Boolean(paymentId) && !requestedStatus)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!paymentId || requestedStatus) return undefined
    let active = true
    apiRequest(`/portal/payments/${encodeURIComponent(paymentId)}`)
      .then((result) => {
        if (active) setStatus(result?.status || 'pending')
      })
      .catch((requestError) => {
        if (active) setError(requestError)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [paymentId, requestedStatus])

  if (!paymentId && !requestedStatus) {
    return (
      <div className="portal-page">
        <ErrorState title="Payment reference missing" message="Start a package purchase to check payment status." />
        <div className="portal-centered-action"><Button as={Link} to="/packages">Browse packages</Button></div>
      </div>
    )
  }

  if (loading) {
    return <div className="portal-page"><LoadingState label="Checking your payment" /></div>
  }

  if (error) {
    return (
      <div className="portal-page narrow-page">
        <ErrorState title="Could not check payment" message={error.message} />
        <div className="portal-centered-action">
          <Button as={Link} to="/payment/status?status=timeout" variant="outline">View status options</Button>
        </div>
      </div>
    )
  }

  const result = getStatusMessage(status)
  const ResultIcon = result.icon
  const completed = status === 'success' || status === 'completed'
  const failed = status === 'failed' || status === 'timeout'
  const activeStep = completed ? 3 : failed ? 2 : 2

  return (
    <div className="portal-page narrow-page payment-status-page">
      <section className={`payment-result${completed ? ' is-success' : ''}${failed ? ' is-failed' : ''}`}>
        <span className="payment-result-icon"><ResultIcon size={28} aria-hidden="true" /></span>
        <StatusBadge status={completed ? 'success' : failed ? status : 'pending'} />
        <h1>{result.title}</h1>
        <p>{result.description}</p>
        {paymentId && <span className="payment-reference">Reference: {paymentId}</span>}
      </section>

      <section className="payment-stepper" aria-label="Payment progress">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isDone = completed || stepNumber < activeStep
          const isActive = !completed && !failed && stepNumber === activeStep
          return (
            <div className={`payment-step${isDone ? ' is-done' : ''}${isActive ? ' is-current' : ''}`} key={step.id}>
              <span className="payment-step-marker">
                {isDone ? <Check size={16} aria-hidden="true" /> : stepNumber}
              </span>
              <div>
                <strong>{step.label}</strong>
                <span>{step.detail}</span>
              </div>
            </div>
          )
        })}
      </section>

      <div className="payment-status-actions">
        {completed ? (
          <Button as={Link} to="/" size="lg"><Wifi size={17} aria-hidden="true" /> Start browsing</Button>
        ) : failed ? (
          <>
            <Button as={Link} to="/packages?retry=true" size="lg"><RefreshCw size={17} aria-hidden="true" /> Try another payment</Button>
            <Button as={Link} to="/reconnect" variant="outline">Use a payment code</Button>
          </>
        ) : (
          <Button as={Link} to="/payment/status?status=timeout" variant="outline">I did not receive a prompt</Button>
        )}
        <Link className="back-link" to="/"><ArrowLeft size={15} aria-hidden="true" /> Return home</Link>
      </div>
    </div>
  )
}