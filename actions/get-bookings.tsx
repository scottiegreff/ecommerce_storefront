import { Booking } from "@/types";
import qs from "query-string";

const URL=`${process.env.NEXT_PUBLIC_API_URL}/bookings`;

interface Query {
  shiftId?: string;
  employeeId?: string;
}

const getBookings = async (query: Query): Promise<Booking[]> => {
  const url = qs.stringifyUrl({
    url: URL,
    query: { 
      shiftId: query.shiftId,
      employeeId: query.employeeId,
    },
  });

  const res = await fetch(url);

  return res.json();
};

export default getBookings;
