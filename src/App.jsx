import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TheHeader from './components/TheHeader/TheHeader'
import Home from './components/Home/Home'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import Profile from './components/Profile/Profile'
import PostDetail from './components/Posts/PostDetail'
import Search from './components/Search/Search.jsx'
import PrivateZone from './guards/PrivateZone.jsx'
import NotFound from './components/NotFound/NotFound'
import TokenVerifier from './components/TokenVerifier/TokenVerifier.jsx'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <TheHeader />
        <TokenVerifier> 
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search/:postName" element={<Search />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={
              <PrivateZone>
                <Profile />
              </PrivateZone>  
            } />
            <Route path="/posts/id/:_id" element={<PostDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TokenVerifier>
      </BrowserRouter>
    </div>
  )
}

export default App
