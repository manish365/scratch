import React, { useEffect, useState } from 'react'
import Layout from "../../layouts/Main";
import BCAdvanced from "../../components/breadcrumb/BCAdvanced";
import { BreadCrumbType } from '~types/General';
import TopSection from '@components/product-lists/TopSection';
import TopSectionLinks from '@components/product-lists/TopSectionLinks';
import StaticContent from '@components/product-lists/StaticContent';
import { HomeReviews } from '@components/home';
import ProductLists from '@components/product-lists';
import { useSelector } from 'react-redux';
import { RootState } from 'store';

function PremiumFlowers() {
  const [breadcrumb, setBreadcrumb] = useState<BreadCrumbType[]>([]);
  const { menuCMSData } = useSelector(
    (store: RootState) => store.menu
  );

  useEffect(() => {
    setBreadcrumb([
      { link: "/", title: "INDONESIA" },
      { link: "/list/flowers-indonesia", title: "Flowers" },
    ]);

    return () => {
      setBreadcrumb([]);
    };
  }, [setBreadcrumb]);

  return (
    <Layout
      title="Send Premium Flowers Delivery to Indonesia"
      description="Experience the joy of sending premium flowers with our top-notch delivery same day service in Indonesia, Jakarta and Bali. Fresh, vibrant blooms for every occasion. Order now!"
      keywords="premium flowers, Send fresh flowers, same-day delivery, flowers bouquet, flowers indonesia"
    >
      <BCAdvanced items={breadcrumb} />
      {menuCMSData.length && <TopSection />}
      <TopSectionLinks />
      <ProductLists isPremium />
      <StaticContent />
      <HomeReviews />
    </Layout>
  );
}

export default PremiumFlowers;
