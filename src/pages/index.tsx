import ErrorSVG from "../../public/assets/error.svg";
import NewsContent from "@/components/default/content";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import type { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { Loader } from "lucide-react";
import Image from "next/image";
import { GetServerSidePropsContext } from "next";

const PAGE_SIZE = 15;
const MAX_PAGES = 5;

export default function Home({
  data,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [articles, setArticles] = useState(data.articles || []);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const maxPages = Math.min(
    MAX_PAGES,
    Math.ceil(data.totalResults / PAGE_SIZE)
  );

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      let response: AxiosResponse;
      try {
        if (router.query.search || router.query.language) {
          response = await axios.get(
            `${
              process.env.NEXT_PUBLIC_NEWS_BASE_URL
            }/everything?domains=techcrunch.com,bloomber.com,businessinsider.com${
              router.query.search && `&q=${router.query.search}`
            }${
              router.query.language ? `&language=${router.query.language}` : ""
            }&pageSize=${PAGE_SIZE}&page=${page}`,

            {
              headers: {
                "X-Api-key": process.env.NEXT_PUBLIC_NEWS_API_KEY,
              },
            }
          );
        } else {
          response = await axios.get(
            `${process.env.NEXT_PUBLIC_NEWS_BASE_URL}/top-headlines?${
              router.query.category
                ? `country=us&category=${router.query.category}`
                : "country=us"
            }&pageSize=${PAGE_SIZE}&page=${page}`,

            {
              headers: {
                "X-Api-key": process.env.NEXT_PUBLIC_NEWS_API_KEY,
              },
            }
          );
        }

        setArticles(() => [...response.data.articles]);
      } catch (error) {
        console.error("Error fetching more articles:", error);
      }
      setIsLoading(false);
    };

    if (page <= maxPages) {
      fetchArticles();
    }
  }, [
    page,
    maxPages,
    router.query.search,
    router.query.language,
    router.query.category,
  ]);

  useEffect(() => {
    setPage(1);
    setArticles(data.articles);
  }, [data.articles, router.query]);

  return (
    <div
      className={cn("w-full h-full", error && "items-center justify-center")}
    >
      {error ? (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 capitalize flex gap-x-2 flex-col items-center">
          <Image
            src={ErrorSVG}
            width={100}
            height={100}
            alt="No Data"
            className="size-100"
          />
          <p className="font-semibold text-gray-500">Something went wrong...</p>
        </div>
      ) : (
        <div className="flex flex-col justify-between">
          <NewsContent articles={articles} isLoading={isLoading} />
          <div className="flex justify-center py-4">
            {isLoading && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 capitalize flex gap-x-2">
                <Loader className="animate-spin" />
                <span>loading....</span>
              </div>
            )}
            <div className="flex gap-x-2">
              {[...Array(maxPages)].map((_, index) => (
                <Button
                  key={index}
                  variant={"default"}
                  className={cn(
                    "h-10 w-10 px-4 py-2 rounded-full border",
                    page === index + 1 ? " text-white" : "bg-slate-400"
                  )}
                  onClick={() => setPage(index + 1)}
                  disabled={isLoading}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { query } = context;

  let response;

  try {
    if (query.search || query.language) {
      response = await axios.get(
        `${
          process.env.NEXT_PUBLIC_NEWS_BASE_URL
        }/everything?domains=techcrunch.com,bloomber.com,businessinsider.com${
          query.search && `&q=${query.search}`
        }${
          query.language ? `&language=${query.language}` : ""
        }&pageSize=${PAGE_SIZE}`,

        {
          headers: {
            "X-Api-key": process.env.NEXT_PUBLIC_NEWS_API_KEY,
          },
        }
      );
    } else {
      response = await axios.get(
        `${process.env.NEXT_PUBLIC_NEWS_BASE_URL}/top-headlines?${
          query.category
            ? `country=us&category=${query.category}`
            : "country=us"
        }&pageSize=${PAGE_SIZE}&page=1`,

        {
          headers: {
            "X-Api-key": process.env.NEXT_PUBLIC_NEWS_API_KEY,
          },
        }
      );
    }

    const data = response.data;

    return {
      props: {
        data,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);

    return { props: { error: "Failed to Fetch." } };
  }
}
