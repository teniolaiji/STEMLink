import { useState } from 'react';
import emailjs from '@emailjs/browser';

function ContactUs() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      setStatus('Please fill in all fields.');
      return;
    }
    setStatus('Sending...');
    emailjs.send(
      'STEMLink2025',
      'template_aqbgt5l',
      {
        to_name: 'STEMLink',
        from_first_name: formData.firstName,
        from_last_name: formData.lastName,
        from_email: formData.email,
        message: formData.message,
      },
      'FkfAkJ8XJDzvN520x'
    ).then(() => {
      setStatus('Message sent successfully!');
      setFormData({ firstName: '', lastName: '', email: '', message: '' });
    }, () => {
      setStatus('Failed to send message, please try again later.');
    });
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 mb-16 p-6 bg-white rounded shadow border border-gray-300">
      <h1 className="text-3xl font-semibold mb-2 text-center text-primary-600">Contact Us</h1>

      <p className="text-center mb-6">We'd love to hear from you. Send us a message!</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
            required
          />
        </div>

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
          required
        />

        <textarea
          name="message"
          placeholder="Tell us how we can help you"
          value={formData.message}
          onChange={handleChange}
          rows="5"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
          required
        />

        {status && <p className="text-center text-sm text-gray-700">{status}</p>}

        <div className="text-center">
          <button
            type="submit"
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-2 rounded transition-colors"
          >
            Send Message
          </button>
          <p className="mt-2 text-center text-gray-600 text-sm">We respond within 72 hours</p>
        </div>
      </form>
    </div>
  );
}

export default ContactUs;
