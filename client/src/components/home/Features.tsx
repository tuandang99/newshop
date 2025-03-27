import { LeafIcon, TruckIcon, RecycleIcon } from "@/lib/icons";

export default function Features() {
  const features = [
    {
      icon: <LeafIcon className="text-3xl text-primary" />,
      title: "100% Organic",
      description: "Our products are certified organic, sourced from trusted farmers who practice sustainable agriculture."
    },
    {
      icon: <TruckIcon className="text-3xl text-primary" />,
      title: "Free Shipping",
      description: "Enjoy free shipping on all orders over $50. We deliver fresh products right to your doorstep."
    },
    {
      icon: <RecycleIcon className="text-3xl text-primary" />,
      title: "Eco-Friendly",
      description: "We use sustainable packaging and practices to minimize our environmental footprint."
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="p-6 text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 font-poppins">{feature.title}</h3>
              <p className="text-neutral-700">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
