import { Helmet } from "react-helmet";
import { LeafIcon, HeartIcon, SproutIcon, ShieldCheckIcon } from "@/lib/icons";

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Us - NatureNutri</title>
        <meta name="description" content="Learn about NatureNutri's mission to provide high-quality organic foods and our commitment to sustainability." />
      </Helmet>
      
      <section className="py-12 bg-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold font-poppins mb-4">About NatureNutri</h1>
          <p className="max-w-2xl mx-auto text-neutral-700">
            Our story, mission, and commitment to providing you with the highest quality organic foods.
          </p>
        </div>
      </section>
      
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <img 
                src="https://images.unsplash.com/photo-1607301405345-41e34312ba95?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80" 
                alt="NatureNutri founders" 
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="md:w-1/2 md:pl-12">
              <h2 className="text-3xl font-bold font-poppins mb-4">Our Story</h2>
              <p className="mb-4 text-neutral-700">
                NatureNutri was founded in 2015 by a group of health enthusiasts with a shared passion for nutritious, organic food.
                Our journey began with a simple belief: that healthy food should be delicious, accessible, and sustainable.
              </p>
              <p className="mb-4 text-neutral-700">
                After years of struggling to find high-quality organic foods that didn't compromise on taste, we decided to create 
                our own line of products that would meet our strict standards for nutrition, flavor, and environmental responsibility.
              </p>
              <p className="text-neutral-700">
                Today, NatureNutri has grown into a trusted brand offering a wide range of organic nuts, seeds, granola bars, cereals, 
                and superfoods. We continue to innovate and expand our product line, always staying true to our founding principles.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section id="values" className="py-12 bg-neutral-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-poppins mb-4">Our Values</h2>
            <p className="max-w-2xl mx-auto text-neutral-700">
              These core principles guide everything we do at NatureNutri.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <LeafIcon className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2 font-poppins">Quality</h3>
              <p className="text-neutral-700">
                We source only the highest quality organic ingredients, ensuring that every product meets our strict standards.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <HeartIcon className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2 font-poppins">Health</h3>
              <p className="text-neutral-700">
                We believe in the power of nutritious food to improve lives and support well-being.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <SproutIcon className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2 font-poppins">Sustainability</h3>
              <p className="text-neutral-700">
                We are committed to sustainable farming practices and eco-friendly packaging solutions.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2 font-poppins">Transparency</h3>
              <p className="text-neutral-700">
                We believe in honest communication and being open about our ingredients and processes.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row-reverse items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pl-12">
              <img 
                src="https://images.unsplash.com/photo-1595356700395-6f14b5ea4fce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80" 
                alt="Sustainable farming" 
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="md:w-1/2 md:pr-12">
              <h2 className="text-3xl font-bold font-poppins mb-4">Our Commitment to Sustainability</h2>
              <p className="mb-4 text-neutral-700">
                At NatureNutri, sustainability is at the core of our business. We work directly with farmers who practice
                regenerative agriculture, helping to restore soil health and biodiversity.
              </p>
              <p className="mb-4 text-neutral-700">
                Our packaging is designed to minimize environmental impact. We use recyclable materials wherever possible,
                and we're continuously researching innovative solutions to reduce waste.
              </p>
              <p className="text-neutral-700">
                We also offset our carbon footprint by investing in reforestation projects and renewable energy initiatives.
                For us, being environmentally responsible isn't just good business—it's the right thing to do.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-12 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-poppins mb-4">Join Our Mission</h2>
          <p className="max-w-2xl mx-auto mb-8 text-neutral-700">
            Every time you choose NatureNutri, you're not just making a healthy choice for yourself—you're supporting
            sustainable farming practices and environmental conservation.
          </p>
          <p className="font-semibold text-primary text-lg">
            Thank you for being part of our journey towards a healthier planet.
          </p>
        </div>
      </section>
    </>
  );
}
