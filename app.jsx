import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Menu, X, Globe, Lock, Code, Server, Briefcase, Award, Mail, Phone, Linkedin, Github, Laptop, Network, Settings, Handshake, Megaphone, Rocket, Lightbulb, Headset, MessageSquare, User, Bot, Trash, Edit2, PlusCircle, LogOut, Check, XCircle, Paperclip, FileText, Send, Sparkles, RefreshCcw, Clipboard, Download } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, addDoc, setDoc, updateDoc, deleteDoc, onSnapshot, collection, query, where, getDocs } from 'firebase/firestore';

// Global variables for Firebase configuration (provided by Canvas)
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Admin credentials (hardcoded for this example)
const ADMIN_USERNAME = 'hashed';
const ADMIN_PASSWORD = 'hashed 773';

const renderMarkdown = (text) => {
  if (!text) return null;
  const parts = text.split('\n').map((line, lineIndex) => {
    const boldRegex = /\*\*(.*?)\*\*/g;
    const elements = [];
    let lastIndex = 0;
    let match;

    while ((match = boldRegex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        elements.push(line.substring(lastIndex, match.index));
      }
      elements.push(<b key={`bold-${lineIndex}-${match.index}`}>{match[1]}</b>);
      lastIndex = boldRegex.lastIndex;
    }

    if (lastIndex < line.length) {
      elements.push(line.substring(lastIndex));
    }
    
    return (
      <span key={`line-${lineIndex}`}>
        {elements}
        {lineIndex < text.split('\n').length - 1 && <br />}
      </span>
    );
  });
  return <div className="whitespace-pre-wrap">{parts}</div>;
};

