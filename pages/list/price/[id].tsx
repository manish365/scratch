import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { BreadCrumbType } from '~types/General';
import Layout from "../../../layouts/Main";
import BCAdvanced from '@components/breadcrumb/BCAdvanced';
import TopSection from '@components/product-lists/TopSection';
import TopSectionLinks from '@components/product-lists/TopSectionLinks';
import StaticContent from '@components/product-lists/StaticContent';
import { HomeReviews } from '@components/home';
import ProductLists from '@components/product-lists';

function ProductWithPrice() {
  const [breadcrumb, setBreadcrumb] = useState<BreadCrumbType[]>([]);
  const router = useRouter();
  const { id } = router.query;
  const [belowPrice, setBelowPrice] = useState(0);
  const [abovePrice, setAbovePrice] = useState(0);

  const processPriceUrl = (fragment: string): [string, number] => {
    if (fragment?.trim()) {
      if (fragment.startsWith("above") || fragment.startsWith("below")) {
        return [fragment.split("-")[0], +fragment.split("-")[1]];
      }
    }
    return ['', 0]
  }

  useEffect(() => {
    setBreadcrumb([
      { link: "/", title: "INDONESIA" },
      { link: `/list/price/${id as string}`, title: (id as string) || "" },
    ]);

    if (id) {
      console.log('term:', id)
      const parts = (id as string).split("-and-");

      // set the price
      const [direction, price] = processPriceUrl(parts[0]);
      if (direction === "below") {
        setBelowPrice(price);
      } else {
        setAbovePrice(price);
      }

      if (parts.length > 1) {
        // price range detected
        const [direction, price] = processPriceUrl(parts[1]);
        if (direction === "below") {
          setBelowPrice(price);
        } else {
          setAbovePrice(price);
        }
      }
    }

    return () => {
      setBreadcrumb([]);
    };
  }, [setBreadcrumb, router.asPath]);

  return (
    <Layout>
      <BCAdvanced items={breadcrumb} />
      <TopSection />
      <TopSectionLinks />
      <div>
        show data here from - {abovePrice}, to - {belowPrice}
      </div>
      {(abovePrice > 0 || belowPrice > 0) && (
        <ProductLists fromPrice={abovePrice} toPrice={belowPrice} />
      )}
      <StaticContent />
      <HomeReviews />
    </Layout>
  );
}

export default ProductWithPrice
