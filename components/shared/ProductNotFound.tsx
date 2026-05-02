import { useRouter } from 'next/router';
import React from 'react'
import { BsBoxSeam } from 'react-icons/bs';

function ProductNotFound() {
  const router = useRouter();
  const gotoHomePage = () => {
    router.push("/");
  };

  return (
    <div className="flex justify-center items-center p-4 flex-col w-full min-h-400px gap-4">
      <BsBoxSeam fontSize={120} />
      <div className="flex flex-col items-center w-5/12 mt-4">
        <p className="text-2xl text-center">Sorry! No product found!</p>
        <p className="text-base text-center">
          There is no product found for your search yet. Please update your
          search text or choose a different option from menu.
        </p>
        <button className="btn btn-outline-dark w-6/12" onClick={gotoHomePage}>
          Go to Home Page
        </button>
      </div>
    </div>
  );
}

export default ProductNotFound
