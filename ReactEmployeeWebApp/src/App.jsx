import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./components/Home";
import PageNotFound from "./components/partials/PageNotFound";
import Employees from "./components/Employees";
import React, { useEffect, useState } from 'react'
import Header from "./components/partials/Header";

function App() {
  const [isToggled, setIsToggled] = useState(false);
  const handleToggled = () => {
    setIsToggled(!isToggled);
  };

  useEffect(() => {
    if (isToggled) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isToggled]);

  return (
    <Router>
      <Header handleToggled={handleToggled} isToggled={isToggled} />
      <Routes>
        <Route path="/" element={<Home isToggled={isToggled} handleToggled={handleToggled}/>}/>
        <Route path="/employees" element={<Employees isToggled={isToggled} handleToggled={handleToggled}/>}/>
        <Route path="*" element={<PageNotFound/>}/>
      </Routes>
    </Router>
  )
}

export default App
