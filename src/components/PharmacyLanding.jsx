import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Star,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Clock,
  Package,
  Users,
  Truck,
  ClipboardList,
  Headphones,
  Calendar,
  ChevronDown,
  DollarSign,
} from "lucide-react";
import { color } from "framer-motion";
import { Menu, X } from "lucide-react";
import NavItems from "./_components/NavItems";
import About from "./_components/About";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const PharmacyLanding = () => {
  const navigate = useNavigate();

  // Contact form state
  const [contactForm, setContactForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  // State for What to Expect accordion
  const [activeExpectationIndex, setActiveExpectationIndex] = useState(0);

  const navRef = useRef(null);

  // Framer Motion hooks
  const { scrollY } = useScroll();
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const differenceRef = useRef(null);
  const expectRef = useRef(null);
  const testimonialsRef = useRef(null);
  const contactRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });
  const aboutInView = useInView(aboutRef, { once: true, amount: 0.2 });
  const differenceInView = useInView(differenceRef, { once: true, amount: 0.2 });
  const expectInView = useInView(expectRef, { once: true, amount: 0.2 });
  const testimonialsInView = useInView(testimonialsRef, {
    once: true,
    amount: 0.2,
  });
  const contactInView = useInView(contactRef, { once: true, amount: 0.2 });

  // Parallax effect for hero background
  const backgroundY = useTransform(scrollY, [0, 500], [0, -150]);

  // Load fonts
  useEffect(() => {
    // Add preconnect links for better font loading performance
    const preconnectGoogle = document.createElement("link");
    preconnectGoogle.rel = "preconnect";
    preconnectGoogle.href = "https://fonts.googleapis.com";
    document.head.appendChild(preconnectGoogle);

    const preconnectGstatic = document.createElement("link");
    preconnectGstatic.rel = "preconnect";
    preconnectGstatic.href = "https://fonts.gstatic.com";
    preconnectGstatic.crossOrigin = "anonymous";
    document.head.appendChild(preconnectGstatic);

    // Load Google Fonts including DM Serif Text and Staatliches
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Playfair+Display:wght@400;700;900&family=Inter:wght@300;400;500;600;700&family=Kalam:wght@400;700&family=DM+Serif+Text:ital@0;1&family=Staatliches&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // Add Copernicus font if available (you may need to add the font file to your project)
    const copernicusStyle = document.createElement("style");
    copernicusStyle.textContent = `
      @font-face {
        font-family: 'Copernicus Book Regular';
        src: local('Copernicus Book Regular'), local('Copernicus-Book-Regular');
        font-display: swap;
      }
      
      .dm-serif-text-regular {
        font-family: "DM Serif Text", serif;
        font-weight: 400;
        font-style: normal;
      }

      .dm-serif-text-regular-italic {
        font-family: "DM Serif Text", serif;
        font-weight: 400;
        font-style: italic;
      }

      .staatliches-regular {
        font-family: "Staatliches", sans-serif;
        font-weight: 400;
        font-style: normal;
      }
    `;
    document.head.appendChild(copernicusStyle);

    const handleScroll = () => {
      if (navRef.current) {
        navRef.current.classList.toggle("window-scroll", window.scrollY > 0);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Customer",
      rating: 5,
      text: "Online Pharmacy service changed my health and experience of implementing my health medicine medicine.",
    },
    {
      name: "Michael Chen",
      role: "Patient",
      rating: 5,
      text: "Excellent service and fast delivery. The convenience of ordering online is unmatched.",
    },
    {
      name: "Emma Wilson",
      role: "Regular Customer",
      rating: 5,
      text: "Professional staff and quality medicines. Highly recommend their services.",
    },
    {
      name: "David Park",
      role: "Healthcare Professional",
      rating: 5,
      text: "The API integration is flawless. We've reduced our medication delivery time by 60%.",
    },
    {
      name: "Sofia Rodriguez",
      role: "Long-term Patient",
      rating: 5,
      text: "Finally, a pharmacy that understands patient needs! The service is impressive.",
    },
    {
      name: "Alex Thompson",
      role: "Customer",
      rating: 5,
      text: "The 24/7 support is outstanding. They truly care about their customers' health.",
    },
  ];

  // What to Expect data
  const expectations = [
    {
      id: 0,
      icon: <Package className="w-5 h-5" />,
      title: "Transfer or send us your prescriptions",
      description: "Have your doctor send us new prescriptions, or easily transfer existing prescriptions in the app. Our seamless process ensures your medications are ready when you need them, with no hassle or long wait times.",
      image: "https://framerusercontent.com/images/Z3P0ChB3xp1PvoZCLWKiuGWWK8.png",
      highlights: ["Quick transfer process", "Direct doctor connection", "Secure prescription handling"]
    },
    {
      id: 1,
      icon: <DollarSign className="w-5 h-5" />,
      title: "Save on your medications",
      description: "We work directly with manufacturers and insurance providers to ensure you get the best prices on your medications. Our transparent pricing means no surprises at checkout, and we'll always show you ways to save more.",
      image: "https://framerusercontent.com/images/HMIrTWd1rowXGyLafg5TfHxBvzI.png",
      highlights: ["Competitive pricing", "Insurance integration", "Discount programs available"]
    },
    {
      id: 2,
      icon: <Calendar className="w-5 h-5" />,
      title: "Schedule your delivery",
      description: "Choose when and where you want your medications delivered. Whether it's same-day, next-day, or scheduled for later, we work around your schedule. Track your delivery in real-time and get notifications every step of the way.",
      image: "https://framerusercontent.com/images/ZuUf386wNqAieHd38KzHMFmYo.png",
      highlights: ["Flexible delivery options", "Real-time tracking", "Convenient scheduling"]
    },
    {
      id: 3,
      icon: <Headphones className="w-5 h-5" />,
      title: "Get support and stay on track",
      description: "Our pharmacists are available 24/7 to answer your questions and provide guidance. We'll send you reminders for refills and help you manage your medication schedule, ensuring you never miss a dose.",
      image: "https://framerusercontent.com/images/tTKtEHOLGyonII9hlYCz9Jrjk.png",
      highlights: ["24/7 pharmacist support", "Medication reminders", "Personalized care"]
    }
  ];

  // Contact form handlers
  const handleContactInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");
    setSubmitError("");

    // Basic validation
    if (
      !contactForm.firstName ||
      !contactForm.lastName ||
      !contactForm.email ||
      !contactForm.subject ||
      !contactForm.message
    ) {
      setSubmitError("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactForm.email)) {
      setSubmitError("Please provide a valid email address");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axiosInstance.post("/contact/send", contactForm);

      if (response.data.success) {
        setSubmitMessage(
          "Thank you for your message! We will get back to you within 24 hours."
        );
        // Reset form
        setContactForm({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      }
    } catch (error) {
      console.error("Contact form error:", error);
      setSubmitError(
        error.response?.data?.message ||
          "Failed to send your message. Please try again or contact us directly."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Custom Button Component
  const Button = ({
    children,
    className = "",
    size = "default",
    variant = "default",
    onClick,
    ...props
  }) => {
    const baseClasses =
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";

    const sizeClasses = {
      default: "h-10 py-2 px-4",
      sm: "h-9 px-3 rounded-md",
      lg: "h-11 px-8 rounded-md",
      icon: "h-10 w-10",
    };

    const variantClasses = {
      default: "hover:opacity-90 hover:shadow-xl",
      ghost: "hover:bg-accent hover:text-accent-foreground",
    };

    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
        onClick={onClick}
        {...props}
      >
        {children}
      </motion.button>
    );
  };

  // Custom Input Component
  const Input = ({ className = "", ...props }) => {
    return (
      <input
        className={`flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-inter ${className}`}
        {...props}
      />
    );
  };

  // Custom Card Components
  const Card = ({ children, className = "", ...props }) => {
    return (
      <div
        className={`rounded-lg border text-card-foreground shadow-sm ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  };

  const CardContent = ({ children, className = "", ...props }) => {
    return (
      <div className={`p-6 ${className}`} {...props}>
        {children}
      </div>
    );
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <>
      {/* Header */}
      <NavItems></NavItems>

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        className="relative w-full min-h-screen overflow-hidden flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/5998512/pexels-photo-5998512.jpeg')",
        }}
      >
        <motion.div className="absolute inset-0" />

        {/* Content */}
        <div className="w-full max-w-7xl mx-auto relative z-10 px-4 sm:px-6 md:px-8 lg:px-12">
          <motion.div
            className="flex flex-col justify-center items-center space-y-8 sm:space-y-10 lg:space-y-12 text-center lg:text-left mt-10"
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            <motion.div className="space-y-4 w-full" variants={fadeInUp}>
              <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight text-center text-teal-50 font-playfair font-semibold">
                Your health is our priority.
                
                <span className="block sm:inline"> Always Caring, </span>
                <motion.span
                  className="text-yellow-400 block sm:inline"
                  animate={{
                    color: ["#FDE047", "#FCD34D", "#FDE047"],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Always Here
                </motion.span>
                ..{" "}
                <span className="relative inline-block">
                  care
                  <motion.div
                    className="absolute -top-1 -right-2 sm:top-1 sm:-right-60 transform rotate-12"
                    initial={{ scale: 0, rotate: 0 }}
                    animate={{ scale: 1, rotate: 12 }}
                    transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                  >
                    <div className="px-2 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm md:text-base lg:text-lg shadow-lg whitespace-nowrap bg-yellow-300 bg-opacity-70 text-teal-800 font-kalam font-bold">
                      Health
                    </div>
                  </motion.div>
                </span>{" "}
                <span className="block sm:inline">system</span>
              </h3>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="backdrop-blur-sm rounded-lg p-4 sm:p-5 md:p-6 w-full max-w-sm sm:max-w-md mx-auto bg-teal-50 bg-opacity-10"
            >
              <p className="text-sm sm:text-base leading-relaxed mb-4 text-center text-teal-50 text-opacity-90 font-inter font-normal">
                Online Pharmacy aimed to increase the comfort and convenience of
                people wanting to order medicines online.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                <motion.button
                  whileHover={{ scale: 1.05, x: 3, y: 3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/register")}
                  className="relative group font-bold text-xs sm:text-sm text-teal-800 rounded-full p-0.5 -translate-x-1 -translate-y-1 outline-2 outline-transparent outline-offset-4 transition-all duration-150 ease-in-out bg-stone-800 shadow-[0.5px_0.5px_0_0_#292524,1px_1px_0_0_#292524,1.5px_1.5px_0_0_#292524,2px_2px_0_0_#292524,2.5px_2.5px_0_0_#292524,3px_3px_0_0_#292524,0_0_0_2px_#fafaf9,0.5px_0.5px_0_2px_#fafaf9,1px_1px_0_2px_#fafaf9,1.5px_1.5px_0_2px_#fafaf9,2px_2px_0_2px_#fafaf9,2.5px_2.5px_0_2px_#fafaf9,3px_3px_0_2px_#fafaf9,3.5px_3.5px_0_2px_#fafaf9,4px_4px_0_2px_#fafaf9] hover:translate-x-0 hover:translate-y-0 hover:shadow-[0_0_0_2px_#fafaf9] focus-visible:outline-dashed focus-visible:outline-yellow-400"
                >
                  <div className="relative pointer-events-none bg-yellow-400 border border-white border-opacity-30 rounded-full before:absolute before:inset-0 before:rounded-full before:opacity-50 before:bg-[radial-gradient(rgba(255,255,255,0.8)_20%,transparent_20%),radial-gradient(white_20%,transparent_20%)] before:bg-[length:8px_8px] before:bg-[position:0_0,4px_4px] before:animate-[dots_0.5s_linear_infinite]">
                    <span className="relative flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 gap-1 filter drop-shadow-[0_-1px_0_rgba(255,255,255,0.25)] active:translate-y-0.5">
                      Get Started
                    </span>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05, x: 3, y: 3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
      const contactSection = document.getElementById('contact-section');
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}}
                  className="relative group font-bold text-xs sm:text-sm text-teal-800 rounded-full p-0.5 -translate-x-1 -translate-y-1 outline-2 outline-transparent outline-offset-4 transition-all duration-150 ease-in-out bg-stone-800 shadow-[0.5px_0.5px_0_0_#292524,1px_1px_0_0_#292524,1.5px_1.5px_0_0_#292524,2px_2px_0_0_#292524,2.5px_2.5px_0_0_#292524,3px_3px_0_0_#292524,0_0_0_2px_#fafaf9,0.5px_0.5px_0_2px_#fafaf9,1px_1px_0_2px_#fafaf9,1.5px_1.5px_0_2px_#fafaf9,2px_2px_0_2px_#fafaf9,2.5px_2.5px_0_2px_#fafaf9,3px_3px_0_2px_#fafaf9,3.5px_3.5px_0_2px_#fafaf9,4px_4px_0_2px_#fafaf9] hover:translate-x-0 hover:translate-y-0 hover:shadow-[0_0_0_2px_#fafaf9] focus-visible:outline-dashed focus-visible:outline-yellow-400"
                >
                  <div className="relative pointer-events-none bg-yellow-400 border border-white border-opacity-30 rounded-full before:absolute before:inset-0 before:rounded-full before:opacity-50 before:bg-[radial-gradient(rgba(255,255,255,0.8)_20%,transparent_20%),radial-gradient(white_20%,transparent_20%)] before:bg-[length:8px_8px] before:bg-[position:0_0,4px_4px] before:animate-[dots_0.5s_linear_infinite]">
                    <span className="relative flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 gap-1 filter drop-shadow-[0_-1px_0_rgba(255,255,255,0.25)] active:translate-y-0.5">
                      Contact Us
                    </span>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>

          {/* Optional Right Section or Image Placeholder */}
          <div></div>
        </div>
      </motion.section>

      <div ref={aboutRef} id="about">
        <About></About>
      </div>

      {/* How We're Different Section - NEW */}
      <motion.section
        ref={differenceRef}
        className="px-6 py-16 relative"
        style={{ backgroundColor: '#256C5C' }}
        initial="hidden"
        animate={differenceInView ? "visible" : "hidden"}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-12" variants={fadeInUp}>
            <h2 className="mb-4 text-5xl tracking-wide font-bebas text-white">
              How We're Different
            </h2>
            <p className="text-lg font-inter text-gray-200 max-w-3xl mx-auto">
              Experience healthcare reimagined with our innovative approach to pharmacy services
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
          >
            {/* Feature 1 - Seamless Prescription Ordering */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="h-full bg-white bg-opacity-90 backdrop-blur-lg border-teal-200 hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <motion.div
                    className="w-48 h-48 mx-auto mb-6 flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img 
                      src="https://framerusercontent.com/images/TpNR5WqZRJrU7LLAebe8oXM7ZxQ.png?scale-down-to=1024"
                      alt="Seamless Prescription Ordering"
                      className="w-full h-full object-contain"
                    />
                  </motion.div>
                  
                  <h3 className="text-2xl font-playfair font-bold text-teal-800 mb-4">
                    Seamless Prescription Ordering
                  </h3>
                  
                  <p className="text-gray-700 font-inter leading-relaxed">
                    Forget waiting in line. The Pharmacy app covers everything from payment and delivery management to education and support
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Feature 2 - Medication at Your Doorstep */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="h-full bg-white bg-opacity-90 backdrop-blur-lg border-teal-200 hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <motion.div
                    className="w-48 h-48 mx-auto mb-6 flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img 
                      src="https://framerusercontent.com/images/nhNauzkmYi6jWAXvFBS3KB327no.png?scale-down-to=1024"
                      alt="Medication at Your Doorstep"
                      className="w-full h-full object-contain"
                    />
                  </motion.div>
                  
                  <h3 className="text-2xl font-playfair font-bold text-teal-800 mb-4">
                    Medication at Your Doorstep
                  </h3>
                  
                  <p className="text-gray-700 font-inter leading-relaxed">
                    We offer a variety of delivery and pick up options to suit every schedule and meet urgent needs
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Feature 3 - Expert Support 24/7 */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="h-full bg-white bg-opacity-90 backdrop-blur-lg border-teal-200 hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <motion.div
                    className="w-48 h-48 mx-auto mb-6 flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img 
                      src="https://framerusercontent.com/images/OzbxHmdOnSAtVaf33stFCSBQBU.png?scale-down-to=1024"
                      alt="Expert Support Seven Days a Week"
                      className="w-full h-full object-contain"
                    />
                  </motion.div>
                  
                  <h3 className="text-2xl font-playfair font-bold text-teal-800 mb-4">
                    Expert Support Seven Days a Week
                  </h3>
                  
                  <p className="text-gray-700 font-inter leading-relaxed">
                    Questions about your prescriptions? Our pharmacists are just a message away, even during nights and weekends
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* What to Expect Section - IMPROVED */}
      <motion.section
  ref={expectRef}
  className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
  style={{ backgroundColor: '#256C5C' }}
  initial="hidden"
  animate={expectInView ? "visible" : "hidden"}
  variants={staggerContainer}
>
  {/* Enhanced floating decorative elements */}
  <motion.div
    className="absolute top-10 left-10 w-40 h-40 rounded-full blur-3xl opacity-30"
    style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
    animate={{
      x: [0, 30, 0],
      y: [0, -20, 0],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
  <motion.div
    className="absolute bottom-10 right-10 w-56 h-56 rounded-full blur-3xl opacity-30"
    style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
    animate={{
      x: [0, -40, 0],
      y: [0, 30, 0],
    }}
    transition={{
      duration: 10,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />

  <div className="max-w-7xl mx-auto relative z-10">
    {/* Enhanced Section Header */}
    <motion.div
      className="text-center mb-20"
      variants={fadeInUp}
    >
      <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
        What to expect
      </h2>
      <h3 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8">
        from <span className="text-yellow-400">MediAI</span>
      </h3>
      <div className="w-24 h-1 bg-yellow-400 mx-auto rounded-full"></div>
    </motion.div>

    {/* Improved Main Content Layout */}
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center min-h-[600px]">
        {/* Left Side - Simple Text Accordion */}
        <div className="space-y-6 lg:pr-8">
          {expectations.map((item, index) => (
            <div key={item.id} className="relative">
              <button
                onClick={() => setActiveExpectationIndex(index)}
                className="w-full text-left transition-all duration-200"
              >
                <div className="flex items-center justify-between py-4">
                  <div className="flex-1">
                    <h4 className={`text-xl font-bold leading-tight transition-colors duration-200 ${
                      activeExpectationIndex === index ? 'text-yellow-400' : 'text-white'
                    }`}>
                      {item.title}
                    </h4>
                    {activeExpectationIndex !== index && (
                      <p className="text-gray-300 text-sm opacity-70 mt-1">
                        Click to learn more
                      </p>
                    )}
                  </div>
                  <div className={`transform transition-transform duration-200 ${
                    activeExpectationIndex === index ? 'rotate-180' : ''
                  }`}>
                    <ChevronDown className={`w-5 h-5 transition-colors duration-200 ${
                      activeExpectationIndex === index ? 'text-yellow-400' : 'text-white'
                    }`} />
                  </div>
                </div>

                <AnimatePresence>
                  {activeExpectationIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.1, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 pb-2">
                        <p className="text-gray-100 leading-relaxed text-base">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
              
              {/* Simple divider line */}
              <div className="mt-4 h-px bg-white/20"></div>
            </div>
          ))}
        </div>

        {/* Right Side - Simple Image */}
        <div className="flex items-center justify-center lg:pl-8 h-full">
          <div className="w-full max-w-2xl">
            <motion.img
              key={activeExpectationIndex}
              src={expectations[activeExpectationIndex].image}
              alt={expectations[activeExpectationIndex].title}
              className="w-full h-auto rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ 
                duration: 0.15,
                ease: "easeOut"
              }}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</motion.section>

      {/* Testimonials Section with Auto-play Infinite Loop - MINT THEME */}
      <motion.section
        ref={testimonialsRef}
        className="px-6 py-16 relative"
        style={{ backgroundColor: '#256C5C' }}
        initial="hidden"
        animate={testimonialsInView ? "visible" : "hidden"}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-12" variants={fadeInUp}>
            <h2
              className="mb-4 text-5xl tracking-wide font-bebas text-white"
              id="testimonial"
            >
              User FeedBack
            </h2>
            <p className="text-lg font-inter text-gray-200">
              Trusted by thousands of customers worldwide
            </p>
          </motion.div>

          {/* Marquee Container */}
          <motion.div
            className="relative w-full overflow-hidden"
            variants={fadeInUp}
          >
            {/* Gradient Overlays */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-32 z-10" style={{ background: 'linear-gradient(to right, #256C5C, transparent)' }} />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-32 z-10" style={{ background: 'linear-gradient(to left, #256C5C, transparent)' }} />

            {/* Marquee Track */}
            <div className="flex items-center">
              <div className="flex animate-marquee">
                {/* First set of testimonials */}
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={`first-${index}`}
                    className="flex-shrink-0 px-3"
                    style={{ width: "380px" }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card className="h-full transition-all duration-300 shadow-lg bg-white bg-opacity-90 border-teal-200 backdrop-blur-lg">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <motion.div
                            className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            <div className="w-full h-full bg-gradient-to-br from-teal-600 to-teal-700 flex items-center justify-center">
                              <span className="text-xl font-bold text-white">
                                {testimonial.name.charAt(0)}
                              </span>
                            </div>
                          </motion.div>
                          <div className="flex flex-col items-start">
                            <h3 className="text-md font-semibold leading-none text-teal-800 font-playfair">
                              {testimonial.name}
                            </h3>
                            <p className="text-sm text-teal-700 font-inter">
                              {testimonial.role}
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-start mb-3">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: i * 0.1 }}
                            >
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            </motion.div>
                          ))}
                        </div>

                        <p className="text-sm leading-relaxed text-teal-800 font-inter">
                          "{testimonial.text}"
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}

                {/* Duplicate set for seamless loop */}
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={`second-${index}`}
                    className="flex-shrink-0 px-3"
                    style={{ width: "350px" }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card className="h-full shadow-lg bg-white bg-opacity-90 border-teal-200 backdrop-blur-lg">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <motion.div
                            className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            <div className="w-full h-full bg-gradient-to-br from-teal-600 to-teal-700 flex items-center justify-center">
                              <span className="text-xl font-bold text-white">
                                {testimonial.name.charAt(0)}
                              </span>
                            </div>
                          </motion.div>
                          <div className="flex flex-col items-start">
                            <h3 className="text-md font-semibold leading-none text-teal-800 font-playfair">
                              {testimonial.name}
                            </h3>
                            <p className="text-sm text-teal-700 font-inter">
                              {testimonial.role}
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-start mb-3">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: i * 0.1 }}
                            >
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            </motion.div>
                          ))}
                        </div>

                        <p className="text-sm leading-relaxed text-teal-800 font-inter">
                          "{testimonial.text}"
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Add CSS for the marquee animation */}
        <style jsx>{`
          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }

          .animate-marquee {
            animation: marquee 30s linear infinite;
          }

          .animate-marquee:hover {
            animation-play-state: paused;
          }

          /* For smooth scrolling on different screen sizes */
          @media (max-width: 768px) {
            .animate-marquee {
              animation-duration: 20s;
            }
          }
        `}</style>
      </motion.section>

      {/* Contact Section - MINT THEME */}
      <motion.section
        id="contact-section"
        ref={contactRef}
        className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 relative overflow-hidden"
        style={{ backgroundColor: '#256C5C' }}
        initial="hidden"
        animate={contactInView ? "visible" : "hidden"}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-8 sm:mb-10 md:mb-12" variants={fadeInUp}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-3 sm:mb-4 tracking-wide font-bebas text-white">
              <i className="fa-solid fa-phone"></i> Get In Touch
            </h2>
            <p className="text-sm sm:text-base md:text-lg px-4 sm:px-0 font-inter text-gray-200">
              We're here to help and answer any question you might have
            </p>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card className="shadow-2xl relative bg-white bg-opacity-90 backdrop-blur-lg border border-teal-200">
              <CardContent className="p-4 sm:p-6 md:p-8 lg:p-10" id="CardContent">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 sm:mb-8">
                  <motion.h3
                    className="text-xl sm:text-2xl md:text-3xl font-playfair font-bold text-black"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Send us a message
                  </motion.h3>
                  <motion.div
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-center gap-2 text-black">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-xs sm:text-sm font-inter font-medium">
                        24/7 Support
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-black">
                      <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-xs sm:text-sm font-inter font-medium">
                        Quick Response
                      </span>
                    </div>
                  </motion.div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  {/* Success/Error Messages */}
                  <AnimatePresence mode="wait">
                    {submitMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-3 sm:p-4 rounded-xl border-2 bg-green-50 border-green-300 text-green-600"
                      >
                        <p className="text-sm sm:text-base font-inter font-semibold">
                          {submitMessage}
                        </p>
                      </motion.div>
                    )}

                    {submitError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-3 sm:p-4 rounded-xl border-2 bg-red-50 border-red-300 text-red-600"
                      >
                        <p className="text-sm sm:text-base font-inter font-semibold">
                          {submitError}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                  >
                    <motion.div className="relative" variants={fadeInLeft}>
                      <label className="block mb-2 text-sm font-inter font-semibold text-black">
                        First Name *
                      </label>
                      <Input
                        name="firstName"
                        value={contactForm.firstName}
                        onChange={handleContactInputChange}
                        placeholder="Enter your first name"
                        className="border-2 focus:border-teal-500 transition-all duration-300 bg-white text-black placeholder-gray-500 text-sm sm:text-base border-teal-300 p-3"
                        required
                      />
                    </motion.div>
                    <motion.div className="relative" variants={fadeInRight}>
                      <label className="block mb-2 text-sm font-inter font-semibold text-black">
                        Last Name *
                      </label>
                      <Input
                        name="lastName"
                        value={contactForm.lastName}
                        onChange={handleContactInputChange}
                        placeholder="Enter your last name"
                        className="border-2 focus:border-teal-500 transition-all duration-300 bg-white text-black placeholder-gray-500 text-sm sm:text-base border-teal-300 p-3"
                        required
                      />
                    </motion.div>
                  </motion.div>

                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                  >
                    <motion.div className="relative" variants={fadeInLeft}>
                      <label className="block mb-2 text-sm font-inter font-semibold text-black">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Input
                          name="email"
                          value={contactForm.email}
                          onChange={handleContactInputChange}
                          placeholder="your.email@example.com"
                          type="email"
                          className="border-2 focus:border-teal-500 transition-all duration-300 pl-10 bg-white text-black placeholder-gray-500 text-sm sm:text-base border-teal-300 p-3"
                          required
                        />
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                      </div>
                    </motion.div>

                    <motion.div className="relative" variants={fadeInRight}>
                      <label className="block mb-2 text-sm font-inter font-semibold text-black">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Input
                          name="phone"
                          value={contactForm.phone}
                          onChange={handleContactInputChange}
                          placeholder="+1 (555) 123-4567"
                          type="tel"
                          className="border-2 focus:border-teal-500 transition-all duration-300 pl-10 bg-white text-black placeholder-gray-500 text-sm sm:text-base border-teal-300 p-3"
                        />
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                      </div>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block mb-2 text-sm font-inter font-semibold text-black">
                      Subject *
                    </label>
                    <Input
                      name="subject"
                      value={contactForm.subject}
                      onChange={handleContactInputChange}
                      placeholder="How can we help you today?"
                      className="border-2 focus:border-teal-500 transition-all duration-300 bg-white text-black placeholder-gray-500 text-sm sm:text-base border-teal-300 p-3"
                      required
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label className="block mb-2 text-sm font-inter font-semibold text-black">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={contactForm.message}
                      onChange={handleContactInputChange}
                      placeholder="Tell us more about your inquiry..."
                      rows={4}
                      className="w-full p-3 sm:p-4 border-2 border-teal-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 bg-white text-black placeholder-gray-500 text-sm sm:text-base font-inter"
                      required
                    ></textarea>
                  </motion.div>

                  <motion.div
                    className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pt-2 sm:pt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                      <Button
                        type="button"
                        onClick={handleContactSubmit}
                        disabled={isSubmitting}
                        className={`w-full sm:w-auto px-6 sm:px-8 lg:px-10 py-2.5 sm:py-3 text-sm sm:text-base lg:text-lg shadow-lg transition-all duration-300 transform font-inter font-semibold text-white ${
                          isSubmitting
                            ? "cursor-not-allowed opacity-50 bg-gray-400"
                            : "hover:opacity-90 hover:shadow-xl hover:scale-105 hover:-translate-y-1 active:scale-95"
                        }`}
                        style={{ 
                          backgroundColor: isSubmitting ? undefined : '#256C5C',
                          '&:hover': { backgroundColor: isSubmitting ? undefined : '#1e5449' }
                        }}
                      >
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </Button>

                      <div className="text-center sm:text-left text-black">
                        <p className="text-xs sm:text-sm font-inter font-medium">
                          Need immediate assistance?
                        </p>
                        <motion.a
                          href="tel:+12025550172"
                          className="text-sm sm:text-base lg:text-lg hover:underline transform transition-all duration-300 ease-in-out hover:text-yellow-300 inline-block font-playfair font-bold text-yellow-400"
                          whileHover={{ scale: 1.05, rotate: 1 }}
                        >
                          Call +1-202-555-0172
                        </motion.a>
                      </div>
                    </div>

                    <div className="flex justify-center lg:justify-end gap-3 sm:gap-4">
                      <motion.div
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:opacity-80 cursor-pointer transition-all duration-300 bg-yellow-400"
                        whileHover={{ scale: 1.25, rotate: 12 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Facebook className="w-4 h-4 sm:w-5 sm:h-5 text-teal-800" />
                      </motion.div>
                      <motion.div
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:opacity-80 cursor-pointer transition-all duration-300 bg-yellow-400"
                        whileHover={{ scale: 1.25, rotate: -12 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-teal-800" />
                      </motion.div>
                      <motion.div
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:opacity-80 cursor-pointer transition-all duration-300 bg-yellow-400"
                        whileHover={{ scale: 1.25, rotate: 12 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 text-teal-800" />
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.section>

      {/* Call to Action Section */}
      <motion.section
        className="py-20 px-4 sm:px-6 lg:px-8"
        style={{ backgroundColor: '#256C5C' }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 leading-tight"
            style={{ 
              color: '#FFFFFF',
              fontFamily: '"Copernicus Book Regular", "Copernicus Book Regular Placeholder", sans-serif',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)'
            }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } }
            }}
          >
            The pharmacy care you need,<br/>
            whenever you need it
          </motion.h2>
          
          <motion.button
            onClick={() => navigate('/register')}
            className="relative group font-bold text-sm font-inter text-[#115E59] rounded-full p-[2px] -translate-x-1 -translate-y-1 outline-2 outline-transparent outline-offset-4 transition-all duration-150 ease-in-out bg-[#292524] shadow-[0.5px_0.5px_0_0_#292524,1px_1px_0_0_#292524,1.5px_1.5px_0_0_#292524,2px_2px_0_0_#292524,2.5px_2.5px_0_0_#292524,3px_3px_0_0_#292524,0_0_0_2px_#fafaf9,0.5px_0.5px_0_2px_#fafaf9,1px_1px_0_2px_#fafaf9,1.5px_1.5px_0_2px_#fafaf9,2px_2px_0_2px_#fafaf9,2.5px_2.5px_0_2px_#fafaf9,3px_3px_0_2px_#fafaf9,3.5px_3.5px_0_2px_#fafaf9,4px_4px_0_2px_#fafaf9] hover:translate-x-0 hover:translate-y-0 hover:shadow-[0_0_0_2px_#fafaf9] focus-visible:outline-dashed focus-visible:outline-[#facc15]"
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              visible: { opacity: 1, scale: 1, transition: { duration: 0.6, delay: 0.4 } }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative pointer-events-none bg-[#facc15] border border-white/30 rounded-full before:absolute before:inset-0 before:rounded-full before:opacity-50 before:bg-[radial-gradient(rgba(255,255,255,0.8)_20%,transparent_20%),radial-gradient(white_20%,transparent_20%)] before:bg-[length:8px_8px] before:bg-[position:0_0,4px_4px] before:animate-[dots_0.5s_linear_infinite]">
              <span className="relative flex items-center justify-center px-5 py-3 gap-1 filter drop-shadow-[0_-1px_0_rgba(255,255,255,0.25)] active:translate-y-[2px]">
                Get started
              </span>
            </div>
          </motion.button>
        </div>
      </motion.section>

      {/* Footer and Banner Container for Reveal Animation */}
      <FooterBannerReveal />
    </>
  );
};

// Footer and Banner Reveal Component
const FooterBannerReveal = () => {
  const containerRef = useRef(null);
  const bannerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const banner = bannerRef.current;

    if (!container || !banner) return;

    // Simple container setup - banner is now directly visible
    gsap.set(banner, {
      y: 0, // Banner stays in position
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="relative h-[60vh]"> {/* Reduced from h-screen to h-[60vh] */}
      {/* Banner - positioned absolutely to be revealed */}
      <AdvancedBanner ref={bannerRef} />
    </div>
  );
};

// Advanced Banner Component - Simplified with only marquee text
const AdvancedBanner = React.forwardRef((props, ref) => {
  const marqueeRef = useRef(null);
  const textRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const marqueeAnimationRef = useRef(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    const text = textRef.current;

    if (!marquee || !text) return;

    // Set CSS will-change property for GPU acceleration
    gsap.set([marquee, text], {
      willChange: "transform",
      backfaceVisibility: "hidden",
      perspective: 1000
    });

    // Optimized marquee animation - continuous loop
    const marqueeWidth = marquee.scrollWidth / 2; // Divide by 2 since we'll duplicate content
    
    marqueeAnimationRef.current = gsap.to(marquee, {
      x: -marqueeWidth,
      duration: 30, // Adjusted for better speed
      ease: "none",
      repeat: -1,
      force3D: true // Force GPU acceleration
    });

    // Optimized text animation
    gsap.fromTo(text.children, {
      y: 30,
      opacity: 0,
      force3D: true
    }, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: "power2.out",
      delay: 0.3,
      force3D: true
    });

    return () => {
      // Clean up animations
      if (marqueeAnimationRef.current) {
        marqueeAnimationRef.current.kill();
      }
      
      // Reset will-change to auto
      gsap.set([marquee, text], {
        willChange: "auto"
      });
    };
  }, []); // Remove isPaused dependency to prevent re-renders

  // Handle pause/play separately to avoid re-rendering useEffect
  useEffect(() => {
    if (marqueeAnimationRef.current) {
      if (isPaused) {
        marqueeAnimationRef.current.pause();
      } else {
        marqueeAnimationRef.current.play();
      }
    }
  }, [isPaused]);

  const marqueeText = "Pharmacy • Healthcare • Medicine • Wellness • Pharmacy • Healthcare • Medicine • Wellness • Pharmacy • Healthcare • Medicine • Wellness • Pharmacy • Healthcare • Medicine • Wellness • ";

  return (
    <section
      ref={ref}
      className="absolute inset-0 w-full h-full overflow-hidden"
      style={{
        backgroundColor: '#256C5C',
        transform: 'translateZ(0)', // Force layer creation for smoother rendering
        willChange: 'transform'
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Marquee Text */}
      <div 
        className="absolute inset-0 flex items-center justify-center overflow-hidden"
        style={{ 
          willChange: 'transform'
        }}
      >
        <div
          ref={marqueeRef}
          className="flex items-center whitespace-nowrap staatliches-regular text-6xl md:text-8xl lg:text-10xl font-black opacity-20"
          style={{ 
            width: 'max-content',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            color: '#CAE7E1'
          }}
        >
          {/* First set of text */}
          {marqueeText.split('•').map((text, index) => (
            <span key={`first-${index}`} className="flex items-center">
              <span className="px-8">{text.trim()}</span>
              {index < marqueeText.split('•').length - 1 && (
                <span className="w-4 h-4 rounded-full mx-8" style={{ backgroundColor: '#CAE7E1' }}></span>
              )}
            </span>
          ))}
          {/* Duplicate set for seamless loop */}
          {marqueeText.split('•').map((text, index) => (
            <span key={`second-${index}`} className="flex items-center">
              <span className="px-8">{text.trim()}</span>
              {index < marqueeText.split('•').length - 1 && (
                <span className="w-4 h-4 rounded-full mx-8" style={{ backgroundColor: '#CAE7E1' }}></span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Main Content - PHARMACY Text */}
      <div 
        ref={textRef} 
        className="relative z-20 flex flex-col items-center justify-center h-full px-6"
        style={{ 
          willChange: 'transform',
          transform: 'translateZ(0)'
        }}
      >
        <h1 
          className="staatliches-regular text-9xl md:text-[10rem] lg:text-[14rem] xl:text-[16rem] 2xl:text-[18rem] font-black mb-4 tracking-wider leading-none"
          style={{ willChange: 'transform', color: '#CAE7E1', fontWeight: 900 }}
        >
          PHARMACY
        </h1>
        
        <div className="space-y-1 text-center" style={{ willChange: 'transform' }}>
          <p className="font-inter text-sm font-medium" style={{ color: '#CAE7E1', opacity: 0.9 }}>
            © 2025 MediAI Pharmacy. All rights reserved.
          </p>
          <p className="font-inter text-xs max-w-2xl mx-auto" style={{ color: '#CAE7E1', opacity: 0.75 }}>
            Your trusted healthcare partner, delivering quality medication and care when you need it most.
          </p>
        </div>
      </div>
    </section>
  );
});

export default PharmacyLanding;