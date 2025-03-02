import FallbackImage from "@/components/article/CustomImage";
import ErrorSVG from "../../public/assets/error.svg";
import { JSDOMArticle } from "@/types/types";

import { useRouter } from "next/router";
import axios from "axios";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import Link from "next/link";
import { GetServerSidePropsContext } from "next";
import Image from "next/image";

interface SingleArticle {
  article: JSDOMArticle;
  error?: string;
}

function Article(props: SingleArticle) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  console.log(router.query);

  if (props.error) {
    return (
      <div className="mx-auto p-4 mt-30 max-w-3xl ">
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
        </div>
      </div>
    );
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
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

  const textContentArray = props.article.textContent.split(".");
  const articleImage = props.article.content.match(/<img[^>]+src="([^"]+)"/g);
  console.log(articleImage);

  return (
    <div className="mx-auto p-4 mt-30 max-w-3xl ">
      {!isLoading ? (
        !props.error && (
          <div>
            <div className="my-3"></div>
            <Link
              href={router.query.q as string}
              target="_blank"
              className="text-xl font-bold my-4 underline"
            >
              {props.article.title}
            </Link>
            <div className="my-3"></div>
            <div className="my-6 flex flex-row justify-between gap-y-2 ">
              <span className="font-semibold">by {props.article.byline}</span>
              <span className="font-medium">
                {props.article.publishedTime &&
                  new Date(props.article.publishedTime).toDateString()}
              </span>
            </div>
            <div className="my-4">
              <FallbackImage
                src={router.query.img as string}
                height={100}
                width={100}
                fallbackSrc="/assets/fallback.png"
                alt={props.article.title}
                className="w-full rounded-md"
                layout="responsive"
              />
            </div>
            {Array.from({
              length: Math.ceil(textContentArray.length / 10),
            }).map((item, index) => {
              return (
                <>
                  <div key={index}>
                    {textContentArray
                      .slice(index * 5, (index + 1) * 5)
                      .join(".")
                      .replaceAll("—–", "")}
                  </div>
                  <div className="my-6"></div>
                </>
              );
            })}
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { query } = context;

  try {
    const r2 = await axios.get(query.q as string);
    const dom = new JSDOM(r2.data);
    const article = new Readability(dom.window.document).parse();

    return {
      props: {
        article: article,
      },
    };
  } catch (error) {
    console.error("Error fetching article:", error);
    return { props: { error: "Failed to fetch article" } };
  }
}

export default Article;
