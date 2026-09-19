
import Navbar from '../../Shared/Navbar/Navbar';
import Banner from './Banner/Banner';
import CloseTheMonth from './CloseTheMonth/CloseTheMonth';
import FindMess from './FindMess/FindMess';
import FindRightPlace from './FindRightPlace/FindRightPlace';
import MessNeed from './MessNeed/MessNeed';



const HowItWorks = () => {
    return (
        <div>
            <Navbar></Navbar>
            <Banner></Banner>
            <FindMess></FindMess>
            <FindRightPlace></FindRightPlace>
            <MessNeed></MessNeed>
            <CloseTheMonth></CloseTheMonth>
            
            

        </div>
    );
};

export default HowItWorks;