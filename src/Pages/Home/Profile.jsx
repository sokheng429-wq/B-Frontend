import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useAuth } from '../../context/AuthContext'
import { userAPI } from '../../api/api'
import './Profile.css'

const PROFILE_TEXTS = {
  en: {
    logout: 'Log Out',
    accountDetails: 'Account Details',
    edit: 'Edit',
    cancel: 'Cancel',
    save: 'Save',
    notSet: 'Not set',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email Address',
    phone: 'Phone Number',
    dob: 'Date of Birth',
    gender: 'Gender',
    nationality: 'Nationality',
    changePassword: 'Change Password',
    deleteAccountTitle: 'Delete Account',
    deleteAccountDesc: 'Permanently remove your account and all associated data.',
    deleteAccountBtn: 'Delete Account',
    nav: {
      info: 'Account Info',
      orders: 'Order History',
      addresses: 'Saved Addresses',
      wallet: 'My Wallet',
      payment: 'Payment Methods',
      notifications: 'Notifications',
      coupons: 'My Coupons',
      points: 'Reward Points',
    }
  },
  kh: {
    logout: 'ចាកចេញ',
    accountDetails: 'ព័ត៌មានលម្អិតគណនី',
    edit: 'កែប្រែ',
    cancel: 'បោះបង់',
    save: 'រក្សាទុក',
    notSet: 'មិនទាន់កំណត់',
    firstName: 'នាមខ្លួន',
    lastName: 'នាមត្រកូល',
    email: 'អាសយដ្ឋានអ៊ីមែល',
    phone: 'លេខទូរស័ព្ទ',
    dob: 'ថ្ងៃខែឆ្នាំកំណើត',
    gender: 'ភេទ',
    nationality: 'សញ្ជាតិ',
    changePassword: 'ផ្លាស់ប្តូរពាក្យសម្ងាត់',
    deleteAccountTitle: 'លុបគណនី',
    deleteAccountDesc: 'លុបគណនី និងទិន្នន័យទាំងអស់របស់អ្នកជារៀងរហូត។',
    deleteAccountBtn: 'លុបគណនី',
    nav: {
      info: 'ព័ត៌មានគណនី',
      orders: 'ប្រវត្តិបញ្ជាទិញ',
      addresses: 'អាសយដ្ឋាន',
      wallet: 'កាបូបប្រាក់',
      payment: 'វិធីសាស្ត្រទូទាត់',
      notifications: 'ការជូនដំណឹង',
      coupons: 'ប័ណ្ណបញ្ចុះតម្លៃ',
      points: 'ពិន្ទុរង្វាន់',
    }
  }
}

const NAV_ITEMS = [
    { key: 'info', icon: <UserIcon /> },
    { key: 'orders', icon: <OrdersIcon /> },
    { key: 'addresses', icon: <PinIcon /> },
    { key: 'wallet', icon: <WalletIcon /> },
    { key: 'payment', icon: <CardIcon /> },
    { key: 'notifications', icon: <BellIcon /> },
    { key: 'coupons', icon: <TagIcon /> },
    { key: 'points', icon: <StarIcon /> },
]

/* Gender options (bilingual) */
const GENDER_OPTIONS = [
    { value: 'Male', label: { en: 'Male', kh: 'ប្រុស' } },
    { value: 'Female', label: { en: 'Female', kh: 'ស្រី' } },
]

