'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';

function WelcomePage() {
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0); // 0 for login, 1 for signup
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPasswordsignup, setShowPasswordsignup] = useState(false);
  const [showcomfirmPW, setShowcomfirmPW] = useState(false);
  const [successreg, setSuccessreg] = useState(false);
  const router = useRouter();
  const [signInError, setSignInError] = useState("");
  const {  session } = useSession();
  const [isLocked, setIsLocked] = useState(false);
  const [lockedEndTime, setLockedEndTime] = useState(null);
  const [attemp, setAttemp] = useState(0);
  const [timeRemain, setTimeRemain] = useState('');
  const [remainAttemp, setRemainAttemp] = useState(10);
  const [lockError, setLockedError] = useState('');
  const MAX_ATTEMP = 3;
  const LOCKOUT_DURATION = 30000;

  if (session) {
    redirect('/welcome');
  };

  const togglePasswordsignup = () => {
    setShowPasswordsignup(!showPasswordsignup);
  }
  const togglePWconfirm = () => {
    setShowcomfirmPW(!showcomfirmPW)
  }

  useEffect(() => {
    if (isLocked && lockedEndTime) {
      const updateTimer = () => {
        const now = Date.now();
        const diff = lockedEndTime - now;

        if (diff <= 0) {
          setIsLocked(false);
          setRemainAttemp(3);
          setAttemp(0);
          setLockedEndTime(null);
          setTimeRemain('00:00:00');
          return;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeRemain(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      };

      updateTimer();

      const timerInterval = setInterval(updateTimer, 1000);

      return () => clearInterval(timerInterval);
    };
  }, [isLocked, lockedEndTime]);

  // Set isClient to true only after component mounts on client
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error])
  
  useEffect(() => {
    const timer = setTimeout(() => setSuccessreg(false), 3000);
    return () => clearTimeout(timer);
  }, [successreg])

  const closeModal = () => {
    setIsOpen(false);
    resetForm();
    setShowPassword(false);
    setShowPasswordsignup(false);
    setShowcomfirmPW(false);
  }

  const togglePassword = () => {
    setShowPassword(!showPassword);
  }

  const toggleModal = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      resetForm();
      setShowPassword(false);
      setShowPasswordsignup(false);
      setShowcomfirmPW(false);
    }
  }

  const handleModalClick = (e) => {
    e.stopPropagation();
  }

  const validateEmail = (email) => {
    if (!email) return 'ກະລຸນາປ້ອນອິເມວຂອງທ່ານ';
    if (!/\S+@\S+\.\S+/.test(email)) return `${email} ບໍ່ຖືກຕ້ອງ`;
    return '';
  }

  const validatePassword = (password) => {
    if (!password) return 'ກະລຸນາປ້ອນລະຫັດຜ່ານຂອງທ່ານ';
    if (password.length < 6) return 'ລະຫັດຜ່ານຕ້ອງມີຢ່າງໜ້ອຍ 6 ຕົວ';
    return '';
  }

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    if (emailError && value) {
      setEmailError(validateEmail(value));
    }
  }
 
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    
    if (passwordError && value) {
      setPasswordError(validatePassword(value));
    }
  }

  const handleSignupChange = (field, value) => {
    setSignupData({ ...signupData, [field]: value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isLocked) {
      setLockedError(`You have tried to login too many times. Please try again in ${timeRemain}`);
      setLoading(false);
      return;
    }

    const emailValidationError = validateEmail(email);
    const passwordValidationError = validatePassword(password);

    if (emailValidationError || passwordValidationError) {
      setEmailError(emailValidationError);
      setPasswordError(passwordValidationError);
      setLoading(false);
      return;
    }

    try {
      const res = await signIn('credentials', {
        email, password, redirect: false
      });

      if (res.error) {
        const newAttemp = attemp + 1;
        setAttemp(newAttemp);
        setRemainAttemp(Math.max(0, MAX_ATTEMP - newAttemp));
        setSignInError("Email or password is incorrect!");
        setLoading(false);
        if (newAttemp >= MAX_ATTEMP) {
          const unlockTime = Date.now() + LOCKOUT_DURATION;
          setIsLocked(true);
          setLockedEndTime(unlockTime);
          setLockedError('Your account has been locked. Please try again later');
        } else {
          setLockedError(`Invalid credentials. ${MAX_ATTEMP - newAttemp} attempts remaining!`);
        }
      } else {
        setSignInError('');
        setRemainAttemp(3);
        setAttemp(0);
        setIsLocked(false);
        setLoading(false);
        setLockedEndTime(null);
        setTimeout(() => router.replace("/welcome"), 2000);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(true);
    }
  }

  const handleKeyPress = (e, nextInputID) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextInputID) {
        document.getElementById(nextInputID)?.focus();
      }
    }
  }

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!signupData.name || !signupData.email || !signupData.password || !signupData.confirmPassword) {
      setError("Please fill all the fields");
      setLoading(false);
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (signupData.password.length < 6) {
      setError("ລະຫັດຜ່ານຕ້ອງມີຢ່າງໜ້ອຍ 6 ຕົວ");
      setLoading(false);
      return;
    }
    
    try {
      const resCheckUser = await fetch("/api/checkUser", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({ email: signupData.email })
      });

      const { user } = await resCheckUser.json();

      if (user) {
        setError("User with this email already exists");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: signupData.name,
          email: signupData.email,
          password: signupData.password,
        }),
      });

      if (response.ok) {
        setSuccessreg(true);
        resetForm();
        setActiveSlide(0);
      }
    } catch (error) {
      setError("Error during signup. Please try again.");
      console.error('Error during signup:', error);
    } finally {
      setLoading(false);
    }
  }

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setEmailError('');
    setPasswordError('');
    setShowPassword(false);
    setSignupData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Modern, beautiful modal with animations
  const renderModal = () => {
    if (!isClient) return null;
    
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleModal}
          >
            <motion.div 
              className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[95vh] overflow-hidden"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={handleModalClick}
            >
              {/* Close button */}
              <button 
                onClick={closeModal}
                className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-200 z-10"
              >
                ×
              </button>

              {/* Sliding container */}
              <div className="relative h-[calc(95vh-3rem)] max-h-[600px] overflow-hidden">
                {/* Login Slide */}
                <motion.div 
                  className={`absolute inset-0 flex flex-col transition-opacity duration-500 ${
                    activeSlide === 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                  key="login-slide"
                >
                  <div className="flex-1 overflow-y-auto px-8 py-10">
                    <div className="text-center mb-8">
                      <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Image src='/image/logo.png' alt='logo' width={50} height={50} className='rounded-full object-cover' />
                      </div>
                      <h1 className="text-3xl font-bold text-gray-800 mb-2">ຍິນດີຕ້ອນຮັບ</h1>
                      <p className="text-gray-600">TWA - Together We Achieve</p>
                    </div>

                    {isLocked && lockedEndTime && (
                      <motion.div 
                        className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="flex items-center mb-3">
                          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mr-3">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <h3 className="text-red-800 font-semibold">ບັນຊີຖືກລັອກ</h3>
                        </div>
                        <p className="text-red-700 text-sm mb-3">
                          ບັນຊີຂອງທ່ານຖືກລັອກເນື່ອງຈາກການລອງເຂົ້າສູ່ລະບົບບໍ່ສຳເລັດຫຼາຍຄັ້ງ
                        </p>
                        <div className="bg-red-100 rounded-lg p-3 text-center">
                          <p className="text-red-800 text-sm font-medium">
                            ກະລຸນາລອງໃໝ່ອີກຄັ້ງໃນ: <span className="font-bold text-lg text-red-600">{timeRemain}</span>
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {!isLocked && (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">ອິເມວ</label>
                          <div className={`relative rounded-xl overflow-hidden border-2 transition-colors duration-300 ${
                            emailError ? 'border-red-500' : 'border-gray-300 hover:border-blue-400 focus-within:border-blue-500'
                          }`}>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Image src="/image/mail.png" alt="email" width={20} height={20} className="text-gray-400" />
                            </div>
                            <input
                              id='email'
                              type="email" 
                              placeholder='ອິເມວຂອງທ່ານ' 
                              value={email}
                              onChange={handleEmailChange} 
                              onKeyPress={(e) => handleKeyPress(e, 'password')}
                              className='block w-full pl-10 pr-4 py-3 border-0 focus:ring-0 focus:outline-none text-gray-900 placeholder-gray-500'
                            />
                          </div>
                          {emailError && (
                            <p className="mt-1 text-sm text-red-600">{emailError}</p>
                          )}
                        </div>
                        
                        <div>
                          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">ລະຫັດຜ່ານ</label>
                          <div className={`relative rounded-xl overflow-hidden border-2 transition-colors duration-300 ${
                            passwordError ? 'border-red-500' : 'border-gray-300 hover:border-blue-400 focus-within:border-blue-500'
                          }`}>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Image src="/image/padlock.png" alt="icon" width={20} height={20} className="text-gray-400" />
                            </div>
                            <input
                              id='password'
                              type={showPassword ? "text" : "password"} 
                              placeholder="ລະຫັດຜ່ານຂອງທ່ານ" 
                              value={password}
                              onChange={handlePasswordChange} 
                              onKeyPress={(e) => handleKeyPress(e, 'login-button')}
                              className='block w-full pl-10 pr-12 py-3 border-0 focus:ring-0 focus:outline-none text-gray-900 placeholder-gray-500'
                            />
                            <button
                              type="button"
                              onClick={togglePassword}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                              <Image 
                                src={showPassword ? "/image/show.png" : "/image/hide.png"} 
                                alt='icon' 
                                width={20} 
                                height={20} 
                                className='cursor-pointer' 
                              />
                            </button>
                          </div>
                          {passwordError && (
                            <p className="mt-1 text-sm text-red-600">{passwordError}</p>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <Link href={`/resetPassword?email=${encodeURIComponent(email)}`} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                            ລືມລະຫັດຜ່ານ?
                          </Link>
                        </div>

                        {signInError && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{signInError}</p>
                          </div>
                        )}

                        <motion.button
                          id="login-button"
                          type="submit" 
                          className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${loading ? 'opacity-70 cursor-not-allowed': ''}`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          disabled={loading}
                        >
                          {loading ? "ກຳລັງເຂົ້າສູ່ລະບົບ...":"ເຂົ້າສູ່ລະບົບ"}
                        </motion.button>

                        <div className="text-center">
                          <p className="text-gray-600 mb-4">ຍັງບໍ່ມີບັນຊີ?</p>
                          <motion.button
                            type='button' 
                            onClick={() => setActiveSlide(1)}
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-xl font-medium shadow-lg hover:shadow-xl hover:from-green-700 hover:to-emerald-700 transform hover:scale-[1.02] transition-all duration-300"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            ສ້າງບັນຊີໃໝ່
                          </motion.button>
                        </div>
                      </form>
                    )}
                  </div>
                </motion.div>

                {/* Signup Slide */}
                <motion.div 
                  className={`absolute inset-0 flex flex-col transition-opacity duration-500 ${
                    activeSlide === 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                  key="signup-slide"
                >
                  <div className="flex-1 overflow-y-auto px-8 py-10">
                    <div className="text-center mb-8">
                      <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                        <Image src='/image/logo.png' alt='logo' width={50} height={50} className='rounded-full object-cover' />
                      </div>
                      <h1 className="text-3xl font-bold text-gray-800 mb-2">ສ້າງບັນຊີໃໝ່</h1>
                      <p className="text-gray-600">ເຂົ້າຮ່ວມກັບຄອບຄົວ TWA</p>
                    </div>

                    {successreg && (
                      <motion.div 
                        className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-center"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                      >
                        <div className="flex items-center justify-center mb-2">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-2">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <h3 className="text-green-800 font-semibold">ສ້າງບັນຊີສຳເລັດ!</h3>
                        </div>
                        <p className="text-green-700 text-sm">
                          ບັນຊີຂອງທ່ານຖືກສ້າງຂຶ້ນແລ້ວ. ກະລຸນາລອງເຂົ້າສູ່ລະບົບ.
                        </p>
                      </motion.div>
                    )}


                    <form onSubmit={handleSignupSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">ຊື່ ແລະ ນາມສະກຸນ</label>
                        <div className="relative rounded-xl overflow-hidden border-2 border-gray-300 hover:border-green-400 focus-within:border-green-500 transition-colors duration-300">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Image src="/image/user.png" alt="name" width={20} height={20} className="text-gray-400" />
                          </div>
                          <input
                            id='name'
                            type="text" 
                            placeholder='ຊື່ ແລະ ນາມສະກຸນຂອງທ່ານ' 
                            value={signupData.name}
                            onKeyPress={(e) => handleKeyPress(e, 'signup-email')}
                            onChange={(e) => handleSignupChange('name', e.target.value)} 
                            className='block w-full pl-10 pr-4 py-3 border-0 focus:ring-0 focus:outline-none text-gray-900 placeholder-gray-500'
                            />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-2">ອິເມວ</label>
                        <div className="relative rounded-xl overflow-hidden border-2 border-gray-300 hover:border-green-400 focus-within:border-green-500 transition-colors duration-300">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Image src="/image/mail.png" alt="email" width={20} height={20} className="text-gray-400" />
                          </div>
                          <input
                            id='signup-email'
                            type="email" 
                            placeholder='ອິເມວຂອງທ່ານ' 
                            value={signupData.email}
                            onKeyPress={(e) => handleKeyPress(e, 'signup-password')}
                            onChange={(e) => handleSignupChange('email', e.target.value)} 
                            className='block w-full pl-10 pr-4 py-3 border-0 focus:ring-0 focus:outline-none text-gray-900 placeholder-gray-500'
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-2">ລະຫັດຜ່ານ</label>
                        <div className="relative rounded-xl overflow-hidden border-2 border-gray-300 hover:border-green-400 focus-within:border-green-500 transition-colors duration-300">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Image src="/image/padlock.png" alt="icon" width={20} height={20} className="text-gray-400" />
                          </div>
                          <input
                            id='signup-password'
                            type={showPasswordsignup ? "text" : "password"}
                            placeholder="ລະຫັດຜ່ານຂອງທ່ານ (ຢ່າງໜ້ອຍ 6 ຕົວ)" 
                            value={signupData.password}
                            onKeyPress={(e) => handleKeyPress(e, 'confirm-password')}
                            onChange={(e) => handleSignupChange('password', e.target.value)} 
                            className='block w-full pl-10 pr-12 py-3 border-0 focus:ring-0 focus:outline-none text-gray-900 placeholder-gray-500'
                            />
                          <button
                            type="button"
                            onClick={togglePasswordsignup}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                            <Image 
                              src={showPasswordsignup ? "/image/show.png" : "/image/hide.png"} 
                              alt='icon' 
                              width={20} 
                              height={20} 
                              className='cursor-pointer' 
                            />
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">ຢືນຢັນລະຫັດຜ່ານ</label>
                        <div className="relative rounded-xl overflow-hidden border-2 border-gray-300 hover:border-green-400 focus-within:border-green-500 transition-colors duration-300">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Image src="/image/padlock.png" alt="icon" width={20} height={20} className="text-gray-400" />
                          </div>
                          <input
                            id='confirm-password'
                            type={showcomfirmPW ? "text" : "password"}
                            placeholder="ຢືນຢັນລະຫັດຜ່ານຂອງທ່ານ" 
                            value={signupData.confirmPassword}
                            onKeyPress={(e) => handleKeyPress(e, "signup-button")}
                            onChange={(e) => handleSignupChange('confirmPassword', e.target.value)} 
                            className='block w-full pl-10 pr-12 py-3 border-0 focus:ring-0 focus:outline-none text-gray-900 placeholder-gray-500'
                          />
                          <button
                            type="button"
                            onClick={togglePWconfirm}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            <Image 
                              src={showcomfirmPW ? "/image/show.png" : "/image/hide.png"} 
                              alt='icon' 
                              width={20} 
                              height={20} 
                              className='cursor-pointer' 
                              />
                          </button>
                        </div>
                      </div>

                      {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                          <div className="flex items-center mb-2">
                            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mr-3">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <h3 className="text-red-800 font-semibold">ມີຂໍ້ຜິດພາດ</h3>
                          </div>
                          <p className="text-red-700 text-sm">{error}</p>
                        </div>
                      )
                      }
                      <motion.button
                        id="signup-button"
                        type="submit" 
                        className={`w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-xl font-medium shadow-lg hover:shadow-xl hover:from-green-700 hover:to-emerald-700 transform hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                          loading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                      >
                        {loading ? "ກຳລັງສ້າງບັນຊີ..." : "ສ້າງບັນຊີ"}
                      </motion.button>

                      <div className="text-center">
                        <p className="text-gray-600 mb-4">ມີບັນຊີແລ້ວ?</p>
                        <motion.button
                          type='button' 
                          onClick={() => setActiveSlide(0)}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-300"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          ເຂົ້າສູ່ລະບົບ
                        </motion.button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10">
        <div className="fixed top-0 left-0 w-full z-40">
          {/* Animated Slogan Bar */}
          <div className="bg-gradient-to-r from-red-500 to-pink-600 w-full overflow-hidden shadow-lg">
            <motion.div 
              className="py-3 text-white text-center font-medium whitespace-nowrap"
              animate={{ x: ["100%", "-100%"] }}
              transition={{
                repeat: Infinity,
                repeatType: "loop",
                duration: 20,
                ease: "linear"
              }}
            >
              Together We Achieve. Join us and start your journey today! We are a family! What you want, just talk to each other so that we can help you with that.
            </motion.div>
          </div>

          {/* Main Header */}
          <div className="bg-white shadow-md backdrop-blur-sm bg-opacity-90">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-3">
                    <Image src='/image/logo.png' alt='logo' width={30} height={30} className='rounded-full object-cover' />
                  </div>
                  <h1 className="text-xl font-bold text-gray-800">TWA</h1>
                </div>
                
                <motion.button
                  onClick={toggleModal}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full font-medium shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ເລີ່ມຕົ້ນໃຊ້ງານ
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-4">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="relative inline-block">
              <div className="w-80 h-80 mx-auto mb-8 relative">
                <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow">
                  <defs>
                    <path
                      id="circlePath"
                      d="M50 50 m -35 0 a35 35 0 1 1 70 0 a35 35 0 1 1 -70 0"
                      fill="none"
                    />
                  </defs>
                  <circle cx="50" cy="50" r="35" fill="none" stroke="url(#gradient)" strokeWidth="2" />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="50%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#3B82F6" />
                    </linearGradient>
                  </defs>
                  <text className="text-sm font-bold text-gray-700">
                    <textPath href="#circlePath" startOffset="50%" textAnchor="middle">
                      TOGETHER WE ACHIEVE! LOGIN TO START YOUR JOURNEY TODAY
                    </textPath>
                  </text>
                </svg>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 bg-white rounded-full shadow-2xl flex items-center justify-center">
                    <Image
                      src="/image/logo.png"
                      alt="logo"
                      width={150}
                      height={150}
                      className="rounded-full object-cover"
                    />
                  </div>
                </div>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
                Welcome to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">TWA</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Together We Achieve - A platform designed to help you reach your goals through collaboration, 
                innovation, and community support. Join thousands of users who are already transforming their lives.
              </p>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.button
              onClick={toggleModal}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Today
            </motion.button>
          </motion.div>
        </section>

        {/* Services Section */}
        <section className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the powerful tools and services we offer to help you achieve your goals
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <Image
                  src="/image/me.jpg"
                  alt="Service 1"
                  width={200}
                  height={200}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Collaborative Workspace</h3>
                <p className="text-gray-600 leading-relaxed">
                  Work together with your team in real-time with our powerful collaboration tools designed to boost productivity.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="h-48 bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                <div className="text-white text-4xl">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Analytics Dashboard</h3>
                <p className="text-gray-600 leading-relaxed">
                  Track your progress with comprehensive analytics and insights that help you make data-driven decisions.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="h-48 bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                <div className="text-white text-4xl">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Customizable Tools</h3>
                <p className="text-gray-600 leading-relaxed">
                  Personalize your experience with flexible tools that adapt to your unique workflow and requirements.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto mt-20">
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl p-12 text-white text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold mb-6">Why Choose TWA?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Community Support</h3>
                  <p className="text-blue-100">Join a vibrant community of like-minded individuals who support and inspire each other.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Fast & Reliable</h3>
                  <p className="text-blue-100">Experience lightning-fast performance with our optimized platform built for efficiency.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
                  <p className="text-blue-100">Your data is protected with enterprise-grade security and privacy controls.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-3">
                  <Image src='/image/logo.png' alt='logo' width={30} height={30} className='rounded-full object-cover' />
                </div>
                <h3 className="text-xl font-bold">TWA</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Together We Achieve - Empowering individuals and teams to reach their full potential through collaboration and innovation.
              </p>
              <div className="flex space-x-4">
                {['Twitter', 'Facebook', 'Instagram', 'LinkedIn'].map((social) => (
                  <a key={social} href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                    <span className="sr-only">{social}</span>
                    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-300">
                      {social.charAt(0)}
                    </div>
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {['Home', 'About', 'Services', 'Features', 'Pricing', 'Contact'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                {['Collaboration', 'Analytics', 'Customization', 'Support', 'Training', 'Integration'].map((service) => (
                  <li key={service}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                      {service}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Subscribe</h3>
              <p className="text-gray-400 mb-4">Stay updated with our latest news and offers.</p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} TWA. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Render modal */}
      {renderModal()}

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-spin-slow {
          animation: spin 20s linear infinite;
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}

export default WelcomePage;
