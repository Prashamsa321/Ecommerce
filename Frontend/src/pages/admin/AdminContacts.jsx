import React, { useState, useEffect } from 'react';
import { contactService } from '../../services/contactService';
import { useToast } from '../../context/ToastContext';

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, read: 0, replied: 0 });
  const { success, error } = useToast();

  useEffect(() => {
    fetchContacts();
    fetchStats();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const data = await contactService.getAllContacts();
      setContacts(data.contacts || []);
    } catch (err) {
      error('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await contactService.getContactStats();
      setStats(data.stats || { total: 0, pending: 0, read: 0, replied: 0 });
    } catch (err) {
      console.error('Failed to fetch stats');
    }
  };

  const handleViewContact = async (contact) => {
    try {
      const data = await contactService.getContactById(contact._id);
      setSelectedContact(data.contact);
    } catch (err) {
      error('Failed to load message details');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
          <div className="absolute inset-0 rounded-full h-12 w-12 border-t-2 border-brand-orange animate-pulse opacity-50"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Contact Messages</h1>
        <p className="text-text-muted mt-1">View customer inquiries</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-5 border border-divider">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-brand-orange">{stats.total}</div>
              <div className="text-sm text-text-muted mt-1">Total Messages</div>
            </div>
            <div className="w-10 h-10 bg-brand-light0/20 rounded-lg flex items-center justify-center text-xl">ðŸ“¬</div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-5 border border-divider">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-amber-400">{stats.pending}</div>
              <div className="text-sm text-text-muted mt-1">Pending</div>
            </div>
            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center text-xl">â³</div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-5 border border-divider">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-brand-orange">{stats.read}</div>
              <div className="text-sm text-text-muted mt-1">Read</div>
            </div>
            <div className="w-10 h-10 bg-brand-light0/20 rounded-lg flex items-center justify-center text-xl">ðŸ‘ï¸</div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-5 border border-divider">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-400">{stats.replied}</div>
              <div className="text-sm text-text-muted mt-1">Replied</div>
            </div>
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center text-xl">âœ…</div>
          </div>
        </div>
      </div>

      {/* Contacts Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-divider">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-surface-primary">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">From</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Subject</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-700">
              {contacts.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-text-muted">
                    <div className="text-4xl mb-2">ðŸ“­</div>
                    <p>No messages found</p>
                  </td>
                </tr>
              ) : (
                contacts.map((contact) => (
                  <tr key={contact._id} className="hover:bg-brand-light/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-white">{contact.name}</p>
                        <p className="text-sm text-text-muted">{contact.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">{contact.subject.substring(0, 20)}</p>
                      <p className="text-sm text-text-muted line-clamp-1">{contact.message.substring(0, 20)}...</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-muted">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewContact(contact)}
                        className="text-brand-orange hover:text-brand-orange-dark transition-colors flex items-center gap-1"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Contact Modal */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setSelectedContact(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto border border-divider" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-divider p-5 flex justify-between items-center z-10">
              <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                <span className="text-xl">ðŸ“§</span>
                Message Details
              </h3>
              <button onClick={() => setSelectedContact(null)} className="text-text-muted hover:text-white transition-colors text-2xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-brand-light">âœ•</button>
            </div>
            
            <div className="p-6 space-y-5">
              {/* From Section - Grid layout */}
              <div className="grid grid-cols-[120px_1fr] gap-3 items-start">
                <label className="text-sm font-semibold text-text-muted flex items-center gap-2">
                  <span className="text-base">ðŸ‘¤</span>
                  From:
                </label>
                <div>
                  <p className="font-semibold text-text-primary">{selectedContact.name}</p>
                  <p className="text-sm text-text-muted break-all">{selectedContact.email}</p>
                </div>
              </div>

              {/* Subject Section - Grid layout */}
              <div className="grid grid-cols-[120px_1fr] gap-3 items-start">
                <label className="text-sm font-semibold text-text-muted flex items-center gap-2">
                  <span className="text-base">ðŸ“Œ</span>
                  Subject:
                </label>
                <p className="text-white font-medium break-words">{selectedContact.subject}</p>
              </div>

              {/* Date Section - Grid layout */}
              <div className="grid grid-cols-[120px_1fr] gap-3 items-start">
                <label className="text-sm font-semibold text-text-muted flex items-center gap-2">
                  <span className="text-base">ðŸ“…</span>
                  Date:
                </label>
                <p className="text-text-secondary break-words">
                  {new Date(selectedContact.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Message Section - Grid layout with full width */}
              <div className="pt-2">
                <label className="text-sm font-semibold text-text-muted flex items-center gap-2 mb-3">
                  <span className="text-base">ðŸ’¬</span>
                  Message:
                </label>
                <div className="bg-surface-primary/50 rounded-xl p-4 border border-divider">
                  <p className="text-text-secondary whitespace-pre-wrap break-words leading-relaxed">
                    {selectedContact.message}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer with action buttons */}
            <div className="sticky bottom-0 bg-white border-t border-divider p-5 flex justify-end">
              <button
                onClick={() => setSelectedContact(null)}
                className="px-4 py-2 bg-brand-light text-text-secondary rounded-lg hover:bg-brand-light transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContacts;