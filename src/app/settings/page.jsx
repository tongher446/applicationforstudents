'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

// Settings Page Component
export default function Settings() {
  const { data: session } = useSession();
  
  if (!session) {
    redirect('/');
    return null;
  }

  const [activeSection, setActiveSection] = useState('profile');
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    notifications: {
      email: true,
      push: true,
      weeklyDigest: false
    },
    theme: 'dark',
    language: 'en'
  });

  const sections = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'integrations', label: 'Integrations', icon: '🔌' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('notifications.')) {
      const notificationKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [notificationKey]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would save this to your database
    console.log('Settings updated:', formData);
    alert('Settings saved successfully!');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      
      <main className="flex-1 pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400 mb-8">Manage your account settings and preferences</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <nav className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-4 border border-gray-700/50">
                <ul className="space-y-2">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <button
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all duration-300 ${
                          activeSection === section.id
                            ? 'bg-blue-600/20 text-blue-300 border border-blue-600/30'
                            : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                        }`}
                      >
                        <span className="text-lg">{section.icon}</span>
                        <span className="font-medium">{section.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            
            {/* Content */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 border border-gray-700/50"
                >
                  {activeSection === 'profile' && (
                    <>
                      <h2 className="text-2xl font-bold text-white mb-6">Profile Settings</h2>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <p className="mt-2 text-sm text-gray-400">This is your login email address</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Profile Picture</label>
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
                              {session?.user?.image ? (
                                <img 
                                  src={session.user.image} 
                                  alt={session.user.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-xl font-bold text-white">
                                  {session?.user?.name?.charAt(0) || 'U'}
                                </span>
                              )}
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              type="button"
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                            >
                              Change Photo
                            </motion.button>
                          </div>
                        </div>
                        
                        <div className="pt-6 border-t border-gray-700/50">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                          >
                            Save Changes
                          </motion.button>
                        </div>
                      </form>
                    </>
                  )}
                  
                  {activeSection === 'notifications' && (
                    <>
                      <h2 className="text-2xl font-bold text-white mb-6">Notification Preferences</h2>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between py-3 border-b border-gray-700/50 last:border-0">
                            <div>
                              <div className="text-white font-medium">Email Notifications</div>
                              <div className="text-gray-400 text-sm">Receive email updates about your account</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                name="notifications.email" 
                                checked={formData.notifications.email} 
                                onChange={handleInputChange} 
                                className="sr-only peer" 
                              />
                              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                          
                          <div className="flex items-center justify-between py-3 border-b border-gray-700/50 last:border-0">
                            <div>
                              <div className="text-white font-medium">Push Notifications</div>
                              <div className="text-gray-400 text-sm">Get push notifications for important updates</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                name="notifications.push" 
                                checked={formData.notifications.push} 
                                onChange={handleInputChange} 
                                className="sr-only peer" 
                              />
                              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                          
                          <div className="flex items-center justify-between py-3 border-b border-gray-700/50 last:border-0">
                            <div>
                              <div className="text-white font-medium">Weekly Digest</div>
                              <div className="text-gray-400 text-sm">Receive a weekly summary of your activity</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                name="notifications.weeklyDigest" 
                                checked={formData.notifications.weeklyDigest} 
                                onChange={handleInputChange} 
                                className="sr-only peer" 
                              />
                              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                        
                        <div className="pt-6 border-t border-gray-700/50">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                          >
                            Save Preferences
                          </motion.button>
                        </div>
                      </form>
                    </>
                  )}
                  
                  {activeSection === 'appearance' && (
                    <>
                      <h2 className="text-2xl font-bold text-white mb-6">Appearance Settings</h2>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Theme</label>
                          <div className="grid grid-cols-2 gap-4">
                            {['light', 'dark', 'system'].map((theme) => (
                              <div 
                                key={theme}
                                className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                                  formData.theme === theme 
                                    ? 'border-blue-500 bg-blue-500/10' 
                                    : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                                }`}
                                onClick={() => setFormData(prev => ({ ...prev, theme }))}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="capitalize text-white">{theme}</span>
                                  {formData.theme === theme && (
                                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
                          <select
                            name="language"
                            value={formData.language}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                            <option value="zh">Chinese</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Font Size</label>
                          <div className="flex items-center gap-4">
                            <input
                              type="range"
                              min="1"
                              max="3"
                              step="1"
                              className="flex-1 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                            />
                            <div className="flex gap-2">
                              <span className="text-sm text-gray-400">Small</span>
                              <span className="text-sm text-gray-400">Medium</span>
                              <span className="text-sm text-gray-400">Large</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="pt-6 border-t border-gray-700/50">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                          >
                            Save Appearance
                          </motion.button>
                        </div>
                      </form>
                    </>
                  )}
                  
                  {activeSection === 'security' && (
                    <>
                      <h2 className="text-2xl font-bold text-white mb-6">Security Settings</h2>
                      <div className="space-y-6">
                        <div className="p-6 bg-gray-700/30 rounded-xl border border-gray-600/50">
                          <h3 className="text-lg font-semibold text-white mb-4">Password</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between py-3">
                              <div>
                                <div className="text-white">Last changed 3 months ago</div>
                                <div className="text-gray-400 text-sm">Your password was last updated on September 15, 2023</div>
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                              >
                                Change Password
                              </motion.button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-6 bg-gray-700/30 rounded-xl border border-gray-600/50">
                          <h3 className="text-lg font-semibold text-white mb-4">Two-Factor Authentication</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between py-3">
                              <div>
                                <div className="text-white">Not enabled</div>
                                <div className="text-gray-400 text-sm">Add an extra layer of security to your account</div>
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                              >
                                Enable 2FA
                              </motion.button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-6 bg-gray-700/30 rounded-xl border border-gray-600/50">
                          <h3 className="text-lg font-semibold text-white mb-4">Active Sessions</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between py-3 border-b border-gray-600/50 last:border-0">
                              <div>
                                <div className="text-white">Current Session</div>
                                <div className="text-gray-400 text-sm">Chrome on macOS • Just now</div>
                              </div>
                              <span className="px-3 py-1 bg-green-600/20 text-green-300 rounded-full text-xs">Current</span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-b border-gray-600/50 last:border-0">
                              <div>
                                <div className="text-white">Previous Session</div>
                                <div className="text-gray-400 text-sm">Safari on iPhone • 2 days ago</div>
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-3 py-1 bg-red-600/20 text-red-300 rounded text-xs hover:bg-red-600/30 transition-colors duration-300"
                              >
                                Sign Out
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {activeSection === 'integrations' && (
                    <>
                      <h2 className="text-2xl font-bold text-white mb-6">Connected Integrations</h2>
                      <div className="space-y-6">
                        {[
                          {
                            name: 'GitHub',
                            description: 'Connect your GitHub account to sync repositories and collaborate on projects',
                            connected: true,
                            logo: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'
                          },
                          {
                            name: 'Google Drive',
                            description: 'Connect your Google Drive to access and share files directly from the platform',
                            connected: false,
                            logo: 'https://ssl.gstatic.com/images/branding/product/2x/drive_96dp.png'
                          },
                          {
                            name: 'Slack',
                            description: 'Connect your Slack workspace to receive notifications and updates',
                            connected: false,
                            logo: 'https://a.slack-edge.com/80588/img/icons/app-256.png'
                          },
                          {
                            name: 'Trello',
                            description: 'Connect your Trello boards to sync tasks and project management',
                            connected: true,
                            logo: 'https://a.trellocdn.com/prgb/dist/images/header-logo-9c7c40f919a626839718.png'
                          }
                        ].map((integration, index) => (
                          <motion.div
                            key={integration.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-6 bg-gray-700/30 rounded-xl border border-gray-600/50 flex items-center justify-between"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-lg bg-gray-600 flex items-center justify-center">
                                <img src={integration.logo} alt={integration.name} className="w-8 h-8 object-contain" />
                              </div>
                              <div>
                                <h3 className="text-white font-medium">{integration.name}</h3>
                                <p className="text-gray-400 text-sm">{integration.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {integration.connected ? (
                                <>
                                  <span className="px-3 py-1 bg-green-600/20 text-green-300 rounded-full text-xs">Connected</span>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors duration-300 text-sm"
                                  >
                                    Disconnect
                                  </motion.button>
                                </>
                              ) : (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 text-sm"
                                >
                                  Connect
                                </motion.button>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}