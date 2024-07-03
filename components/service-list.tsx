import ServiceCard from "@/components/ui/service-card";
import { Service } from "@/types";
import NoResults from "@/components/ui/no-results";

interface ServiceListProps {
  title: string;
  items: Service[];
}

const ServiceList: React.FC<ServiceListProps> = ({ title, items }) => {
  return (
    <div className="space-y-4 mt-5">
      <h3 className="font-bold text-2xl text-white">{title}</h3>
      {items.length === 0 && <NoResults />}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <ServiceCard key={item.id} data={item} />
        ))}
      </div>
    </div>
  );
};

export default ServiceList;
