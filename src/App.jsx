import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TheHeader from './components/TheHeader/TheHeader';
import TheFooter from './components/TheFooter/TheFooter.jsx';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Profile from './components/Profile/Profile';
import PostDetail from './components/Posts/PostDetail';
import Search from './components/Search/Search.jsx';
import PrivateZone from './guards/PrivateZone.jsx';
import NotFound from './components/NotFound/NotFound';
import './App.scss'

function App() {
  return (
    <div className="app-container">
      <BrowserRouter>
        <TheHeader />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
            
            <Route path="/search/:postName" element={
              <PrivateZone>
                <Search />
              </PrivateZone>
            } />
            <Route path="/profile" element={
              <PrivateZone>
                <Profile />
              </PrivateZone>
            } />
            <Route path="/posts/id/:_id" element={
              <PrivateZone>
                <PostDetail />
              </PrivateZone>
            } />
            <Route path="/login" element={<Login />} />
          </Routes>
          <TheFooter />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
