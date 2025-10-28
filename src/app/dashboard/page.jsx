'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

// Dashboard Page Component
export default function Dashboard() {
  const { data: session } = useSession();
  
  if (!session) {
    redirect('/');
    return null;
  }

  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedProject, setSelectedProject] = useState('all');

  // Mock data for dashboard
  const projects = [
    { id: 1, name: 'E-commerce Platform', progress: 75, status: 'active', team: 8, deadline: '2024-01-15' },
    { id: 2, name: 'Mobile App Redesign', progress: 90, status: 'review', team: 5, deadline: '2023-12-20' },
    { id: 3, name: 'Admin Dashboard', progress: 45, status: 'active', team: 3, deadline: '2024-02-28' },
    { id: 4, name: 'Marketing Website', progress: 100, status: 'completed', team: 6, deadline: '2023-11-30' }
  ];

  const tasks = [
    { id: 1, title: 'Implement user authentication', priority: 'high', status: 'in-progress', dueDate: '2023-12-10', assignee: 'You' },
    { id: 2, title: 'Design homepage layout', priority: 'medium', status: 'todo', dueDate: '2023-12-15', assignee: 'Sarah K.' },
    { id: 3, title: 'Fix responsive issues', priority: 'high', status: 'in-progress', dueDate: '2023-12-08', assignee: 'You' },
    { id: 4, title: 'Write API documentation', priority: 'low', status: 'todo', dueDate: '2023-12-20', assignee: 'Mike T.' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      
      <main className="flex-1 pt-28 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <p className="text-gray-400">Welcome back, <span className="text-blue-400">{session?.user?.name}</span>! Here's what's happening with your projects.</p>
            </div>
            <div className="flex gap-3">
              <select 
                value={selectedPeriod} 
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
              >
                + New Project
              </motion.button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-r from-blue-600/20 to-blue-700/20 backdrop-blur-md rounded-2xl p-6 border border-blue-600/30"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-300 text-sm font-medium">Total Projects</p>
                  <p className="text-3xl font-bold text-white">24</p>
                </div>
                <div className="w-12 h-12 bg-blue-600/30 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center text-green-400 text-sm">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                +12% from last week
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-green-600/20 to-green-700/20 backdrop-blur-md rounded-2xl p-6 border border-green-600/30"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-300 text-sm font-medium">Completed Tasks</p>
                  <p className="text-3xl font-bold text-white">147</p>
                </div>
                <div className="w-12 h-12 bg-green-600/30 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center text-green-400 text-sm">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                +24% from last week
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-purple-600/20 to-purple-700/20 backdrop-blur-md rounded-2xl p-6 border border-purple-600/30"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-300 text-sm font-medium">Team Members</p>
                  <p className="text-3xl font-bold text-white">18</p>
                </div>
                <div className="w-12 h-12 bg-purple-600/30 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center text-yellow-400 text-sm">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                +2 new members
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-orange-600/20 to-orange-700/20 backdrop-blur-md rounded-2xl p-6 border border-orange-600/30"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-300 text-sm font-medium">Pending Tasks</p>
                  <p className="text-3xl font-bold text-white">23</p>
                </div>
                <div className="w-12 h-12 bg-orange-600/30 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center text-red-400 text-sm">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                +5 from yesterday
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Projects Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Active Projects</h2>
                <select 
                  value={selectedProject} 
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="all">All Projects</option>
                  <option value="active">Active</option>
                  <option value="review">In Review</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              <div className="space-y-4">
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{project.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {project.team} team members
                          </span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Due {new Date(project.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        project.status === 'active' ? 'bg-blue-600/20 text-blue-300 border border-blue-600/30' :
                        project.status === 'review' ? 'bg-yellow-600/20 text-yellow-300 border border-yellow-600/30' :
                        'bg-green-600/20 text-green-300 border border-green-600/30'
                      }`}>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-blue-600/20 text-blue-300 rounded-lg border border-blue-600/30 hover:bg-blue-600/30 transition-all duration-300 text-sm"
                      >
                        View Details
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-all duration-300 text-sm"
                      >
                        Edit
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Sidebar with Tasks and Chart */}
            <div className="space-y-8">
              {/* Tasks */}
              <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-xl font-bold text-white mb-6">Your Tasks</h3>
                <div className="space-y-4">
                  {tasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-gray-700/30 rounded-xl border border-gray-600/50"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-white">{task.title}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          task.priority === 'high' ? 'bg-red-600/20 text-red-300' :
                          task.priority === 'medium' ? 'bg-yellow-600/20 text-yellow-300' :
                          'bg-green-600/20 text-green-300'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                        <span>Assigned to {task.assignee}</span>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-3 py-1 rounded text-xs font-medium ${
                            task.status === 'in-progress' ? 'bg-blue-600/20 text-blue-300' :
                            'bg-gray-600/20 text-gray-300'
                          }`}
                        >
                          {task.status.replace('-', ' ')}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1 bg-gray-600/20 text-gray-300 rounded text-xs font-medium hover:bg-gray-500/30 transition-colors duration-300"
                        >
                          Details
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-700/50">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-4 py-2 bg-blue-600/20 text-blue-300 rounded-lg border border-blue-600/30 hover:bg-blue-600/30 transition-all duration-300 text-sm"
                  >
                    View All Tasks
                  </motion.button>
                </div>
              </div>

              {/* Activity Chart */}
              <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-xl font-bold text-white mb-6">Weekly Activity</h3>
                <div className="h-64 flex items-end justify-between gap-2">
                  {[12, 19, 15, 17, 22, 8, 14].map((value, index) => (
                    <motion.div
                      key={index}
                      initial={{ height: 0 }}
                      animate={{ height: `${(value / 22) * 100}%` }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg relative group"
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                        {value} tasks
                      </div>
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-white font-medium">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-400">Completed Tasks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-400">Active Projects</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}