'use client';

import { signOut, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
export default function Welcome() {
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