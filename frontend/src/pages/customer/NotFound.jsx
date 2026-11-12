import { ArrowLeft, CircleHelp } from 'lucide-react'
import { Link } from 'react-router'
import Button from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="portal-page not-found-page">
      <span className="not-found-icon"><CircleHelp size={32} aria-hidden="true" /></span>
      <span className="eyebrow">404 · Page not found</span>
      <h1>This page is out of range.</h1>
      <p>The page may have moved, or the link may be incorrect.</p>
      <Button as={Link} to="/"><ArrowLeft size={16} aria-hidden="true" /> Return to home</Button>
    </div>
  )
}