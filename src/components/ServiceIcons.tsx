import { Clock, Leaf, Truck, Zap } from "lucide-react";

const services = [
  { icon: Zap, title: "Fast Delivery", description: "Orders ready in 30 mins" },
  { icon: Leaf, title: "Locally Made", description: "Fresh from Manchester" },
  { icon: Truck, title: "Fresh Ingredients", description: "Quality guaranteed" },
  { icon: Clock, title: "Open Late", description: "Until 11 PM daily" },
];

export const ServiceIcons = () => {
  return (
    <section className="py-20 bg-secondary/5 border-y border-border/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="flex flex-col items-center text-center group animate-fade-in transition-all duration-300 hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-primary/50">
                  <Icon className="h-10 w-10 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-black text-foreground mb-1 text-lg">{service.title}</h3>
                <p className="text-sm text-muted-foreground">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};