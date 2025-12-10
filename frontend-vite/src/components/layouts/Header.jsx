import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-white dark:bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-6 md:px-10">
        {/* Logo */}
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
          FinTrack
        </h1>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
            Login
          </Button>
          <Button
            size="sm"
            variant="default"
            onClick={() => navigate("/register")}
          >
            Get Started
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-md px-6 pb-4">
          <div className="flex flex-col gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-left"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
            <Button
              size="sm"
              variant="default"
              className="w-full text-left"
              onClick={() => navigate("/register")}
            >
              Get Started
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
