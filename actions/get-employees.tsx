import { Employee } from "@/types";

const URL=`${process.env.NEXT_PUBLIC_API_URL}/employees`;

const getEmployees = async (): Promise<Employee[]> => {
  const res = await fetch(URL);

  return res.json();
};

export default getEmployees;
