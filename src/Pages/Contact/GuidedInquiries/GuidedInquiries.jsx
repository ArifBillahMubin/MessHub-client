import React, { useState } from "react";
import {
  MessageSquare,
  CircleHelp,
  CreditCard,
  Clock3,
  Send,
  LockKeyhole,
  ChevronDown,
} from "lucide-react";

const GuidedInquiries = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Form Submitted:", formData);

    alert("Your message has been submitted successfully!");
  };

  const inquiryCards = [
    {
      title: "General Questions",
      description:
        "Have questions about MessHub, flat onboarding, or how our communal ledger works?",
      badge: "Quick Inquiry",
      icon: MessageSquare,
      iconBg: "bg-[#005f5f]",
      badgeBg: "bg-[#c9f5f0]",
      badgeText: "text-[#006b65]",
    },
    {
      title: "Mess Support",
      description:
        "Need technical help with your active mess, meal cutoff schedules, or manager account?",
      badge: "Member & Manager",
      icon: CircleHelp,
      iconBg: "bg-[#008333]",
      badgeBg: "bg-[#c9f5c6]",
      badgeText: "text-[#08752d]",
    },
    {
      title: "Service Plans",
      description:
        "Interested in a Standard (9–12 members) or Custom plan for larger hostels and student halls?",
      badge: "Hostels & Halls",
      icon: CreditCard,
      iconBg: "bg-[#a95b00]",
      badgeBg: "bg-[#ffe0c1]",
      badgeText: "text-[#a65300]",
    },
  ];

  return (
    <section className="w-full bg-[#d9fbfa] px-5 py-12 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-start lg:gap-5">

        {/* =========================
            LEFT SIDE
        ========================== */}
        <div className="w-full lg:w-[41%]">

          {/* Small Heading */}
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.3px] text-[#087d73] -mt-45">
            GUIDED INQUIRIES
          </p>

          {/* Main Heading */}
          <h2 className="mb-1 text-[23px] font-medium leading-tight tracking-[-0.5px] text-[#005b5b]">
            How can we help?
          </h2>

          {/* Description */}
          <p className="mb-4 max-w-[360px] text-[12px] leading-[1.45] text-[#4b5a59]">
            Pick a category that best describes your inquiry so we can route
            your message to the right member support specialist immediately.
          </p>

          {/* Inquiry Cards */}
          <div className="space-y-2">

            {inquiryCards.map((card, index) => {
              const Icon = card.icon;

              return (
                <div
                  key={index}
                  className="rounded-[14px] bg-white px-3.5 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                >
                  <div className="flex gap-3">

                    {/* Icon */}
                    <div
                      className={`flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[10px] ${card.iconBg}`}
                    >
                      <Icon
                        size={21}
                        strokeWidth={1.8}
                        className="text-white"
                      />
                    </div>

                    {/* Card Content */}
                    <div className="min-w-0 flex-1">

                      {/* Title + Badge */}
                      <div className="mb-0.5 flex items-center justify-between gap-2">
                        <h3 className="text-[14px] font-semibold leading-tight text-[#183b3b]">
                          {card.title}
                        </h3>

                        <span
                          className={`shrink-0 rounded-full px-2 py-[3px] text-[9px] font-semibold ${card.badgeBg} ${card.badgeText}`}
                        >
                          {card.badge}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-[11.5px] leading-[1.4] text-[#5c6262]">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Prompt 24-Hour Attention */}
          <div className="mt-3 rounded-[13px] bg-[#cdf3f1] px-3.5 py-3.5">
            <div className="flex gap-2.5">

              {/* Clock */}
              <div className="pt-0.5">
                <Clock3
                  size={17}
                  strokeWidth={1.8}
                  className="text-[#006c6b]"
                />
              </div>

              <div>
                <h3 className="mb-0.5 text-[12px] font-semibold text-[#006464]">
                  Prompt 24-Hour Attention
                </h3>

                <p className="text-[11px] leading-[1.4] text-[#536060]">
                  We understand mess life moves fast, especially before
                  month-end settlement, daily bazar adjustments, and utility
                  bill splits.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =========================
            RIGHT SIDE FORM
        ========================== */}
        <div className="w-full rounded-[18px] bg-white px-6 py-7 shadow-[0_3px_8px_rgba(0,80,80,0.10)] sm:px-7 lg:w-[59%] -mt-45">

          {/* Form Heading */}
          <h2 className="mb-0.5 text-[21px] font-medium leading-tight tracking-[-0.4px] text-[#005b5b]">
            Send us a message
          </h2>

          <p className="mb-4 text-[11.5px] text-[#5a6261]">
            Fill out the form and tell us how we can help your flat run
            smoothly.
          </p>

          <form onSubmit={handleSubmit}>

            {/* =====================
                ROW 1
            ====================== */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-1 block text-[11px] font-semibold text-[#173d3d]"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>

                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Tanvir Ahmed or Arif Billah"
                  required
                  className="h-[42px] w-full rounded-[7px] border-0 bg-[#d3f6f4] px-3.5 text-[11px] text-[#173d3d] outline-none placeholder:text-[#88a5a4] focus:ring-2 focus:ring-[#64cfca]"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-[11px] font-semibold text-[#173d3d]"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="h-[42px] w-full rounded-[7px] border-0 bg-[#d3f6f4] px-3.5 text-[11px] text-[#173d3d] outline-none placeholder:text-[#88a5a4] focus:ring-2 focus:ring-[#64cfca]"
                />
              </div>
            </div>

            {/* =====================
                ROW 2
            ====================== */}
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-1 block text-[11px] font-semibold text-[#173d3d]"
                >
                  Phone Number
                </label>

                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+880 17XX-XXXXXX (Optional)"
                  className="h-[42px] w-full rounded-[7px] border-0 bg-[#d3f6f4] px-3.5 text-[11px] text-[#173d3d] outline-none placeholder:text-[#88a5a4] focus:ring-2 focus:ring-[#64cfca]"
                />
              </div>

              {/* Subject */}
              <div>
                <label
                  htmlFor="subject"
                  className="mb-1 block text-[11px] font-semibold text-[#173d3d]"
                >
                  Subject <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="h-[42px] w-full appearance-none rounded-[7px] border-0 bg-[#d3f6f4] px-3.5 pr-9 text-[11px] text-[#173d3d] outline-none focus:ring-2 focus:ring-[#64cfca]"
                  >
                    <option value="" disabled>
                      Choose inquiry subject
                    </option>
                    <option value="general">
                      General Questions
                    </option>
                    <option value="support">
                      Mess Support
                    </option>
                    <option value="plans">
                      Service Plans
                    </option>
                    <option value="billing">
                      Billing &amp; Reconciliation
                    </option>
                  </select>

                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#174d4d]"
                  />
                </div>
              </div>
            </div>

            {/* =====================
                MESSAGE
            ====================== */}
            <div className="mt-3">
              <label
                htmlFor="message"
                className="mb-1 block text-[11px] font-semibold text-[#173d3d]"
              >
                Message <span className="text-red-500">*</span>
              </label>

              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                placeholder="Tell us about your mess, your question, or any specific help you need with meals, bazar ledger, or manager handover..."
                className="w-full resize-none rounded-[7px] border-0 bg-[#d3f6f4] px-3.5 py-3 text-[11px] leading-[1.45] text-[#173d3d] outline-none placeholder:text-[#88a5a4] focus:ring-2 focus:ring-[#64cfca]"
              />
            </div>

            {/* =====================
                SUBMIT
            ====================== */}
            <div className="mt-4">
              <button
                type="submit"
                className="flex h-[42px] items-center gap-2 rounded-[9px] bg-[#007d79] px-7 text-[11px] font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#006b68] hover:shadow-md active:scale-[0.98]"
              >
                <span>Send Message</span>

                <Send
                  size={14}
                  strokeWidth={1.8}
                />
              </button>
            </div>

            {/* Privacy Notice */}
            <div className="mt-2 flex items-start gap-1.5">
              <LockKeyhole
                size={13}
                strokeWidth={1.8}
                className="mt-[1px] shrink-0 text-[#16764f]"
              />

              <p className="text-[10.5px] leading-[1.4] text-[#596161]">
                We'll use your information only to respond to your request.
                No spam, ever.
              </p>
            </div>

          </form>
        </div>
      </div>
    </section>
  );
};

export default GuidedInquiries;