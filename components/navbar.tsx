import Link from "next/link";

import MainNav from "@/components/main-nav";
import Container from "@/components/ui/container";
import NavbarActions from "@/components/navbar-actions";
import getCategories from "@/actions/get-categories";
import getHero from "@/actions/get-hero";
import Image from "next/image";

export const revalidate = 0;

const Navbar = async () => {
  const categories = await getCategories();
  const data = await getHero();
  const storeName = data[0]?.label;
  const storeLogo = data[0]?.logoUrl;
  return (
    <div className="border-b">
      <Container>
        <div className="relative px-4 sm:px-6 lg:px-8 flex h-16 items-center">
          <Link href="/" className="ml-4 flex lg:ml-0 gap-x-2">
            <div className="flex justify-start items-center gap-2 w-20 md:w-[10vw]">
              <Image
                src={storeLogo}
                alt={storeName}
                width={80}
                height={80}
                className="rounded"
              />{" "}
              {/* <p className="font-bold text-sm lg:text-lg">{storeName}</p> */}
            </div>
          </Link>
          <MainNav data={categories} />
          <NavbarActions />
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
