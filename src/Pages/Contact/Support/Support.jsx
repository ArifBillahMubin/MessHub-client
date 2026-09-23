import React from "react";

import {
  Mail,
  Smartphone,
  MapPin,
  CircleHelp,
  ArrowRight,
} from "lucide-react";

const Support = () => {
  const supportCards = [
    {
      icon: Mail,
      title: "DIRECT SUPPORT INBOX",
      main: "support@messhub.com",
      description: "Average reply under 24 hrs",
    },
    {
      icon: Smartphone,
      title: "DIRECT PHONE DESK",
      main: "+880 1700–000000",
      description: "Available 10 AM – 8 PM (BST)",
    },
    {
      icon: MapPin,
      title: "COVERAGE AREA",
      main: "Bangladesh",
      description: "Dhaka, Chattogram, Sylhet & Nationwide",
    },
  ];

  return (
    <section className="w-full bg-[#d9fbfa] px-5 pb-8 pt-0 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">

        {/* =====================================
            SUPPORT INFORMATION CARDS
        ====================================== */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

          {supportCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <div
                key={index}
                className="
                  flex
                  min-h-[119px]
                  items-start
                  gap-3
                  rounded-[15px]
                  bg-white
                  px-5
                  py-5
                  shadow-[0_2px_5px_rgba(0,70,70,0.04)]
                "
              >
                {/* ICON */}
                <div
                  className="
                    flex
                    h-[42px]
                    w-[42px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-[10px]
                    bg-[#d1f5f3]
                  "
                >
                  <Icon
                    size={21}
                    strokeWidth={1.8}
                    className="text-[#006b6b]"
                  />
                </div>

                {/* CONTENT */}
                <div className="min-w-0 pt-0.5">
                  <p
                    className="
                      mb-1
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.3px]
                      text-[#3d4f4f]
                    "
                  >
                    {card.title}
                  </p>

                  <p
                    className="
                      mb-1
                      text-[15px]
                      font-medium
                      leading-tight
                      text-[#163f3f]
                    "
                  >
                    {card.main}
                  </p>

                  <p
                    className="
                      text-[11px]
                      leading-[1.4]
                      text-[#626b6b]
                    "
                  >
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}

        </div>

        {/* =====================================
            QUICK ANSWERS
        ====================================== */}
        <div
          className="
            mt-7
            flex
            flex-col
            gap-5
            rounded-[17px]
            bg-[#cdf3f1]
            px-7
            py-6
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          {/* LEFT CONTENT */}
          <div className="flex items-start gap-3.5">

            {/* QUESTION ICON */}
            <div
              className="
                flex
                h-[42px]
                w-[42px]
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-white
              "
            >
              <CircleHelp
                size={19}
                strokeWidth={1.8}
                className="text-[#006b6b]"
              />
            </div>

            {/* TEXT */}
            <div>
              <h3
                className="
                  mb-1
                  text-[16px]
                  font-medium
                  leading-tight
                  text-[#006363]
                "
              >
                Looking for quick answers?
              </h3>

              <p
                className="
                  max-w-[620px]
                  text-[11.5px]
                  leading-[1.45]
                  text-[#536161]
                "
              >
                Find answers to common questions about meal cutoff rules,
                bazar split formulas, and pricing plans before submitting a
                ticket.
              </p>
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="button"
            className="
              flex
              h-[40px]
              shrink-0
              items-center
              justify-center
              gap-1.5
              rounded-full
              bg-white
              px-6
              text-[11px]
              font-semibold
              text-[#005f5f]
              transition
              hover:bg-[#f5ffff]
            "
          >
            <a href="how-it-works">
              <span>View How It Works</span>
            </a>

            <ArrowRight
              size={14}
              strokeWidth={2}
            />
          </button>
        </div>

        {/* =====================================
            FINAL CTA
        ====================================== */}
        <div
          className="
            mt-7
            rounded-[18px]
            bg-gradient-to-r
            from-[#f4f9f7]
            via-white
            to-[#fffaf7]
            px-6
            py-10
            text-center
            shadow-[0_2px_6px_rgba(0,70,70,0.03)]
            sm:px-10
            lg:py-11
          "
        >
          {/* LABEL */}
          <p
            className="
              mb-3
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.4px]
              text-[#08774d]
            "
          >
            JOIN 1,200+ SMART FLATS
          </p>

          {/* HEADING */}
          <h2
            className="
              mb-2
              text-[25px]
              font-semibold
              leading-tight
              tracking-[-0.8px]
              text-[#005b5b]
              sm:text-[27px]
            "
          >
            Ready to make mess management simpler?
          </h2>

          {/* DESCRIPTION */}
          <p
            className="
              mx-auto
              mb-3
              max-w-[580px]
              text-[13px]
              leading-[1.55]
              text-[#566161]
            "
          >
            Explore MessHub and discover a modern, transparent way to manage
            meals, bazar accounting, and flatmate harmony.
          </p>

          {/* BUTTONS */}
          <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">

            <a
  href="/register"
  className="
    inline-flex
    items-center
    justify-center
    h-[43px]
    min-w-[126px]
    rounded-full
    bg-[#007d79]
    px-6
    text-[11px]
    font-semibold
    text-white
    shadow-[0_3px_6px_rgba(0,100,100,0.15)]
    transition
    hover:bg-[#006b68]
  "
>
  Get Started
</a>

            <a
  href="/find-mess"
  className="
    h-[43px]
    min-w-[126px]
    inline-flex
    items-center
    justify-center
    rounded-full
    bg-[#cff5f3]
    px-6
    text-[11px]
    font-semibold
    text-[#006765]
    transition
    hover:bg-[#bcecea]
  "
>
  Find a Mess
</a>

          </div>
        </div>

      </div>
    </section>
  );
};

export default Support;