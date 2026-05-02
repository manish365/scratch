import React from "react";
import ProductCard from "./ProductCard";
import { Loader, ProductNotFound } from "@components/shared";
import useInfiniteScroll from "@hooks/useInfiniteScroll";
import { useRouter } from "next/router";
interface PropType {
  products: any[];
  loadMore: any;
  isLoading?: boolean;
  showLoadMoreBtn?: boolean;
}

function ScrollableList({
  products,
  loadMore,
  isLoading = false,
  showLoadMoreBtn = true,
}: PropType) {
  const router = useRouter();
  const { page = 1 } = router.query;

  useInfiniteScroll(
    {
      trackElement: "#products-load-more",
      currentPage: page as number,
    },
    () => {
      loadMore();
    }
  );

  return (
    <div className="flex flex-wrap items-center w-full">
      {products.map((p: any) => (
        <div className="col-md-3 col-sm-4 col-xs-6" key={p._id}>
          <ProductCard key={p._id} product={p} />
        </div>
      ))}

      {showLoadMoreBtn && (
        <div
          className="load-more flex w-full items-center justify-center"
          id="products-load-more"
        >
          <button
            className="btn btn-outline-danger flex items-center gap-4"
            onClick={loadMore}
            disabled={isLoading}
          >
            {isLoading && (
              <Loader showLabel={false} height="h-auto" width="w-auto" />
            )}{" "}
            Load more products
          </button>
        </div>
      )}

      {products.length < 1 && <ProductNotFound />}
    </div>
  );
}

export default ScrollableList;
