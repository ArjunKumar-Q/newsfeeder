import { useEffect, useState } from "react";
import axios from "axios";
import NewsContent from "@/components/default/content";
import type { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import ErrorSVG from "../../public/assets/error.svg";
import Image from "next/image";

export default function Home({
  data,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => {
      setIsLoading(true);
    };
    const handleComplete = () => {
      setIsLoading(false);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  console.log(isLoading);

  return (
    <div
      className={cn(
        "w-full h-full ",
        (isLoading || error || data.articles.length == 0) &&
          "items-center justify-center"
      )}
    >
      {!isLoading ? (
        !error ? (
          <NewsContent articles={data.articles} />
        ) : (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 capitalize flex gap-x-2 flex-col items-center">
            <Image
              src={ErrorSVG}
              width={100}
              height={100}
              alt="No Data"
              className="size-100"
            />
            <p className="font-semibold text-gray-500">
              Something went wrong...{" "}
            </p>
            {/* <Button variant={'secondary'} size={'icon'} className="[&>*]:text-gray-500"><RotateCw className="size-5"/><span className="text-base font-bold"> Reload</span></Button> */}
          </div>
        )
      ) : (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 capitalize flex gap-x-2">
          <Loader className="animate-spin" />
          <span>loading....</span>
        </div>
      )}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getServerSideProps(context: { query: any }) {
  const { query } = context;
  let response;
  try {
    if (query.search || query.language) {
      response = await axios.get(
        `${
          process.env.NEXT_PUBLIC_NEWS_BASE_URL
        }/everything?domains=techcrunch.com,bloomber.com,businessinsider.com${
          query.search && `&q=${query.search}`
        }${query.language ? `&language=${query.language}` : ""}&pageSize=50`,
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
        }`,
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
    return {
      props: {
        error: "Failed to Fetch.",
      },
    };
  }
}
