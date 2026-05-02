import React from 'react'
import { CustomProductColType } from '~types/General';

interface PropTypes {
  title: string;
  cols?: CustomProductColType[];
  update: any;
}

function RoseBox({ title, cols = [], update }: PropTypes) {
  return (
    <div className="flex flex-col w-full border overflow-hidden px-4 py-2 gap-4">
      <h4>{title}</h4>
      <div className="row">
        {cols.map((col, index) => (
          <div className="col-lg-2" key={index}>
            <div className="flex flex-col gap-2 justify-center w-full items-center">
              <img
                src={col.img}
                alt={col.imgAlt}
                height={86}
                width={86}
                className="rounded-full"
              />
              <span>{title}</span>
              <input
                type="number"
                className="border w-full text-center"
                value={col.number}
                onChange={($event) => update(title, index, $event.target.value)}
                min={0}
                max={100}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RoseBox
