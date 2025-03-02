import { formatTo12Hour, cn } from "@/lib/utils";
import { NewsArticle } from "@/types/types";

import Image from "next/image";
import Link from "next/link";

export const MainArticle = ({ article }: { article: NewsArticle }) => {
  return (
    <div
      className={cn(
        "col-span-3 lg:col-span-2  max-h-[570px] bg-white/80 border dark:bg-gray-700  flex items-center justify-center rounded-lg relative group overflow-hidden"
      )}
    >
      <Image
        src={article.urlToImage || "/public/assets/fallback.png"}
        width={100}
        height={100}
        className="w-full h-full  group-hover:scale-110 group-hover:opacity-60 transition-all duration-300 ease-in-out "
        alt={article.title}
        layout="responsive"
        fetchPriority="high"
      />
      <p className="absolute bottom-6 left-4 p-2 w-[95%]">
        <Link
          href={`/article?q=${article.url}&img=${article.urlToImage}`}
          className="text-lg lg:text-xl font-bold text-white group-hover:text-black dark:group-hover:text-white underline line-clamp-1 lg:line-clamp-2 overflow-hidden"
        >
          {article.title}
        </Link>
        <span className="text-gray-50  text-sm line-clamp-1 group-hover:text-black dark:group-hover:text-white">
          {article.content?.replace(/ \[\+\d+ chars\]/g, "")}
        </span>
      </p>
      <p className="absolute bottom-0 left-4 p-2 w-[95%] flex items-center gap-x-2">
        <span className="text-gray-50  text-sm  group-hover:text-black dark:group-hover:text-white">
          {formatTo12Hour(article.publishedAt)}
        </span>
        <span className="text-sm text-white group-hover:text-black dark:group-hover:text-white">
          {new Date(article.publishedAt).toDateString()}
        </span>
      </p>
    </div>
  );
};

export const MainArticleTwo = ({ article }: { article: NewsArticle }) => {
  return (
    <Link
      href={`/article?q=${article.url}&img=${article.urlToImage}`}
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
  );
};

export const Article = ({ article }: { article: NewsArticle }) => {
  return (
    <div className="group " key={article.title}>
      <Link
        href={`/article?q=${article.url}&img=${article.urlToImage}`}
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
        <div className="flex flex-col justify-between px-2  overflow-hidden ">
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
  );
};
