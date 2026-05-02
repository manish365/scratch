import React, { useEffect, useState } from 'react'
import { MdCheckBoxOutlineBlank, MdCheckBox } from 'react-icons/md'
import useDefaultCurrency from '@hooks/useDefaultCurrency'
import useVaseAmount from '@hooks/useVaseAmount'
import useEggLessAmount from "@hooks/useEggLessAmount";

interface PropTypes {
  categories: string[];
  onUpdate: any;
  _product: any
}

function UpgradeOption({ categories = [], onUpdate, _product }: PropTypes) {
  const [addVase, setAddVase] = useState<boolean>(false);
  const [eggLess, setEggLess] = useState<boolean>(false);
  const [currency] = useDefaultCurrency();
  const [vaseAmount, vaseAmountUSD] = useVaseAmount();
  const [egglessAmount, egglessAmountUSD] = useEggLessAmount();

  const [showAddVase, setShowAddVase] = useState(false);
  const [showEggLess, setShowEggLess] = useState(false);

  const [showAddVaseFromProduct, setShowAddVaseFromProduct] = useState(false);
  const [showEggLessFromProduct, setShowEggLessFromProduct] = useState(false);


  useEffect(() => {
    if (_product?.addVase) {
      setShowAddVaseFromProduct(true);
    }
    if (_product?.addEggLessCake) {
      setShowEggLessFromProduct(true);
    }

    if (categories.includes("Roses") || categories.includes("Flowers")) {
      setShowAddVase(true);
    } else if (categories.includes("Cake")) {
      setShowEggLess(true);
    }

    return () => {
      setShowAddVase(false);
      setShowEggLess(false);
    };
  }, [setShowAddVase, setShowEggLess, categories, setShowAddVaseFromProduct, setShowEggLessFromProduct]);

  useEffect(() => {
    onUpdate(addVase, eggLess);
  }, [addVase, eggLess]);


  return (
    <div className="flex w-full flex-col gap-4 mb-4">
      {(showAddVase) &&
        (!showAddVaseFromProduct) && (
          <span>Upgrade Option</span>
        )
      }
      {
        (showEggLess) &&
        (!showEggLessFromProduct) && (
          <span>Upgrade Option</span>
        )
      }

      {(showAddVase) && (
        (!showAddVaseFromProduct) && (
          <div className="flex items-center w-full gap-4">
            <span className="flex gap-2 items-center">
              {addVase ? (
                <MdCheckBox
                  onClick={() => setAddVase(!addVase)}
                  style={{ width: "20px", height: "20px" }}
                />
              ) : (
                <MdCheckBoxOutlineBlank
                  onClick={() => setAddVase(!addVase)}
                  style={{ width: "20px", height: "20px" }}
                />
              )}
              <span
                className="cursor-pointer"
                onClick={() => setAddVase(!addVase)}
              >
                Add Glass Vase:
              </span>
            </span>{" "}
            {currency} {vaseAmount} / $ {vaseAmountUSD}
          </div>
        )
      )
      }
      {(showEggLess) && (
        (!showEggLessFromProduct) && (
          <div className="flex items-center w-full gap-4">
            <span className="flex gap-2 items-center">
              {eggLess ? (
                <MdCheckBox
                  onClick={() => setEggLess(false)}
                  style={{ width: "20px", height: "20px" }}
                />
              ) : (
                <MdCheckBoxOutlineBlank
                  onClick={() => setEggLess(true)}
                  style={{ width: "20px", height: "20px" }}
                />
              )}
              <span
                className="cursor-pointer"
                onClick={() => setEggLess(!eggLess)}
              >
                Add Eggless Option:
              </span>
            </span>{" "}
            {currency} {egglessAmount} / $ {egglessAmountUSD}
          </div>
        )
      )}
    </div>
  );
}

export default UpgradeOption
