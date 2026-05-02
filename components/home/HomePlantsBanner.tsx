import React from 'react';

function HomePlantsBanner() {
  return (
    <section className="midd-night plants-make mt-4 mb-4">
      <div className="container-fluid">
        <a href="#" className="bx-shadow position-relative">
          <img
            height="62"
            className="desktop-view img-fluid w-100"
            src="images/plants-sm.webp"
            title="Roses Delivery"
            alt="Roses Delivery"
            loading="lazy"
          />
          <img
            height="50"
            className="mobile-view img-fluid w-100"
            src="images/plants-sm.webp"
            title="Roses Delivery"
            alt="Roses Delivery"
            loading="lazy"
          />
          
        </a>
      </div>
    </section>
  );
}

export default HomePlantsBanner
