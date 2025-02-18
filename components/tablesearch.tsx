"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CiSearch } from "react-icons/ci";
import { useState } from "react";

const TableSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams.toString());
    params.set("search", searchValue);
    params.set("page", "1"); 

    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2 mb-4"
    >
      <CiSearch width={24} height={24} />
      <input
        type="text"
        placeholder="Search ..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="w-[200px] p-2 bg-transparent outline-none"
      />
      <button type="submit" className="hidden">Search</button>
    </form>
  );
};

export default TableSearch;