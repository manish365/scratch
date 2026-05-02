import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { BiCartAdd, BiCartAlt } from "react-icons/bi";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { toggleAddonModal } from 'store/reducers/cart';

interface PropTypes {
  addProductToCart: any;
  disabled?: boolean;
}

function AddToCartButton({
  disabled = false,
}: PropTypes) {
  const [addedToCart] = useState(false)
  const { cartItems } = useSelector((store: RootState) => store.cart);
  const router = useRouter();
  const { id } = router.query;
  const [productInCart, setProductInCart] = useState<boolean>(false);
  const dispatch = useDispatch()

  useEffect(() => {
    const exists = cartItems.filter((ci) => ci.id === id);
    if (exists.length) {
      setProductInCart(true);
    } else {
      setProductInCart(false);
    }
  }, []);

  const gotoCart = () => {
    router.push("/cart/summary");
  }

  const showAddGiftModal = () => {
    dispatch(toggleAddonModal());
  }

  return (
    <div className="row m-0 mt-4">
      <div className="col-xs-12">
        {!productInCart && !addedToCart && (
          <button
            className="btn flex items-center gap-2 bg-gold text-white hover-shadow"
            onClick={showAddGiftModal}
            disabled={disabled}
            type="button"
          >
            <BiCartAdd />
            Add to Cart
          </button>
        )}
        {(productInCart || addedToCart) && (
          <button
            className="btn flex items-center gap-2 bg-gold text-white hover-shadow"
            type="button"
            onClick={gotoCart}
          >
            <BiCartAlt />
            Go to Cart
          </button>
        )}
      </div>
    </div>
  );
}

export default AddToCartButton
