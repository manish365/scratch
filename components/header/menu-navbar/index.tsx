import React, { useState } from "react";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaUser,
  FaPhoneVolume,
  FaChevronDown,
} from "react-icons/fa";
import { Dropdown } from "react-bootstrap";
import NextLink from "next/link";
import Image from 'next/image';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { useSession, signIn, signOut } from 'next-auth/react';
import DeliveryModal from '../DeliveryModal'
import { toggleDeliveryModal } from "../../../store/reducers/cms";
import { useRouter } from 'next/router';
import { UserDataStorageService } from '../../../utils/services';
import { clearProfile, clearUser } from "../../../store/reducers/user";
import { HeaderCart } from "@components/cart";


const MenuNavBar = () => {
  const router = useRouter();
  const { deliveryModalOpened } = useSelector((state: RootState) => state.cms);

  const { user } = useSelector((state: RootState) => state.user);
  // console.log('user===>>>>', user);
  const dispatch = useDispatch();
  const [search, setSearch] = useState('')
  const onToggleDeliveryModal = () => {
    dispatch(toggleDeliveryModal());
  };
  const { data: session, status } = useSession();
  // console.log('useSession===>>>>>', useSession());
  // console.log('Session Data Menu Navbar==>>>', session, status, user, user?.status);
  if (status === 'authenticated') {
    // console.log('Session Data==>>>', session, status);
    UserDataStorageService.saveUserData(session);
    // signOut();
  }
  const handleSignOut = async () => {
    await signOut(); // Sign out the user
    await UserDataStorageService.clearUserData();
    await dispatch(clearProfile());
    await dispatch(clearUser());
    setTimeout(() => {
      window.location.href = '/' // Navigate to the home page
    },);
  };
  const redirectToContactPage = () => {
    router.push("/cms/contact-us");
  }

  const handleSearchList = () => {
    if(search !== '') {
      // console.log('handleSearchList onClick===>>>>', search);
      router.push(`/list/search?term=${search}`);
    }
  };
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearchList();
    }
  };
  const gotoTrackOrder = () => {
    router.push("/order-tracking");
  }

  return (
    <div className="w-full">
      <nav className="flex items-center justify-between py-4">
        
        {/* Logo */}
        <div className="flex-shrink-0">
          <NextLink href={"/"} className="cursor-pointer">
            <Image
              alt="FlowersChamp Logo"
              width={200}
              height={50}
              className="object-contain"
              src="/images/logos/logo.png"
            />
          </NextLink>
        </div>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-lg mx-8 relative">
          <input
            className="w-full bg-white/80 backdrop-blur-sm border border-blush focus:border-primary focus:ring-1 focus:ring-primary rounded-full py-2 px-6 text-sm outline-none transition-all duration-300 placeholder-charcoal/50"
            placeholder="Search for elegant flowers..."
            type="text"
            value={search}
            name="search"
            onChange={($event) => setSearch($event.target.value)}
            onKeyPress={handleKeyPress}
            autoComplete="off"
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-charcoal hover:text-primary transition-colors"
            onClick={handleSearchList}
          >
            <FaSearch size={14} />
          </button>
        </div>

        {/* Icons / Actions */}
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-2 cursor-pointer text-sm font-medium hover:text-primary transition-colors" onClick={onToggleDeliveryModal}>
            <FaMapMarkerAlt size={16} />
            <span className="truncate max-w-[120px]">Location</span>
          </div>

          <div className="hidden md:flex items-center gap-2 cursor-pointer text-sm font-medium hover:text-primary transition-colors" onClick={gotoTrackOrder}>
            Track Order
          </div>

          {((session?.user && status === "authenticated") || user?.status === "ACTIVE") ? (
            <Dropdown className="hidden md:block">
              <Dropdown.Toggle variant="transparent" className="border-0 p-0 flex items-center gap-2 hover:text-primary transition-colors">
                <FaUser size={16} />
                <span className="text-sm font-medium">
                  {user?.status === "ACTIVE" ? user?.name : session?.user?.name}
                </span>
              </Dropdown.Toggle>
              <Dropdown.Menu className="shadow-lg border-0 rounded-md mt-2">
                <Dropdown.Item href="/profile/view-user-profile">My Account</Dropdown.Item>
                <Dropdown.Item href="/dashboard">Dashboard</Dropdown.Item>
                <Dropdown.Item onClick={handleSignOut}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <button className="hidden md:flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors" onClick={() => signIn()}>
              <FaUser size={16} />
              Sign In
            </button>
          )}

          <div className="flex items-center">
            <HeaderCart />
          </div>
        </div>

        {deliveryModalOpened && <DeliveryModal />}
      </nav>
    </div>
  );
};

export default MenuNavBar;
