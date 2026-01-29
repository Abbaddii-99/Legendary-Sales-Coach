import { I18nManager } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Language = "en" | "ar";

export const translations = {
  en: {
    // App
    appName: "Girard's Legacy",
    
    // Tabs
    arena: "Arena",
    training: "Training",
    crm: "CRM",
    settings: "Settings",
    
    // Arena Screen
    welcomeBack: "Welcome back,",
    theArena: "THE ARENA",
    whatSelling: "What are you selling today?",
    liveSalesShadow: "Live Sales Shadow - TRAIN WITH JOE",
    the250Map: "THE 250 MAP",
    yourNetworkGrowth: "Your Network Growth",
    connections: "CONNECTIONS",
    dailyGreeting: "DAILY GREETING",
    aiAssistant: "AI Assistant:",
    checkCRM: "Check your CRM for follow-up suggestions!",
    completeFirst: "Complete your first session to get personalized tips!",
    craftMessage: "Craft Message",
    level: "Level",
    trustPoints: "Trust Points",
    
    // Training Screen
    chooseYourChallenge: "Choose Your Challenge",
    masterDifferent: "Master different customer personalities and scenarios",
    trainingScenarios: "Training Scenarios",
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
    
    // Scenarios
    theHesitantBuyer: "The Hesitant Buyer",
    thePriceShopper: "The Price Shopper",
    theAngryReturn: "The Angry Return",
    firstTimeHomebuyer: "First-Time Homebuyer",
    enterpriseDecisionMaker: "Enterprise Decision Maker",
    theBargainHunter: "The Bargain Hunter",
    
    // Categories
    automotive: "Automotive",
    realEstate: "Real Estate",
    techServices: "Tech Services",
    retail: "Retail",
    
    // CRM Screen
    myClients: "My Clients",
    noClientsYet: "No clients tracked yet",
    completeSession: "Complete a training session to start building your network of connections.",
    addFirstClient: "Add Your First Client",
    lastContact: "Last contact:",
    today: "Today",
    yesterday: "Yesterday",
    daysAgo: "days ago",
    
    // Client Detail
    clientDetails: "Client Details",
    inNetworkSince: "In your network since",
    lastContactDate: "Last Contact",
    logContactToday: "Log Contact Today",
    personalNotes: "Personal Notes",
    noNotesYet: "No notes yet. Tap edit to add some!",
    joesFollowUpIdea: "Joe's Follow-up Idea",
    removeFromCRM: "Remove from CRM",
    contactLogged: "Contact Logged",
    lastContactUpdated: "Last contact updated to today!",
    deleteClient: "Delete Client",
    deleteClientConfirm: "Are you sure you want to remove this client from your CRM?",
    
    // Add Client
    addClient: "Add Client",
    clientName: "Client Name *",
    enterClientName: "Enter client's name",
    personalNotesLabel: "Personal Notes",
    addDetails: "Add details: hobbies, family, preferences...",
    joeRule: "Remember Joe's rule: \"The more you know about your customer, the more they'll buy from you!\"",
    addToNetwork: "Add to Network",
    
    // Training Session
    endSession: "End Session",
    yourResponse: "Your response...",
    customerTyping: "Customer is typing...",
    quickPractice: "Quick Practice",
    mysteryCustomer: "Mystery Customer",
    
    // Session Summary
    yourScore: "Your Score",
    outOf: "out of 100",
    performanceBreakdown: "Performance Breakdown",
    buildingRapport: "Building Rapport",
    trustCredibility: "Trust & Credibility",
    activeListening: "Active Listening",
    objectionHandling: "Objection Handling",
    serviceFocus: "Service Focus",
    joesAssessment: "Joe's Assessment",
    yourCoachSays: "Your coach says...",
    saveToCRM: "Save to CRM",
    done: "Done",
    saveClient: "Save Client",
    cancel: "Cancel",
    
    // Profile Screen
    profile: "Profile",
    yourProgress: "Your Progress",
    sessions: "Sessions",
    aboutApp: "About Girard's Legacy",
    aboutDescription: "Girard's Legacy is inspired by Joe Girard, the world's greatest salesman. Train with AI-powered roleplay to become a sales legend!",
    resetProgress: "Reset Progress",
    resetProgressConfirm: "Are you sure you want to reset all your progress? This cannot be undone.",
    reset: "Reset",
    
    // Levels
    newcomer: "Newcomer",
    apprentice: "Apprentice",
    certifiedDealer: "Certified Dealer",
    masterCloser: "Master Closer",
    
    // Common
    loading: "Loading...",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    about: "About",
    language: "Language",
    switchToArabic: "Switch to Arabic",
    switchToEnglish: "Switch to English",
    
    // Quotes
    quote1: "Every customer knows 250 other people. Never lose one!",
    quote2: "People don't buy products. They buy you!",
    quote3: "The only way to make a sale is to believe you can.",
    quote4: "Follow up until they buy or die!",
    quote5: "Your attitude determines your altitude in sales.",
    elevatorQuote: "The elevator to success is out of order. You'll have to use the stairs, one step at a time.",
    
    // Session History & Analytics
    sessionHistory: "Session History",
    noSessionsYet: "No sessions recorded yet",
    startTraining: "Start training to see your progress!",
    viewHistory: "View History",
    analytics: "Analytics",
    totalSessions: "Total Sessions",
    averageScore: "Average Score",
    weeklyProgress: "This Week",
    streak: "Day Streak",
    bestCategory: "Best Category",
    needsWork: "Needs Work",
    performanceTrend: "Performance Trend",
    improving: "Improving",
    declining: "Needs Attention",
    stable: "Stable",
    scoreBreakdown: "Score Breakdown",
    aiTips: "AI-Powered Tips",
    personalizedAdvice: "Personalized Advice",
    basedOnPerformance: "Based on your recent performance",
    viewSession: "View Session",
    deleteSession: "Delete Session",
    sessionDeleted: "Session deleted",
    conversationHistory: "Conversation History",
    noTipsYet: "Complete more sessions to get personalized tips!",
    tipFocusOn: "Focus on",
    tipStrength: "Your strength is",
    tipPractice: "Practice more",
    tipConsistency: "Stay consistent!",
    tipImproving: "You're improving!",
    duration: "Duration",
    minutes: "min",
    earned: "Earned",
  },
  ar: {
    // App
    appName: "إرث جيرارد",
    
    // Tabs
    arena: "الحلبة",
    training: "التدريب",
    crm: "العملاء",
    settings: "الإعدادات",
    
    // Arena Screen
    welcomeBack: "مرحباً بعودتك،",
    theArena: "الحلبة",
    whatSelling: "ماذا ستبيع اليوم؟",
    liveSalesShadow: "تدريب مباشر - تدرّب مع جو",
    the250Map: "خريطة الـ 250",
    yourNetworkGrowth: "نمو شبكتك",
    connections: "علاقات",
    dailyGreeting: "التحية اليومية",
    aiAssistant: "مساعد الذكاء:",
    checkCRM: "راجع قائمة العملاء للحصول على اقتراحات المتابعة!",
    completeFirst: "أكمل أول جلسة للحصول على نصائح مخصصة!",
    craftMessage: "صياغة رسالة",
    level: "المستوى",
    trustPoints: "نقاط الثقة",
    
    // Training Screen
    chooseYourChallenge: "اختر تحديك",
    masterDifferent: "أتقن التعامل مع شخصيات وسيناريوهات مختلفة للعملاء",
    trainingScenarios: "سيناريوهات التدريب",
    beginner: "مبتدئ",
    intermediate: "متوسط",
    advanced: "متقدم",
    
    // Scenarios
    theHesitantBuyer: "المشتري المتردد",
    thePriceShopper: "صائد الأسعار",
    theAngryReturn: "العميل الغاضب",
    firstTimeHomebuyer: "مشتري المنزل الأول",
    enterpriseDecisionMaker: "صانع القرار",
    theBargainHunter: "صائد الصفقات",
    
    // Categories
    automotive: "السيارات",
    realEstate: "العقارات",
    techServices: "الخدمات التقنية",
    retail: "التجزئة",
    
    // CRM Screen
    myClients: "عملائي",
    noClientsYet: "لا يوجد عملاء حتى الآن",
    completeSession: "أكمل جلسة تدريبية لبدء بناء شبكة علاقاتك.",
    addFirstClient: "أضف أول عميل",
    lastContact: "آخر تواصل:",
    today: "اليوم",
    yesterday: "أمس",
    daysAgo: "أيام مضت",
    
    // Client Detail
    clientDetails: "تفاصيل العميل",
    inNetworkSince: "في شبكتك منذ",
    lastContactDate: "آخر تواصل",
    logContactToday: "تسجيل تواصل اليوم",
    personalNotes: "ملاحظات شخصية",
    noNotesYet: "لا توجد ملاحظات. اضغط للتعديل!",
    joesFollowUpIdea: "فكرة متابعة من جو",
    removeFromCRM: "إزالة من القائمة",
    contactLogged: "تم تسجيل التواصل",
    lastContactUpdated: "تم تحديث آخر تواصل إلى اليوم!",
    deleteClient: "حذف العميل",
    deleteClientConfirm: "هل أنت متأكد من إزالة هذا العميل من قائمتك؟",
    
    // Add Client
    addClient: "إضافة عميل",
    clientName: "اسم العميل *",
    enterClientName: "أدخل اسم العميل",
    personalNotesLabel: "ملاحظات شخصية",
    addDetails: "أضف تفاصيل: هوايات، عائلة، تفضيلات...",
    joeRule: "تذكر قاعدة جو: \"كلما عرفت أكثر عن عميلك، كلما اشترى منك أكثر!\"",
    addToNetwork: "إضافة للشبكة",
    
    // Training Session
    endSession: "إنهاء الجلسة",
    yourResponse: "ردك...",
    customerTyping: "العميل يكتب...",
    quickPractice: "تمرين سريع",
    mysteryCustomer: "عميل غامض",
    
    // Session Summary
    yourScore: "نتيجتك",
    outOf: "من 100",
    performanceBreakdown: "تحليل الأداء",
    buildingRapport: "بناء العلاقة",
    trustCredibility: "الثقة والمصداقية",
    activeListening: "الاستماع الفعال",
    objectionHandling: "معالجة الاعتراضات",
    serviceFocus: "التركيز على الخدمة",
    joesAssessment: "تقييم جو",
    yourCoachSays: "مدربك يقول...",
    saveToCRM: "حفظ في العملاء",
    done: "تم",
    saveClient: "حفظ العميل",
    cancel: "إلغاء",
    
    // Profile Screen
    profile: "الملف الشخصي",
    yourProgress: "تقدمك",
    sessions: "جلسات",
    aboutApp: "عن إرث جيرارد",
    aboutDescription: "إرث جيرارد مستوحى من جو جيرارد، أعظم بائع في العالم. تدرب مع محاكاة ذكاء اصطناعي لتصبح أسطورة في المبيعات!",
    resetProgress: "إعادة تعيين التقدم",
    resetProgressConfirm: "هل أنت متأكد من إعادة تعيين كل تقدمك؟ لا يمكن التراجع عن هذا.",
    reset: "إعادة تعيين",
    
    // Levels
    newcomer: "مبتدئ",
    apprentice: "متدرب",
    certifiedDealer: "تاجر معتمد",
    masterCloser: "محترف الإغلاق",
    
    // Common
    loading: "جارٍ التحميل...",
    save: "حفظ",
    delete: "حذف",
    edit: "تعديل",
    about: "حول",
    language: "اللغة",
    switchToArabic: "التبديل للعربية",
    switchToEnglish: "التبديل للإنجليزية",
    
    // Quotes
    quote1: "كل عميل يعرف 250 شخصاً آخر. لا تخسر أحداً أبداً!",
    quote2: "الناس لا يشترون المنتجات. يشترونك أنت!",
    quote3: "الطريقة الوحيدة لإتمام البيع هي أن تؤمن أنك تستطيع.",
    quote4: "تابع حتى يشتروا أو... تابع!",
    quote5: "موقفك يحدد مكانتك في المبيعات.",
    elevatorQuote: "المصعد إلى النجاح معطل. عليك استخدام الدرج، خطوة بخطوة.",
    
    // Session History & Analytics
    sessionHistory: "سجل الجلسات",
    noSessionsYet: "لا توجد جلسات مسجلة بعد",
    startTraining: "ابدأ التدريب لترى تقدمك!",
    viewHistory: "عرض السجل",
    analytics: "التحليلات",
    totalSessions: "إجمالي الجلسات",
    averageScore: "متوسط النتيجة",
    weeklyProgress: "هذا الأسبوع",
    streak: "أيام متتالية",
    bestCategory: "أفضل فئة",
    needsWork: "تحتاج تحسين",
    performanceTrend: "اتجاه الأداء",
    improving: "تحسن ملحوظ",
    declining: "يحتاج انتباه",
    stable: "مستقر",
    scoreBreakdown: "تفصيل النتائج",
    aiTips: "نصائح ذكية",
    personalizedAdvice: "نصائح مخصصة",
    basedOnPerformance: "بناءً على أدائك الأخير",
    viewSession: "عرض الجلسة",
    deleteSession: "حذف الجلسة",
    sessionDeleted: "تم حذف الجلسة",
    conversationHistory: "سجل المحادثة",
    noTipsYet: "أكمل المزيد من الجلسات للحصول على نصائح مخصصة!",
    tipFocusOn: "ركز على",
    tipStrength: "نقطة قوتك هي",
    tipPractice: "تدرب أكثر على",
    tipConsistency: "حافظ على الاستمرارية!",
    tipImproving: "أنت تتحسن!",
    duration: "المدة",
    minutes: "دقيقة",
    earned: "حصلت على",
  },
};

export type TranslationKey = keyof typeof translations.en;

let currentLanguage: Language = "ar"; // Default to Arabic

export const setLanguage = async (lang: Language) => {
  currentLanguage = lang;
  await AsyncStorage.setItem("appLanguage", lang);
  
  // Note: RTL changes require app restart to take full effect
  if (lang === "ar") {
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(true);
  } else {
    I18nManager.allowRTL(false);
    I18nManager.forceRTL(false);
  }
};

export const getLanguage = (): Language => currentLanguage;

export const loadLanguage = async (): Promise<Language> => {
  try {
    const saved = await AsyncStorage.getItem("appLanguage");
    if (saved === "en" || saved === "ar") {
      currentLanguage = saved;
    }
  } catch (error) {
    console.error("Error loading language:", error);
  }
  return currentLanguage;
};

export const t = (key: TranslationKey): string => {
  return translations[currentLanguage][key] || translations.en[key] || key;
};

export const isRTL = (): boolean => currentLanguage === "ar";
