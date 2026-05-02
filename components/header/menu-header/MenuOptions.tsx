import { useRouter } from "next/router";
import Link from "next/link";
import React, { useState } from 'react';
import {
  FaChevronDown,
  FaBolt,
  FaPagelines,
} from "react-icons/fa";
import { MenuDataType } from "../../../store/reducers/menu";
import { toggleMobileMenu } from "../../../store/reducers/cms";
import { useDispatch } from "react-redux";
import MenuIcon from './MenuIcon';

interface PropTypes {
  screen?: string;
  homeMenuHeaderData: MenuDataType[];
}

function MenuOptions({ screen = "desktop", homeMenuHeaderData }: PropTypes) {
  const router = useRouter();
  const dispatch = useDispatch();

  const onClick = (event: any, link: any) => {
    event.preventDefault();
    if (link) {
      if (screen === "mobile") {
        dispatch(toggleMobileMenu());
      }
      router.push(link);
    } else {
      // router.push("/coming-soon");
    }
  };

  const compiledClass = `nav-menu ${screen === "mobile" ? "mobile-view" : "desktop-view"
    }`;
  const [showSubMenu, setShowSubMenu] = useState(false)
  const toggleSubMenu = () => {
    setShowSubMenu(!showSubMenu);
  }

  return (
    <div className={`w-full ${screen === "mobile" ? "px-0" : "px-0"}`}>
      <ul className={`${screen === "mobile" ? "flex flex-col space-y-2 py-4" : "flex items-center justify-center space-x-12 py-2"}`}>
        {homeMenuHeaderData?.map((item: any) =>
          item?.categories?.length > 0 && item?.image ? (
            <li
              className="group relative"
              key={item?._id}
              onClick={() => toggleSubMenu()}
            >
              <a onClick={(event) => onClick(event, item?.link)} className="flex items-center cursor-pointer text-sm font-sans font-medium uppercase tracking-widest hover:text-primary transition-colors py-4">
                {item?.icon && <MenuIcon icon={item.icon} />}
                {item?.title}
                <FaChevronDown className="ml-2 text-[10px] opacity-70 group-hover:rotate-180 transition-transform duration-300" />
              </a>
              
              {/* Desktop Mega Menu Dropdown */}
              <div className={`${screen === "mobile" ? "hidden" : "absolute top-full left-1/2 -translate-x-1/2 w-max min-w-[600px] bg-white shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 rounded-b-md overflow-hidden"}`}>
                <div className="flex bg-white">
                  <div className="flex-1 p-8 grid grid-cols-2 gap-x-8 gap-y-4">
                    {item?.categories?.map((category: any) => (
                      <div key={category?._id} className="w-full">
                        {category?.isHeader ? (
                          <h4 className="text-charcoal font-serif font-semibold text-lg mb-2 border-b border-blush pb-1">{category?.title}</h4>
                        ) : (
                          <Link
                            href={category?.link}
                            target="_blank"
                            className="text-gray-600 hover:text-primary transition-colors text-sm py-1 block"
                            rel="noopener noreferrer"
                          >
                            {category?.title}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="w-1/3 bg-beige p-6 flex items-center justify-center border-l border-blush/50">
                    <img
                      src={item?.image}
                      className="w-full h-auto object-cover shadow-sm rounded-sm hover:scale-105 transition-transform duration-500"
                      alt={`image-${item?.seq}`}
                    />
                  </div>
                </div>
              </div>
            </li>
          ) : item?.categories?.length > 0 && !item?.image ? (
            <li
              className="group relative"
              key={item?._id}
              onClick={() => toggleSubMenu()}
            >
              <a onClick={(event) => onClick(event, item?.link)} className="flex items-center cursor-pointer text-sm font-sans font-medium uppercase tracking-widest hover:text-primary transition-colors py-4">
                {item?.icon && <MenuIcon icon={item.icon} />}
                {item?.title}
                <FaChevronDown className="ml-2 text-[10px] opacity-70 group-hover:rotate-180 transition-transform duration-300" />
              </a>
              {/* Standard Dropdown */}
              <ul className={`${screen === "mobile" ? "hidden" : "absolute top-full left-0 w-56 bg-white shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 rounded-b-md py-4 border-t-2 border-primary"}`}>
                {item?.categories?.map((category: any) => {
                  if (category?.isHeader) {
                    return (
                      <li key={category?._id} className="px-6 py-2">
                        <span className="text-charcoal font-serif font-semibold text-base">{category?.title}</span>
                      </li>
                    );
                  } else {
                    return (
                      <li key={category?._id}>
                        <Link
                          href={category?.link}
                          target="_blank"
                          className="block px-6 py-2 text-sm text-gray-600 hover:text-primary hover:bg-blush/30 transition-colors"
                          rel="noopener noreferrer"
                        >
                          {category?.title}
                        </Link>
                      </li>
                    );
                  }
                })}
              </ul>
            </li>
          ) : (
            <li
              className="group relative"
              key={item?._id}
              onClick={() => toggleSubMenu()}
            >
              <a
                onClick={($e) => onClick($e, item?.link)}
                className="flex items-center cursor-pointer text-sm font-sans font-medium uppercase tracking-widest hover:text-primary transition-colors py-4"
              >
                {item?.icon && <MenuIcon icon={item.icon} />}
                <span className="ml-1">{item?.title}</span>
              </a>
            </li>
          )
        )}
      </ul>
    </div>
  );
}

export default MenuOptions;
