import { Booking } from "@/types";

const URL=`${process.env.NEXT_PUBLIC_API_URL}/bookings`;

const getSizes = async (): Promise<Booking[]> => {
  const res = await fetch(URL);

  return res.json();
};

export default getSizes;
