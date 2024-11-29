import React from 'react';
import Mainpage from './components/Mainpage';
import DoctorLogin from './page/doctorLogin';
import NurseLogin from './page/nurseLogin';
import DoctorSignup from './page/doctorSignup';
import NurseSignup from './page/nurseSignup';
import Homepage from './page/home';
import MedicalRecords from './page/medicalRecords';
import Materials from './page/materials';
import { BrowserRouter , Routes, Route} from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Mainpage/>}/>
        <Route path="/doctor/login" element={<DoctorLogin/>}/>
        <Route path="/nurse/login" element={<NurseLogin/>}/>
        <Route path="/doctor/signup" element={<DoctorSignup/>}/>
        <Route path="/nurse/signup" element={<NurseSignup/>}/>
        <Route path="/home" element={<Homepage/>}/>
        <Route path="/manage-medicalrecords" element={<MedicalRecords/>}/>
        <Route path="/manage-materials" element={<Materials/>}/>
      </Routes>
    </BrowserRouter>
  );
}
