import Login from './components/login/login'
import Register from './components/register/register'
import TheHeader from './components/TheHeader/TheHeader'
import Home from './components/Home/Home'
import Profile from './components/Profile/Profile'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
 return (
   <div className='App'>
     <BrowserRouter>
       <TheHeader />
       <Routes>
         <Route path='/' element={<Home />} />
         <Route path='/register' element={<Register />} />
         <Route path='/login' element={<Login />} />
         <Route path="/profile" element={<Profile />} />
       </Routes>
     </BrowserRouter>
   </div>
 )
}

export default App
