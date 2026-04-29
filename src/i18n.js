import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      // ===== GLOBAL =====
      cancel: "Cancel",
      save: "Save",
      delete: "Delete",
      update: "Update",

      // ===== SIDEBAR =====
      goalTracker: "Goal Tracker",
      dashboard: "Dashboard",
      analytics: "Analytics",
      categories: "Categories",
      goals: "Goals",
      createGoal: "Create Goal",
      calendar: "Calendar",
      settings: "Settings",
      logout: "Logout",

      // ===== TOPBAR =====
      searchPlaceholder: "Search...",
      en: "English",
      fa: "Farsi",
      ar: "Arabic",
      signedInAs: "Signed in as",
      noEmailSet: "No email set",
      profile: "Profile",
      signOut: "Sign Out",

      // ===== DASHBOARD =====
      dashboardTitle: "Welcome Back!",
      dashboardDesc: "Track progress, streaks, and goals in one place",
      addGoal: "+ Add Goal",
      activeGoals: "Active Goals",
      streakDays: "Streak Days",
      keepItGoing: "🔥 Keep it going",
      totalXP: "Total XP",
      newPersonalRecord: "New personal record!",
      momentumBuilding: "⚡ Momentum building",
      overallP: "Overall Progress",
      completed: "completed",
      active: "Active",
      inactive: "Inactive",
      goals: "Goals",

      weeklyAnalytics: "Weekly Goals Analytics",
      weeklyAnalyticsDesc:
        "Weekly goals, XP, and streak activity (current month)",

      goalsB: "Goals Breakdown",
      goalsBDesc: "Distribution of goal types and categories",

      recentG: "Recent Goals",
      viewAll: "View All →",
      inProgress: "In Progress",
      sort: "Sort",

      // ===== ANALYTICS =====
      analyticsDesc: "Deep insights into your performance and behavior",
      mostProgress: "Most Progress",
      mostXP: "Most XP",
      mostActiveDays: "Most Active Days",
      growth: "XP Growth",
      last7: "XP (Last 7 Days)",
      goalStat: "Goal Status",
      vs: "Goals vs XP",
      weeklyAP: "Weekly Activity Progress",
      inActive: "Inactive",
      completed0: "Completed 0",
      inProg0: "In progress 0",
      inAct0: "Inactive 0",

      // ===== CALENDAR =====
      events: "Events",
      addEvent: "Add Event",
      eventTitle: "Event Title",
      eventCreated: "Event created",
      eventDeleted: "Event deleted",
      today: "Today",
      month: "Month",
      week: "Week",
      day: "Day",
      list: "List",

      // ===== SETTINGS =====
      accountSettings: "Account Settings",
      changeCover: "Change Cover",
      changePhoto: "Change Photo",

      basicInfo: "Basic Information",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      phone: "Phone",
      bio: "Bio",

      preferences: "Preferences",
      emailNotifications: "Email Notifications",
      emailNotificationsDesc:
        "Receive email updates about your account activity",

      themePreference: "Theme Preference",
      themePreferenceDesc: "Choose your preferred display theme",

      language: "Language",
      languageDesc: "Select your preferred language",

      light: "Light",
      dark: "Dark",
      auto: "Auto",

      changePassword: "Change Password",
      currentPassword: "Current Password",
      newPassword: "New Password",
      confirmPassword: "Confirm New Password",
      updatePassword: "Update Password",
      passwordUpdated: "Password updated!",
      fillAllFields: "Fill all fields",
      passwordMismatch: "Passwords do not match",

      deleteAccount: "Delete Account",
      type: "Type",
      deleteConfirm: "DELETE",
      toConfirm: "to confirm:",
      deleteAccountDesc:
        "This action is permanent. All your data, settings, and goals will be permanently removed.",
      typeDeleteConfirm: "Type DELETE to confirm:",
      accountDeleted: "Account deleted",
      deleteAccountButton: "Delete account and reset all data",

      // ===== GOALS =====
      allGoals: "All Goals",
      favoriteGoals: "Favorites Goals",
      noGoals: "No goals found",
      deleteGoals: "Delete Goals",
      week: "Week",
      days: "Days",
      deleteGoalsDesc:
        "This action is permanent. All selected goals will be permanently removed.",

      // ===== CATEGORIES =====
      noGoalsText: "No goals",
      goalsCount: "goals",
      favorites: "Favorites",

      // ===== CREATE GOAL =====
      createGoalDesc: "Set up a new goal to track your progress",

      title: "Title *",
      titlePlaceholder: "e.g. Reading Challenge",
      category: "Category *",
      selectCategory: "Select a category",
      createCategory: "Create Category",
      newCategoryName: "New Category Name",

      health: "Health",
      study: "Study",
      work: "Work",
      personal: "Personal",
      fitness: "Fitness",
      finance: "Finance",

      goalType: "Goal Type *",
      daily: "Daily",
      countBased: "Count-based",
      timeBased: "Time-based",

      target: "Target *",
      amount: "Amount",
      mins: "Mins",
      steps: "Steps",

      startDate: "Start Date",
      endDate: "End Date",
      notes: "Notes",

      createGoalBtn: "Create Goal",
      updateGoalBtn: "Update Goal",
      goalCreated: "Goal created successfully",
      goalUpdated: "Goal updated successfully",

      // ===== GOAL DETAILS =====
      goalNotFound: "Goal not found",
      backToGoals: "← Back to Goals",
      noDescription: "No description",
      leftArrow: "←",
      rightArrow: "→",

      weeklyCheckin: "Weekly Check-in",
      markComplete: "Mark as Complete",
      goalAchievedToday: "✓ Goal Achieved for Today",

      categoryLabel: "CATEGORY",
      deadline: "DEADLINE",
      noDeadline: "No deadline",
      overallProgress: "OVERALL PROGRESS",
    },
  },

  fa: {
    translation: {
      // ===== GLOBAL =====
      cancel: "لغو",
      save: "ذخیره",
      delete: "حذف",
      update: "به‌روزرسانی",

      // ===== SIDEBAR =====
      goalTracker: "پیگیری اهداف",
      dashboard: "داشبورد",
      analytics: "تحلیل‌ها",
      categories: "دسته‌بندی‌ها",
      goals: "اهداف",
      createGoal: "ایجاد هدف",
      calendar: "تقویم",
      settings: "تنظیمات",
      logout: "خروج",

      // ===== TOPBAR =====
      searchPlaceholder: "جستجو...",
      en: "انگلیسی",
      fa: "فارسی",
      ar: "عربی",
      signedInAs: "وارد شده به عنوان",
      noEmailSet: "ایمیل تنظیم نشده",
      profile: "پروفایل",
      signOut: "خروج از حساب",

      // ===== DASHBOARD =====
      dashboardTitle: "خوش برگشتی",
      dashboardDesc: "پیشرفت، روند و اهداف خود را در یکجا دنبال کنید",
      addGoal: "+ افزودن هدف",
      activeGoals: "اهداف فعال",
      streakDays: "روزهای پشت‌سرهم",
      keepItGoing: "🔥 ادامه بده",
      totalXP: "کل XP",
      newPersonalRecord: "رکورد جدید!",
      momentumBuilding: "⚡ در حال پیشرفت",
      overallP: "پیشرفت کلی",
      completed: "تکمیل شده",
      active: "فعال",
      inactive: "غیرفعال",
      weeklyAnalytics: "تحلیل هفتگی اهداف",
      weeklyAnalyticsDesc: "فعالیت هفتگی اهداف و XP",
      goalsB: "تقسیم‌بندی اهداف",
      goalsBDesc: "نوع و دسته‌بندی اهداف",
      recentG: "اهداف اخیر",
      viewAll: "مشاهده همه ←",
      inProgress: "در حال انجام",
      sort: "مرتب‌سازی",

      // ===== ANALYTICS =====
      analyticsDesc: "تحلیل عمیق عملکرد و رفتار شما",
      mostProgress: "بیشترین پیشرفت",
      mostXP: "بیشترین XP",
      mostActiveDays: "فعال‌ترین روزها",
      completed: "اهداف تکمیل‌شده",
      growth: "رشد XP",
      last7: "XP (۷ روز اخیر)",
      goalStat: "وضعیت اهداف",
      vs: "اهداف در مقابل XP",
      weeklyAP: "پیشرفت فعالیت هفتگی",
      inActive: "غیرفعال",
      completed0: "تکمیل شده: 0",
      inProg0: "در حال انجام: 0",
      inAct0: "غیرفعال: 0",

      // ===== CALENDAR =====
      calendar: "تقویم",
      events: "رویدادها",
      addEvent: "افزودن رویداد",
      eventTitle: "عنوان رویداد",
      eventCreated: "رویداد ایجاد شد",
      eventDeleted: "رویداد حذف شد",
      today: "امروز",
      month: "ماه",
      week: "هفته",
      day: "روز",
      list: "لیست",

      // ===== SETTINGS =====
      accountSettings: "تنظیمات حساب",
      changeCover: "تغییر کاور",
      changePhoto: "تغییر عکس",

      basicInfo: "اطلاعات پایه",
      firstName: "نام",
      lastName: "نام خانوادگی",
      email: "ایمیل",
      phone: "تلفن",
      bio: "بیو",

      preferences: "تنظیمات",
      emailNotifications: "اعلان‌های ایمیل",
      emailNotificationsDesc: "دریافت اعلان‌های فعالیت حساب",

      themePreference: "حالت نمایش",
      themePreferenceDesc: "انتخاب تم دلخواه",

      language: "زبان",
      languageDesc: "انتخاب زبان",

      light: "روشن",
      dark: "تیره",
      auto: "خودکار",

      changePassword: "تغییر رمز عبور",
      currentPassword: "رمز فعلی",
      newPassword: "رمز جدید",
      confirmPassword: "تأیید رمز",
      updatePassword: "به‌روزرسانی رمز",
      passwordUpdated: "رمز به‌روزرسانی شد",
      fillAllFields: "تمام فیلدها را پر کنید",
      passwordMismatch: "رمزها مطابقت ندارند",

      deleteAccount: "حذف حساب",
      deleteAccountDesc:
        "این عملیات دائمی است و تمام اطلاعات حذف می‌شود.",
      type: "را تایپ کنید",
      deleteConfirm: "DELETE",
      toConfirm: "برای تأیید: ",
      typeDeleteConfirm: "برای تأیید DELETE را تایپ کنید:",
      accountDeleted: "حساب حذف شد",
      deleteAccountButton: "حذف حساب و پاک‌سازی همه داده‌ها",

      // ===== GOALS =====
      allGoals: "همه اهداف",
      favoriteGoals: "اهداف مورد علاقه",
      noGoals: "هیچ هدفی یافت نشد",
      deleteGoals: "حذف اهداف",
      week: "هفته",
      days: "روز",
      deleteGoalsDesc: "این عملیات دائمی است.",

      // ===== CATEGORIES =====
      categories: "دسته‌بندی‌ها",
      noGoalsText: "هیچ هدفی نیست",
      goalsCount: "هدف",
      favorites: "علاقه‌مندی‌ها",

      // ===== CREATE GOAL =====
      createGoal: "ایجاد هدف جدید",
      createGoalDesc: "یک هدف جدید برای پیگیری پیشرفت",

      title: "عنوان *",
      titlePlaceholder: "مثلاً: چالش مطالعه",
      category: "دسته‌بندی *",
      selectCategory: "انتخاب دسته‌بندی",
      createCategory: "ایجاد دسته‌بندی",
      newCategoryName: "نام دسته جدید",

      health: "سلامت",
      study: "مطالعه",
      work: "کار",
      personal: "شخصی",
      fitness: "تناسب اندام",
      finance: "مالی",

      goalType: "نوع هدف *",
      daily: "روزانه",
      countBased: "تعداد محور",
      timeBased: "زمان محور",

      target: "هدف *",
      amount: "مقدار",
      days: "روز",
      mins: "دقیقه",
      steps: "قدم",

      startDate: "تاریخ شروع",
      endDate: "تاریخ پایان",
      notes: "یادداشت",

      createGoalBtn: "ایجاد هدف",
      updateGoalBtn: "به‌روزرسانی هدف",
      goalCreated: "هدف با موفقیت ایجاد شد",
      goalUpdated: "هدف به‌روزرسانی شد",

      // ===== GOAL DETAILS =====
      goalNotFound: "هدف پیدا نشد",
      backToGoals: " بازگشت به اهداف ←",
      noDescription: "بدون توضیح",
      leftArrow: "→",
      rightArrow: "←",

      weeklyCheckin: "بررسی هفتگی",
      markComplete: "علامت‌گذاری به عنوان تکمیل",
      goalAchievedToday: "✓ هدف امروز انجام شد",

      categoryLabel: "دسته‌بندی",
      deadline: "مهلت",
      noDeadline: "بدون مهلت",
      overallProgress: "پیشرفت کلی",

    },
  },

  ar: {
    translation: {
      // ===== GLOBAL =====
      cancel: "إلغاء",
      save: "حفظ",
      delete: "حذف",
      update: "تحديث",

      // ===== SIDEBAR =====
      goalTracker: "متابعة الأهداف",
      dashboard: "لوحة التحكم",
      analytics: "التحليلات",
      categories: "الفئات",
      goals: "الأهداف",
      createGoal: "إنشاء هدف",
      calendar: "التقويم",
      settings: "الإعدادات",
      logout: "تسجيل الخروج",

      // ===== TOPBAR =====
      searchPlaceholder: "بحث...",
      en: "الإنجليزية",
      fa: "الفارسية",
      ar: "العربية",
      signedInAs: "مسجل الدخول كـ",
      noEmailSet: "لا يوجد بريد إلكتروني",
      profile: "الملف الشخصي",
      signOut: "تسجيل الخروج",

      // ===== DASHBOARD =====
      dashboardTitle: "مرحبًا بعودتك",
      dashboardDesc: "تابع تقدمك وأهدافك في مكان واحد",
      addGoal: "+ إضافة هدف",
      activeGoals: "الأهداف النشطة",
      streakDays: "أيام متتالية",
      keepItGoing: "🔥 استمر",
      totalXP: "إجمالي XP",
      newPersonalRecord: "رقم قياسي جديد!",
      momentumBuilding: "⚡ زخم متزايد",
      overallP: "التقدم الكلي",
      completed: "مكتمل",
      active: "نشط",
      inactive: "غير نشط",
      weeklyAnalytics: "تحليل الأهداف الأسبوعي",
      weeklyAnalyticsDesc: "نشاط الأهداف و XP الأسبوعي",
      goalsB: "توزيع الأهداف",
      goalsBDesc: "أنواع وتصنيفات الأهداف",
      recentG: "الأهداف الأخيرة",
      viewAll: "عرض الكل →",
      inProgress: "قيد التنفيذ",
      sort: "ترتيب",

      // ===== ANALYTICS =====
      analyticsDesc: "تحليل عميق لأدائك وسلوكك",
      mostProgress: "أكثر تقدم",
      mostXP: "أكثر XP",
      mostActiveDays: "أكثر الأيام نشاطًا",
      completed: "الأهداف المكتملة",
      growth: "نمو XP",
      last7: "XP (آخر 7 أيام)",
      goalStat: "حالة الأهداف",
      vs: "الأهداف مقابل XP",
      weeklyAP: "تقدم النشاط الأسبوعي",
      inActive: "غير نشط",
      completed0: "مكتمل: 0",
      inProg0: "قيد التنفيذ: 0",
      inAct0: "غير نشط: 0",

      // ===== CALENDAR =====
      calendar: "التقويم",
      events: "الأحداث",
      addEvent: "إضافة حدث",
      eventTitle: "عنوان الحدث",
      eventCreated: "تم إنشاء الحدث",
      eventDeleted: "تم حذف الحدث",
      today: "اليوم",
      month: "شهر",
      week: "أسبوع",
      day: "يوم",
      list: "قائمة",

      // ===== SETTINGS =====
      accountSettings: "إعدادات الحساب",
      changeCover: "تغيير الغلاف",
      changePhoto: "تغيير الصورة",

      basicInfo: "المعلومات الأساسية",
      firstName: "الاسم الأول",
      lastName: "اسم العائلة",
      email: "البريد الإلكتروني",
      phone: "الهاتف",
      bio: "نبذة",

      preferences: "التفضيلات",
      emailNotifications: "إشعارات البريد الإلكتروني",
      emailNotificationsDesc: "استلام إشعارات نشاط الحساب",

      themePreference: "المظهر",
      themePreferenceDesc: "اختر نمط العرض",

      language: "اللغة",
      languageDesc: "اختر اللغة",

      light: "فاتح",
      dark: "داكن",
      auto: "تلقائي",

      changePassword: "تغيير كلمة المرور",
      currentPassword: "كلمة المرور الحالية",
      newPassword: "كلمة المرور الجديدة",
      confirmPassword: "تأكيد كلمة المرور",
      updatePassword: "تحديث كلمة المرور",
      passwordUpdated: "تم تحديث كلمة المرور",
      fillAllFields: "يرجى ملء جميع الحقول",
      passwordMismatch: "كلمات المرور غير متطابقة",

      deleteAccount: "حذف الحساب",
      deleteAccountDesc:
        "هذا الإجراء دائم وسيتم حذف جميع البيانات.",
      typeDeleteConfirm: "اكتب DELETE للتأكيد:",
      accountDeleted: "تم حذف الحساب",
      deleteAccountButton: "حذف الحساب ومسح جميع البيانات",

      // ===== GOALS =====
      allGoals: "جميع الأهداف",
      favoriteGoals: "الأهداف المفضلة",
      noGoals: "لا توجد أهداف",
      deleteGoals: "حذف الأهداف",
      week: "أسبوع",
      days: "أيام",
      deleteGoalsDesc: "هذا الإجراء دائم.",

      // ===== CATEGORIES =====
      categories: "الفئات",
      noGoalsText: "لا توجد أهداف",
      goalsCount: "أهداف",
      favorites: "المفضلة",

      // ===== CREATE GOAL =====
      createGoal: "إنشاء هدف جديد",
      createGoalDesc: "قم بإعداد هدف جديد لتتبع تقدمك",

      title: "العنوان *",
      titlePlaceholder: "مثال: تحدي القراءة",
      category: "الفئة *",
      selectCategory: "اختر فئة",
      createCategory: "إنشاء فئة",
      newCategoryName: "اسم الفئة الجديدة",
      health: "الصحة",
      study: "الدراسة",
      work: "العمل",
      personal: "شخصي",
      fitness: "اللياقة",
      finance: "المالية",

      goalType: "نوع الهدف *",
      daily: "يومي",
      countBased: "حسب العدد",
      timeBased: "حسب الوقت",

      target: "الهدف *",
      amount: "الكمية",
      days: "أيام",
      mins: "دقائق",
      steps: "خطوات",

      startDate: "تاريخ البداية",
      endDate: "تاريخ النهاية",
      notes: "ملاحظات",

      createGoalBtn: "إنشاء الهدف",
      updateGoalBtn: "تحديث الهدف",
      goalCreated: "تم إنشاء الهدف بنجاح",
      goalUpdated: "تم تحديث الهدف بنجاح",

      // ===== GOAL DETAILS =====
      goalNotFound: "لم يتم العثور على الهدف",
      backToGoals: "← العودة إلى الأهداف",
      noDescription: "لا يوجد وصف",
      leftArrow: "→",
      rightArrow: "←",

      weeklyCheckin: "المراجعة الأسبوعية",
      markComplete: "تحديد كمكتمل",
      goalAchievedToday: "✓ تم تحقيق الهدف اليوم",

      categoryLabel: "الفئة",
      deadline: "الموعد النهائي",
      noDeadline: "لا يوجد موعد نهائي",
      overallProgress: "التقدم الكلي",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("language") || "en",
  fallbackLng: "en",
  supportedLngs: ["en", "fa", "ar"], // ✅ added safety
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false, // ✅ avoids rendering issues
  },
});

export default i18n;