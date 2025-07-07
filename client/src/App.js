import React, { useState, useEffect } from 'react';
import './App.css';

const TABS = [
  { label: 'Donate', key: 'donate' },
  { label: 'All Donations', key: 'donations' },
  { label: 'Export', key: 'export' },
];

const initialForm = {
  name: '',
  fatherName: '',
  phone: '',
  city: '',
  country: '',
  amount: '',
  currency: 'USD',
  cause: '',
};

function App() {
  const [activeTab, setActiveTab] = useState('donate');
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (activeTab === 'donations') fetchDonations();
  }, [activeTab]);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/responses');
      const data = await res.json();
      // Defensive: handle both array and object responses
      if (Array.isArray(data)) {
        setDonations(data);
      } else if (Array.isArray(data.donations)) {
        setDonations(data.donations);
      } else {
        setDonations([]);
        setError('Unexpected response from server.');
      }
    } catch (e) {
      setError('Failed to fetch donations.');
      setDonations([]);
    }
    setLoading(false);
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Submission failed');
      setSuccess('Thank you for your donation!');
      setForm(initialForm);
    } catch (e) {
      setError('Failed to submit donation.');
    }
    setSubmitting(false);
  };

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this donation?')) return;
    setDeleteId(id);
    try {
      const res = await fetch(`/api/donation/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setDonations(donations.filter(d => d._id !== id));
    } catch (e) {
      setError('Failed to delete donation.');
    }
    setDeleteId(null);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch('/api/export');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'donations.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      setError('Failed to export CSV.');
    }
    setExporting(false);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Karamchedu Donation</h1>
        <nav className="tab-nav">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`tab-btn${activeTab === tab.key ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>
      <main className="tab-content">
        {activeTab === 'donate' && (
          <section className="donate-section">
            <h2 className="donate-heading">Make a Donation</h2>
            <form className="donation-form big-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Father's Name</label>
                  <input name="fatherName" value={form.fatherName} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone</label>
                  <input name="phone" value={form.phone} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input name="city" value={form.city} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Country</label>
                  <input name="country" value={form.country} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Donation Amount</label>
                  <input name="amount" type="number" min="1" value={form.amount} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Currency</label>
                  <select name="currency" value={form.currency} onChange={handleChange} required>
                    <option value="USD">USD</option>
                    <option value="INR">INR</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Cause</label>
                  <input name="cause" value={form.cause} onChange={handleChange} required />
                </div>
              </div>
              <button className="submit-button big-button" type="submit" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Donate Now'}
              </button>
              {success && <div className="success-message">{success}</div>}
              {error && <div className="error-message">{error}</div>}
            </form>
          </section>
        )}
        {activeTab === 'donations' && (
          <section>
            <h2>All Donations</h2>
            {loading ? (
              <div className="loading">Loading donations...</div>
            ) : (
              <div className="table-container">
                <table className="donations-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Father's Name</th>
                      <th>Phone</th>
                      <th>City</th>
                      <th>Country</th>
                      <th>Amount</th>
                      <th>Currency</th>
                      <th>Cause</th>
                      <th>Date</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.length === 0 ? (
                      <tr><td colSpan="10" className="no-data">No donations yet.</td></tr>
                    ) : (
                      donations.map(d => (
                        <tr key={d._id}>
                          <td>{d.name}</td>
                          <td>{d.fatherName}</td>
                          <td>{d.phone}</td>
                          <td>{d.city}</td>
                          <td>{d.country}</td>
                          <td>{d.amount}</td>
                          <td>{d.currency}</td>
                          <td>{d.cause}</td>
                          <td>{d.date ? new Date(d.date).toLocaleString() : ''}</td>
                          <td>
                            <button className="delete-row-button" onClick={() => handleDelete(d._id)} disabled={deleteId === d._id}>
                              {deleteId === d._id ? 'Deleting...' : 'Delete'}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
            {error && <div className="error-message">{error}</div>}
          </section>
        )}
        {activeTab === 'export' && (
          <section>
            <h2>Export Donations</h2>
            <button className="export-button" onClick={handleExport} disabled={exporting}>
              {exporting ? 'Exporting...' : 'Export as CSV'}
            </button>
            {error && <div className="error-message">{error}</div>}
          </section>
        )}
      </main>
    </div>
  );
}

export default App; 