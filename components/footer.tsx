"use client";
import { format, formatDistance, formatRelative, subDays } from "date-fns";
// import getStore from "@/actions/get-store";

const Footer = () => {

  // const store = getStore();

  const currentYear = format(new Date(), "yyyy");
  return (
    <footer className="bg-black border-t">
            <div className="mx-auto py-10 flex flex-col items-center">
              <h2 className="text-2xl font-bold text-black"></h2>
            </div>
      <div className="mx-auto py-10 flex flex-col items-center text-white">
        <p className="text-xs "> SCOTT GREFF development &copy; </p>
        <p className="text-xs ">{`${currentYear}`}</p>
        <p className="text-xs ">All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
