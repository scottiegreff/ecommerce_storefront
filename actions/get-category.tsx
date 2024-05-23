import { Category } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/categories`;

const getCategory = async (id: string): Promise<Category> => {
  console.log("URL", URL);
  const res = await fetch(`${URL}/${id}`);
  return res.json();
};

export default getCategory;
