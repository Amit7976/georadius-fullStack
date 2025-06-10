import HeadingHeader from "@/src/components/HeadingHeader";
import { LoaderLink } from "@/src/components/loaderLinks";

function MainContent() {
  return (
    <>
      
      <HeadingHeader heading="Privacy Policy" />

      <div className='p-4'>
        <h1 className='text-6xl font-extrabold my-5'>Privacy Policy</h1>
        <p className='text-lg font-semibold my-6'>Effective Date: 01/01/2025</p>
        <p className='text-lg font-normal my-6'>Welcome to <LoaderLink href={"/"} className='text-green-600 font-semibold'>GeoRadiusNews</LoaderLink> (&#34;we,&#34; &#34;our,&#34; or &#34;us&#34;). Your privacy is important to us. This Privacy Policy explains how we collect, use, store, and protect your information in compliance with Indian data protection laws, including the Information Technology Act, 2000, and Personal Data Protection Bill (PDPB), 2019 (if enacted). By using our application, you agree to the terms of this Privacy Policy.</p>


        <h2 className='text-xl font-semibold mt-16 mb-6'>1. Information We Collect</h2>
        <p className='text-lg font-normal my-6'>We collect different types of information to provide you with radius-based news services effectively. Our data collection is aimed at ensuring that users receive the most relevant news within their locality while maintaining the highest standards of privacy and security. Below is a detailed breakdown of the data we collect:</p>

        <h3 className='text-lg font-semibold mt-10 mb-6'>a) Personal Information</h3>
        <p className='text-lg font-normal my-6'>We may collect the following personal data:</p>
        <ul>
          <li className='text-lg font-normal my-6'><b>Name:</b> If you choose to create an account, we collect your name to personalize your experience and provide better engagement within the application. Your name helps in distinguishing user profiles and enhancing the community aspect of the news application.</li>
          <li className='text-lg font-normal my-6'><b>Email Address:</b> Your email address is required for login purposes, communication, and important updates regarding your account. It also serves as an additional layer of security for password recovery and authentication processes.</li>
          <li className='text-lg font-normal my-6'><b>Phone Number:</b> If required for verification purposes, we may collect your phone number. This helps us prevent fraudulent activities and ensures that real users are engaging with our platform.</li>
          <li className='text-lg font-normal my-6'><b>Profile Picture:</b> If you upload a profile picture, it helps in creating a more personalized experience within the app, especially if social features are integrated in the future.</li>
        </ul>

        <h3 className='text-lg font-semibold mt-10 mb-6'>b) Location Data</h3>
        <p className='text-lg font-normal my-6'>Since our app provides local news within a certain radius, we require access to your location data.</p>
        <ul>
          <li className='text-lg font-normal my-6'><b>Current Location (GPS-based):</b> We collect and process your real-time location to show relevant news within a default radius of 5 km (adjustable by you). This data is only used for delivering geographically relevant news and is not shared with unauthorized third parties.</li>
          <li className='text-lg font-normal my-6'><b>Stored Location Preferences:</b> If you do not wish to share your live location, you can set a preferred location manually. This allows us to provide localized news without requiring constant GPS access, thereby offering greater control over your privacy.</li>
        </ul>

        <h3 className='text-lg font-semibold mt-10 mb-6'>c) Device & Usage Information</h3>
        <p className='text-lg font-normal my-6'>We may collect:</p>
        <ul>
          <li className='text-lg font-normal my-6'><b>Device Information:</b> Details such as device model, OS version, and unique device identifiers help us optimize the app&#39;s performance across different devices.</li>
          <li className='text-lg font-normal my-6'><b>App Usage Data:</b> Information about time spent on the app, features accessed, and interactions allow us to understand user preferences and enhance user experience.</li>
          <li className='text-lg font-normal my-6'><b>Error Logs & Crash Reports:</b> If an issue occurs within the app, we collect crash reports to diagnose and resolve technical problems efficiently.</li>
        </ul>

        <h3 className='text-lg font-semibold mt-10 mb-6'>d) Cookies & Tracking Technologies</h3>
        <p className='text-lg font-normal my-6'>We use cookies and similar technologies to enhance functionality, perform analytics, and improve user experience. These small files help store user preferences and allow seamless navigation within the application.</p>


        <h2 className='text-xl font-semibold mt-16 mb-6'>2. How We Use Your Information</h2>
        <p className='text-lg font-normal my-6'>Your data is used for various purposes aimed at delivering the best experience possible while maintaining transparency and security. Some key uses include:</p>
        <ul>
          <li className='text-lg font-normal my-6'><b>Providing Location-Based News:</b> Delivering news articles within your selected radius ensures that you stay informed about your local community.</li>
          <li className='text-lg font-normal my-6'><b>Personalization:</b> We analyze your reading habits to recommend news stories that align with your interests.</li>
          <li className='text-lg font-normal my-6'><b>User Authentication:</b> Verifying user identity to prevent unauthorized access and ensure that only legitimate users engage with the platform.</li>
          <li className='text-lg font-normal my-6'><b>Enhancing Security:</b> Monitoring activities to detect fraudulent behavior and safeguard user information.</li>
          <li className='text-lg font-normal my-6'><b>Analytics & Improvements:</b> Gathering insights into user behavior to refine our features and overall app experience.</li>
        </ul>


        <h2 className='text-xl font-semibold mt-16 mb-6'>3. How We Share Your Information</h2>
        <p className='text-lg font-normal my-6'>We do not sell your personal data. However, we may share information in the following cases:</p>
        <ul>
          <li className='text-lg font-normal my-6'><b>With Third-Party Services:</b> For essential services such as push notifications, analytics, and cloud storage, we may collaborate with reputable third-party providers.</li>
          <li className='text-lg font-normal my-6'><b>With Law Enforcement:</b> If legally required, we may disclose information to comply with Indian legal regulations.</li>
          <li className='text-lg font-normal my-6'><b>With Business Partners:</b> If we collaborate with verified partners to improve news accuracy and delivery, limited data may be shared under strict security measures.</li>
        </ul>


        <h2 className='text-xl font-semibold mt-16 mb-6'>4. Data Storage & Security</h2>
        <p className='text-lg font-normal my-6'>We implement strong security measures to protect your data from unauthorized access, alteration, or destruction.</p>
        <ul>
          <li className='text-lg font-normal my-6'><b>Data Encryption:</b> All sensitive data is encrypted both during transmission and storage to prevent breaches.</li>
          <li className='text-lg font-normal my-6'><b>Secure Servers:</b> Your information is stored on secure cloud servers compliant with Indian regulatory standards.</li>
          <li className='text-lg font-normal my-6'><b>Access Controls:</b> Only authorized personnel can access sensitive user data, ensuring maximum security.</li>
        </ul>


        <h2 className='text-xl font-semibold mt-16 mb-6'>5. User Rights & Choices</h2>
        <p className='text-lg font-normal my-6'>You have full control over your data:</p>
        <ul>
          <li className='text-lg font-normal my-6'><b>Access & Correction:</b> You can review and update your personal details anytime through the app settings.</li>
          <li className='text-lg font-normal my-6'><b>Location Control:</b> If you prefer not to share live location data, you can disable GPS access and set a manual location preference.</li>
          <li className='text-lg font-normal my-6'><b>Delete Account:</b> You have the right to request account deletion, and all associated data will be permanently erased from our servers upon confirmation.</li>
        </ul>


        <h2 className='text-xl font-semibold mt-16 mb-6'>6. Children’s Privacy</h2>
        <p className='text-lg font-normal my-6'>Our services are not intended for users under 18 years of age. We strictly prohibit the collection of personal data from minors. If we discover that we have inadvertently collected data from a minor, we will take immediate steps to delete such information.</p>


        <h2 className='text-xl font-semibold mt-16 mb-6'>7. Updates to this Policy</h2>
        <p className='text-lg font-normal my-6'>We may update this policy from time to time to reflect legal and operational changes. Any modifications will be communicated through in-app notifications or emails to keep users informed.</p>


        <h2 className='text-xl font-semibold mt-16 mb-6'>8. Contact Us</h2>
        <p className='text-lg font-normal my-6'>If you have any privacy-related concerns, inquiries, or requests regarding your personal data, you can contact us at:amitgupta60600@gmail.com</p>
      </div>
    </>
  )
}

export default MainContent
