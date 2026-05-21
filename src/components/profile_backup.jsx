import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./profile.css";
import {
  User,
  Calendar,
  Package,
  LogOut,
  FileText,
  Camera,
  Clock,
  ShoppingCart,
} from "lucide-react";
import Footer from "./footer";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);

  const [appointments] = useState([]);
  const [orders] = useState([]);

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    address: "",
  });

  const [profilePic, setProfilePic] = useState(null);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Error fetching user:', error);
          navigate('/login');
          return;
        }

        if (user) {
          // Set profile data from user metadata
          setProfile({
            firstName: user.user_metadata?.first_name || user.user_metadata?.full_name?.split(' ')[0] || "",
            lastName: user.user_metadata?.last_name || user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || "",
            email: user.email || "",
            phone: user.user_metadata?.phone || "",
            gender: user.user_metadata?.gender || "",
            dob: user.user_metadata?.dob || "",
            address: user.user_metadata?.address || "",
          });
        } else {
          // No user logged in, redirect to login
          navigate('/login');
        }
      } catch (error) {
        console.error('Error in fetchUserData:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePicUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Update user metadata in Supabase
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: profile.firstName,
          last_name: profile.lastName,
          full_name: `${profile.firstName} ${profile.lastName}`,
          phone: profile.phone,
          gender: profile.gender,
          dob: profile.dob,
          address: profile.address,
        }
      });

      if (error) {
        console.error('Error updating profile:', error);
        alert('Error updating profile: ' + error.message);
      } else {
        setIsEditing(false);
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 2000);
      }
    } catch (error) {
      console.error('Error in handleSave:', error);
      alert('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    console.log('Logout function called');
    try {
      // Clear any local storage or session storage if needed
      localStorage.clear();
      sessionStorage.clear();
      
      // Attempt Supabase logout but don't wait for it
      supabase.auth.signOut().catch(err => console.log('Supabase logout error:', err));
      
      // Navigate immediately
      console.log('Navigating to login...');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Navigate regardless of error
      navigate('/login');
    }
  };

  return (
    <div className="profile-page">
      {/* Reserved Navbar Space */}
      <div className="navbar-space"></div>

      {loading ? (
        <div className="loading-container" style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '60vh',
          fontSize: '1.2rem',
          color: '#666'
        }}>
          Loading profile...
        </div>
      ) : (
        <div className="profile-layout">
          {/* Sidebar */}
          <aside className="sidebar slide-in">
            <h2 className="sidebar-title">My Account</h2>
            <ul className="menu">
              <li
                className={`menu-item ${activeTab === "Profile" ? "active" : ""}`}
                onClick={() => setActiveTab("Profile")}
              >
                <User size={18} /> Profile
              </li>
              <li
                className={`menu-item ${activeTab === "Appointments" ? "active" : ""}`}
                onClick={() => setActiveTab("Appointments")}
              >
                <Calendar size={18} /> My Appointments
              </li>
              <li
                className={`menu-item ${activeTab === "Orders" ? "active" : ""}`}
                onClick={() => setActiveTab("Orders")}
              >
                <Package size={18} /> My Orders
              </li>
              <li
                className={`menu-item ${activeTab === "Tests" ? "active" : ""}`}
                onClick={() => setActiveTab("Tests")}
              >
                <FileText size={18} /> My Hearing Test
              </li>
              <li className="menu-item logout" onClick={() => {
                console.log('Logout button clicked'); // Debug log
                handleLogout();
              }}>
                <LogOut size={18} /> Logout
              </li>
            </ul>
          </aside>

          {/* Main Content */}
          <main className={`profile-content fade-in ${activeTab}`}>
            {activeTab === "Profile" && (
              <>
                <div className="profile-header pop-in">
                  <div className="avatar-container">
                    <img
                      src={
                        profilePic ||
                        "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                      }
                      alt="Profile"
                      className="profile-avatar"
                    />
                    <label htmlFor="file-upload" className="upload-icon">
                      <Camera size={18} />
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      onChange={handlePicUpload}
                      style={{ display: "none" }}
                    />
                  </div>
                  <div className="profile-info">
                    <h3>
                      {profile.firstName} {profile.lastName}
                    </h3>
                    <p>{profile.email}</p>
                  </div>
                </div>

                <section className="profile-info card-animate">
                  <h4 className="info-title">Personal Information</h4>
                  <div className="form-grid">
                    <input
                      type="text"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    <input
                      type="text"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    <input
                      type="text"
                      name="phone"
                      value={profile.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    <select
                      name="gender"
                      value={profile.gender}
                      onChange={handleChange}
                      disabled={!isEditing}
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                    <input
                      type="date"
                      name="dob"
                      value={profile.dob}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    <textarea
                      name="address"
                      value={profile.address}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <button
                    className="edit-btn"
                    onClick={() =>
                      isEditing ? handleSave() : setIsEditing(true)
                    }
                  >
                    {isEditing ? "Save Changes" : "Edit Profile"}
                  </button>
                </section>
              </>
            )}

            {activeTab === "Appointments" &&
              (appointments.length === 0 ? (
                <div className="empty-state fade-in">
                  <Calendar size={48} className="empty-state-icon" />
                  <h3 className="empty-state-title">
                    No Appointments Available
                  </h3>
                  <p className="empty-state-text">
                    You don't have any appointments scheduled.
                    <br />
                    Book your first appointment to get started.
                  </p>
                  <button className="empty-state-btn">
                    <Clock size={16} /> Book Appointment
                  </button>
                </div>
              ) : (
                <h2>Your Appointments</h2>
              ))}

            {activeTab === "Orders" &&
              (orders.length === 0 ? (
                <div className="empty-state fade-in">
                  <Package size={48} className="empty-state-icon" />
                  <h3 className="empty-state-title">No Orders Found</h3>
                  <p className="empty-state-text">
                    You haven't placed any orders yet. Start shopping
                    <br />
                    to see your orders here.
                  </p>
                  <button className="empty-state-btn">
                    <ShoppingCart size={16} /> Start Shopping
                  </button>
                </div>
              ) : (
                <h2>Your Orders</h2>
              ))}

            {activeTab === "Tests" && (
              <h2 className="fade-in">
                📝 Previous Hearing Test Results (Content Coming Soon)
              </h2>
            )}
          </main>
        </div>
      )}

      {showPopup && <div className="popup">✅ Changes Saved!</div>}

      <Footer />
    </div>
  );
}
