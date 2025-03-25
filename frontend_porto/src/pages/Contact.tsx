

import { useState, FormEvent } from 'react';
import NavHeader from '../components/header/NavHeader';
import { EnvelopeIcon, PhoneIcon, MapPinIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import Footer from '../components/Footer';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Message sent! [Placeholder for backend integration]');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavHeader />
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-6 flex items-center">
            <EnvelopeIcon className="w-8 h-8 mr-2 text-blue-600" />
            Contact Us
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h2m-2 0V4a2 2 0 012-2h6a2 2 0 012 2v4" />
                </svg>
                Get in Touch
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                If you have any questions or queries, a member of staff will always be happy to help. Feel free to contact us by telephone or email, and we will be sure to get back to you accordingly.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPinIcon className="w-5 h-5 text-blue-600 mr-2 mt-1" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">Our Address</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Plot no: 34/35 Mandela Road, Tabata Relini, Mwananchi, Dar es Salaam, Tanzania
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <EnvelopeIcon className="w-5 h-5 text-blue-600 mr-2 mt-1" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">Email Us</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      <a href="mailto:support@mwananchi.co.tz" className="hover:text-blue-500">support@mwananchi.co.tz</a>
                      <br />
                      <a href="mailto:jtarimo@tz.nationmedia.com" className="hover:text-blue-500">jtarimo@tz.nationmedia.com (Advertising)</a>
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <PhoneIcon className="w-5 h-5 text-blue-600 mr-2 mt-1" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">Call Us</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      <a href="tel:+255754780647" className="hover:text-blue-500">+255 754 780 647</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <PaperAirplaneIcon className="w-6 h-6 mr-2 text-blue-600" />
                Send Us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 flex items-center">
                    <svg className="w-5 h-5 mr-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 flex items-center">
                    <EnvelopeIcon className="w-5 h-5 mr-1 text-blue-600" />
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-gray-700 dark:text-gray-300 flex items-center">
                    <svg className="w-5 h-5 mr-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 flex items-center">
                    <svg className="w-5 h-5 mr-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
                >
                  <PaperAirplaneIcon className="w-5 h-5 mr-1" />
                  Send Message
                </button>
              </form>
            </div>
          </div>

        
        </div>
      </div>
      <Footer/>
    </div>
  );
}