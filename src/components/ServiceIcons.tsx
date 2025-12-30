import { Clock, Leaf, Truck, Zap } from "lucide-react";

const services = [
  { icon: Zap, title: "Fast Service", description: "30 mins or less" },
  { icon: Truck, title: "Delivery/Pick-up", description: "Free over £15" },
  { icon: Clock, title: "Open Late", description: "Until 11pm" },
];

export const ServiceIcons = () => {
  return (
    <section className="py-12 bg-white border-y border-gray-100">
      <div className="container items-center mx-auto px-4">
<div className="grid grid-cols-3 md:grid-cols-3 gap-6 md:gap-4 place-items-center">
  {services.map((service) => {
    const Icon = service.icon;
    return (
      <div
        key={service.title}
        className="flex flex-col items-center text-center"
      >
        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
          <Icon className="h-5 w-5 text-gray-700" />
        </div>
        <h3 className="font-medium text-gray-900 mb-1 text-sm">
          {service.title}
        </h3>
        <p className="text-xs text-gray-500">
          {service.description}
        </p>
      </div>
    );
  })}
</div>

      </div>
    </section>
  );
};