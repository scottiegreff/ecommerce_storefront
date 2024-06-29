"use client";

import Image from "next/image";
import { MouseEventHandler } from "react";
import { Expand, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

import Currency  from "@/components/ui/currency";
import IconButton  from "@/components/ui/icon-button";
import usePreviewModal from "@/hooks/use-preview-modal";
import useCart from "@/hooks/use-cart";
import { Product } from "@/types";

interface ProductCard {
  data: Product
}

const ProductCard: React.FC<ProductCard> = ({
  data
}) => {
  const previewModal = usePreviewModal();
  const cart = useCart();
  const router = useRouter();
  const handleClick = () => {
    router.push(`/product/${data?.id}`);
  };

  const onPreview: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    previewModal.onOpen(data);
  };

  const onAddToCart: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    console.log("ADD TO CART???>", data);
    cart.addItem(data);
  };
   
  return ( 
    <div onClick={handleClick} className="bg-black border-[#C68DBA]  group cursor-pointer rounded-xl border p-3 space-y-4">
      {/* Image & actions */}
      
      <div className="aspect-square rounded-xl bg-gray-100 relative">
        <Image 
          src={data.images?.[0]?.url} 
          alt="" 
          fill
          className="aspect-square object-cover rounded-md"
        />
        <div className="opacity-0 group-hover:opacity-100 transition absolute w-full px-6 bottom-5">
          <div className="flex gap-x-6 justify-center">
            <IconButton 
              onClick={onPreview} 
              icon={<Expand size={20} className=" text-[#C68DBA]" />}
            />
            <IconButton
              onClick={onAddToCart} 
              icon={<ShoppingCart size={20} className=" text-[#C68DBA]" />} 
            />
          </div>
        </div>
      </div>
      {/* Description */}
      <div>
        <p className="font-semibold text-xl  text-[#C68DBA]">{data.name}</p>
        <div className="flex items-center justify-between">
        <p className="text-sm text-[#ffffff]">{data.category?.name}</p>
        {/* <p className="text-sm text-[#C68DBA]">{data.size}</p> */}
        </div>
      </div>
      {/* Price & Review */}
      <div className="flex items-center justify-between  text-[#ffffff]">
        <Currency value={data?.price} />
      </div>
    </div>
  );
}

export default ProductCard;
