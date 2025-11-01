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

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate('/login');
    }
  };

  const skipOnboarding = () => {
    navigate('/login');
  };

  return (
    <div className="relative flex h-screen w-full flex-col bg-gradient-to-br from-slate-50 to-blue-50 justify-between overflow-hidden font-['Manrope','Noto_Sans',sans-serif]">
      {/* Skip Button - Top Right */}
      {currentSlide < slides.length - 1 && (
        <div className="absolute top-8 right-6 z-10">
          <button
            onClick={skipOnboarding}
            className="text-slate-600 text-sm font-medium hover:text-slate-800 transition-colors duration-200 px-3 py-1 rounded-full hover:bg-slate-100"
          >
            Skip
          </button>
        </div>
      )}

      {/* Carousel Container */}
      <div className="relative flex-1 overflow-hidden">
        <div 
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={slide.id} className="flex flex-col flex-shrink-0 w-full h-full">
              {/* Slide Content */}
              <div className="flex flex-col justify-center flex-1 px-6">
                {/* Image Section with Enhanced Styling */}
                <div className={`flex items-center justify-center ${index === 2 ? 'order-2 mt-8' : 'mb-8'}`}>
                  <div className="flex items-center justify-center w-full max-w-sm">
                    <div 
                      className="w-full bg-center bg-no-repeat bg-cover rounded-2xl h-64 shadow-lg transform transition-all duration-300 hover:scale-105"
                      style={{ 
                        backgroundImage: `url("${slide.image}")`,
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                      }}
                    ></div>
                  </div>
                </div>

                {/* Text Content with Enhanced Typography */}
                <div className={`${index === 2 ? 'order-1' : ''}`}>
                  <div className="text-center space-y-4">
                    <h2 className="text-slate-800 text-2xl md:text-3xl font-bold leading-tight bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                      {slide.title}
                    </h2>
                    <p className="text-slate-600 text-base font-normal leading-relaxed max-w-md mx-auto">
                      {slide.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Dots */}
        {/* <div className="absolute left-0 right-0 bottom-24">
          <div className="flex flex-row items-center justify-center w-full gap-2 py-5">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-blue-600 w-8' 
                    : 'bg-slate-300 w-2 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        </div> */}
      </div>

      {/* Bottom Navigation */}
      <div className="pb-8 px-6">
        {/* Action Button with Enhanced Styling */}
        <div className="flex justify-center">
          <button
            onClick={nextSlide}
            className="w-full max-w-sm cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-semibold leading-normal tracking-wide shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <span className="truncate">
              {currentSlide === slides.length - 1 ? 'Get Started' : 'Continue'}
            </span>
          </button>
        </div>

        {/* Optional: Back button for better UX */}
        {currentSlide > 0 && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setCurrentSlide(currentSlide - 1)}
              className="text-slate-500 text-sm font-medium hover:text-slate-700 transition-colors duration-200 px-4 py-2"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;