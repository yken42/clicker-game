import React from "react";
import { Navbar } from "../components/Navbar";

export const MainLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
};
