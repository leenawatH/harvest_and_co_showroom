import { FaFacebookF, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-white px-6 py-12 text-sm">
      <div className="max-w-6xl mx-auto flex flex-col justify-between gap-10">

        {/* Grid layout: mobile = 1 col, md+ = 3 col */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Info */}
          <div className="text-left">
            <h4 className="text-lg font-semibold mb-4">Info</h4>
            <ul className="space-y-2">
              <li><a href="#" className="underline hover:text-gray-400 transition">Our Service</a></li>
              <li><a href="#" className="underline hover:text-gray-400 transition">Care Tip</a></li>
            </ul>
          </div>

          {/* Follow */}
          <div className="text-left md:text-center">
            <h4 className="text-lg font-semibold mb-4">Follow</h4>
            <div className="flex space-x-4 md:justify-center">
              <a
                href="https://www.facebook.com/profile.php?id=61554871502327&locale=th_TH"
                className="hover:text-gray-400 transition"
              >
                <FaFacebookF className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/harvestandco_th/"
                className="hover:text-gray-400 transition"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div className="text-left md:text-right">
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <address className="not-italic leading-relaxed">
              722/1 Barom Road<br />
              Bangkok 10110<br />
              <a 
                href="https://line.me/R/ti/p/@myshop" 
                className="text-white hover:text-gray-400 transition block mt-2"
              >
                LINE ID : @.....
              </a>

              <a
                href="mailto:harvest@gmail.com"
                className="underline text-white hover:text-gray-400 transition block mt-2"
              >
                harvest@gmail.com
              </a><br />
            </address>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-500 text-xs mt-5">
          Harvest and co 
        </div>
      </div>
    </footer>
  );
}
