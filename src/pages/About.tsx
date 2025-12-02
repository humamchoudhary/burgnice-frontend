import { MapPin, Clock, Phone, Mail, Heart, Award, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const About = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background via-accent/30 to-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">About Burg N Ice</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Serving Manchester's finest burgers and ice cream since 2020. Our passion for quality ingredients and exceptional taste drives everything we do.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-foreground">What Makes Us Special</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">Made with Love</h3>
                <p className="text-muted-foreground">Every burger is crafted with care using the finest locally-sourced ingredients.</p>
              </CardContent>
            </Card>

            <Card className="text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">Award Winning</h3>
                <p className="text-muted-foreground">Recognized as one of Manchester's top burger spots by local food critics.</p>
              </CardContent>
            </Card>

            <Card className="text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">Community First</h3>
                <p className="text-muted-foreground">We're proud to be part of the Manchester community, supporting local suppliers.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-foreground">Our Story</h2>
            <div className="prose prose-lg mx-auto text-muted-foreground space-y-4">
              <p>
                Burg N Ice was born from a simple idea: to create the perfect burger experience right here in Manchester. Our founders, lifelong friends who shared a passion for great food, spent years perfecting their recipes in a small kitchen.
              </p>
              <p>
                What started as weekend pop-ups quickly grew into something special. The response from the Manchester community was overwhelming, and in 2020, we opened our first location on Deansgate.
              </p>
              <p>
                Today, we're proud to serve hundreds of happy customers every week. From our signature burgers to our artisan ice cream, every item on our menu represents our commitment to quality, flavor, and the vibrant Manchester food scene we love.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-foreground">Visit Us</h2>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-6 text-foreground">Location & Hours</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-muted-foreground">123 Deansgate<br />Manchester M3 2BQ<br />United Kingdom</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Opening Hours</p>
                      <p className="text-muted-foreground">
                        Mon-Thu: 11:00 AM - 10:00 PM<br />
                        Fri-Sat: 11:00 AM - 11:00 PM<br />
                        Sunday: 12:00 PM - 9:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-6 text-foreground">Get in Touch</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <a href="tel:+441612345678" className="text-muted-foreground hover:text-primary transition-colors">
                        +44 161 234 5678
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Email</p>
                      <a href="mailto:hello@burgnice.co.uk" className="text-muted-foreground hover:text-primary transition-colors">
                        hello@burgnice.co.uk
                      </a>
                    </div>
                  </div>
                  <div className="pt-4">
                    <p className="text-sm text-muted-foreground">
                      Have questions or want to place a large order? Give us a call or send us an email. We'd love to hear from you!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map placeholder */}
          {/* <div className="mt-12 max-w-4xl mx-auto">
            <div className="aspect-video bg-accent rounded-2xl shadow-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2374.4461!2d-2.2481!3d53.4803!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487bb1bc96a0a0a5%3A0x0!2sDeansgate%2C%20Manchester!5e0!3m2!1sen!2suk!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Burg N Ice Location"
              />
            </div>
          </div> */}
        </div>
      </section>
    </div>
  );
};
