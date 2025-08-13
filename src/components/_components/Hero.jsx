import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Hero = () => {
  const navigate = useNavigate();

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

  return (
    <section
      className="relative w-full min-h-screen overflow-hidden flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/5998512/pexels-photo-5998512.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Content */}
      <div className="max-w-7xl w-full">
        <div className="flex flex-col justify-center items-center px-36 space-y-12 lg:text-left mt-10">
          <div className="space-y-4">
            <h3
              className="text-4xl lg:text-5xl leading-tight text-center font-playfair font-semibold"
              style={{
                color: "#DBF5F0",
              }}
            >
              Your health is our priority.....123 Always Caring,{" "}
              <span className="text-yellow-400">Always Here</span>..{" "}
              <span className="relative">
                care
                <div className="absolute -top-2 -right-8 transform rotate-12">
                  <div
                    className="px-4 py-2 rounded-lg text-lg shadow-lg font-kalam font-bold"
                    style={{
                      backgroundColor: " rgb(253, 224, 71,.8) ",
                      color: "#115E59",
                    }}
                  >
                    Health
                  </div>
                </div>
              </span>{" "}
              system
            </h3>
          </div>

          <div
            className="backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto lg:mx-0"
            style={{ backgroundColor: "rgba(219, 245, 240, 0.1)" }}
          >
            <p
              className="leading-relaxed mb-4 font-inter"
              style={{
                color: "rgba(219, 245, 240, 0.9)",
              }}
            >
              Online Pharmacy aimed to increase the comfort and convenience of
              people wanting to order medicines online.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start items-center">
              <button
                onClick={() => navigate("/register")}
                className="relative group font-bold text-sm font-inter text-[#115E59] rounded-full p-[2px] -translate-x-1 -translate-y-1 outline-2 outline-transparent outline-offset-4 transition-all duration-150 ease-in-out bg-[#292524] shadow-[0.5px_0.5px_0_0_#292524,1px_1px_0_0_#292524,1.5px_1.5px_0_0_#292524,2px_2px_0_0_#292524,2.5px_2.5px_0_0_#292524,3px_3px_0_0_#292524,0_0_0_2px_#fafaf9,0.5px_0.5px_0_2px_#fafaf9,1px_1px_0_2px_#fafaf9,1.5px_1.5px_0_2px_#fafaf9,2px_2px_0_2px_#fafaf9,2.5px_2.5px_0_2px_#fafaf9,3px_3px_0_2px_#fafaf9,3.5px_3.5px_0_2px_#fafaf9,4px_4px_0_2px_#fafaf9] hover:translate-x-0 hover:translate-y-0 hover:shadow-[0_0_0_2px_#fafaf9] focus-visible:outline-dashed focus-visible:outline-[#facc15]"
              >
                <div className="relative pointer-events-none bg-[#facc15] border border-white/30 rounded-full before:absolute before:inset-0 before:rounded-full before:opacity-50 before:bg-[radial-gradient(rgba(255,255,255,0.8)_20%,transparent_20%),radial-gradient(white_20%,transparent_20%)] before:bg-[length:8px_8px] before:bg-[position:0_0,4px_4px] before:animate-[dots_0.5s_linear_infinite]">
                  <span className="relative flex items-center justify-center px-5 py-3 gap-1 filter drop-shadow-[0_-1px_0_rgba(255,255,255,0.25)] active:translate-y-[2px]">
                    Get Started
                  </span>
                </div>
              </button>

              <Button
                onClick={() => {
                  const element = document.getElementById("CardContent");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="glow-rgb-border font-inter font-semibold transform hover:scale-105 hover:shadow-lg active:scale-95"
                style={{
                  fontWeight: 600,
                  color: "#DBF5F0",
                  backgroundColor: "#222222",
                }}
              >
                 contact us

              </Button>
            </div>
          </div>
        </div>

        {/* Optional Right Section or Image Placeholder */}
        <div></div>
      </div>
    </section>
  );
};

export default Hero;
