import React from "react";
import Head from "next/head";
import Header from "components/dashboard-header";
import { useRouter } from "next/router";
import DashboardSidebar from "@components/dashboard-header/DashboardSidebar";
import { RootState } from "store";
import { useSelector } from "react-redux";

type LayoutType = {
  title?: string;
  children?: React.ReactNode;
};

export default ({ children, title = "Flower Champ" }: LayoutType) => {
  const router = useRouter();
  const pathname = router.pathname;
  const { dashboradSidebarState } = useSelector(
    (store: RootState) => store.user
  );

  return (
    <div className="app-main">
      <Head>
        <title>{title}</title>
      </Head>

      <Header />

      <main className={pathname !== "/" ? "main-page pt-0 flex" : ""}>
        <div className={"flex"}>
          {dashboradSidebarState && <DashboardSidebar />}
        </div>
        <div className="grow row">
          <div className="col-lg-12 col-xs-12 col-12">{children}</div>
        </div>
      </main>
    </div>
  );
};
