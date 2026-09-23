 
import { TbArrowBigUpLines } from 'react-icons/tb';

const Banner = () => {
    return (
        <section className="relative overflow-hidden  px-4 py-16 sm:px-6 lg:px-8">
      
      {/* Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[270px] w-[650px] -translate-x-1/2 rounded-full bg-[#006B68]/30 blur-[100px]" />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">

        {/* Small Badge */}
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#2E9B45]/10 bg-[#2E9B45]/10 px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[#30ce52]" />

          <span className="text-[9px] font-semibold tracking-[0.08em] text-[#006B68] sm:text-[10px]">
            HOW MESSHUB WORKS
          </span>
        </div>

        {/* Main Heading */}
         <h2 className="text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
          Mess Management{" "}
          <span className="text-teal-600 underline decoration-teal-600 decoration-2 underline-offset-4">
            Made Simple.
          </span>
        </h2>

        {/* Description */}
        <p className="mt-5 max-w-2xl text-sm leading-6 text-[#173B3A]/70 sm:text-base">
          From finding a mess to closing the month, MessHub keeps everything
          organized in one place. Zero spreadsheet chaos, zero social friction.
        </p>

        {/* Floating Info Card */}
        <div className="mt-8 flex w-full max-w-[660px] flex-col items-center justify-between gap-4 rounded-2xl border border-[#006B68]/5 bg-white px-5 py-4 shadow-[0_10px_30px_rgba(23,59,58,0.10)] sm:flex-row sm:px-6">

          {/* Left Side */}
          <div className="flex items-center gap-4">

            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-green-700">
                <span className="text-[11px] font-bold text-white">
                  <TbArrowBigUpLines size={15} />
                </span>
              </div>

              <div className="text-left ">
                <p className="text-[11px] font-bold leading-none text-[#006B68]">
                   <span className='text-black'>Mess</span>Hub
                  <p className=' text-[8px] mt-1 text-green-500'>BETTER MEALS, HAPPIER TOGETHER</p>
                </p>
 
              </div>
            </div>

            {/* Divider */}
            <div className="hidden h-8 w-px bg-[#173B3A]/10 sm:block " />

            {/* Information */}
            <div className="text-left">
              <p className="text-[10px] font-bold text-[#006B68]">
                Transparent Living
              </p>

              <p className="mt-0.5 text-[9px] text-[#173B3A]/90 sm:text-[11px]">
                Bangladesh's Smartest Mess Suite
              </p>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">

            {/* Live Sync */}
            <div className="items-center gap-1.5 rounded-full bg-green-400 px-3 py-1">
              <span className=" w-1 rounded-full " />

              <span className="flex text-[8.5px] font-bold text-black ">
                Live Sync
              </span>
            </div>

            {/* Zero */}
            <div className="flex items-center gap-1.5 rounded-full bg-[#FF8A00]/30 px-3 py-1">
              <span className=" text-[9px] font-bold text-black">
                Zero
              </span>
                <span className='text-[9px]'>টাকা</span>
            </div>

          </div>
        </div>
      </div>
    </section>
    );
};

export default Banner;