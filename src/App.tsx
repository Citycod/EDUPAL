
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Onboarding from './pages/Onboarding';
 import Login from './auth/Login';
 import Signup from './auth/Signup';
 import Verification from './auth/Verification'
  import Home from './pages/Home';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verification" element={<Verification />} />
         <Route path="/home" element={<Home />} />  
      </Routes>
    </BrowserRouter>
  );
};

export default App;