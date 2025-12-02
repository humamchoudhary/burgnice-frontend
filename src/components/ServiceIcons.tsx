import { Clock, Leaf, Truck, Zap } from "lucide-react";

const services = [
  { icon: Zap, title: "Fast Delivery", description: "Orders ready in 30 mins" },
  { icon: Leaf, title: "Locally Made", description: "Fresh from Manchester" },
  { icon: Truck, title: "Fresh Ingredients", description: "Quality guaranteed" },
  { icon: Clock, title: "Open Late", description: "Until 11 PM daily" },
];

export const ServiceIcons = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="flex flex-col items-center text-center group animate-fade-in transition-all duration-300 hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-md group-hover:shadow-xl">
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-foreground mb-1">{service.title}</h3>
                <p className="text-sm text-muted-foreground">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
