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
    </>
  );
}
