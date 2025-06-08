import { Routes, Route } from "react-router-dom";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import ProtectedRoute from "./components/common/ProtectedRoute";
import UserProfiles from "./pages/UserProfiles";
import ApprovalRequest from "./pages/ApprovalRequest/ApprovalRequest";
import SppbFilling from "./pages/SPPBFilling/SppbFilling";
import ApprovalMonitoring from "./pages/ApprovalMonitoring/ApprovalMonitoring";
import DetailSppb from "./pages/SPPBFilling/DetailSppb";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/signin" element={<SignIn />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="/approval-monitoring" element={<ApprovalMonitoring />} />
            <Route path="/approval-monitoring/detail/:id" element={<DetailSppb />} />

            <Route path="/approval-request" element={<ApprovalRequest />} />
            <Route path="/approval-request/detail/:id" element={<DetailSppb />} />

            <Route path="/sppb-filling" element={<SppbFilling />} />
            <Route path="/sppb-filling/detail/:id" element={<DetailSppb />} />
            <Route path="/sppb-filling/add" element={<DetailSppb />} />

            <Route path="/profile" element={<UserProfiles />} />
            {/* Add more protected routes here */}
          </Route>
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
