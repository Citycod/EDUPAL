import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

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
        <FontAwesomeIcon icon={faPlus} className="w-5 h-5" />
      </button>
    </div>
  );
};

export default FloatingActionButton;