import { useNavigate } from 'react-router-dom';

interface FloatingActionButtonProps {
  onClick?: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ 
  onClick 
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate('/upload');
    }
  };

  return (
    <div className="fixed bottom-24 right-5 z-40">
      <button
        onClick={handleClick}
        className="flex cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 w-14 bg-[#276cec] text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl active:scale-95 transform"
        aria-label="Upload resource"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
          <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"/>
        </svg>
      </button>
    </div>
  );
};

export default FloatingActionButton;