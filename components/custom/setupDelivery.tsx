import React, { useEffect, useState } from "react";
import { server } from "../../utils/server";

function SetupDelivery({ updateDeliveryOption }: any) {
  const [cities, setCities] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("Indonesia");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");

  useEffect(() => {
    async function fetchCityList() {
      try {
        const res = await fetch(`${server}/area`);
        const area = await res.json();
        if (area?.success) {
          setError("");
          setCities(area.results);
        }
      } catch (error) {
        setError("Sorry! City list not found. Try again later.");
      }
    }
    fetchCityList();
  }, [setCities]);

  useEffect(() => {
    if (!error) {
      updateDeliveryOption(
        selectedCountry,
        selectedCity,
        deliveryDate,
        deliveryTime
      );
    }
  }, [selectedCountry, selectedCity, deliveryDate, deliveryTime]);

  return (
    <div className="row">
      <div className="col-md-6 col-xs-12">
        <div>
          <label htmlFor="country">Delivery Country:</label>
          <select
            className="w-full border px-2 py-1"
            onChange={($e) => setSelectedCountry($e.target.value)}
            id="country"
            value={"Indonesia"}
          >
            <option value={""}>Select Country</option>
            <option value={"Indonesia"}>Indonesia</option>
          </select>
        </div>
        <div key={"city"}>
          <label htmlFor="city">Delivery City:</label>
          <select
            className="w-full border px-2 py-1"
            onChange={($e) => setSelectedCity($e.target.value)}
            id="city"
            key={"city"}
          >
            <option value="">Select City</option>
            {cities.map((c) => (
              <option key={c._id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="col-md-6 col-xs-12">
        <div className="flex flex-col justify-center">
          <label htmlFor="delivery-date">Delivery Date:</label>
          <input
            type="date"
            className="appear-auto border px-2 py-1"
            onChange={($e) => setDeliveryDate($e.target.value)}
            id="delivery-date"
            key={"delivery-date"}
          />
        </div>
        <div>
          <label htmlFor="delivery-time">Delivery Time:</label>
          <select
            className="w-full border px-2 py-1"
            onChange={($e) => setDeliveryTime($e.target.value)}
            id="delivery-time"
            key={"delivery-time"}
          >
            <option value="">Choose Time</option>
            <option value="9:00 Hrs - 13:00 Hrs">9:00 Hrs - 13:00 Hrs</option>
            <option value="13:00 Hrs - 18:00 Hrs">13:00 Hrs - 18:00 Hrs</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default SetupDelivery;
