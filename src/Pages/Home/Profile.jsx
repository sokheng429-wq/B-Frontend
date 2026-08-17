import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useAuth } from '../../context/AuthContext'
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

export const Profile = () => {
    const { lang } = useLanguage()
    const { user: authUser, logout } = useAuth()
    const navigate = useNavigate()
    const tp = PROFILE_TEXTS[lang] || PROFILE_TEXTS.en

    const [activeTab, setActiveTab] = useState('info')
    const [editing, setEditing] = useState(false)

    // Seed profile fields from the authenticated user (backend UserResponse: fullName, phoneNumber)
    const fullNameParts = (authUser?.fullName || authUser?.name || '').trim().split(/\s+/).filter(Boolean)

    const [user, setUser] = useState({
        firstName: fullNameParts[0] || '',
        lastName: fullNameParts.slice(1).join(' ') || '',
        email: authUser?.email || '',
        phone: authUser?.phoneNumber || '',
        dob: '',
        gender: '',
        nationality: 'Cambodian',
    })
    const [draft, setDraft] = useState(user)

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

    const saveEdit = (e) => {
        e.preventDefault()
        setUser(draft)
        setEditing(false)
        // TODO: PATCH /users/me with `draft`
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setDraft((prev) => ({ ...prev, [name]: value }))
    }

    const FIELD_ROWS = [
        { key: 'firstName', label: tp.firstName, editable: true },
        { key: 'lastName', label: tp.lastName, editable: true },
        { key: 'email', label: tp.email, editable: true },
        { key: 'phone', label: tp.phone, editable: true },
        { key: 'dob', label: tp.dob, editable: true },
        { key: 'gender', label: tp.gender, editable: true },
        { key: 'nationality', label: tp.nationality, editable: false },
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
                                                <button type="submit" form="profile-form" className="profile-save-btn">
                                                    {tp.save}
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <form id="profile-form" onSubmit={saveEdit}>
                                        {FIELD_ROWS.map((field) => (
                                            <div className="profile-field-row" key={field.key}>
                                                <span className="profile-field-label">{field.label}</span>

                                                {editing && field.editable ? (
                                                    <input
                                                        className="profile-field-input"
                                                        name={field.key}
                                                        value={draft[field.key]}
                                                        onChange={handleChange}
                                                        placeholder={tp.notSet}
                                                    />
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