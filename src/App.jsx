import Login from './components/Login/Login.jsx'
import Register from './components/Register/Register.jsx'
import TheHeader from './components/TheHeader/TheHeader'
import Home from './components/Home/Home'
import Profile from './components/Profile/Profile'
import PostDetail from "./components/Posts/PostDetail"
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <TheHeader />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/posts/id/:_id" element={<PostDetail />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
