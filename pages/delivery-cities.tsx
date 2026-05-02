import React, { ChangeEvent, useEffect, useState } from "react";
import Layout from "../layouts/Main";
import Breadcrumb from "@components/breadcrumb";
import { SearchBox } from "@components/shared";
import { server } from "utils/server";
import Link from "next/link";

function DeliveryCities() {
  const [cities, setCities] = useState<any[]>([]);
  const [filteredCities, setFilteredCities] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const metaDesc =
    "FlowersChamp offers delivery services across major cities in Indonesia, including Jakarta, Surabaya, Bandung, Medan, Bali, Yogyakarta and others.";
  const metaKeywords =
    "delivers cities, flowers champ, flowers indonesia, Jakarta, Bali";

  useEffect(() => {
    async function fetchCityList() {
      try {
        const res = await fetch(`${server}/area`);
        const area = await res.json();
        if (area?.success) {
          setError("");
          setCities(area.results);
          setFilteredCities(area.results);
        }
      } catch (error) {
        setError("Sorry! City list not found. Try again later.");
      }
    }
    fetchCityList();
  }, [setCities]);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearch(value);
    if (value.length) {
      onSearchBtnClick(value);
    } else {
      setFilteredCities(cities);
    }
  };

  const onSearchBtnClick = (_value: string = '') => {
    let _search = _value ? _value?.trim().toLowerCase() : search?.toLowerCase();
    if (_search.length) {
      setFilteredCities(
        cities.filter((c) =>
          c.name.toLowerCase().includes(_search)
        )
      );
    } else {
      setFilteredCities(cities);
    }
  };

  return (
    <Layout
      title="FlowersChamp Delivers to Cities Across Indonesia, Including Jakarta and Bali And Others"
      description={metaDesc}
      keywords={metaKeywords}
    >
      <Breadcrumb mainPath={"Home"} pName={"Indonesia Delivery Cities"} />
      <div className="container">
        <div className="row mt-4">
          <div className="col-xs-12">
            <h2 className="text-red-950">Indonesia Delivery Cities</h2>
          </div>
        </div>
        <div className="row mt-4">
          <SearchBox
            inputChange={onInputChange}
            placeholder={"Enter City"}
            searchBtnClick={onSearchBtnClick}
          />
        </div>
        {error && <div className="text-error mt-4">{error}</div>}
        <div className="row border-bottom mt-4"></div>
        <div className="row gap-4 mt-4">
          {filteredCities.map((c) => (
            <div className="flex col-lg-2 col-md-3 col-xs-6 gap-4" key={c._id}>
              <Link href={`/city/${c.name}`}>{c.name}</Link>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default DeliveryCities;
