import React from 'react'
import { CiFacebook } from "react-icons/ci";
import { FaInstagram } from "react-icons/fa";
import { CiLinkedin } from "react-icons/ci";

const Footer = () => {
  return (
    <footer className='border-t'>
      <div className='container mx-auto p-4 text-center flex-col lg:justify-between lg:flex-row gap-2'>
      <p>© All Rights Reserved 2025</p>
      </div>
       
      <div className='flex items-center gap-4 justify-center text-2xl'>
        <a href='' className='hover:text-primary-200'>
        <CiFacebook/>
        </a>
        <a href='' className='hover:text-primary-200'>
          <FaInstagram/>
        </a>
        <a href='' className='hover:text-primary-200'>
        <CiLinkedin/>
        </a>
      </div>
    </footer>
  )
}

export default Footer