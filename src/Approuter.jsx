
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Login from './pages/Login'
// import Dashboard from "./pages/Dashboard";
// import Spool from "./pages/Spool";
// import DrawingSpool from "./pages/DrawingSpool";
// import AppLayout from "./components/AppLayout";

// const Approuter = () => {
//   return (
//     <div>
//       <Router>
//         <AppLayout>
//         <Routes>
//           <Route>
//             <Route path="/" element={<Login />} />
//             <Route path="/dashboard" element={<Dashboard />} />
//             <Route path="/spool" element={<Spool />} />
//             {/* <Route path="/spool/:id" element={<Spool />} /> */}
//             <Route path="/drawing-spool" element={<DrawingSpool />} />
//           </Route>
//         </Routes>
//         </AppLayout>
//       </Router>
//     </div>
//   )
// }

// export default Approuter



import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import AppLayout from "./components/AppLayout";
import Login from "./pages/Login";

// Lazy load pages (BIG performance improvement)
// const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Spool = lazy(() => import("./pages/Spool"));
const DrawingSpool = lazy(() => import("./pages/DrawingSpool"));

const Approuter = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <AppLayout >
          <Routes>
            {/* Public Route */}
            <Route path="/" element={<Login />} />

            {/* Protected Layout Routes */}
            <Route >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/spool" element={<Spool />} />
              <Route path="/drawing-spool" element={<DrawingSpool />} />
            </Route>

          </Routes>
        </AppLayout >
      </Suspense>
    </Router>
  );
};

export default Approuter;
