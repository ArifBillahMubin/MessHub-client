import PricingPlans from "./PricingPlans";
import MemberThresholds from "./MemberThresholds";
import CoreFeatures from "./CoreFeatures";
import HostelCTA from "./HostelCTA";
import PricingFAQ from "./PricingFAQ";
import PricingSupport from "./PricingSupport";

const Pricing = () => {
  return (
    <div className="bg-white font-sans text-neutral">
      <PricingPlans />
      <MemberThresholds />
      <CoreFeatures />
      <HostelCTA />
      <PricingFAQ />
      <PricingSupport />
    </div>
  );
};

export default Pricing;