/* Nationalities (English demonyms for every country) */
const NATIONALITIES = [
    'Afghan', 'Albanian', 'Algerian', 'American', 'Andorran', 'Angolan',
    'Antiguan', 'Argentine', 'Armenian', 'Australian', 'Austrian', 'Azerbaijani',
    'Bahamian', 'Bahraini', 'Bangladeshi', 'Barbadian', 'Belarusian', 'Belgian',
    'Belizean', 'Beninese', 'Bhutanese', 'Bolivian', 'Bosnian', 'Botswanan',
    'Brazilian', 'British', 'Bruneian', 'Bulgarian', 'Burkinabé', 'Burundian',
    'Cambodian', 'Cameroonian', 'Canadian', 'Cape Verdean', 'Central African',
    'Chadian', 'Chilean', 'Chinese', 'Colombian', 'Comorian', 'Congolese',
    'Costa Rican', 'Croatian', 'Cuban', 'Cypriot', 'Czech', 'Danish', 'Djiboutian',
    'Dominican', 'East Timorese', 'Ecuadorian', 'Egyptian', 'Emirati', 'English',
    'Equatorial Guinean', 'Eritrean', 'Estonian', 'Ethiopian', 'Fijian', 'Filipino',
    'Finnish', 'French', 'Gabonese', 'Gambian', 'Georgian', 'German', 'Ghanaian',
    'Greek', 'Grenadian', 'Guatemalan', 'Guinean', 'Guinean-Bissau', 'Guyanese',
    'Haitian', 'Honduran', 'Hungarian', 'Icelandic', 'Indian', 'Indonesian',
    'Iranian', 'Iraqi', 'Irish', 'Israeli', 'Italian', 'Ivorian', 'Jamaican',
    'Japanese', 'Jordanian', 'Kazakhstani', 'Kenyan', 'Kiribati', 'Kuwaiti',
    'Kyrgyz', 'Laotian', 'Latvian', 'Lebanese', 'Liberian', 'Libyan',
    'Liechtensteiner', 'Lithuanian', 'Luxembourgish', 'Malagasy', 'Malawian',
    'Malaysian', 'Maldivian', 'Malian', 'Maltese', 'Marshallese', 'Mauritanian',
    'Mauritian', 'Mexican', 'Micronesian', 'Moldovan', 'Monacan', 'Mongolian',
    'Montenegrin', 'Moroccan', 'Mozambican', 'Myanmar (Burmese)', 'Namibian',
    'Nauruan', 'Nepali', 'New Zealander', 'Nicaraguan', 'Nigerien', 'Nigerian',
    'North Korean', 'North Macedonian', 'Norwegian', 'Omani', 'Pakistani',
    'Palauan', 'Palestinian', 'Panamanian', 'Papua New Guinean', 'Paraguayan',
    'Peruvian', 'Polish', 'Portuguese', 'Qatari', 'Romanian', 'Russian', 'Rwandan',
    'Saint Kitts and Nevis', 'Saint Lucian', 'Saint Vincentian', 'Salvadoran',
    'Samoan', 'San Marinese', 'São Toméan', 'Saudi Arabian', 'Senegalese',
    'Serbian', 'Seychellois', 'Sierra Leonean', 'Singaporean', 'Slovak',
    'Slovenian', 'Solomon Islander', 'Somali', 'South African', 'South Korean',
    'South Sudanese', 'Spanish', 'Sri Lankan', 'Sudanese', 'Surinamese', 'Swazi',
    'Swedish', 'Swiss', 'Syrian', 'Taiwanese', 'Tajik', 'Tanzanian', 'Thai',
    'Togolese', 'Tongan', 'Trinidadian and Tobagonian', 'Tunisian', 'Turkish',
    'Turkmen', 'Tuvaluan', 'Ugandan', 'Ukrainian', 'Uruguayan', 'Uzbek',
    'Vanuatuan', 'Venezuelan', 'Vietnamese', 'Yemeni', 'Zambian', 'Zimbabwean',
]

