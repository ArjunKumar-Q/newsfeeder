import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import axios from "axios";
import NewsContent from "@/components/default/content";
import type { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import ErrorSVG from "../../public/assets/error.svg";
import Image from "next/image";
import { GetServerSidePropsContext } from "next";

const PAGE_SIZE = 20;

export default function Home({
  data,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { query } = router;
  const [articles, setArticles] = useState(data?.articles || []);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const totalResultsRef = useRef(data?.totalResults || 0);
  const observerRef = useRef(null);

  console.log(articles);

  useEffect(() => {
    setArticles(data?.articles || []);
    setPage(1);
    totalResultsRef.current = data?.totalResults || 0;
  }, [data]);

  const hasMore = useMemo(
    () => articles.length < totalResultsRef.current,
    [articles.length]
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

  const fetchMoreArticles = useCallback(async () => {
    if (!hasMore || isLoading) return;
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_NEWS_BASE_URL}/everything?domains=techcrunch.com,bloomberg.com,businessinsider.com&page=${page}&pageSize=${PAGE_SIZE}`,
        {
          headers: { "X-Api-key": process.env.NEXT_PUBLIC_NEWS_API_KEY },
        }
      );
      setArticles((prevArticles) => [
        ...prevArticles,
        ...response.data.articles,
      ]);
    } catch (error) {
      console.error("Error fetching more articles:", error);
    }
    setIsLoading(false);
  }, [page, hasMore, isLoading]);

  useEffect(() => {
    if (!hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasMore]);

  useEffect(() => {
    if (page > 1) {
      fetchMoreArticles();
    }
  }, [page, fetchMoreArticles]);

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
        <>
          <NewsContent articles={articles} />
          <div ref={observerRef} className="flex justify-center py-4">
            {isLoading && (
              <div className="flex items-center gap-x-2">
                <Loader className="animate-spin" />
                <span>Loading more articles...</span>
              </div>
            )}
            {!hasMore && (
              <p className="text-gray-500">No more content to fetch</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { query } = context;
  let response;
  try {
    if (query.search || query.language || query.category) {
      response = await axios.get(
        `${
          process.env.NEXT_PUBLIC_NEWS_BASE_URL
        }/everything?domains=techcrunch.com,bloomber.com,businessinsider.com${
          query.search ? `&q=${query.search}` : ""
        }${
          query.language ? `&language=${query.language}` : ""
        }&page=1&pageSize=${PAGE_SIZE}`,
        {
          headers: { "X-Api-key": process.env.NEXT_PUBLIC_NEWS_API_KEY },
        }
      );
    } else {
      response = await axios.get(
        `${process.env.NEXT_PUBLIC_NEWS_BASE_URL}/top-headlines?country=us`,
        {
          headers: { "X-Api-key": process.env.NEXT_PUBLIC_NEWS_API_KEY },
        }
      );
    }
    console.log(response.data);
    return {
      props: {
        data: {
          articles: response.data.articles,
          totalResults: response.data.totalResults,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { props: { error: "Failed to Fetch." } };
  }
}
