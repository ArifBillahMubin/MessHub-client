export const SUGGESTED_QUESTIONS = [
  "What is MessHub?",
  "How do I find a mess?",
  "How do I join a mess?",
  "What features does it have?",
  "Is MessHub free?",
  "How does pricing work?",
];

const LINKS = {
  home: { label: "Go to Home", to: "/" },
  find: { label: "Find a Mess", to: "/find-mess" },
  how: { label: "How It Works", to: "/how-it-works" },
  pricing: { label: "View Pricing", to: "/pricing" },
  about: { label: "About MessHub", to: "/about" },
  register: { label: "Create an Account", to: "/register" },
  login: { label: "Log In", to: "/login" },
};

const entries = [
  {
    id: "what",
    keywords: [
      "what is",
      "whats messhub",
      "what's messhub",
      "about messhub",
      "tell me about",
      "who are you",
      "introduce",
      "messhub",
      "this site",
      "this website",
      "platform",
    ],
    answer:
      "MessHub is a platform that makes shared living simpler for students, bachelors, and job holders in Bangladesh. You can find a mess, join one, or create your own — then manage meals, bazar, expenses, payments, and monthly settlements in one place. Tagline: Better Meals, Happier Together.",
    links: [LINKS.about, LINKS.how, LINKS.register],
  },
  {
    id: "find",
    keywords: [
      "find a mess",
      "find mess",
      "search mess",
      "browse",
      "vacancy",
      "available seat",
      "looking for mess",
      "map",
      "location",
      "nearby",
      "dhaka",
      "chattogram",
      "sylhet",
      "rajshahi",
    ],
    answer:
      "Use Find a Mess to browse verified bachelor flats. You can search by area, filter by mess type (student, job holder, mixed), room type, food type, facilities, and cost, or view listings on a map. Open a listing to see photos, vacancy details, and estimated monthly meal costs, then send a join request.",
    links: [LINKS.find, LINKS.how],
  },
  {
    id: "join",
    keywords: [
      "how do i join",
      "join a mess",
      "join mess",
      "join request",
      "show interest",
      "get confirmed",
      "mess code",
      "how to join",
    ],
    answer:
      "There are two ways to join. 1) Browse Find a Mess, open a listing, and send a digital join request to the manager. Chat, visit the flat, and lock your seat. 2) If you already have a mess code, create an account, go to the dashboard, and join with that code. After you are accepted you can log meals, share expenses, and settle monthly accounts.",
    links: [LINKS.find, LINKS.register, LINKS.how],
  },
  {
    id: "create",
    keywords: [
      "create mess",
      "create a mess",
      "start a mess",
      "new mess",
      "become manager",
      "open a mess",
    ],
    answer:
      "Create a free account, open the dashboard, and use Create Mess. You become the mess manager and can add members, post vacant seats publicly, track meals and bazar, and close each month with automatic calculations.",
    links: [LINKS.register, LINKS.how],
  },
  {
    id: "features",
    keywords: [
      "feature",
      "what can",
      "what does",
      "capabilities",
      "tools",
      "meal",
      "bazar",
      "expense",
      "settlement",
      "report",
      "chat",
      "payment",
      "member",
    ],
    answer:
      "Core features: Daily meal tracking (on/off before 10 AM), bazar records with receipts, shared expenses (rent, wifi, gas, cook salary), member and vacant-seat management, payment tracking, automatic monthly settlement, monthly reports (including email), mess group chat, polls, announcements, and public recruitment of new members.",
    links: [LINKS.how, LINKS.pricing],
  },
  {
    id: "how",
    keywords: [
      "how it works",
      "how does it work",
      "steps",
      "process",
      "getting started",
      "get started",
    ],
    answer:
      "Four steps: 1) Find a Mess — browse verified listings with photos, vacancy, and meal cost estimates. 2) Show Interest — send a join request with your profile. 3) Get Confirmed — chat with the manager, visit, and lock your seat. 4) Join the Mess — log meals, upload bazar slips, and settle monthly accounts on MessHub.",
    links: [LINKS.how, LINKS.find, LINKS.register],
  },
  {
    id: "pricing",
    keywords: [
      "price",
      "pricing",
      "plan",
      "cost",
      "paid",
      "subscription",
      "free",
      "standard",
      "custom",
      "how much",
      "charge",
      "fee",
    ],
    answer:
      "Plans are based on active members only (former members do not count). Free (1–8 members): full mess management — meals, bazar, expenses, payments, settlement, group chat, public recruitment, and monthly reports. Standard (9–12 members): paid plan managed by MessHub, up to 12 members, multi-manager support, and custom expense splits. Custom (13+ members): tailored for large messes, hostels, and halls — contact support.",
    links: [LINKS.pricing, LINKS.register],
  },
  {
    id: "free",
    keywords: ["is it free", "free forever", "without paying", "no cost"],
    answer:
      "Yes. The Free plan is free forever for messes with 1–8 active members and includes the core tools: meals, bazar, expenses, payments, settlement, chat, recruitment, and monthly reports. Larger messes move to Standard (9–12) or Custom (13+).",
    links: [LINKS.pricing, LINKS.register],
  },
  {
    id: "who",
    keywords: [
      "who is it for",
      "who can",
      "student",
      "bachelor",
      "job holder",
      "hostel",
      "audience",
    ],
    answer:
      "MessHub is built for Bangladeshi students, bachelors, and job holders who share a mess or hostel. It also works for university hostels, hall wings, and larger shared housing that need custom plans. We serve Dhaka, Chattogram, Sylhet, Rajshahi, and nationwide.",
    links: [LINKS.about, LINKS.find],
  },
  {
    id: "roles",
    keywords: ["manager", "member", "admin", "role", "super admin"],
    answer:
      "There are three main roles. Members log meals, view calculations, pay dues, and use group chat. Managers run the mess: approve join requests, edit meals, record bazar and expenses, close the month, and post vacant seats. Super admins moderate the platform (users, messes, posts, and reports).",
    links: [LINKS.how],
  },
  {
    id: "account",
    keywords: [
      "register",
      "sign up",
      "signup",
      "create account",
      "login",
      "log in",
      "sign in",
      "account",
    ],
    answer:
      "Create a free account from Register (email or social login). Then you can find a mess, send join requests, or create your own mess from the dashboard. Already have an account? Use Log In.",
    links: [LINKS.register, LINKS.login],
  },
  {
    id: "contact",
    keywords: ["contact", "support", "email", "phone", "help", "talk"],
    answer:
      "For plan questions or support, email support@messhub.com. You can also use the contact section on the Pricing page. MessHub serves bachelors across Bangladesh.",
    links: [LINKS.pricing, LINKS.about],
  },
  {
    id: "meals",
    keywords: ["meal rate", "on off", "10 am", "food", "cook"],
    answer:
      "Managers and members track daily meals from the monthly portal. Turn meals on or off (typically before 10 AM) so food is not wasted. MessHub counts meals, computes the meal rate, and includes it in each member’s monthly settlement.",
    links: [LINKS.how],
  },
  {
    id: "settlement",
    keywords: ["close the month", "monthly", "dues", "balance", "owe"],
    answer:
      "At month end, MessHub calculates each member’s meal costs, shared expenses, payments, and final balance so everyone can see who owes what. Managers can generate monthly reports and keep cloud records of past months.",
    links: [LINKS.how, LINKS.pricing],
  },
];

