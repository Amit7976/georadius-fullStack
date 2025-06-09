import HeadingHeader from '@/src/components/HeadingHeader'
import { LoaderLink } from '@/src/components/loaderLinks'
import Link from 'next/link'

function MainContent() {
     
  return (
    <>
      
      <HeadingHeader heading="Cookie Policy" />

      <div className='p-4'>
        <h1 className='text-6xl font-extrabold my-5'>Cookie Policy</h1>
        <p className='text-lg font-semibold my-6'>Effective Date: 01/01/2025</p>
        <p className='text-lg font-normal my-6'>Welcome to <LoaderLink href={"/"} className='text-green-600 font-semibold'>GeoRadiusNews</LoaderLink> (&#34;we,&#34; &#34;our,&#34; or &#34;us&#34;). This Cookie Policy explains how we use cookies and similar tracking technologies when you use our radius-based news application. By using our app, you agree to our use of cookies as described in this policy.</p>
        
        
        <h2 className='text-xl font-semibold mt-16 mb-6'>1. What Are Cookies?</h2>
        <p className='text-lg font-normal my-6'>Cookies are small text files stored on your device when you visit our app. They help us enhance your experience by remembering your preferences, improving app performance, and providing personalized content.</p>
        
        
        <h2 className='text-xl font-semibold mt-16 mb-6'>2. Types of Cookies We Use</h2>
        <p className='text-lg font-normal my-6'>We use the following types of cookies:</p>
        <ul>
          <li className='text-lg font-normal my-6'><b>Essential Cookies:</b> Required for core app functionality such as user authentication and security.</li>
          <li className='text-lg font-normal my-6'><b>Analytical Cookies:</b> Help us track user behavior and improve app features.</li>
          <li className='text-lg font-normal my-6'><b>Functional Cookies:</b> Remember user preferences to enhance usability.</li>
          <li className='text-lg font-normal my-6'><b>Advertising Cookies:</b> Used to deliver relevant ads and measure their effectiveness.</li>
        </ul>
        
        
        <h2 className='text-xl font-semibold mt-16 mb-6'>3. How We Use Cookies</h2>
        <p className='text-lg font-normal my-6'>We use cookies to:</p>
        <ul>
          <li className='text-lg font-normal my-6'>Improve app performance and ensure a seamless user experience.</li>
          <li className='text-lg font-normal my-6'>Analyze traffic and user interactions to optimize features.</li>
          <li className='text-lg font-normal my-6'>Personalize content based on user behavior.</li>
          <li className='text-lg font-normal my-6'>Enhance security measures.</li>
        </ul>
        
        
        <h2 className='text-xl font-semibold mt-16 mb-6'>4. Managing Cookies</h2>
        <p className='text-lg font-normal my-6'>You can control cookie settings through your device or browser settings. Disabling cookies may affect certain functionalities of the app.</p>
        
        
        <h2 className='text-xl font-semibold mt-16 mb-6'>5. Third-Party Cookies</h2>
        <p className='text-lg font-normal my-6'>We may allow trusted third parties (e.g., analytics providers, advertisers) to place cookies for tracking and personalization purposes. These third parties follow their respective privacy policies.</p>
        
        
        <h2 className='text-xl font-semibold mt-16 mb-6'>6. Changes to This Policy</h2>
        <p className='text-lg font-normal my-6'>We may update this Cookie Policy from time to time. Any changes will be communicated through in-app notifications or emails.</p>
        
        
        <h2 className='text-xl font-semibold mt-16 mb-6'>7. Contact Us</h2>
        <p className='text-lg font-normal my-6'>For any concerns about our cookie usage, contact us at: amitgupta60600@gmail.com</p>
      </div> 
    </>
  )
}

export default MainContent
