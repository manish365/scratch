import React from 'react'
import SidebarMenu from "react-bootstrap-sidebar-menu";
import { FaUser, FaLock, FaHome, FaPencilAlt, FaHistory, FaBook } from "react-icons/fa";

function DashboardSidebar() {
  return (
    <>
      <SidebarMenu className='w-auto'>
        <SidebarMenu.Body>
          <SidebarMenu.Nav>
            <SidebarMenu.Nav.Link href='/dashboard' className='active'>
              <SidebarMenu.Nav.Icon>
                <FaHome />
              </SidebarMenu.Nav.Icon>
              <SidebarMenu.Nav.Title>
                <span>Dashboard</span>
              </SidebarMenu.Nav.Title>
            </SidebarMenu.Nav.Link>
            <SidebarMenu.Nav.Link href='/profile/view-user-profile'>
              <SidebarMenu.Nav.Icon>
                <FaUser />
              </SidebarMenu.Nav.Icon>
              <SidebarMenu.Nav.Title>
                <span>My Account</span>
              </SidebarMenu.Nav.Title>
            </SidebarMenu.Nav.Link>
            <SidebarMenu.Nav.Link>
              <SidebarMenu.Nav.Icon>
                <FaPencilAlt />
              </SidebarMenu.Nav.Icon>
              <SidebarMenu.Nav.Title>
                <span>Calendar</span>
              </SidebarMenu.Nav.Title>
            </SidebarMenu.Nav.Link>
            <SidebarMenu.Nav.Link href='/profile/order-history'>
              <SidebarMenu.Nav.Icon>
                <FaHistory />
              </SidebarMenu.Nav.Icon>
              <SidebarMenu.Nav.Title>
                <span>Order History</span>
              </SidebarMenu.Nav.Title>
            </SidebarMenu.Nav.Link>
            <SidebarMenu.Nav.Link href='/auth/change-password'>
              <SidebarMenu.Nav.Icon>
                <FaLock />
              </SidebarMenu.Nav.Icon>
              <SidebarMenu.Nav.Title>
                <span>Change Password</span>
              </SidebarMenu.Nav.Title>
            </SidebarMenu.Nav.Link>
            <SidebarMenu.Nav.Link href='/profile/address-book'>
              <SidebarMenu.Nav.Icon>
                <FaBook />
              </SidebarMenu.Nav.Icon>
              <SidebarMenu.Nav.Title>
                <span>Address Book</span>
              </SidebarMenu.Nav.Title>
            </SidebarMenu.Nav.Link>
            <SidebarMenu.Nav.Link href='/'>
              <SidebarMenu.Nav.Icon>
                <FaHome />
              </SidebarMenu.Nav.Icon>
              <SidebarMenu.Nav.Title>
                <span>New Order</span>
              </SidebarMenu.Nav.Title>
            </SidebarMenu.Nav.Link>
          </SidebarMenu.Nav>
        </SidebarMenu.Body>
      </SidebarMenu>
    </>
  );
}

export default DashboardSidebar
