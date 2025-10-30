import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import type { FAQItem,FAQTopic} from "../../types";



const faqData: FAQTopic[] = [
  {
    title: 'Registration',
    items: [
      { question: 'How do I register?', answer: 'You can register using your email ID or mobile number. Fill the registration form and verify your credentials.' },
      { question: 'Do I need to register before shopping on JioMart?', answer: 'Yes, registering allows you to track orders, save addresses, and avail exclusive offers.' },
    ],
  },
  {
    title: 'Product / Price / Promotion',
    items: [
      { question: 'How do I look for a particular Product?', answer: 'Use the search bar on the homepage to type product name, brand, or category.' },
      { question: 'How will you ensure the freshness of products?', answer: 'Freshness is ensured through daily quality checks, temperature-controlled storage, and prompt delivery.' },
    ],
  },
  {
    title: 'Ordering',
    items: [
      { question: 'How do I know if I placed my order correctly?', answer: 'After checkout, you will receive a confirmation email and SMS with your order details.' },
      { question: 'Can I call and place an order?', answer: 'Yes, you can call our customer support at 1800-123-4567 to place an order.' },
    ],
  },
  {
    title: 'Payment',
    items: [
      { question: 'What are the various modes of payment I can use for shopping?', answer: 'You can pay via UPI, Credit/Debit Card, Net Banking, or Cash on Delivery.' },
      { question: 'Can I pay online during the delivery of the product?', answer: 'No, online payments must be completed during checkout; Cash on Delivery is available at delivery.' },
    ],
  },
  {
    title: 'Delivery',
    items: [
      { question: 'How will I know if JioMart delivers to my area?', answer: 'Enter your pincode during checkout to check if delivery is available to your location.' },
      { question: 'How can I check for an expected date of delivery of an order I placed?', answer: 'You can view the expected delivery date in your order summary or confirmation email.' },
    ],
  },
];

export default function HelpAndSupport() {
  const [activeTopic, setActiveTopic] = useState<string | null>(null);

  const toggleTopic = (title: string) => {
    setActiveTopic(activeTopic === title ? null : title);
  };

  return (
      <div
      className="mt-4"
      style={{
        width: '80vw',        
        maxWidth: '1200px',   
        margin: '0 auto',     
        padding: '2rem',
      }}
    >
      <div className="container-fluid" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h4 className="mb-3 fw-bold">Help & Support</h4>
        <p>
          Need assistance? Contact our 24x7 support team at <strong>support@jiomart.com</strong> or call <strong>1800-123-4567</strong>.
        </p>

        <div>
          {faqData.map((topic, idx) => (
            <div key={idx} className="mb-3">
              <p
                onClick={() => toggleTopic(topic.title)}
                style={{
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  color: '#1d1d1fff',
                  marginBottom: '0.5rem',
                }}
              >
                {topic.title}
              </p>

              {activeTopic === topic.title && (
                <div className="ps-3">
                  {topic.items.map((item, i) => (
                    <div key={i} className="mb-2">
                      <strong>{item.question}</strong>
                      <p className="mb-1">{item.answer}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
