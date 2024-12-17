import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import reportWebVitals from './reportWebVitals';
import Login from './components/js/login';
import Dashboard from './components/js/Dashboard';
import Apppr from './components/js/Apppr'; // Import your component
import ProtectedRoute from './ProtectedRoute'; // Import the ProtectedRoute component
import RedirectToRole from './RedirectToRole'; // Import the RedirectToRole component
import ViewBills from './components/js/ViewBills'; // Import the ViewBills component
import AdminPage from './components/js/adminpage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/redirect" element={<RedirectToRole />} /> {/* Use this for redirection based on role */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<Dashboard />} />}
        />
        <Route
          path="/place-order"
          element={<ProtectedRoute element={<Apppr />} />}
        />
        <Route
          path="/view-bills"
          element={<ProtectedRoute element={<ViewBills />} />}
        />
        {/* Ensure you have a route for /adminpage if you have it */}
        <Route
          path="/adminpage"
          element={<ProtectedRoute element={<AdminPage />} />} // Replace Dashboard with AdminPage if you have one
        />
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
