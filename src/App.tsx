import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SplashScreen from './pages/splashscreen';
import Onboarding from './pages/Onboarding';
import Login from './auth/Login';
import Signup from './auth/Signup'
import ResetPassword from './auth/ResetPassword';;
import Verification from './auth/Verification';
import Home from './pages/Home';
import StudyResources from './pages/StudyResources';
import ResourceDetail from './pages/ResourceDetail';
// import Search from './pages/main/Search';

// import Profile from './pages/main/Profile';
// import Notifications from './pages/main/Notifications';
// import Settings from './pages/main/Settings';

const App: React.FC = () => {
  return (
    <div className="mobile-app-container">
      <BrowserRouter>
        <div className="mobile-viewport">
          <Routes>
            {/* Auth Flow */}
            <Route path="/" element={<SplashScreen />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/reset-password" element={<ResetPassword/>} />
            <Route path="/verification" element={<Verification />} />
            
            {/* Main App */}
            <Route path="/home" element={<Home />} />
            <Route path="/study" element={<StudyResources />} />
            <Route path="/resource/:id" element={<ResourceDetail />} />
            
            {/* <Route path="/search" element={<Search />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} /> */}
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;