import Banner from "../Banner/Banner";
import FeatureHighlights from "../FeatureHighlights/FeatureHighlights";
import HowItWorks from "../HowItWorks/HowItWorks";
import MessFeatures from "../MessFeatures/MessFeatures";
import MessListings from "../MessListings/MessListings";
import MonthlyReportPreview from "../MonthlyReportPreview/MonthlyReportPreview";
import HomeCTA from "../HomeCTA/HomeCTA";

const Home = () => {
    return (
        <div className="">
            <Banner></Banner>
            <FeatureHighlights></FeatureHighlights>
            <MessListings></MessListings>
            <HowItWorks></HowItWorks>
            <MessFeatures></MessFeatures>
            <MonthlyReportPreview></MonthlyReportPreview>
            <HomeCTA></HomeCTA>
        </div>
    );
};

export default Home;