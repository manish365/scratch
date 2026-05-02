import React, { useEffect, useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";

interface PropTypes {
  id?: string;
  classList?: string[];
  onChange: any;
  value?: string;
  list: any[];
  placeholder?: string;
  disabled: boolean;
  className?: any;
  styles?: any;
  countryFlag: boolean;
}

function SelectSearch({
  onChange,
  value = "",
  list,
  placeholder = "Select Country",
  disabled,
  countryFlag
}: PropTypes) {
  const [filteredList, setFilteredList] = useState<any[]>([]);
  const [showOptions, setShowOptions] = useState(false);
  const [defaultValue, setDefaultValue] = useState("");
  const [seachKey, setSearchKey] = useState("");
  const [selectedCountryFlagCode, setSelectedCountryFlagCode] = useState("");

  useEffect(() => {
    setFilteredList(list);
    setDefaultValue(value);
    
    const selectedCountry = list.find((c) => value === c?.dial_code || value === c?._id);
    setSelectedCountryFlagCode(selectedCountry ? selectedCountry.code : null);
    return () => {
      setDefaultValue("");
      setFilteredList([]);
      setSelectedCountryFlagCode("");
    };
  }, [value, list, setDefaultValue, setFilteredList, setSelectedCountryFlagCode]);

  const filterData = (filterText: string) => {
    setSearchKey(filterText);
    if (filterText) {
      const _data = list.filter((d) =>
        d.name?.toLowerCase().includes(filterText?.toLowerCase())
      );
      setFilteredList(_data);
    } else {
      setFilteredList(list);
    }
  };

  const getNameFromId = (id: string) => {
    if (id) {
      const _data = list.filter(
        (row) => row._id === id || row.dial_code === id
      );

      if (_data.length) {
        return _data[0].dial_code
          ? _data[0].dial_code + " " + _data[0].name
          : _data[0].name;
      }
    }
    return "";
  };

  const onSelectOption = (id: string) => {
    // console.log("country id ", id);
    onChange(id);
    setDefaultValue(id);
    setSearchKey("");
    setShowOptions(false);
    setFilteredList(list);
    getSelectedCountryFlag(id);
  };

  const checkForEscapeChar = (event: any) => {
    // checking for escape key
    if (event?.keyCode === 27) {
      setShowOptions(false);
    }
  };

  const getSelectedCountryFlag = (id: string) => {
    console.log('getSelectedCountryFlag id===>>>', id);
    const selectedCountry = filteredList.find((c) => (id === c?.dial_code || id === c?._id));
    // console.log('selectedCountry===>>>>', selectedCountry);
    setSelectedCountryFlagCode((selectedCountry) ? selectedCountry?.code : null);
  };
  // console.log('selectedCountryFlagCode---', selectedCountryFlagCode);
  
  return (
    <div className="border select-search--container">
      <div className="iti__flag-container">
        <div className="iti__selected-flag">
          <div className={`${countryFlag ? `d-flex iti__flag iti__${selectedCountryFlagCode?.toLowerCase()}` : 'd-flex'}`}></div>
          <input
            type="text"
            className="form-control w-full h-full select-search--input"
            placeholder={placeholder}
            // value={defaultValue ? getNameFromId(defaultValue) : ""}
            onClick={() => setShowOptions(!disabled)}
            readOnly={disabled}
            defaultValue={defaultValue ? getNameFromId(defaultValue) : ""}
          />
          <span className="caret">
            <RiArrowDropDownLine height={25} width={25} />
          </span>
        </div>
        {showOptions && (
          <div className="select-search--options">
            <input
              type="text"
              className="select-search form-control"
              onChange={($e) => filterData($e.target.value)}
              onKeyDown={($e) => checkForEscapeChar($e)}
              value={seachKey}
              autoFocus
            />
            <ul className="w-full iti__country-list" id="iti-1__country-listbox" role="listbox">
              {filteredList.map((c) => (
                <li
                  key={c?._id ? c?._id : c?.code}
                  value={c?._id ? c?._id : c?.dial_code}
                  className="iti__country iti__preferred"
                  onClick={() => onSelectOption(c?._id ? c?._id : c?.dial_code)}
                >
                  <div className="iti__flag-box">
                    <div className={`${countryFlag ? `d-flex iti__flag iti__${c?.code?.toLowerCase()}` : 'd-flex'}`}></div>
                  </div>
                  <span className="iti__country-name">{c?.name}</span>
                  <span className="iti__dial-code">{!c?.dial_code ? "" : c?.dial_code}</span> 
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default SelectSearch;
