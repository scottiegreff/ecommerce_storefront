import ServiceList from "@/components/service-list";
import Gallery from "@/components/gallery";
import getServices from "@/actions/get-services";
import Container from "@/components/ui/container";
import React from "react";
// import BookingForm from "@/components/booking-form";
import getEmployees from "@/actions/get-employees";
import getShifts from "@/actions/get-shifts";
import getService from "@/actions/get-service";
import { date } from "zod";
import CustomerForm from "@/components/customer-form";
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

  return (
    <div className="bg-white">
      <Container>
        <div className="px-4 py-10 sm:px-6 lg:px-8">
          <div
            style={{ backgroundImage: `url(${service.images[0].url})` }}
            className="rounded-xl relative aspect-square md:aspect-[3.5/1] overflow-hidden bg-cover"
          >
            <div className="h-full w-full flex flex-col justify-center items-center text-center gap-y-8">
              <div className="font-bold text-pink-400 text-3xl sm:text-5xl lg:text-6xl sm:max-w-xl max-w-xs">
                {service.name}
              </div>
            </div>
          </div>
          <div className="mt-10">
            <p className="text-2xl font-bold text-gray-800">Description:</p>
            <p className="text-md md:text-lg font-light text-gray-800">
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
