import { Shift } from "@/types";

const URL=`${process.env.NEXT_PUBLIC_API_URL}/shifts`;

const getShifts = async (): Promise<Shift[]> => {
  const res = await fetch(URL);
  
  return res.json();
};

export default getShifts;
