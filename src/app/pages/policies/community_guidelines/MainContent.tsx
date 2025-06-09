import HeadingHeader from '@/src/components/HeadingHeader'
import { LoaderLink } from '@/src/components/loaderLinks'
import Link from 'next/link'

function MainContent() {
  return (
    <>
      
      <HeadingHeader heading="Community Guidelines" />

      <div className='p-4'>
        <h1 className='text-6xl font-extrabold my-5'>Community Guidelines</h1>
        <p className='text-lg font-semibold my-6'>Effective Date: 01/01/2025</p>
        <p className='text-lg font-normal my-6'>WELCOME TO <LoaderLink href={"/"} className='text-green-600 font-semibold'>GeoRadiusNews</LoaderLink> COMMUNITY</p>
        <p className='text-lg font-normal my-6'>Our goal is to create a safe, respectful, and informative space where users can engage with radius-based news relevant to their location. To maintain a healthy environment, all users must follow these Community Guidelines.</p>


        <h2 className='text-xl font-semibold mt-16 mb-6'>1. RESPECTFUL CONDUCT</h2>
        <p className='text-lg font-normal my-6'>Treat all users with courtesy and respect.</p>
        <p className='text-lg font-normal my-6'>Do not engage in hate speech, harassment, bullying, or personal attacks.</p>
        <p className='text-lg font-normal my-6'>Avoid content that promotes violence, discrimination, or threats against individuals or groups.</p>


        <h2 className='text-xl font-semibold mt-16 mb-6'>2. ACCURATE & RESPONSIBLE NEWS SHARING</h2>
        <p className='text-lg font-normal my-6'>Only share verified and factual news.</p>
        <p className='text-lg font-normal my-6'>Do not post fake news, misleading information, or propaganda.</p>
        <p className='text-lg font-normal my-6'>Cite credible sources when sharing important updates.</p>


        <h2 className='text-xl font-semibold mt-16 mb-6'>3. NO ILLEGAL OR OFFENSIVE CONTENT</h2>
        <p className='text-lg font-normal my-6'>Do not post content that is defamatory, obscene, or incites hatred.</p>
        <p className='text-lg font-normal my-6'>Avoid sharing sexually explicit material, violent content, or illegal activities.</p>
        <p className='text-lg font-normal my-6'>Any content violating Indian laws (e.g., IT Act, IPC, UAPA) will be removed.</p>


        <h2 className='text-xl font-semibold mt-16 mb-6'>4. PRIVACY & SECURITY</h2>
        <p className='text-lg font-normal my-6'>Do not share personal information of yourself or others (phone numbers, addresses, financial details, etc.).</p>
        <p className='text-lg font-normal my-6'>Respect others&#39; privacy rights and avoid doxing or exposing personal data.</p>


        <h2 className='text-xl font-semibold mt-16 mb-6'>5. NO SPAM OR PROMOTIONAL CONTENT</h2>
        <p className='text-lg font-normal my-6'>Avoid excessive self-promotion, advertisements, or irrelevant links.</p>
        <p className='text-lg font-normal my-6'>No fraudulent schemes, phishing, or unauthorized solicitation.</p>


        <h2 className='text-xl font-semibold mt-16 mb-6'>6. LOCATION-BASED INTERACTIONS</h2>
        <p className='text-lg font-normal my-6'>Use the platform responsibly within the default 5 km radius.</p>
        <p className='text-lg font-normal my-6'>Do not use location-based features for stalking, tracking, or harassment.</p>


        <h2 className='text-xl font-semibold mt-16 mb-6'>7. REPORTING & ENFORCEMENT</h2>
        <p className='text-lg font-normal my-6'>Users can report violations via the in-app reporting system.</p>
        <p className='text-lg font-normal my-6'>Violating these guidelines may result in content removal, temporary suspension, or permanent account bans.</p>
        <p className='text-lg font-normal my-6'>The Grievance Officer (as per IT Rules, 2021) is available for dispute resolution at amitgupta60600@gmail.com.</p>


        <h2 className='text-xl font-semibold mt-16 mb-6'>8. CHANGES TO GUIDELINES</h2>
        <p className='text-lg font-normal my-6'>We may update these guidelines periodically.</p>
        <p className='text-lg font-normal my-6'>Continued use of the app indicates acceptance of updated rules.</p>


        <h2 className='text-xl font-semibold mt-16 mb-6'>CONTACT US</h2>
        <p className='text-lg font-normal my-6'>For concerns, reach out at amitgupta60600@gmail.com</p>
        <p className='text-lg font-normal my-6'>Thank you for being a part of <span className='text-green-600 font-semibold'>GeoRadiusNews</span> and helping us build a positive and reliable community! 🚀</p>
      </div>
    </>
  )
}

export default MainContent
