import React, { KeyboardEvent } from "react";
import { FiSearch } from "react-icons/fi";
interface SearchBoxConfigType {
  inputChange: any;
  placeholder: string;
  searchBtnText?: string;
  searchBtnClick: any;
}

function SearchBox({
  placeholder = "Enter search",
  searchBtnClick,
  searchBtnText,
  inputChange,
}: SearchBoxConfigType) {
  const onkeyup = (e: KeyboardEvent<HTMLInputElement>) => {
    // handle enter key
    if (e.key === 'Enter') {
      searchBtnClick();
    }
  }

  return (
    <div className="flex items-center justify-start border shadow border-red-950 rounded-sm overflow-hidden">
      <input
        type="text"
        className="w-96 px-2"
        placeholder={placeholder}
        onChange={($e) => inputChange($e)}
        onKeyUp={($e) => onkeyup($e)}
      />
      <button
        type="button"
        className="btn bg-red-950 text-white rounded-none"
        onClick={() => searchBtnClick()}
      >
        <FiSearch /> {searchBtnText || null}
      </button>
    </div>
  );
}

export default SearchBox;
