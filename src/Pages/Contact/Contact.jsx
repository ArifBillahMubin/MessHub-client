import React from 'react';
import HeroBanner from './HeroBanner';
import GuidedInquiries from './GuidedInquiries/GuidedInquiries';
import Support from './Support/Support';

const Contact = () => {
    return (
        <div className="">
            <HeroBanner></HeroBanner>
            <GuidedInquiries></GuidedInquiries>
            <Support></Support>
        </div>
    );
};

export default Contact;