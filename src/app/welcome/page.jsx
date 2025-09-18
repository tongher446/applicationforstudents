'use client';

import { signOut } from 'next-auth/react';
import React from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Navbar Component
const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeLink, setActiveLink] = React.useState('/');
  const [hoveredLink, setHoveredLink] = React.useState(null);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Profile', href: '/profile' },
    { name: 'Settings', href: '/settings' },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = (href) => {
    setActiveLink(href);
    setIsOpen(false);
  };

  const navbarVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 20,
        duration: 0.8
      }
    }
  };

  const linkHoverVariants = {
    hover: {
      scale: 1.1,
      textShadow: "0 0 8px rgba(59, 130, 246, 0.5)",
      transition: { duration: 0.2 }
    }
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        ease: "easeOut"
      }
    })
  };

  const hamburgerVariants = {
    closed: { rotate: 0 },
    open: { rotate: 180 }
  };

  const underlineVariants = {
    initial: { width: "0%", left: "0%" },
    animate: (index) => ({
      width: "100%",
      left: `${index * 25}%`,
      transition: { duration: 0.5, ease: "easeOut" }
    })
  };

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 backdrop-blur-md bg-opacity-90 border-b border-gray-700/50"
      initial="hidden"
      animate="visible"
      variants={navbarVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div 
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              NAV<span className="text-white">.</span>
            </h1>
          </motion.div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1 relative">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  className="relative"
                  variants={linkHoverVariants}
                  whileHover="hover"
                  onHoverStart={() => setHoveredLink(item.href)}
                  onHoverEnd={() => setHoveredLink(null)}
                >
                  <button
                    onClick={() => handleLinkClick(item.href)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 relative z-10 ${
                      activeLink === item.href
                        ? 'text-blue-400'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {item.name}
                    {hoveredLink === item.href && (
                      <motion.div
                        className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-400 rounded-full"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        exit={{ scaleX: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </button>
                </motion.div>
              ))}
              
              <motion.div
                className="absolute bottom-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                variants={underlineVariants}
                initial="initial"
                animate="animate"
                custom={navItems.findIndex(item => item.href === activeLink)}
              />
            </div>
          </div>

          <div className="md:hidden">
            <motion.button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-all duration-300"
              variants={hamburgerVariants}
              animate={isOpen ? "open" : "closed"}
            >
              <span className="sr-only">Open main menu</span>
              <div className="space-y-1.5">
                <motion.span
                  className="block w-6 h-0.5 bg-white transition-all duration-300"
                  animate={{ 
                    rotate: isOpen ? "45deg" : "0deg",
                    y: isOpen ? "8px" : "0px"
                  }}
                />
                <motion.span
                  className="block w-6 h-0.5 bg-white transition-all duration-300"
                  animate={{ 
                    opacity: isOpen ? 0 : 1,
                    width: isOpen ? "0%" : "100%"
                  }}
                />
                <motion.span
                  className="block w-6 h-0.5 bg-white transition-all duration-300"
                  animate={{ 
                    rotate: isOpen ? "-45deg" : "0deg",
                    y: isOpen ? "-8px" : "0px"
                  }}
                />
              </div>
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden bg-gradient-to-b from-gray-800 to-gray-900 border-t border-gray-700/50"
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.href}
                  onClick={() => handleLinkClick(item.href)}
                  className={`block w-full text-left px-3 py-3 rounded-md text-base font-medium transition-all duration-300 ${
                    activeLink === item.href
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                  variants={menuItemVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center justify-between">
                    <span>{item.name}</span>
                    {activeLink === item.href && (
                      <motion.div
                        className="w-2 h-2 bg-blue-400 rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-30"
            style={{
              left: `${20 + i * 15}%`,
              top: '50%'
            }}
            animate={{
              y: [0, -10, 0],
              x: [0, i % 2 === 0 ? 5 : -5, 0],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </motion.nav>
  );
};

// Footer Component
const Footer = () => {
  const [email, setEmail] = React.useState('');
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [currentYear, setCurrentYear] = React.useState(new Date().getFullYear());

  React.useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setEmail('');
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  const footerItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: "easeOut"
      }
    })
  };

  const socialIconVariants = {
    hover: {
      y: -5,
      scale: 1.1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10
      }
    }
  };

  const newsletterVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const copyrightVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.5,
        duration: 0.8
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <footer className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden mt-20 pt-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 25}%`
            }}
            animate={{
              y: [0, i % 2 === 0 ? -15 : 15, 0],
              x: [0, i % 3 === 0 ? 10 : -10, 0],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
        
        <motion.div
          className="absolute w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
          style={{ top: '10%', left: '10%' }}
          variants={floatingVariants}
          animate="animate"
        />
        <motion.div
          className="absolute w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"
          style={{ bottom: '10%', right: '10%' }}
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 1 }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          <motion.div 
            className="space-y-4"
            variants={footerItemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={0}
          >
            <motion.div 
              className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              NAV<span className="text-white">.</span>
            </motion.div>
            <p className="text-gray-400 leading-relaxed">
              Creating beautiful digital experiences with cutting-edge technology and innovative design.
            </p>
            <div className="flex space-x-4">
              {['Twitter', 'Facebook', 'Instagram', 'LinkedIn'].map((social, index) => (
                <motion.a
                  key={social}
                  href="#"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                  variants={socialIconVariants}
                  whileHover="hover"
                >
                  <span className="sr-only">{social}</span>
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-blue-600 transition-colors duration-300">
                    {social.charAt(0)}
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div 
            variants={footerItemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={1}
          >
            <h3 className="text-lg font-semibold mb-4 text-white border-b border-gray-700 pb-2">Quick Links</h3>
            <ul className="space-y-3">
              {['Home', 'About', 'Services', 'Portfolio', 'Blog', 'Contact'].map((link, index) => (
                <motion.li 
                  key={link}
                  variants={footerItemVariants}
                  initial="hidden"
                  whileInView="visible"
                  custom={index}
                >
                  <a 
                    href={`/${link.toLowerCase()}`}
                    className="text-gray-400 hover:text-blue-400 transition-all duration-300 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-gray-600 rounded-full mr-3 group-hover:bg-blue-400 transition-colors duration-300"></span>
                    {link}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            variants={footerItemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={2}
          >
            <h3 className="text-lg font-semibold mb-4 text-white border-b border-gray-700 pb-2">Services</h3>
            <ul className="space-y-3">
              {['Web Development', 'UI/UX Design', 'Mobile Apps', 'SEO Optimization', 'Digital Marketing', 'Consulting'].map((service, index) => (
                <motion.li 
                  key={service}
                  variants={footerItemVariants}
                  initial="hidden"
                  whileInView="visible"
                  custom={index}
                >
                  <a 
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition-all duration-300 group"
                  >
                    <span className="inline-block transform group-hover:translate-x-1 transition-transform duration-300">
                      →
                    </span>
                    <span className="ml-2">{service}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            variants={newsletterVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <h3 className="text-lg font-semibold mb-4 text-white border-b border-gray-700 pb-2">Newsletter</h3>
            <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest updates and offers.</p>
            
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form 
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      required
                    />
                  </div>
                  <motion.button
                    type="submit"
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Subscribe
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  className="text-center py-6"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-green-400 mb-2">Thank you!</h4>
                  <p className="text-gray-400">You've been subscribed successfully.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <motion.div 
          className="pt-8 mt-8 border-t border-gray-800"
          variants={copyrightVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} NAV. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center md:justify-end space-x-6">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                <motion.a
                  key={item}
                  href="#"
                  className="text-gray-400 text-sm hover:text-blue-400 transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.button
          className="fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 z-50"
          whileHover={{ scale: 1.1, rotate: 360 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.button>
      </div>
    </footer>
  );
};

// Welcome Page Component
function Welcome() {
  const { data: session } = useSession();
  
  if (!session) {
    redirect('/');
    return null;
  }

  console.log("session", session);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      
      <main className="flex-1 flex flex-col justify-center items-center w-full pt-24 pb-12 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container w-full max-w-2xl border border-blue-300/30 bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-2xl h-96 flex flex-col justify-center items-center p-8"
        >
          <motion.button
            onClick={() => signOut()}
            className="border-2 border-red-500 rounded-2xl cursor-pointer w-48 h-12 flex justify-center items-center bg-red-600/20 hover:bg-red-600/30 text-red-300 font-medium transition-all duration-300 mb-8"
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(239, 68, 68, 0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            Sign Out
          </motion.button>
          
          <motion.div 
            className="text-center text-white text-xl font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Welcome, <span className="text-blue-400 font-bold">{session?.user?.name}</span>!
            <br />
            <span className="text-gray-300 text-lg">You are now in our application system.</span>
          </motion.div>
          
          {/* Animated welcome decoration */}
          <motion.div
            className="absolute -top-4 -right-4 w-16 h-16 bg-blue-500/20 rounded-full blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div
            className="absolute -bottom-4 -left-4 w-16 h-16 bg-purple-500/20 rounded-full blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
}

export default Welcome;