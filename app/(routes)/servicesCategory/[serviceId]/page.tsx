import Container from "@/components/ui/container";
import Billboard from "@/components/ui/billboard";
import ServiceCard from "@/components/ui/service-card";
import NoResults from "@/components/ui/no-results";
import getCategory from "@/actions/get-category";

import getServices from "@/actions/get-services";


export const revalidate = 0;

interface ServicesCategoryPageProps {
  params: {
    serviceId: string;
  };
  searchParams: {
    isFeatured: boolean;
  };
}

const ServicesCategoryPage: React.FC<ServicesCategoryPageProps> = async ({
  params,
  searchParams,
}) => {
  const services = await getServices({
    categoryId: params.serviceId
  });

  console.log("SERVICE PAGE PARAMS!!!!!!", params)
  // console.log("PRODUCTS DATA~~~~~~~", products);

  const category = await getCategory(params.serviceId);
  // const shifts: Shift[] = await getShifts();
  // const employees: Employee[] = await getEmployees();
  // console.log("CATEGORY DATA~~~~~~~~", category);
  // console.log("SHIFTS DATA~~~~~~~~", shifts);
  // console.log("EMPLOYEES DATA~~~~~~~~", employees);

  return (
    <div className="bg-white">
      <Container>
        <Billboard data={category?.billboard} />

        <div className="px-4 sm:px-6 lg:px-8 pb-24">
          <div className="mt-6 lg:col-span-4 lg:mt-0">
            {services.length === 0 && <NoResults />}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {services.map((item) => (
                <ServiceCard key={item.id} data={item} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ServicesCategoryPage;
