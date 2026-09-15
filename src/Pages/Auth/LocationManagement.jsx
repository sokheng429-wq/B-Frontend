import { useState, useEffect, useMemo } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { useTheme } from '../../context/ThemeContext'
import { locationAPI, outletAPI } from '../../api/api'

// Fallback initial locations if backend is booting or offline
const FALLBACK_LOCATIONS = [
  {
    id: 1,
    code: 'LOC-001',
    description: 'Main Warehouse A',
    secondLanguage: 'ឃ្លាំងធំ A',
    outlet: 'Main Mart Toul Kork',
    reference: 'WH-A-01',
    active: true,
    receive: true,
    sale: true,
    isDefault: true,
  },
  {
    id: 2,
    code: 'LOC-002',
    description: 'Front Store Display Shelf',
    secondLanguage: 'ធ្នើរតាំងលក់ខាងមុខ',
    outlet: 'Main Mart Toul Kork',
    reference: 'SHELF-01',
    active: true,
    receive: false,
    sale: true,
    isDefault: false,
  },
  {
    id: 3,
    code: 'LOC-003',
    description: 'Cold Storage B1',
    secondLanguage: 'បន្ទប់ត្រជាក់ B1',
    outlet: 'BKK1 Flagship Store',
    reference: 'COLD-B1',
    active: true,
    receive: true,
    sale: false,
    isDefault: false,
  },
]

const INITIAL_FORM = {
  id: null,
  code: '',
  active: true,
  description: '',
  secondLanguage: '',
  outlet: '',
  reference: '',
  receive: false,
  sale: false,
  isDefault: false,
}

