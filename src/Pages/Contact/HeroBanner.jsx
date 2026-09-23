
import HeroImage from "../../assets/ContactPage/HeroImage.png";

const HeroBanner = () => {
  return (
    <section className="min-h-screen bg-[#d9fbfa] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1180px] flex-col overflow-hidden rounded-[28px] bg-gradient-to-br from-[#fffdfb] via-[#fffdf9] to-[#efffea] shadow-sm lg:min-h-[350px] lg:flex-row">
        
        {/* Left Content */}
        <div className="flex w-full flex-col justify-center px-8 py-10 sm:px-10 lg:w-[58%] lg:px-9 xl:px-10">
          
          {/* Get In Touch Badge */}
          <div className="mb-6 flex w-fit items-center gap-2 rounded-full bg-[#cdf4f2] px-4 py-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#087443]"></span>

            <span className="text-[12px] font-semibold tracking-wide text-[#064f4f]">
              GET IN TOUCH
            </span>
          </div>

          {/* Heading */}
          <h2 className="mb-4 text-[40px] font-bold leading-none tracking-[-1.5px] text-[#005c5c] sm:text-[44px] lg:text-[46px]">
            Let’s Talk
          </h2>

          {/* Description */}
          <p className="mb-6 max-w-[650px] text-[16px] leading-[1.65] text-[#4b5353] sm:text-[17px]">
            Have a question about MessHub, need help with your mess, or want to know
            more about our service plans? We’re here to make shared living effortless
            and dispute-free.
          </p>

          {/* Information Pills */}
          <div className="flex flex-wrap gap-2.5">
            
            {/* Response */}
            <div className="flex items-center gap-2 rounded-full bg-[#cef5f2] px-4 py-1.5">
              <span className="flex h-[15px] w-[15px] items-center justify-center rounded-full border-[1.5px] border-[#07804c] text-[10px] font-bold text-[#07804c]">
                ✓
              </span>

              <span className="text-[12px] font-semibold text-[#173f3f]">
                Response in &lt; 24 hrs
              </span>
            </div>

            {/* Bilingual */}
            <div className="flex items-center gap-2 rounded-full bg-[#cef5f2] px-4 py-1.5">
              <span className="text-[14px] text-[#087c72]">
                ♧
              </span>

              <span className="text-[12px] font-semibold text-[#173f3f]">
                Bilingual Support (বাংলা &amp; English)
              </span>
            </div>

            {/* Reconciliation */}
            <div className="flex items-center gap-2 rounded-full bg-[#cef5f2] px-4 py-1.5">
              <span className="text-[14px] text-[#e68b00]">
                ▣
              </span>

              <span className="text-[12px] font-semibold text-[#173f3f]">
                Month-end Reconciliation Help
              </span>
            </div>

          </div>
        </div>

        {/* Right Image */}
        <div className="flex w-full items-center justify-center px-6 pb-8 lg:w-[42%] lg:px-6 lg:py-8">
          <div className="relative h-[260px] w-full max-w-[450px] overflow-hidden rounded-[18px] bg-[#c8f6f2] p-[18px] sm:h-[290px]">
            
            {/* Image */}
            <div className="relative h-full w-full overflow-hidden rounded-[13px]">
              <img
                src={HeroImage}
                alt="MessHub community living"
                className="h-full w-full object-cover"
              />

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>

              {/* Image Text */}
              <div className="absolute bottom-5 left-4 right-4">
                <p className="mb-1 text-[12px] font-semibold tracking-wide text-[#7dffca]">
                  COMMUNITY LIVING
                </p>

                <h3 className="text-[18px] font-medium leading-[1.25] text-white sm:text-[19px]">
                  Better meals, happier together — without the
                  <br className="hidden sm:block" />
                  ঝামেলা.
                </h3>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroBanner;