import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './Pages/Login/Login';
import SignUp from './Pages/SignUp/SignUp';
import Home from './Pages/Home/Home';
import SideBarLayout from './Layout/SideBarLayout/SideBarLayout';
import Cart from './Pages/Cart/Cart';
import SingleBook from './Pages/SingleBook/SingleBook';
import ReservedBooks from './Pages/ReservedBooks/ReservedBooks';
import SubmittedBooks from './Pages/SubmittedBooks/SubmittedBooks';
import AddPublication from './Pages/AddPublication/AddPublication';
import PasswordReset from './Pages/PasswordReset/PasswordReset';

// RequireAuth component checks if a librarianId exists in localStorage.
// If not, it navigates to the login page.
function RequireAuth({ children }) {
  const librarianId = localStorage.getItem("userId");
  if (!librarianId) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login/>} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/password-reset" element={<PasswordReset />} />
        <Route path="/" element={<Navigate replace to="/login" />} />

        {/* Protected routes */}
        <Route path="/app/:userName" element={
          <RequireAuth>
            <SideBarLayout />
          </RequireAuth>
        }>
          <Route index element={<Home />} />
          <Route path="book/:id" element={<SingleBook/>} />
          <Route path='cart' element={<Cart/>} />
          <Route path='reserved-history' element={<ReservedBooks/>} />
          <Route path='submitted-history' element={<SubmittedBooks/>} />
          <Route path='publication' element={<AddPublication/>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
