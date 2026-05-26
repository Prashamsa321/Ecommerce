import React, { useState } from 'react';
import { contactService } from '../services/contactService';
import { useToast } from '../context/ToastContext';

function ContactPage() {
  const { success, error: toastError } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await contactService.submitContact(formData);
      success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClassName = (fieldName) => {
    const baseClasses = "w-full px-4 py-3 rounded-xl text-base outline-none transition-all duration-300 border";
    const bgColor = "bg-[#111827]";
    const textColor = "text-white";
    const placeholderColor = "placeholder-gray-400";
    
    if (errors[fieldName]) {
      return `${baseClasses} ${bgColor} ${textColor} ${placeholderColor} border-[#FF3B30] focus:border-[#FF3B30] focus:ring-2 focus:ring-[#FF3B30]/20`;
    }
    
    if (focusedField === fieldName) {
      return `${baseClasses} ${bgColor} ${textColor} ${placeholderColor} border-[#FF6200] ring-2 ring-[#FF6200]/20`;
    }
    
    return `${baseClasses} ${bgColor} ${textColor} ${placeholderColor} border-[#1E3A8A] hover:border-[#22D3EE] focus:border-[#FF6200] focus:ring-2 focus:ring-[#FF6200]/20`;
  };

  return (
    <div className="min-h-screen bg-[#0A2540] flex items-center justify-center p-5">
      <div className="w-full max-w-2xl bg-[#111827] rounded-3xl p-8 md:p-10 shadow-2xl border border-[#1E3A8A]">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-white text-3xl md:text-4xl font-bold mb-2">
            Get in Touch
          </h1>
          <p className="text-gray-300 text-lg">
            Have a question or want to work together?
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name and Email Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name Field */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Name <span className="text-[#FF3B30]">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                placeholder="John Doe"
                className={getInputClassName('name')}
              />
              {errors.name && (
                <p className="mt-1 text-[#FF3B30] text-sm flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Email <span className="text-[#FF3B30]">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                placeholder="john@example.com"
                className={getInputClassName('email')}
              />
              {errors.email && (
                <p className="mt-1 text-[#FF3B30] text-sm flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          {/* Subject Field */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Subject <span className="text-[#FF3B30]">*</span>
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              onFocus={() => setFocusedField('subject')}
              onBlur={() => setFocusedField(null)}
              placeholder="What's this about?"
              className={getInputClassName('subject')}
            />
            {errors.subject && (
              <p className="mt-1 text-[#FF3B30] text-sm flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.subject}
              </p>
            )}
          </div>

          {/* Message Field */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Message <span className="text-[#FF3B30]">*</span>
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              onFocus={() => setFocusedField('message')}
              onBlur={() => setFocusedField(null)}
              placeholder="Your message here... (minimum 10 characters)"
              rows="5"
              className={`${getInputClassName('message')} resize-none`}
            />
            {errors.message && (
              <p className="mt-1 text-[#FF3B30] text-sm flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#FF6200] hover:bg-[#E05500] disabled:bg-[#1E3A8A] disabled:cursor-not-allowed text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send Message
              </>
            )}
          </button>
        </form>

        {/* Contact Info */}
        <div className="mt-8 pt-6 border-t border-[#1E3A8A]">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-[#1E3A8A] rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-[#22D3EE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-gray-400 text-xs">Email</span>
              <span className="text-white text-sm">support@merogadget.com</span>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-[#1E3A8A] rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-[#22D3EE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <span className="text-gray-400 text-xs">Phone</span>
              <span className="text-white text-sm">+977 9800000000</span>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-[#1E3A8A] rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-[#22D3EE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="text-gray-400 text-xs">Location</span>
              <span className="text-white text-sm">Kathmandu, Nepal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;