const greetings = ["hi", "hello", "hey", "salam", "assalam", "good morning", "good evening", "yo"];
const thanks = ["thank", "thanks", "thx", "appreciate"];

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s+]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getBotReply(rawInput) {
  const input = normalize(rawInput);
  if (!input) {
    return {
      answer: "Ask me anything about MessHub — finding a mess, joining, features, or pricing.",
      links: [],
    };
  }

  if (greetings.some((g) => input === g || input.startsWith(`${g} `))) {
    return {
      answer:
        "Hi! I am the MessHub guide. I can explain how the site works, how to find or join a mess, features, and pricing. What would you like to know?",
      links: [LINKS.find, LINKS.how, LINKS.pricing],
    };
  }

  if (thanks.some((t) => input.includes(t))) {
    return {
      answer: "Glad I could help. Browse Find a Mess or create a free account whenever you are ready.",
      links: [LINKS.find, LINKS.register],
    };
  }

  let best = null;
  let bestScore = 0;

  for (const entry of entries) {
    let score = 0;
    for (const keyword of entry.keywords) {
      if (input.includes(keyword)) {
        score += keyword.split(" ").length + 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  if (best && bestScore > 0) {
    return { answer: best.answer, links: best.links };
  }

  return {
    answer:
      "I can help visitors understand MessHub. Try asking about what MessHub is, how to find or join a mess, features, pricing, or how to create an account. For personal account issues, email support@messhub.com.",
    links: [LINKS.how, LINKS.pricing, LINKS.find],
  };
}

export const WELCOME_MESSAGE = {
  answer:
    "Welcome to MessHub — Better Meals, Happier Together. I can help you understand this site: finding a mess, joining or creating one, features, and pricing. Pick a question or type your own.",
  links: [LINKS.find, LINKS.how, LINKS.pricing],
};
