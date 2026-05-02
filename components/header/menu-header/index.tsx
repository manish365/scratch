import React, { useState, useEffect } from 'react';
import { FaSearch, FaUserCircle, FaChevronDown } from "react-icons/fa";
import MenuOptions from './MenuOptions'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { toggleDeliveryModal, toggleMobileMenu } from '../../../store/reducers/cms';
import { MenuDataType } from '../../../store/reducers/menu';
import { useRouter } from 'next/router';

const MenuHeader = (props: any) => {
  const router = useRouter();
  const { mobileMenuOpened } = useSelector((state: RootState) => state.cms);
  const [search, setSearch] = useState('');
  const [homeMenuHeaderData, setHomeMenuHeaderData] =
    useState<MenuDataType[]>([]);
  const dispatch = useDispatch();

  const onMobileMenuToggle = () => {
    dispatch(toggleMobileMenu());
  }

  const onToggleDeliveryModal = () => {
    dispatch(toggleDeliveryModal());
  }

  const gotoTrackOrder = () => {
    onMobileMenuToggle();
    router.push("/order-tracking");
  };

  const gotoLogin = () => {
    onMobileMenuToggle();
    router.push("/auth/login");
  }

  const gotoContactUs = () => {
    onMobileMenuToggle();
    router.push("/cms/contact-us");
  }

  // const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (event.key === "Enter") {
  //     handleSearchList();
  //   }
  // };
  const handleSearchList = () => {
    if (search !== "") {
      router.push(`/list/search?term=${search}`);
    }
  };

  useEffect(() => {
    if(props.menuDetailsData?.length) {
      setHomeMenuHeaderData(props.menuDetailsData || []);
    }
  }, [props.menuDetailsData]);

  return (
    <section className="col-xl-12 col-lg-12 col-md-12 col-12 no-padding">
      <header className="header header_area">
        <div className="main_header_area animated">
          <div className="container-fluid">
            <nav id="navigation1" className="navigation">
              <div className="nav-header d-lg-none d-block">
                <div className="nav-toggle" onClick={onMobileMenuToggle}></div>
                <div className="hedr">
                  <div className="navbar-form" role="search">
                    <div className="form-group">
                      <input
                        className="form-control"
                        placeholder="Search Flowers"
                        type="text"
                        value={search}
                        name="search"
                        onChange={($e) => setSearch($e.target.value)}
                        // onKeyPress={handleKeyPress}
                      />
                      <button
                        type="button"
                        className="btn btn-default paddo search-btn"
                        id="search"
                        onClick={handleSearchList}
                        aria-label='Search'
                        role='search'
                      >
                        <i style={{ fontSize: "16px", fontWeight: "bold" }}>
                          <FaSearch />
                        </i>
                      </button>
                    </div>
                  </div>
                </div>
                {mobileMenuOpened && (
                  <div className="gift-to mobile-view">
                    <div className="gift-to-inner">
                      <span>Delivering To:</span>
                      <div
                        className="city-inner city-modal-trigger-1"
                        data-toggle="modal"
                        data-target="#Location"
                      >
                        <div className="flag-col united-arab-emirates"></div>
                        <div className="city-flag-section">
                          <div
                            className="city-name selected-delivery-location"
                            onClick={onToggleDeliveryModal}
                          >
                            Choose Location
                          </div>
                        </div>
                        <i>
                          <FaChevronDown className="caret-icon" />
                        </i>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {mobileMenuOpened && (
                <>
                  <div
                    className={`nav-menus-wrapper ${
                      mobileMenuOpened ? "mb-menu-main" : ""
                    }`}
                  >
                    <div className="mobile-view menu-head">
                      <div className="mob-usr">
                        <i aria-hidden="true">
                          <FaUserCircle />
                        </i>
                        Hi Guest !
                      </div>
                      <ul className="customer-links">
                        <li id="mn91">
                          {" "}
                          <a
                            className="cursor-pointer"
                            onClick={gotoTrackOrder}
                          >
                            Track Order
                          </a>{" "}
                        </li>
                        <li id="mn101">
                          {" "}
                          <a className="cursor-pointer" onClick={gotoLogin}>
                            Login{" "}
                          </a>{" "}
                        </li>
                        <li id="mn111">
                          {" "}
                          <a className="cursor-pointer" onClick={gotoContactUs}>
                            Customer Care{" "}
                          </a>{" "}
                        </li>
                      </ul>
                    </div>
                    {!!homeMenuHeaderData?.length && (
                      <MenuOptions
                        screen={"mobile"}
                        homeMenuHeaderData={homeMenuHeaderData}
                      />
                    )}
                  </div>
                  <div
                    className="menu-overlay"
                    onClick={onMobileMenuToggle}
                  ></div>
                </>
              )}
            </nav>
          </div>
          {!!homeMenuHeaderData?.length && (
            <MenuOptions
              screen={"desktop"}
              homeMenuHeaderData={homeMenuHeaderData}
            />
          )}
        </div>
      </header>
    </section>
  );
};

export default MenuHeader;
