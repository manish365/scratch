import React from "react";

function MidNightDeliveryBanner() {
  return (
    <section className="midd-night mt-45 w-full mb-4">
      <div className="container-fluid">
        <a href="/coming-soon" className="bx-shadow position-relative">
          <img
            height="62"
            className="desktop-view img-fluid w-100"
            src="images/Midnight Delevery copy.jpg"
            title="Roses Delivery"
            alt="Roses Delivery"
            loading="lazy"
          />
          <img
            height="50"
            className="mobile-view img-fluid w-100"
            src="images/Midnight Delevery copy.jpg"
            title="Roses Delivery"
            alt="Roses Delivery"
            loading="lazy"
          />
         
        </a>
      </div>
    </section>
  );
}

export default MidNightDeliveryBanner;
