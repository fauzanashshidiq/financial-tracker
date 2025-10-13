import { useState } from "react";
import { Wallet, X, Menu } from "lucide-react";
import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/register");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wallet className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-800">FinTrack</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-gray-600 hover:text-blue-600 transition"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-gray-600 hover:text-blue-600 transition"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className="text-gray-600 hover:text-blue-600 transition"
            >
              Pricing
            </a>
            <Button variant="ghost" className="px-4 py-2">
              Login
            </Button>
            <Button className="px-4 py-2" onClick={handleGetStarted}>
              Get Started
            </Button>
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-3">
            <a
              href="#features"
              className="block text-gray-600 hover:text-blue-600"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="block text-gray-600 hover:text-blue-600"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className="block text-gray-600 hover:text-blue-600"
            >
              Pricing
            </a>
            <Button variant="ghost" className="w-full">
              Login
            </Button>
            <Button className="w-full" onClick={handleGetStarted}>
              Get Started
            </Button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
