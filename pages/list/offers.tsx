import React, { useEffect, useState } from 'react'
import Layout from "../../layouts/Main";
import BCAdvanced from '@components/breadcrumb/BCAdvanced';
import { BreadCrumbType } from '~types/General';
import TopSection from '@components/product-lists/TopSection';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import TopSectionLinks from '@components/product-lists/TopSectionLinks';
import StaticContent from '@components/product-lists/StaticContent';
import { HomeReviews } from '@components/home';
import ProductLists from '@components/product-lists';

function Offers() {
  const [breadcrumb, setBreadcrumb] = useState<BreadCrumbType[]>([]);
  const { menuCMSData } = useSelector((store: RootState) => store.menu);

  useEffect(() => {
    setBreadcrumb([
      { link: "/", title: "INDONESIA" },
      { link: "/list/offers", title: "Offers" },
    ]);

    return () => {
      setBreadcrumb([]);
    };
  }, [setBreadcrumb]);

  return (
    <Layout
      title="Offers on Flowers, Roses, Cakes and Gifts Items & More"
      description="Discover special offers on flowers, roses, cakes, and gifts. Send to Indonesia, including Jakarta and Bali, with a range of delightful options for any occasion."
      keywords="special offers, flowers, roses, cakes, teddy, gifts"
    >
      <BCAdvanced items={breadcrumb} />
      {menuCMSData.length && <TopSection />}
      <TopSectionLinks />
      <ProductLists isOffer />
      <StaticContent />
      <HomeReviews />
    </Layout>
  );
}

export default Offers
