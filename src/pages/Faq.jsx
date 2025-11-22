import { useState } from 'react';
import { Link } from 'react-router-dom';

const faqs = [
  {
    question: 'What is STEMLink?',
    answer: 'A movement driving change through empowering women to pursue STEM fields of their interests by connecting them to qualified female mentors.'
  },
  {
    question: 'How to join us?',
    answer: 'Click on the sign up button and follow the instructions.'
  },
  {
    question: 'Is there a sign-up fee?',
    answer: 'No, signing up is free of charge.'
  },
  {
    question: 'Is mentorship guaranteed?',
    answer: 'Our team does the best to ensure everyone receives the support they need.'
  }
];

function Faq() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 bg-white rounded shadow border border-gray-300 mb-20">
      <h1 className="text-3xl font-semibold mb-2 text-primary-600 text-center">Frequently Asked Questions</h1>
      <p className="text-center mb-6">Find answers to commonly asked questions about STEMLink</p>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-gray-300 rounded">
            <button
              onClick={() => toggle(index)}
              className="w-full text-left px-4 py-3 font-medium text-primary-700 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-600 flex justify-between items-center"
            >
              <span>{faq.question}</span>
              <span>{openIndex === index ? '-' : '+'}</span>
            </button>
            {openIndex === index && (
              <div className="px-4 py-3 text-gray-700 border-t border-gray-300">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="mt-6 text-center text-gray-700">Still have questions?{' '}
        <Link to="/contact" className="text-primary-600 hover:underline">
          Contact Us
        </Link>
      </p>
    </div>
  );
}

export default Faq;
