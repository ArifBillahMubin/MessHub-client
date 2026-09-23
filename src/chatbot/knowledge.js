export const SUGGESTED_QUESTIONS = [
  "What is MessHub?",
  "How do I find a mess?",
  "How do I join a mess?",
  "What features does it have?",
  "Is MessHub free?",
  "How does pricing work?",
]

export const PAGE_LINKS = {
  home: { label: "Go to Home", to: "/" },
  find: { label: "Find a Mess", to: "/find-mess" },
  how: { label: "How It Works", to: "/how-it-works" },
  pricing: { label: "View Pricing", to: "/pricing" },
  about: { label: "About MessHub", to: "/about" },
  register: { label: "Create an Account", to: "/register" },
  login: { label: "Log In", to: "/login" },
}

export const WELCOME_MESSAGE = {
  answer:
    "Welcome to MessHub — Better Meals, Happier Together. Ask me anything about finding a mess, joining or creating one, features, or pricing.",
  links: [PAGE_LINKS.find, PAGE_LINKS.how, PAGE_LINKS.pricing],
}
