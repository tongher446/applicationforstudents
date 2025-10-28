'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('/');
  const [hoveredLink, setHoveredLink] = useState(null);

  const navItems = [
    { name: 'Home', href: '/home' },
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
              TWA<span className="text-white">.</span>
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
                  <Link
                    href={item.href}
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
                  </Link>
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
}