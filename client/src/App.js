import React, { useState, useEffect } from 'react';
import './App.css';

const CAUSES = [
  'Eldercare',
  'Education', 
  'Health',
  'Employment Training'
];

const CURRENCIES = ['USD ($)', 'INR (₹)'];

// API Base URL - handles both development and production
const API_BASE = process.env.NODE_ENV === 'production' 
  ? window.location.origin  // Use the same domain in production
  : 'http://localhost:5000';

function App() {
  const [form, setForm] = useState({
    name: '',
    fatherName: '',
    phone: '',
    city: '',
    country: '',
    amount: '',
    currency: CURRENCIES[0],
    cause: CAUSES[0]
  });
  const [responses, setResponses] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('form'); // form, data, export
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [donationToDelete, setDonationToDelete] = useState(null);

  // Fetch all donations on component mount
  useEffect(() => {
    fetchResponses();
  }, []);

  const fetchResponses = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`${API_BASE}/api/responses`);
      const data = await res.json();
      if (data.success) {
        setResponses(data.data);
      } else {
        setError(data.error || 'Failed to fetch data');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage('');
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setMessage('');
      
      const res = await fetch(`${API_BASE}/api/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      const data = await res.json();
      
      if (data.success) {
        setShowSuccessModal(true);
        setForm({
          name: '',
          fatherName: '',
          phone: '',
          city: '',
          country: '',
          amount: '',
          currency: CURRENCIES[0],
          cause: CAUSES[0]
        });
        // Refresh the data list
        fetchResponses();
      } else {
        setError(data.error || 'Submission failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    window.open(`${API_BASE}/api/export`, '_blank');
  };

  const handleDeleteClick = (donation) => {
    setDonationToDelete(donation);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!donationToDelete) return;

    try {
      setLoading(true);
      setError('');
      
      const res = await fetch(`${API_BASE}/api/donation/${donationToDelete._id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await res.json();
      
      if (data.success) {
        setMessage('✅ Donation deleted successfully.');
        setShowDeleteModal(false);
        setDonationToDelete(null);
        fetchResponses();
      } else {
        setError(data.error || 'Failed to delete donation');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDonationToDelete(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🌟 Karamchedu Donation Survey 🌟</h1>
        <p>Supporting communities through your generosity</p>
      </header>

      <main className="app-main">
        {/* Navigation Tabs */}
        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeSection === 'form' ? 'active' : ''}`}
            onClick={() => setActiveSection('form')}
          >
            📝 Donation Form
          </button>
          <button 
            className={`tab-button ${activeSection === 'data' ? 'active' : ''}`}
            onClick={() => setActiveSection('data')}
          >
            📊 Donation Data ({responses.length})
          </button>
          <button 
            className={`tab-button ${activeSection === 'export' ? 'active' : ''}`}
            onClick={() => setActiveSection('export')}
          >
            📥 Export CSV
          </button>
        </div>

        {/* Form Section */}
        {activeSection === 'form' && (
          <div className="form-section">
            <h2>💝 Donation Information</h2>
            <form onSubmit={handleSubmit} className="donation-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="fatherName">Father's Name *</label>
                  <input
                    id="fatherName"
                    name="fatherName"
                    type="text"
                    placeholder="Enter your father's name"
                    value={form.fatherName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={form.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    placeholder="Enter your city"
                    value={form.city}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="country">Country *</label>
                  <input
                    id="country"
                    name="country"
                    type="text"
                    placeholder="Enter your country"
                    value={form.country}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="amount">Donation Amount *</label>
                  <input
                    id="amount"
                    name="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Enter donation amount"
                    value={form.amount}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="currency">Currency *</label>
                  <select
                    id="currency"
                    name="currency"
                    value={form.currency}
                    onChange={handleChange}
                    required
                  >
                    {CURRENCIES.map(currency => (
                      <option key={currency} value={currency}>{currency}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="cause">Cause for Donation *</label>
                  <select
                    id="cause"
                    name="cause"
                    value={form.cause}
                    onChange={handleChange}
                    required
                  >
                    {CAUSES.map(cause => (
                      <option key={cause} value={cause}>{cause}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                className="submit-button"
                disabled={loading}
              >
                {loading ? 'Submitting...' : '🎁 Submit Donation'}
              </button>

              {message && <div className="success-message">{message}</div>}
              {error && <div className="error-message">{error}</div>}
            </form>
          </div>
        )}

        {/* Data View Section */}
        {activeSection === 'data' && (
          <div className="data-section">
            <div className="data-header">
              <h2>📊 Donation Data ({responses.length})</h2>
            </div>
            {loading && <div className="loading">Loading donations...</div>}
            {error && <div className="error-message">{error}</div>}
            {!loading && !error && (
              <div className="table-container">
                {responses.length === 0 ? (
                  <div className="no-data">
                    <p>No donations found yet. Be the first to submit a donation!</p>
                  </div>
                ) : (
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
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {responses.map((donation, i) => (
                        <tr key={donation._id || i}>
                          <td>{donation.name}</td>
                          <td>{donation.fatherName}</td>
                          <td>{donation.phone}</td>
                          <td>{donation.city}</td>
                          <td>{donation.country}</td>
                          <td>{donation.amount}</td>
                          <td>{donation.currency}</td>
                          <td>{donation.cause}</td>
                          <td>{new Date(donation.createdAt).toLocaleDateString()}</td>
                          <td>
                            <button 
                              onClick={() => handleDeleteClick(donation)}
                              className="delete-row-button"
                              title="Delete this donation"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        )}

        {/* Export Section */}
        {activeSection === 'export' && (
          <div className="export-section">
            <h2>📥 Export Donations</h2>
            <div className="export-info">
              <p>Download all donation data as a CSV file for analysis and record keeping.</p>
              <p><strong>Total donations:</strong> {responses.length}</p>
            </div>
            <button onClick={handleExport} className="export-button">
              📥 Download CSV File
            </button>
          </div>
        )}
      </main>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="success-modal">
            <div className="success-icon">🎉</div>
            <h3>Successful Survey!</h3>
            <p>Thank you for your incredible generosity. Your donation will make a significant impact in the lives of those in need. Your kindness goes a long way in building stronger communities and creating positive change. We are truly grateful for your support.</p>
            <button onClick={closeSuccessModal} className="continue-button">
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && donationToDelete && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <div className="delete-icon">⚠️</div>
            <h3>Delete Donation</h3>
            <p>Are you sure you want to delete this donation?</p>
            <div className="donation-preview">
              <p><strong>Name:</strong> {donationToDelete.name}</p>
              <p><strong>Amount:</strong> {donationToDelete.amount} {donationToDelete.currency}</p>
              <p><strong>Cause:</strong> {donationToDelete.cause}</p>
              <p><strong>Date:</strong> {new Date(donationToDelete.createdAt).toLocaleDateString()}</p>
            </div>
            <p className="warning-text">This action cannot be undone.</p>
            <div className="modal-buttons">
              <button onClick={handleDeleteConfirm} className="delete-confirm-button">
                Yes, Delete
              </button>
              <button onClick={closeDeleteModal} className="cancel-button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="app-footer">
        <p>© 2024 Karamchedu Donation Survey - Supporting communities worldwide 🌍</p>
      </footer>
    </div>
  );
}

export default App; 