import React, { useEffect, useState } from "react";
import Layout from "../../layouts/Main";
import BCAdvanced from "../../components/breadcrumb/BCAdvanced";
import { BreadCrumbType } from "~types/General";
import TopSection from "../../components/product-lists/TopSection";
import TopSectionLinks from "../../components/product-lists/TopSectionLinks";
import ScrollableList from "../../components/product-lists/ScrollableList";
import StaticContent from "../../components/product-lists/StaticContent";
import { server } from "@utils/server";
import { useRouter } from "next/router";

const DEFAULT_START_PAGE = 1;
const DEFAULT_PAGE_LENGTH = 8;

export async function getServerSideProps(context: any) {
  const {
    page = DEFAULT_START_PAGE,
    limit = DEFAULT_PAGE_LENGTH,
    sortBy = "",
    sortOrder = "",
    category,
    tag,
  } = context.query;

  let paramsObj: any = {
    page,
    limit,
    sortBy,
    sortOrder,
  };
  if (!page || page < 1) {
    paramsObj.page = DEFAULT_START_PAGE;
  }
  if (!limit || limit < 1) {
    paramsObj.limit = DEFAULT_PAGE_LENGTH;
  }
  if (category) {
    paramsObj = {
      ...paramsObj,
      category,
    };
  }
  if (tag) {
    paramsObj = {
      ...paramsObj,
      tag,
    };
  }
  const params = new URLSearchParams(paramsObj).toString();
  console.log(params);

  const res = await (
    await fetch(`${server}/product/filter-minimal?${params}`)
  ).json();
  const products: any[] = res?.results || [];
  const total: number = res.total || 0;
  return { props: { products, total, category } };
}

function flowersIndonesia({
  products,
  total = 0,
  category,
}: {
  products: any[];
  total?: number;
  category?: string;
}) {
  const [breadcrumb, setBreadcrumb] = useState<BreadCrumbType[]>([]);
  const [accProducts, setAccProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showLoadMore, setShowLoadMore] = useState<boolean>(false);
  const router = useRouter();

  const metaTitle =
    category === "cake"
      ? "Online Cake Delivery in Indonesia | Send Cakes to Indonesia Same-Day Jakarta, Bali"
      : "Send Flowers to Indonesia | Online Flowers Delivery";
  const metaDesc =
    category === "cake"
      ? "Enjoy same-day online cake delivery in Indonesia with FlowersChamp. Fresh, delicious cakes delivered promptly to celebrate your special moments."
      : "Send stunning flowers to Indonesia with our reliable online delivery service. We offer beautiful arrangements for every occasion, delivering to Jakarta and Bali. Order your flowers today!";
  const metaKeywords =
    category === "cake"
      ? "cake, cake delivery, fresh cake, delicious cakes"
      : "flowers, Send fresh flowers, same-day delivery, flowers bouquet, flowers indonesia";

  useEffect(() => {
    setBreadcrumb([
      { link: "/", title: "INDONESIA" },
      { link: "/list/flowers-indonesia", title: "Flowers" },
    ]);

    return () => {
      setBreadcrumb([]);
      setAccProducts([]);
    };
  }, [setBreadcrumb]);

  useEffect(() => {
    setLoading(false);
    setAccProducts([...accProducts, ...products]);
    if (accProducts.length + products.length <= total) {
      setShowLoadMore(true);
    } else {
      setShowLoadMore(false);
    }
  }, [products]);

  const onLoadMore = () => {
    console.log(router.asPath);
    console.log(router.query);
    setLoading(true);
    const { page = 1 } = router.query;
    const nextPage = +page?.toString() + 1;
    const paramsObj: any = {
      ...router.query,
      page: nextPage,
    };
    const params = new URLSearchParams(paramsObj).toString();

    router.push(`/list/flowers-indonesia?${params}`);
  };

  return (
    <Layout title={metaTitle} description={metaDesc} keywords={metaKeywords}>
      <BCAdvanced items={breadcrumb} />
      <TopSection />
      <TopSectionLinks />
      <ScrollableList
        products={accProducts}
        loadMore={onLoadMore}
        isLoading={loading}
        showLoadMoreBtn={showLoadMore}
      />
      <StaticContent />
    </Layout>
  );
}

export default flowersIndonesia;
