import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Unicorn Simulator",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Home() {
  return (
    <div className="max-w-screen overflow-x-hidden">
      <DefaultLayout>
        <ECommerce />
      </DefaultLayout>
    </div>
  );
}
