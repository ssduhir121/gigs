import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ChartBarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

// Import modal-ready components
import Login from './Login';
import Register from './Register';
import CompanyRegister from './CompanyRegister';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeModal, setActiveModal] = useState(null); // 'login', 'register', 'company-register'

  const features = [
    {
      icon: CurrencyDollarIcon,
      title: 'Earn Money',
      description: 'Get paid for sharing authentic content with your audience. Turn your social influence into income.',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: UserGroupIcon,
      title: 'Connect with Brands',
      description: 'Collaborate with amazing brands and create meaningful partnerships that benefit both parties.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Verified System',
      description: 'Our verification system ensures fair compensation and authentic engagement for all parties.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: ChartBarIcon,
      title: 'Track Performance',
      description: 'Monitor your campaign performance with detailed analytics and real-time tracking.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Active Creators' },
    { number: '500+', label: 'Brand Partners' },
    { number: '$2M+', label: 'Paid to Creators' },
    { number: '50K+', label: 'Successful Campaigns' }
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Sign Up',
      description: 'Create your creator profile in minutes'
    },
    {
      step: '2',
      title: 'Browse Gigs',
      description: 'Discover campaigns that match your audience'
    },
    {
      step: '3',
      title: 'Apply & Create',
      description: 'Submit your application and create amazing content'
    },
    {
      step: '4',
      title: 'Get Paid',
      description: 'Receive payment once your content is verified'
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Lifestyle Influencer",
      content: "I've earned over $5,000 in just 3 months! The platform is so easy to use and brands actually pay well for quality content.",
      earnings: "$5,000+"
    },
    {
      name: "Mike Rodriguez",
      role: "Tech Reviewer",
      content: "As a tech creator, I love working with innovative brands. The verification system ensures I always get paid on time.",
      earnings: "$3,200+"
    },
    {
      name: "Emily Johnson",
      role: "Fashion Blogger",
      content: "The best platform for fashion influencers. I've built long-term relationships with amazing brands through this platform.",
      earnings: "$7,500+"
    }
  ];

  // Modal wrapper component
const Modal = ({ children, onClose, wide = false }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-in fade-in-50">
    <div className={`${wide ? 'max-w-[95vw] lg:max-w-6xl' : 'max-w-md'} w-full max-h-[90vh] overflow-y-auto`}>
      {children}
    </div>
  </div>
);

  return (
    <div className="min-h-screen">
      {/* Modals */}
   {/* Modals */}
{activeModal === 'login' && (
  <Modal onClose={() => setActiveModal(null)}>
    <Login 
      onClose={() => setActiveModal(null)}
      onSwitchToRegister={() => setActiveModal('register')}
      onSwitchToCompanyRegister={() => setActiveModal('company-register')}
    />
  </Modal>
)}

{activeModal === 'register' && (
  <Modal onClose={() => setActiveModal(null)}>
    <Register 
      onClose={() => setActiveModal(null)}
      onSwitchToLogin={() => setActiveModal('login')}
      onSwitchToCompanyRegister={() => setActiveModal('company-register')}
    />
  </Modal>
)}

{activeModal === 'company-register' && (
  <Modal onClose={() => setActiveModal(null)} wide={true}>
    <CompanyRegister 
      onClose={() => setActiveModal(null)}
      onSwitchToLogin={() => setActiveModal('login')}
      onSwitchToRegister={() => setActiveModal('register')}
    />
  </Modal>
)}

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Turn Your Influence
              <span className="block text-blue-200">Into Income</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Connect with top brands, share authentic content, and get paid for your social media influence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {!isAuthenticated ? (
                <>
                  <button
                    onClick={() => setActiveModal('register')}
                    className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
                  >
                    Start Earning Today
                    <RocketLaunchIcon className="w-5 h-5 ml-2" />
                  </button>
                  <button
                    onClick={() => setActiveModal('login')}
                    className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
                  >
                    Sign In
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/gigs"
                    className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Browse Gigs
                    <ArrowRightIcon className="w-5 h-5 ml-2" />
                  </Link>
                  <Link
                    to="/create-gig"
                    className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200 flex items-center focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
                  >
                    Create Gig
                    <PlusIcon className="w-5 h-5 ml-2" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Social Posts Sharers?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We've built the most creator-friendly platform that puts you first
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Start earning in just a few simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of creators who are already earning with Social Posts Sharers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => setActiveModal('register')}
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600"
                >
                  Create Account
                </button>
                <button
                  onClick={() => setActiveModal('login')}
                  className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600"
                >
                  Sign In
                </button>
              </>
            ) : (
              <Link
                to="/gigs"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600"
              >
                Explore Available Gigs
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Link>
            )}
          </div>
          
          {/* Company Registration CTA */}
          {!isAuthenticated && (
            <div className="mt-8">
              <p className="text-blue-200 mb-4">Are you a business looking to collaborate with creators?</p>
              <button
                onClick={() => setActiveModal('company-register')}
                className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 focus:ring-offset-purple-600"
              >
                Register Your Company
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Creators Say
            </h2>
            <p className="text-xl text-gray-600">
              Real stories from real creators
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{testimonial.content}</p>
                <div className="flex items-center text-green-600 font-semibold">
                  <CurrencyDollarIcon className="w-4 h-4 mr-1" />
                  Earned: {testimonial.earnings}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// Plus Icon Component
const PlusIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

export default Home;