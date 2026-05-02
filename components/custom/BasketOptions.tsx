import React, { useState } from 'react'

function BasketOptions({ updatedBasket }: any) {
  const [selectedBasket, setSelectedBasket] = useState('')
  const [basket, _] = useState([
    {
      image:
        "https://www.probunga.com/assets/template/templateprobunga/image/bo1.png",
      title: "Flowers Bouquet",
      id: "bunch",
    },
    {
      image:
        "https://www.probunga.com/assets/template/templateprobunga/image/bo3.png",
      title: "Flowers in a Glass Vase",
      id: "vase",
    },
    {
      image:
        "https://www.probunga.com/assets/template/templateprobunga/image/bo2.png",
      title: "Flowers in a Basket",
      id: "basket",
    },
  ]);

  const onClinkBasket = (id: string) => {
    updatedBasket(id);
    setSelectedBasket(id);
  }
  return (
    <div className="row">
      {basket.map((b) => (
        <div
          className={`col-md-4 flex flex-col cursor-pointer justify-center items-center ${
            selectedBasket === b.id ? "bg-slate-300" : ""
          }`}
          onClick={() => onClinkBasket(b.id)}
          key={b.title}
        >
          <img src={b.image} alt={b.title} width={"180"} />
          <span>{b.title}</span>
        </div>
      ))}
    </div>
  );
}

export default BasketOptions
