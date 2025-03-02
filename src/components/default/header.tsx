/* eslint-disable @typescript-eslint/no-explicit-any */
import { ModeToggle } from "./dark_mode";
import { Newspaper } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const Header = () => {
  const router = useRouter();
  const [date, setDate] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>(
    (router.query.category as string) || "Home"
  );
  const [searchOpen, setSearchOpen] = useState(false);
  const categories = [
    "Home",
    "Science",
    "Business",
    "Technology",
    "Sports",
    "Entertainment",
    "Health",
    "Search",
  ];
  const [search, setSearch] = useState("");

  const debounce = (func: (...args: any[]) => void, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const handleCategoryChange = (category: string) => {
    if (category != "Home") {
      router.push({
        pathname: "/",
        query: { category: category.toLowerCase() },
      });
    } else {
      router.push({
        pathname: "/",
        query: {},
      });
    }
  };

  const debouncedCategoryChange = debounce(handleCategoryChange, 300);

  const categoryClickHandler = (category: string) => {
    setActiveCategory(category);
    debouncedCategoryChange(category);
    if (searchOpen) setSearchOpen(!searchOpen);
  };

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const searchButtonHandler = () => {
    setActiveCategory("Search");
    setSearchOpen(false);
    router.push({
      pathname: "/",
      query: {
        search,
      },
    });
  };

  const searchToggleButton = () => {
    setSearchOpen(!searchOpen);
    if (search.length > 0) {
      setSearch("");
    }
  };

  useEffect(() => {
    setDate(new Date().toDateString());
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full bg-white dark:bg-gray-900 z-10">
      <div className="flex justify-between items-center border-b pb-2 p-2">
        <div className="flex items-center gap-x-2">
          <div className="flex gap-x-1 items-center ">
            <Newspaper className="w-5 h-5 stroke-[#1a73e8]" />
            <h1 className="text-xl font-bold">
              <span className="text-lg text-[#1a73e8]">NEWS</span>
              <span className="text-lg text-gray-600">Feeder</span>
            </h1>
          </div>
          {date && (
            <span className="hidden sm:block text-sm text-gray-600 dark:text-gray-400 text-center">
              | {date}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Select
            value={(router.query.language as string) || "en"}
            onValueChange={(value) => {
              router.push({
                pathname: "/",
                query: { language: value },
              });
            }}
          >
            <SelectTrigger className=" w-auto h-9">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">EN</SelectItem>
              <SelectItem value="es">ES</SelectItem>
              <SelectItem value="fr">FR</SelectItem>
              <SelectItem value="it">IT</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="relative ">
        <div className="p-2 flex justify-between items-center overflow-x-auto mt-2  border-b relative z-10   dark:bg-gray-900">
          <div className="flex space-x-4 justify-center flex-1">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 text-sm font-medium ${
                  activeCategory.toLowerCase() == category.toLowerCase()
                    ? "border-b-4 border-[#1a73e8] text-[#1a73e8] cursor-pointer"
                    : ""
                }`}
                onClick={
                  category === "Search"
                    ? () => searchToggleButton()
                    : () => categoryClickHandler(category)
                }
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        <div
          className={`transition-all duration-300 overflow-hidden ${
            searchOpen ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="mt-2 flex items-center gap-2 p-2 bg-white dark:bg-gray-800 shadow-md">
            <input
              type="text"
              placeholder="Search news..."
              className="flex-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white"
              value={search}
              onChange={onChangeHandler}
            />
            <Button
              variant="default"
              type="button"
              onClick={searchButtonHandler}
            >
              Search
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
