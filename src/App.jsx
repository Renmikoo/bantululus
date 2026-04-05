import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomCursor from './components/CustomCursor';
import Home from './pages/Home';
import ServicesDetail from './pages/ServicesDetail';
import BehindScenes from './pages/BehindScenes'; // <--- Ini tempat yang benar

function App() {
  return (
    <Router>
      <CustomCursor />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<ServicesDetail />} />
        <Route path="/behind-the-scenes" element={<BehindScenes />} />
      </Routes>
    </Router>
  );
}

export default App;