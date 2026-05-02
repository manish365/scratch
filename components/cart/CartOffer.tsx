import React from 'react'

function CartOffer() {
  const onCartOfferClick = () => { }

  return (
    <div className="flex w-full mt-4 items-center justify-center shadow" onClick={onCartOfferClick}>
      <img
        src="https://www.uaeflowers.com/assets/template/templateuae/image/free-shipping.jpg"
        style={{height: '219px', width: '376px'}}
        alt="Cart Offer"
      />
    </div>
  );
}

export default CartOffer
