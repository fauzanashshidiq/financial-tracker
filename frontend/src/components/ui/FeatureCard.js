import Card from "./Card";

const FeatureCard = ({ icon: Icon, title, description }) => (
  <Card className="text-center">
    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
      <Icon className="w-8 h-8 text-blue-600" />
    </div>
    <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </Card>
);

export default FeatureCard;
