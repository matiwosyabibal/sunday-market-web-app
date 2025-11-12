import React from 'react';
import { Link } from 'react-router-dom';

const services = [
  {
    id: 1,
    title: 'Premium Electronics',
    description: 'Discover the latest smartphones, laptops, and tablets from top brands with exclusive deals and warranties.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    color: 'from-blue-500 to-indigo-600',
    features: ['Latest Models', '1-Year Warranty', 'Free Shipping'],
    link: '/electronics'
  },
  {
    id: 2,
    title: 'Smart Home Solutions',
    description: 'Transform your living space with our smart home devices and automation systems for ultimate convenience.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    color: 'from-purple-500 to-pink-600',
    features: ['Voice Control', 'Energy Efficient', 'Easy Installation'],
    link: '/smart-home'
  },
  {
    id: 3,
    title: 'Gaming & VR',
    description: 'Immerse yourself in the ultimate gaming experience with high-performance gaming rigs and VR systems.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    color: 'from-red-500 to-amber-500',
    features: ['4K Gaming', 'VR Ready', 'High FPS'],
    link: '/gaming'
  },
  {
    id: 4,
    title: 'Audio & Video',
    description: 'Experience crystal-clear sound and stunning visuals with our premium audio and video equipment.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 010-7.072m0 0l-2.12-2.121m2.12 2.121l2.121-2.121m-2.121 2.121l2.121 2.122m7.07-7.071l-2.121 2.121m0 0l-2.122 2.122m2.122-2.122l-2.121-2.121m-2.122 2.122l-2.121 2.122" />
      </svg>
    ),
    color: 'from-emerald-500 to-teal-600',
    features: ['Surround Sound', '4K/8K Ready', 'Wireless Options'],
    link: '/audio-video'
  },
  {
    id: 5,
    title: 'Wearable Tech',
    description: 'Stay connected and monitor your health with our selection of smartwatches and fitness trackers.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    color: 'from-rose-500 to-pink-600',
    features: ['Health Tracking', 'Long Battery Life', 'Water Resistant'],
    link: '/wearables'
  },
  {
    id: 6,
    title: 'Tech Support',
    description: 'Expert technical support and setup services for all your electronic devices and smart home systems.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'from-amber-500 to-orange-500',
    features: ['24/7 Support', 'Expert Technicians', 'On-site Service'],
    link: '/support'
  }
];

const Services = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-900 via-purple-900 to-fuchsia-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1920&q=80')] opacity-10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Premium Electronics & Tech Services
            </h1>
            <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
              Discover the latest technology and professional services to enhance your digital lifestyle.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/login" 
                className="px-8 py-4 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-semibold rounded-xl hover:from-fuchsia-600 hover:to-pink-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg shadow-md shadow-fuchsia-500/30"
              >
                Shop Now
              </Link>
              <Link 
                to="/contact" 
                className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 text-sm font-semibold text-fuchsia-700 bg-fuchsia-100 rounded-full mb-4">
              Our Services
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Tech Solutions
            </h2>
            <p className="text-lg text-gray-600">
              We offer a wide range of electronic products and services to meet all your technology needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div 
                key={service.id}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              >
                <div className="p-6">
                  <div className={`w-14 h-14 rounded-xl mb-6 flex items-center justify-center text-white bg-gradient-to-br ${service.color}`}>
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-500 mb-2">KEY FEATURES</h4>
                    <ul className="space-y-1.5">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-gray-700">
                          <svg className="w-4 h-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Link 
                    to={service.link}
                    className={`inline-flex items-center text-sm font-semibold text-${service.color.split(' ')[0].replace('from-', '')}-600 hover:text-${service.color.split(' ')[0].replace('from-', '')}-700 group-hover:underline`}
                  >
                    Learn more
                    <svg 
                      className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-indigo-50 via-purple-50 to-fuchsia-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="md:flex">
              <div className="md:flex-shrink-0 md:w-1/2 bg-gradient-to-br from-indigo-800 to-fuchsia-800 p-8 md:p-12 flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-white mb-4">Need Help Choosing?</h3>
                <p className="text-blue-100 mb-6">
                  Our tech experts are here to help you find the perfect electronic devices for your needs.
                </p>
                <div className="flex items-center">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-fuchsia-400 to-pink-500"></div>
                    ))}
                  </div>
                  <div className="ml-4">
                    <div className="text-white font-medium">24/7 Support Team</div>
                    <div className="text-purple-200 text-sm">Average response time: 5 min</div>
                  </div>
                </div>
              </div>
              <div className="p-8 md:p-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Schedule a Consultation</h3>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">Service Interest</label>
                    <select 
                      id="service" 
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                    >
                      <option>Select a service</option>
                      {services.map(service => (
                        <option key={service.id}>{service.title}</option>
                      ))}
                    </select>
                  </div>
                  <button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-fuchsia-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-fuchsia-200"
                  >
                    Get Expert Advice
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Services?
            </h2>
            <p className="text-lg text-gray-600">
              We're committed to providing the best technology solutions with exceptional service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Expert Knowledge',
                description: 'Our team consists of certified professionals with years of experience in the tech industry.',
                icon: '🎓'
              },
              {
                title: 'Quality Products',
                description: 'We source only the highest quality electronics from trusted manufacturers and brands.',
                icon: '⭐'
              },
              {
                title: 'Fast Support',
                description: '24/7 customer support to assist you with any questions or technical issues.',
                icon: '⚡'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-2xl text-center hover:shadow-md transition-shadow duration-300">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
