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
import ClassesPage from './pages/ClassesPage';
import CommunityPage from './pages/CommunityPage';
import CommunityPostDetail from './pages/CommunityPostDetail';
// import Search from './pages/main/Search';
 import ProfilePage from './pages/ProfilePage';
 import Notifications from './pages/Notifications';
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
            <Route path="/classes" element={<ClassesPage />} />
            <Route path="/community" element={<CommunityPage />} />
        <Route path="/community/:postId" element={<CommunityPostDetail />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/notification" element={<Notifications />} />
            {/* <Route path="/search" element={<Search />} />
            
            
            <Route path="/settings" element={<Settings />} /> */}
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;