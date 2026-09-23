// ======================================================
// MessHub Chatbot Knowledge Base
// ======================================================
//
// Basic:
// getBotReply("How do I find a mess?")
//
// With conversation context:
// getBotReply("what about 15?", {
//   lastIntent: "pricing",
// });
//
// ======================================================

/*
// ======================================================
// Suggested Questions
// ======================================================
//
export const SUGGESTED_QUESTIONS = [
  "What is MessHub?",
  "How do I find a mess?",
  "How do I join a mess?",
  "How do I create a mess?",
  "How does meal tracking work?",
  "How is monthly settlement calculated?",
  "Is MessHub free?",
  "How does pricing work?",
];


// ======================================================
// Navigation Links
// ======================================================

const LINKS = {
  home: {
    label: "Go to Home",
    to: "/",
  },

  find: {
    label: "Find a Mess",
    to: "/find-mess",
  },

  how: {
    label: "How It Works",
    to: "/how-it-works",
  },

  pricing: {
    label: "View Pricing",
    to: "/pricing",
  },

  about: {
    label: "About MessHub",
    to: "/about",
  },

  register: {
    label: "Create an Account",
    to: "/register",
  },

  login: {
    label: "Log In",
    to: "/login",
  },
};


// ======================================================
// Quick Actions
// ======================================================

export const CHATBOT_QUICK_ACTIONS = [
  {
    ...LINKS.find,
    icon: "search",
    type: "primary",
  },

  {
    ...LINKS.how,
    icon: "help-circle",
    type: "secondary",
  },

  {
    ...LINKS.pricing,
    icon: "credit-card",
    type: "secondary",
  },

  {
    ...LINKS.register,
    icon: "user-plus",
    type: "secondary",
  },
];


// ======================================================
// Follow-Up Suggestions
// ======================================================

const FOLLOW_UPS = {
  what: [
    "How does MessHub work?",
    "What features does MessHub have?",
    "Is MessHub free?",
  ],

  find: [
    "How do I join a mess?",
    "What can I see in a mess listing?",
    "Is MessHub free?",
  ],

  join: [
    "Can I join with a mess code?",
    "How do I find a mess?",
    "What happens after I join?",
  ],

  create: [
    "What can a manager do?",
    "How does monthly settlement work?",
    "Is MessHub free?",
  ],

  features: [
    "How does meal tracking work?",
    "How does monthly settlement work?",
    "What can a manager do?",
  ],

  how: [
    "How do I find a mess?",
    "How do I join a mess?",
    "How do I create a mess?",
  ],

  pricing: [
    "Is MessHub free?",
    "Which plan is for 10 members?",
    "Which plan is for 15 members?",
  ],

  free: [
    "What happens after 8 members?",
    "How does pricing work?",
    "What features are included?",
  ],

  who: [
    "How do I find a mess?",
    "Can I create my own mess?",
    "What features does MessHub have?",
  ],

  roles: [
    "What can a manager do?",
    "What can a member do?",
    "How do I create a mess?",
  ],

  account: [
    "How do I find a mess?",
    "How do I create a mess?",
    "How do I join with a mess code?",
  ],

  contact: [
    "How does pricing work?",
    "How do I create an account?",
    "What features does MessHub have?",
  ],

  meals: [
    "How is meal rate calculated?",
    "How does monthly settlement work?",
    "What other features are available?",
  ],

  settlement: [
    "How is meal rate calculated?",
    "What expenses are included?",
    "Can I view monthly reports?",
  ],
};


// ======================================================
// MessHub Knowledge
// ======================================================

const entries = [
  {
    id: "what",

    keywords: [
      "what is messhub",
      "whats messhub",
      "about messhub",
      "tell me about messhub",
      "messhub platform",
      "this website",

      // Banglish
      "messhub ki",
      "messhub somporke",
      "messhub ki kore",

      // Bangla
      "মেসহাব কি",
      "মেসহাব কী",
      "মেসহাব সম্পর্কে",
      "এই ওয়েবসাইট কি",
      "এই ওয়েবসাইট কি",
    ],

    answer:
      "MessHub is a platform that makes shared living simpler for students, bachelors, and job holders in Bangladesh. You can find a mess, join one, or create your own — then manage meals, bazar, expenses, payments, and monthly settlements in one place. Better Meals, Happier Together.",

    links: [
      LINKS.about,
      LINKS.how,
      LINKS.register,
    ],
  },


  // ====================================================
  // FIND MESS
  // ====================================================

  {
    id: "find",

    keywords: [
      "find a mess",
      "find mess",
      "search mess",
      "browse mess",
      "available seat",
      "empty seat",
      "looking for mess",
      "mess listing",
      "vacancy",
      "nearby mess",

      // Banglish
      "mess khujbo",
      "mess khujte chai",
      "mess khuje dao",
      "kivabe mess khujbo",
      "mess koi pabo",
      "mess kothay pabo",
      "khali seat",
      "seat khali",
      "seat available",
      "amar area te mess",
      "mess search korbo",

      // Bangla
      "মেস খুঁজবো",
      "মেস খুঁজব",
      "মেস খুঁজতে চাই",
      "মেস খুঁজে দাও",
      "মেস কোথায় পাব",
      "মেস কোথায় পাব",
      "খালি সিট",
      "সিট খালি",
    ],

    answer:
      "Use Find a Mess to browse verified bachelor flats. You can search by area, filter by mess type, room type, food type, facilities, and cost, or view listings on a map. Open a listing to see photos, vacancy details, and estimated monthly meal costs, then send a join request.",

    links: [
      LINKS.find,
      LINKS.how,
    ],
  },


  // ====================================================
  // JOIN
  // ====================================================

  {
    id: "join",

    keywords: [
      "how do i join",
      "join a mess",
      "join mess",
      "join request",
      "show interest",
      "mess code",
      "join with code",

      // Banglish
      "mess e join",
      "mess join korbo",
      "kivabe join korbo",
      "join kivabe",
      "mess code diye join",
      "join request kivabe dibo",
      "manager approve korbe kivabe",

      // Bangla
      "মেসে জয়েন",
      "মেসে জয়েন",
      "মেসে যোগ",
      "কিভাবে জয়েন",
      "কিভাবে জয়েন",
      "মেস কোড",
      "জয়েন রিকোয়েস্ট",
      "জয়েন রিকোয়েস্ট",
    ],

    answer:
      "There are two ways to join. 1) Browse Find a Mess, open a listing, and send a digital join request to the manager. Chat, visit the flat, and lock your seat. 2) If you already have a mess code, create an account, go to the dashboard, and join with that code. After you are accepted you can log meals, share expenses, and settle monthly accounts.",

    links: [
      LINKS.find,
      LINKS.register,
      LINKS.how,
    ],
  },


  // ====================================================
  // CREATE MESS
  // ====================================================

  {
    id: "create",

    keywords: [
      "create mess",
      "create a mess",
      "start a mess",
      "new mess",
      "become manager",
      "open a mess",

      // Banglish
      "mess banabo",
      "mess khulbo",
      "notun mess",
      "manager hobo",
      "kivabe mess create korbo",

      // Bangla
      "মেস তৈরি",
      "মেস বানাবো",
      "মেস খুলবো",
      "নতুন মেস",
      "ম্যানেজার হব",
    ],

    answer:
      "Create a free account, open the dashboard, and use Create Mess. You become the mess manager and can add members, post vacant seats publicly, track meals and bazar, and close each month with automatic calculations.",

    links: [
      LINKS.register,
      LINKS.how,
    ],
  },


  // ====================================================
  // FEATURES
  // ====================================================

  {
    id: "features",

    keywords: [
      "feature",
      "features",
      "what can messhub do",
      "what does messhub do",
      "capabilities",
      "tools",
      "group chat",
      "poll",
      "announcement",
      "bazar receipt",

      // Banglish
      "ki ki feature",
      "ki ki kora jay",
      "messhub diye ki kora jay",

      // Bangla
      "কি কি ফিচার",
      "কি কি করা যায়",
      "কি কি করা যায়",
      "মেসহাব দিয়ে কি করা যায়",
      "মেসহাব দিয়ে কি করা যায়",
    ],

    answer:
      "Core features include daily meal tracking, bazar records with receipts, shared expenses such as rent, Wi-Fi, gas and cook salary, member management, vacant-seat management, payment tracking, automatic monthly settlement, monthly reports, mess group chat, polls, announcements, and public recruitment of new members.",

    links: [
      LINKS.how,
      LINKS.pricing,
    ],
  },


  // ====================================================
  // HOW IT WORKS
  // ====================================================

  {
    id: "how",

    keywords: [
      "how it works",
      "how does it work",
      "getting started",
      "get started",
      "how to use messhub",

      // Banglish
      "kivabe kaj kore",
      "kivabe use korbo",
      "shuru korbo kivabe",

      // Bangla
      "কিভাবে কাজ করে",
      "কীভাবে কাজ করে",
      "কিভাবে ব্যবহার করব",
      "কীভাবে ব্যবহার করব",
    ],

    answer:
      "MessHub works in four main steps: 1) Find a Mess — browse listings with photos and vacancy information. 2) Show Interest — send a join request. 3) Get Confirmed — communicate with the manager and confirm your seat. 4) Join the Mess — manage meals, bazar, expenses, payments, and monthly settlement.",

    links: [
      LINKS.how,
      LINKS.find,
      LINKS.register,
    ],
  },


  // ====================================================
  // PRICING
  // ====================================================

  {
    id: "pricing",

    keywords: [
      "price",
      "pricing",
      "plan",
      "cost",
      "paid",
      "subscription",
      "standard plan",
      "custom plan",
      "how much",
      "charge",
      "fee",

      // Banglish
      "koto taka",
      "koto cost",
      "price koto",
      "plan koto",
      "khoroch koto",

      // Bangla
      "দাম",
      "মূল্য",
      "খরচ",
      "কত টাকা",
      "প্ল্যান",
      "সাবস্ক্রিপশন",
    ],

    answer:
      "Plans are based on active members only. Free is for 1–8 members. Standard is for 9–12 members. Custom is for 13+ members and is designed for larger messes, hostels, and halls.",

    links: [
      LINKS.pricing,
      LINKS.register,
    ],
  },


  // ====================================================
  // FREE PLAN
  // ====================================================

  {
    id: "free",

    keywords: [
      "is it free",
      "is messhub free",
      "free forever",
      "without paying",
      "no cost",
      "free plan",

      // Banglish
      "free naki",
      "messhub free",
      "taka lage na",

      // Bangla
      "ফ্রি",
      "বিনামূল্যে",
      "টাকা লাগে না",
      "মেসহাব ফ্রি",
    ],

    answer:
      "Yes. The Free plan is available for messes with 1–8 active members and includes the core mess-management tools such as meals, bazar, expenses, payments, settlement, chat, recruitment, and monthly reports.",

    links: [
      LINKS.pricing,
      LINKS.register,
    ],
  },


  // ====================================================
  // WHO IS MESSHUB FOR?
  // ====================================================

  {
    id: "who",

    keywords: [
      "who is it for",
      "who can use messhub",
      "student",
      "bachelor",
      "job holder",
      "hostel",
      "university hostel",

      // Banglish
      "kara use korte parbe",
      "student der jonno",
      "bachelor der jonno",

      // Bangla
      "কারা ব্যবহার করতে পারবে",
      "স্টুডেন্টদের জন্য",
      "ব্যাচেলরদের জন্য",
    ],

    answer:
      "MessHub is built for Bangladeshi students, bachelors, and job holders who live in shared housing or messes. It can also support larger shared housing such as hostels and halls through custom plans.",

    links: [
      LINKS.about,
      LINKS.find,
    ],
  },


  // ====================================================
  // ROLES
  // ====================================================

  {
    id: "roles",

    keywords: [
      "manager",
      "member role",
      "admin role",
      "super admin",
      "what can manager do",
      "what can member do",

      // Banglish
      "manager ki korte pare",
      "member ki korte pare",
      "manager er kaj",

      // Bangla
      "ম্যানেজার কি করতে পারে",
      "মেম্বার কি করতে পারে",
      "ম্যানেজারের কাজ",
    ],

    answer:
      "Members can log meals, view calculations, pay dues, and use mess communication tools. Managers can approve join requests, manage meals, record bazar and expenses, manage members, close the month, and post vacant seats. Super admins moderate the overall platform.",

    links: [
      LINKS.how,
    ],
  },


  // ====================================================
  // ACCOUNT
  // ====================================================

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

      // Banglish
      "account khulbo",
      "register korbo",
      "login korbo",
      "kivabe account khulbo",

      // Bangla
      "রেজিস্টার",
      "রেজিস্ট্রেশন",
      "একাউন্ট",
      "অ্যাকাউন্ট",
      "লগইন",
    ],

    answer:
      "Create a free account from Register. After registration you can find a mess, send join requests, or create your own mess from the dashboard. If you already have an account, use Log In.",

    links: [
      LINKS.register,
      LINKS.login,
    ],
  },


  // ====================================================
  // CONTACT
  // ====================================================

  {
    id: "contact",

    keywords: [
      "contact",
      "support",
      "email",
      "phone",
      "talk to support",

      // Banglish
      "support chai",
      "contact korbo",
      "support lagbe",

      // Bangla
      "যোগাযোগ",
      "সাপোর্ট",
      "সহায়তা",
      "সহায়তা",
    ],

    answer:
      "For plan questions or MessHub support, use the available contact or support options on the MessHub website.",

    links: [
      LINKS.pricing,
      LINKS.about,
    ],
  },


  // ====================================================
  // MEALS
  // ====================================================

  {
    id: "meals",

    keywords: [
      "meal",
      "meal rate",
      "meal tracking",
      "meal on",
      "meal off",
      "daily meal",

      // Banglish
      "meal rate kivabe",
      "meal off korbo",
      "meal on korbo",
      "meal hisab",
      "ajker meal off",
      "amar koyta meal",

      // Bangla
      "মিল",
      "মিল রেট",
      "মিল অফ",
      "মিল অন",
      "মিল হিসাব",
    ],

    answer:
      "Managers and members can track daily meals through MessHub. Meal records are used when calculating meal costs and monthly settlement.",

    links: [
      LINKS.how,
    ],
  },


  // ====================================================
  // BAZAR
  // ====================================================

  {
    id: "bazar",

    keywords: [
      "bazar",
      "bazaar",
      "grocery",
      "receipt",
      "bazar receipt",

      // Banglish
      "bazar add korbo",
      "bazar hisab",
      "receipt upload korbo",
      "bazar ke dise",

      // Bangla
      "বাজার",
      "বাজার হিসাব",
      "রসিদ",
      "রিসিট",
    ],

    answer:
      "MessHub allows bazar expenses to be recorded so members and managers can keep track of shared food expenses. Bazar information is included when calculating the monthly mess accounts.",

    links: [
      LINKS.how,
    ],
  },


  // ====================================================
  // EXPENSES
  // ====================================================

  {
    id: "expenses",

    keywords: [
      "expense",
      "expenses",
      "rent",
      "wifi bill",
      "gas bill",
      "cook salary",

      // Banglish
      "expense add korbo",
      "rent add korbo",
      "wifi bill add korbo",
      "gas bill add korbo",
      "expense split",

      // Bangla
      "খরচ",
      "ভাড়া",
      "ভাড়া",
      "ওয়াইফাই বিল",
      "গ্যাস বিল",
    ],

    answer:
      "MessHub can track shared mess expenses such as rent, Wi-Fi, gas, cook salary, and other shared costs. These expenses are included when calculating monthly balances.",

    links: [
      LINKS.how,
    ],
  },


  // ====================================================
  // SETTLEMENT
  // ====================================================

  {
    id: "settlement",

    keywords: [
      "settlement",
      "close the month",
      "monthly settlement",
      "monthly report",
      "dues",
      "balance",
      "owe",
      "final balance",

      // Banglish
      "monthly hisab",
      "masher hisab",
      "baki koto",
      "due koto",
      "settlement kivabe",
      "month close korbo",
      "final balance",

      // Bangla
      "সেটেলমেন্ট",
      "মাসের হিসাব",
      "মাসিক হিসাব",
      "বকেয়া",
      "বকেয়া",
      "ব্যালেন্স",
      "মাস শেষ",
    ],

    answer:
      "At month end, MessHub calculates each member’s meal costs, shared expenses, payments, and final balance so members can see their monthly account. Managers can also keep monthly records and reports.",

    links: [
      LINKS.how,
      LINKS.pricing,
    ],
  },
];


// ======================================================
// Greetings
// ======================================================

const greetings = [
  // English
  "hi",
  "hello",
  "hey",
  "hey there",
  "hello there",
  "good morning",
  "good afternoon",
  "good evening",
  "yo",

  // Islamic
  "salam",
  "assalam",
  "assalamu alaikum",
  "assalamualaikum",
  "as salamu alaikum",

  // Banglish
  "kemon acho",
  "kemon aso",
  "kmn acho",
  "kmn aso",
  "kemon asen",
  "kmn asen",
  "ki obostha",
  "ki khobor",

  // Bangla
  "হাই",
  "হ্যালো",
  "হ্যাল্লো",
  "সালাম",
  "আসসালামু আলাইকুম",
  "শুভ সকাল",
  "শুভ দুপুর",
  "শুভ সন্ধ্যা",
];


// ======================================================
// Thanks
// ======================================================

const thanks = [
  "thank you",
  "thanks",
  "thank",
  "thx",
  "appreciate",

  // Banglish
  "dhonnobad",
  "donnobad",
  "shukriya",
  "thanks vai",
  "thanks bro",
  "thnx",
  "tnx",

  // Bangla
  "ধন্যবাদ",
  "শুকরিয়া",
];


// ======================================================
// Help
// ======================================================

const helpPhrases = [
  "can you help",
  "help me",
  "need help",
  "i need help",

  // Banglish
  "help chai",
  "ektu help",
  "help lagbe",

  // Bangla
  "সাহায্য চাই",
  "হেল্প চাই",
  "সাহায্য লাগবে",
];


// ======================================================
// Goodbye
// ======================================================

const byePhrases = [
  "bye",
  "goodbye",
  "see you",
  "see ya",
  "allah hafez",
  "allah hafiz",

  // Banglish
  "bye vai",
  "bye bro",
  "dekha hobe",
  "pore kotha hobe",
  "gelam",

  // Bangla
  "আল্লাহ হাফেজ",
  "বিদায়",
  "বিদায়",
];


// ======================================================
// Banglish Normalization
// ======================================================

const BANGLISH_NORMALIZATIONS = {
  kmn: "kemon",
  tmr: "tomar",
  tmi: "tumi",
  apni: "apni",

  "ki vabe": "kivabe",
  kibhabe: "kivabe",
  kemne: "kivabe",

  valo: "bhalo",

  ase: "ache",
  asen: "achen",
  aso: "acho",

  khbr: "khobor",

  donnobad: "dhonnobad",

  thnx: "thanks",
  tnx: "thanks",

  "kortesi": "korchi",
  "kortese": "korche",
  "kortesen": "korchen",

  "lagse": "lagche",
  "lagtese": "lagche",

  "hoise": "hoyeche",
  "hoyse": "hoyeche",

  "bujhsi": "bujhechi",
  "bujhlam": "bujhechi",
};


// ======================================================
// Utility Functions
// ======================================================

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}


function banglaDigitsToEnglish(text) {
  const banglaDigits = "০১২৩৪৫৬৭৮৯";

  return text.replace(/[০-৯]/g, (digit) =>
    String(banglaDigits.indexOf(digit))
  );
}


function normalizeBanglish(text) {
  let output = text;

  const replacements = Object.entries(
    BANGLISH_NORMALIZATIONS
  ).sort(
    (a, b) => b[0].length - a[0].length
  );

  for (const [from, to] of replacements) {
    const escaped = escapeRegExp(from);

    output = output.replace(
      new RegExp(`\\b${escaped}\\b`, "g"),
      to
    );
  }

  return output;
}


function normalize(text) {
  let value = banglaDigitsToEnglish(
    String(text ?? "")
  )
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s+]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  value = normalizeBanglish(value);

  return value;
}


function getWords(text) {
  return normalize(text)
    .split(" ")
    .filter(Boolean);
}


// ======================================================
// Fuzzy / Typo Matching
// ======================================================

function levenshteinDistance(a, b) {
  if (a === b) return 0;

  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const previous = Array.from(
    { length: b.length + 1 },
    (_, index) => index
  );

  const current = new Array(
    b.length + 1
  );

  for (let i = 1; i <= a.length; i += 1) {
    current[0] = i;

    for (let j = 1; j <= b.length; j += 1) {
      const cost =
        a[i - 1] === b[j - 1] ? 0 : 1;

      current[j] = Math.min(
        current[j - 1] + 1,
        previous[j] + 1,
        previous[j - 1] + cost
      );
    }

    for (let j = 0; j <= b.length; j += 1) {
      previous[j] = current[j];
    }
  }

  return previous[b.length];
}


function similarity(a, b) {
  const left = normalize(a);
  const right = normalize(b);

  const maxLength = Math.max(
    left.length,
    right.length
  );

  if (!maxLength) return 1;

  return (
    1 -
    levenshteinDistance(left, right) /
      maxLength
  );
}


function fuzzyWordMatch(inputWord, keywordWord) {
  if (inputWord === keywordWord) {
    return true;
  }

  if (
    inputWord.length < 4 ||
    keywordWord.length < 4
  ) {
    return false;
  }

  return (
    similarity(inputWord, keywordWord) >=
    0.78
  );
}


function phraseFuzzyMatch(input, keyword) {
  const inputWords = getWords(input);
  const keywordWords = getWords(keyword);

  if (!keywordWords.length) {
    return false;
  }

  if (keywordWords.length === 1) {
    return inputWords.some((word) =>
      fuzzyWordMatch(
        word,
        keywordWords[0]
      )
    );
  }

  return keywordWords.every((keywordWord) =>
    inputWords.some((inputWord) =>
      fuzzyWordMatch(
        inputWord,
        keywordWord
      )
    )
  );
}


function scoreKeyword(input, keyword) {
  const normalizedKeyword =
    normalize(keyword);

  if (!normalizedKeyword) {
    return 0;
  }

  if (input === normalizedKeyword) {
    return (
      15 +
      getWords(normalizedKeyword).length * 3
    );
  }

  if (
    input.includes(normalizedKeyword)
  ) {
    return (
      9 +
      getWords(normalizedKeyword).length * 3
    );
  }

  if (
    phraseFuzzyMatch(
      input,
      normalizedKeyword
    )
  ) {
    return (
      3 +
      getWords(normalizedKeyword).length * 2
    );
  }

  return 0;
}


// ======================================================
// Stable Reply Selection
// ======================================================

function chooseStable(items, seed) {
  if (!items.length) {
    return "";
  }

  const total = Array.from(
    String(seed)
  ).reduce(
    (sum, character) =>
      sum + character.codePointAt(0),
    0
  );

  return items[
    total % items.length
  ];
}


// ======================================================
// Time-Based Greeting
// ======================================================

function getTimeGreeting() {
  const hour =
    new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 17) {
    return "Good afternoon";
  }

  return "Good evening";
}


// ======================================================
// Islamic Greeting Detection
// ======================================================

function isIslamicGreeting(input) {
  const phrases = [
    "salam",
    "assalam",
    "assalamu alaikum",
    "assalamualaikum",
    "as salamu alaikum",
    "সালাম",
    "আসসালামু আলাইকুম",
  ];

  return phrases.some((phrase) => {
    const value = normalize(phrase);

    return (
      input === value ||
      input.startsWith(`${value} `)
    );
  });
}


function getGreetingReply(input) {
  if (isIslamicGreeting(input)) {
    return "Wa Alaikum Assalam! 👋 Welcome to MessHub. How can I help you today?";
  }

  const replies = [
    `${getTimeGreeting()}! 👋 Welcome to MessHub. How can I help you today?`,

    "Hi! 👋 Welcome to MessHub. Need help finding, joining, or managing a mess?",

    "Hello! 👋 I’m the MessHub Assistant. What would you like help with today?",

    "Hey! 👋 I can help with mess finding, meals, bazar, settlement, pricing, and more.",
  ];

  return chooseStable(
    replies,
    input
  );
}


// ======================================================
// Casual / Random Conversation
// ======================================================

const casualConversations = [
  {
    intent: "how_are_you",

    keywords: [
      "how are you",
      "how are you doing",
      "how r u",
      "how you doing",

      // Banglish
      "kemon acho",
      "kemon aso",
      "kemon achen",
      "ki obostha",
      "ki khobor",
      "bhalo acho",
      "bhalo achen",

      // Bangla
      "কেমন আছো",
      "কেমন আছেন",
      "কি অবস্থা",
      "কি খবর",
    ],

    replies: [
      "I’m doing great! 😊 Thanks for asking. How can I help you with MessHub today?",

      "Ami bhalo achi 😄 Tumi kemon acho? MessHub niye kichu help lagbe?",

      "Bhalo achi! 😊 MessHub niye ja jante chao bolo.",
    ],
  },


  {
    intent: "bot_name",

    keywords: [
      "what is your name",
      "whats your name",
      "your name",
      "who are you",

      // Banglish
      "tomar nam ki",
      "apnar nam ki",
      "tumi ke",
      "ke tumi",

      // Bangla
      "তোমার নাম কি",
      "তোমার নাম কী",
      "আপনার নাম কি",
      "তুমি কে",
    ],

    replies: [
      "I’m the MessHub Assistant 🤖 — here to help you use MessHub more easily.",

      "You can call me the MessHub Assistant! 😊",

      "Ami MessHub Assistant 🤖 MessHub use korte tomake help korbo.",
    ],
  },


  {
    intent: "what_doing",

    keywords: [
      "what are you doing",
      "what you doing",
      "wyd",

      // Banglish
      "ki korcho",
      "ki korteso",
      "ki koren",
      "ki korchen",

      // Bangla
      "কি করছো",
      "কি করছেন",
    ],

    replies: [
      "Just waiting here to help you with MessHub 😄",

      "Helping MessHub users like you! What can I help you with?",

      "Tomake MessHub niye help korar jonno ready achi 😄",
    ],
  },


  {
    intent: "bot_question",

    keywords: [
      "are you a robot",
      "are you ai",
      "are you human",
      "are you real",

      // Banglish
      "tumi robot",
      "tumi ai",
      "tumi manush",

      // Bangla
      "তুমি রোবট",
      "তুমি কি এআই",
      "তুমি কি মানুষ",
    ],

    replies: [
      "I’m MessHub’s virtual assistant 🤖. I’m here to guide you around the platform and answer MessHub-related questions.",

      "Ami MessHub er virtual assistant 🤖 Tomake MessHub use korte help kori.",
    ],
  },


  {
    intent: "creator",

    keywords: [
      "who made you",
      "who created you",
      "who built you",

      // Banglish
      "ke banaise",
      "ke banayse",
      "ke tomake banaise",

      // Bangla
      "কে বানিয়েছে",
      "কে বানিয়েছে",
      "তোমাকে কে বানিয়েছে",
    ],

    replies: [
      "I’m part of the MessHub platform and was created to help visitors and members use MessHub more easily. 😊",
    ],
  },


  {
    intent: "compliment",

    keywords: [
      "nice website",
      "good website",
      "great website",
      "awesome website",
      "i like messhub",
      "love this website",

      // Banglish
      "bhalo lagche",
      "onek bhalo",
      "nice lagche",
      "site ta bhalo",
      "website ta bhalo",
      "darun",
      "joss",
      "osthir",

      // Bangla
      "অনেক ভালো",
      "সুন্দর হয়েছে",
      "সুন্দর হয়েছে",
      "দারুণ",
    ],

    replies: [
      "Thank you! 😊 Glad you like MessHub.",

      "Thanks! That’s great to hear. 💚",

      "Dhonnobad! 😊 Kono help lagle bolo.",
    ],
  },


  {
    intent: "bored",

    keywords: [
      "i am bored",
      "im bored",
      "bored",

      // Banglish
      "bore lagche",
      "bor lagche",
      "mon bhalo na",

      // Bangla
      "বোর লাগছে",
      "মন ভালো না",
    ],

    replies: [
      "Haha 😄 You can talk with me for a bit. I can also help you explore MessHub.",

      "Bore lagche naki 😄 Chaile MessHub er kichu feature explore korte paro.",

      "I can keep you company for a bit 😄 What would you like to talk about?",
    ],
  },


  {
    intent: "joke",

    keywords: [
      "tell me a joke",
      "joke",
      "make me laugh",
      "something funny",

      // Banglish
      "joke bolo",
      "moja bolo",
      "funny kichu bolo",
      "hasao",

      // Bangla
      "জোক বলো",
      "মজার কিছু বলো",
      "হাসাও",
    ],

    replies: [
      "Why did the mess manager bring a calculator to dinner? Because everyone wanted to know the meal rate. 😄",

      "Mess life rule #1: Everyone remembers who ate the extra egg, but nobody remembers who forgot to enter the bazar. 😄",

      "Mess manager bollo: 'Bazar ke korse?' Sobai bollo: 'Group e check koren!' 😄",
    ],
  },


  {
    intent: "laugh",

    keywords: [
      "lol",
      "haha",
      "hahaha",
      "hehe",
      "lmao",
    ],

    replies: [
      "😂 Glad that made you laugh!",

      "Haha 😄",

      "Mess life has its moments 😄",
    ],
  },


  {
    intent: "okay",

    keywords: [
      "ok",
      "okay",
      "okk",
      "alright",

      // Banglish
      "accha",
      "acha",
      "achha",
      "thik ache",
      "bujhechi",

      // Bangla
      "আচ্ছা",
      "ঠিক আছে",
      "বুঝলাম",
    ],

    replies: [
      "Alright! 😊 Let me know if you need anything.",

      "Thik ache 😊 Kono help lagle bolo.",

      "Okay! 👍",
    ],
  },


  {
    intent: "bad_day",

    keywords: [
      "bad day",
      "i am sad",
      "im sad",
      "not feeling good",

      // Banglish
      "mon kharap",
      "ajke mon kharap",

      // Bangla
      "মন খারাপ",
      "আজকে মন খারাপ",
    ],

    replies: [
      "Sorry to hear that. I hope your day gets a little better. You can talk for a bit, or I can help you with something on MessHub.",

      "That sounds rough. I hope things get better soon.",
    ],
  },
];


// ======================================================
// Casual Reply Matching
// ======================================================

function getCasualReply(input) {
  let bestConversation = null;
  let bestScore = 0;

  for (
    const conversation of casualConversations
  ) {
    for (
      const keyword of conversation.keywords
    ) {
      const score =
        scoreKeyword(
          input,
          keyword
        );

      if (score > bestScore) {
        bestScore = score;
        bestConversation =
          conversation;
      }
    }
  }

  if (
    !bestConversation ||
    bestScore < 3
  ) {
    return null;
  }

  return {
    intent:
      bestConversation.intent,

    answer: chooseStable(
      bestConversation.replies,
      input
    ),

    links: [],

    suggestions: [
      "Find a Mess",
      "How does MessHub work?",
      "How does pricing work?",
    ],

    actions: [],
  };
}


// ======================================================
// Reply Builder
// ======================================================

function makeReply(entry, override = {}) {
  return {
    intent: entry.id,

    answer:
      entry.answer,

    links:
      entry.links || [],

    suggestions:
      FOLLOW_UPS[entry.id] || [],

    actions:
      entry.links || [],

    ...override,
  };
}


// ======================================================
// Smart Member Count / Pricing
// ======================================================

function extractMemberCount(input) {
  const match =
    input.match(
      /\b(\d{1,3})\b/
    );

  if (!match) {
    return null;
  }

  const count =
    Number(match[1]);

  if (
    !Number.isFinite(count) ||
    count <= 0
  ) {
    return null;
  }

  const memberWords = [
    "member",
    "members",
    "people",
    "person",
    "jon",
    "জন",
    "মেম্বার",
    "সদস্য",
  ];

  const hasMemberContext =
    memberWords.some((word) =>
      input.includes(
        normalize(word)
      )
    );

  return hasMemberContext
    ? count
    : null;
}


function getPricingForMemberCount(count) {
  if (count <= 8) {
    return {
      intent: "pricing",

      answer:
        `For ${count} active member${
          count === 1 ? "" : "s"
        }, the Free plan applies because the Free plan covers 1–8 active members.`,

      links: [
        LINKS.pricing,
        LINKS.register,
      ],

      suggestions: [
        "What happens after 8 members?",
        "What features are included?",
        "How do I create a mess?",
      ],

      actions: [
        LINKS.pricing,
        LINKS.register,
      ],
    };
  }


  if (count <= 12) {
    return {
      intent: "pricing",

      answer:
        `For ${count} active members, the Standard plan applies because Standard covers 9–12 active members.`,

      links: [
        LINKS.pricing,
      ],

      suggestions: [
        "What is included in Free?",
        "What about 13+ members?",
        "How does pricing work?",
      ],

      actions: [
        LINKS.pricing,
      ],
    };
  }


  return {
    intent: "pricing",

    answer:
      `For ${count} active members, the Custom plan applies because Custom is designed for messes with 13 or more active members.`,

    links: [
      LINKS.pricing,
      LINKS.about,
    ],

    suggestions: [
      "How do I contact support?",
      "What can managers do?",
      "What features does MessHub have?",
    ],

    actions: [
      LINKS.pricing,
      LINKS.about,
    ],
  };
}


// ======================================================
// Greeting Detection
// ======================================================

function looksLikeGreeting(input) {
  return greetings.some((greeting) => {
    const value =
      normalize(greeting);

    return (
      input === value ||
      input.startsWith(`${value} `)
    );
  });
}


function looksLikeThanks(input) {
  return thanks.some((phrase) =>
    input.includes(
      normalize(phrase)
    )
  );
}


function looksLikeHelpRequest(input) {
  return helpPhrases.some((phrase) =>
    input.includes(
      normalize(phrase)
    )
  );
}


function looksLikeBye(input) {
  return byePhrases.some((phrase) => {
    const value =
      normalize(phrase);

    return (
      input === value ||
      input.includes(value)
    );
  });
}


// ======================================================
// Knowledge Search
// ======================================================

function findBestEntry(input) {
  let best = null;
  let bestScore = 0;

  for (const entry of entries) {
    let score = 0;

    for (
      const keyword of entry.keywords
    ) {
      score +=
        scoreKeyword(
          input,
          keyword
        );
    }

    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  return {
    best,
    bestScore,
  };
}


// ======================================================
// Conversation Context
// ======================================================

function getContextualReply(
  input,
  lastIntent
) {
  if (!lastIntent) {
    return null;
  }


  // Example:
  //
  // User:
  // "How does pricing work?"
  //
  // User:
  // "What about 15?"
  //
  if (
    lastIntent === "pricing"
  ) {
    const number =
      input.match(
        /\b(\d{1,3})\b/
      );

    if (number) {
      return getPricingForMemberCount(
        Number(number[1])
      );
    }
  }


  const morePhrases = [
    "tell me more",
    "more details",
    "explain more",
    "what about that",

    // Banglish
    "aro bolo",
    "aro details",

    // Bangla
    "আরো বলো",
    "আরও বলো",
    "আরো বিস্তারিত",
  ];


  if (
    morePhrases.some((phrase) =>
      input.includes(
        normalize(phrase)
      )
    )
  ) {
    const previousEntry =
      entries.find(
        (entry) =>
          entry.id === lastIntent
      );

    if (previousEntry) {
      return makeReply(
        previousEntry,
        {
          answer:
            `${previousEntry.answer} You can choose one of the related questions below if you want to continue.`,
        }
      );
    }
  }


  return null;
}


// ======================================================
// Main Chatbot Function
// ======================================================

export function getBotReply(
  rawInput,
  context = {}
) {
  const originalInput =
    String(rawInput ?? "");

  const input =
    normalize(originalInput);


  // ====================================================
  // Empty Message
  // ====================================================

  if (!input) {
    return {
      intent: "empty",

      answer:
        "Ask me anything about MessHub — finding or joining a mess, meals, bazar, settlement, features, or pricing.",

      links: [],

      suggestions:
        SUGGESTED_QUESTIONS.slice(
          0,
          4
        ),

      actions:
        CHATBOT_QUICK_ACTIONS.slice(
          0,
          3
        ),
    };
  }


  // ====================================================
  // Greeting
  // ====================================================

  if (
    looksLikeGreeting(input)
  ) {
    return {
      intent: "greeting",

      answer:
        getGreetingReply(input),

      links: [
        LINKS.find,
        LINKS.how,
        LINKS.pricing,
      ],

      suggestions: [
        "Find a Mess",
        "How does MessHub work?",
        "How does pricing work?",
        "How do I create a mess?",
      ],

      actions: [
        LINKS.find,
        LINKS.how,
        LINKS.pricing,
      ],
    };
  }


  // ====================================================
  // Thanks
  // ====================================================

  if (
    looksLikeThanks(input)
  ) {
    return {
      intent: "thanks",

      answer:
        "You’re welcome! 😊 Kono help lagle abar bolo. I can help with finding a mess, meals, settlement, accounts, or pricing.",

      links: [
        LINKS.find,
        LINKS.register,
      ],

      suggestions: [
        "Find a Mess",
        "Create an Account",
        "How does pricing work?",
      ],

      actions: [
        LINKS.find,
        LINKS.register,
      ],
    };
  }


  // ====================================================
  // Goodbye
  // ====================================================

  if (
    looksLikeBye(input)
  ) {
    return {
      intent: "goodbye",

      answer:
        "Allah Hafez! 👋 Thanks for visiting MessHub. Come back anytime you need help.",

      links: [
        LINKS.home,
      ],

      suggestions: [],

      actions: [
        LINKS.home,
      ],
    };
  }


  // ====================================================
  // Help
  // ====================================================

  if (
    looksLikeHelpRequest(input)
  ) {
    return {
      intent: "help",

      answer:
        "Of course! 😊 I can help you find or join a mess, create a mess, understand meals and bazar, check settlement, learn about features, or understand pricing. What do you need help with?",

      links: [
        LINKS.find,
        LINKS.how,
        LINKS.pricing,
      ],

      suggestions: [
        "I want to find a mess",
        "I want to create a mess",
        "How does meal tracking work?",
        "How does pricing work?",
      ],

      actions: [
        LINKS.find,
        LINKS.how,
        LINKS.pricing,
      ],
    };
  }


  // ====================================================
  // Smart Pricing
  // ====================================================

  const memberCount =
    extractMemberCount(input);

  if (
    memberCount !== null
  ) {
    return getPricingForMemberCount(
      memberCount
    );
  }


  // ====================================================
  // Conversation Context
  // ====================================================

  const contextualReply =
    getContextualReply(
      input,
      context.lastIntent
    );

  if (contextualReply) {
    return contextualReply;
  }


  // ====================================================
  // Casual Conversations
  // ====================================================

  const casualReply =
    getCasualReply(input);

  if (casualReply) {
    return casualReply;
  }


  // ====================================================
  // MessHub Knowledge
  // ====================================================

  const {
    best,
    bestScore,
  } = findBestEntry(input);


  if (
    best &&
    bestScore >= 3
  ) {
    return makeReply(best);
  }


  // ====================================================
  // Random / Unrelated Question Fallback
  // ====================================================

  return {
    intent: "fallback",

    answer:
      "I’m mainly here to help with MessHub, so I may not have a reliable answer for that. 😊 I can help with finding a mess, joining, creating a mess, meals, bazar, expenses, monthly settlement, pricing, accounts, or support. You can ask me in English, Bangla, or Banglish.",

    links: [
      LINKS.find,
      LINKS.how,
      LINKS.pricing,
    ],

    suggestions: [
      "How do I find a mess?",
      "How do I join a mess?",
      "How does meal tracking work?",
      "How does pricing work?",
    ],

    actions: [
      LINKS.find,
      LINKS.how,
      LINKS.pricing,
    ],
  };
}


// ======================================================
// Welcome Message
// ======================================================

export const WELCOME_MESSAGE = {
  intent: "welcome",

  answer:
    "Welcome to MessHub — Better Meals, Happier Together. 👋 I can help you find or join a mess, create and manage one, understand meals and bazar, check settlement, or learn about pricing. You can ask me in English, Bangla, or Banglish.",

  links: [
    LINKS.find,
    LINKS.how,
    LINKS.pricing,
  ],

  suggestions: [
    "Find a Mess",
    "How does MessHub work?",
    "How does meal tracking work?",
    "How does pricing work?",
  ],

  actions: [
    LINKS.find,
    LINKS.how,
    LINKS.pricing,
  ],
}; */