"use client";

import Image from "next/image";
import { MouseEventHandler } from "react";
import { useRouter } from "next/navigation";

import Currency  from "@/components/ui/currency";
import IconButton  from "@/components/ui/icon-button";
import usePreviewModal from "@/hooks/use-preview-modal";
import useCart from "@/hooks/use-cart";
import { Service } from "@/types";

interface ServiceCard {
  data: Service 
}

const ServiceCard: React.FC<ServiceCard> = ({
  data
}) => {
  const previewModal = usePreviewModal();
  // const cart = useCart();
  const router = useRouter();

  const handleClick = () => {
    router.push(`/service/${data?.id}`);
  };


  // const onAddToCart: MouseEventHandler<HTMLButtonElement> = (event) => {
  //   event.stopPropagation();

  //   // cart.addItem(data);
  // };
   
  return ( 
    <div onClick={handleClick} className="bg-black group cursor-pointer rounded-xl border-[#C68DBA] border p-3 space-y-4">
      {/* Image & actions */}
      
      <div className="aspect-square rounded-xl bg-gray-100 relative">
        <Image 
          src={data.images?.[0]?.url} 
          alt="" 
          fill
          className="aspect-square object-cover rounded-md"
        />

      </div>
      {/* Description */}
      <div>
        <p className="font-semibold text-lg text-[#C68DBA]">{data.name}</p>
        <p className="text-sm text-[#C68DBA]">
          {/* {data.category?.name} */}
          BOOK
          </p>
      </div>
      {/* Price & Reiew */}
      <div className="flex items-center justify-between  text-[#C68DBA]">
        <Currency value={data?.price} />
      </div>
    </div>
  );
}

export default ServiceCard;
