import { format, formatDistance, formatRelative, subDays } from "date-fns";

const Footer = () => {
  const currentYear = format(new Date(), "yyyy");
  return (
    <footer className="bg-white border-t">
      <div className="mx-auto py-10 flex flex-col items-center">
        <p className="text-xs text-black"> SCOTT GREFF development &copy; </p>
        <p className="text-xs text-black">{`${currentYear}`}</p>
        <p className="text-xs text-black">All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
