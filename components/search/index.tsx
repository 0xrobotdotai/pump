import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
import React, { useCallback } from "react";
import MInput from "../common/m-input";
import { Icon } from "@iconify/react";
import { debounce } from "lodash";

const SearchInput = observer(() => {
  const { market } = useStore();
  const { keyword } = market;

  const debouncedChangeHandler = useCallback(
    debounce(() => {
      market.fetchSearchTokens();
    }, 500),
    []
  );

  const handleKeywordChange = (e: any) => {
    market.setData({ keyword: e.target.value });
    debouncedChangeHandler();
  };

  return (
    <div className="w-full md:w-[370px]">
      <MInput
        aria-label="Search"
        autoComplete="off"
        size="md"
        classNames={{
          inputWrapper: "w-[100%] md:w-[370px] max-w-[400px] mx-auto",
          input: "text-sm ml-1",
        }}
        placeholder="Search token name or symbol..."
        labelPlacement="outside"
        startContent={<Icon icon="icon-park-twotone:search" width="1.2rem" height="1.2rem" />}
        type="search"
        value={keyword}
        onChange={handleKeywordChange}
      />
    </div>
  );
});

export default SearchInput;
