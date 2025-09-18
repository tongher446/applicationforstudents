"use client"

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import './style.css';
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
  const {data: session} = useSession();
  const [isLocked, setIsLocked] = useState(false);
  const [lockedEndTime, setLockedEndTime] = useState(null);
  const [attemp, setAttemp] = useState(0);
  const [timeRemain, setTimeRemain] = useState('');
  const [remainAttemp, setRemainAttemp] = useState(10);
  const [lockError, setLockedError] = useState('');
  const MAX_ATTEMP = 1;
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

        if (diff<=0){
          setIsLocked(false);
          setRemainAttemp(10);
          setAttemp(0);
          setLockedEndTime(null);
          setTimeRemain('00:00:00');
          return;
        }

        const hours = Math.floor(diff/ (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60))/ 1000);

        setTimeRemain(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}: ${seconds.toString().padStart(2, '0')}`
        );
      };

      updateTimer();

      const timerInterval = setInterval(updateTimer, 1000);

      return () => clearInterval(timerInterval);
    };
  },[isLocked, lockedEndTime]);

  // Set isClient to true only after component mounts on client
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if (error){
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error])
  
  useEffect(() => {
    const timer = setTimeout(() => setSuccessreg(""), 2000);
    return () => clearTimeout(timer);
  })

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
    if (password.length < 6) return `${password} ລະຫັດຜ່ານສັ້ນເກີນໄປ`;
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

    if (isLocked){
      setLockedError(`You have tried to login too many times. Please try again in ${timeRemain}`)
      return;
    }


    if (!email || !password) {
      setEmailError(validateEmail(email));
      setPasswordError(validatePassword(password));
      return;
    } else {
      setEmailError('');
      setPasswordError('');
    }


    try {

      const res = await signIn('credentials', {
        email, password, redirect: false
      })

      if (res.error) {
        const newAttemp = attemp + 1;
        setAttemp(newAttemp);
        setRemainAttemp(Math.max(0, MAX_ATTEMP - newAttemp));
        setSignInError("Email or password is incorrect!");
        
        if (newAttemp >= MAX_ATTEMP){
          const unlockTime = Date.now() + LOCKOUT_DURATION;
          setIsLocked(true);
          setLockedEndTime(unlockTime);
          setLockedError('Your account has been locked. Please try again later');
        } else{

          setLockedError(`invalid credentail. ${MAX_ATTEMP - newAttemp} remaining!!`)
        }
      } else {
        setSignInError('');
        setRemainAttemp(1);
        setAttemp(0);
        setIsLocked(false);
        setLockedEndTime(null);
        setTimeout(() => router.replace("/welcome"), 2000);
    }
    }
    catch (error) {
      console.log(error);
    }
  
  }
  const handleKeyPress = (e, nextInputID) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if(nextInputID){
        document.getElementById(nextInputID).focus();
      }
    }
  }

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!signupData.name || !signupData.email || !signupData.password || !signupData.confirmPassword) {
      // Handle name validation
      setError("please fill all the fields");
      setLoading(false);
      return;
    } else {
      setError("");
    }

    if (signupData.password !== signupData.confirmPassword) {
      // Handle password confirmation validation
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (signupData.password.length < 6) {
      setError("ລຫັດຜ່ານຕ້ອງມີຢ່າງໜ້ອຍ 6 ຕົວ");
      setLoading(false);
      return;
    }
    
    try{

      const resCheckUser = await fetch("http://localhost:3000/api/checkUser",{
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({ email: signupData.email })
      })

      const { user } = await resCheckUser.json();

      if (user){
        setError("User with this email already exists");
        resetForm();
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: signupData.name,
          email: signupData.email,
          password: signupData.password,
        }),
      })
      if (response.ok) {
        const form = e.target;
        setSuccessreg("Account created successfully!");
        form.reset();
        resetForm();
        activeSlide(0);
        setLoading(false);  
      }
      
    } catch(error){
      alert("Error during signup. Please try again.");
      console.error('Error during signup:', error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  //   const handleForgetPassword = (e) => {
  //   if (email) {
  //     router.push(`/resetPassword?email=${encodeURIComponent(email)}`);
  //   }
    
  // }

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
    
    // Cleanup function
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Don't render modal during SSR to prevent hydration mismatch
  const renderModal = () => {
    if (!isClient) return null;
    
    return (
      isOpen && (
        <div className="modal fixed inset-0 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-20 p-4 overflow-y-auto" onClick={toggleModal}>

          <div className="modal-content bg-white border-2 border-cyan-200 p-6 rounded-lg shadow-lg max-w-md w-full max-h-[95vh] overflow-hidden" onClick={handleModalClick}>
            {/* Close button */}
            <div className="absolute top-4 right-4 z-10">
              <button 
                onClick={closeModal}
                className="w-8 h-8 bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-white rounded-full flex items-center justify-center font-bold text-lg transition-colors duration-200"
              >
                X
              </button>
            </div>

            {/* Sliding container with scrollable content */}
            <div className="relative h-[calc(95vh-3rem)] max-h-[600px] overflow-hidden rounded-lg">
              {/* Login Slide */}
              <div 
                className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
                  activeSlide === 0 ? 'translate-x-0' : '-translate-x-full'
                } flex flex-col`}
              > 
                <div className="flex-1 overflow-y-auto px-6 py-8">
                  <div className="form-group flex flex-col items-center justify-center">
                    <h1 className="text-2xl font-bold mb-4">TWA ຍິນດີຕ້ອນຮັບທ່ານ</h1>
                    <div className='logo-cnt border-4 border-amber-300 rounded-full'>
                      <Image src='/image/logo.png' alt='logo' width={50} height={50} className='m-1 rounded-full object-cover' />
                    </div>
                  </div>
                   {isLocked && lockedEndTime && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center mb-2">
                        <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <h3 className="text-red-800 font-semibold">Account Locked</h3>
                      </div>
                      <p className="text-red-700 text-sm mb-3">
                        your account is locked since your login attempts have failed too many times 
                      </p>
                      <div className="bg-red-100 rounded p-3 animate-pulse">
                        <p className="text-red-800 text-sm font-medium">
                          please try again in: <span className="font-bold text-lg">{timeRemain}</span> thank you
                        </p>
                      </div>
                    </div>
                  )}
                  {!isLocked && 
                    <form onSubmit={handleSubmit} className='flex-col flex justify-center items-center'>
                      <div className="input-group flex flex-col items-center justify-center mt-4">
                        <label htmlFor="email" className='relative top-4 right-21'>ອິເມວ</label>
                        <div className={`email-ctn flex border-1 rounded-2xl m-4 justify-start items-center w-70 ${emailError ? 'border-red-500' : 'border-blue-400'}`}>
                          <Image src="/image/mail.png" alt="email" width={30} height={30} className="mr-2 p-1" />
                          <input 
                            id='email'
                            type="email" 
                            placeholder='ອິເມວຂອງທ່ານ' 
                            value={email}
                            onChange={handleEmailChange} 
                            onKeyPress={(e) => handleKeyPress(e, 'password')}
                            className='focus:outline-none w-full' 
                          />
                        </div>
                        {emailError && (
                          <p className="text-red-500 text-sm -mt-2 mb-2">{emailError}</p>
                        )}
                        
                        <label htmlFor="password" className='relative top-4 right-18'>ລະຫັດຜ່ານ</label>
                        <div className={`password-ctn flex border-1 rounded-2xl m-4 justify-start items-center w-70 ${passwordError ? 'border-red-500' : 'border-blue-400'}`}>
                          <Image src="/image/padlock.png" alt="icon" width={30} height={30} className="mr-2 p-1" />
                          <input 
                            id='password'
                            type={showPassword ? "text" : "password"} 
                            placeholder="ລະຫັດຜ່ານຂອງທ່ານ" 
                            value={password}
                            onChange={handlePasswordChange} 
                            onKeyPress={(e) => handleKeyPress(e, 'login-button')}
                            className='w-full focus:outline-none' 
                          />
                          <Image 
                            src={showPassword ? "/image/show.png" : "/image/hide.png"} 
                            alt='icon' 
                            width={23} 
                            height={23} 
                            onClick={togglePassword} 
                            className='mr-2 cursor-pointer' 
                          />
                        </div>
                        {passwordError && (
                          <p className="text-red-500 text-sm -mt-2 mb-2">{passwordError}</p>
                        )}
                        <div className='flex flex-col justify-center items-center'>
                          <button 
                            id="login-button"
                            type="submit" 
                            className="mt-4 bg-blue-600 w-70 text-white px-6 py-2 rounded-full hover:bg-blue-700 hover:scale-110 transition-colors duration-300"
                          >
                            ເຂົ້າສູ່ລະບົບ
                          </button>
                          <div>
                              <hr className='my-2' />
                                  <div>
                                  ລື່ມລະຫັດຜ່ານ? <Link href={`/resetPassword?email=${encodeURIComponent(email)}`} className='text-blue-500 hover:underline'>ຕັ້ງລະຫັດຜ່ານໃໝ່</Link>
                                  </div>
                              <hr className='my-2' />
                          </div>
                          <button 
                            type='button' 
                            onClick={() => setActiveSlide(1)}
                            className='mt-4 bg-green-600 w-70 text-white px-6 py-2 rounded-full hover:bg-green-700 hover:scale-110 transition-colors duration-300'
                          >
                            <p>ລົງທະບຽນຊື່ເຂົ້າໃຊ້ </p>
                          </button>
                        </div>
                      </div>
                    </form>
                  }
                </div>
              </div>

              {/* Signup Slide */}
              <div 
                className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
                  activeSlide === 1 ? 'translate-x-0' : 'translate-x-full'
                } flex flex-col`}
              >
                <div className="flex-1 overflow-y-auto px-6 py-8">
                  <div className="form-group flex flex-col items-center justify-center">
                    <h1 className='text-2xl font-bold justify-center flex mb-2' >ລົງທະບຽນຊື່ເຂົ້າໃຊ້</h1>
                    <div className='logo-cnt border-4 border-amber-300 rounded-full'>
                      <Image src='/image/logo.png' alt='logo' width={50} height={50} className='m-1 rounded-full object-cover' />
                    </div>
                  </div>
                  <div>
                    <div>
                        {successreg && (
                          <div className="success-message fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 shadow-lg transition-opacity duration-300 ease-in-out">
                            {successreg}
                          </div>
                        )}
                    </div>
                    <div>
                      {signInError && (
                          <div className="error-message fixed top-25 left-1/2 transform -translate-x-1/2 text-red-500" >
                            {error}
                          </div>
                      )}
                    </div>
                  </div>
                  <form onSubmit={handleSignupSubmit} className='flex-col flex justify-center items-center'>
                    <div className="input-group flex flex-col items-center justify-center mt-4">
                      <label htmlFor="name"  className='relative top-4 right-18'>ຊື່ ແລະ ນາມສະກຸນ </label>
                      <div className='email-ctn flex border-1 rounded-2xl m-4 justify-start items-center w-70 border-blue-400'>
                        <Image src="/image/user.png" alt="name" width={30} height={30} className="mr-2 p-1" />
                        <input 
                          id='name'
                          type="text" 
                          placeholder='ຊື່ ແລະ ນາມສະກຸນຂອງທ່ານ' 
                          value={signupData.name}
                          onKeyPress={(e) => handleKeyPress(e, 'signup-email')}
                          onChange={(e) => handleSignupChange('name', e.target.value)} 
                          className='focus:outline-none w-full' 
                        />
                      </div>
                      
                      <label htmlFor="signup-email" className='relative top-4 right-26'>ອິເມວ</label>
                      <div className='email-ctn flex border-1 rounded-2xl m-4 justify-start items-center w-70 border-blue-400'>
                        <Image src="/image/mail.png" alt="email" width={30} height={30} className="mr-2 p-1" />
                        <input 
                          id='signup-email'
                          type="email" 
                          placeholder='ອິເມວຂອງທ່ານ' 
                          value={signupData.email}
                          onKeyPress={(e) => handleKeyPress(e, 'signup-password')}
                          onChange={(e) => handleSignupChange('email', e.target.value)} 
                          className='focus:outline-none w-full' 
                        />
                      </div>
                      
                      <label htmlFor="signup-password" className='relative top-4 right-22'>ລະຫັດຜ່ານ</label>
                      <div className='password-ctn flex border-1 rounded-2xl m-4 justify-start items-center w-70 border-blue-400'>
                        <Image src="/image/padlock.png" alt="icon" width={30} height={30} className="mr-2 p-1" />
                        <input 
                          id='signup-password'
                          type={showPasswordsignup ? "text" :"password" }
                          placeholder="ລະຫັດຜ່ານຂອງທ່ານ" 
                          value={signupData.password}
                          onKeyPress={(e) => handleKeyPress(e, 'confirm-password')}
                          onChange={(e) => handleSignupChange('password', e.target.value)} 
                          className='w-full focus:outline-none' 
                        />
                        <Image  src={showPasswordsignup ? "/image/show.png" : "/image/hide.png"} alt='icon' width={23} height={23} onClick={togglePasswordsignup} className='mr-2 cursor-pointer' />
                      </div>
                      
                      <label htmlFor="confirm-password" className='relative top-4 right-18'>ຢືນຢັນລະຫັດຜ່ານ</label>
                      <div className='password-ctn flex border-1 rounded-2xl m-4 justify-start items-center w-70 border-blue-400'>
                        <Image src="/image/padlock.png" alt="icon" width={30} height={30} className="mr-2 p-1" />
                        <input 
                          id='confirm-password'
                          type={showcomfirmPW? "text" : "password" }
                          placeholder="ຢືນຢັນລະຫັດຜ່ານຂອງທ່ານ" 
                          value={signupData.confirmPassword}
                          onKeyPress={(e) => handleKeyPress(e, "signup-button")}
                          onChange={(e) => handleSignupChange('confirmPassword', e.target.value)} 
                          className='w-full focus:outline-none' 
                        />
                        <Image  src={showcomfirmPW ? "/image/show.png" : "/image/hide.png"} alt='icon' width={23} height={23} onClick={togglePWconfirm} className='mr-2 cursor-pointer' />
                      </div>
                      {error && (
                        <p className="text-red-500 text-sm -mt-2 mb-2 transition-opacity duration-300 ease-in-out">{error}</p>
                      )}
                      <div className='flex flex-col justify-center items-center'>
                        <button 
                          id="signup-button"
                          type="submit" 
                          className={`mt-4 bg-green-600 w-70 text-white px-6 py-2 rounded-full hover:bg-green-700 hover:scale-110 transition-colors duration-3001 ${loading ? 'bg-green-400 cursor-not-allowed opacity-50' : 'bg-green-600 hover:bg-green-700 hover:scale-110 cursor-pointer'}`}
                          disabled={loading}
                        >
                          {loading? "ກຳລັງສ້າງບັນຊີ..." : "ສ້າງບັນຊີ"}
                        </button>
                        <button 
                          type='button' 
                          onClick={() => setActiveSlide(0)}
                          className='mt-4 bg-blue-600 w-70 text-white px-6 py-2 rounded-full hover:bg-blue-700 hover:scale-110 transition-colors duration-300'
                        >
                          ກັບຄືນໜ້າເຂົ້າສູ່ລະບົບ
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    );
  };

  return (
    <div className="contents">
      {/* ================= HEADER ================= */}
      <div className="header-ctn fixed top-0 left-0 w-full z-10 flex p-4 bg-white shadow-md h-[100px] justify-end"> 
        {/* Red slogan block */}
        <div className="header2">
          <div className="slogan h-[40px] bg-red-500 w-[620px] mr-20 p-2 flex items-center overflow-hidden">
            <motion.div className="div"
              animate={{ x: ["100%", "-100%"] }}
              transition={{
                repeat: Infinity,
                repeatType: "loop",
                duration: 20,
                ease: "linear"
              }}>
              <p className='w-full text-nowrap text-white'>Together We Achieve. Join us and start your journey today! we are a family ! what you want just talk to each other so that we can help you with that </p>
            </motion.div>
          </div>
        </div>
        {/* Green clipped header block */}
        <div className="header absolute top-0 left-0 bg-green-500 p-4 w-[700px] h-[130px] [clip-path:polygon(0_0,100%_0,80%_100%,0_100%)]">
        </div>
        {/* Blue Get Started button */}
        <div className="header3 absolute top-2 shadow-xl right-2 bg-blue-600 text-white p-4 rounded-bl-[3rem] rounded-tr-[3rem] hover:bg-linear-to-r from-white to-blue-500 hover:text-white hover:scale-115 transition-colors duration-300 hover:font-bold active:scale-110 active:bg-white active:text-blue-600 active:shadow-xl" onClick={toggleModal}>
          <button type="button">
           ເລີ່ມຕົ້ນໃຊ້ງານ
          </button>
        </div>
      </div>
      {/* ================= LOGO ================= */}
      <div className="container1 mt-[120px] flex justify-center items-center relative w-full">
       <div className="logo-cont rounded-full">
          <svg viewBox="0 0 100 100" className="text-spin w-[470px] h-[470px]">
            <defs>
              <path
                id="circlePath"
                d="M50 50 m -35 0 a35 35 0 1 1 70 0 a35 35 0 1 1 -70 0"
                fill="none"
              />
            </defs>

            {/* visible (or invisible) circle for debugging/visual */}
            <circle cx="50" cy="50" r="35" fill="none" stroke="transparent" />

            {/* rotate this group around the SVG center (50,50) */}
            <g>
              <text className="fill-slate-500 font-bold text-[10px]">
                <textPath href="#circlePath" xlinkHref="#circlePath" startOffset="50%" textAnchor="middle">
                  <tspan>TOGETHER WE ACHIEVE! LOGIN TO START YOUR JOURNEY TODAY</tspan>
                </textPath>
              </text>

              {/* <animateTransform> reliably rotates the group arou  nd center (50,50) */}
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                from="360 50 50"
                to="0 50 50"
                dur="15s"
                repeatCount="indefinite"
              />
            </g>
          </svg>

          <div className="logo absolute bottom-20 right-22">
            <Image
              src="/image/logo.png"
              alt="logo"
              width={300}
              height={300}
              className="rounded-full object-cover"
            />
          </div>
        </div>
      </div>
      {/* ================= CONTENT ================= */}
     <div className="flex justify-center items-center w-full mt-0 ">
        {/* Blue section content */}
        <div className="container-ct bg-white h-[580px] w-[1000px] shadow-2xl">
          <div className="services flex flex-col justify-center items-center pt-20 z-10">
            <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.6,}}
            viewport={{ once: false, amount: 0.3 }}
            >           
                <div>
                <h2 className="text-name text-black shadow-green-100 shadow-2xl text-3xl h-15 w-50 flex items-center justify-center">Our Services</h2>
              </div>
            </motion.div>
          <div className="ctn-content flex mt-10">
            {/* Animated content boxes */}
            <motion.div
              className="service1 h-[350px] w-[250px] m-2 shadow-xl bg-black hover:scale-110 transition-transform duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: false, amount: 0.3 }}
            >
              <div className='product'>
                <Image
                  src="/image/me.jpg"
                  alt="service1"
                  width={250}
                  height={250}
                  className="object-cover mask-b-from-30%"
                />
              </div>
              <p className="service-text text-white relative w-59 left-2 bottom-25">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </motion.div>
            <motion.div
              className="service2 h-[300px] w-[250px] m-2 shadow-md bg-green-500"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: false, amount: 0.3 }}
            >

            </motion.div>
            <motion.div
              className="service3 h-[300px] w-[250px] m-2 shadow-md bg-blue-400"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: false, amount: 0.3 }}
            >
            </motion.div>
            </div>
          </div>
        </div>
      </div> 
      {/* Render modal only on client side */}
      {renderModal()}
    </div>
  )
}

export default WelcomePage;