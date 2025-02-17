import { useSearchParams } from "react-router-dom";
// import { useDebounce } from "./useDebounce";



export const useSearchFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchInput = searchParams.get("search") || "";
  const typeFilter = searchParams.get("type") || "";
  const tagFilter = searchParams.getAll("tag") || [];



  // const debouncedSearch = useDebounce(searchInput, 500);

  const setSearchInput = (value: string) => {
    setSearchParams((prev) => {
      if (value) prev.set("search", value);
      else prev.delete("search");
      return prev;
    });
  };

  const setTypeFilter = (value: string | null) => {
    setSearchParams((prev) => {
      if (value) prev.set("type", value);
      else prev.delete("type");
      return prev;
    });
  };

  const setTagFilter = (values: string[]) => {
    setSearchParams((prev) => {
      prev.delete("tag");
      values.forEach((tag) => prev.append("tag", tag));
      return prev;
    });
  };

  return { searchInput, setSearchInput, typeFilter, setTypeFilter, tagFilter, setTagFilter };
};