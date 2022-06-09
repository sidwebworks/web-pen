import { NextPage } from "next";
import dynamic from "next/dynamic";
import React from "react";

const EditorLayout = dynamic(() => import("../../components/editor"));

const Page: NextPage = () => {
  return <EditorLayout />;
};

export default Page;
