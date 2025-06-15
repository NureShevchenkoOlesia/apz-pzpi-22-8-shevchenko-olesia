import './App.css'
import './styles/tailwind.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/home"
import Register from './pages/Register';
import Login from "./pages/Login";
import Dashboard from './pages/Dashboard';
import MainLayout from "./layout/MainLayout"
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import UploadObservation from './pages/UploadObservation';
import SearchPage from './pages/SearchPage';
import UserProfile from './pages/UserProfile';
import Gallery from './pages/Gallery';
import EventsPage from './pages/EventsPage';
import EditObservationPage from './pages/EditObservationPage';
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/upload" element={<UploadObservation />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/users/:userId" element={<UserProfile />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/astronomical-events" element={<EventsPage />} />
          <Route path="/observations/:id/edit" element={<EditObservationPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} /> 
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </MainLayout>
    </Router>
  )
}

export default App
