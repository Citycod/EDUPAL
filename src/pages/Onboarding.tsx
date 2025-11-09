import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface OnboardingSlide {
  id: number;
  image: string;
  title: string;
  description: string;
  showHelpButton?: boolean;
}

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: OnboardingSlide[] = [
    {
      id: 1,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAR_YN6ixceOo6nSSHORtu-dVCmXTW5xA6XtvAWebCfdDWK0372BKHLrTpgkCiSEqkGxqBr1MF26srCY5smOdD03jlkL4FgoBsTPBGwEL69T3CX18k8HKVLpvfYK6Xgfprs62E84FSLnVlb5xxxuFoZE0RCZyngeWboKgXMl2JQglMF0dxabAeV_lr0VgqLtCrXT53D7JwqSR0hTOk7Zngsu7p2rHgAp_nXoITGbJSPeKzB6J77OoerZOtxrvrU7jhsK4opDogm5jI",
      title: "Access past questions and verified study materials",
      description: "Unlock a treasure trove of past exam papers and meticulously curated study resources, all verified for accuracy and relevance."
    },
    {
      id: 2,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAnMwlat6oVs8_1XPhSQkU_Ks9aQScKUrhm2LR9hAqrXeM-vbfRQnwXEIpm-zLuoPFYN2bvMUsMDXzl5zWLsqM9QKrsY9KGW3t1Dgi4HwNsS_BVbmxur08sX1UeD9RkcHumduUKavtlDUqnQshHx2Xb0h4L0D9hjyWOpio_AesIqfR7-7QOWCDGlXcgbYiRuNhWTFLofKVbPdNIkQXAvGbTWB6CEUBD_ux9EPI3U5tDFH8euGaQrnywdZjsLd2HblMllDlGx96ieRA",
      title: "Join virtual classes with your lecturers and peers",
      description: "Engage in interactive learning sessions, collaborate on projects, and expand your academic network.",
      showHelpButton: true
    },
    {
      id: 3,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBUcNKbPsbqLpVc1viAQx2Abzz9l9vV4KPqq8qM16ebXrVDNSrw-uYa195DHsAM-U8eVKxVHF9cHtExT3cQYWxiZSWsspitA8xsjDFGjUGZPQvfISTbpD_ioGtBp7r8x8gNFNFvhQba-toH2yOlkpVNl62ec55rd3sESidEGdrQs3qoVqHiHiH9ZSjQiq7hqPPN0qVTeKDxtYzN2TDwrHH13JCGNKEyy4QxZv3o2uMKE4ITc9AWN6VnIovCnP7sowOm1RblOX2133w",
      title: "Connect and collaborate across your university",
      description: "Join virtual study groups, share past exam questions, and build your digital campus community."
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

  const handleHelpClick = () => {
    // Add help functionality here
    console.log('Help button clicked');
  };

  const getProgressDots = () => {
    return slides.map((_, index) => (
      <div
        key={index}
        className={`h-2 w-2 rounded-full transition-all duration-300 ${
          index === currentSlide ? 'bg-[#0ba9d5]' : 'bg-[#cee3e8]'
        }`}
      />
    ));
  };

  const renderSlideContent = (slide: OnboardingSlide, index: number) => {
    if (index === 1) {
      // Second slide with help button and different layout
      return (
        <>
          {/* Help Button */}
          {slide.showHelpButton && (
            <div className="flex items-center bg-[#f8fbfc] p-4 pb-2 justify-end">
              <div className="flex items-center justify-end w-12">
                <button
                  onClick={handleHelpClick}
                  className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 bg-transparent text-[#0d191c] gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0 hover:bg-gray-100 transition-colors"
                >
                  <div className="text-[#0d191c]" data-icon="Question" data-size="24px" data-weight="regular">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M140,180a12,12,0,1,1-12-12A12,12,0,0,1,140,180ZM128,72c-22.06,0-40,16.15-40,36v4a8,8,0,0,0,16,0v-4c0-11,10.77-20,24-20s24,9,24,20-10.77,20-24,20a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-.72c18.24-3.35,32-17.9,32-35.28C168,88.15,150.06,72,128,72Zm104,56A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Title */}
          <h2 className="text-[#0d191c] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
            {slide.title}
          </h2>

          {/* Description */}
          <p className="text-[#0d191c] text-base font-normal leading-normal pb-3 pt-1 px-4 text-center">
            {slide.description}
          </p>

          {/* Image Section */}
          <div className="flex w-full grow bg-[#f8fbfc] @container p-4">
            <div className="w-full gap-1 overflow-hidden bg-[#f8fbfc] @[480px]:gap-2 aspect-[3/2] rounded-xl flex">
              <div
                className="flex-1 w-full bg-center bg-no-repeat bg-cover rounded-none aspect-auto"
                style={{ backgroundImage: `url("${slide.image}")` }}
              />
            </div>
          </div>
        </>
      );
    }

    // First and third slides with standard layout
    return (
      <>
        <div className="@container">
          <div className="@[480px]:px-4 @[480px]:py-3">
            <div
              className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden bg-[#f8fbfc] @[480px]:rounded-xl min-h-80"
              style={{ backgroundImage: `url("${slide.image}")` }}
            />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-[#0d191c] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
          {slide.title}
        </h2>

        {/* Description */}
        <p className="text-[#0d191c] text-base font-normal leading-normal pb-3 pt-1 px-4 text-center">
          {slide.description}
        </p>
      </>
    );
  };

  return (
    <div
      className="relative flex h-auto min-h-screen w-full flex-col bg-[#f8fbfc] justify-between group/design-root overflow-x-hidden"
      style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
    >
      {/* Skip Button */}
      {currentSlide < slides.length - 1 && (
        <div className="absolute z-10 top-8 right-6">
          <button
            onClick={skipOnboarding}
            className="text-[#0d191c] text-sm font-medium hover:text-[#0ba9d5] transition-colors duration-200 px-3 py-1 rounded-full hover:bg-gray-100"
          >
            Skip
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1">
        {renderSlideContent(slides[currentSlide], currentSlide)}
        
        {/* Progress Dots */}
        <div className="flex flex-row items-center justify-center w-full gap-3 py-5">
          {getProgressDots()}
        </div>
      </div>

      {/* Navigation */}
      <div>
        <div className="flex px-4 py-3">
          <button
            onClick={nextSlide}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 flex-1 bg-[#0ba9d5] text-[#f8fbfc] text-base font-bold leading-normal tracking-[0.015em] hover:bg-[#0a95c0] transition-colors"
          >
            <span className="truncate">
              {currentSlide === slides.length - 1 ? 'Get Started' : 'Continue'}
            </span>
          </button>
        </div>
        <div className="h-5 bg-[#f8fbfc]"></div>
      </div>
    </div>
  );
};

export default Onboarding;