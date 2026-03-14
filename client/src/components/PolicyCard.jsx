import { useState } from 'react'
import { downloadPolicy, renewPolicy } from '../api/api'
import './PolicyCard.css'

const TYPE_ICONS = {
  Health: '🏥',
  Life: '💙',
  Vehicle: '🚗',
  Travel: '✈️',
  Home: '🏠',
}

const statusClass = {
  Active: 'badge-active',
  Expired: 'badge-expired',
  'Pending Renewal': 'badge-pending',
}

const formatDate = (dateStr) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)

const PolicyCard = ({ policy }) => {
  const [downloading, setDownloading] = useState(false)
  const [renewing, setRenewing] = useState(false)
  const [message, setMessage] = useState(null)

  const handleDownload = async () => {
    setDownloading(true)
    setMessage(null)
    try {
      const res = await downloadPolicy(policy.policyId)
      window.open(res.data.downloadUrl, '_blank', 'noopener,noreferrer')
      setMessage({ type: 'success', text: 'PDF link opened in a new tab.' })
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Download failed.' })
    } finally {
      setDownloading(false)
    }
  }

  const handleRenew = async () => {
    setRenewing(true)
    setMessage(null)
    try {
      const res = await renewPolicy(policy.policyId)
      window.location.href = res.data.paymentUrl
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Renewal failed.' })
      setRenewing(false)
    }
  }

  const isExpired = policy.renewalStatus === 'Expired'
  const isPending = policy.renewalStatus === 'Pending Renewal'

  return (
    <div className="policy-card card fade-in-up" data-testid="policy-card">
      <div className="policy-card-header">
        <span className="policy-type-icon">{TYPE_ICONS[policy.policyType] || '📄'}</span>
        <div className="policy-type-label">{policy.policyType} Insurance</div>
        <span className={`badge ${statusClass[policy.renewalStatus] || 'badge-active'}`}>
          {policy.renewalStatus}
        </span>
      </div>

      <div className="policy-card-body">
        <h3 className="policy-name">{policy.policyName}</h3>
        <div className="policy-id">#{policy.policyId}</div>

        <div className="policy-details">
          <div className="policy-detail-item">
            <span className="detail-label">Expiry Date</span>
            <span className={`detail-value ${isExpired ? 'text-danger' : ''}`}>
              {formatDate(policy.expiryDate)}
            </span>
          </div>
          <div className="policy-detail-item">
            <span className="detail-label">Annual Premium</span>
            <span className="detail-value">{formatCurrency(policy.premium)}</span>
          </div>
          <div className="policy-detail-item">
            <span className="detail-label">Sum Insured</span>
            <span className="detail-value">{formatCurrency(policy.sumInsured)}</span>
          </div>
        </div>
      </div>

      {message && (
        <div className={`policy-message ${message.type === 'error' ? 'policy-message-error' : 'policy-message-success'}`}>
          {message.text}
        </div>
      )}

      <div className="policy-card-actions">
        <button
          id={`download-btn-${policy.policyId}`}
          className="btn btn-outline"
          onClick={handleDownload}
          disabled={downloading}
        >
          {downloading ? '⏳' : '📄'} {downloading ? 'Generating...' : 'Download PDF'}
        </button>
        <button
          id={`renew-btn-${policy.policyId}`}
          className={`btn ${isExpired || isPending ? 'btn-primary' : 'btn-success'}`}
          onClick={handleRenew}
          disabled={renewing}
        >
          {renewing ? '⏳' : '🔄'} {renewing ? 'Redirecting...' : 'Renew Policy'}
        </button>
      </div>
    </div>
  )
}

export default PolicyCard
