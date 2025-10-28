'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

// HomePage Component
export default function HomePage() {
  const { data: session } = useSession();
  
  if (!session) {
    redirect('/');
    return null;
  }

  const features = [
    {
      title: "Dashboard Analytics",
      description: "Monitor your activity and performance with detailed analytics and real-time data visualization.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "User Management",
      description: "Easily manage your profile, preferences, and account settings with our intuitive interface.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "Secure Authentication",
      description: "Your data is protected with enterprise-grade security and encrypted authentication protocols.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      gradient: "from-green-500 to-emerald-500"
    }
  ];

  const stats = [
    { label: "Active Users", value: "2,347", change: "+12.5%", positive: true },
    { label: "Projects Completed", value: "892", change: "+8.2%", positive: true },
    { label: "Customer Satisfaction", value: "98%", change: "+2.1%", positive: true },
    { label: "Response Time", value: "<1s", change: "-0.3s", positive: true }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      
      <main className="flex-1 pt-28 pb-16 px-4">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Welcome to
                </span>
                <br />
                <span className="text-white">TWA Platform</span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Experience the next generation of digital solutions designed to elevate your productivity and streamline your workflow.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get Started
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gray-800 text-white font-semibold rounded-xl border border-gray-600 hover:border-gray-500 transition-all duration-300"
                >
                  Learn More
                </motion.button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 bg-gray-800/50 backdrop-blur-md rounded-3xl p-8 border border-gray-700/50 shadow-2xl">
                <div className="aspect-video bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white">Interactive Dashboard</h3>
                    <p className="text-gray-400 mt-2">Real-time analytics and insights</p>
                  </div>
                </div>
              </div>
              
              {/* Floating decorative elements */}
              <motion.div
                className="absolute -top-6 -left-6 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.4, 0.6, 0.4]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute -bottom-6 -right-6 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.4, 0.6, 0.4]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="max-w-7xl mx-auto mb-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 text-center"
              >
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400 text-sm mb-2">{stat.label}</div>
                <div className={`text-sm font-medium ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.change}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to succeed in the digital world, designed with cutting-edge technology and user experience in mind.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="group bg-gray-800/30 backdrop-blur-md rounded-2xl p-8 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:shadow-2xl"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                <div className="mt-6">
                  <Link 
                    href="#" 
                    className="text-blue-400 font-medium flex items-center group-hover:translate-x-1 transition-transform duration-300"
                  >
                    Learn more
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-md rounded-3xl p-10 border border-gray-700/50 text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-gray-300 mb-8">Join thousands of satisfied users and transform your digital experience today.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Create Your Account
            </motion.button>
          </motion.div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}