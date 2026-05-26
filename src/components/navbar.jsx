import React, { useRef, useState, useEffect } from 'react';
import { Search, User, ChevronDown } from 'lucide-react';
import { Link, useLocation } from "react-router-dom";
import { supabase } from '../supabaseClient';
import './navbar.css';
import './navbarres.css';

const alwaysBlackPages = ['/products', '/hearingtest', '/profile', '/support'];

const Navbar = () => {
  const [searchActive, setSearchActive] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');

  const searchRef = useRef(null);
  const userDropdownRef = useRef(null);
  const location = useLocation();

  const pathname = location.pathname;

  // Detect scroll only for Home and About
  useEffect(() => {
    if (!alwaysBlackPages.includes(pathname)) {
      const handleScroll = () => setScrolled(window.scrollY > 10);
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [pathname]);

  // Detect screen resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get user session and profile name
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('user_id', session.user.id)
          .single();
        
        setUserName(profile?.full_name || '');
      }
    };

    fetchUserData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user || null);
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('user_id', session.user.id)
          .single();
        
        setUserName(profile?.full_name || '');
      } else {
        setUserName('');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const getUserDisplayName = () => {
    if (!user) return 'Guest';
    return userName || user.email || 'User';
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchActive(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUserClick = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  const handleLogout = () => {
    supabase.auth.signOut();
    setUserDropdownOpen(false);
    window.location.href = '/login';
  };



  // Navbar class logic
  const navbarClass = `navbar ${
    alwaysBlackPages.includes(pathname) || scrolled ? 'scrolled solid' : ''
  }`;

  return (
    <nav className={navbarClass}>
      <div className="logo">H . E . A . R</div>

      <ul className={`nav-links ${menuOpen ? 'show' : ''}`}>
        <li><Link to="/">Home</Link></li>

        {isMobile && (
          <li>
            <Link to="/profile">Profile</Link>
          </li>
        )}

        <li><Link to="/about">About</Link></li>
        <li><Link to="/products">Products</Link></li>
        <li><Link to="/support">Support</Link></li>
        <li><Link to="/hearingtest">Take a Hearing Test</Link></li>
      </ul>

      <div className="nav-icons">
        <div
          className={`hamburger ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div
          className={`search-container ${searchActive ? 'active' : ''}`}
          ref={searchRef}
          onClick={() => setSearchActive(true)}
        >
          <Search className="icon" />
          <input
            type="text"
            className="search-bar"
            placeholder="Search hearing aids"
            autoFocus={searchActive}
          />
        </div>



        {!isMobile && (
          <div className="user-container" ref={userDropdownRef}>
            <div className="user-trigger" onClick={handleUserClick}>
              <User className="custicon" />
              <ChevronDown size={16} style={{ color: 'white', marginLeft: '4px' }} />
            </div>
            
            {userDropdownOpen && (
              <div className="user-dropdown">
                <div className="dropdown-header">
                  Welcome, {getUserDisplayName()}
                </div>
                <ul>
                  {user ? (
                    <>
                      <li><Link to="/profile" onClick={() => setUserDropdownOpen(false)}>My Profile</Link></li>
                      <li><span onClick={handleLogout} style={{cursor: 'pointer', color: 'white'}}>Logout</span></li>
                    </>
                  ) : (
                    <>
                      <li><Link to="/profile" onClick={() => setUserDropdownOpen(false)}>My Profile</Link></li>
                      <li><Link to="/login" onClick={() => setUserDropdownOpen(false)}>Login / Signup</Link></li>
                    </>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