export default function LocationManagement() {
  const { lang } = useLanguage()
  const { isDark } = useTheme()

  // Search & Filter State
  const [searchText, setSearchText] = useState('')
  const [searchBy, setSearchBy] = useState('Any') // Any, Code, Description, Second Language
  const [filterStatus, setFilterStatus] = useState('All') // Active, All, Inactive
  const [selectedOutletFilter, setSelectedOutletFilter] = useState('All') // Filter by Outlet from Advance button
  const [isAdvanceOpen, setIsAdvanceOpen] = useState(false) // Toggle for Advance button

  // Data State
  const [locations, setLocations] = useState([])
  const [outletsList, setOutletsList] = useState([])
  const [loading, setLoading] = useState(true)
  const [feedbackMsg, setFeedbackMsg] = useState(null) // { type: 'success' | 'error', text: '' }

  // Modal State for Create / Edit
  const [modalOpen, setModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  // Delete Confirmation Modal
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [locationToDelete, setLocationToDelete] = useState(null)

  // Fetch real live outlets from backend
  const fetchOutlets = async () => {
    try {
      const res = await outletAPI.getAll({})
      if (res?.data && Array.isArray(res.data)) {
        setOutletsList(res.data)
        return res.data
      }
    } catch (err) {
      console.warn('Failed to fetch live outlets, using defaults:', err)
    }
    const defaultOutlets = [
      { id: 1, code: 'OUT-001', description: 'Main Mart Toul Kork' },
      { id: 2, code: 'OUT-002', description: 'BKK1 Flagship Store' },
      { id: 3, code: 'OUT-003', description: 'Koh Norea' },
    ]
    setOutletsList(defaultOutlets)
    return defaultOutlets
  }

  // Fetch locations from backend API
  const fetchLocations = async () => {
    setLoading(true)
    try {
      const params = {
        search: searchText.trim(),
        searchBy: searchBy === 'Any' ? '' : searchBy.toLowerCase().replace(/\s+/g, '_'),
        status: filterStatus === 'All' ? '' : filterStatus.toLowerCase(),
        outlet: selectedOutletFilter === 'All' ? '' : selectedOutletFilter,
      }
      const res = await locationAPI.getAll(params)
      if (res && res.data) {
        setLocations(res.data)
      } else {
        applyClientFilter()
      }
    } catch (err) {
      console.warn('Backend API request failed, applying local simulation:', err)
      applyClientFilter()
    } finally {
      setLoading(false)
    }
  }

  // Fallback client filter
  const applyClientFilter = () => {
    let list = [...FALLBACK_LOCATIONS]
    if (filterStatus === 'Active') list = list.filter((loc) => loc.active)
    if (filterStatus === 'Inactive') list = list.filter((loc) => !loc.active)

    if (selectedOutletFilter && selectedOutletFilter !== 'All') {
      list = list.filter(
        (loc) => loc.outlet && loc.outlet.toLowerCase() === selectedOutletFilter.toLowerCase()
      )
    }

    if (searchText.trim()) {
      const q = searchText.trim().toLowerCase()
      list = list.filter((loc) => {
        const code = (loc.code || '').toLowerCase()
        const desc = (loc.description || '').toLowerCase()
        const sec = (loc.secondLanguage || '').toLowerCase()
        const ref = (loc.reference || '').toLowerCase()

        if (searchBy === 'Code') return code.includes(q)
        if (searchBy === 'Description') return desc.includes(q)
        if (searchBy === 'Second Language') return sec.includes(q)
        return code.includes(q) || desc.includes(q) || sec.includes(q) || ref.includes(q)
      })
    }
    setLocations(list)
  }

  // Initial load
  useEffect(() => {
    let active = true
    const init = async () => {
      await fetchOutlets()
      if (!active) return
      try {
        const res = await locationAPI.getAll({})
        if (active && res?.data) {
          setLocations(res.data)
        } else if (active) {
          setLocations(FALLBACK_LOCATIONS)
        }
      } catch (err) {
        if (active) {
          console.warn('Initial load locations failed:', err)
          setLocations(FALLBACK_LOCATIONS)
        }
      } finally {
        if (active) setLoading(false)
      }
    }
    init()
    return () => {
      active = false
    }
  }, [])

  const showFeedback = (text, type = 'success') => {
    setFeedbackMsg({ type, text })
    setTimeout(() => setFeedbackMsg(null), 3500)
  }

  const handleSearch = (e) => {
    if (e) e.preventDefault()
    fetchLocations()
  }

  const handleResetSearch = () => {
    setSearchText('')
    setSearchBy('Any')
    setFilterStatus('All')
    setSelectedOutletFilter('All')
    setTimeout(() => {
      locationAPI
        .getAll({})
        .then((res) => {
          if (res?.data) setLocations(res.data)
          else setLocations(FALLBACK_LOCATIONS)
        })
        .catch(() => setLocations(FALLBACK_LOCATIONS))
    }, 50)
  }

  // Auto Generate Code helper
  const handleAutoGenerateCode = async () => {
    try {
      const res = await locationAPI.getNextCode()
      if (res?.data?.code) {
        setFormData((prev) => ({ ...prev, code: res.data.code }))
        return
      }
    } catch (err) {
      console.warn('Could not fetch next code from backend, generating locally:', err)
    }
    const existing = locations.map((l) => l.code || '')
    let max = 0
    existing.forEach((c) => {
      const m = c.match(/LOC-(\d+)/i)
      if (m && parseInt(m[1], 10) > max) max = parseInt(m[1], 10)
    })
    const nextCode = `LOC-${String(max + 1).padStart(3, '0')}`
    setFormData((prev) => ({ ...prev, code: nextCode }))
  }

  // Open Create Modal
  const handleOpenCreate = async () => {
    setIsEditing(false)
    setFormError('')

    // Default outlet to first available outlet
    const defaultOutlet = outletsList.length > 0 ? outletsList[0].description : ''

    setFormData({
      ...INITIAL_FORM,
      code: '',
      outlet: defaultOutlet,
    })
    setModalOpen(true)

    // Pre-populate with auto-generated code
    try {
      const res = await locationAPI.getNextCode()
      if (res?.data?.code) {
        setFormData((prev) => ({ ...prev, code: res.data.code }))
      } else {
        const nextCode = `LOC-${String(locations.length + 1).padStart(3, '0')}`
        setFormData((prev) => ({ ...prev, code: nextCode }))
      }
    } catch {
      const nextCode = `LOC-${String(locations.length + 1).padStart(3, '0')}`
      setFormData((prev) => ({ ...prev, code: nextCode }))
    }
  }

  // Open Edit Modal
  const handleOpenEdit = (loc) => {
    setIsEditing(true)
    setFormError('')
    setFormData({
      ...INITIAL_FORM,
      ...loc,
    })
    setModalOpen(true)
  }

  // Handle Form Submit (Create / Update)
  const handleSubmitForm = async (e) => {
    e.preventDefault()
    setFormError('')

    // Required fields validation
    if (!formData.description || !formData.description.trim()) {
      setFormError(
        lang === 'en' ? 'Description is required (*).' : 'ការពិពណ៌នាត្រូវតែបំពេញ (*)'
      )
      return
    }

    if (!formData.outlet || !formData.outlet.trim()) {
      setFormError(
        lang === 'en' ? 'Outlet is required (*).' : 'សូមជ្រើសរើសច្រកលក់ (Outlet *)'
      )
      return
    }

    setSaving(true)
    try {
      if (isEditing && formData.id) {
        const res = await locationAPI.update(formData.id, formData)
        const updated = res?.data || formData
        setLocations((prev) => prev.map((l) => (l.id === formData.id ? updated : l)))
        showFeedback(
          lang === 'en'
            ? `Location ${updated.code} updated successfully.`
            : `ទីតាំង ${updated.code} ត្រូវបានកែប្រែដោយជោគជ័យ។`,
          'success'
        )
      } else {
        let payload = { ...formData }
        if (!payload.code || !payload.code.trim()) {
          payload.code = `LOC-${String(locations.length + 1).padStart(3, '0')}`
        }
        const res = await locationAPI.create(payload)
        const created = res?.data || { ...payload, id: Date.now() }
        setLocations((prev) => [created, ...prev])
        showFeedback(
          lang === 'en'
            ? `Location ${created.code} created successfully.`
            : `ទីតាំង ${created.code} ត្រូវបានបង្កើតដោយជោគជ័យ។`,
          'success'
        )
      }
      setModalOpen(false)
    } catch (err) {
      console.error('Error saving location:', err)
      setFormError(err.message || 'Failed to save location.')
    } finally {
      setSaving(false)
    }
  }

  // Toggle Active Status
  const handleToggleActive = async (loc) => {
    const nextStatus = !loc.active
    // Optimistic UI update
    setLocations((prev) =>
      prev.map((l) => (l.id === loc.id ? { ...l, active: nextStatus } : l))
    )

    try {
      await locationAPI.toggleStatus(loc.id, nextStatus)
      showFeedback(
        lang === 'en'
          ? `Location ${loc.code} status set to ${nextStatus ? 'Active' : 'Inactive'}.`
          : `ស្ថានភាពទីតាំង ${loc.code} ត្រូវបានប្តូរទៅ ${nextStatus ? 'សកម្ម' : 'អសកម្ម'}។`,
        'success'
      )
    } catch (err) {
      console.error('Toggle status failed, reverting:', err)
      setLocations((prev) =>
        prev.map((l) => (l.id === loc.id ? { ...l, active: loc.active } : l))
      )
      showFeedback(
        lang === 'en' ? 'Failed to update location status.' : 'មិនអាចប្តូរស្ថានភាពទីតាំងបានទេ។',
        'error'
      )
    }
  }

  // Delete Prompt & Confirmation
  const handlePromptDelete = (loc) => {
    setLocationToDelete(loc)
    setDeleteConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!locationToDelete) return
    try {
      await locationAPI.delete(locationToDelete.id)
    } catch (err) {
      console.warn('Backend delete error (or local):', err)
    }
    setLocations((prev) => prev.filter((l) => l.id !== locationToDelete.id))
    showFeedback(
      lang === 'en'
        ? `Location ${locationToDelete.code} deleted successfully.`
        : `ទីតាំង ${locationToDelete.code} ត្រូវបានលុប។`,
      'success'
    )
    setDeleteConfirmOpen(false)
    setLocationToDelete(null)
  }

  // Count active advance filters
  const activeAdvanceCount = useMemo(() => {
    return selectedOutletFilter !== 'All' ? 1 : 0
  }, [selectedOutletFilter])

  return (
    <div className="space-y-6">
      {/* Toast Feedback Notification */}
      {feedbackMsg && (
        <div
          className={`flex items-center gap-3 rounded-2xl border p-4 text-xs font-bold shadow-lg animate-in fade-in duration-200 ${
            feedbackMsg.type === 'success'
              ? 'border-emerald-500/40 bg-emerald-950/80 text-emerald-300'
              : 'border-rose-500/40 bg-rose-950/80 text-rose-300'
          }`}
        >
          <span className="text-base">{feedbackMsg.type === 'success' ? '✅' : '⚠️'}</span>
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 1: SEARCH LOCATION                               */}
      {/* ======================================================== */}
      <section
        className={`rounded-3xl border p-5 sm:p-6 shadow-xl space-y-4 transition-colors ${
          isDark
            ? 'border-slate-800 bg-[#0f172a]/90 shadow-black/40 text-white'
            : 'border-slate-200 bg-white shadow-slate-200/50 text-slate-900'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-4 border-slate-700/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 text-sm font-bold">
                📍
              </span>
              <h2 className="text-base sm:text-lg font-black tracking-tight font-['Montserrat']">
                {lang === 'en' ? 'Search Location' : 'ស្វែងរកទីតាំង (Search Location)'}
              </h2>
            </div>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {lang === 'en'
                ? 'Search location by any condition. Ex(Any, Code, Description...)'
                : 'ស្វែងរកទីតាំងតាមលក្ខខណ្ឌណាមួយ ឧទាហរណ៍ (ទាំងអស់ កូដ ការពិពណ៌នា...)'}
            </p>
          </div>

          {/* "+ Create" Action Button */}
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-4 py-2 text-xs font-black text-white shadow-lg shadow-emerald-600/25 transition active:scale-95 cursor-pointer self-start sm:self-center shrink-0"
          >
            <span className="text-base leading-none">+</span>
            <span>{lang === 'en' ? 'Create Location' : 'បង្កើតទីតាំងថ្មី'}</span>
          </button>
        </div>

        {/* Search Filter Controls */}
        <form onSubmit={handleSearch} className="space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 items-end">
            {/* Search - Textbox */}
            <div className="sm:col-span-4 space-y-1">
              <label
                className={`text-[11px] font-bold uppercase tracking-wider ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                {lang === 'en' ? 'Search' : 'ស្វែងរក (Search)'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder={
                    lang === 'en' ? 'Search by condition...' : 'បញ្ចូលពាក្យគន្លឹះស្វែងរក...'
                  }
                  className={`w-full rounded-xl border px-3.5 py-2 text-xs font-semibold outline-none transition ${
                    isDark
                      ? 'border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20'
                      : 'border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-xs'
                  }`}
                />
                {searchText && (
                  <button
                    type="button"
                    onClick={() => setSearchText('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Search By - Dropdown (Any, Code, Description, Second Language) */}
            <div className="sm:col-span-3 space-y-1">
              <label
                className={`text-[11px] font-bold uppercase tracking-wider ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                {lang === 'en' ? 'Search By' : 'ស្វែងរកតាម (Search By)'}
              </label>
              <select
                value={searchBy}
                onChange={(e) => setSearchBy(e.target.value)}
                className={`w-full rounded-xl border px-3 py-2 text-xs font-semibold outline-none transition cursor-pointer ${
                  isDark
                    ? 'border-slate-700 bg-slate-950 text-white focus:border-emerald-400'
                    : 'border-slate-300 bg-white text-slate-900 focus:border-emerald-500 shadow-xs'
                }`}
              >
                <option value="Any">{lang === 'en' ? 'Any Condition' : 'គ្រប់លក្ខខណ្ឌ (Any)'}</option>
                <option value="Code">{lang === 'en' ? 'Code' : 'កូដ (Code)'}</option>
                <option value="Description">{lang === 'en' ? 'Description' : 'ការពិពណ៌នា (Description)'}</option>
                <option value="Second Language">
                  {lang === 'en' ? 'Second Language' : 'ភាសាទីពីរ (Second Language)'}
                </option>
              </select>
            </div>

            {/* Status - Dropdown (Active, All, Inactive) */}
            <div className="sm:col-span-2 space-y-1">
              <label
                className={`text-[11px] font-bold uppercase tracking-wider ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                {lang === 'en' ? 'Status' : 'ស្ថានភាព (Status)'}
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`w-full rounded-xl border px-3 py-2 text-xs font-semibold outline-none transition cursor-pointer ${
                  isDark
                    ? 'border-slate-700 bg-slate-950 text-white focus:border-emerald-400'
                    : 'border-slate-300 bg-white text-slate-900 focus:border-emerald-500 shadow-xs'
                }`}
              >
                <option value="Active">{lang === 'en' ? 'Active' : 'សកម្ម (Active)'}</option>
                <option value="All">{lang === 'en' ? 'All' : 'ទាំងអស់ (All)'}</option>
                <option value="Inactive">{lang === 'en' ? 'Inactive' : 'អសកម្ម (Inactive)'}</option>
              </select>
            </div>

            {/* Advance Button */}
            <div className="sm:col-span-1">
              <button
                type="button"
                onClick={() => setIsAdvanceOpen(!isAdvanceOpen)}
                className={`w-full flex items-center justify-center gap-1 rounded-xl border px-2.5 py-2 text-xs font-bold transition active:scale-95 cursor-pointer ${
                  isAdvanceOpen || activeAdvanceCount > 0
                    ? 'border-cyan-500/60 bg-cyan-500/15 text-cyan-300 ring-2 ring-cyan-500/20'
                    : isDark
                    ? 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600 hover:text-white'
                    : 'border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
                title={lang === 'en' ? 'Toggle Advance Filters' : 'តម្រងបន្ថែម (Advance Filters)'}
              >
                <span>⚙️</span>
                <span className="hidden xl:inline">{lang === 'en' ? 'Advance' : 'កម្រិតខ្ពស់'}</span>
                {activeAdvanceCount > 0 && (
                  <span className="ml-1 rounded-full bg-cyan-400 px-1.5 py-0.2 text-[9px] font-black text-slate-950">
                    {activeAdvanceCount}
                  </span>
                )}
              </button>
            </div>

            {/* Search Button & Reset */}
            <div className="sm:col-span-2 flex items-center gap-2">
              <button
                type="submit"
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition active:scale-95 cursor-pointer"
              >
                <span>🔍</span>
                <span>{lang === 'en' ? 'Search' : 'ស្វែងរក'}</span>
              </button>
              <button
                type="button"
                onClick={handleResetSearch}
                title={lang === 'en' ? 'Reset search' : 'កំណត់ឡើងវិញ'}
                className={`rounded-xl border px-2.5 py-2 text-xs font-bold transition active:scale-95 cursor-pointer ${
                  isDark
                    ? 'border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'
                    : 'border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                🔄
              </button>
            </div>
          </div>

          {/* ADVANCE FILTER SECTION: Outlet Dropdown using Real Live Data */}
          {isAdvanceOpen && (
            <div
              className={`p-4 rounded-2xl border transition-all animate-in fade-in slide-in-from-top-2 duration-200 ${
                isDark
                  ? 'border-cyan-500/30 bg-cyan-950/20 text-white'
                  : 'border-cyan-200 bg-cyan-50/50 text-slate-900'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-cyan-500/20 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 text-sm">🏬</span>
                  <span className="text-xs font-black uppercase tracking-wider text-cyan-400">
                    {lang === 'en' ? 'Advance Filter: Outlet Selection' : 'តម្រងកម្រិតខ្ពស់៖ ជ្រើសរើសច្រកលក់'}
                  </span>
                </div>
                {selectedOutletFilter !== 'All' && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedOutletFilter('All')
                      setTimeout(fetchLocations, 50)
                    }}
                    className="text-[11px] font-bold text-cyan-400 hover:underline cursor-pointer"
                  >
                    {lang === 'en' ? 'Clear Outlet Filter' : 'សម្អាតតម្រងច្រកលក់'}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                <div className="sm:col-span-8 space-y-1">
                  <label
                    className={`text-[11px] font-bold uppercase tracking-wider ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    {lang === 'en' ? 'Outlet (Real Live Data)' : 'ច្រកលក់ (ទិន្នន័យជាក់ស្តែង)'}
                  </label>
                  <select
                    value={selectedOutletFilter}
                    onChange={(e) => {
                      setSelectedOutletFilter(e.target.value)
                    }}
                    className={`w-full rounded-xl border px-3.5 py-2 text-xs font-semibold outline-none transition cursor-pointer ${
                      isDark
                        ? 'border-slate-700 bg-slate-950 text-white focus:border-cyan-400'
                        : 'border-slate-300 bg-white text-slate-900 focus:border-cyan-500 shadow-xs'
                    }`}
                  >
                    <option value="All">
                      {lang === 'en' ? 'All Outlets (Show Every Location)' : 'គ្រប់ច្រកលក់ទាំងអស់ (All Outlets)'}
                    </option>
                    {outletsList.map((outlet) => (
                      <option key={outlet.id || outlet.code} value={outlet.description}>
                        {outlet.code ? `[${outlet.code}] ` : ''}
                        {outlet.description}
                        {outlet.city ? ` — ${outlet.city}` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-4 flex items-end">
                  <button
                    type="button"
                    onClick={handleSearch}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-cyan-600/25 transition active:scale-95 cursor-pointer"
                  >
                    <span>⚡</span>
                    <span>{lang === 'en' ? 'Apply Advance Filter' : 'អនុវត្តតម្រងកម្រិតខ្ពស់'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </section>

      {/* ======================================================== */}
      {/* SECTION 2: LOCATION LIST TABLE                           */}
      {/* ======================================================== */}
      <section
        className={`rounded-3xl border p-5 sm:p-6 shadow-xl space-y-4 transition-colors ${
          isDark
            ? 'border-slate-800 bg-[#0f172a]/90 shadow-black/40 text-white'
            : 'border-slate-200 bg-white shadow-slate-200/50 text-slate-900'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-4 border-slate-700/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-500/15 text-teal-400 text-sm font-bold">
                📋
              </span>
              <h2 className="text-base sm:text-lg font-black tracking-tight font-['Montserrat']">
                {lang === 'en' ? 'Location List' : 'បញ្ជីទីតាំង (Location List)'}
              </h2>
            </div>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {lang === 'en'
                ? 'Show information of Location. Ex(Code, Description, Second Language...)'
                : 'បង្ហាញព័ត៌មានលម្អិតរបស់ទីតាំង ឧទាហរណ៍ (កូដ ការពិពណ៌នា ភាសាទីពីរ...)'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 font-mono text-xs font-bold ${
                isDark
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                  : 'bg-slate-100 text-emerald-700 border border-slate-200'
              }`}
            >
              {locations.length} {lang === 'en' ? 'Locations' : 'ទីតាំង'}
            </span>
          </div>
        </div>

        {/* Table Container */}
        <div
          className={`overflow-x-auto rounded-2xl border ${
            isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-white'
          }`}
        >
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr
                className={`border-b text-[10px] font-black uppercase tracking-wider ${
                  isDark
                    ? 'border-slate-800 bg-slate-900/80 text-slate-400'
                    : 'border-slate-200 bg-slate-50 text-slate-600'
                }`}
              >
                <th className="py-3.5 px-4">{lang === 'en' ? 'Code' : 'កូដ'}</th>
                <th className="py-3.5 px-4">{lang === 'en' ? 'Description' : 'ការពិពណ៌នា'}</th>
                <th className="py-3.5 px-4">{lang === 'en' ? 'Second Language' : 'ភាសាទីពីរ'}</th>
                <th className="py-3.5 px-4">{lang === 'en' ? 'Outlet' : 'ច្រកលក់'}</th>
                <th className="py-3.5 px-4">{lang === 'en' ? 'Reference' : 'ឯកសារយោង (Reference)'}</th>
                <th className="py-3.5 px-4 text-center">{lang === 'en' ? 'Capabilities' : 'មុខងារ'}</th>
                <th className="py-3.5 px-4 text-center">{lang === 'en' ? 'Active' : 'សកម្ម'}</th>
                <th className="py-3.5 px-4 text-right">{lang === 'en' ? 'Actions' : 'សកម្មភាព'}</th>
              </tr>
            </thead>
            <tbody className={`divide-y font-medium ${isDark ? 'divide-slate-800/70' : 'divide-slate-200'}`}>
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-10 text-center text-xs text-slate-400">
                    <span className="inline-block animate-spin mr-2">⏳</span>
                    {lang === 'en' ? 'Loading locations from database...' : 'កំពុងផ្ទុកទិន្នន័យទីតាំង...'}
                  </td>
                </tr>
              ) : locations.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center space-y-2">
                    <div className="text-3xl">📍</div>
                    <p className="text-xs font-bold text-slate-400">
                      {lang === 'en'
                        ? 'No location found matching your search condition.'
                        : 'រកមិនឃើញទីតាំងដែលត្រូវនឹងលក្ខខណ្ឌស្វែងរកទេ។'}
                    </p>
                    <button
                      type="button"
                      onClick={handleResetSearch}
                      className="text-xs font-bold text-emerald-400 hover:underline cursor-pointer"
                    >
                      {lang === 'en' ? 'Reset search filters' : 'សម្អាតលក្ខខណ្ឌស្វែងរក'}
                    </button>
                  </td>
                </tr>
              ) : (
                locations.map((loc) => (
                  <tr
                    key={loc.id || loc.code}
                    className={`transition-colors ${isDark ? 'hover:bg-slate-900/50' : 'hover:bg-slate-50'}`}
                  >
                    {/* Code */}
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20 shrink-0">
                          📍
                        </span>
                        <span className="bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          {loc.code}
                        </span>
                      </div>
                    </td>

                    {/* Description */}
                    <td className="py-3 px-4 font-bold max-w-xs truncate">
                      <div className="flex items-center gap-2">
                        <span className={isDark ? 'text-white' : 'text-slate-950'}>{loc.description || '—'}</span>
                        {loc.isDefault && (
                          <span className="rounded bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.2 text-[9px] font-black uppercase text-amber-400">
                            {lang === 'en' ? 'Default' : 'លំនាំដើម'}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Second Language */}
                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {loc.secondLanguage || '—'}
                    </td>

                    {/* Outlet */}
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        <span>🏬</span>
                        <span>{loc.outlet || '—'}</span>
                      </span>
                    </td>

                    {/* Reference */}
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                      {loc.reference || '—'}
                    </td>

                    {/* Capabilities Flags (Receive, Sale) */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {loc.receive && (
                          <span
                            className="rounded-md bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400"
                            title={lang === 'en' ? 'Can Receive Goods' : 'អាចទទួលទំនិញ'}
                          >
                            📥 Receive
                          </span>
                        )}
                        {loc.sale && (
                          <span
                            className="rounded-md bg-blue-500/10 border border-blue-500/30 px-1.5 py-0.5 text-[9px] font-bold text-blue-400"
                            title={lang === 'en' ? 'Can Sell from this location' : 'អាចលក់ទំនិញ'}
                          >
                            🛒 Sale
                          </span>
                        )}
                        {!loc.receive && !loc.sale && (
                          <span className="text-[10px] text-slate-500">—</span>
                        )}
                      </div>
                    </td>

                    {/* Active */}
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(loc)}
                        title={lang === 'en' ? 'Click to toggle status' : 'ចុចដើម្បីប្តូរស្ថានភាព'}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition active:scale-95 ${
                          loc.active
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500/25'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            loc.active ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                          }`}
                        />
                        <span>
                          {loc.active ? (lang === 'en' ? 'Active' : 'សកម្ម') : (lang === 'en' ? 'Inactive' : 'អសកម្ម')}
                        </span>
                      </button>
                    </td>

                    {/* Actions: Delete button and edit */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(loc)}
                          title={lang === 'en' ? 'Edit Location' : 'កែប្រែទីតាំង'}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition border border-blue-500/20 active:scale-95 cursor-pointer"
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePromptDelete(loc)}
                          title={lang === 'en' ? 'Delete Location' : 'លុបទីតាំង'}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition border border-rose-500/20 active:scale-95 cursor-pointer"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 3: CREATE / EDIT LOCATION MODAL DIALOG           */}
      {/* ======================================================== */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
          <div
            className={`w-full max-w-2xl rounded-3xl border shadow-2xl transition-all my-8 overflow-hidden ${
              isDark
                ? 'border-slate-700 bg-slate-900 text-white shadow-black/80'
                : 'border-slate-200 bg-white text-slate-900 shadow-slate-300'
            }`}
          >
            {/* Modal Header */}
            <div
              className={`flex items-center justify-between p-5 sm:p-6 border-b ${
                isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-100 bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 text-lg font-bold">
                  📍
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-black tracking-tight font-['Montserrat']">
                    {isEditing
                      ? lang === 'en'
                        ? 'Edit Location'
                        : 'កែប្រែទីតាំង (Edit Location)'
                      : lang === 'en'
                      ? 'Create Location'
                      : 'បង្កើតទីតាំងថ្មី (Create Location)'}
                  </h3>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {lang === 'en'
                      ? 'General Information - Input the general location information'
                      : 'ព័ត៌មានទូទៅ - បញ្ចូលព័ត៌មានទូទៅនៃទីតាំង'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitForm} className="p-5 sm:p-6 space-y-5">
              {/* Form Validation Error Banner */}
              {formError && (
                <div className="flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-950/60 p-3 text-xs font-bold text-rose-300">
                  <span>⚠️</span>
                  <span>{formError}</span>
                </div>
              )}

              {/* SECTION: GENERAL INFORMATION */}
              <div className="space-y-4">
                <div className="border-b pb-2 border-slate-700/50">
                  <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400">
                    {lang === 'en' ? 'General Information' : 'ព័ត៌មានទូទៅ (General Information)'}
                  </h4>
                  <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {lang === 'en'
                      ? 'Input the general location information'
                      : 'បញ្ចូលព័ត៌មានទូទៅរបស់ទីតាំង'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                  {/* Code - Auto Generate Code - Textbox */}
                  <div className="sm:col-span-8 space-y-1">
                    <div className="flex items-center justify-between">
                      <label
                        className={`text-[11px] font-bold uppercase tracking-wider ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}
                      >
                        {lang === 'en' ? 'Code' : 'កូដ (Code)'}
                      </label>
                      <button
                        type="button"
                        onClick={handleAutoGenerateCode}
                        className="text-[10px] font-bold text-emerald-400 hover:underline cursor-pointer"
                      >
                        ⚡ {lang === 'en' ? 'Auto Generate Code' : 'បង្កើតកូដស្វ័យប្រវត្តិ'}
                      </button>
                    </div>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      placeholder="e.g. LOC-001"
                      className={`w-full rounded-xl border px-3.5 py-2 text-xs font-mono font-bold outline-none transition ${
                        isDark
                          ? 'border-slate-700 bg-slate-950 text-emerald-400 placeholder-slate-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20'
                          : 'border-slate-300 bg-white text-emerald-700 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-xs'
                      }`}
                    />
                  </div>

                  {/* Active - Tickbox */}
                  <div className="sm:col-span-4 flex items-center pt-5">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={Boolean(formData.active)}
                        onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                        className="h-4 w-4 rounded border-slate-700 text-emerald-500 focus:ring-emerald-400 cursor-pointer accent-emerald-500"
                      />
                      <span className="text-xs font-bold">
                        {lang === 'en' ? 'Active' : 'សកម្ម (Active)'}
                      </span>
                    </label>
                  </div>

                  {/* Description * - Textbox */}
                  <div className="sm:col-span-12 space-y-1">
                    <label
                      className={`text-[11px] font-bold uppercase tracking-wider ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      {lang === 'en' ? 'Description *' : 'ការពិពណ៌នា * (Description)'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder={
                        lang === 'en'
                          ? 'e.g. Main Warehouse A, Front Store Display Shelf...'
                          : 'ឧទាហរណ៍ ឃ្លាំងធំ A, ធ្នើរតាំងលក់...'
                      }
                      className={`w-full rounded-xl border px-3.5 py-2 text-xs font-semibold outline-none transition ${
                        isDark
                          ? 'border-slate-700 bg-slate-950 text-white placeholder-slate-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20'
                          : 'border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-xs'
                      }`}
                    />
                  </div>

                  {/* Second Language - Textbox */}
                  <div className="sm:col-span-12 space-y-1">
                    <label
                      className={`text-[11px] font-bold uppercase tracking-wider ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      {lang === 'en' ? 'Second Language' : 'ភាសាទីពីរ (Second Language)'}
                    </label>
                    <input
                      type="text"
                      value={formData.secondLanguage}
                      onChange={(e) => setFormData({ ...formData, secondLanguage: e.target.value })}
                      placeholder={
                        lang === 'en' ? 'Khmer Name or second language...' : 'ឈ្មោះជាភាសាខ្មែរ...'
                      }
                      className={`w-full rounded-xl border px-3.5 py-2 text-xs font-semibold outline-none transition ${
                        isDark
                          ? 'border-slate-700 bg-slate-950 text-white placeholder-slate-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20'
                          : 'border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-xs'
                      }`}
                    />
                  </div>

                  {/* Outlet * - Dropdown using real live data */}
                  <div className="sm:col-span-6 space-y-1">
                    <label
                      className={`text-[11px] font-bold uppercase tracking-wider ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      {lang === 'en' ? 'Outlet *' : 'ច្រកលក់ * (Outlet)'}
                    </label>
                    <select
                      required
                      value={formData.outlet}
                      onChange={(e) => setFormData({ ...formData, outlet: e.target.value })}
                      className={`w-full rounded-xl border px-3.5 py-2 text-xs font-semibold outline-none transition cursor-pointer ${
                        isDark
                          ? 'border-slate-700 bg-slate-950 text-white focus:border-emerald-400'
                          : 'border-slate-300 bg-white text-slate-900 focus:border-emerald-500 shadow-xs'
                      }`}
                    >
                      <option value="">
                        {lang === 'en' ? '— Select Outlet —' : '— ជ្រើសរើសច្រកលក់ —'}
                      </option>
                      {outletsList.map((outlet) => (
                        <option key={outlet.id || outlet.code} value={outlet.description}>
                          {outlet.code ? `[${outlet.code}] ` : ''}
                          {outlet.description}
                          {outlet.city ? ` (${outlet.city})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Reference - Textbox */}
                  <div className="sm:col-span-6 space-y-1">
                    <label
                      className={`text-[11px] font-bold uppercase tracking-wider ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      {lang === 'en' ? 'Reference' : 'ឯកសារយោង (Reference)'}
                    </label>
                    <input
                      type="text"
                      value={formData.reference}
                      onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                      placeholder="e.g. WH-A-01, BIN-09..."
                      className={`w-full rounded-xl border px-3.5 py-2 text-xs font-semibold outline-none transition ${
                        isDark
                          ? 'border-slate-700 bg-slate-950 text-white placeholder-slate-600 focus:border-emerald-400'
                          : 'border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-emerald-500 shadow-xs'
                      }`}
                    />
                  </div>

                  {/* Tickboxes: Receive, Sale, Default */}
                  <div className="sm:col-span-12 pt-2">
                    <div className="p-3.5 rounded-2xl border border-slate-700/50 bg-slate-950/40 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Receive - Tickbox */}
                      <label className="flex items-center gap-2.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={Boolean(formData.receive)}
                          onChange={(e) => setFormData({ ...formData, receive: e.target.checked })}
                          className="h-4 w-4 rounded border-slate-700 text-emerald-500 focus:ring-emerald-400 cursor-pointer accent-emerald-500"
                        />
                        <span className="text-xs font-bold">
                          📥 {lang === 'en' ? 'Receive' : 'ទទួលទំនិញ (Receive)'}
                        </span>
                      </label>

                      {/* Sale - Tickbox */}
                      <label className="flex items-center gap-2.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={Boolean(formData.sale)}
                          onChange={(e) => setFormData({ ...formData, sale: e.target.checked })}
                          className="h-4 w-4 rounded border-slate-700 text-blue-500 focus:ring-blue-400 cursor-pointer accent-blue-500"
                        />
                        <span className="text-xs font-bold">
                          🛒 {lang === 'en' ? 'Sale' : 'លក់ទំនិញ (Sale)'}
                        </span>
                      </label>

                      {/* Default - Tickbox */}
                      <label className="flex items-center gap-2.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={Boolean(formData.isDefault)}
                          onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                          className="h-4 w-4 rounded border-slate-700 text-amber-500 focus:ring-amber-400 cursor-pointer accent-amber-500"
                        />
                        <span className="text-xs font-bold">
                          ⭐ {lang === 'en' ? 'Default' : 'លំនាំដើម (Default)'}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div
                className={`flex items-center justify-end gap-2.5 pt-4 border-t ${
                  isDark ? 'border-slate-800' : 'border-slate-200'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition active:scale-95 cursor-pointer"
                >
                  {lang === 'en' ? 'Cancel' : 'បោះបង់'}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-5 py-2 text-xs font-black text-white shadow-lg shadow-emerald-600/25 transition active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {saving && <span className="inline-block animate-spin">⏳</span>}
                  <span>
                    {isEditing
                      ? lang === 'en'
                        ? 'Update Location'
                        : 'ធ្វើបច្ចុប្បន្នភាព'
                      : lang === 'en'
                      ? 'Save Location'
                      : 'រក្សាទុកទីតាំង'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 4: DELETE CONFIRMATION DIALOG                    */}
      {/* ======================================================== */}
      {deleteConfirmOpen && locationToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className={`w-full max-w-md rounded-3xl border p-6 shadow-2xl space-y-4 ${
              isDark
                ? 'border-slate-700 bg-slate-900 text-white shadow-black/80'
                : 'border-slate-200 bg-white text-slate-900 shadow-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-400 text-xl font-bold">
                ⚠️
              </span>
              <div>
                <h3 className="text-base font-black tracking-tight">
                  {lang === 'en' ? 'Confirm Location Deletion' : 'បញ្ជាក់ការលុបទីតាំង'}
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {lang === 'en'
                    ? 'This action cannot be undone.'
                    : 'សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។'}
                </p>
              </div>
            </div>

            <p className="text-xs leading-relaxed">
              {lang === 'en' ? (
                <>
                  Are you sure you want to delete location{' '}
                  <span className="font-mono font-bold text-rose-400">
                    {locationToDelete.code}
                  </span>{' '}
                  ({locationToDelete.description})?
                </>
              ) : (
                <>
                  តើអ្នកប្រាកដជាចង់លុបទីតាំង{' '}
                  <span className="font-mono font-bold text-rose-400">
                    {locationToDelete.code}
                  </span>{' '}
                  ({locationToDelete.description}) នេះមែនទេ?
                </>
              )}
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setDeleteConfirmOpen(false)
                  setLocationToDelete(null)
                }}
                className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition active:scale-95 cursor-pointer"
              >
                {lang === 'en' ? 'Cancel' : 'បោះបង់'}
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2 text-xs font-black text-white shadow-lg shadow-rose-600/25 transition active:scale-95 cursor-pointer"
              >
                {lang === 'en' ? 'Delete Permanently' : 'លុបជាអចិន្ត្រៃយ៍'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
