import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Heart,
  Award,
  Users,
  Sparkles,
  Star,
  Leaf,
  Truck,
} from "lucide-react";

export const About = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Enhanced */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-primary/40 to-gray-100/60 dark:from-gray-900 dark:via-primary/40 dark:to-gray-800/60"></div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>

        <div className="relative container mx-auto px-4 z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 mb-8">
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
              <span className="flex items-center gap-2 text-sm font-semibold text-primary tracking-wider uppercase">
                <Sparkles className="h-4 w-4" />
                Our Story
              </span>
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 text-gray-900 dark:text-white">
              More Than Just{" "}
              <span className="relative">
                <span className="relative z-10 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                  Food
                </span>
                <span className="absolute -bottom-2 left-0 right-0 h-3 bg-primary/20 -rotate-1"></span>
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto mb-12">
              Since 2020, we've been serving Manchester's finest burgers and ice
              cream, blending culinary excellence with community spirit.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {[2020, 5000, 4.9, 100].map((value, index) => (
                <div
                  key={index}
                  className="text-center p-4 rounded-2xl bg-gradient-to-b from-white dark:from-gray-900 to-primary/5 border border-primary/10"
                >
                  <div className="text-2xl font-bold text-primary mb-1">
                    {index === 2 ? `${value}★` : value.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {
                      [
                        "Established",
                        "Happy Customers",
                        "Avg Rating",
                        "Local Suppliers",
                      ][index]
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section - Enhanced */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent"></div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              The{" "}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Burg N Ice
              </span>{" "}
              Difference
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              What sets us apart in Manchester's vibrant food scene
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Leaf,
                title: "Farm Fresh",
                description:
                  "All ingredients sourced daily from local Manchester farms and suppliers.",
                color: "text-green-500",
                bgColor: "bg-green-500/10",
              },
              {
                icon: Heart,
                title: "Handcrafted",
                description:
                  "Every burger patty is shaped by hand, every ice cream batch is churned fresh.",
                color: "text-pink-500",
                bgColor: "bg-pink-500/10",
              },
              {
                icon: Award,
                title: "Award Winning",
                description:
                  "Recognized as Manchester's top burger joint in 2023 Food Awards.",
                color: "text-amber-500",
                bgColor: "bg-amber-500/10",
              },
              {
                icon: Users,
                title: "Community First",
                description:
                  "We support local charities and host monthly community events.",
                color: "text-blue-500",
                bgColor: "bg-blue-500/10",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="relative group overflow-hidden bg-gradient-to-b from-white dark:from-gray-900 to-primary/5 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:scale-105 rounded-xl border border-gray-200 dark:border-gray-800"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-8">
                  <div
                    className={`w-20 h-20 ${value.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <value.icon className={`h-10 w-10 ${value.color}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-center text-gray-900 dark:text-white">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-center">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section - Enhanced */}
      <section className="py-24 bg-gradient-to-b from-primary/30 to-transparent relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="lg:w-1/2">
                <div className="sticky top-24">
                  <div className="inline-flex items-center gap-3 mb-6">
                    <div className="w-8 h-px bg-gradient-to-r from-primary to-transparent"></div>
                    <span className="text-sm font-semibold text-primary tracking-wider uppercase">
                      Our Journey
                    </span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900 dark:text-white">
                    From Passion to{" "}
                    <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      Plate
                    </span>
                  </h2>
                </div>
              </div>

              <div className="lg:w-1/2 space-y-8">
                <div className="relative pl-8 border-l-2 border-primary/30">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 bg-primary rounded-full"></div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                    The Beginning
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Burg N Ice started as a dream between two friends passionate
                    about Manchester's food scene. What began as weekend pop-ups
                    at local markets quickly gained a loyal following.
                  </p>
                </div>

                <div className="relative pl-8 border-l-2 border-primary/30">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 bg-primary rounded-full"></div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                    First Location
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    In 2020, we opened our doors on Deansgate. The response was
                    overwhelming, proving Manchester was ready for premium
                    burgers and artisanal ice cream.
                  </p>
                </div>

                <div className="relative pl-8 border-l-2 border-primary/30">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 bg-primary rounded-full"></div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                    Community Growth
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We've grown with Manchester, supporting local suppliers and
                    becoming a staple in the community. Our commitment to
                    quality has remained unchanged.
                  </p>
                </div>

                <div className="relative pl-8 border-l-2 border-primary/30">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 bg-primary rounded-full"></div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                    Looking Ahead
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Today, we continue to innovate while staying true to our
                    roots. Every day brings new opportunities to delight our
                    customers with exceptional food.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section - Enhanced (Without Map) */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                <span className="text-sm font-semibold text-primary tracking-wider uppercase">
                  Visit Us
                </span>
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                Experience{" "}
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Manchester's Finest
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Find us at our Deansgate location - complete with parking,
                accessibility, and outdoor seating
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-gradient-to-br from-white dark:from-gray-900 to-primary/10 shadow-2xl overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
                <div className="p-12">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Our Flagship Location
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Heart of Manchester
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Address
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-lg">
                        123 Deansgate
                        <br />
                        Manchester M3 2BQ
                        <br />
                        United Kingdom
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Opening Hours
                      </h4>
                      <div className="space-y-2">
                        {[
                          {
                            days: "Monday - Thursday",
                            hours: "11:00 AM - 10:00 PM",
                          },
                          {
                            days: "Friday - Saturday",
                            hours: "11:00 AM - 11:00 PM",
                          },
                          { days: "Sunday", hours: "12:00 PM - 9:00 PM" },
                        ].map((schedule, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-800/50"
                          >
                            <span className="text-gray-600 dark:text-gray-400">
                              {schedule.days}
                            </span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {schedule.hours}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Amenities
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {[
                          "Parking Available",
                          "Wheelchair Accessible",
                          "Outdoor Seating",
                          "Free WiFi",
                          "Family Friendly",
                          "Takeaway",
                        ].map((amenity, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
                          >
                            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white dark:from-gray-900 to-primary/10 shadow-2xl overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
                <div className="p-12">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Get In Touch
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        We'd love to hear from you
                      </p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                        Contact Information
                      </h4>
                      <div className="space-y-4">
                        <a
                          href="tel:+441612345678"
                          className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-white dark:from-gray-900 to-primary/5 border border-primary/10 hover:border-primary/30 transition-all duration-300 group"
                        >
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Phone className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 dark:text-white">
                              Phone
                            </div>
                            <div className="text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors">
                              +44 161 234 5678
                            </div>
                          </div>
                        </a>

                        <a
                          href="mailto:hello@burgnice.co.uk"
                          className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-white dark:from-gray-900 to-primary/5 border border-primary/10 hover:border-primary/30 transition-all duration-300 group"
                        >
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Mail className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 dark:text-white">
                              Email
                            </div>
                            <div className="text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors">
                              hello@burgnice.co.uk
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                        Special Requests
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        Planning a large event, corporate catering, or have
                        special dietary requirements? Contact us directly and
                        we'll create a custom solution just for you.
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Truck className="h-4 w-4 text-primary" />
                        <span>Catering available for events of 20+ people</span>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                        Transport Links
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { name: "Deansgate Tram", distance: "2 min walk" },
                          { name: "Deansgate Train", distance: "5 min walk" },
                          { name: "Bus Stops", distance: "Multiple nearby" },
                          { name: "Parking", distance: "NCP 3 min walk" },
                        ].map((transport, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-lg bg-gray-100/50 dark:bg-gray-800/50"
                          >
                            <div className="font-medium text-gray-900 dark:text-white">
                              {transport.name}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {transport.distance}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-16 text-center">
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                Can't make it in person? Check out our full menu online and get
                delivery straight to your door!
              </p>
              <a
                href="/menu"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-primary/80 text-white rounded-full font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <span>Order Online Now</span>
                <span className="animate-bounce">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
