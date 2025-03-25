import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import RequestForResetPass from "./pages/AuthPages/RequestForResetPass";
import ResetPass from "./pages/AuthPages/ResetPass";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import Roles from "./pages/userroles/Roles";
import CreateRole from "./pages/userroles/CreateRole";
import EditRole from "./pages/userroles/EditRole";
import Users from "./pages/users/Users";
import CreateUser from "./pages/users/CreateUser";
import EditUser from "./pages/users/EditUser";
import UserLogs from "./pages/userlogs/UserLogs";
import HomePage from './pages/HomePage';
import Contact from './pages/Contact'
import About from "./pages/About";
import  ProcessedSlotsPage from './components/main/ProcessedSlotsPage'
import { ReactNode } from "react";
import InvoicesPage from './components/main/InvoicesPage'
import UserBookings from './components/main/UserBookings'
import UserInvoices from './components/main/UserInvoices'
import  Bookings from './pages/bookings/Bookings'
import  ConfirmBooking from './pages/bookings/ConfirmBooking'
import  AllInvoices from './pages/invoices/AllInvoices'
import  Adslots from './pages/ad_losts/Adslots'
import  CreateAdSlot from './pages/ad_losts/CreateAdSlot'
import  EditAdSlot from  './pages/ad_losts/EditAdSlot'

// Define props for ProtectedRoute
interface ProtectedRouteProps {
  children: ReactNode;
}

// ProtectedRoute component to mimic Vue's navigation guard
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem("token");

  // Check if the route requires authentication and if token exists
  if (!token) {
    // Redirect to the sign-in page if no token
    return <Navigate to="/" replace />;
  }

  // If authenticated, render the children (protected content)
  return children;
};

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout with Protected Routes */}
          <Route element={<AppLayout />}>
            <Route
              index
              path="/dashboard"
              element={
                <ProtectedRoute>
                     <Home />
                </ProtectedRoute>
              }
            />

            {/* Others Page */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfiles />
                </ProtectedRoute>
              }
            />
             <Route
              path="/user-roles"
              element={
                <ProtectedRoute>
                  <Roles />
                </ProtectedRoute>
              }
            />
                  
                  <Route
  path="/edit-role/:roleId"
  element={
    <ProtectedRoute>
      <EditRole />
    </ProtectedRoute>
  }
/>

          
            <Route
              path="/create-role"
              element={
                <ProtectedRoute>
                  <CreateRole />
                </ProtectedRoute>
              }
            />


<Route
              path="/users"
              element={
                <ProtectedRoute>
                  <Users   />
                </ProtectedRoute>
              }
            />


<Route
              path="/create-user"
              element={
                <ProtectedRoute>
                  <CreateUser />
                </ProtectedRoute>
              }
            />

<Route
  path="/edit-user/:userId"
  element={
    <ProtectedRoute>
      <EditUser />
    </ProtectedRoute>
  }
/>

<Route
  path="/user-logs"
  element={
    <ProtectedRoute>
      <UserLogs />
    </ProtectedRoute>
  }

/>


<Route
  path="/processed-slots"
  element={
    <ProtectedRoute>
      <ProcessedSlotsPage />
    </ProtectedRoute>
  }

/>




<Route
  path="/invoices"
  element={
    <ProtectedRoute>
      <InvoicesPage />
    </ProtectedRoute>
  }

/>

<Route
  path="/user/bookings"
  element={
    <ProtectedRoute>
      <UserBookings />
    </ProtectedRoute>
  }

/>

<Route
  path="/user/invoices"
  element={
    <ProtectedRoute>
      <UserInvoices />
    </ProtectedRoute>
  }

/>

<Route
  path="/bookings"
  element={
    <ProtectedRoute>
      <Bookings />
    </ProtectedRoute>
  }

/>


<Route
  path="/confirm-booking/:bookId"
  element={
    <ProtectedRoute>
      <ConfirmBooking />
    </ProtectedRoute>
  }
/>


<Route
  path="/view-invoices"
  element={
    <ProtectedRoute>
      <AllInvoices />
    </ProtectedRoute>
  }

/>


<Route
  path="/ad-slots"
  element={
    <ProtectedRoute>
      <Adslots />
    </ProtectedRoute>
  }

/>

<Route
  path="/create/ad-slot"
  element={
    <ProtectedRoute>
      <CreateAdSlot />
    </ProtectedRoute>
  }

/>



<Route
  path="/edit/ad-slot/:adslotId"
  element={
    <ProtectedRoute>
      <EditAdSlot/>
    </ProtectedRoute>
  }
/>

            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <Calendar />
                </ProtectedRoute>
              }
            />
            <Route
              path="/blank"
              element={
                <ProtectedRoute>
                  <Blank />
                </ProtectedRoute>
              }
            />

            {/* Forms */}
            <Route
              path="/form-elements"
              element={
                <ProtectedRoute>
                  <FormElements />
                </ProtectedRoute>
              }
            />

            {/* Tables */}
            <Route
              path="/basic-tables"
              element={
                <ProtectedRoute>
                  <BasicTables />
                </ProtectedRoute>
              }
            />

            {/* Ui Elements */}
            <Route
              path="/alerts"
              element={
                <ProtectedRoute>
                  <Alerts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/avatars"
              element={
                <ProtectedRoute>
                  <Avatars />
                </ProtectedRoute>
              }
            />
            <Route
              path="/badge"
              element={
                <ProtectedRoute>
                  <Badges />
                </ProtectedRoute>
              }
            />
            <Route
              path="/buttons"
              element={
                <ProtectedRoute>
                  <Buttons />
                </ProtectedRoute>
              }
            />
            <Route
              path="/images"
              element={
                <ProtectedRoute>
                  <Images />
                </ProtectedRoute>
              }
            />
            <Route
              path="/videos"
              element={
                <ProtectedRoute>
                  <Videos />
                </ProtectedRoute>
              }
            />

            {/* Charts */}
            <Route
              path="/line-chart"
              element={
                <ProtectedRoute>
                  <LineChart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bar-chart"
              element={
                <ProtectedRoute>
                  <BarChart />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Public Routes - Auth Layout */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact/>} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/reset-password" element={<ResetPass />} />
          <Route path="/request-for/reset-password" element={<RequestForResetPass/>} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />

          
        </Routes>
      </Router>
    </>
  );
}