// Main App component
const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const setupFirebase = async () => {
      try {
        if (initialAuthToken) {
          await signInWithCustomToken(auth, initialAuthToken);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Firebase Auth error:", error);
      }
    };
    setupFirebase();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(crypto.randomUUID());
      }
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  const navLinks = [
    { name: 'هويتنا', id: 'about' },
    { name: 'خدماتنا', id: 'services' },
    { name: 'الباقات', id: 'pricing' },
    { name: 'قصص النجاح', id: 'success-stories' },
    { name: 'لماذا نحن', id: 'why-us' },
    { name: 'تواصل معنا', id: 'contact' },
  ];

  const handleScroll = () => {
    const sections = navLinks.map(link => document.getElementById(link.id));
    const currentSection = sections.find(section => {
      if (section) {
        const rect = section.getBoundingClientRect();
        return rect.top >= 0 && rect.top <= 100;
      }
      return false;
    });
    if (currentSection) {
      setActiveSection(currentSection.id);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };
  
  if (!isPageLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 text-gray-200 font-sans min-h-screen rtl text-right" dir="rtl">
      {/* Header/Navbar */}
      <header className="fixed top-0 left-0 w-full bg-gray-950/80 backdrop-blur-md z-50 shadow-lg">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex-1 text-2xl font-bold text-teal-400">
            HashTik
          </div>
          <div className="hidden md:flex space-x-8 space-x-reverse">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`text-lg transition duration-300 font-medium ${activeSection === link.id ? 'text-teal-400 border-b-2 border-teal-400' : 'text-gray-300 hover:text-teal-400'}`}
              >
                {link.name}
              </button>
            ))}
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 hover:text-teal-400 transition">
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </nav>
        {isMenuOpen && (
          <div className="md:hidden bg-gray-900 absolute top-full left-0 w-full p-4 shadow-lg transition-all duration-300 ease-in-out">
            <div className="flex flex-col space-y-4">
              {navLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`text-lg text-right font-medium transition duration-300 ${activeSection === link.id ? 'text-teal-400' : 'text-gray-300 hover:text-teal-400'}`}
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="pt-24">
        {/* About Section */}
        <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900 border-b border-gray-800">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-5xl font-extrabold text-white mb-4 leading-tight">
                HashTik: شريكك التقني لبناء حلول آمنة ومستدامة
              </h1>
              <p className="text-xl text-gray-400 max-w-4xl mx-auto">
                هل سئمت من الحلول التقنية المجزأة التي تتركك معقدًا ومحبطًا؟ نحن في **HashTik** نؤمن بأن النجاح الرقمي لأي مشروع يبدأ من أساس متين. مهمتنا هي سد الفجوة بين الأفكار البرمجية المبتكرة والبنية التحتية التقنية الموثوقة والآمنة. نقدم حلولاً متكاملة تجمع بين تطوير البرامج وتأمين الشبكات، مما يضمن لعملائنا التركيز على أعمالهم دون القلق بشأن الجانب التقني.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 text-center">
              <div className="bg-gray-800 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <Globe size={48} className="text-teal-400 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-2">رؤيتنا</h2>
                <p className="text-gray-400">
                  أن نكون الشريك التقني المفضل للشركات الناشئة، نقدم حلولًا متكاملة وآمنة تمكنها من تحقيق أهدافها الرقمية.
                </p>
              </div>
              <div className="bg-gray-800 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <Lock size={48} className="text-teal-400 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-2">رسالتنا</h2>
                <p className="text-gray-400">
                  مهمتنا هي سد الفجوة بين الأفكار البرمجية المبتكرة والبنية التحتية التقنية الموثوقة والآمنة.
                </p>
              </div>
            </div>
            <div className="mt-20">
              <h2 className="text-4xl font-bold text-center text-white mb-10">لماذا نحن مختلفون؟ (النهج الفريد)</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-gray-800 p-8 rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-300">
                  <Code size={48} className="text-teal-400 mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">الدمج بين الأمان والتطوير</h3>
                  <p className="text-gray-400">
                    خبرتنا في الشبكات والأمان تندمج مع مهاراتنا في البرمجة لإنشاء منتجات ليست فقط فعالة وظيفيًا، بل آمنة ومستدامة.
                  </p>
                </div>
                <div className="bg-gray-800 p-8 rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-300">
                  <Briefcase size={48} className="text-teal-400 mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">نهج "أظهر عملك!"</h3>
                  <p className="text-gray-400">
                    نعمل بشفافية كاملة، نشاركك كل خطوة في العملية، من الفكرة الأولية إلى الإطلاق والدعم، لتكون شريكًا حقيقيًا في النجاح.
                  </p>
                </div>
                <div className="bg-gray-800 p-8 rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-300">
                  <Award size={48} className="text-teal-400 mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">الجودة أولاً</h3>
                  <p className="text-gray-400">
                    نحن لا نقدم مجرد منتج، بل نقدم حلاً متينًا ومستدامًا، مصممًا ليعمل بكفاءة لفترة طويلة.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-20">
              <h2 className="text-4xl font-bold text-center text-white mb-10">قيمنا الأساسية</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="flex items-center space-x-4 space-x-reverse bg-gray-800 p-6 rounded-xl shadow-md">
                  <Handshake size={32} className="text-teal-400 flex-shrink-0" />
                  <p className="text-lg font-medium text-white">الشفافية</p>
                </div>
                <div className="flex items-center space-x-4 space-x-reverse bg-gray-800 p-6 rounded-xl shadow-md">
                  <Settings size={32} className="text-teal-400 flex-shrink-0" />
                  <p className="text-lg font-medium text-white">الكفاءة</p>
                </div>
                <div className="flex items-center space-x-4 space-x-reverse bg-gray-800 p-6 rounded-xl shadow-md">
                  <Lock size={32} className="text-teal-400 flex-shrink-0" />
                  <p className="text-lg font-medium text-white">الأمان</p>
                </div>
                <div className="flex items-center space-x-4 space-x-reverse bg-gray-800 p-6 rounded-xl shadow-md">
                  <Lightbulb size={32} className="text-teal-400 flex-shrink-0" />
                  <p className="text-lg font-medium text-white">التعلم المستمر</p>
                </div>
              </div>
            </div>
            <div className="mt-20">
              <h2 className="text-4xl font-bold text-center text-white mb-10">فريقنا (بناء الثقة)</h2>
              <div className="bg-gray-800 p-8 rounded-2xl shadow-xl max-w-2xl mx-auto text-center">
                <img
                  src="https://placehold.co/150x150/1f2937/d1d5db?text=HH"
                  alt="Hashed Hassan Zaeed Albaham"
                  className="rounded-full mx-auto mb-4 border-4 border-teal-400"
                />
                <h3 className="text-3xl font-bold text-white mb-2">Hashed Hassan Zaeed Albaham</h3>
                <p className="text-lg text-teal-400 mb-4">المؤسس والمهندس الرئيسي</p>
                <p className="text-gray-400 leading-relaxed">
                  مهندس إلكترونيات واتصالات بخبرة واسعة في إدارة الشبكات والسيرفرات، إلى جانب مهارات قوية في البرمجة وتطوير الأنظمة. يمتلك شهادات احترافية من Google و AWS في مجال الأمن السيبراني والحوسبة السحابية. شغفه بدمج الأمان مع البرمجة كان الدافع وراء تأسيس HashTik.
                </p>
              </div>
              <div className="mt-8 text-center max-w-4xl mx-auto">
                <h4 className="text-2xl font-bold text-white mb-4">فريق الخبراء الداعم</h4>
                <p className="text-gray-400">
                  نعمل مع شبكة من الخبراء في مجالات تصميم تجربة المستخدم (UX)، وتطوير الواجهات الأمامية (Front-end)، لتقديم حلول متكاملة وعصرية.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-16">خدماتنا ومنتجاتنا</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-800 p-8 rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-300">
                <Laptop size={48} className="text-teal-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">تطوير الويب وتطبيقات الأعمال</h3>
                <ul className="text-gray-400 text-right space-y-2 list-disc list-inside">
                  <li>المواقع التعريفية</li>
                  <li>المتاجر الإلكترونية</li>
                  <li>تطبيقات الويب المخصصة</li>
                </ul>
                <p className="mt-4 text-sm text-gray-500">
                  التقنيات المستخدمة: **Python (Django)**، **PHP**، **JavaScript (React, Vue.js)**، **WordPress**.
                </p>
              </div>
              <div className="bg-gray-800 p-8 rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-300">
                <Network size={48} className="text-teal-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">حلول الشبكات والبنية التحتية</h3>
                <ul className="text-gray-400 text-right space-y-2 list-disc list-inside">
                  <li>تصميم الشبكات</li>
                  <li>تأمين الشبكات</li>
                  <li>إدارة أجهزة الشبكات</li>
                </ul>
                <p className="mt-4 text-sm text-gray-500">
                  التقنيات المستخدمة: **TCP/IP**، **BGP**، **OSPF**، **VLANs**.
                </p>
              </div>
              <div className="bg-gray-800 p-8 rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-300">
                <Server size={48} className="text-teal-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">إدارة السيرفرات والحلول السحابية</h3>
                <ul className="text-gray-400 text-right space-y-2 list-disc list-inside">
                  <li>تهيئة سيرفرات Linux</li>
                  <li>استضافة سحابية</li>
                  <li>أتمتة DevOps</li>
                  <li>مراقبة الأداء</li>
                </ul>
                <p className="mt-4 text-sm text-gray-500">
                  التقنيات المستخدمة: **AWS**، **Linode**، **DigitalOcean**، **Docker**، **Zabbix**.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900 border-t border-gray-800">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold text-center text-white mb-16">باقاتنا وخطط الأسعار</h2>
            {/* AI Powered Recommendation Feature */}
            <ServiceRecommender />
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="bg-gray-800 p-8 rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-300 flex flex-col justify-between">
                <div>
                  <h3 className="text-3xl font-bold text-teal-400 mb-2">باقة الانطلاق</h3>
                  <p className="text-lg text-gray-300 mb-4">لمشاريعك الأولى.</p>
                  <ul className="text-gray-400 text-right space-y-3 list-disc list-inside">
                    <li>موقع تعريفي بسيط (حتى 5 صفحات)</li>
                    <li>تصميم متجاوب</li>
                    <li>تهيئة سيرفر افتراضي (VPS)</li>
                    <li>حماية أساسية (شهادة SSL وجدار حماية)</li>
                    <li>دليل صيانة بسيط للموقع</li>
                  </ul>
                </div>
                <div className="mt-8 text-center">
                  <p className="text-xl font-bold text-white mb-2">السعر التقديري:</p>
                  <p className="text-3xl font-extrabold text-white">$1,000 - $2,500</p>
                  <p className="text-sm text-gray-500 mt-2">
                    مثال: مشروع مقهى "قهوتي"
                  </p>
                </div>
              </div>
              <div className="bg-teal-700/50 p-8 rounded-2xl shadow-xl border-2 border-teal-400 transform hover:scale-105 transition-transform duration-300 flex flex-col justify-between">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-2">باقة النمو</h3>
                  <p className="text-lg text-gray-200 mb-4">لتطبيق متكامل.</p>
                  <ul className="text-gray-200 text-right space-y-3 list-disc list-inside">
                    <li>تطبيق ويب مخصص (CRM أو متجر إلكتروني)</li>
                    <li>تهيئة سيرفر سحابي مع موازنة حمولة</li>
                    <li>حلول أمان متقدمة وحماية من هجمات DDoS</li>
                    <li>دعم فني لمدة 3 أشهر</li>
                  </ul>
                </div>
                <div className="mt-8 text-center">
                  <p className="text-xl font-bold text-white mb-2">السعر التقديري:</p>
                  <p className="text-3xl font-extrabold text-white">$3,000 - $8,000</p>
                  <p className="text-sm text-gray-300 mt-2">
                    مثال: مشروع "متجر الأمل"
                  </p>
                </div>
              </div>
              <div className="bg-gray-800 p-8 rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-300 flex flex-col justify-between">
                <div>
                  <h3 className="text-3xl font-bold text-teal-400 mb-2">الحلول المخصصة</h3>
                  <p className="text-lg text-gray-300 mb-4">لمشاريعك الفريدة.</p>
                  <ul className="text-gray-400 text-right space-y-3 list-disc list-inside">
                    <li>تطوير حلول سحابية متقدمة</li>
                    <li>تطبيق ويب أو خدمة برمجية من الصفر</li>
                    <li>إعداد بنية تحتية آمنة للشبكات المحلية</li>
                    <li>مراقبة مستمرة ودعم فني</li>
                  </ul>
                </div>
                <div className="mt-8 text-center">
                  <p className="text-xl font-bold text-white mb-2">السعر التقديري:</p>
                  <p className="text-3xl font-extrabold text-white">تقديري</p>
                  <p className="text-sm text-gray-500 mt-2">
                    بناءً على حجم وتعقيد المشروع.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories Section */}
        <section id="success-stories" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold text-center text-white mb-16">قصص نجاح وهمية</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gray-800 p-8 rounded-2xl shadow-xl">
                <h3 className="text-2xl font-bold text-teal-400 mb-2">FoodTrack</h3>
                <p className="text-lg text-white mb-4">"Taste of the City"</p>
                <div className="space-y-4 text-gray-400">
                  <div><span className="font-bold text-white">الوضع قبل:</span><p> سلسلة مطاعم تواجه تحديات في تتبع طلبات التوصيل، مما يؤدي إلى تأخيرات وشكاوى العملاء.</p></div>
                  <div><span className="font-bold text-white">التدخل:</span><p> بناء تطبيق ويب يستخدم **Python (Django)** للواجهة الخلفية و **JavaScript (Vue.js)** للواجهة الأمامية، مع تهيئة خادم سحابي آمن.</p></div>
                  <div><span className="font-bold text-white">النتيجة بعد:</span><p> زيادة رضا العملاء بنسبة **25%** وانخفاض أخطاء الطلبات بنسبة **15%**.</p></div>
                </div>
              </div>
              <div className="bg-gray-800 p-8 rounded-2xl shadow-xl">
                <h3 className="text-2xl font-bold text-teal-400 mb-2">SecureLink</h3>
                <p className="text-lg text-white mb-4">"Innovate Engineering"</p>
                <div className="space-y-4 text-gray-400">
                  <div><span className="font-bold text-white">الوضع قبل:</span><p> شركة تعاني من ضعف أمان شبكتها الداخلية، مما يعرض بياناتها الحساسة للمخاطر.</p></div>
                  <div><span className="font-bold text-white">التدخل:</span><p> تصميم وتأمين الشبكة باستخدام أجهزة **MikroTik** و **Ubiquiti**، وإعداد شبكة افتراضية خاصة (VLANs).</p></div>
                  <div><span className="font-bold text-white">النتيجة بعد:</span><p> حماية كاملة للبيانات، وزيادة استقرار الشبكة، وتقديم تقارير أمنية شهرية للمديرين.</p></div>
                </div>
              </div>
              <div className="bg-gray-800 p-8 rounded-2xl shadow-xl">
                <h3 className="text-2xl font-bold text-teal-400 mb-2">GreenHarvest</h3>
                <p className="text-lg text-white mb-4">مزرعة "GreenHarvest"</p>
                <div className="space-y-4 text-gray-400">
                  <div><span className="font-bold text-white">الوضع قبل:</span><p> يريدون الوصول إلى سوق أوسع لبيع منتجاتهم العضوية مباشرةً.</p></div>
                  <div><span className="font-bold text-white">التدخل:</span><p> بناء متجر إلكتروني بسيط وموثوق باستخدام **WordPress** و **WooCommerce**، مع تأمين السيرفر.</p></div>
                  <div><span className="font-bold text-white">النتيجة بعد:</span><p> زيادة المبيعات بنسبة **40%** في أول 3 أشهر، وتوسيع قاعدة العملاء.</p></div>
                </div>
              </div>
              <div className="bg-gray-800 p-8 rounded-2xl shadow-xl">
                <h3 className="text-2xl font-bold text-teal-400 mb-2">EduPortal</h3>
                <p className="text-lg text-white mb-4">أكاديمية صغيرة</p>
                <div className="space-y-4 text-gray-400">
                  <div><span className="font-bold text-white">الوضع قبل:</span><p> أكاديمية صغيرة تحتاج إلى منصة تعليمية عبر الإنترنت لإدارة الدورات والطلاب.</p></div>
                  <div><span className="font-bold text-white">التدخل:</span><p> بناء منصة تعليمية متكاملة باستخدام نظام **Moodle**، مع تخصيص المظهر وتأمين قاعدة البيانات.</p></div>
                  <div><span className="font-bold text-white">النتيجة بعد:</span><p> تمكنت الأكاديمية من الوصول إلى 1000 طالب جديد، وزيادة الإيرادات بنسبة **30%**.</p></div>
                </div>
              </div>
              <div className="bg-gray-800 p-8 rounded-2xl shadow-xl">
                <h3 className="text-2xl font-bold text-teal-400 mb-2">EventFlow</h3>
                <p className="text-lg text-white mb-4">شركة تنظيم فعاليات</p>
                <div className="space-y-4 text-gray-400">
                  <div><span className="font-bold text-white">الوضع قبل:</span><p> شركة تنظيم فعاليات تواجه صعوبة في إدارة الحجوزات والمدفوعات يدويًا.</p></div>
                  <div><span className="font-bold text-white">التدخل:</span><p> تطوير نظام ويب مخصص بلغة **PHP**، يتيح للعملاء حجز الفعاليات والدفع إلكترونيًا.</p></div>
                  <div><span className="font-bold text-white">النتيجة بعد:</span><p> تبسيط عملية الحجز، وتوفير **20 ساعة عمل شهريًا** لفريق الإدارة.</p></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Us Section */}
        <section id="why-us" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900 border-t border-gray-800">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold text-center text-white mb-16">لماذا تختارنا؟</h2>
            <div className="mb-16">
              <h3 className="text-3xl font-bold text-white text-center mb-10">نهجنا في العمل (العملية)</h3>
              <div className="grid md:grid-cols-5 gap-8 items-center relative">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-teal-400 hidden md:block" />
                <div className="relative z-10 flex flex-col items-center text-center">
                  <Megaphone size={48} className="text-teal-400 bg-gray-900 p-2 rounded-full mb-2 border-2 border-teal-400" />
                  <p className="text-lg text-white font-semibold">1. الاكتشاف</p>
                </div>
                <div className="relative z-10 flex flex-col items-center text-center">
                  <Handshake size={48} className="text-teal-400 bg-gray-900 p-2 rounded-full mb-2 border-2 border-teal-400" />
                  <p className="text-lg text-white font-semibold">2. التخطيط</p>
                </div>
                <div className="relative z-10 flex flex-col items-center text-center">
                  <Laptop size={48} className="text-teal-400 bg-gray-900 p-2 rounded-full mb-2 border-2 border-teal-400" />
                  <p className="text-lg text-white font-semibold">3. التطوير</p>
                </div>
                <div className="relative z-10 flex flex-col items-center text-center">
                  <Rocket size={48} className="text-teal-400 bg-gray-900 p-2 rounded-full mb-2 border-2 border-teal-400" />
                  <p className="text-lg text-white font-semibold">4. الاختبار والإطلاق</p>
                </div>
                <div className="relative z-10 flex flex-col items-center text-center">
                  <Headset size={48} className="text-teal-400 bg-gray-900 p-2 rounded-full mb-2 border-2 border-teal-400" />
                  <p className="text-lg text-white font-semibold">5. الدعم والصيانة</p>
                </div>
              </div>
            </div>
            <div className="mb-16">
              <h3 className="text-3xl font-bold text-white text-center mb-10">أسئلة شائعة (FAQ)</h3>
              <div className="max-w-4xl mx-auto space-y-4">
                <FaqItem question="كم يستغرق بناء موقع ويب؟" answer="يعتمد على تعقيد المشروع، لكن عادة ما بين 4-8 أسابيع." />
                <FaqItem question="هل تقدمون الدعم بعد الإطلاق؟" answer="نعم، نقدم دعمًا فنيًا لضمان استمرارية عمل مشروعك، ونقدم أيضًا عقود صيانة سنوية." />
                <FaqItem question="ما هي طرق الدفع المتاحة؟" answer="نقبل التحويل البنكي، والدفع عبر PayPal، ووسائل أخرى يتم الاتفاق عليها." />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white text-center mb-10">شهادات عملائنا</h3>
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="bg-gray-800 p-8 rounded-2xl shadow-xl flex flex-col items-center text-center">
                  <p className="text-lg font-medium text-white mb-2">أحمد، صاحب "FoodTrack"</p>
                  <p className="text-gray-400 italic">"خدمة HashTik غيرت طريقة عملنا، الأمان الذي يوفره Hashed في الشبكة لا مثيل له. لقد وثقنا به ثقة كاملة وهو أهل لذلك."</p>
                </div>
                <div className="bg-gray-800 p-8 rounded-2xl shadow-xl flex flex-col items-center text-center">
                  <p className="text-lg font-medium text-white mb-2">سارة، مديرة "EduPortal"</p>
                  <p className="text-gray-400 italic">"منصة EduPortal التي صممها لنا Hashed ساهمت في نمو أكاديميتنا بشكل كبير ووصلنا إلى عدد أكبر من الطلاب. شكراً لكم على هذا الجهد."</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Contact Section */}
        <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-950">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-4">تواصل معنا</h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              في HashTik، نحن لا نبيع خدمات، بل نقدم حلولًا آمنة ومستدامة. الآن، حان دورك لتبدأ.
            </p>
            <div className="flex flex-col items-center space-y-6">
              <div className="flex items-center space-x-4 space-x-reverse">
                <Phone size={24} className="text-teal-400" />
                <p className="text-lg text-white">+967773180974</p>
              </div>
              <div className="flex items-center space-x-4 space-x-reverse">
                <Mail size={24} className="text-teal-400" />
                <p className="text-lg text-white">hashedhassanzaeed222@gmail.com</p>
              </div>
              <div className="flex items-center space-x-6 space-x-reverse">
                <a href="https://linkedin.com/in/hashed-albaham" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-teal-400 transition">
                  <Linkedin size={36} />
                </a>
                <a href="https://github.com/Hashed-Albaham" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-teal-400 transition">
                  <Github size={36} />
                </a>
              </div>
            </div>
            <footer className="mt-16 text-center text-gray-500 text-sm">
              <p>&copy; 2025 HashTik. جميع الحقوق محفوظة.</p>
              <div className="flex justify-center space-x-4 space-x-reverse mt-2">
                <p>التقنيات: **AWS Cloud**، **MikroTik RouterOS**، **WordPress**.</p>
                <p>المنهج: مستوحى من كتاب "Show Your Work!" لـ **Austin Kleon**.</p>
              </div>
            </footer>
          </div>
        </section>
      </main>

      {/* Floating Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-4 z-50">
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="bg-teal-600 text-white p-4 rounded-full shadow-lg hover:bg-teal-500 transition-colors"
          aria-label="Open Chatbot"
        >
          <MessageSquare size={28} />
        </button>
        <button
          onClick={() => setIsAdminOpen(!isAdminOpen)}
          className="bg-gray-700 text-white p-4 rounded-full shadow-lg hover:bg-gray-600 transition-colors"
          aria-label="Open Admin Panel"
        >
          <Settings size={28} />
        </button>
      </div>

      {/* Chatbot Modal */}
      {isAuthReady && isChatOpen && <Chatbot userId={userId} onClose={() => setIsChatOpen(false)} />}

      {/* Admin Panel Modal */}
      {isAuthReady && isAdminOpen && <AdminPanel onClose={() => setIsAdminOpen(false)} />}
    </div>
  );
};

