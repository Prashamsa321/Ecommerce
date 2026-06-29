import React, { useState } from 'react';
import FaIcon from '../components/common/FaIcon';
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
    const bgColor = "bg-surface-primary";
    const textColor = "text-text-primary";
    const placeholderColor = "placeholder-gray-500";
    
    if (errors[fieldName]) {
      return `${baseClasses} ${bgColor} ${textColor} ${placeholderColor} border-[#FF3B30] focus:border-[#FF3B30] focus:ring-2 focus:ring-[#FF3B30]/20`;
    }
    
    if (focusedField === fieldName) {
      return `${baseClasses} ${bgColor} ${textColor} ${placeholderColor} border-brand-orange ring-2 ring-brand-orange/30 focus:border-brand-orange`;
    }
    
    return `${baseClasses} ${bgColor} ${textColor} ${placeholderColor} border-divider hover:border-brand-orange focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light via-brand-light to-white py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-light/30 rounded-full border border-brand-orange/30 mb-4 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-orange"></span>
            </span>
            <span className="text-sm text-brand-orange font-medium">Contact Us</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-3">
            Get in <span className="text-brand-orange">Touch</span>
          </h1>
          <p className="text-text-secondary text-base md:text-lg max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Our team is here to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-divider shadow-xl">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-text-primary mb-2">Send us a Message</h2>
              <p className="text-text-muted text-sm">Fill out the form below and we'll get back to you soon.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name and Email Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name Field */}
                <div>
                  <label className="block text-text-secondary text-sm font-medium mb-2">
                    Full Name <span className="text-[#FF3B30]">*</span>
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
                    <p className="mt-1 text-[#FF3B30] text-xs flex items-center gap-1">
                      <FaIcon icon="triangle-exclamation" size={12} /> {errors.name}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-text-secondary text-sm font-medium mb-2">
                    Email Address <span className="text-[#FF3B30]">*</span>
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
                    <p className="mt-1 text-[#FF3B30] text-xs flex items-center gap-1">
                      <FaIcon icon="triangle-exclamation" size={12} /> {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Subject Field */}
              <div>
                <label className="block text-text-secondary text-sm font-medium mb-2">
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
                  <p className="mt-1 text-[#FF3B30] text-xs flex items-center gap-1">
                    <FaIcon icon="triangle-exclamation" size={12} /> {errors.subject}
                  </p>
                )}
              </div>

              {/* Message Field */}
              <div>
                <label className="block text-text-secondary text-sm font-medium mb-2">
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
                  <p className="mt-1 text-[#FF3B30] text-xs flex items-center gap-1">
                    <FaIcon icon="triangle-exclamation" size={12} /> {errors.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-brand-orange to-brand-orange-dark hover:from-[#FF3D00] hover:to-brand-orange disabled:bg-brand-light disabled:cursor-not-allowed text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
              >
                {isSubmitting ? (
                  <>
                    <FaIcon icon="spinner" size={18} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <FaIcon icon="paper-plane" size={18} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Info & Map */}
          <div className="space-y-6">
            {/* Contact Info Cards */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-divider shadow-xl">
              <h2 className="text-xl font-semibold text-text-primary mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-brand-light/30 transition-all duration-300">
                  <div className="w-10 h-10 bg-brand-orange/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaIcon icon="envelope" size={18} className="text-brand-orange" />
                  </div>
                  <div>
                    <p className="text-text-muted text-xs">Email Us</p>
                    <a href="mailto:support@merogadget.com" className="text-text-primary text-sm hover:text-brand-orange transition-colors">
                      support@merogadget.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-brand-light/30 transition-all duration-300">
                  <div className="w-10 h-10 bg-brand-orange/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaIcon icon="phone" size={18} className="text-brand-orange" />
                  </div>
                  <div>
                    <p className="text-text-muted text-xs">Call Us</p>
                    <a href="tel:+9779800000000" className="text-text-primary text-sm hover:text-brand-orange transition-colors">
                      +977 9800000000
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-brand-light/30 transition-all duration-300">
                  <div className="w-10 h-10 bg-brand-orange/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaIcon icon="location-dot" size={18} className="text-brand-orange" />
                  </div>
                  <div>
                    <p className="text-text-muted text-xs">Visit Us</p>
                    <p className="text-text-primary text-sm">Hall Chowk, Kawasoti-7, Nawalpur, Nepal</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-divider shadow-xl overflow-hidden">
              <div className="flex items-center gap-2 mb-3">
                <FaIcon icon="location-dot" size={18} className="text-brand-orange" />
                <h3 className="text-text-primary font-semibold">Our Location</h3>
              </div>
              <div className="rounded-xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1767.2323808906417!2d84.12138538848436!3d27.64108895483565!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3994503f3dc7db93%3A0x4364ac945539a147!2sHall%20Chok%2C%20Kawasoti%2033000!5e0!3m2!1sen!2snp!4v1780650078620!5m2!1sen!2snp"
                  width="100%"
                  height="280"
                  style={{ border: 0, borderRadius: '12px' }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="MeroGadget Location Map"
                  className="w-full"
                />
              </div>
              <p className="text-text-muted text-xs text-center mt-3">
                Visit our store for in-person shopping and support
              </p>
            </div>

            {/* Business Hours */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-divider shadow-xl">
              <div className="flex items-center gap-2 mb-3">
                <FaIcon icon="clock" size={18} className="text-brand-orange" />
                <h3 className="text-text-primary font-semibold">Business Hours</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-divider">
                  <span className="text-text-muted">Monday - Friday</span>
                  <span className="text-text-primary">10:00 AM - 7:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-divider">
                  <span className="text-text-muted">Saturday</span>
                  <span className="text-text-primary">11:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-text-muted">Sunday</span>
                  <span className="text-brand-orange font-medium">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;