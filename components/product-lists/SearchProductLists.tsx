import React, { useEffect, useState } from "react";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";
import ProductCard from "./ProductCard";
import { server } from "utils/server";
import { Loader, ProductNotFound } from "@components/shared";
import useInfiniteScroll from "@hooks/useInfiniteScroll";

interface PropTypes {
  city?: string;
  isPremium?: boolean;
  category?: string;
  tag?: string;
  value: any;
}

const SearchProductLists = ({ value }: PropTypes) => {
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [noProduct, setNoProduct] = useState<boolean>(false);
  const [pageNo, setPageNo] = useState<number>(1);
  const [pageLimit, setPageLimit] = useState<number>(8);
  const [showNext, setShowNext] = useState<boolean>(true);

  async function fetchSearchProducts(
    sortBy = "",
    sortOrder = "",
    page = 1,
    limit = 8,
    refreshList = false
  ) {
    try {
      setLoading(true);
      let url = `${server}/product/adv-search`;
      let paramsObj: any = {};
      let _page = page;
      let _limit = limit;

      if (value) {
        paramsObj = {
          ...paramsObj,
          value,
        };
      }

      if (sortBy && sortOrder) {
        paramsObj = {
          ...paramsObj,
          sortBy: sortBy,
          sortOrder: sortOrder,
        };
      }

      if (!page || page < 1) {
        _page = 1;
      }

      if (!limit || limit < 1) {
        _limit = 1;
      }

      paramsObj = {
        ...paramsObj,
        page: _page,
        limit: _limit,
      };

      const params = new URLSearchParams(paramsObj).toString();
      const res = await fetch(`${url}?${params}`);
      const _products = await res.json();
      if (_products?.results?.length) {
        if (refreshList) {
          setProducts(_products.results);
        } else {
          setProducts((prd) => [...prd, ..._products.results]);
        }
        // toggle load more button
        if (_products.results.length < limit) {
          setShowNext(false);
        } else {
          setShowNext(true);
        }

        setNoProduct(false);
      } else {
        setNoProduct(true);
        setShowNext(false);
      }
    } catch (error) {
      setError("Sorry! Unable to fetch products. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSearchProducts("", "", 1, pageLimit, true);
    return () => {
      setProducts([]);
      setPageLimit(8);
    };
  }, [setProducts, value]);

  useEffect(() => {
    // update current page number to one if search term changes
    setPageNo(1);
  }, [value]);

  const sortProducts = (sort: "asc" | "desc") => {
    fetchSearchProducts("price", sort, pageNo, pageLimit, true);
  };

  const loadMore = () => {
    if (!showNext) {
      return;
    }
    const page = pageNo + 1;
    setPageNo(page);
    fetchSearchProducts("", "", page, pageLimit, false);
  };

  useInfiniteScroll(
    {
      trackElement: "#products-load-more",
      currentPage: pageNo
    },
    () => {
      loadMore();
    }
  );

  return (
    <section className="flex flex-col gap-4 justify-center px-4 mb-4 overflow-hidden product-s">
      <div className="flex justify-end items-center gap-4">
        <span>Price</span>
        <button
          className="flex gap-2 items-center"
          onClick={() => sortProducts("asc")}
        >
          <AiOutlineArrowDown />
          <span>Low to High</span>
        </button>
        <button
          className="flex gap-2 items-center"
          onClick={() => sortProducts("desc")}
        >
          <AiOutlineArrowUp />
          <span>High to Low</span>
        </button>
      </div>
      {error && <span>{error}</span>}
      {loading && <Loader />}
      <div
        className="flex flex-wrap items-center w-full"
      >
        {products.map((p: any) => (
          <div className="col-md-3 col-sm-4 col-xs-6" key={p._id}>
            <ProductCard key={p._id} product={p} />
          </div>
        ))}
        {showNext && (
          <div
            className="load-more flex w-full items-center justify-center"
            id="products-load-more"
          >
            <button
              className="btn btn-outline-danger flex items-center gap-4"
              onClick={loadMore}
              disabled={loading}
            >
              {loading && (
                <Loader showLabel={false} height="h-auto" width="w-auto" />
              )}{" "}
              Load More
            </button>
          </div>
        )}
        {noProduct && (products.length < 1) && <ProductNotFound />}
      </div>
      {!noProduct && (
        <div className="w-full flex justify-center mb-4">
          No More Result Found
        </div>
      )}
    </section>
  );
};

export default SearchProductLists;
