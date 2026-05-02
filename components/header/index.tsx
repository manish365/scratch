import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import useOnClickOutside from "use-onclickoutside";
import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";
import { UserDataStorageService } from "../../utils/services";
import { useDispatch } from "react-redux";
import { clearProfile } from "store/reducers/user";
import { useSelector } from "react-redux";
import { RootState } from "store";
import MenuNavBar from "./menu-navbar";
import MenuHeader from "./menu-header";

type HeaderType = {
  isErrorPage?: Boolean;
};

const Header = ({ isErrorPage }: HeaderType) => {
  const router = useRouter();
  const arrayPaths = ["/"];
  const showNavbar = false;

  const [_onTop, setOnTop] = useState(
    !arrayPaths.includes(router.pathname) || isErrorPage ? false : true
  );
  const [_menuOpen, setMenuOpen] = useState(false);
  const [_searchOpen, setSearchOpen] = useState(false);
  const navRef = useRef(null);
  const searchRef = useRef(null);
  const dispatch = useDispatch();
  const { homePageContent }: any = useSelector((state: RootState) => state.cms);
  const { websiteMeta }: any = useSelector((state: RootState) => state.cms);
  const { menuData } = useSelector((state: RootState) => state.menu);

  const headerClass = () => {
    if (window.pageYOffset === 0) {
      setOnTop(true);
    } else {
      setOnTop(false);
    }
  };

  useEffect(() => {
    if (!arrayPaths.includes(router.pathname) || isErrorPage) {
      return;
    }

    headerClass();
    window.onscroll = function () {
      headerClass();
    };
  }, [homePageContent, websiteMeta, menuData]);
  // console.log('homePageContent===>>>>', homePageContent);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const closeSearch = () => {
    setSearchOpen(false);
  };

  // on click outside
  useOnClickOutside(navRef, closeMenu);
  useOnClickOutside(searchRef, closeSearch);

  const { data: session, status } = useSession();
  if (status === "authenticated") {
    // console.log('Session Data==>>>', session, status);
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

  function convertCityUrl(url: string) {
    if (!url) return "";
    let urlParts = url.split("/");
    let cityIndex = urlParts.indexOf("city");

    if (cityIndex !== -1 && cityIndex + 1 < urlParts.length) {
      let lowercasePart = urlParts[cityIndex + 1].toLowerCase();
      let titlecaseString = lowercasePart.replace(/\b\w/g, (char: any) =>
        char.toUpperCase()
      );
      urlParts[cityIndex + 1] = titlecaseString;
      let convertedUrl = urlParts.join("/");
      return convertedUrl;
    } else {
      return url;
    }
  }

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
      _onTop ? "bg-transparent py-4" : "bg-white/95 backdrop-blur-md shadow-sm py-2"
    }`}>
      {/* Hide the top banner if scrolled to make header sleek */}
      {_onTop && (
        <div className="w-full bg-primary/10 text-charcoal text-xs md:text-sm font-sans tracking-widest text-center py-2 transition-all duration-300">
          <p className="m-0">
            {homePageContent?.payload?.header?.title || "COMPLIMENTARY SAME-DAY DELIVERY"}
            {homePageContent?.payload?.header?.links?.map((item: any, index: number) => (
              <Link
                href={convertCityUrl(item?.link)}
                key={index}
                className="ml-2 font-medium hover:text-primary transition-colors"
              >
                {item?.title}
              </Link>
            ))}
          </p>
        </div>
      )}

      <div className={`container mx-auto px-4 md:px-8 transition-colors duration-300 ${_onTop ? 'text-white' : 'text-charcoal'}`}>
        <MenuNavBar />
        {menuData?.length && <MenuHeader menuDetailsData={menuData} />}
      </div>
    </header>
  );
};

export default Header;
