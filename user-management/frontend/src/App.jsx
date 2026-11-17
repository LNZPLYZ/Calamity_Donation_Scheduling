import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Donations from './pages/Donations/Donations.jsx'
import Navbar from './components/Navbar.jsx'
import UserLoginForm from './pages/Authentication/UserLoginForm.jsx'
import UserSignupForm from './pages/Authentication/UserSignupForm.jsx'


// Define the top-level layout and the routes that can be opened in the frontend.
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            
            {/* The home page displays the donation list and the donation form. */}
            <Route path="/donations" element={<Donations />} />
            {/* Login currently verifies credentials and displays a welcome message. */}
            <Route path="/login" element={<UserLoginForm />} />
            <Route path="/signup" element={<UserSignupForm/>} />

          </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App;
