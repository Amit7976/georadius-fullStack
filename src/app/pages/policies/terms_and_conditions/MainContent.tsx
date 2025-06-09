import HeadingHeader from "@/src/components/HeadingHeader";
import { LoaderLink } from "@/src/components/loaderLinks";
import Link from 'next/link';

function MainContent() {

  return (
    <>
      
      <HeadingHeader heading="Terms & Conditions" />

      <div className='p-4'>
        <h1 className='text-6xl font-extrabold my-5'>Terms & Conditions</h1>
        <p className='text-lg font-semibold'>Effective Date: 01/01/2025</p>
        <p className='text-lg font-semibold'>Last Updated: 01/01/2025</p>

        <p className='text-lg font-normal my-6'>Welcome to <LoaderLink href={"/"} className='text-green-600 font-semibold'>GeoRadiusNews</LoaderLink>, a radius-based news application designed to deliver location-specific news within a default 5 km radius of the user’s location. By accessing or using this app, you agree to comply with these Terms and Conditions and all applicable Indian laws and regulations.</p>



        <h2 className='text-xl font-semibold mt-16 mb-6'>1. Acceptance of Terms</h2>
        <ul className='list-disc pl-6'>
          <li className='text-lg font-normal my-6'>These Terms and Conditions govern your use of <LoaderLink href={"/"} className='text-green-600 font-semibold'>GeoRadiusNews</LoaderLink>, including all services, features, and content provided.</li>
          <li className='text-lg font-normal my-6'>By using the app, you acknowledge that you have read, understood, and agree to be bound by these terms.</li>
          <li className='text-lg font-normal my-6'>If you do not agree with any part of these terms, you must immediately stop using the app.</li>
        </ul>


        <h2 className='text-xl font-semibold mt-16 mb-6'>2. Eligibility & User Responsibilities</h2>
        <p className='text-lg font-normal my-6'>This section outlines who can use the app and the responsibilities of users:</p>

        <h3 className='text-lg font-semibold mt-10 mb-6'>2.1 Age and Legal Capacity</h3>
        <ul className='list-disc pl-6'>
          <li className='text-lg font-normal my-6'>To use <LoaderLink href={"/"} className='text-green-600 font-semibold'>GeoRadiusNews</LoaderLink>, you must be at least 18 years old or have parental consent if you are between 13 and 18 years old.</li>
          <li className='text-lg font-normal my-6'>If you are using this app on behalf of an organization or entity, you must have the legal authority to bind that entity to these terms.</li>
          <li className='text-lg font-normal my-6'>If we discover that a user is under 13 years old, their account may be suspended or deleted without notice.</li>
        </ul>

        <h3 className='text-lg font-semibold mt-10 mb-6'>2.2 Accuracy of Information</h3>
        <ul className='list-disc pl-6'>
          <li className='text-lg font-normal my-6'>You agree to provide accurate, current, and complete information when creating an account or using the app’s features.</li>
          <li className='text-lg font-normal my-6'>You are responsible for keeping your account information secure and confidential.</li>
          <li className='text-lg font-normal my-6'>Providing false or misleading information may lead to account suspension or legal action under Section 66D of the IT Act, 2000 (Punishment for cheating by personation using computer resources).</li>
        </ul>

        <h3 className='text-lg font-semibold mt-10 mb-6'>2.3 Prohibited Activities</h3>
        <p className='text-lg font-normal my-6'>Users must not:</p>
        <p className='text-lg font-normal my-6'>Post fake news, misinformation, or misleading content that may cause public disorder.</p>
        <p className='text-lg font-normal my-6'>Share or upload content that violates Indian laws, including but not limited to:</p>
        <ul className='list-disc pl-6'>
          <li className='text-lg font-normal my-6'>Hate speech under Section 153A of the IPC.</li>
          <li className='text-lg font-normal my-6'>Defamation under Section 499 of the IPC.</li>
          <li className='text-lg font-normal my-6'>Obscene content under Section 67 of the IT Act.</li>
        </ul>
        <p className='text-lg font-normal my-6'>Engage in cyber bullying, harassment, or stalking of other users.</p>
        <p className='text-lg font-normal my-6'>Attempt to hack, modify, or disrupt the app’s services.</p>


        <h2 className='text-xl font-semibold mt-16 mb-6'>3. Location-Based Services</h2>
        <p className='text-lg font-normal my-6'>This section explains how location data is used and protected:</p>

        <h3 className='text-lg font-semibold mt-10 mb-6'>3.1 Collection & Use of Location Data</h3>
        <ul className='list-disc pl-6'>
          <li className='text-lg font-normal my-6'><LoaderLink href={"/"} className='text-green-600 font-semibold'>GeoRadiusNews</LoaderLink> collects real-time location data to provide localized news content within a default radius of 5 km.</li>
          <li className='text-lg font-normal my-6'>This data is processed as per the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.</li>
        </ul>

        <h3 className='text-lg font-semibold mt-10 mb-6'>3.2 User Consent</h3>
        <ul className='list-disc pl-6'>
          <li className='text-lg font-normal my-6'>By using this app, you explicitly consent to the collection and use of your location data.</li>
          <li className='text-lg font-normal my-6'>You have the option to disable location services, but doing so may affect your ability to use location-specific features.</li>
        </ul>

        <h3 className='text-lg font-semibold mt-10 mb-6'>3.3 Data Protection Measures</h3>
        <ul className='list-disc pl-6'>
          <li className='text-lg font-normal my-6'>Location data is never sold or shared with third parties without your explicit consent.</li>
          <li className='text-lg font-normal my-6'>All location-based services are encrypted and comply with Indian data protection standards.</li>
        </ul>


        <h2 className='text-xl font-semibold mt-16 mb-6'>4. Content Guidelines and Moderation</h2>
        <p className='text-lg font-normal my-6'>This section explains what type of content is allowed on the platform:</p>

        <h3 className='text-lg font-semibold mt-10 mb-6'>4.1 Acceptable Content</h3>
        <p className='text-lg font-normal my-6'>Users may share news articles, updates, and opinions, provided they are:</p>
        <ul className='list-disc pl-6'>
          <li className='text-lg font-normal my-6'>Accurate and fact-checked</li>
          <li className='text-lg font-normal my-6'>Not misleading, defamatory, or illegal</li>
          <li className='text-lg font-normal my-6'>Not inciting violence, hate speech, or communal disharmony</li>
        </ul>

        <h3 className='text-lg font-semibold mt-10 mb-6'>4.2 Prohibited Content</h3>
        <p className='text-lg font-normal my-6'>The following types of content are strictly prohibited:</p>
        <ul className='list-disc pl-6'>
          <li className='text-lg font-normal my-6'>Fake news or misinformation, as per the IT Rules, 2021.</li>
          <li className='text-lg font-normal my-6'>Hate speech against any religion, caste, or community.</li>
          <li className='text-lg font-normal my-6'>Sexually explicit or obscene material, which is punishable under Section 67 of the IT Act.</li>
          <li className='text-lg font-normal my-6'>Violent or terrorist-related content, as per UAPA (Unlawful Activities Prevention Act).</li>
        </ul>

        <h3 className='text-lg font-semibold mt-10 mb-6'>4.3 Reporting and Enforcement</h3>
        <ul className='list-disc pl-6'>
          <li className='text-lg font-normal my-6'>If a user posts content that violates these guidelines, we reserve the right to remove the content and suspend or terminate the account.</li>
          <li className='text-lg font-normal my-6'>Users can report content that violates these terms via the in-app reporting system.</li>
        </ul>

        <h2 className='text-xl font-semibold mt-16 mb-6'>5. Privacy & Data Security</h2>
        <p className='text-lg font-normal my-6'>This section outlines how user data is collected, stored, and protected.</p>

        <h3 className='text-lg font-semibold mt-10 mb-6'>5.1 Data Collection</h3>
        <p className='text-lg font-normal my-6'>The app collects the following types of data:</p>
        <ul className='list-disc pl-6'>
          <li className='text-lg font-normal my-6'>Personal information (Name, email, phone number)</li>
          <li className='text-lg font-normal my-6'>Location data (Only if permission is granted)</li>
          <li className='text-lg font-normal my-6'>Usage data (App interactions and preferences)</li>
        </ul>

        <h3 className='text-lg font-semibold mt-10 mb-6'>5.2 Data Protection</h3>
        <p className='text-lg font-normal my-6'>We implement strict security measures to protect user data from unauthorized access.</p>
        <p className='text-lg font-normal my-6'>User data is encrypted and stored on secure servers.</p>

        <h3 className='text-lg font-semibold mt-10 mb-6'>5.3 User Rights</h3>
        <p className='text-lg font-normal my-6'>Users have the right to access, modify, or delete their personal data.</p>
        <p className='text-lg font-normal my-6'>Users can request data deletion under the Right to be Forgotten provision in the Personal Data Protection Bill, 2019.</p>


        <h2 className='text-xl font-semibold mt-16 mb-6'>6. Grievance Redressal Mechanism</h2>
        <p className='text-lg font-normal my-6'>In compliance with the IT Rules, 2021, we have appointed a Grievance Officer to address user complaints.</p>
        <p className='text-lg font-normal my-6'>Users can contact the Grievance Officer at amitgupta60600@gmail.com for:</p>
        <ul className='list-disc pl-6'>
          <li className='text-lg font-normal my-6'>Reporting fake news</li>
          <li className='text-lg font-normal my-6'>Data privacy concerns</li>
          <li className='text-lg font-normal my-6'>Content removal requests</li>
        </ul>


        <h2 className='text-xl font-semibold mt-16 mb-6'>7. Governing Law & Dispute Resolution</h2>
        <p className='text-lg font-normal my-6'>These Terms and Conditions are governed by Indian law.</p>
        <p className='text-lg font-normal my-6'>Any disputes shall be resolved through arbitration in Jaipur, India.</p>


        <h2 className='text-xl font-semibold mt-16 mb-6'>8. Modifications to Terms</h2>
        <p className='text-lg font-normal my-6'>We reserve the right to update these terms at any time.</p>
        <p className='text-lg font-normal my-6'>Users will be notified of changes via in-app notifications.</p>


        <h2 className='text-xl font-semibold mt-16 mb-6'>9. Contact Information</h2>
        <p className='text-lg font-normal my-6'>For any questions or concerns, users can contact us at amitgupta60600@gmail.com</p>
      </div>
    </>
  )
}

export default MainContent
