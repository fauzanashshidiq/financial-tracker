import Card from "../ui/Card";

const Guide = () => (
  <section id="how-it-works" className="py-20 bg-gray-50">
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">How It Works</h2>
        <p className="text-xl text-gray-600">Get started in minutes</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <Card className="text-center relative">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
            1
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold mb-3 text-gray-800">Sign Up</div>
            <p className="text-gray-600">Create your free account in seconds</p>
          </div>
        </Card>

        <Card className="text-center relative">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
            2
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold mb-3 text-gray-800">
              Add Transactions
            </div>
            <p className="text-gray-600">
              Start tracking your income and expenses
            </p>
          </div>
        </Card>

        <Card className="text-center relative">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
            3
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold mb-3 text-gray-800">
              Get Insights
            </div>
            <p className="text-gray-600">View reports and achieve your goals</p>
          </div>
        </Card>
      </div>
    </div>
  </section>
);

export default Guide;
