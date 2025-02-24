import React from 'react';

export default function About() {
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">About Us</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-8 prose max-w-none">
          <p>
            Welcome to Free Rash Identifier, your educational resource for AI-powered skin condition analysis.
            We're dedicated to helping people learn about common skin conditions through technology while
            promoting proper medical care and consultation.
          </p>

          <h2>Our Mission</h2>
          <p>
            Our mission is to make skin health education accessible to everyone by providing a free, easy-to-use
            identification tool. We aim to help people better understand skin conditions while emphasizing the
            importance of proper medical consultation. Our tool is designed for educational purposes only,
            helping people learn about different types of rashes and skin conditions.
          </p>

          <h2>Why Choose Our Tool?</h2>
          <ul>
            <li>Advanced AI skin condition analysis</li>
            <li>Educational information about common rashes</li>
            <li>Detailed characteristics and symptoms</li>
            <li>General care suggestions</li>
            <li>When to seek medical attention</li>
            <li>Completely free to use</li>
            <li>No registration required</li>
            <li>Privacy-focused approach</li>
            <li>Regular updates to improve accuracy</li>
          </ul>

          <div className="bg-red-50 p-6 rounded-lg my-8">
            <h2 className="text-red-800 mt-0">⚠️ Important Medical Disclaimer</h2>
            <p className="mb-0">
              This rash identification tool is for educational purposes only. Never rely solely on digital
              identification for medical decisions. The tool does not provide medical advice, diagnosis,
              or treatment. Always consult with qualified healthcare professionals for proper diagnosis
              and treatment of skin conditions. If you're experiencing severe symptoms or are concerned
              about a rash, seek immediate medical attention.
            </p>
          </div>

          <h2>Support Our Project</h2>
          <p>
            We're committed to keeping this educational skin condition identifier free and accessible to everyone.
            If you find our tool useful, consider supporting us by buying us a coffee. Your support helps us
            maintain and improve the service, ensuring it remains available to all who want to learn about
            skin health.
          </p>

          <div className="mt-8 text-center">
            <a
              href="https://roihacks.gumroad.com/l/dselxe?utm_campaign=donation-home-page&utm_medium=website&utm_source=rash-identifier"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors text-lg font-semibold"
            >
              Support Our Work
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}