import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ImageUpload from "./ImageUpload";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route to ImageUpload */}
        <Route path="/" element={<ImageUpload />} />
      </Routes>
    </Router>
  );
}

export default App;