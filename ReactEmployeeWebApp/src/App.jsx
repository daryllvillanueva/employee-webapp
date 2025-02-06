import React from 'react'
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./components/Home";
import PageNotFound from "./components/partials/PageNotFound";
import Employees from "./components/Employees";
import EmployeeProfile from "./components/EmployeeProfile";
import EmployeeEditForm from './components/EmployeeEditForm';
import EmployeeCreateForm from './components/EmployeeCreateForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/employees" element={<Employees />}/>
        <Route path="/employees/:id" element={<EmployeeProfile />}/>
        <Route path="/employees/:id/edit" element={<EmployeeEditForm />} />
        <Route path="/employees/create" element={<EmployeeCreateForm />} />
        <Route path="*" element={<PageNotFound />}/>
      </Routes>
    </Router>
  )
}

export default App
