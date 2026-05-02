import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { CMSMenuType } from '../../store/reducers/menu';
import { getSelectedMenuID } from '@utils/productHelper';

function TopSection() {
  const { menuCMSData, menuData } = useSelector((store: RootState) => store.menu)
  const route = useRouter()
  const [menu, setMenu] = useState<CMSMenuType | null>(null);

  useEffect(() => {
    if (menuCMSData?.length && menuData.length) {
      const menuId = getSelectedMenuID(menuData, route.asPath);
      // console.log('[menu]', menuId)
      if (menuId[0] && !menuId[1]) {
        const selectedMenuData = menuCMSData.filter(
          (mc) => mc.menuType === menuId[0]
        );
        // console.log("[1. selectedMenuData >>]", selectedMenuData);
        if (selectedMenuData.length) {
          setMenu(selectedMenuData[0]);
        }
      } else if (menuId[0] && menuId[1]) {
        // console.log("get from here", menuCMSData);
        // console.log("parent >>", menuId[0]);
        // console.log("child >>", menuId[1]);
        // 652017a18f5cacc1dc666eb2
        // 64e97ca67374b9ba2a655fc2
        const selectedMenuData = menuCMSData.filter(
          (mc) => mc.menuType === menuId[0] && mc.menuName === menuId[1]
        );
        console.log("[2. selectedMenuData >>]", selectedMenuData);
        if (selectedMenuData.length) {
          setMenu(selectedMenuData[0]);
        }
      } else {
        // do nothing
      }
    }

    return () => {
      setMenu(null);
    };
  }, [route.asPath]);
  

  return (
    <div className="flex items-center justify-between px-4 gap-4 w-full pro-list-top-text">
      <div className="bold w-225 left-text">
        {menu?.seoTitle ||
          "Order Flowers Online Across INDONESIA | Delivery Within 3 Hours"}
      </div>
      <div className="seperator-box"></div>
      <div className="grow">
        <div dangerouslySetInnerHTML={{ __html: menu?.contentTop || "" }} />
        {!menu?.contentTop && (
          <span>
            A simple way to fill your loved ones special day is with the
            aromatic fragrance of fresh flowers. With a plethora of options to
            choose from, our flowers delivery in INDONESIA can be the best way
            to gift your loved ones with these timeless elements. Send flowers
            in INDONESIA from anywhere across the globe. The best florists in
            INDONESIA design your flower bouquets and make sure to meet your
            expectations. Well, what are you waiting for? Buy now!
          </span>
        )}
      </div>
    </div>
  );
}

export default TopSection