export const Profile = () => {
    const { lang } = useLanguage()
    const { user: authUser, login, logout } = useAuth()
    const navigate = useNavigate()
    const tp = PROFILE_TEXTS[lang] || PROFILE_TEXTS.en

    const [activeTab, setActiveTab] = useState('info')
    const [editing, setEditing] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    // Seed profile fields from the authenticated user (backend UserResponse).
    const fullNameParts = (authUser?.fullName || authUser?.name || '').trim().split(/\s+/).filter(Boolean)

    const [user, setUser] = useState({
        firstName: fullNameParts[0] || '',
        lastName: fullNameParts.slice(1).join(' ') || '',
        email: authUser?.email || '',
        phone: authUser?.phoneNumber || '',
        dob: authUser?.dateOfBirth || '',
        gender: authUser?.gender || '',
        nationality: authUser?.nationality || '',
    })
    const [draft, setDraft] = useState(user)

    // Rebuild the form state from a backend UserResponse.
    const applyUser = (u) => {
        const parts = (u.fullName || '').trim().split(/\s+/).filter(Boolean)
        const next = {
            firstName: parts[0] || '',
            lastName: parts.slice(1).join(' ') || '',
            email: u.email || '',
            phone: u.phoneNumber || '',
            dob: u.dateOfBirth || '',
            gender: u.gender || '',
            nationality: u.nationality || '',
        }
        setUser(next)
        setDraft(next)
    }

    const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'U'
    const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Guest User'

    const startEdit = () => {
        setDraft(user)
        setEditing(true)
    }

    const cancelEdit = () => {
        setDraft(user)
        setEditing(false)
    }

    const saveEdit = async (e) => {
        e.preventDefault()
        setError('')
        setSaving(true)
        try {
            const res = await userAPI.updateProfile({
                fullName: [draft.firstName, draft.lastName].filter(Boolean).join(' ').trim(),
                email: draft.email.trim() || null,
                phoneNumber: draft.phone.trim() || null,
                dateOfBirth: draft.dob.trim() || null,
                gender: draft.gender.trim() || null,
                nationality: draft.nationality.trim() || null,
            })
            // Backend re-issues the JWT (phone may have changed) and returns the
            // updated user — store both so the UI and future requests stay in sync.
            login(res.data)
            applyUser(res.data.user)
            setEditing(false)
        } catch (err) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setDraft((prev) => ({ ...prev, [name]: value }))
    }

    const FIELD_ROWS = [
        { key: 'firstName', label: tp.firstName, editable: true, type: 'text' },
        { key: 'lastName', label: tp.lastName, editable: true, type: 'text' },
        { key: 'email', label: tp.email, editable: true, type: 'email' },
        { key: 'phone', label: tp.phone, editable: true, type: 'tel' },
        { key: 'dob', label: tp.dob, editable: true, type: 'date' },
        { key: 'gender', label: tp.gender, editable: true, type: 'select', options: GENDER_OPTIONS },
        { key: 'nationality', label: tp.nationality, editable: true, type: 'select', options: NATIONALITIES },
    ]

    return (
        <div className="profile-page">
            <div className="profile-container">

                {/* Account bar */}
                <div className="profile-account-bar">
                    <div className="profile-account-identity">
                        <div className="profile-avatar">{initials}</div>
                        <span className="profile-account-name">{fullName}</span>
                    </div>
                    <button type="button" className="profile-logout" onClick={() => { logout(); navigate('/'); }}>
                        <LogoutIcon />
                        {tp.logout}
                    </button>
                </div>

                <div className="profile-body">

                    {/* Sidebar */}
                    <nav className="profile-sidebar">
                        {NAV_ITEMS.map((item) => (
                            <button
                                key={item.key}
                                type="button"
                                className={`profile-nav-item ${activeTab === item.key ? 'active' : ''}`}
                                onClick={() => setActiveTab(item.key)}
                            >
                                {item.icon}
                                {tp.nav[item.key]}
                            </button>
                        ))}
                    </nav>

                    {/* Main content */}
                    <div className="profile-main">
                        {activeTab === 'info' ? (
                            <>
                                <div className="profile-card">
                                    <div className="profile-card-header">
                                        <span className="profile-card-title">{tp.accountDetails}</span>
                                        {!editing ? (
                                            <button type="button" className="profile-edit-btn" onClick={startEdit}>
                                                <PencilIcon /> {tp.edit}
                                            </button>
                                        ) : (
                                            <div className="profile-edit-actions">
                                                <button type="button" className="profile-cancel-btn" onClick={cancelEdit}>
                                                    {tp.cancel}
                                                </button>
                                                <button type="submit" form="profile-form" className="profile-save-btn" disabled={saving}>
                                                    {saving ? 'Saving…' : tp.save}
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {error && <p className="profile-error">{error}</p>}

                                    <form id="profile-form" onSubmit={saveEdit}>
                                        {FIELD_ROWS.map((field) => (
                                            <div className="profile-field-row" key={field.key}>
                                                <span className="profile-field-label">{field.label}</span>

                                                {editing && field.editable ? (
                                                    field.type === 'select' ? (
                                                        <select
                                                            className="profile-field-input"
                                                            name={field.key}
                                                            value={draft[field.key]}
                                                            onChange={handleChange}
                                                        >
                                                            <option value="">{tp.notSet}</option>
                                                            {field.options.map((opt) => {
                                                                const value = typeof opt === 'string' ? opt : opt.value
                                                                const label = typeof opt === 'string' ? opt : opt.label[lang]
                                                                return <option key={value} value={value}>{label}</option>
                                                            })}
                                                        </select>
                                                    ) : (
                                                        <input
                                                            className="profile-field-input"
                                                            type={field.type}
                                                            name={field.key}
                                                            value={draft[field.key]}
                                                            onChange={handleChange}
                                                            placeholder={tp.notSet}
                                                        />
                                                    )
                                                ) : (
                                                    <span className="profile-field-value">
                                                        {user[field.key] || tp.notSet}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </form>
                                </div>

                                <button type="button" className="profile-collapse-row">
                                    <span className="profile-collapse-label">
                                        <LockIcon /> {tp.changePassword}
                                    </span>
                                    <ChevronIcon />
                                </button>

                                <div className="profile-danger-zone">
                                    <div>
                                        <p className="profile-danger-title">{tp.deleteAccountTitle}</p>
                                        <p className="profile-danger-desc">{tp.deleteAccountDesc}</p>
                                    </div>
                                    <button type="button" className="profile-danger-btn">
                                        <TrashIcon /> {tp.deleteAccountBtn}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="profile-card profile-placeholder">
                                {tp.nav[activeTab]}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ---------- Icons ---------- */
function UserIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.5-6 8-6s8 2 8 6" />
        </svg>
    )
}
function OrdersIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 7h18l-1.5 12.5a2 2 0 0 1-2 1.5H6.5a2 2 0 0 1-2-1.5L3 7Z" />
            <path d="M8 7V5a4 4 0 0 1 8 0v2" />
        </svg>
    )
}
function PinIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    )
}
function WalletIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="6" width="18" height="13" rx="2" />
            <path d="M3 10h18" />
            <path d="M16 14h2" />
        </svg>
    )
}
function CardIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <path d="M2 10h20" />
        </svg>
    )
}
function BellIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.7 21a2 2 0 0 1-3.4 0" />
        </svg>
    )
}
function TagIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.6 12.2 12.9 20a2 2 0 0 1-2.8 0l-7-7a2 2 0 0 1 0-2.8L10.9 2.5A2 2 0 0 1 12.3 2H19a2 2 0 0 1 2 2v6.7a2 2 0 0 1-.4 1.5Z" />
            <circle cx="15" cy="7" r="1.2" fill="currentColor" stroke="none" />
        </svg>
    )
}
function StarIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m12 2 2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.8L6 21l1.6-7-5.4-4.7 7.1-.6L12 2Z" />
        </svg>
    )
}
function LogoutIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <path d="M16 17l5-5-5-5" />
            <path d="M21 12H9" />
        </svg>
    )
}
function PencilIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
        </svg>
    )
}
function LockIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="4" y="11" width="16" height="9" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
    )
}
function ChevronIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m9 18 6-6-6-6" />
        </svg>
    )
}
function TrashIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18" />
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        </svg>
    )
}

export default Profile