// FaqItem component
const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      <button
        className="flex justify-between items-center w-full p-6 text-white font-semibold text-lg bg-gray-800 hover:bg-gray-700 transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <ChevronDown size={24} className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
      </button>
      {isOpen && (
        <div className="p-6 bg-gray-900 text-gray-400 text-lg transition-all duration-300 ease-in-out">
          {answer}
        </div>
      )}
    </div>
  );
};

// ServiceRecommender component
const ServiceRecommender = () => {
  const [projectDescription, setProjectDescription] = useState('');
  const [recommendation, setRecommendation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRecommend = async () => {
    setIsLoading(true);
    setRecommendation(null);
    const packages = [
      "باقة الانطلاق: لمشاريعك الأولى. تتضمن موقع تعريفي بسيط (حتى 5 صفحات) مع تصميم متجاوب، وتهيئة سيرفر افتراضي (VPS)، وحماية أساسية (شهادة SSL وجدار حماية)، ودليل صيانة بسيط للموقع.",
      "باقة النمو: لتطبيق متكامل. تتضمن تطبيق ويب مخصص (مثال: نظام لإدارة العملاء CRM أو متجر إلكتروني)، وتهيئة سيرفر سحابي مع موازنة حمولة (Load Balancing)، وحلول أمان متقدمة وحماية من هجمات DDoS، ودعم فني لمدة 3 أشهر.",
      "الحلول المخصصة: لمشاريعك الفريدة. تتضمن تطوير حلول سحابية متقدمة (مثل خدمات AWS أو GCP)، وتطبيق ويب أو خدمة برمجية مصممة بالكامل من الصفر، وإعداد بنية تحتية آمنة للشبكات المحلية، ومراقبة مستمرة للأداء والدعم الفني."
    ];

    const prompt = `Based on the following project description, recommend the most suitable package from HashTik's services. The available packages are:
    1. ${packages[0]}
    2. ${packages[1]}
    3. ${packages[2]}
    
    Please provide the recommendation in Arabic, mentioning the package name. Do not add any extra text or conversation.
    
    Project Description:
    ${projectDescription}
    
    Recommendation:`;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
    };

    const apiKey = "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (result.candidates && result.candidates.length > 0 && result.candidates[0].content && result.candidates[0].content.parts) {
        setRecommendation(result.candidates[0].content.parts[0].text);
      } else {
        setRecommendation('عذراً، لم أتمكن من تقديم توصية. يُرجى المحاولة مرة أخرى.');
      }
    } catch (error) {
      console.error("Gemini API error:", error);
      setRecommendation('عذراً، حدث خطأ أثناء الاتصال بالخادم.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-2xl shadow-xl max-w-2xl mx-auto my-12">
      <h3 className="text-2xl font-bold text-white text-center mb-4 flex items-center justify-center space-x-2 space-x-reverse">
        أداة اقتراح الخدمات الذكية ✨
      </h3>
      <p className="text-gray-400 text-center mb-6">
        صف مشروعك وسيقوم الذكاء الاصطناعي باقتراح الباقة الأنسب لك.
      </p>
      <div className="space-y-4">
        <textarea
          className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          rows="5"
          placeholder="صف مشروعك هنا..."
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
        ></textarea>
        <button
          onClick={handleRecommend}
          className="w-full bg-teal-600 text-white p-3 rounded-lg hover:bg-teal-500 transition-colors font-bold flex items-center justify-center space-x-2 space-x-reverse disabled:opacity-50"
          disabled={isLoading || !projectDescription.trim()}
        >
          {isLoading ? (
            'جاري الاقتراح...'
          ) : (
            <>
              اقتراح الباقة المناسبة ✨
            </>
          )}
        </button>
      </div>
      {recommendation && (
        <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-teal-500 text-white">
          <p className="font-bold mb-2">التوصية:</p>
          <p>{recommendation}</p>
        </div>
      )}
    </div>
  );
};

