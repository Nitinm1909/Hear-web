import React, { useState } from 'react';
import './support.css';
import {
  FaUser,
  FaClipboardList,
  FaFilePdf,
  FaPhoneAlt,
  FaHeartbeat,
} from 'react-icons/fa';
import hearingImage from './assets/hearingicon.jpg';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const supportItems = [
  { icon: <FaUser />, title: 'My Account', description: 'Manage your hearing aid account and settings.', type: 'link', path: '/profile' },
  { icon: <FaClipboardList />, title: 'Orders', description: 'Track, modify or cancel your hearing aid orders.', type: 'none' },
  { icon: <FaPhoneAlt />, title: 'Contact Us', description: 'Call, email or visit one of our nearby support centers.', type: 'scroll', path: 'support-us-section' },
  { icon: <FaClipboardList />, title: 'Non-order Related Issues', description: 'Get help with your account related issues.', type: 'none' },
  { icon: <FaFilePdf />, title: `FAQ's`, description: 'Find answers to the most common questions about our services.', type: 'scroll', path: 'faq-section' },
];

const faqs = [
  { question: 'How to track my order?', answer: 'Use the tracking ID sent to your email.' },
  { question: 'What is the return policy?', answer: 'Returns accepted within 30 days.' },
  { question: 'Do you offer international shipping?', answer: 'Yes, with additional charges.' },
];

