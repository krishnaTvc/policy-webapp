import { useState, useEffect } from 'react'
import { getPolicies } from '../api/api'
import PolicyCard from '../components/PolicyCard'
import { useAuth } from '../context/AuthContext'
import './DashboardPage.css'

const DashboardPage = () => {
  const [policies, setPolicies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('All')
  const { user } = useAuth()

  const TYPES = ['All', 'Health', 'Life', 'Vehicle', 'Travel', 'Home']

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const res = await getPolicies()
        setPolicies(res.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load policies.')
      } finally {
        setLoading(false)
      }
    }
    fetchPolicies()
  }, [])

  const filtered = filter === 'All'
    ? policies
    : policies.filter(p => p.policyType === filter)

  const stats = {
    total: policies.length,
    active: policies.filter(p => p.renewalStatus === 'Active').length,
    expired: policies.filter(p => p.renewalStatus === 'Expired').length,
    pending: policies.filter(p => p.renewalStatus === 'Pending Renewal').length,
  }

  return (
    <div className="dashboard">
      <div className="container">
        {/* Hero header */}
        <header className="dashboard-header fade-in-up">
          <div>
            <h1 className="dashboard-title">My Policies</h1>
            <p>Welcome back, <strong>{user?.email}</strong></p>
          </div>
          <div className="stats-row">
            <div className="stat-chip">
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-chip stat-active">
              <span className="stat-value">{stats.active}</span>
              <span className="stat-label">Active</span>
            </div>
            <div className="stat-chip stat-expired">
              <span className="stat-value">{stats.expired}</span>
              <span className="stat-label">Expired</span>
            </div>
            <div className="stat-chip stat-pending">
              <span className="stat-value">{stats.pending}</span>
              <span className="stat-label">Pending</span>
            </div>
          </div>
        </header>

        {/* Filter tabs */}
        <div className="filter-tabs fade-in-up" role="tablist">
          {TYPES.map(type => (
            <button
              key={type}
              id={`filter-${type.toLowerCase()}`}
              role="tab"
              aria-selected={filter === type}
              className={`filter-tab ${filter === type ? 'filter-tab-active' : ''}`}
              onClick={() => setFilter(type)}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading && (
          <div className="dashboard-center">
            <div className="spinner"></div>
            <p style={{ marginTop: 16, color: 'var(--text-secondary)' }}>Loading your policies…</p>
          </div>
        )}

        {!loading && error && (
          <div className="alert-error">⚠️ {error}</div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="dashboard-empty">
            <div className="empty-icon">📂</div>
            <h3>No policies found</h3>
            <p>
              {filter !== 'All'
                ? `You have no ${filter} policies.`
                : 'Your policies will appear here once added.'}
            </p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="policies-grid" data-testid="policy-grid">
            {filtered.map(policy => (
              <PolicyCard key={policy.policyId} policy={policy} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage
