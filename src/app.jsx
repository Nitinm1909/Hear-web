// src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { supabase } from "./supabaseClient";
import Navbar from "./components/navbar";
import ProductsPage from "./components/products";
import Hero from "./components/hero";
import Support from "./components/support";
import Profile from "./components/profile";
import Login from "./components/login";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import AboutUs from "./components/about";
import HearingTest from "./components/hearingtest";
import Chatbot from "./components/Chatbot";
import Hero2 from "./components/hero2";
import Timeline from "./components/timeline";
import Footer from "./components/footer";
import HearingInfo from "./components/HearingInfo";

import "./App.css";

const AppContent = () => {
  const location = useLocation();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', _event, session);
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ✅ Pages where you want black navbar
  const blackNavbarPages = ["/about", "/support", "/profile"];
  const isBlackNavbar = blackNavbarPages.includes(location.pathname);

  const hideExtras = location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/forgot-password" || location.pathname === "/reset-password";

  // NEW LOGIC STARTS HERE
  // List of old pages that have their own footer inside their component file.
  const pagesWithOwnFooter = [
    "/",
    "/support",
    "/profile",
    "/about",
    "/hero2",
    "/timeline",
     "/products" 
  ];

  // This will be true if the current page is in the list above.
  const shouldHideMainFooter = pagesWithOwnFooter.includes(location.pathname);
  // NEW LOGIC ENDS HERE

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app-container">
      {!hideExtras && <Navbar darkBackground={isBlackNavbar} />}

      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/support" element={<Support />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/hearingtest" element={<HearingTest />} />
        <Route path="/hero2" element={<Hero2 />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/hearinginfo" element={<HearingInfo />} />
        <Route path="/products" element={<ProductsPage />} /> {/* ✅ Add this */}

      </Routes>

      {!hideExtras && <Chatbot />}

      {/* MODIFIED: The main footer will now only appear if we are NOT on a page that has its own footer. */}
      {!hideExtras && !shouldHideMainFooter && <Footer />}
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
