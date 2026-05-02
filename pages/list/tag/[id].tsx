import React, { useEffect, useState } from "react";
import Layout from "../../../layouts/Main";
import BCAdvanced from "../../../components/breadcrumb/BCAdvanced";
import { BreadCrumbType } from "~types/General";
import TopSection from "@components/product-lists/TopSection";
import TopSectionLinks from "@components/product-lists/TopSectionLinks";
import StaticContent from "@components/product-lists/StaticContent";
import { HomeReviews } from "@components/home";
import ProductLists from "@components/product-lists";
import { useRouter } from "next/router";
import { getMetaForProductTag } from "../../../utils/getTagMeta";

function ProductWithTag() {
  const [breadcrumb, setBreadcrumb] = useState<BreadCrumbType[]>([]);
  const router = useRouter();
  const { id } = router.query;

  const { title, description, keywords } = getMetaForProductTag(id as string);

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
    <Layout title={title} description={description} keywords={keywords}>
      <BCAdvanced items={breadcrumb} />
      <TopSection />
      <TopSectionLinks />
      {id && <ProductLists tag={id as string} />}
      <StaticContent />
      <HomeReviews />
    </Layout>
  );
}

export default ProductWithTag;
