import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../layouts/Main";
import BCAdvanced from "../../components/breadcrumb/BCAdvanced";
import { BreadCrumbType } from "~types/General";
import SearchProductLists from "@components/product-lists/SearchProductLists";

const SearchList = () => {
  const router = useRouter();
  const { term } = router.query;
  const [breadcrumb, setBreadcrumb] = useState<BreadCrumbType[]>([]);

  useEffect(() => {
    if (term) {
      setBreadcrumb([
        { link: "/", title: "INDONESIA" },
        { link: "", title: `${term}` },
      ]);
    }

    return () => {
      setBreadcrumb([]);
    };
  }, [setBreadcrumb, router.query]);

  return (
    <Layout title="Search | FlowersChamp" hideScroll={false}>
      <BCAdvanced items={breadcrumb} />
      <SearchProductLists value={term} />
    </Layout>
  );
};

export default SearchList;
