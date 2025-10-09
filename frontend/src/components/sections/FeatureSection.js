import FeatureCard from "../ui/FeatureCard";
import {
  TrendingUp,
  PieChart,
  Bell,
  Shield,
  BarChart3,
  Download,
  Wallet,
} from "lucide-react";

const FeaturesSection = () => (
  <section id="features" className="py-20 bg-white">
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Powerful Features
        </h2>
        <p className="text-xl text-gray-600">
          Everything you need to manage your money effectively
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <FeatureCard
          icon={TrendingUp}
          title="Expense Tracking"
          description="Monitor your spending in real-time with smart categorization"
        />
        <FeatureCard
          icon={PieChart}
          title="Budget Planning"
          description="Set budgets and get insights on your spending patterns"
        />
        <FeatureCard
          icon={Bell}
          title="Smart Alerts"
          description="Never miss a bill with intelligent notifications"
        />
        <FeatureCard
          icon={Shield}
          title="Bank-Level Security"
          description="Your data is encrypted and protected 24/7"
        />
        <FeatureCard
          icon={BarChart3}
          title="Analytics"
          description="Beautiful charts and reports for better decisions"
        />
        <FeatureCard
          icon={Download}
          title="Export Data"
          description="Download your financial reports anytime"
        />
        <FeatureCard
          icon={Wallet}
          title="Multi-Account"
          description="Manage multiple accounts in one place"
        />
        <FeatureCard
          icon={TrendingUp}
          title="Goal Tracking"
          description="Set and achieve your financial goals"
        />
      </div>
    </div>
  </section>
);

export default FeaturesSection;
