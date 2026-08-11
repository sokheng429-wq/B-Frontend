import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './FAQ.css';

const FAQ_CATEGORIES = [
  {
    icon: '🛒',
    title: { en: 'Orders & Delivery', kh: 'ការបញ្ជាទិញ និងដឹកជញ្ជូន' },
    items: [
      {
        q: { en: 'How fast is your delivery?', kh: 'ការដឹកជញ្ជូនលឿនប៉ុណ្ណា?' },
        a: { en: 'We deliver in as fast as 45 minutes across Phnom Penh! Orders placed before 8pm arrive same-day.', kh: 'យើងដឹកជញ្ជូនក្នុងរយៈពេលត្រឹមតែ ៤៥ នាទីនៅទូទាំងភ្នំពេញ! ការបញ្ជាទិញមុនម៉ោង ៨ យប់នឹងទទួលបានក្នុងថ្ងៃតែមួយ។' },
      },
      {
        q: { en: 'What areas do you deliver to?', kh: 'អ្នកដឹកជញ្ជូនទៅតំបន់ណាខ្លះ?' },
        a: { en: 'We currently cover all 14 districts of Phnom Penh. Expanding to more cities soon!', kh: 'បច្ចុប្បន្នយើងគ្របដណ្តប់ខណ្ឌទាំង ១៤ នៅភ្នំពេញ។ នឹងពង្រីកទៅទីក្រុងបន្ថែមទៀតនាពេលឆាប់ៗនេះ!' },
      },
      {
        q: { en: 'Can I schedule a delivery for later?', kh: 'តើខ្ញុំអាចកំណត់ពេលដឹកជញ្ជូនសម្រាប់ពេលក្រោយបានទេ?' },
        a: { en: 'Yes! You can pick any 2-hour window within the next 3 days at checkout.', kh: 'បាន! អ្នកអាចជ្រើសរើសពេលវេលា ២ ម៉ោងក្នុងរយៈពេល ៣ ថ្ងៃបន្ទាប់នៅពេលទូទាត់។' },
      },
    ],
  },
  {
    icon: '💰',
    title: { en: 'Payments & Pricing', kh: 'ការទូទាត់ និងតម្លៃ' },
    items: [
      {
        q: { en: 'What payment methods do you accept?', kh: 'តើអ្នកទទួលយកវិធីទូទាត់អ្វីខ្លះ?' },
        a: { en: 'We accept Visa, Mastercard, ABA Pay, Wing, TrueMoney, and cash on delivery.', kh: 'យើងទទួលយក Visa, Mastercard, ABA Pay, Wing, TrueMoney និងបង់ជាសាច់ប្រាក់ពេលទទួល។' },
      },
      {
        q: { en: 'Are prices the same as in-store?', kh: 'តើតម្លៃដូចគ្នានឹងក្នុងហាងទេ?' },
        a: { en: 'Absolutely — and members get extra discounts on hundreds of items every week!', kh: 'ពិតជាដូចគ្នា — ហើយសមាជិកទទួលបានការបញ្ចុះតម្លៃបន្ថែមលើទំនិញរាប់រយមុខរៀងរាល់សប្តាហ៍!' },
      },
      {
        q: { en: 'Is there a minimum order?', kh: 'តើមានការកំណត់ចំនួនបញ្ជាទិញអប្បបរមាទេ?' },
        a: { en: 'Nope — order as little or as much as you need. No minimums, no pressure.', kh: 'មិនមានទេ — បញ្ជាទិញតិច ឬច្រើនតាមដែលអ្នកត្រូវការ។ គ្មានកំណត់អប្បបរមា គ្មានសម្ពាធ។' },
      },
    ],
  },
  {
    icon: '🔄',
    title: { en: 'Returns & Refunds', kh: 'ការប្រគល់ទំនិញ និងបង្វិលប្រាក់' },
    items: [
      {
        q: { en: 'What if something arrives damaged?', kh: 'ចុះបើទំនិញមកដល់ខូច?' },
        a: { en: 'Snap a photo and report it in the app within 24 hours — we will replace it instantly or refund you, your choice.', kh: 'ថតរូបហើយរាយការណ៍ក្នុងកម្មវិធីក្នុងរយៈពេល ២៤ ម៉ោង — យើងនឹងជំនួសភ្លាមៗ ឬបង្វិលប្រាក់ តាមជម្រើសរបស់អ្នក។' },
      },
      {
        q: { en: 'Can I return fresh produce?', kh: 'តើខ្ញុំអាចប្រគល់បន្លែផ្លែឈើស្រស់បានទេ?' },
        a: { en: 'Yes — our Freshness Guarantee covers all produce. Not happy with the quality? We will refund it, no questions asked.', kh: 'បាន — ការធានាភាពស្រស់របស់យើងគ្របដណ្តប់គ្រប់មុខទំនិញ។ មិនពេញចិត្តនឹងគុណភាព? យើងនឹងបង្វិលប្រាក់ គ្មានសំណួរ។' },
      },
    ],
  },
  {
    icon: '👤',
    title: { en: 'Account & Membership', kh: 'គណនី និងសមាជិកភាព' },
    items: [
      {
        q: { en: 'Is membership really free?', kh: 'តើសមាជិកភាពពិតជាឥតគិតថ្លៃមែនទេ?' },
        a: { en: '100% free. Sign up in 10 seconds and unlock member prices, free delivery on orders over $15, and early access to promotions.', kh: 'ឥតគិតថ្លៃ ១០០%។ ចុះឈ្មោះក្នុងរយៈពេល ១០ វិនាទី និងទទួលបានតម្លៃសមាជិក ការដឹកជញ្ជូនឥតគិតថ្លៃលើការបញ្ជាទិញលើស ១៥ ដុល្លារ និងការចូលប្រើការផ្សព្វផ្សាយមុនគេ។' },
      },
      {
        q: { en: 'How do I reset my password?', kh: 'តើខ្ញុំកំណត់ពាក្យសម្ងាត់ឡើងវិញដោយរបៀបណា?' },
        a: { en: 'Tap "Forgot Password" on the login screen, enter your email, and we will send you a reset link in seconds.', kh: 'ចុច "ភ្លេចពាក្យសម្ងាត់" នៅលើទំព័រចូល បញ្ចូលអ៊ីមែលរបស់អ្នក ហើយយើងនឹងផ្ញើតំណកំណត់ឡើងវិញក្នុងពេលភ្លាមៗ។' },
      },
    ],
  },
];

