import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface OnboardingSlide {
  id: number;
  image: string;
  title: string;
  description: string;
}

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: OnboardingSlide[] = [
    {
      id: 1,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0Rqkt669u4CBJCkvPE1HpFgM-r-pZk-qMRrdWfqkLWjIVUss8BbZNqh300Qcuz1IQz7kZv8uzMW3YCM4tUptM2bi6HuEDFGka3Wmuj44quhsRizdA1iWnLtG350zXPj9Y-2r7AllMAfvkEWvVQJcz1xGpV2ILryYOBSAuFLo1iX2I7pxpu3dsF79ipAe7KzLJH_E2jBemyCVeP7Ad2ThUeZ1h8UF830jYMODIUe5gGP3ahwLUylVBvP3UBxBxNHgJZibOJWKsL-oM",
      title: "Access past questions & study notes from peers",
      description: "EduPal connects you with fellow students, providing access to a wealth of study materials and past exam questions."
    },
    {
      id: 2,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuADqjoyaim_FuWO-_a5IHIA5qFEeTacFacRvYyShtKzj1Nv8zr5OU6CB41Q_J4SDlD5sLKHeRpgyoLJzmReA2ScdJfcEXPFMpytkIbICZORIkdVFiFErTJX37yDXUxrMqTKSad5yQvIRa5zBQIChWPWt7h_rfYhlzw9A2Ph2JIE0mMz1YQ-2PbcE89bKDjUqFzFqzSj88nW-AQrqk2gGVvG9T_9LDZ6wP5ve18dx15uUOJCIxRuEbQAIYU2ij-1fEbbg2WAr4y3mbBw",
      title: "Rate and discover quality resources",
      description: "Find the best study materials by rating and reviewing resources from your peers."
    },
    {
      id: 3,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQ79142VzZaLVRAWIFJu5-5ZFCZu8UhaKKGRNjjtp2ZP3dcULmfiDGXBmfY7PCLw3f-_5IBqDStW429WybNGaKxIVlzCqcCjJvL6V83F3uaJ2c-dK_b6Rs_OtoURK7OtZMgA1Jw-hO9yVqAgTes34C_Dlw31K__add6Iqna-Y743T_9NtJ_q67dEILBdEYwmXVQbESp0pZ-T7jNnA18K27SN3YBGjY5qxM64xMCE1NmWzp5jk8mTW9aVFmZAEifuneorUIhupz2SQh ",
      title: "Join your university's academic network",
      description: "Connect with peers, share study resources, and collaborate on projects within your academic community."
    }
  ];

  // In your Onboarding.tsx, update the navigation:
const nextSlide = () => {
  if (currentSlide < slides.length - 1) {
    setCurrentSlide(currentSlide + 1);
  } else {
    navigate('/login'); // Changed from '/login' to be explicit
  }
};

const skipOnboarding = () => {
  navigate('/login'); // Changed from '/login' to be explicit
};

  return (
    <div className="relative flex h-screen w-full flex-col bg-white justify-between overflow-hidden font-['Manrope','Noto_Sans',sans-serif]">
      {/* Carousel Container */}
      <div className="relative flex-1 overflow-hidden">
        <div 
          className="flex h-full transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={slide.id} className="flex flex-col flex-shrink-0 w-full h-full">
              {/* Slide Content */}
              <div className="flex flex-col justify-center flex-1">
                {/* Different layout for slide 3 */}
                {index === 2 ? (
                  // Slide 3 layout (text first, then image)
                  <>
                    {/* Text Content First */}
                    <div className="px-4 pt-5 pb-3">
                      <h2 className="text-[#111418] tracking-tight text-[28px] font-bold leading-tight text-center pb-3">
                        {slide.title}
                      </h2>
                      <p className="text-[#111418] text-base font-normal leading-normal text-center">
                        {slide.description}
                      </p>
                    </div>

                    {/* Image Section - CENTERED */}
                    <div className="flex items-center justify-center flex-1 p-4">
                      <div className="flex items-center justify-center w-full max-w-md">
                        <div 
                          className="w-full bg-center bg-no-repeat bg-cover rounded-lg h-50"
                          style={{ backgroundImage: `url("${slide.image}")` }}
                        ></div>
                      </div>
                    </div>
                  </>
                ) : (
                  // Slides 1 & 2 layout (image first, then text)
                  <>
                    {/* Image Section - CENTERED */}
                    <div className="flex items-center justify-center flex-1 px-4 py-1">
                      <div className="flex items-center justify-center w-full max-w-md">
                        <div 
                          className="w-full bg-center bg-no-repeat bg-cover rounded-lg h-80"
                          style={{ backgroundImage: `url("${slide.image}")` }}
                        ></div>
                      </div>
                    </div>

                    {/* Text Content */}
                    <div className="px-4 pb-3">
                      <h2 className="text-[#111418] tracking-tight text-[28px] font-bold leading-tight text-center pb-3">
                        {slide.title}
                      </h2>
                      <p className="text-[#111418] text-base font-normal leading-normal text-center">
                        {slide.description}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Progress Dots (Uncomment if needed) */}
        {/* <div className="absolute left-0 right-0 bottom-24">
          <div className="flex flex-row items-center justify-center w-full gap-3 py-5">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-[#111418]' : 'bg-[#dbe0e6]'
                }`}
              />
            ))}
          </div>
        </div> */}
      </div>

      {/* Bottom Navigation */}
      <div className="pb-8">
        {/* Action Button */}
        <div className="flex justify-center px-4 py-3">
          <button
            onClick={nextSlide}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 flex-1 bg-[#1172d4] text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-blue-700 transition-colors duration-200"
          >
            <span className="truncate">
              {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
            </span>
          </button>
        </div>

        {/* Skip Button (show on all slides except last) */}
        {currentSlide < slides.length - 1 && (
          <div className="flex justify-center">
            <button
              onClick={skipOnboarding}
              className="text-[#1172d4] text-base font-medium hover:text-blue-700 transition-colors duration-200"
            >
              Skip
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;