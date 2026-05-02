import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toggleDeliveryModal } from "../../store/reducers/cms";
import { MdPlace } from "react-icons/md";
import { server } from "utils/server";
import Link from "next/link";
import { Loader } from "@components/shared";

function DeliveryModal() {
  const dispatch = useDispatch();
  const onToggleDeliveryModal = (e: any) => {
    e.stopPropagation()
    dispatch(toggleDeliveryModal());
  };
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    async function fetchCityList() {
      setLoading(true);
      try {
        const res = await fetch(`${server}/area`);
        const area = await res.json();
        if (area?.success) {
          setCities(area.results);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchCityList();
  }, [setCities, setLoading]);

  return (
    <div
      className="modal fade show"
      style={{ display: "block" }}
      id="Location"
      tabIndex={-1}
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      onClick={onToggleDeliveryModal}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content bg-transparent border-0">
          <div className="modal-body p-0">
            <div className="city-pop-section">
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={($e) => onToggleDeliveryModal($e)}
              >
                <span aria-hidden="true">&times;</span>
              </button>
              <h3>
                <MdPlace />
                Choose Your Favorite Gifting Destination
              </h3>
              <div className="city-pop-inner">
                <div className="uae-section">
                  {loading && (
                    <Loader showLabel={false} />
                  )}
                  <ul>
                    {cities.map((c) => (
                      <li key={c._id}>
                        <Link href={`/city/${c.name}`}>{c.name}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeliveryModal;
