import { ChevronRight } from "lucide-react";

const CTASection = () => (
  <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
    <div className="container mx-auto px-6 text-center">
      <h2 className="text-4xl font-bold text-white mb-4">
        Ready to Take Control?
      </h2>
      <p className="text-xl text-blue-100 mb-8">
        Join thousands of users managing their finances smarter
      </p>
      <button variant="secondary" className="text-lg px-8 py-4">
        Start Free Trial <ChevronRight className="ml-2 w-5 h-5" />
      </button>
    </div>
  </section>
);

export default CTASection;
