import { Wallet } from "lucide-react";

const Footer = () => (
  <footer className="bg-gray-900 text-gray-300 py-12">
    <div className="container mx-auto px-6">
      <div className="grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Wallet className="w-6 h-6 text-blue-500" />
            <span className="text-xl font-bold text-white">FinTrack</span>
          </div>
          <p className="text-sm">
            Your trusted financial companion for a better future.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-white mb-4">Product</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-blue-400 transition">
                Features
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400 transition">
                Pricing
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400 transition">
                Security
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-white mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-blue-400 transition">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400 transition">
                Blog
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400 transition">
                Careers
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-white mb-4">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-blue-400 transition">
                Privacy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400 transition">
                Terms
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400 transition">
                Cookie Policy
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
        <p>&copy; 2025 FinTrack. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
