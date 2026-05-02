import React, { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { UserDataStorageService } from "../../utils/services";
import { useDispatch } from "react-redux";
import { clearProfile, toggleDashboardSidebar } from "../../store/reducers/user";
import { Dropdown } from "react-bootstrap";
import { FaUser, FaBars } from "react-icons/fa";

const Header = () => {
  const dispatch = useDispatch();

  const { data: session, status } = useSession();
  if (status === "authenticated") {
    UserDataStorageService.saveUserData(session);
    // signOut();
  }
  const handleSignOut = async () => {
    await signOut(); // Sign out the user
    await UserDataStorageService.clearUserData(); // clear session storage for user Data
    await dispatch(clearProfile());
    setTimeout(() => {
      window.location.href = "/"; // Navigate to the home page
    });
  };
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    dispatch(toggleDashboardSidebar(!isOpen));
  };

  return (
    <header className="col-xl-12 col-lg-12 col-12 sticky-top w-100 p-0">
      <nav className="navbar navbar-light navbar-expand-lg py-0 p-0">
        <div className="dashboard-header bg-white col-xl-12 col-lg-12 col-md-12 col-12 px-0 d-flex flex-wrap justify-content-between">
          <div className="dashboard-header-container container-fluid">
            {/* Left Header Parts */}
            <div className="feed-left-header d-flex align-items-center justify-content-start">
              <div
                className="left-header-parts d-inline-flex align-items-center"
                style={{ marginLeft: "-2px" }}
              >
                <div className="d-flex flex-wrap align-items-center mr-3 pr-3">
                  <button
                    type="button"
                    className="sidebar-menu-toggler"
                    aria-label="Toggle navigation"
                    onClick={toggleSidebar}
                  >
                    <i style={{ fontSize: "18px", fontWeight: "bold" }}>
                      <FaBars />
                    </i>
                  </button>
                </div>

                <a href={"/"} style={{ display: "inline-flex" }}>
                  <img
                    alt=""
                    width="388"
                    height="100"
                    className="img-fluid logo-img"
                    src="/images/logos/logo.png"
                  />
                </a>
              </div>
            </div>
            {/* Right Header Parts */}
            <div className="feed-right-header flex-row align-items-center justify-content-end d-flex">
              <div className="right-header-parts">
                <div className="d-flex align-items-center text-right">
                  <ul>
                    {session?.user && status === "authenticated" ? (
                      <li className="desktop-view">
                        <Dropdown
                          style={{ outline: "none", boxShadow: "none" }}
                        >
                          <Dropdown.Toggle
                            variant="transparent"
                            id="dropdown-basic"
                            style={{ outline: "none", boxShadow: "none" }}
                          >
                            <a
                              type="button"
                              role="button"
                              aria-expanded="false"
                            >
                              <span
                                className="text-dark nav-link font-weight-bolder p-0"
                                style={{ fontSize: "12px" }}
                              >
                                Hi, {session?.user?.name}
                              </span>
                              <span
                                className="text-dark nav-link font-weight-bolder p-0"
                                style={{ fontSize: "12px" }}
                              >
                                {session?.user?.email}
                              </span>
                            </a>
                          </Dropdown.Toggle>
                          <ul className="d-flex flex-wrap align-items-center for-arw lg-aw">
                            <Dropdown.Menu>
                              <Dropdown.Item href="/">Home</Dropdown.Item>
                              <Dropdown.Item href="/profile/view-user-profile">
                                My Account
                              </Dropdown.Item>
                              <Dropdown.Item href="/auth/change-password">
                                Change Password
                              </Dropdown.Item>
                              <Dropdown.Item onClick={handleSignOut}>
                                Logout
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </ul>
                        </Dropdown>
                      </li>
                    ) : (
                      <li className="desktop-view">
                        <a
                          type="button"
                          role="button"
                          aria-expanded="false"
                          onClick={() => signIn()}
                        >
                          <i style={{ fontSize: "16px", fontWeight: "bold" }}>
                            <FaUser />
                          </i>
                          User Login
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
