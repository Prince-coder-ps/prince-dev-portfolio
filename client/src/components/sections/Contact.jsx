import { useState } from 'react';
import toast from 'react-hot-toast';
import { submitContact } from '../../services/content';
import { apiErrorMessage } from '../../services/api';
import './Contact.css';

const EMPTY = { name: '', email: '', phone: '', subject: '', message: '', honeypot: '' };

const Contact = () => {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Please enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Please enter a valid email.';
    if (!form.message.trim()) next.message = 'Please enter a message.';
    else if (form.message.length > 3000) next.message = 'Message is too long (max 3000 characters).';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await submitContact(form);
      toast.success("Message sent — I'll get back to you soon.");
      setForm(EMPTY);
      setErrors({});
    } catch (err) {
      toast.error(apiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="contact">
      <div className="container">
        <span className="section-kicker">Contact</span>
        <h2 className="section-heading">Let's work together</h2>

        <form className="contact__form" onSubmit={handleSubmit} noValidate>
          {/* Honeypot field — hidden from real users, bots tend to fill it in */}
          <input
            type="text"
            name="honeypot"
            value={form.honeypot}
            onChange={handleChange}
            className="visually-hidden"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          <div className="contact__row">
            <div className="contact__field">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" value={form.name} onChange={handleChange} disabled={submitting} />
              {errors.name && <span className="contact__error">{errors.name}</span>}
            </div>
            <div className="contact__field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" value={form.email} onChange={handleChange} disabled={submitting} />
              {errors.email && <span className="contact__error">{errors.email}</span>}
            </div>
          </div>

          <div className="contact__row">
            <div className="contact__field">
              <label htmlFor="subject">Subject (optional)</label>
              <input id="subject" name="subject" value={form.subject} onChange={handleChange} disabled={submitting} />
            </div>
            <div className="contact__field">
              <label htmlFor="phone">Phone (optional)</label>
              <input id="phone" name="phone" value={form.phone} onChange={handleChange} disabled={submitting} />
            </div>
          </div>

          <div className="contact__field">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows={5} value={form.message} onChange={handleChange} disabled={submitting} />
            {errors.message && <span className="contact__error">{errors.message}</span>}
          </div>

          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Sending…' : 'Send Message'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