const TEXTS = {
  title: { en: 'Frequently Asked Questions', kh: 'សំណួរដែលគេសួរញឹកញាប់' },
  subtitle: { en: "Can't find what you're looking for?", kh: 'រកមិនឃើញអ្វីដែលអ្នកកំពុងស្វែងរក?' },
  contactCta: { en: 'Contact our friendly support team — we are here 24/7.', kh: 'ទាក់ទងក្រុមគាំទ្ររបស់យើង — យើងនៅទីនេះ ២៤/៧។' },
  contactBtn: { en: 'Get in Touch', kh: 'ទាក់ទងយើង' },
  search: { en: 'Search questions...', kh: 'ស្វែងរកសំណួរ...' },
};

function FAQ() {
  const { lang } = useLanguage();
  const [openKey, setOpenKey] = useState(null);
  const [activeCat, setActiveCat] = useState(0);
  const [search, setSearch] = useState('');

  const toggle = (catIdx, itemIdx) => {
    const key = `${catIdx}-${itemIdx}`;
    setOpenKey(openKey === key ? null : key);
  };

  const filteredCategories = FAQ_CATEGORIES.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      (item) =>
        item.q[lang].toLowerCase().includes(search.toLowerCase()) ||
        item.a[lang].toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => cat.items.length > 0);

  return (
    <div className="faq-page">
      {/* HERO HEADER */}
      <section className="faq-hero">
        <div className="faq-hero-bg" />
        <div className="faq-inner">
          <span className="faq-eyebrow">❓</span>
          <h1 className="faq-title">{TEXTS.title[lang]}</h1>
          <p className="faq-subtitle">Quick answers to everything B'Groceries.</p>

          <div className="faq-search-wrap">
            <SearchIcon />
            <input
              className="faq-search"
              type="text"
              placeholder={TEXTS.search[lang]}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setActiveCat(0);
              }}
            />
            {search && (
              <button className="faq-search-clear" onClick={() => setSearch('')}>
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* BODY */}
      <section className="faq-body">
        <div className="faq-inner">
          {!search && (
            <div className="faq-cat-tabs">
              {FAQ_CATEGORIES.map((cat, i) => (
                <button
                  key={cat.title.en}
                  className={`faq-cat-tab ${activeCat === i ? 'faq-cat-tab--active' : ''}`}
                  onClick={() => {
                    setActiveCat(i);
                    setOpenKey(null);
                  }}
                >
                  <span className="faq-cat-icon">{cat.icon}</span>
                  <span className="faq-cat-label">{cat.title[lang]}</span>
                </button>
              ))}
            </div>
          )}

          <div className="faq-list">
            {filteredCategories.length === 0 ? (
              <div className="faq-empty">
                <span className="faq-empty-icon">🔍</span>
                <p>{lang === 'en' ? 'No results found. Try a different search!' : 'រកមិនឃើញលទ្ធផល។ សាកល្បងស្វែងរកផ្សេងទៀត!'}</p>
              </div>
            ) : (
              filteredCategories.map((cat, ci) => {
                // Without search, show only active tab; with search show all matches
                if (!search && ci !== activeCat) return null;
                return (
                  <div key={cat.title.en} className="faq-group">
                    {search && (
                      <h3 className="faq-group-title">
                        <span>{cat.icon}</span> {cat.title[lang]}
                      </h3>
                    )}
                    {cat.items.map((item, ii) => {
                      const isOpen = openKey === `${ci}-${ii}`;
                      return (
                        <div key={ii} className={`faq-card ${isOpen ? 'faq-card--open' : ''}`}>
                          <button
                            className="faq-q"
                            onClick={() => toggle(ci, ii)}
                            aria-expanded={isOpen}
                          >
                            <span>{item.q[lang]}</span>
                            <span className={`faq-chevron ${isOpen ? 'faq-chevron--up' : ''}`}>
                              <Chevron />
                            </span>
                          </button>
                          <div className="faq-a-wrap">
                            <p className="faq-a">{item.a[lang]}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })
            )}
          </div>

          {/* CONTACT CTA */}
          <div className="faq-contact-cta">
            <div className="faq-contact-card">
              <span className="faq-contact-emoji">💬</span>
              <div>
                <p className="faq-contact-text">{TEXTS.contactCta[lang]}</p>
              </div>
              <a href="/contact" className="faq-contact-btn">{TEXTS.contactBtn[lang]}</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const Chevron = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export default FAQ;
