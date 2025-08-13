import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const ResponsiveNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const navRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = (sectionId) => {
    setIsMenuOpen(false);
    if (sectionId === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const navLinks = [
    { name: "Home", href: "home" },
    { name: "About Us", href: "about" },
    { name: "Testimonial", href: "testimonial" },
    { name: "Contact Us", href: "CardContent" },
  ];

  return (
    <header
      ref={navRef}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "backdrop-blur-md bg-[#0F4C47]/80 shadow-lg"
          : isMenuOpen
          ? "bg-[#0F4C47] shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span
              style={{
                color: "#DBF5F0",
                fontFamily: "Bebas Neue, cursive",
                fontSize: "28px",
                letterSpacing: "1px",
              }}
              className="cursor-pointer"
              onClick={() => handleNavClick("home")}
            >
              Pharmacy
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={`#${link.href}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                style={{
                  color: "#DBF5F0",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: "500",
                }}
                className="relative hover:text-yellow-300 transition-all duration-300 ease-in-out transform hover:scale-110 hover:-translate-y-1 group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}

            <button
              onClick={() => navigate("/login")}
              style={{
                backgroundColor: "#FDE047",
                color: "#115E59",
                fontFamily: "Inter, sans-serif",
                fontWeight: "600",
              }}
              className="px-6 py-2 rounded-md hover:opacity-90 transform hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out hover:bg-yellow-200 active:scale-95"
            >
              Login
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-md transition-colors duration-300 hover:bg-white/10"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" style={{ color: "#DBF5F0" }} />
            ) : (
              <Menu className="w-6 h-6" style={{ color: "#DBF5F0" }} />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`lg:hidden fixed inset-x-0 top-[72px] transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "opacity-100 visible translate-y-0"
              : "opacity-0 invisible -translate-y-4"
          }`}
        >
          <nav
            className="bg-[#0F4C47]/95 backdrop-blur-md shadow-xl border-t border-white/10"
            style={{ maxHeight: "calc(100vh - 72px)" }}
          >
            <div className="px-4 py-6 space-y-4 overflow-y-auto">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={`#${link.href}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  style={{
                    color: "#DBF5F0",
                    fontFamily: "Inter, sans-serif",
                    fontWeight: "500",
                  }}
                  className="block py-3 px-4 rounded-lg hover:bg-white/10 transition-all duration-300 transform hover:translate-x-2"
                >
                  {link.name}
                </a>
              ))}

              <div className="pt-4 border-t border-white/10">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate("/login");
                  }}
                  style={{
                    backgroundColor: "#FDE047",
                    color: "#115E59",
                    fontFamily: "Inter, sans-serif",
                    fontWeight: "600",
                  }}
                  className="w-full px-6 py-3 rounded-md hover:opacity-90 transform hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out hover:bg-yellow-200 active:scale-95"
                >
                  Login
                </button>
              </div>

              {/* Optional: Add social links in mobile menu */}
              <div className="pt-4 border-t border-white/10">
                <p
                  style={{
                    color: "rgba(219, 245, 240, 0.7)",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "12px",
                  }}
                  className="text-center mb-3"
                >
                  Follow us on social media
                </p>
                <div className="flex justify-center gap-4">
                  {/* Add your social media icons here */}
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-[-1]"
          style={{ top: "72px" }}
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default ResponsiveNavbar;