import { cn } from "@/lib/utils";
import { NewsArticle } from "@/types/types";
import Link from "next/link";
import Image from "next/image";
import NoData from "../../../public/assets/no-data.svg";
import { useRouter } from "next/router";

const NewsContent = ({ articles }: { articles: NewsArticle[] }) => {
  const router = useRouter();

  function formatTo12Hour(dateString: string) {
    const date = new Date(dateString);

    if (isNaN(date)) {
      return "Invalid Date"; // Handle invalid input
    }

    let hours = date.getHours();
    const minutes = date.getMinutes();
    const amOrPm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight (0 hours)

    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");

    return `${formattedHours}:${formattedMinutes} ${amOrPm}`;
  }

  return (
    <main className="container mx-auto p-4 mt-30 w-full ">
      {articles.length > 0 ? (
        <>
          <section className="gap-4 mb-6  min-h-[30rem]">
            {router.query.search ? (
              <div className="text-2xl font-bold mb-4 mt-6 text-[#1a73e8]">
                Search results for &quot;{router.query.search}&quot;
              </div>
            ) : (
              <div className="text-2xl font-bold my-4 text-[#1a73e8]">
                Top Headlines
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 ">
              <div
                className={cn(
                  "col-span-3 lg:col-span-2  max-h-[570px] bg-white/80 border dark:bg-gray-700  flex items-center justify-center rounded-lg relative group overflow-hidden"
                )}
              >
                <Image
                  src={articles[0].urlToImage || "/public/assets/fallback.png"}
                  width={100}
                  height={100}
                  className="w-full h-full  group-hover:scale-110 group-hover:opacity-60 transition-all duration-300 ease-in-out "
                  alt={articles[0].title}
                  layout="responsive"
                  // objectFit="cover"
                  fetchPriority="high"
                />
                <p className="absolute bottom-6 left-4 p-2 w-[95%]">
                  <Link
                    href={`/article?q=${articles[0].url}`}
                    className="text-lg lg:text-xl font-bold text-white group-hover:text-black dark:group-hover:text-white underline line-clamp-1 lg:line-clamp-2 overflow-hidden"
                  >
                    {articles[0].title}
                  </Link>
                  <span className="text-gray-50  text-sm line-clamp-1 group-hover:text-black dark:group-hover:text-white">
                    {articles[0].content?.replace(/ \[\+\d+ chars\]/g, "")}
                  </span>
                </p>
                <p className="absolute bottom-0 left-4 p-2 w-[95%] flex items-center gap-x-2">
                  <span className="text-gray-50  text-sm  group-hover:text-black dark:group-hover:text-white">
                    {formatTo12Hour(articles[0].publishedAt)}
                  </span>
                  <span className="text-sm text-white group-hover:text-black dark:group-hover:text-white">
                    {new Date(articles[0].publishedAt).toDateString()}
                  </span>
                </p>
              </div>
              <div className="grid grid-rows-3 col-span-3 lg:col-span-1 gap-4">
                {articles.slice(1, 4).map((article, index) => (
                  <Link
                    href={`/article?q=${article.url}`}
                    key={index}
                    className=" h-[220px] md:h-60 lg:h-[180px] bg-white dark:bg-gray-700  flex items-center justify-center rounded-lg border group overflow-hidden relative cursor-pointer"
                  >
                    <Image
                      src={article.urlToImage || "/assets/fallback.png"}
                      width={100}
                      height={100}
                      className="w-full h-full group-hover:opacity-60 group-hover:scale-110 transition-all duration-300 ease-in-out"
                      alt={article.title}
                      layout="responsive"
                      objectFit="fill"
                      fetchPriority="high"
                    />
                    <div>
                      <div className="absolute bottom-8 left-4  w-[95%]">
                        <p className="text-base font-bold text-white group-hover:text-black dark:group-hover:text-white underline line-clamp-1 overflow-hidden ">
                          {article.title}
                        </p>
                        <span className="text-gray-50 group-hover:text-black dark:group-hover:text-white text-sm line-clamp-1">
                          {article.content?.replace(/ \[\+\d+ chars\]/g, "")}
                        </span>
                      </div>
                      <p className="absolute bottom-0 left-4 py-2 w-[95%] flex items-center gap-x-2">
                        <span className="text-gray-50  text-sm  group-hover:text-black dark:group-hover:text-white">
                          {formatTo12Hour(article.publishedAt)}
                        </span>
                        <span className="text-sm text-white group-hover:text-black dark:group-hover:text-white ">
                          {new Date(article.publishedAt).toDateString()}
                        </span>
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className="" id="content-row-2">
            <div className="text-2xl font-bold my-4 underline text-[#1a73e8]/90"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
              {articles.slice(4).map((article) => (
                <div className="group hover:" key={article.title}>
                  <Link
                    href={`/article?q=${article.url}`}
                    className="flex  space-x-4 p-2 bg-white dark:bg-slate-800 border rounded-lg dark:hover:bg-gray-900 "
                  >
                    <Image
                      src={article.urlToImage || "/assets/fallback.png"}
                      alt={article.title}
                      width={100}
                      height={100}
                      className="w-20 h-20 rounded-md "
                      loading="lazy"
                      fetchPriority="low"
                    />
                    <div className="flex flex-col justify-between px-2 ">
                      <div className="pr-2">
                        <h2 className="text-lg font-semibold line-clamp-1">
                          {article.title}
                        </h2>
                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-1 ">
                          {article.description}
                        </p>
                      </div>
                      <div className="flex justify-between items-center mt-2 pr-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400  truncate">
                          {article.source.name} •{" "}
                        </span>
                        <p className=" flex items-center gap-x-2 ">
                          <span className="text-black text-xs  dark:text-gray-300 group-hover:text-black  truncate">
                            {formatTo12Hour(article.publishedAt)}
                          </span>
                          <span className="text-xs text-black  group-hover:text-black  dark:text-gray-300  truncate">
                            {new Date(article.publishedAt).toDateString()}
                          </span>
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-x-2 flex-col items-center">
          <Image
            src={NoData}
            width={100}
            height={100}
            alt="No Data"
            className="size-100 "
          />
          <p className="font-semibold text-gray-500 absolute top-10/12">
            No Results found...{" "}
          </p>
        </div>
      )}
    </main>
  );
};

export default NewsContent;
