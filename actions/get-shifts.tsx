import { Shift } from "@/types";
import qs from "query-string";

const URL=`${process.env.NEXT_PUBLIC_API_URL}/shifts`;

interface Query {
  employeeId?: string;
}

const getShifts = async (query: Query): Promise<Shift[]> => {
  const url = qs.stringifyUrl({
    url: URL,
    query: { 
      employeeId: query.employeeId,
    },
  });

  const res = await fetch(url);

  return res.json();
};

export default getShifts;
