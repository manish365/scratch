import React, { memo } from "react";
import PaginationButton from "./PaginationButton";

interface PaginationType {
  update: any;
  page: number;
  showPrevious?: boolean;
  previousButtonDisabled?: boolean;
  showNext?: boolean;
  nextButtonDisabled?: boolean;
}

function Pagination({
  update,
  page = 1,
  showPrevious = true,
  previousButtonDisabled = false,
  showNext = true,
  nextButtonDisabled = false,
}: PaginationType) {
  const onClickButton = (e: string) => {
    update(e);
  };

  return (
    <div className="flex items-center gap-4">
      {showPrevious && (
        <PaginationButton
          title=""
          previous
          onClick={onClickButton}
          disabled={previousButtonDisabled}
        />
      )}
      <PaginationButton
        key={"page-1"}
        title="1"
        isSelected={page === 1}
        onClick={onClickButton}
      />
      <PaginationButton
        key={"page-2"}
        title="2"
        isSelected={page === 2}
        onClick={onClickButton}
      />
      <PaginationButton
        key={"page-3"}
        title="3"
        isSelected={page === 3}
        onClick={onClickButton}
      />
      <PaginationButton
        key={"page-4"}
        title="4"
        isSelected={page === 4}
        onClick={onClickButton}
      />
      <PaginationButton
        key={"page-5"}
        title="5"
        isSelected={page === 5}
        onClick={onClickButton}
      />
      {showNext && (
        <PaginationButton
          title=""
          next
          onClick={onClickButton}
          disabled={nextButtonDisabled}
        />
      )}
    </div>
  );
}

export default memo(Pagination);
