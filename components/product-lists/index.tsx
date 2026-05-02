import React, { useEffect, useState } from "react";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";
import ProductCard from "./ProductCard";
import { server } from "utils/server";
import { Loader, ProductNotFound } from "@components/shared";

interface PropTypes {
  city?: string;
  isPremium?: boolean;
  isOffer?: boolean;
  category?: string;
  tag?: string;
  fromPrice?: number;
  toPrice?: number;
}

const ProductLists = ({
  city,
  isPremium = false,
  isOffer = false,
  category,
  tag,
  fromPrice = 0,
  toPrice = 0,
}: PropTypes) => {
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [noProduct, setNoProduct] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hideLoadMoreBtn, setHideLoadMoreBtn] = useState<boolean>(false);

  async function fetchProducts(sortBy = "", sortOrder = "", page = 1) {
    try {
      setLoading(true);
      let url = `${server}/product`;
      let paramsObj: any = {
        page,
      };

      if (city) {
        paramsObj = {
          ...paramsObj,
          city,
        };
      }

      if (isPremium) {
        paramsObj = {
          ...paramsObj,
          premium: true,
        };
      }

      if (isOffer) {
        paramsObj = {
          ...paramsObj,
          offer: true,
        };
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

      if (fromPrice && fromPrice > 0) {
        paramsObj = {
          ...paramsObj,
          fromPrice,
        };
      }

      if (toPrice && toPrice > 0) {
        paramsObj = {
          ...paramsObj,
          toPrice,
        };
      }

      if (sortBy && sortOrder) {
        paramsObj = {
          ...paramsObj,
          sortBy: sortBy,
          sortOrder: sortOrder,
        };
      }

      const params = new URLSearchParams(paramsObj).toString();
      const res = await fetch(`${url}?${params}`);
      const _products: any = await res.json();
      if (_products?.results?.length) {
        setProducts([...products, ..._products.results]);
      } else {
        if (products.length) {
          setError("");
          setNoProduct(true);
        } else {
          setHideLoadMoreBtn(true);
        }
      }
    } catch (error: any) {
      console.log("[error]", error);
      if (error?.message === "No product found") {
        setNoProduct(true);
      } else {
        setError("Sorry! Unable to fetch products. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
    return () => {
      setProducts([]);
      setNoProduct(false);
      setPage(1);
      setHideLoadMoreBtn(false);
    };
  }, [setProducts]);

  const sortProducts = (sort: "asc" | "desc") => {
    fetchProducts("price", sort);
  };

  const loadMore = () => {
    setPage(page + 1);
    fetchProducts("", "", page + 1);
  };

  return (
    <section className="flex flex-col gap-4 justify-center px-4 mb-4">
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
      <div className="flex flex-wrap items-center w-full">
        {products.map((p: any) => (
          <div className="col-md-3 col-sm-4 col-xs-6" key={p._id}>
            <ProductCard key={p._id} product={p} />
          </div>
        ))}
        {noProduct && products.length < 1 && <ProductNotFound />}
      </div>
      {!noProduct && (
        <div className="w-full flex flex-col justify-center items-center mb-4 gap-4">
          {!hideLoadMoreBtn && (
            <button
              className="btn btn-outline-danger flex items-center gap-4"
              onClick={loadMore}
              disabled={loading}
            >
              {loading && (
                <Loader showLabel={false} height="h-auto" width="w-auto" />
              )}{" "}
              Load more products
            </button>
          )}
          No More Result Found
        </div>
      )}
    </section>
  );
};

export default ProductLists;
