import getHero from "@/actions/get-hero";
import getProducts from "@/actions/get-products";
import ProductList from "@/components/product-list";
import ServiceList from "@/components/service-list";
import Hero from "@/components/ui/hero";
import Container from "@/components/ui/container";
import getServices from "@/actions/get-services";

export const revalidate = 0;

const HomePage = async () => {
  const hero = await getHero();
  const products = await getProducts({ isFeatured: true });
  const services = await getServices({ isFeatured: true });


  return ( 
    <Container>
      <div className="space-y-10 pb-10">
        <Hero data={hero} />
        <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
          <ServiceList title="Featured Services" items={services} />
          <ProductList title="Featured Products" items={products} />
        </div>
      </div>
    </Container>
  );
};

export default HomePage;
