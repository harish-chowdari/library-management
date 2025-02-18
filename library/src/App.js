import './App.css';
import {  Routes, Route, Navigate } from 'react-router-dom';
import Login from "./pages/login/login"
import Signup from "./pages/signup/signup"
import Home from "./pages/home/home.jsx"
import AddBooks from './pages/addBooks/addBooks.jsx'
import SidebarLayout from './layout/sidebarLayout.jsx';
import Users from "./pages/Users/Users.js"
import UserBooks from './pages/UserBooks/UserBooks.js';
import Publications from './pages/Publications/Publications.jsx';
import PasswordReset from './pages/PasswordReset/PasswordReset.jsx';
import EditBook from './pages/EditBook/EditBook.jsx';

function App() {
  return (
    <>
    <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/password-reset" element={<PasswordReset />} />
        <Route path="/" element={<Navigate replace to="/login" />} />
        
        <Route path="/app/:userName" element={<SidebarLayout />}>
          <Route index element={<Home />} />
          <Route path="add-books" element={<AddBooks />} />
          <Route path="edit-book/:id" element={<EditBook/>} />
          <Route path='reserved-users' element = {<Users/>} />
          <Route path="reserved-users/:userId" element={<UserBooks/>} />
          <Route path='publications' element={<Publications/>} />
        </Route>
        
    </Routes>
    </>
  );
}

export default App;