// Chatbot component
const Chatbot = ({ userId, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const messagesEndRef = useRef(null);
  const chatContentRef = useRef(null);

  // Scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch chat history from Firestore
  useEffect(() => {
    if (!userId) return;
    const chatCollection = collection(db, `/artifacts/${appId}/users/${userId}/chatHistory`);
    const unsubscribe = onSnapshot(chatCollection, (snapshot) => {
      const chatHistory = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => a.timestamp - b.timestamp);
      setMessages(chatHistory);
    });
    return () => unsubscribe();
  }, [userId]);
  
  const systemPrompt = `أنت مساعد افتراضي اسمه HashTik Chat. مهمتك هي الإجابة عن أسئلة المستخدمين حول شركة HashTik وخدماتها ومنتجاتها وباقاتها وقيمها وفريقها. استخدم تنسيق Markdown (مثل: **نص سميك**، \\n) لتقسيم الإجابة إلى فقرات وعناوين فرعية عند الضرورة. إذا كان السؤال خارج نطاق عمل الشركة أو لا يتعلق بالموقع، أجب باحترافية بأنك لا تستطيع المساعدة في هذا الشأن واقترح على المستخدم التواصل مع فريق الدعم عبر قنوات التواصل المتاحة.

محتوى موقع HashTik:
- **الرؤية:** أن نكون الشريك التقني المفضل للشركات الناشئة، نقدم حلولًا متكاملة وآمنة تمكنها من تحقيق أهدافها الرقمية.
- **الرسالة:** مهمتنا هي سد الفجوة بين الأفكار البرمجية المبتكرة والبنية التحتية التقنية الموثوقة والآمنة.
- **الخدمات:**
  - **تطوير الويب وتطبيقات الأعمال:** المواقع التعريفية، المتاجر الإلكترونية، تطبيقات الويب المخصصة.
  - **حلول الشبكات والبنية التحتية:** تصميم الشبكات، تأمين الشبكات، إدارة أجهزة الشبكات.
  - **إدارة السيرفرات والحلول السحابية:** تهيئة سيرفرات Linux، استضافة سحابية، أتمتة DevOps، مراقبة الأداء.
- **الباقات:**
    - **باقة الانطلاق:** للمشاريع الأولى. السعر التقديري: 1,000 - 2,500 دولار.
    - **باقة النمو:** لتطبيق متكامل. السعر التقديري: 3,000 - 8,000 دولار.
    - **الحلول المخصصة:** للمشاريع الفريدة. السعر التقديري: تقديري بناءً على الحجم.
- **قيمنا:** الشفافية، الكفاءة، الأمان، التعلم المستمر.
- **الفريق:** المؤسس والمهندس الرئيسي هو Hashed Hassan Zaeed Albaham، مهندس إلكترونيات واتصالات بخبرة واسعة.
- **تواصل معنا:** الهاتف: +967773180974، البريد الإلكتروني: hashedhassanzaeed222@gmail.com، ملف LinkedIn: [linkedin.com/in/hashed-albaham](https://www.google.com/search?q=https://linkedin.com/in/hashed-albaham)، ملف GitHub: [github.com/Hashed-Albaham](https://www.google.com/search?q=https://github.com/Hashed-Albaham)`;

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    let userMessage = { role: 'user', content: input.trim(), timestamp: Date.now() };
    let fileData = null;

    if (e.target.file.files.length > 0) {
      const file = e.target.file.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        fileData = {
          fileUrl: reader.result,
          fileType: file.type
        };
        userMessage = { ...userMessage, fileUrl: fileData.fileUrl, fileType: fileData.fileType };
        processMessage(userMessage, fileData);
      };
      reader.readAsDataURL(file);
    } else {
      processMessage(userMessage, fileData);
    }

    setInput('');
    e.target.file.value = null;
  };
  
  const processMessage = async (userMessage, fileData) => {
    const chatCollection = collection(db, `/artifacts/${appId}/users/${userId}/chatHistory`);
    try {
      await addDoc(chatCollection, userMessage);
    } catch (error) {
      console.error("Error adding user message to Firestore:", error);
    }
    setIsLoading(true);

    try {
      const knowledgeCollection = collection(db, `/artifacts/${appId}/public/data/knowledgeBase`);
      const q = query(knowledgeCollection, where('question', '==', userMessage.content));
      const querySnapshot = await getDocs(q);
      let botResponseText = '';

      if (!querySnapshot.empty) {
        botResponseText = querySnapshot.docs[0].data().answer;
      } else {
        const conversationHistory = messages.slice(-10).map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        }));
        
        const payload = {
          contents: [
            { role: 'user', parts: [{ text: systemPrompt }] },
            ...conversationHistory,
            { role: 'user', parts: [{ text: userMessage.content }] }
          ]
        };

        if (fileData && fileData.fileType.startsWith('image/')) {
          payload.contents[payload.contents.length - 1].parts.push({
            inlineData: {
              mimeType: fileData.fileType,
              data: fileData.fileUrl.split(',')[1]
            }
          });
        }
        
        const apiKey = "";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await response.json();
        
        if (result.candidates && result.candidates.length > 0 && result.candidates[0].content && result.candidates[0].content.parts) {
          botResponseText = result.candidates[0].content.parts[0].text;
        } else {
          botResponseText = "عذراً، لم أتمكن من الرد. يُرجى المحاولة مرة أخرى لاحقًا.";
        }
      }

      const botMessage = { role: 'bot', content: botResponseText, timestamp: Date.now() };
      await addDoc(chatCollection, botMessage);
    } catch (error) {
      console.error("Gemini API or Firestore error:", error);
      const errorMessage = { role: 'bot', content: 'عذراً، حدث خطأ أثناء معالجة طلبك.', timestamp: Date.now() };
      await addDoc(chatCollection, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleNewChat = async () => {
    if (!userId) return;
    try {
      const chatCollection = collection(db, `/artifacts/${appId}/users/${userId}/chatHistory`);
      const q = query(chatCollection);
      const querySnapshot = await getDocs(q);
      const deletePromises = querySnapshot.docs.map(d => deleteDoc(d.ref));
      await Promise.all(deletePromises);
      setMessages([]);
    } catch (error) {
      console.error("Error clearing chat history:", error);
    }
  };

  const handleCopyMessage = (content) => {
    navigator.clipboard.writeText(content);
    setCopiedMessageId(content);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };
  
  const handleDownload = (format) => {
    let content = '';
    const fileName = `chat_history_${new Date().toISOString()}`;
    if (format === 'json') {
      content = JSON.stringify(messages, null, 2);
    } else if (format === 'txt') {
      content = messages.map(msg => `${msg.role.toUpperCase()}: ${msg.content}`).join('\n');
    } else {
      // Simple PDF-like format
      content = messages.map(msg => `--- ${msg.role.toUpperCase()} ---\n${msg.content}\n`).join('\n');
    }

    const element = document.createElement("a");
    const file = new Blob([content], { type: `text/${format}` });
    element.href = URL.createObjectURL(file);
    element.download = `${fileName}.${format}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-950 bg-opacity-75 p-4 z-50" onClick={onClose}>
        <div className="bg-gray-900 w-full max-w-lg md:max-w-xl max-h-full rounded-2xl shadow-2xl flex flex-col border border-teal-500" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center bg-teal-600 p-4 rounded-t-xl text-white">
                <h3 className="font-bold text-lg">HashTik Chat</h3>
                <button onClick={onClose} className="hover:text-gray-200 transition-colors">
                    <X size={24} />
                </button>
            </div>
            <div ref={chatContentRef} className="flex-1 p-4 space-y-4 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#2d9090 #1f2937' }}>
                {messages.length === 0 && (
                    <div className="text-center text-gray-500 mt-4">مرحباً! أنا HashTik Chat، كيف يمكنني مساعدتك اليوم؟</div>
                )}
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`group relative p-3 rounded-xl max-w-[80%] ${msg.role === 'user' ? 'bg-teal-500 text-white' : 'bg-gray-700 text-gray-200'}`}>
                            {msg.fileUrl && (
                                <div className="mb-2">
                                    {msg.fileType && msg.fileType.startsWith('image/') ? (
                                        <img src={msg.fileUrl} alt="uploaded content" className="max-w-full rounded-md" />
                                    ) : (
                                        <div className="bg-gray-800 p-2 rounded-md flex items-center text-sm">
                                            <FileText size={16} className="text-teal-400 ml-2" />
                                            <span>{msg.content.replace('تم إرسال الملف:', '').trim()}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                            {renderMarkdown(msg.content)}
                            <button
                                onClick={() => handleCopyMessage(msg.content)}
                                className={`absolute left-2 top-2 p-1 rounded-full bg-gray-800 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity`}
                            >
                                <Clipboard size={16} />
                            </button>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-start justify-start">
                        <div className="p-3 rounded-xl max-w-[80%] bg-gray-700 text-gray-200 animate-pulse">
                            <span>...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            {copiedMessageId && (
                <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-800 text-teal-400 text-sm px-3 py-1 rounded-full shadow-lg transition-opacity duration-500">
                    تم النسخ إلى الحافظة!
                </div>
            )}
            <div className="p-4 border-t border-gray-700">
                <div className="flex justify-between items-center mb-2">
                    <button onClick={handleNewChat} className="text-gray-400 hover:text-teal-400 transition-colors flex items-center space-x-1 space-x-reverse" title="محادثة جديدة">
                        <RefreshCcw size={20} />
                        <span className="text-sm hidden sm:inline">جديدة</span>
                    </button>
                    <div className="flex space-x-2 space-x-reverse">
                        <button onClick={() => handleDownload('json')} className="text-gray-400 hover:text-teal-400 transition-colors" title="تحميل JSON">
                            <Download size={20} />
                        </button>
                        <button onClick={() => handleDownload('txt')} className="text-gray-400 hover:text-teal-400 transition-colors" title="تحميل TXT">
                            <Download size={20} />
                        </button>
                    </div>
                </div>
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2 space-x-reverse">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="اكتب رسالتك..."
                        className="flex-1 bg-gray-800 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        disabled={isLoading}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer text-gray-400 hover:text-teal-400 transition-colors">
                        <Paperclip size={24} />
                        <input id="file-upload" name="file" type="file" onChange={e => handleSendMessage(e)} className="hidden" />
                    </label>
                    <button
                        type="submit"
                        className="bg-teal-600 text-white p-2 rounded-lg hover:bg-teal-500 transition-colors"
                        disabled={isLoading || !input.trim()}
                    >
                        <Send size={24} />
                    </button>
                </form>
            </div>
        </div>
    </div>
  );
};

// AdminPanel component
const AdminPanel = ({ onClose }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [knowledgeBase, setKnowledgeBase] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      const knowledgeCollection = collection(db, `/artifacts/${appId}/public/data/knowledgeBase`);
      const unsubscribe = onSnapshot(knowledgeCollection, (snapshot) => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setKnowledgeBase(items);
      });
      return () => unsubscribe();
    }
  }, [isLoggedIn]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة.');
    }
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    try {
      if (editingId) {
        const docRef = doc(db, `/artifacts/${appId}/public/data/knowledgeBase`, editingId);
        await updateDoc(docRef, { question: newQuestion, answer: newAnswer });
        setEditingId(null);
      } else {
        const knowledgeCollection = collection(db, `/artifacts/${appId}/public/data/knowledgeBase`);
        await addDoc(knowledgeCollection, { question: newQuestion, answer: newAnswer });
      }
      setNewQuestion('');
      setNewAnswer('');
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const docRef = doc(db, `/artifacts/${appId}/public/data/knowledgeBase`, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setNewQuestion(item.question);
    setNewAnswer(item.answer);
  };
  
  const handleGenerateAnswer = async () => {
    if (!newQuestion.trim() || isGenerating) return;
    setIsGenerating(true);
    setNewAnswer('جاري إنشاء الإجابة...');
    try {
      const prompt = `Based on the following question about HashTik's services and business, please provide a concise and professional answer in Arabic using Markdown for formatting. Question: ${newQuestion}`;
      const payload = {
        contents: [{ parts: [{ text: prompt }] }],
      };
      const apiKey = "";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (result.candidates && result.candidates.length > 0 && result.candidates[0].content && result.candidates[0].content.parts) {
        setNewAnswer(result.candidates[0].content.parts[0].text);
      } else {
        setNewAnswer('عذراً، لم أتمكن من إنشاء إجابة.');
      }
    } catch (error) {
      console.error("Gemini API error:", error);
      setNewAnswer('حدث خطأ أثناء إنشاء الإجابة.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 bg-gray-950 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-gray-900 p-8 rounded-2xl shadow-xl w-full max-w-md border border-teal-500">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-teal-400">تسجيل دخول المدير</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-2">اسم المستخدم</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">كلمة المرور</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            <button
              type="submit"
              className="w-full bg-teal-600 text-white p-3 rounded-lg hover:bg-teal-500 transition-colors font-bold"
            >
              دخول
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-950 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-xl w-full max-w-4xl border border-teal-500 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-teal-400">لوحة تحكم المدير</h2>
          <div className="flex space-x-2 space-x-reverse">
            <button onClick={() => setIsLoggedIn(false)} className="text-white p-2 rounded-full bg-red-600 hover:bg-red-500 transition-colors" title="تسجيل الخروج">
              <LogOut size={20} />
            </button>
            <button onClick={onClose} className="text-white p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors" title="إغلاق">
              <X size={20} />
            </button>
          </div>
        </div>
        
        {/* Add/Edit Form */}
        <form onSubmit={handleAddOrUpdate} className="bg-gray-800 p-6 rounded-xl mb-6 space-y-4">
          <h3 className="text-xl font-bold text-white mb-2">{editingId ? 'تعديل إجابة' : 'إضافة سؤال وجواب جديد'}</h3>
          <div>
            <label className="block text-gray-400 mb-1">السؤال</label>
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">الجواب</label>
            <textarea
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              rows="4"
            ></textarea>
          </div>
          <div className="flex justify-end space-x-2 space-x-reverse">
            <button
              type="button"
              onClick={handleGenerateAnswer}
              className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-500 transition-colors font-semibold flex items-center space-x-2 space-x-reverse disabled:opacity-50"
              disabled={isGenerating || !newQuestion.trim()}
            >
              {isGenerating ? 'جاري الإنشاء...' : <>إنشاء إجابة ✨</>}
            </button>
            <button
              type="submit"
              className="bg-teal-600 text-white p-2 rounded-lg hover:bg-teal-500 transition-colors font-semibold flex items-center"
            >
              {editingId ? <><Edit2 size={18} className="ml-2" /> تعديل</> : <><PlusCircle size={18} className="ml-2" /> إضافة</>}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => { setEditingId(null); setNewQuestion(''); setNewAnswer(''); }}
                className="bg-gray-600 text-white p-2 rounded-lg hover:bg-gray-500 transition-colors font-semibold flex items-center"
              >
                <XCircle size={18} className="ml-2" /> إلغاء
              </button>
            )}
          </div>
        </form>

        {/* Knowledge Base List */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">قاعدة المعرفة</h3>
          <ul className="space-y-4">
            {knowledgeBase.map(item => (
              <li key={item.id} className="bg-gray-800 p-4 rounded-xl shadow-md">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-teal-400 font-semibold">{item.question}</p>
                    <p className="text-gray-400 text-sm mt-1">{item.answer}</p>
                  </div>
                  <div className="flex space-x-2 space-x-reverse">
                    <button onClick={() => handleEdit(item)} className="text-blue-400 hover:text-blue-300 transition-colors" title="تعديل">
                      <Edit2 size={20} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-300 transition-colors" title="حذف">
                      <Trash size={20} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
app.
