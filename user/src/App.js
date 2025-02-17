import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Import BrowserRouter

import Login from './Pages/Login/Login';
import SignUp from './Pages/SignUp/SignUp';
import Home from './Pages/Home/Home';
import SideBarLayout from './Layout/SideBarLayout/SideBarLayout';
import Cart from './Pages/Cart/Cart';
import SingleBook from './Pages/SingleBook/SingleBook';
import ReservedBooks from './Pages/ReservedBooks/ReservedBooks';
import SubmittedBooks from './Pages/SubmittedBooks/SubmittedBooks';
import AddPublication from './Pages/AddPublication/AddPublication';





function App() {
  return (
    <Router> 
      <Routes>
        <Route path='/login' element={<Login/>} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Navigate replace to="/login" />} />
        
        {/* SidebarLayout and its child routes */}
        <Route path="/app/:userName" element={<SideBarLayout />}>
          <Route index element={<Home />} />
          
          <Route path="book/:id" element={<SingleBook/>} />
          <Route path='books-cart' element={<Cart/>} />
          <Route path='reserved-history' element={<ReservedBooks/>} />
          <Route path='submitted-history' element={<SubmittedBooks/>} />
          <Route path='publication' element={<AddPublication/>} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
