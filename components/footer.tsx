import Image from 'next/image';
import MaxWidthWrapper from './max-width-wrapper';

export function Footer() {
  return (
    <footer className="bg-white text-gray-700 pt-16">
      <MaxWidthWrapper className=" mx-auto ">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Logo + Description */}
          <div>
            <a href="#" className="inline-block mb-4">
              <Image src="/logo.png" alt="Logo" width={150} height={40} />
            </a>
            <p className="text-gray-500 text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              dictum aliquet accumsan porta lectus ridiculus in mattis.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Works
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Career
                </a>
              </li>
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Help</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Customer Support
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Delivery Details
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Free eBooks
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Development Tutorial
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  How to - Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Youtube Playlist
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-200 mb-6" />

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0 pb-6">
          <p className="text-gray-500 text-sm">
            © 2025 Your Company. All Rights Reserved.
          </p>
          <div>
            <img
              src="https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/footer/1/payment-methods.png"
              alt="Payment Methods"
              width={200}
              height={30}
              className="object-contain"
            />
          </div>
        </div>
      </MaxWidthWrapper>
    </footer>
  );
}
