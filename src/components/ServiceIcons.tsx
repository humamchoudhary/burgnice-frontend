import { Clock, Leaf, Truck, Zap } from "lucide-react";

const services = [
  { icon: Zap, title: "Fast Service", description: "Ready in 30 mins" },
  { icon: Leaf, title: "Locally Sourced", description: "Fresh from Manchester" },
  { icon: Truck, title: "Free Delivery", description: "Over £15 orders" },
  { icon: Clock, title: "Open Late", description: "Until 11 PM daily" },
];

export const ServiceIcons = () => {
  return (
    <section className="py-16 bg-background border-b border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                  <Icon className="h-8 w-8 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-bold text-foreground mb-1 text-lg">{service.title}</h3>
                <p className="text-sm text-muted-foreground">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};