const Support = () => {
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedback: ''
  });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Support Us form state
  const [supportForm, setSupportForm] = useState({
    patientName: '',
    age: '',
    gender: '',
    phone: '',
    email: '',
    hearingCondition: '',
    additionalNotes: ''
  });
  const [supportMessage, setSupportMessage] = useState('');
  const [isSupportSubmitting, setIsSupportSubmitting] = useState(false);

  const handleSupportChange = (e) => {
    const { name, value } = e.target;
    setSupportForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    setIsSupportSubmitting(true);
    setSupportMessage('');

    if (!supportForm.patientName || !supportForm.age || !supportForm.email || !supportForm.phone) {
      setSupportMessage('Please fill in all required fields.');
      setIsSupportSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('support_requests')
        .insert([
          {
            patient_name: supportForm.patientName,
            age: parseInt(supportForm.age),
            gender: supportForm.gender,
            phone: supportForm.phone,
            email: supportForm.email,
            hearing_condition: supportForm.hearingCondition,
            additional_notes: supportForm.additionalNotes,
            created_at: new Date().toISOString()
          }
        ]);

      if (error) {
        console.error('Error submitting support request:', error);
        setSupportMessage('Error submitting request. Please try again.');
      } else {
        setSupportMessage('Thank you! We will reach out to you soon.');
        setSupportForm({
          patientName: '',
          age: '',
          gender: '',
          phone: '',
          email: '',
          hearingCondition: '',
          additionalNotes: ''
        });
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setSupportMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSupportSubmitting(false);
    }
  };

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  const handleScrollTo = (elementId) => {
    document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    // Basic validation
    if (!formData.name || !formData.email || !formData.feedback) {
      setMessage('Please fill in all fields.');
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('feedback')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            feedback: formData.feedback,
            created_at: new Date().toISOString()
          }
        ]);

      if (error) {
        console.error('Error submitting feedback:', error);
        setMessage('Error submitting feedback. Please try again.');
      } else {
        setMessage('Thank you for your feedback!');
        setFormData({ name: '', email: '', feedback: '' });
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="support-page-wrapper">
      <div className="hero-bg">
        <div className="support-header">
          <h1>We’re here to help</h1>
          <input type="text" placeholder="Search for help..." className="search-input" />
        </div>
      </div>
      <div className="support-main-content">
        <div className="top-card-row">
          {supportItems.map((item, index) => {
            const cardContent = (
              <>
                <div className="icon-circle">{item.icon}</div>
                <h3 className="card-title">{item.title}</h3>
                <p className="card-desc">{item.description}</p>
              </>
            );

            if (item.type === 'link') {
              return (
                <Link to={item.path} key={index} className="support-card-link">
                  <div className="support-card">{cardContent}</div>
                </Link>
              );
            }
            if (item.type === 'scroll') {
              return (
                <div key={index} className="support-card" onClick={() => handleScrollTo(item.path)}>
                  {cardContent}
                </div>
              );
            }
            return (
              <div key={index} className="support-card inactive">
                {cardContent}
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== SUPPORT US FORM ===== */}
      <div id="support-us-section" className="support-us-section">
        <div className="support-us-container">
          <div className="support-us-header">
            <div className="support-us-icon-wrap">
              <FaHeartbeat />
            </div>
            <h2>Support Us</h2>
            <p>Share your details so we can assist you with the best hearing care possible.</p>
          </div>
          <form className="support-us-form" onSubmit={handleSupportSubmit}>
            <div className="support-form-grid">
              <div className="support-form-group">
                <label htmlFor="patientName">Patient Name <span className="required">*</span></label>
                <input
                  type="text"
                  id="patientName"
                  name="patientName"
                  placeholder="Enter full name"
                  value={supportForm.patientName}
                  onChange={handleSupportChange}
                  required
                />
              </div>
              <div className="support-form-group">
                <label htmlFor="age">Age <span className="required">*</span></label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  placeholder="Enter age"
                  min="0"
                  max="150"
                  value={supportForm.age}
                  onChange={handleSupportChange}
                  required
                />
              </div>
              <div className="support-form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={supportForm.gender}
                  onChange={handleSupportChange}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              <div className="support-form-group">
                <label htmlFor="phone">Phone Number <span className="required">*</span></label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Enter phone number"
                  value={supportForm.phone}
                  onChange={handleSupportChange}
                  required
                />
              </div>
              <div className="support-form-group full-width">
                <label htmlFor="supportEmail">Email Address <span className="required">*</span></label>
                <input
                  type="email"
                  id="supportEmail"
                  name="email"
                  placeholder="Enter email address"
                  value={supportForm.email}
                  onChange={handleSupportChange}
                  required
                />
              </div>
              <div className="support-form-group full-width">
                <label htmlFor="hearingCondition">Hearing Condition</label>
                <select
                  id="hearingCondition"
                  name="hearingCondition"
                  value={supportForm.hearingCondition}
                  onChange={handleSupportChange}
                >
                  <option value="">Select condition (if known)</option>
                  <option value="Mild Hearing Loss">Mild Hearing Loss</option>
                  <option value="Moderate Hearing Loss">Moderate Hearing Loss</option>
                  <option value="Severe Hearing Loss">Severe Hearing Loss</option>
                  <option value="Tinnitus">Tinnitus</option>
                  <option value="Not Sure">Not Sure</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="support-form-group full-width">
                <label htmlFor="additionalNotes">Additional Notes</label>
                <textarea
                  id="additionalNotes"
                  name="additionalNotes"
                  placeholder="Any additional information you'd like to share..."
                  rows="3"
                  value={supportForm.additionalNotes}
                  onChange={handleSupportChange}
                />
              </div>
            </div>
            <button type="submit" className="support-submit-btn" disabled={isSupportSubmitting}>
              {isSupportSubmitting ? 'Sending...' : 'Send Request'}
            </button>
            {supportMessage && (
              <p className={supportMessage.includes('Thank you') ? 'success-message' : 'error-message'}>
                {supportMessage}
              </p>
            )}
          </form>
        </div>
      </div>

      <div className="hearing-feedback-section">
        <div className="hearing-image-section">
          <img src={hearingImage} alt="Hearing Aid" />
        </div>
        <div className="feedback-form-section">
          <h3>Submit Your Feedback</h3>
          <form onSubmit={handleFeedbackSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <textarea
              name="feedback"
              placeholder="Your Feedback"
              rows="4"
              value={formData.feedback}
              onChange={handleInputChange}
              required
            />
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Feedback'}
            </button>
            {message && (
              <p className={message.includes('Thank you') ? 'success-message' : 'error-message'}>
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
      <div className="support-main-content">
        <div id="faq-section" className="faq-section">
          <h2>Frequently Asked Questions</h2>
          {faqs.map((faq, index) => (
            <div
              className="faq-item"
              key={index}
              onClick={() => toggleFAQ(index)}
            >
              <div className="faq-question">
                {faq.question}
                <span className="faq-toggle-icon">
                  {activeFAQ === index ? '-' : '+'}
                </span>
              </div>
              {activeFAQ === index && <div className="faq-answer">{faq.answer}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Support;
