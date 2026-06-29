import React, { useState, useEffect } from 'react';
import FaIcon from '../../components/common/FaIcon';
import { contactService } from '../../services/contactService';
import { useToast } from '../../context/ToastContext';

const STAT_CARDS = [
  { key: 'total', label: 'Total Messages', icon: 'envelope', valueClass: 'text-brand-orange', iconBg: 'bg-brand-light' },
  { key: 'pending', label: 'Pending', icon: 'clock', valueClass: 'text-amber-600', iconBg: 'bg-amber-50' },
  { key: 'read', label: 'Read', icon: 'eye', valueClass: 'text-brand-orange', iconBg: 'bg-brand-light' },
  { key: 'replied', label: 'Replied', icon: 'circle-check', valueClass: 'text-green-600', iconBg: 'bg-green-50' },
];

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, read: 0, replied: 0 });
  const { error } = useToast();

  useEffect(() => {
    fetchContacts();
    fetchStats();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const data = await contactService.getAllContacts();
      setContacts(data.contacts || []);
    } catch {
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
    } catch {
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
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Contact Messages</h1>
        <p className="text-text-muted mt-1">View customer inquiries</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {STAT_CARDS.map(({ key, label, icon, valueClass, iconBg }) => (
          <div key={key} className="bg-white rounded-xl shadow-lg p-5 border border-divider">
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-2xl font-bold ${valueClass}`}>{stats[key]}</div>
                <div className="text-sm text-text-muted mt-1">{label}</div>
              </div>
              <div className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center text-brand-orange`}>
                <FaIcon icon={icon} size={18} className={valueClass} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-divider">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-divider">
            <thead className="bg-surface-primary">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">From</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Subject</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-divider">
              {contacts.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-text-muted">
                    <FaIcon icon="inbox" className="text-text-muted mx-auto mb-2" size={40} />
                    <p>No messages found</p>
                  </td>
                </tr>
              ) : (
                contacts.map((contact) => (
                  <tr key={contact._id} className="hover:bg-brand-light/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-text-primary">{contact.name}</p>
                        <p className="text-sm text-text-muted">{contact.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-text-primary font-medium">{contact.subject.substring(0, 20)}</p>
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
                        <FaIcon icon="eye" size={16} />
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

      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setSelectedContact(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto border border-divider" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-divider p-5 flex justify-between items-center z-10">
              <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                <FaIcon icon="envelope" size={18} className="text-brand-orange" />
                Message Details
              </h3>
              <button
                onClick={() => setSelectedContact(null)}
                className="text-text-muted hover:text-text-primary transition-colors text-2xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-brand-light"
              >
                <FaIcon icon="xmark" size={18} />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-[120px_1fr] gap-3 items-start">
                <label className="text-sm font-semibold text-text-muted flex items-center gap-2">
                  <FaIcon icon="user" size={14} className="text-brand-orange" />
                  From:
                </label>
                <div>
                  <p className="font-semibold text-text-primary">{selectedContact.name}</p>
                  <p className="text-sm text-text-muted break-all">{selectedContact.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-[120px_1fr] gap-3 items-start">
                <label className="text-sm font-semibold text-text-muted flex items-center gap-2">
                  <FaIcon icon="tag" size={14} className="text-brand-orange" />
                  Subject:
                </label>
                <p className="text-text-primary font-medium break-words">{selectedContact.subject}</p>
              </div>

              <div className="grid grid-cols-[120px_1fr] gap-3 items-start">
                <label className="text-sm font-semibold text-text-muted flex items-center gap-2">
                  <FaIcon icon="calendar" size={14} className="text-brand-orange" />
                  Date:
                </label>
                <p className="text-text-secondary break-words">
                  {new Date(selectedContact.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="pt-2">
                <label className="text-sm font-semibold text-text-muted flex items-center gap-2 mb-3">
                  <FaIcon icon="comment" size={14} className="text-brand-orange" />
                  Message:
                </label>
                <div className="bg-surface-primary/50 rounded-xl p-4 border border-divider">
                  <p className="text-text-secondary whitespace-pre-wrap break-words leading-relaxed">
                    {selectedContact.message}
                  </p>
                </div>
              </div>
            </div>

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
