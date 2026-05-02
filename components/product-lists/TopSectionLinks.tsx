import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { ProductListTopSectionLinksType } from '~types/General';
import { getSelectedMenuID } from "@utils/productHelper";

function TopSectionLinks() {
  const { menuCMSData, menuData } = useSelector(
    (store: RootState) => store.menu
  );
  const route = useRouter();
  const [buttons, seTButtons] = useState<ProductListTopSectionLinksType[]>([]);

  useEffect(() => {
    if (menuCMSData?.length && menuData.length) {
      const menuId = getSelectedMenuID(menuData, route.asPath);
      let selectedMenuData: any[] = [];
      if (menuId) {
        // console.log("[TOP SECTION] found menu - ", menuId);
        // console.log("[TOP SECTION] menuCMSData >>", menuCMSData);
        if (menuId[1]) {
          selectedMenuData = menuCMSData.filter(
            (mc) => mc.menuName === menuId[1]
          );
        } else {
          selectedMenuData = menuCMSData.filter(
            (mc) => mc.menuType === menuId[0]
          );
        }

        // console.log("[selectedMenuData]", selectedMenuData);
        if (selectedMenuData.length) {
          seTButtons(selectedMenuData[0].box);
        }
      }
    }

    return () => {
      seTButtons([]);
    };
  }, [seTButtons, route.asPath]);
  
  return (
    <div className="flex item-center justify-between gap-4 mb-4 p-4 item-list-btn">
      {buttons?.map((item) => (
        <Link 
          href={item.link} 
          key={item._id}
          className={`btn btn-primary w-full text-white flex items-center justify-center ${
            item.link === route.asPath ? "bg-gold border-gold pointer-events-none opacity-50" : ""
          }`}
          aria-disabled={item.link === route.asPath}
        >
          {item.title}
        </Link>
      ))}
    </div>
  );
}

export default TopSectionLinks
