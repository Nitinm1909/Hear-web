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
  const [uploadingPic, setUploadingPic] = useState(false);

  const [appointments] = useState([]);
  const [orders] = useState([]);
  const [hearingTests, setHearingTests] = useState([]);

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

  // ─── Fetch user profile on mount ─────────────────────────────────────────
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          navigate("/login");
          return;
        }

        // Use maybeSingle() — returns null instead of throwing when no row exists
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
        }

        if (profileData) {
          const nameParts = (profileData.full_name || "").split(" ");
          setProfile({
            firstName: nameParts[0] || "",
            lastName: nameParts.slice(1).join(" ") || "",
            email: profileData.email || user.email || "",
            phone: profileData.phone || "",
            gender: profileData.gender || "",
            dob: profileData.date_of_birth || "",
            address: profileData.address || "",
          });

          if (profileData.avatar_url) {
            setProfilePic(profileData.avatar_url);
          }
        } else {
          // Fallback to auth metadata when no profile row exists yet
          setProfile({
            firstName: user.user_metadata?.first_name || "",
            lastName: user.user_metadata?.last_name || "",
            email: user.email || "",
            phone: user.user_metadata?.phone || "",
            gender: user.user_metadata?.gender || "",
            dob: user.user_metadata?.dob || "",
            address: user.user_metadata?.address || "",
          });
        }

        // Also fetch hearing tests
        await fetchHearingTests(user.id);
      } catch (err) {
        console.error("Unexpected error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // ─── Fetch hearing tests ──────────────────────────────────────────────────
  const fetchHearingTests = async (userId) => {
    try {
      const { data: testsData, error } = await supabase
        .from("hearing_tests")
        .select("*")
        .eq("user_id", userId)
        .order("test_date", { ascending: false })
        .limit(3);

      if (error) {
        console.error("Error fetching hearing tests:", error);
        return;
      }

      if (testsData) {
        setHearingTests(testsData);
      }
    } catch (err) {
      console.error("Error in fetchHearingTests:", err);
    }
  };

  const refreshHearingTests = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) await fetchHearingTests(user.id);
  };

  // ─── Handle form field changes ────────────────────────────────────────────
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // ─── Upload profile picture ───────────────────────────────────────────────
  const handlePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingPic(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        alert("Please log in to upload a profile picture.");
        return;
      }

      // Show local preview immediately
      const previewUrl = URL.createObjectURL(file);
      setProfilePic(previewUrl);

      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      // Upload file to 'avatars' bucket
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        alert("Error uploading image: " + uploadError.message);
        return;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const avatarUrl = urlData.publicUrl;

      // Upsert profile row with new avatar_url
      // Requires user_id to have a UNIQUE constraint in the profiles table
      const { error: upsertError } = await supabase.from("profiles").upsert(
        {
          user_id: user.id,
          avatar_url: avatarUrl,
          email: user.email,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

      if (upsertError) {
        console.error("Profile upsert error:", upsertError);
        alert("Image uploaded but failed to save URL: " + upsertError.message);
        return;
      }

      // Set the permanent URL (replaces the blob preview)
      setProfilePic(avatarUrl);
      console.log("Profile picture saved successfully:", avatarUrl);
    } catch (err) {
      console.error("Error uploading profile picture:", err);
      alert("Error uploading profile picture.");
    } finally {
      setUploadingPic(false);
    }
  };

  // ─── Save profile changes ─────────────────────────────────────────────────
  const handleSave = async () => {
    try {
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        alert("User not authenticated");
        return;
      }

      const profileData = {
        user_id: user.id,
        full_name: `${profile.firstName} ${profile.lastName}`.trim(),
        email: profile.email || user.email,
        phone: profile.phone || null,
        date_of_birth: profile.dob || null,
        gender: profile.gender || null,
        address: profile.address || null,
        updated_at: new Date().toISOString(),
      };

      // upsert handles both insert and update cleanly
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(profileData, { onConflict: "user_id" });

      if (profileError) {
        console.error("Profile save error:", profileError);
        alert("Error updating profile: " + profileError.message);
        return;
      }

      // Also sync to auth metadata as a backup
      await supabase.auth.updateUser({
        data: {
          first_name: profile.firstName,
          last_name: profile.lastName,
          full_name: `${profile.firstName} ${profile.lastName}`.trim(),
          phone: profile.phone,
          gender: profile.gender,
          dob: profile.dob,
          address: profile.address,
        },
      });

      setIsEditing(false);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
    } catch (error) {
      console.error("Error in handleSave:", error);
      alert("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  // ─── Logout ───────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  // ─── Helper: parse ear results ────────────────────────────────────────────
  const parseEarResults = (raw) => {
    try {
      if (!raw) return null;
      const results = typeof raw === "string" ? JSON.parse(raw) : raw;
      return Array.isArray(results) ? results : null;
    } catch {
      return null;
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="profile-page">
      {/* Reserved Navbar Space */}
      <div className="navbar-space"></div>

      {loading ? (
        <div
          className="loading-container"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
            fontSize: "1.2rem",
            color: "#666",
          }}
        >
          Loading profile...
        </div>
      ) : (
        <div className="profile-layout">
          {/* ── Sidebar ── */}
          <aside className="sidebar slide-in">
            <h2 className="sidebar-title">My Account</h2>
            <ul className="menu">
              {[
                { label: "Profile", icon: <User size={18} /> },
                { label: "Appointments", icon: <Calendar size={18} /> },
                { label: "Orders", icon: <Package size={18} /> },
                { label: "Tests", icon: <FileText size={18} /> },
              ].map(({ label, icon }) => (
                <li
                  key={label}
                  className={`menu-item ${activeTab === label ? "active" : ""}`}
                  onClick={() => {
                    setActiveTab(label);
                    if (label === "Tests") refreshHearingTests();
                  }}
                >
                  {icon} {label === "Tests" ? "My Hearing Test" : `My ${label === "Profile" ? "" : ""}${label}`}
                </li>
              ))}
              <li className="menu-item logout" onClick={handleLogout}>
                <LogOut size={18} /> Logout
              </li>
            </ul>
          </aside>

          {/* ── Main Content ── */}
          <main className={`profile-content fade-in ${activeTab}`}>

            {/* ══ PROFILE TAB ══ */}
            {activeTab === "Profile" && (
              <>
                {/* Avatar + name */}
                <div className="profile-header pop-in">
                  <div className="avatar-container">
                    <img
                      src={
                        profilePic ||
                        "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                      }
                      alt="Profile"
                      className="profile-avatar"
                      style={{ opacity: uploadingPic ? 0.5 : 1 }}
                    />
                    <label
                      htmlFor="file-upload"
                      className="upload-icon"
                      title="Change profile picture"
                      style={{ cursor: uploadingPic ? "not-allowed" : "pointer" }}
                    >
                      <Camera size={18} />
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      onChange={handlePicUpload}
                      disabled={uploadingPic}
                      style={{ display: "none" }}
                    />
                  </div>
                  <div className="profile-info">
                    <h3>
                      {profile.firstName} {profile.lastName}
                    </h3>
                    <p>{profile.email}</p>
                    {uploadingPic && (
                      <small style={{ color: "#888" }}>Uploading photo…</small>
                    )}
                  </div>
                </div>

                {/* Personal info form */}
                <section className="profile-info card-animate">
                  <h4 className="info-title">Personal Information</h4>
                  <div className="form-grid">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={profile.firstName}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={profile.lastName}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={profile.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    <input
                      type="text"
                      name="phone"
                      placeholder="Phone"
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
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <label className="field-label" htmlFor="dob-input">Date of Birth</label>
                    <input
                      id="dob-input"
                      type="date"
                      name="dob"
                      value={profile.dob}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    <textarea
                      name="address"
                      placeholder="Address"
                      value={profile.address}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <button
                    className="edit-btn"
                    onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                  >
                    {isEditing ? "Save Changes" : "Edit Profile"}
                  </button>
                  {isEditing && (
                    <button
                      className="edit-btn"
                      style={{ marginLeft: "10px", background: "#ccc", color: "#333" }}
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                  )}
                </section>

                {/* Last hearing tests summary */}
                <section className="profile-info card-animate">
                  <h4 className="info-title">My Last Hearing Tests</h4>
                  {hearingTests.length > 0 ? (
                    <div className="hearing-tests-grid">
                      {hearingTests.map((test) => {
                        const leftResults = parseEarResults(test.left_ear_results);
                        const rightResults = parseEarResults(test.right_ear_results);
                        return (
                          <div key={test.id} className="test-card">
                            <div className="test-header">
                              <span className="test-date">
                                {new Date(test.test_date).toLocaleDateString()}
                              </span>
                              <span className="test-score">
                                Score: {test.overall_score ?? "N/A"}
                              </span>
                            </div>
                            <div className="test-results">
                              <div className="ear-result">
                                <span>Left Ear:</span>
                                <span className="result-data">
                                  {leftResults
                                    ? `${leftResults.length} frequencies tested`
                                    : "Not tested"}
                                </span>
                              </div>
                              <div className="ear-result">
                                <span>Right Ear:</span>
                                <span className="result-data">
                                  {rightResults
                                    ? `${rightResults.length} frequencies tested`
                                    : "Not tested"}
                                </span>
                              </div>
                              <div className="test-time">
                                <Clock size={14} />
                                <span>
                                  {new Date(test.test_date).toLocaleTimeString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="no-tests">
                      <FileText
                        size={32}
                        style={{ color: "#ccc", marginBottom: "10px" }}
                      />
                      <p>
                        No hearing tests available. Take your first test to see
                        results here.
                      </p>
                    </div>
                  )}
                </section>
              </>
            )}

            {/* ══ APPOINTMENTS TAB ══ */}
            {activeTab === "Appointments" &&
              (appointments.length === 0 ? (
                <div className="empty-state fade-in">
                  <Calendar size={48} className="empty-state-icon" />
                  <h3 className="empty-state-title">No Appointments Available</h3>
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

            {/* ══ ORDERS TAB ══ */}
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

            {/* ══ TESTS TAB ══ */}
            {activeTab === "Tests" && (
              <div className="tests-section fade-in">
                <div className="tests-header">
                  <h2>📝 My Hearing Test History</h2>
                  <button
                    className="take-test-btn"
                    onClick={() => navigate("/hearingtest")}
                  >
                    <FileText size={16} />
                    Take New Test
                  </button>
                </div>

                {hearingTests.length > 0 ? (
                  <div className="detailed-tests-grid">
                    {hearingTests.map((test, index) => {
                      const leftResults = parseEarResults(test.left_ear_results);
                      const rightResults = parseEarResults(test.right_ear_results);

                      return (
                        <div key={test.id} className="detailed-test-card">
                          <div className="test-card-header">
                            <div className="test-number">
                              Test #{hearingTests.length - index}
                            </div>
                            <div className="test-date-time">
                              <div className="test-date">
                                {new Date(test.test_date).toLocaleDateString()}
                              </div>
                              <div className="test-time">
                                {new Date(test.test_date).toLocaleTimeString()}
                              </div>
                            </div>
                            <div className="overall-score">
                              <span className="score-label">Overall Score</span>
                              <span className="score-value">
                                {test.overall_score ?? "N/A"}
                              </span>
                            </div>
                          </div>

                          <div className="ear-results-detailed">
                            {/* Left ear */}
                            <div className="ear-result-section">
                              <h4>Left Ear Results</h4>
                              {leftResults ? (
                                <div className="frequency-results">
                                  {leftResults.map((result, idx) => (
                                    <div key={idx} className="frequency-item">
                                      <span>{result.freq}Hz: </span>
                                      <span
                                        className={
                                          result.heard ? "heard" : "not-heard"
                                        }
                                      >
                                        {result.heard ? "✓ Heard" : "✗ Not heard"}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="no-data">No data available</p>
                              )}
                            </div>

                            {/* Right ear */}
                            <div className="ear-result-section">
                              <h4>Right Ear Results</h4>
                              {rightResults ? (
                                <div className="frequency-results">
                                  {rightResults.map((result, idx) => (
                                    <div key={idx} className="frequency-item">
                                      <span>{result.freq}Hz: </span>
                                      <span
                                        className={
                                          result.heard ? "heard" : "not-heard"
                                        }
                                      >
                                        {result.heard ? "✓ Heard" : "✗ Not heard"}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="no-data">No data available</p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="no-tests-detailed">
                    <FileText
                      size={64}
                      style={{ color: "#ccc", marginBottom: "20px" }}
                    />
                    <h3>No Hearing Tests Available</h3>
                    <p>Take your first hearing test to see detailed results here.</p>
                    <button
                      className="take-first-test-btn"
                      onClick={() => navigate("/hearingtest")}
                    >
                      <FileText size={16} />
                      Take Your First Test
                    </button>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      )}

      {showPopup && <div className="popup">✅ Changes Saved!</div>}

      <Footer />
    </div>
  );
}
