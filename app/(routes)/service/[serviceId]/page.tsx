import ServiceList from "@/components/service-list";
import getServices from "@/actions/get-services";
import Container from "@/components/ui/container";
import React from "react";
import getService from "@/actions/get-service";
import NextImage from "next/image";

import ServiceClient from "./components/client";
import Image from "next/image";

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
    <>
      <div className="bg-black">
        <Container>
          <div className="px-4 py-10 sm:px-6 lg:px-8 rounded-2xl">
            <div className="aspect-square relative h-[40] md:h-[60vh] w-full m-auto flex items-center justify-center sm:rounded-lg ">
              <NextImage
                fill
                src={service.images[0].url}
                alt={service.name}
                className="object-cover object-center rounded-2xl"
              />
              <div className="text-center font-bold drop-shadow-2xl text-3xl sm:text-5xl lg:text-7xl sm:max-w-xl text-white max-w-xs inset-0">
                {service.name}
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
    </>
  );
};

export default ServicePage;
