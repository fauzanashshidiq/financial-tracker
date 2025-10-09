import { TrendingUp, ChevronRight } from "lucide-react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import StatCard from "../ui/StatCard";

const HeroSection = () => (
  <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
            Take Control of Your <span className="text-blue-600">Finances</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Track expenses, manage budgets, and achieve your financial goals
            with our intuitive platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="flex items-center justify-center">
              Get Started Free <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
            <Button variant="secondary">Watch Demo</Button>
          </div>
          <div className="mt-8 flex items-center gap-8">
            <StatCard value="50K+" label="Active Users" />
            <StatCard value="$2M+" label="Tracked" />
            <StatCard value="4.9★" label="Rating" />
          </div>
        </div>

        <div className="md:w-1/2 flex justify-center">
          <div className="relative">
            <Card className="w-80 transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-gray-700">
                  Monthly Budget
                </span>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-2">
                $4,850
              </div>
              <div className="text-sm text-green-500 mb-4">
                ↑ 12% from last month
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
