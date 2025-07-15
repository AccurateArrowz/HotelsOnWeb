import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Hotels from './pages/Hotels';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<div>Home Page (Welcome!)</div>} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/hotels/:id" element={<div>Hotel Details Page</div>} />
          <Route path="/booking" element={<div>Booking Page</div>} />
          <Route path="/dashboard" element={<div>Dashboard Page</div>} />
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/signup" element={<div>Signup Page</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
