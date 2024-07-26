// import SearchBar from "./components/search-bar";
import Landing from "./pages/landing";
import DesktopInstance from "./pages/desktop-instance";
// import DesktopInstanceForm from "./components/desktop-instance-form";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import axios from "axios";
import Hub from "./pages/hub";
import { useEffect } from "react";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />}></Route>
          <Route path="/setup" element={<DesktopInstance />} />
          <Route path="/hub" element={<Hub />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
