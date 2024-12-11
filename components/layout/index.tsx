"use client";
import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { usePathname } from "next/navigation";
import { useStore } from "@/store";

const Layout = observer(({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={"flex-1 pb-20 w-full lg:max-w-[1200px] px-4 lg:px-8 mx-auto"}
    >
      {children}
    </div>
  );
});
export default Layout;

export const FullScreenLayout = observer(
  ({ children }: { children: React.ReactNode }) => {
    return <div className={"flex-1 pb-20 w-full px-4 lg:px-8"}>{children}</div>;
  }
);

export const LayoutProvider = observer(
  ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const { global } = useStore()
    useEffect(() => {
      global.scrollToTop();
    }, [])
    return (
      <>
        {pathname === "/" ? (
          <FullScreenLayout>{children}</FullScreenLayout>
        ) : (
          <Layout>{children}</Layout>
        )}
      </>
    );
  }
);
