import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Categories from "@/components/home/Categories";
import Products from "@/components/home/Products";
import About from "@/components/home/About";
import Testimonials from "@/components/home/Testimonials";
import BlogPreview from "@/components/home/BlogPreview";
import Newsletter from "@/components/home/Newsletter";
import { Helmet } from "react-helmet";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>NatureNutri - Healthy Food Store</title>
        <meta name="description" content="Premium organic foods for a healthier lifestyle. Discover our selection of nuts, granola bars, cereals, and superfoods." />
      </Helmet>
      
      <Hero />
      <Features />
      <Categories />
      <Products />
      <About />
      <Testimonials />
      <BlogPreview />
      <Newsletter />
      <section className="py-12 bg-neutral-100">
        <div className="container mx-auto px-4">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0508861457474!2d-122.4194155!3d37.774929!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808580991c07f23d%3A0x37fa7ebeeceaa849!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1626899296618!5m2!1sen!2sus" 
              width="100%" 
              height="450" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy"
              title="Location Map"
            ></iframe>
          </div>
        </div>
      </section>
    </>
  );
}
