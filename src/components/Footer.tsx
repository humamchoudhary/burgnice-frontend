import { MapPin, Clock, Phone, Mail, Facebook, Instagram, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-secondary/30 to-secondary/50 border-t mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Location & Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-foreground">Location</h3>
            <div className="space-y-3 text-muted-foreground">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <p>123 Deansgate<br />Manchester M3 2BQ<br />United Kingdom</p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary" />
                <a href="tel:+441612345678" className="hover:text-primary transition-colors">
                  +44 161 234 5678
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary" />
                <a href="mailto:hello@burgnice.co.uk" className="hover:text-primary transition-colors">
                  hello@burgnice.co.uk
                </a>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-foreground">Opening Hours</h3>
            <div className="space-y-2 text-muted-foreground">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Mon - Thu</p>
                  <p>11:00 AM - 10:00 PM</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Fri - Sat</p>
                  <p>11:00 AM - 11:00 PM</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Sunday</p>
                  <p>12:00 PM - 9:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links & Quick Actions */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-foreground">Follow Us</h3>
            <div className="flex space-x-4 mb-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-background rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-md"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-background rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-md"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-background rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-md"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
            <div className="flex flex-col gap-2">
              <a
                href="tel:+441612345678"
                className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-300 font-medium shadow-md hover:shadow-lg"
              >
                <Phone className="h-4 w-4 mr-2" />
                Call Now
              </a>
            </div>
          </div>
        </div>
    <div className="text-center my-8">
  <h3 className="text-2xl font-bold mb-4 text-foreground">Find Us in Manchester</h3>
  <p className="text-muted-foreground max-w-2xl mx-auto">
    Located in the heart of Deansgate, easily accessible by tram, train, and bus. 
    Free parking available at the NCP just 3 minutes away.
  </p>
</div>
        {/* Map Section */}
        <div className="mt-12 rounded-lg overflow-hidden shadow-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2374.5582748747853!2d-2.2465654!3d53.4807593!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487bb1bc99999999%3A0x1234567890abcdef!2sDeansgate%2C%20Manchester!5e0!3m2!1sen!2suk!4v1234567890"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Burg N Ice Location in Manchester"
          />
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Burg N Ice. All rights reserved. Manchester's finest burgers & ice cream.</p>
        </div>
      </div>
    </footer>
  );
};
