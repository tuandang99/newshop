import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <section id="about" className="py-12 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="flex flex-col-reverse md:flex-row items-center">
          <div className="md:w-1/2 mt-8 md:mt-0 md:pr-8">
            <h2 className="text-3xl font-bold font-poppins mb-4">Our Story</h2>
            <p className="mb-4 text-neutral-700">
              At NatureNutri, we believe that good health starts with what you eat. 
              Founded in 2015, our mission has been to provide the highest quality organic 
              foods that nourish your body and support sustainable farming.
            </p>
            <p className="mb-6 text-neutral-700">
              Our team travels the world to source the finest ingredients from farmers who 
              share our commitment to organic practices and environmental stewardship. 
              Every product in our store is carefully selected to ensure it meets our high 
              standards for nutrition, taste, and sustainability.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="bg-primary text-white hover:bg-primary/90">
                <Link href="/about">About Us</Link>
              </Button>
              <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10">
                <Link href="/about#values">Our Values</Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1607301405345-41e34312ba95?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80" 
              alt="Organic farm" 
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
