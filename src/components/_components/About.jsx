import React, { useEffect } from "react";
import { motion } from "framer-motion";

const About = () => {
  // Load fonts
  useEffect(() => {
    // Load Google Fonts
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Playfair+Display:wght@400;700;900&family=Inter:wght@300;400;500;600;700&family=Kalam:wght@400;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // Add Copernicus font if available
    const copernicusStyle = document.createElement("style");
    copernicusStyle.textContent = `
      @font-face {
        font-family: 'Copernicus Book Regular';
        src: local('Copernicus Book Regular'), local('Copernicus-Book-Regular');
        font-display: swap;
      }
    `;
    document.head.appendChild(copernicusStyle);

    return () => {
      // Cleanup function can be added if needed
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const imageVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 1,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundColor: '#256C5C'
      }}
    >
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/10"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Content */}
          <motion.div className="text-white space-y-8" variants={itemVariants}>
            {/* Section Label */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-gray-200 text-sm sm:text-base font-inter font-medium tracking-wider uppercase mb-4">
                About Us
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bebas font-bold leading-tight">
                We are a new<br />
                kind of pharmacy
              </h1>
            </motion.div>

            {/* Main Description */}
            <motion.div 
              className="space-y-6"
              variants={itemVariants}
            >
              <p className="text-gray-100/90 text-base sm:text-lg leading-relaxed font-inter">
                Or maybe a new kind of pharmacy mixed with an old type of pharmacy. 
                Anything but a chain type of pharmacy, where you wait in line to talk to 
                people who would rather be anywhere else.
              </p>
              
              <p className="text-gray-100/90 text-base sm:text-lg leading-relaxed font-inter">
                At MediAI, we revolutionize how patients receive their medicines 
                by offering an automated, hassle-free pharmacy delivery system. 
                Our smart solution ensures timely, accurate, and secure delivery 
                of prescriptions directly from pharmacies to patients' doorsteps.
              </p>

              <p className="text-gray-100/90 text-base sm:text-lg leading-relaxed font-inter">
                We are the type of pharmacy made up of friendly, caring pharmacists 
                who carry prescriptions straight to your door, at the tap of your phone. 
                We are also people who take pleasure in looking after people and hope 
                to take care of you for years to come.
              </p>
            </motion.div>

            {/* Signature */}
            <motion.div
              className="pt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <p className="text-gray-200 text-base font-inter">With love,</p>
              <p className="text-white text-xl font-playfair font-semibold">MediAI</p>
            </motion.div>
          </motion.div>

          {/* Right Content - Image */}
          <motion.div
            className="relative"
            variants={imageVariants}
          >
            <motion.div
              className="relative rounded-2xl overflow-hidden shadow-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src="https://i.pinimg.com/736x/eb/42/c5/eb42c59d21cf015c5949cc65207b56a8.jpg"
                alt="Medical professionals working"
                className="w-full h-[400px] sm:h-[450px] lg:h-[500px] xl:h-[600px] object-cover"
              />
              
              {/* Subtle gradient overlay matching the teal theme */}
              <div className="absolute inset-0 bg-gradient-to-t from-teal-900/20 via-transparent to-transparent"></div>
            </motion.div>

            {/* Decorative floating elements with teal tints */}
            <motion.div
              className="absolute -top-4 -right-4 w-24 h-24 rounded-full blur-2xl"
              style={{ backgroundColor: 'rgba(37, 108, 92, 0.3)' }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full blur-3xl"
              style={{ backgroundColor: 'rgba(37, 108, 92, 0.25)' }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Background decorative elements with teal theme */}
      <motion.div
        className="absolute top-20 right-10 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(61, 159, 137, 0.3) 0%, transparent 70%)' }}
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 left-10 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(37, 108, 92, 0.25) 0%, transparent 70%)' }}
        animate={{
          x: [0, -40, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </section>
  );
};

export default About;