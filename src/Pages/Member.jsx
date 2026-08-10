import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import './Member.css'

const TEAM = [
  {
    id: 1,
    name: { en: 'Sok Heng', kh: 'សុខ​ ហេង' },
    role: { en: 'CEO & Founder', kh: 'នាយកប្រតិបត្តិ និងស្ថាបនិក' },
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
    dept: { en: 'Executive', kh: 'នាយកប្រតិបត្តិ' },
    bio: { en: '10+ years in retail. Built B\'Groceries from the ground up with a passion for fresh, affordable food.', kh: 'បទពិសោធន៍ជាង ១០ឆ្នាំក្នុងវិស័យលក់រាយ។ បានកសាង B\'Groceries ពីដំបូងដោយមានចំណង់ចំណូលចិត្តលើអាហារស្រស់ និងមានតម្លៃសមរម្យ។' },
  },
  {
    id: 2,
    name: { en: 'Chenda Kim', kh: 'ចិន្តា​ គីម' },
    role: { en: 'Operations Director', kh: 'នាយកប្រតិបត្តិការ' },
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face',
    dept: { en: 'Operations', kh: 'ប្រតិបត្តិការ' },
    bio: { en: 'Keeps everything running smoothly — from warehouse to delivery. Logistics expert with 8 years experience.', kh: 'ធានាឲ្យអ្វីៗដំណើរការរលូន — ពីឃ្លាំងដល់ការដឹកជញ្ជូន។ អ្នកជំនាញផ្នែកដឹកជញ្ជូនដែលមានបទពិសោធន៍ ៨ ឆ្នាំ។' },
  },
  {
    id: 3,
    name: { en: 'Dara Meas', kh: 'តារា​ មាស' },
    role: { en: 'Head of Marketing', kh: 'ប្រធានផ្នែកទីផ្សារ' },
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face',
    dept: { en: 'Marketing', kh: 'ទីផ្សារ' },
    bio: { en: 'Creative strategist who makes B\'Groceries the brand everyone talks about. Former agency lead turned grocery evangelist.', kh: 'អ្នកយុទ្ធសាស្រ្តច្នៃប្រឌិតដែលធ្វើឲ្យ B\'Groceries ក្លាយជាម៉ាកដែលគ្រប់គ្នានិយាយអំពី។' },
  },
  {
    id: 4,
    name: { en: 'Sophea Yon', kh: 'សុភា​ យុន' },
    role: { en: 'Lead Developer', kh: 'អ្នកអភិវឌ្ឍនាំមុខ' },
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=face',
    dept: { en: 'Technology', kh: 'បច្ចេកវិទ្យា' },
    bio: { en: 'Full-stack wizard building the platform that powers thousands of daily deliveries. Open-source contributor and coffee enthusiast.', kh: 'អ្នកជំនាញ Full-stack ដែលកសាងប្រព័ន្ធដឹកជញ្ជូនរាប់ពាន់ដងក្នុងមួយថ្ងៃ។ អ្នកចូលរួមចំណែក Open-source និងអ្នកចូលចិត្តកាហ្វេ។' },
  },
  {
    id: 5,
    name: { en: 'Bopha Ly', kh: 'បុប្ផា​ លី' },
    role: { en: 'Customer Experience Lead', kh: 'ប្រធានផ្នែកបទពិសោធន៍អតិថិជន' },
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face',
    dept: { en: 'Operations', kh: 'ប្រតិបត្តិការ' },
    bio: { en: 'Ensures every customer leaves happy. Built our support team from 2 people to 25. Known for replying in under 5 minutes.', kh: 'ធានាឲ្យអតិថិជនគ្រប់រូបពេញចិត្ត។ បានកសាងក្រុមគាំទ្រពី ២នាក់ ទៅ ២៥នាក់។ ល្បីថាឆ្លើយតបក្នុងរយៈពេលក្រោម ៥នាទី។' },
  },
  {
    id: 6,
    name: { en: 'Rithy Sok', kh: 'រិទ្ធី​ សុខ' },
    role: { en: 'Supply Chain Manager', kh: 'អ្នកគ្រប់គ្រងខ្សែចង្វាក់ផ្គត់ផ្គង់' },
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
    dept: { en: 'Operations', kh: 'ប្រតិបត្តិការ' },
    bio: { en: 'Connects local farms and producers directly to our shelves. Passionate about reducing food waste and supporting Cambodian farmers.', kh: 'ភ្ជាប់កសិករក្នុងស្រុក និងអ្នកផលិតដោយផ្ទាល់ទៅកាន់ធ្នើរយើង។ ចូលចិត្តកាត់បន្ថយកាកសំណល់អាហារ និងគាំទ្រកសិករខ្មែរ។' },
  },
  {
    id: 7,
    name: { en: 'Molika Prak', kh: 'ម៉ាលីកា​ ប្រាក់' },
    role: { en: 'UI/UX Designer', kh: 'អ្នករចនា UI/UX' },
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face',
    dept: { en: 'Technology', kh: 'បច្ចេកវិទ្យា' },
    bio: { en: 'Designs the beautiful, easy-to-use experience you see on screen. Former artist turned product designer with an eye for detail.', kh: 'រចនាបទពិសោធន៍ដ៏ស្រស់ស្អាត និងងាយស្រួលប្រើដែលអ្នកឃើញនៅលើអេក្រង់។ អតីតសិល្បករដែលក្លាយជាអ្នករចនាផលិតផល។' },
  },
  {
    id: 8,
    name: { en: 'Vuthy Chhay', kh: 'វុទ្ធី​ ឆាយ' },
    role: { en: 'Head of Finance', kh: 'ប្រធានផ្នែកហិរញ្ញវត្ថុ' },
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face',
    dept: { en: 'Executive', kh: 'នាយកប្រតិបត្តិ' },
    bio: { en: 'Numbers guy who makes sure we stay profitable while keeping prices low. CPA with a soft spot for spreadsheets and street food.', kh: 'អ្នកគ្រប់គ្រងលេខដែលធានាឲ្យយើងរក្សាប្រាក់ចំណេញ ខណៈដែលរក្សាតម្លៃឲ្យទាប។ CPA ដែលមានចំណូលចិត្តលើសន្លឹកទិន្នន័យ និងអាហារតាមផ្លូវ។' },
  },
]

