/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/utils";
import Header from "./header";

export default function Layout({ children, ...props }: any) {
  return (
    <div
      className={cn(
        "flex flex-col  bg-gray-100 dark:bg-[#0F1C2E] overflow-hidden relative",
        props.className
      )}
      {...props}
    >
      <Header />
      <main className="min-h-screen max-h-fit w-full">{children}</main>
    </div>
  );
}
