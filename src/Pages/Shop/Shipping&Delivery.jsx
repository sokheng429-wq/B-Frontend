import { useLanguage } from '../../context/LanguageContext';
import './Shipping&Delivery.css';

const DELIVERY_TIERS = [
  {
    icon: '⚡',
    name: { en: 'Lightning Express', kh: 'លឿនរន្ទះ' },
    time: { en: 'Under 45 minutes', kh: 'ក្រោម ៤៥ នាទី' },
    cost: { en: '$2.99', kh: '2.99 ដុល្លារ' },
    tag: { en: 'Most Popular', kh: 'ពេញនិយមបំផុត' },
    highlight: true,
  },
  {
    icon: '🕐',
    name: { en: 'Same-Day Delivery', kh: 'ដឹកជញ្ជូនថ្ងៃតែមួយ' },
    time: { en: 'Order by 8pm — delivered tonight', kh: 'បញ្ជាមុនម៉ោង ៨ យប់ — ដឹកជញ្ជូនយប់នេះ' },
    cost: { en: '$1.49', kh: '1.49 ដុល្លារ' },
    tag: { en: 'Best Value', kh: 'តម្លៃល្អបំផុត' },
    highlight: false,
  },
  {
    icon: '📦',
    name: { en: 'Next-Day Delivery', kh: 'ដឹកជញ្ជូនថ្ងៃបន្ទាប់' },
    time: { en: 'Choose any 2-hour window', kh: 'ជ្រើសរើសពេល ២ ម៉ោងណាក៏បាន' },
    cost: { en: 'Free on orders over $15', kh: 'ឥតគិតថ្លៃលើការបញ្ជាលើស ១៥ ដុល្លារ' },
    tag: null,
    highlight: false,
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: '🛍️',
    title: { en: 'Browse & Add to Cart', kh: 'ជ្រើសរើស និងដាក់កន្ត្រក' },
    text: { en: 'Explore thousands of fresh groceries — from local farm produce to pantry staples.', kh: 'ស្វែងរកគ្រឿងទេសស្រស់ៗរាប់ពាន់មុខ — ពីផលិតផលកសិដ្ឋានក្នុងស្រុកដល់ទំនិញប្រចាំថ្ងៃ។' },
  },
  {
    step: '02',
    icon: '📍',
    title: { en: 'Choose Delivery Slot', kh: 'ជ្រើសរើសពេលដឹកជញ្ជូន' },
    text: { en: 'Pick the speed that works for you — Lightning Express, Same-Day, or scheduled Next-Day delivery.', kh: 'ជ្រើសរើសល្បឿនដែលសាកសមនឹងអ្នក — លឿនរន្ទះ ថ្ងៃតែមួយ ឬកំណត់ពេលថ្ងៃបន្ទាប់។' },
  },
  {
    step: '03',
    icon: '💳',
    title: { en: 'Pay Your Way', kh: 'បង់តាមវិធីរបស់អ្នក' },
    text: { en: 'Visa, Mastercard, ABA Pay, Wing, TrueMoney, or cash on delivery — whatever is easiest.', kh: 'Visa, Mastercard, ABA Pay, Wing, TrueMoney ឬបង់សាច់ប្រាក់ — អ្វីដែលងាយស្រួលជាងគេ។' },
  },
  {
    step: '04',
    icon: '🚀',
    title: { en: 'We Deliver, You Enjoy', kh: 'យើងដឹកជញ្ជូន អ្នករីករាយ' },
    text: { en: 'Your groceries arrive fresh at your door. Not happy? Free returns, no questions asked.', kh: 'គ្រឿងទេសរបស់អ្នកមកដល់ស្រស់ៗនៅមាត់ទ្វារ។ មិនពេញចិត្ត? ប្រគល់ទំនិញវិញឥតគិតថ្លៃ គ្មានសំណួរ។' },
  },
];

const ZONES = [
  { area: { en: 'Central Phnom Penh', kh: 'កណ្តាលភ្នំពេញ' }, time: { en: '30–45 min', kh: '៣០–៤៥ នាទី' }, districts: 'Daun Penh, Chamkarmon, 7 Makara, Toul Kork, Boeung Keng Kang' },
  { area: { en: 'Greater Phnom Penh', kh: 'ភ្នំពេញធំ' }, time: { en: '45–90 min', kh: '៤៥–៩០ នាទី' }, districts: 'Sen Sok, Meanchey, Russey Keo, Chroy Changvar, Por Senchey' },
  { area: { en: 'Outer Phnom Penh', kh: 'ជាយភ្នំពេញ' }, time: { en: '60–120 min', kh: '៦០–១២០ នាទី' }, districts: 'Dangkao, Kamboul, Prek Pnov, Chbar Ampov' },
];

