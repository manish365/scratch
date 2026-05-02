import React, { memo } from "react";

function DeliverInfoTop() {
  return (
    <div className="row">
      <div className="col-md-4 text-center">
        <img
          src="https://www.probunga.com/assets/template/templateprobunga/image/fresh-flowers.png"
          alt="Fresh Flowers Feature Image"
          height={40}
          width={30}
          className="mb-4"
        />{" "}
        <br />
        Fresh Flowers Delivery. We deliver fresh flowers all over the Indonesia.
      </div>
      <div className="col-md-4 text-center">
        <img
          src="https://www.probunga.com/assets/template/templateprobunga/image/smile.png"
          alt="Smile Feature Image"
          height={40}
          width={42}
          className="mb-4"
        />{" "}
        <br />
        100% Satisfaction guaranteed. commited to making you and your loved ones
        happy.
      </div>
      <div className="col-md-4 text-center">
        <img
          src="https://www.probunga.com/assets/template/templateprobunga/image/same.png"
          alt="Same Day Delivery Feature Image"
          height={40}
          width={82}
          className="mb-4"
        />{" "}
        <br />
        Hassle free delivery. Sending same-day flowers to celebrate a special
        occasion.
      </div>
    </div>
  );
}

export default memo(DeliverInfoTop);