const DEPARTMENTS = [
  { key: 'all', en: 'Everyone', kh: 'ទាំងអស់' },
  { key: 'Executive', en: 'Executive', kh: 'នាយកប្រតិបត្តិ' },
  { key: 'Operations', en: 'Operations', kh: 'ប្រតិបត្តិការ' },
  { key: 'Marketing', en: 'Marketing', kh: 'ទីផ្សារ' },
  { key: 'Technology', en: 'Technology', kh: 'បច្ចេកវិទ្យា' },
]

const TEXTS = {
  heroTitle: { en: 'Meet Our Team', kh: 'ស្គាល់ក្រុមការងារយើង' },
  heroSub: { en: 'The passionate people behind every fresh delivery — from our family to yours.', kh: 'មនុស្សដែលមានចំណង់ចំណូលចិត្តនៅពីក្រោយរាល់ការដឹកជញ្ជូនស្រស់ៗ — ពីគ្រួសារយើង ទៅគ្រួសារអ្នក។' },
  filterBy: { en: 'Filter by department', kh: 'តម្រងតាមផ្នែក' },
  teamCount: { en: 'Team Members', kh: 'សមាជិកក្រុម' },
  stats: { en: 'And growing — we\'re always looking for talented people to join us.', kh: 'ហើយកំពុងរីកចម្រើន — យើងតែងតែស្វែងរកមនុស្សដែលមានទេពកោសល្យមកចូលរួមជាមួយយើង។' },
  joinUs: { en: 'Want to join the team?', kh: 'ចង់ចូលរួមជាមួយក្រុមការងារទេ?' },
  viewJobs: { en: 'View Open Positions', kh: 'មើលមុខតំណែងដែលកំពុងទទួល' },
  connect: { en: 'Connect', kh: 'ទំនាក់ទំនង' },
}

export const Member = () => {
  const { lang } = useLanguage()
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? TEAM : TEAM.filter((m) => m.dept.en === filter)

  return (
    <div className="member-page">
      {/* Hero */}
      <section className="member-hero">
        <div className="member-hero-bg" />
        <div className="member-hero-inner">
          <span className="member-hero-icon">👥</span>
          <h1 className="member-hero-title">{TEXTS.heroTitle[lang]}</h1>
          <p className="member-hero-sub">{TEXTS.heroSub[lang]}</p>
          <div className="member-hero-stats">
            <span className="member-hero-count">8+</span>
            <span className="member-hero-count-label">{TEXTS.teamCount[lang]}</span>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="member-filters-bar">
        <div className="member-filters-inner">
          {DEPARTMENTS.map((d) => (
            <button
              key={d.key}
              className={`member-filter-chip ${filter === d.key ? 'member-filter-chip--active' : ''}`}
              onClick={() => setFilter(d.key)}
            >
              {d[lang]}
            </button>
          ))}
        </div>
      </section>

      {/* Team grid */}
      <section className="member-grid-section">
        <div className="member-grid-inner">
          {filtered.map((person) => (
            <div key={person.id} className="member-card">
              <div className="member-card-img-wrap">
                <img
                  src={person.image}
                  alt={person.name[lang]}
                  className="member-card-img"
                  loading="lazy"
                />
                <div className="member-card-img-overlay" />
              </div>
              <div className="member-card-body">
                <span className="member-card-dept">{person.dept[lang]}</span>
                <h3 className="member-card-name">{person.name[lang]}</h3>
                <p className="member-card-role">{person.role[lang]}</p>
                <p className="member-card-bio">{person.bio[lang]}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="member-cta">
        <div className="member-cta-inner">
          <div>
            <h2 className="member-cta-title">{TEXTS.joinUs[lang]}</h2>
            <p className="member-cta-text">{TEXTS.stats[lang]}</p>
          </div>
          <Link to="/career" className="member-cta-btn">
            {TEXTS.viewJobs[lang]}
            <ArrowIcon />
          </Link>
        </div>
      </section>
    </div>
  )
}

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
)

export default Member