const TEXTS = {
  title: { en: 'Shipping & Delivery', kh: 'ការដឹកជញ្ជូន' },
  subtitle: { en: 'Fresh to your door — fast, reliable, and flexible.', kh: 'ស្រស់ៗដល់មាត់ទ្វារអ្នក — លឿន ទុកចិត្តបាន និងអាចបត់បែនបាន។' },
  howTitle: { en: 'How It Works', kh: 'របៀបដំណើរការ' },
  howSub: { en: 'From cart to doorstep in four easy steps.', kh: 'ពីកន្ត្រកដល់មាត់ទ្វារក្នុងបួនជំហានងាយៗ។' },
  zonesTitle: { en: 'Delivery Zones', kh: 'តំបន់ដឹកជញ្ជូន' },
  zonesSub: { en: 'We cover all 14 districts of Phnom Penh — and expanding soon.', kh: 'យើងគ្របដណ្តប់ខណ្ឌទាំង ១៤ នៅភ្នំពេញ — និងនឹងពង្រីកទៀតនាពេលឆាប់ៗ។' },
  freeDelivery: { en: 'Free Delivery', kh: 'ដឹកជញ្ជូនឥតគិតថ្លៃ' },
  freshnessTitle: { en: 'Freshness Promise', kh: 'ការសន្យាភាពស្រស់' },
  freshnessText: { en: 'Every order is hand-picked and packed in temperature-controlled bags. If anything arrives less than perfect, we will replace it — free.', kh: 'រាល់ការបញ្ជាទិញត្រូវបានជ្រើសរើស និងវេចខ្ចប់ក្នុងថង់គ្រប់គ្រងសីតុណ្ហភាព។ ប្រសិនបើអ្វីមួយមិនល្អឥតខ្ចោះ យើងនឹងជំនួស — ឥតគិតថ្លៃ។' },
};

function ShippingDelivery() {
  const { lang } = useLanguage();

  return (
    <div className="shipping-page">
      {/* ===== HERO ===== */}
      <section className="shipping-hero">
        <div className="shipping-hero-bg" />
        <div className="shipping-hero-inner">
          <span className="shipping-hero-emoji">🚚</span>
          <h1 className="shipping-hero-title">{TEXTS.title[lang]}</h1>
          <p className="shipping-hero-sub">{TEXTS.subtitle[lang]}</p>
        </div>
      </section>

      {/* ===== DELIVERY TIERS ===== */}
      <section className="shipping-tiers">
        <div className="shipping-inner">
          <div className="shipping-tier-grid">
            {DELIVERY_TIERS.map((tier) => (
              <div key={tier.name.en} className={`shipping-tier-card ${tier.highlight ? 'shipping-tier-card--featured' : ''}`}>
                {tier.tag && <span className="shipping-tier-tag">{tier.tag[lang]}</span>}
                <div className="shipping-tier-icon">{tier.icon}</div>
                <h3 className="shipping-tier-name">{tier.name[lang]}</h3>
                <p className="shipping-tier-time">{tier.time[lang]}</p>
                <div className="shipping-tier-cost">{tier.cost[lang]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="shipping-how">
        <div className="shipping-inner">
          <div className="shipping-section-header">
            <span className="shipping-section-eyebrow">🔄</span>
            <h2 className="shipping-section-title">{TEXTS.howTitle[lang]}</h2>
            <p className="shipping-section-sub">{TEXTS.howSub[lang]}</p>
          </div>

          <div className="shipping-steps">
            {HOW_IT_WORKS.map((item, i) => (
              <div key={item.step} className="shipping-step">
                <div className="shipping-step-badge">{item.step}</div>
                <div className="shipping-step-icon">{item.icon}</div>
                <h4 className="shipping-step-title">{item.title[lang]}</h4>
                <p className="shipping-step-text">{item.text[lang]}</p>
                {i < HOW_IT_WORKS.length - 1 && <div className="shipping-step-line" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FRESHNESS PROMISE ===== */}
      <section className="shipping-freshness">
        <div className="shipping-inner">
          <div className="shipping-freshness-card">
            <div className="shipping-freshness-icon">❄️</div>
            <div className="shipping-freshness-copy">
              <h3>{TEXTS.freshnessTitle[lang]}</h3>
              <p>{TEXTS.freshnessText[lang]}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DELIVERY ZONES ===== */}
      <section className="shipping-zones">
        <div className="shipping-inner">
          <div className="shipping-section-header">
            <span className="shipping-section-eyebrow">🗺️</span>
            <h2 className="shipping-section-title">{TEXTS.zonesTitle[lang]}</h2>
            <p className="shipping-section-sub">{TEXTS.zonesSub[lang]}</p>
          </div>

          <div className="shipping-zone-grid">
            {ZONES.map((zone) => (
              <div key={zone.area.en} className="shipping-zone-card">
                <div className="shipping-zone-meta">
                  <h4 className="shipping-zone-area">{zone.area[lang]}</h4>
                  <span className="shipping-zone-time">{zone.time[lang]}</span>
                </div>
                <p className="shipping-zone-districts">{zone.districts}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ShippingDelivery;
