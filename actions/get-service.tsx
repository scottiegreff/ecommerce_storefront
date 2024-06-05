import { Service } from "@/types";

const URL=`${process.env.NEXT_PUBLIC_API_URL}/services`;

const getService = async (id: string): Promise<Service> => {
  const res = await fetch(`${URL}/${id}`);

  return res.json();
};

export default getService;
