import { NewsArticle } from "@/types/types";
import NoData from "../../../public/assets/no-data.svg";
import { MainArticle, MainArticleTwo, Article } from "../article/ArticleCard";
import { cn } from "@/lib/utils";

import Image from "next/image";
import { useRouter } from "next/router";

const NewsContent = ({
  articles,
  isLoading,
}: {
  articles: NewsArticle[];
  isLoading: boolean;
}) => {
  const router = useRouter();

  return (
    <main
      className={cn(
        "container mx-auto p-4 mt-30 w-full",
        isLoading && "hidden"
      )}
    >
      {articles.length > 0 ? (
        <>
          <section className="gap-4 mb-6  min-h-[30rem]">
            <div id="content-section-1-heading">
              {router.query.search ? (
                <div className="text-2xl font-bold mb-4 mt-6 text-[#1a73e8]">
                  Search results for &quot;{router.query.search}&quot;
                </div>
              ) : (
                <div className="text-2xl font-bold my-4 text-[#1a73e8] uppercase underline">
                  {router.query.category
                    ? `${router.query.category}`
                    : "Top Headlines"}
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 ">
              <MainArticle article={articles[0]} />
              <div className="grid grid-rows-3 col-span-3 lg:col-span-1 gap-4">
                {articles.slice(1, 4).map((article) => (
                  <MainArticleTwo article={article} key={article.title} />
                ))}
              </div>
            </div>
          </section>

          {articles.length >= 5 && (
            <section id="content-row-2">
              <div
                id="content-section-2-heading"
                className="text-xl font-bold my-4 underline  text-[#1a73e8]/90 uppercase"
              >
                {router.query.search
                  ? `Top Reads for ${router.query.search}`
                  : "Hot News on the section "}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                {articles.slice(4).map((article) => (
                  <Article article={article} key={article.title} />
                ))}
              </div>
            </section>
          )}
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
