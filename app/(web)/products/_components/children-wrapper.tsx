"use client";

import { useSearchParams } from "next/navigation";
import { Fragment } from "react";

// Ensure children are re-rendered when search parameters change
export default function ChildrenWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();

  const searchKey = searchParams.toString();
  console.log("ChildrenWrapper searchKey:", searchKey);

  return <Fragment key={searchKey}>{children}</Fragment>;
}
