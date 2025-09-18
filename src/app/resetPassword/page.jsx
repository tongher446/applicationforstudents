"use client"

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

function resetPassword() {

  const searchParams = useSearchParams();
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  useEffect (()=>{
    if(message){
      const timer = setTimeout(()=> setMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  },[message])

  useEffect (() => {
    const queryEmail = searchParams.get("email");
    if (queryEmail) {
      setEmail(queryEmail)
    } else {
      router.push("/");
      alert("please enter your email to be able to reset your password");
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/resetPassword', {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("check your email for the reset password link");
      console.log("Reset link:", data.resetLink)
      router.push("/");
    }
     else {
      setMessage(data.error);
    }
  }
  return (
    <div>
      <div className='flex justify-center items-center w-full'>
          <Link href='/'>
            <Image src='/image/back.png' alt='icon' height={24} width={24} className='relative bottom-65 left-8'/>
          </Link>
        <div className="container flex-col my-4 border border-blue-400 shadow-2xl rounded-2xl w-[400px] h-[550px] flex justify-center items-center">
            <h1 className='font-extrabold mb-4'>Reset your password!</h1>
            <Image src='/image/logo.png' alt='iconlogo' width={104} height={104} className='border-2 border-amber-300 rounded-full object-cover mb-3' />
            <form onSubmit={handleSubmit} >
              <div className='flex flex-col justify-center items-center mt-8'>
                <div className='border-2 border-transparent rounded-2xl flex items-center focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-transparent focus-within:shadow-lg transition-all duration-300 w-[300px] justify-start my-4'>
                  <Image src='/image/mail.png' alt='icon' height={24} width={24} className='m-2  '/>
                  <input type="email" placeholder='email' id='email' className='email focus:outline-none m-2 border-b-1 border-b-black focus-within:border-none w-full' value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className='mt-4 flex justify-start items-center border-2 rounded-2xl border-blue-400 w-[300px] bg-blue-500 hover:bg-green-400 hover:font-bold hover:scale-110'>
                  <Image src='/image/resetpw.png' alt='icon' height={24} width={24} className='m-2'/>
                  <button type='submit' className='text-white hover:underline'>
                    send link to reset password
                  </button>
                </div>
                {message && 
                <div className='mt-4 text-with shadow-xm'>
                   <p>{message}</p>
                </div>}
              </div>
            </form>
        </div>
    </div>
 </div>
  
  )
}
export default resetPassword;