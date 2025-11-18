import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import NotFound from "pages/NotFound";
import MainDashboard from './pages/main-dashboard';
import LoginPage from './pages/login';
import EquipmentAssignment from './pages/equipment-assignment';
import DocumentGeneration from './pages/document-generation';
import EquipmentChangeManagement from './pages/Equipment Change Management';
import EquipmentHistory from './pages/equipment-history';
import EditEquipment from './pages/edit-equipment'; // Import the new component

const Routes = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<MainDashboard />} />
        <Route path="/main-dashboard" element={<MainDashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/equipment-assignment" element={<EquipmentAssignment />} />
        <Route path="/document-generation" element={<DocumentGeneration />} />
        <Route path="/equipment-change-management" element={<EquipmentChangeManagement />} />
        <Route path="/equipment-history" element={<EquipmentHistory />} />
        <Route path="/edit-equipment" element={<EditEquipment />} /> {/* Add the new route */}
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
    </BrowserRouter>
  );
};

export default Routes;
