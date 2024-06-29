import ServiceList from "@/components/service-list";
import getServices from "@/actions/get-services";
import Container from "@/components/ui/container";
import React from "react";
import getService from "@/actions/get-service";

import ServiceClient from "./components/client";

export const revalidate = 0;

interface ServicePageProps {
  params: {
    serviceId: string;
  };
}

const ServicePage: React.FC<ServicePageProps> = async ({ params }) => {
  const service = await getService(params.serviceId);
  const suggestedServices = await getServices({
    categoryId: service?.category?.id,
  });

  if (!service) {
    return null;
  }
  // #bedc45
  return (
    <div className="bg-black">
      <Container>
        <div className="px-4 py-10 sm:px-6 lg:px-8 rounded-2xl">
          <div
            style={{ backgroundImage: `url(${service.images[0].url})` }}
            className="relative aspect-square md:aspect-[2.35/1] overflow-hidden bg-cover rounded-2xl"
          >
            <div className="h-full w-full flex flex-col justify-center items-center text-center gap-y-8">
              <div className="font-bold drop-shadow-2xl  text-3xl sm:text-5xl lg:text-7xl sm:max-w-xl max-w-xs">
                {service.name}
              </div>
            </div>
          </div>
          <div className="mt-10">
            <p className="text-2xl font-bold text-[#C68DBA]">Description:</p>
            <p className="text-md md:text-lg font-light text-[#C68DBA]">
              {service.description}
            </p>
          </div>
          <div className="my-10">
            <ServiceClient />
          </div>
          <hr />
          <ServiceList title="Related Items" items={suggestedServices} />
        </div>
      </Container>
    </div>
  );
};

export default ServicePage;
