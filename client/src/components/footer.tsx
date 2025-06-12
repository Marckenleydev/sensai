// components/Footer.jsx
import Link from 'next/link';
import Image from 'next/image';


export default function Footer() {
  return (
    <footer className="bg-background text-white py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4  lg:grid-flow-col gap-4">
          {/* Logo and Description Section */}
          <div className="col-span-1">
            <div className="flex items-center mb-4">
            <Link className="mr-2" href="/">
        <Image src="/logo.png" width={200} height="60" className="h-12 w-auto py-1 object-contain" alt="logo" />
        </Link>
              
            </div>
            <p className="text-gray-400 text-sm  mb-6">
              Dive into the future of software development with us, transitioning from traditional coding to a more innovative, efficient, and streamlined approach
            </p>
            
            {/* Social Media Icons */}
            <div className="flex space-x-4 mb-4">
              <a href="#" className="hover:opacity-80 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.39-.444.975-.608 1.41a18.27 18.27 0 0 0-5.487 0 12.45 12.45 0 0 0-.617-1.409.077.077 0 0 0-.079-.037 19.798 19.798 0 0 0-4.885 1.491.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 6.031 3.056.077.077 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.229 13.229 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.347 12.347 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.963 19.963 0 0 0 6.032-3.056.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028z"/>
                </svg>
               </a>
            </div>
        
          </div>

          {/* Navigation Links - First Column */}
          <div className="col-span-1">
            <ul className="space-y-3">
                
              <li className="font-medium text-gray-100">Home</li>
              {["Code", "Features", "Benefits", "Pricing"].map((item,index) => (
                    <li key={index} className="text-gray-400 text-sm   hover:text-white transition-colors">
                    <Link href="/code">{item}</Link>
                  </li>
                ))}
              
            
            </ul>
          </div>

          {/* Navigation Links - Second Column */}
          <div className="col-span-1">
            <ul className="space-y-3">
              <li className="font-medium text-gray-100">Company</li>
              {["Contact", "Help center", "FAQ", "About us"].map((item,index) => (
                 <li key={index} className="text-gray-400 text-sm  hover:text-white transition-colors">
                 <Link href="/help-center">{item}</Link>
               </li>

              ))}
             
             
            </ul>
          </div>

          {/* Navigation Links - Third Column */}
          <div className="col-span-1">
            <ul className="space-y-3">
              <li className="font-medium text-gray-100">Products</li>
              {["API", "Training", "Security", "Terms & conditions", "Privacy"].map((item,index) => (
                <li key={index} className="text-gray-400 text-sm  hover:text-white transition-colors">
                <Link href="/api">{item}</Link>
              </li>

              ))}
              
            
            </ul>
          </div>

          {/* Navigation Links - Fourth Column */}
          <div className="col-span-1">
            <ul className="space-y-3">
              <li className="font-medium text-gray-100">Resources</li>
              {["Blog", "Documentation", "Community", "Support"].map((item,index) => (
                <li key={index} className="text-gray-400 text-sm  hover:text-white transition-colors">
                <Link href="/codespace">{item}</Link>
              </li>

              ))}
              
             
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Copyright */}
        <div className="text-gray-500 text-sm ">
          ©Copyright 2025 All rights reserved - Sensai
        </div>
      </div>
    </footer>
  );
}