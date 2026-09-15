import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useTheme } from '../../context/ThemeContext'
import { roleAPI } from '../../api/api'
import {
  ROLE_PRIVILEGES_DATA,
  MODULE_LIST,
  HIERARCHICAL_PERMISSIONS_TREE,
} from '../../data/rolePrivilegesData'

// Fallback initial roles if backend is offline
const FALLBACK_ROLES = [
  {
    id: 1,
    code: 'ROL-001',
    description: 'Super Administrator',
    secondLanguage: 'អ្នកគ្រប់គ្រងជាន់ខ្ពស់',
    numberOfUsers: 1,
    createdBy: 'System Initializer',
    active: true,
  },
  {
    id: 2,
    code: 'ROL-002',
    description: 'Store Manager',
    secondLanguage: 'អ្នកគ្រប់គ្រងហាង',
    numberOfUsers: 4,
    createdBy: 'Badmin Administrator',
    active: true,
  },
  {
    id: 3,
    code: 'ROL-003',
    description: 'Cashier',
    secondLanguage: 'បុគ្គលិកគិតលុយ',
    numberOfUsers: 18,
    createdBy: 'Badmin Administrator',
    active: true,
  },
  {
    id: 4,
    code: 'ROL-004',
    description: 'Inventory Auditor',
    secondLanguage: 'សវនករស្តុកទំនិញ',
    numberOfUsers: 3,
    createdBy: 'Badmin Administrator',
    active: true,
  },
  {
    id: 5,
    code: 'ROL-005',
    description: 'Purchasing Officer',
    secondLanguage: 'បុគ្គលិកផ្នែកទិញ',
    numberOfUsers: 2,
    createdBy: 'Badmin Administrator',
    active: true,
  },
]

// Initialize default privileges map: { [featureId]: 'NO_ACCESS' }
const createDefaultPrivilegesMap = (defaultLevel = 'NO_ACCESS') => {
  const map = {}
  ROLE_PRIVILEGES_DATA.forEach((item) => {
    map[item.id] = defaultLevel
  })
  return map
}

const INITIAL_FORM = {
  id: null,
  code: '',
  active: true,
  description: '',
  secondLanguage: '',
  privileges: createDefaultPrivilegesMap('NO_ACCESS'),
}

// Initial expanded state maps for Level 1 (Module) and Level 2 (Section)
const getInitialExpandedModules = (isOpen = true) => {
  const map = {}
  HIERARCHICAL_PERMISSIONS_TREE.forEach((mod) => {
    map[mod.module] = isOpen
  })
  return map
}

const getInitialExpandedSections = (isOpen = true) => {
  const map = {}
  HIERARCHICAL_PERMISSIONS_TREE.forEach((mod) => {
    mod.sections.forEach((sec) => {
      map[`${mod.module}__${sec.name}`] = isOpen
    })
  })
  return map
}

export default function RoleManagement() {
  const { lang } = useLanguage()
  const { isDark } = useTheme()

  // ---------------------------------------------------------------------------
  // VIEW MODE: 'list' | 'create' | 'edit'
  // ---------------------------------------------------------------------------
  const [currentView, setCurrentView] = useState('list') // 'list' | 'create' | 'edit'

  // Data & Loading State
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [feedbackMsg, setFeedbackMsg] = useState(null) // { type: 'success' | 'error' | 'info', text: '' }

  // ---------------------------------------------------------------------------
  // VIEW 1: ROLE LIST STATE
  // ---------------------------------------------------------------------------
  const [searchText, setSearchText] = useState('')
  const [searchBy, setSearchBy] = useState('Any') // Any, Code, Description, Second Language
  const [filterStatus, setFilterStatus] = useState('All') // All, Active, Inactive
  const [sortConfig, setSortConfig] = useState({ key: 'code', direction: 'asc' })

  // Delete Confirmation Modal
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState(null)

  // ---------------------------------------------------------------------------
  // VIEW 2: CREATE / EDIT ROLE FORM STATE
  // ---------------------------------------------------------------------------
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  // Privilege Matrix Filter & Accordion State
  const [privilegeSearch, setPrivilegeSearch] = useState('')
  const [selectedModuleFilter, setSelectedModuleFilter] = useState('All Modules')
  const [expandedModules, setExpandedModules] = useState(getInitialExpandedModules(true))
  const [expandedSections, setExpandedSections] = useState(getInitialExpandedSections(true))
  const [copyModalOpen, setCopyModalOpen] = useState(false)
  const [copySourceRoleId, setCopySourceRoleId] = useState('')

  // Toast Helper
  const showFeedback = (text, type = 'success') => {
    setFeedbackMsg({ text, type })
    setTimeout(() => setFeedbackMsg(null), 4000)
  }

  // Fetch Roles from Backend API
  const fetchRoles = async () => {
    setLoading(true)
    try {
      const params = {
        search: searchText.trim(),
        searchBy: searchBy === 'Any' ? '' : searchBy.toLowerCase().replace(/\s+/g, '_'),
        status: filterStatus === 'All' ? '' : filterStatus.toLowerCase(),
      }
      const res = await roleAPI.getAll(params)
      if (res && res.data) {
        setRoles(res.data)
      } else {
        setRoles(FALLBACK_ROLES)
      }
    } catch (err) {
      console.warn('Backend API failed, using fallback roles:', err)
      setRoles(FALLBACK_ROLES)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRoles()
  }, [])

  // ---------------------------------------------------------------------------
  // SORT & FILTER LIST DATA
  // ---------------------------------------------------------------------------
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const filteredAndSortedRoles = useMemo(() => {
    let list = [...roles]

    // Filter by Status
    if (filterStatus === 'Active') list = list.filter((r) => r.active)
    if (filterStatus === 'Inactive') list = list.filter((r) => !r.active)

    // Filter by Search Keyword
    if (searchText.trim()) {
      const q = searchText.trim().toLowerCase()
      list = list.filter((r) => {
        const code = (r.code || '').toLowerCase()
        const desc = (r.description || '').toLowerCase()
        const sec = (r.secondLanguage || '').toLowerCase()

        if (searchBy === 'Code') return code.includes(q)
        if (searchBy === 'Description') return desc.includes(q)
        if (searchBy === 'Second Language') return sec.includes(q)
        return code.includes(q) || desc.includes(q) || sec.includes(q)
      })
    }

    // Sort
    list.sort((a, b) => {
      let aVal = a[sortConfig.key]
      let bVal = b[sortConfig.key]

      if (typeof aVal === 'string') aVal = aVal.toLowerCase()
      if (typeof bVal === 'string') bVal = bVal.toLowerCase()

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })

    return list
  }, [roles, searchText, searchBy, filterStatus, sortConfig])

  // Clear Search & Filters
  const handleResetSearch = () => {
    setSearchText('')
    setSearchBy('Any')
    setFilterStatus('All')
    fetchRoles()
  }

  // ---------------------------------------------------------------------------
  // TRANSITIONS: CREATE & EDIT ACTIONS
  // ---------------------------------------------------------------------------
  const handleTransitionToCreate = async () => {
    setFormError('')
    setPrivilegeSearch('')
    setSelectedModuleFilter('All Modules')
    setExpandedModules(getInitialExpandedModules(true))
    setExpandedSections(getInitialExpandedSections(true))

    setFormData({
      ...INITIAL_FORM,
      code: '',
      privileges: createDefaultPrivilegesMap('NO_ACCESS'),
    })

    // Fetch next auto-generated code
    try {
      const res = await roleAPI.getNextCode()
      if (res?.data?.code) {
        setFormData((prev) => ({ ...prev, code: res.data.code }))
      } else {
        const nextCode = `ROL-${String(roles.length + 1).padStart(3, '0')}`
        setFormData((prev) => ({ ...prev, code: nextCode }))
      }
    } catch {
      const nextCode = `ROL-${String(roles.length + 1).padStart(3, '0')}`
      setFormData((prev) => ({ ...prev, code: nextCode }))
    }

    setCurrentView('create')
  }

  const handleTransitionToEdit = async (role) => {
    setFormError('')
    setPrivilegeSearch('')
    setSelectedModuleFilter('All Modules')
    setExpandedModules(getInitialExpandedModules(true))
    setExpandedSections(getInitialExpandedSections(true))

    try {
      const res = await roleAPI.getById(role.id)
      if (res?.data) {
        const roleData = res.data
        const privMap = createDefaultPrivilegesMap('NO_ACCESS')
        if (roleData.privileges && Array.isArray(roleData.privileges)) {
          roleData.privileges.forEach((p) => {
            const matched = ROLE_PRIVILEGES_DATA.find(
              (item) => item.module === p.module && item.featureName === p.featureName
            )
            if (matched) {
              privMap[matched.id] = p.accessLevel || 'NO_ACCESS'
            }
          })
        }
        setFormData({
          id: roleData.id,
          code: roleData.code || '',
          active: roleData.active ?? true,
          description: roleData.description || '',
          secondLanguage: roleData.secondLanguage || '',
          privileges: privMap,
        })
        setCurrentView('edit')
        return
      }
    } catch (err) {
      console.warn('Failed to fetch role details, using row data:', err)
    }

    // Fallback if backend fetch fails
    const initialMap = createDefaultPrivilegesMap(
      role.description === 'Super Administrator' ? 'MODIFY' : 'READ'
    )
    setFormData({
      ...INITIAL_FORM,
      ...role,
      privileges: initialMap,
    })
    setCurrentView('edit')
  }

  // ---------------------------------------------------------------------------
  // PRIVILEGE MATRIX STATE HANDLERS
  // ---------------------------------------------------------------------------
  // 1. Single Action Radio Change (mutually exclusive per row)
  const handlePrivilegeChange = (actionId, accessLevel) => {
    setFormData((prev) => ({
      ...prev,
      privileges: {
        ...prev.privileges,
        [actionId]: accessLevel,
      },
    }))
  }

  // 2. Cascade Select on Category Header Radio
  const handleCascadeCategory = (categoryActions, accessLevel) => {
    setFormData((prev) => {
      const nextPrivileges = { ...prev.privileges }
      categoryActions.forEach((action) => {
        nextPrivileges[action.id] = accessLevel
      })
      return { ...prev, privileges: nextPrivileges }
    })
  }

  // 3. Cascade Select on Module Header Radio
  const handleCascadeModule = (moduleObj, accessLevel) => {
    setFormData((prev) => {
      const nextPrivileges = { ...prev.privileges }
      moduleObj.sections.forEach((sec) => {
        sec.actions.forEach((action) => {
          nextPrivileges[action.id] = accessLevel
        })
      })
      return { ...prev, privileges: nextPrivileges }
    })
  }

  // 4. Quick Utilities: Reset all to NO_ACCESS
  const handleResetAllPrivileges = () => {
    setFormData((prev) => ({
      ...prev,
      privileges: createDefaultPrivilegesMap('NO_ACCESS'),
    }))
    showFeedback('All privileges reset to No Access.', 'info')
  }

  // 5. Quick Utilities: Copy from existing role
  const handleCopyPrivileges = async () => {
    if (!copySourceRoleId) return
    try {
      const res = await roleAPI.getById(copySourceRoleId)
      if (res?.data?.privileges && Array.isArray(res.data.privileges)) {
        const newPrivMap = createDefaultPrivilegesMap('NO_ACCESS')
        res.data.privileges.forEach((p) => {
          const matched = ROLE_PRIVILEGES_DATA.find(
            (item) => item.module === p.module && item.featureName === p.featureName
          )
          if (matched) {
            newPrivMap[matched.id] = p.accessLevel || 'NO_ACCESS'
          }
        })
        setFormData((prev) => ({ ...prev, privileges: newPrivMap }))
        showFeedback(`Privileges copied from ${res.data.description}.`, 'success')
      } else {
        const src = roles.find((r) => String(r.id) === String(copySourceRoleId))
        const level = src?.description === 'Super Administrator' ? 'MODIFY' : 'READ'
        setFormData((prev) => ({ ...prev, privileges: createDefaultPrivilegesMap(level) }))
        showFeedback(`Privileges copied from ${src?.description || 'role'}.`, 'success')
      }
    } catch (err) {
      console.error('Failed to copy privileges:', err)
      showFeedback('Failed to copy privileges.', 'error')
    } finally {
      setCopyModalOpen(false)
      setCopySourceRoleId('')
    }
  }

  // Expand / Collapse toggles
  const toggleModuleAccordion = (moduleName) => {
    setExpandedModules((prev) => ({ ...prev, [moduleName]: !prev[moduleName] }))
  }

  const toggleSectionAccordion = (sectionKey) => {
    setExpandedSections((prev) => ({ ...prev, [sectionKey]: !prev[sectionKey] }))
  }

  const handleExpandAll = (expand = true) => {
    setExpandedModules(getInitialExpandedModules(expand))
    setExpandedSections(getInitialExpandedSections(expand))
  }

  // ---------------------------------------------------------------------------
  // FILTERED TREE COMPUTATION
  // ---------------------------------------------------------------------------
  const filteredTree = useMemo(() => {
    const q = privilegeSearch.trim().toLowerCase()

    return HIERARCHICAL_PERMISSIONS_TREE.map((mod) => {
      if (selectedModuleFilter !== 'All Modules' && mod.module !== selectedModuleFilter) {
        return null
      }

      const filteredSections = mod.sections
        .map((sec) => {
          const matchingActions = sec.actions.filter((act) => {
            if (!q) return true
            const nameMatch = act.name.toLowerCase().includes(q)
            const secMatch = (act.secondLanguage || '').toLowerCase().includes(q)
            const modMatch = mod.module.toLowerCase().includes(q)
            const catMatch = sec.name.toLowerCase().includes(q)
            return nameMatch || secMatch || modMatch || catMatch
          })

          if (matchingActions.length === 0 && q) return null

          return {
            ...sec,
            sectionKey: `${mod.module}__${sec.name}`,
            actions: matchingActions,
          }
        })
        .filter(Boolean)

      if (filteredSections.length === 0) return null

      return {
        ...mod,
        sections: filteredSections,
      }
    }).filter(Boolean)
  }, [selectedModuleFilter, privilegeSearch])

  // ---------------------------------------------------------------------------
  // FORM SUBMISSION (CREATE / UPDATE)
  // ---------------------------------------------------------------------------
  const handleSaveRole = async (e) => {
    e?.preventDefault?.()
    setFormError('')

    if (!formData.description || !formData.description.trim()) {
      setFormError('Description is required (*).')
      return
    }

    setSaving(true)
    try {
      const privilegeItems = ROLE_PRIVILEGES_DATA.map((item) => ({
        module: item.module,
        category: item.category,
        featureName: item.featureName,
        secondLanguage: item.secondLanguage,
        accessLevel: formData.privileges[item.id] || 'NO_ACCESS',
      }))

      const payload = {
        id: formData.id,
        code: formData.code?.trim() || `ROL-${String(roles.length + 1).padStart(3, '0')}`,
        active: formData.active,
        description: formData.description.trim(),
        secondLanguage: formData.secondLanguage?.trim() || '',
        privileges: privilegeItems,
      }

      if (currentView === 'edit' && formData.id) {
        const res = await roleAPI.update(formData.id, payload)
        const updated = res?.data || payload
        setRoles((prev) => prev.map((r) => (r.id === formData.id ? { ...r, ...updated } : r)))
        showFeedback(`Role ${updated.code} updated successfully.`, 'success')
      } else {
        const res = await roleAPI.create(payload)
        const created = res?.data || { ...payload, id: Date.now(), numberOfUsers: 0 }
        setRoles((prev) => [created, ...prev])
        showFeedback(`Role ${created.code} created successfully.`, 'success')
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('roles_updated'))
      }

      // Transition back to list view
      setCurrentView('list')
    } catch (err) {
      console.error('Error saving role:', err)
      setFormError(err.message || 'Failed to save role.')
    } finally {
      setSaving(false)
    }
  }

  // Toggle Active Status directly from table
  const handleToggleActive = async (role) => {
    const nextStatus = !role.active
    setRoles((prev) =>
      prev.map((r) => (r.id === role.id ? { ...r, active: nextStatus } : r))
    )

    try {
      await roleAPI.toggleStatus(role.id, nextStatus)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('roles_updated'))
      }
      showFeedback(`Role ${role.code} status set to ${nextStatus ? 'Active' : 'Inactive'}.`, 'success')
    } catch (err) {
      console.error('Toggle status failed, reverting:', err)
      setRoles((prev) =>
        prev.map((r) => (r.id === role.id ? { ...r, active: !nextStatus } : r))
      )
      showFeedback('Failed to update status.', 'error')
    }
  }

  // Delete confirmation
  const handleConfirmDelete = async () => {
    if (!roleToDelete) return

    if (roleToDelete.numberOfUsers > 0) {
      showFeedback(
        `Cannot delete role ${roleToDelete.code}. There are ${roleToDelete.numberOfUsers} user(s) currently assigned.`,
        'error'
      )
      setDeleteConfirmOpen(false)
      setRoleToDelete(null)
      return
    }

    try {
      await roleAPI.delete(roleToDelete.id)
      setRoles((prev) => prev.filter((r) => r.id !== roleToDelete.id))
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('roles_updated'))
      }
      showFeedback(`Role ${roleToDelete.code} deleted successfully.`, 'success')
    } catch (err) {
      console.error('Delete role failed:', err)
      showFeedback(err.message || 'Failed to delete role.', 'error')
    } finally {
      setDeleteConfirmOpen(false)
      setRoleToDelete(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* FLOATING FEEDBACK TOAST */}
      {feedbackMsg && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-3.5 text-xs font-bold shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 ${
            feedbackMsg.type === 'error'
              ? 'border border-rose-500/40 bg-rose-950/90 text-rose-200 shadow-rose-900/30'
              : feedbackMsg.type === 'info'
              ? 'border border-cyan-500/40 bg-cyan-950/90 text-cyan-200 shadow-cyan-900/30'
              : 'border border-emerald-500/40 bg-emerald-950/90 text-emerald-200 shadow-emerald-900/30'
          }`}
        >
          <span className="text-base">
            {feedbackMsg.type === 'error' ? '⚠️' : feedbackMsg.type === 'info' ? 'ℹ️' : '✅'}
          </span>
          <span>{feedbackMsg.text}</span>
          <button
            type="button"
            onClick={() => setFeedbackMsg(null)}
            className="ml-2 text-slate-400 hover:text-white text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* ===================================================================== */}
      {/* VIEW 1: ROLE LIST SCREEN                                              */}
      {/* ===================================================================== */}
      {currentView === 'list' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* HEADER & BREADCRUMBS */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div>
              {/* Breadcrumb trail: Home > Settings > Role */}
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
                <Link to="/admin" className="hover:text-white transition">Home</Link>
                <span>&gt;</span>
                <Link to="/admin/settings" className="hover:text-white transition">Settings</Link>
                <span>&gt;</span>
                <span className="text-blue-400 font-bold">Role</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 text-lg border border-blue-500/20">
                  🛡️
                </span>
                <span>Role Management</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Add, view and edit your role in all one place
              </p>
            </div>

            {/* Primary button: + Create */}
            <div className="flex items-center gap-2.5 shrink-0">
              <Link
                to="/admin/settings"
                className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold transition active:scale-95 cursor-pointer ${
                  isDark
                    ? 'border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100 shadow-xs'
                }`}
              >
                <span>←</span>
                <span>Back to Settings</span>
              </Link>

              <button
                type="button"
                onClick={handleTransitionToCreate}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-2 text-xs font-black text-white shadow-lg shadow-blue-600/30 transition hover:brightness-110 active:scale-95 cursor-pointer"
              >
                <span className="text-sm font-bold">+</span>
                <span>Create</span>
              </button>
            </div>
          </div>

          {/* SEARCH FILTER CARD */}
          <div
            className={`rounded-2xl border p-4 sm:p-5 transition-all shadow-sm ${
              isDark
                ? 'border-slate-800 bg-slate-950/70 text-white'
                : 'border-slate-200 bg-white text-slate-900 shadow-slate-100'
            }`}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault()
                fetchRoles()
              }}
              className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-end"
            >
              {/* Keyword input: "Search here" */}
              <div className="sm:col-span-5 space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Keyword
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Search here"
                    className={`w-full rounded-xl border px-3.5 py-2 text-xs font-semibold outline-none transition ${
                      isDark
                        ? 'border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20'
                        : 'border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-xs'
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

              {/* Dropdown "Search By": options ['Any', 'Code', 'Description', 'Second Language'] */}
              <div className="sm:col-span-3 space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Search By
                </label>
                <select
                  value={searchBy}
                  onChange={(e) => setSearchBy(e.target.value)}
                  className={`w-full rounded-xl border px-3 py-2 text-xs font-semibold outline-none transition cursor-pointer ${
                    isDark
                      ? 'border-slate-700 bg-slate-950 text-white focus:border-blue-400'
                      : 'border-slate-300 bg-white text-slate-900 focus:border-blue-500 shadow-xs'
                  }`}
                >
                  <option value="Any">Any</option>
                  <option value="Code">Code</option>
                  <option value="Description">Description</option>
                  <option value="Second Language">Second Language</option>
                </select>
              </div>

              {/* Status filter */}
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className={`w-full rounded-xl border px-3 py-2 text-xs font-semibold outline-none transition cursor-pointer ${
                    isDark
                      ? 'border-slate-700 bg-slate-950 text-white focus:border-blue-400'
                      : 'border-slate-300 bg-white text-slate-900 focus:border-blue-500 shadow-xs'
                  }`}
                >
                  <option value="All">All</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Action buttons: Clear (circular icon) and "Search" button */}
              <div className="sm:col-span-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition active:scale-95 cursor-pointer"
                >
                  <span>🔍</span>
                  <span>Search</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetSearch}
                  title="Clear filters"
                  className={`flex h-8.5 w-8.5 items-center justify-center rounded-full border text-xs font-bold transition active:scale-95 cursor-pointer ${
                    isDark
                      ? 'border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'
                      : 'border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  🔄
                </button>
              </div>
            </form>
          </div>

          {/* DATA TABLE */}
          <div
            className={`rounded-2xl border transition-all shadow-sm overflow-hidden ${
              isDark
                ? 'border-slate-800 bg-slate-950/70 text-white'
                : 'border-slate-200 bg-white text-slate-900 shadow-slate-100'
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead
                  className={`border-b text-[11px] font-black uppercase tracking-wider select-none ${
                    isDark
                      ? 'border-slate-800 bg-slate-900/80 text-slate-400'
                      : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}
                >
                  <tr>
                    {/* Code Sort Header */}
                    <th
                      onClick={() => handleSort('code')}
                      className="px-4 py-3 cursor-pointer hover:text-white transition"
                    >
                      <div className="inline-flex items-center gap-1">
                        <span>Code</span>
                        <span className="text-[10px]">
                          {sortConfig.key === 'code'
                            ? sortConfig.direction === 'asc'
                              ? '▲'
                              : '▼'
                            : '↕'}
                        </span>
                      </div>
                    </th>

                    {/* Description Sort Header */}
                    <th
                      onClick={() => handleSort('description')}
                      className="px-4 py-3 cursor-pointer hover:text-white transition"
                    >
                      <div className="inline-flex items-center gap-1">
                        <span>Description</span>
                        <span className="text-[10px]">
                          {sortConfig.key === 'description'
                            ? sortConfig.direction === 'asc'
                              ? '▲'
                              : '▼'
                            : '↕'}
                        </span>
                      </div>
                    </th>

                    {/* Second Language Sort Header */}
                    <th
                      onClick={() => handleSort('secondLanguage')}
                      className="px-4 py-3 cursor-pointer hover:text-white transition"
                    >
                      <div className="inline-flex items-center gap-1">
                        <span>Second Language</span>
                        <span className="text-[10px]">
                          {sortConfig.key === 'secondLanguage'
                            ? sortConfig.direction === 'asc'
                              ? '▲'
                              : '▼'
                            : '↕'}
                        </span>
                      </div>
                    </th>

                    {/* Number of User Sort Header */}
                    <th
                      onClick={() => handleSort('numberOfUsers')}
                      className="px-4 py-3 text-center cursor-pointer hover:text-white transition"
                    >
                      <div className="inline-flex items-center gap-1 justify-center">
                        <span>Number of User</span>
                        <span className="text-[10px]">
                          {sortConfig.key === 'numberOfUsers'
                            ? sortConfig.direction === 'asc'
                              ? '▲'
                              : '▼'
                            : '↕'}
                        </span>
                      </div>
                    </th>

                    {/* Create By Sort Header */}
                    <th
                      onClick={() => handleSort('createdBy')}
                      className="px-4 py-3 cursor-pointer hover:text-white transition"
                    >
                      <div className="inline-flex items-center gap-1">
                        <span>Create By</span>
                        <span className="text-[10px]">
                          {sortConfig.key === 'createdBy'
                            ? sortConfig.direction === 'asc'
                              ? '▲'
                              : '▼'
                            : '↕'}
                        </span>
                      </div>
                    </th>

                    {/* Active Sort Header */}
                    <th
                      onClick={() => handleSort('active')}
                      className="px-4 py-3 text-center cursor-pointer hover:text-white transition"
                    >
                      <div className="inline-flex items-center gap-1 justify-center">
                        <span>Active</span>
                        <span className="text-[10px]">
                          {sortConfig.key === 'active'
                            ? sortConfig.direction === 'asc'
                              ? '▲'
                              : '▼'
                            : '↕'}
                        </span>
                      </div>
                    </th>

                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <div className="inline-flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                          <span>Loading roles...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredAndSortedRoles.length === 0 ? (
                    // ELEGANT EMPTY STATE COMPONENT SHOWING ICON WITH "NOT FOUND" TEXT
                    <tr>
                      <td colSpan={7} className="py-16 text-center">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-3xl text-blue-400 shadow-lg">
                            🔍
                          </div>
                          <div>
                            <h4 className="text-base font-black tracking-wider text-white">
                              NOT FOUND
                            </h4>
                            <p className="text-xs text-slate-400 mt-1 max-w-sm">
                              No role records match your search criteria. Try adjusting your search keyword or reset filters.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={handleResetSearch}
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600/20 border border-blue-500/40 px-4 py-2 text-xs font-bold text-blue-300 hover:bg-blue-600/30 transition active:scale-95 cursor-pointer mt-2"
                          >
                            <span>🔄</span>
                            <span>Clear Filters</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredAndSortedRoles.map((r) => (
                      <tr
                        key={r.id || r.code}
                        className={`transition-colors ${
                          isDark ? 'hover:bg-slate-900/60' : 'hover:bg-slate-50'
                        }`}
                      >
                        {/* Code */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="inline-block font-mono text-xs font-black text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20">
                            {r.code}
                          </span>
                        </td>

                        {/* Description */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <div className="font-bold text-sm text-slate-100 flex items-center gap-2">
                            <span>{r.description}</span>
                            {r.description === 'Super Administrator' && (
                              <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                FULL RBAC
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Second Language */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="text-xs text-slate-300 font-medium">
                            {r.secondLanguage || '—'}
                          </span>
                        </td>

                        {/* Number of User */}
                        <td className="px-4 py-3.5 text-center whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                              (r.numberOfUsers || 0) > 0
                                ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            <span>👥</span>
                            <span>{r.numberOfUsers || 0}</span>
                          </span>
                        </td>

                        {/* Create By */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="text-xs text-slate-400 font-medium">
                            {r.createdBy || 'System'}
                          </span>
                        </td>

                        {/* Active (Boolean/Badge) */}
                        <td className="px-4 py-3.5 text-center whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleToggleActive(r)}
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black transition cursor-pointer ${
                              r.active
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                                : 'bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500/25'
                            }`}
                            title={`Click to set ${r.active ? 'Inactive' : 'Active'}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                r.active ? 'bg-emerald-400' : 'bg-rose-400'
                              }`}
                            />
                            <span>{r.active ? 'Active' : 'Inactive'}</span>
                          </button>
                        </td>

                        {/* Action: Edit & Delete */}
                        <td className="px-4 py-3.5 text-center whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleTransitionToEdit(r)}
                              className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 hover:bg-blue-950 hover:border-blue-500 hover:text-blue-300 transition active:scale-95 cursor-pointer"
                              title="Edit Role"
                            >
                              ✏️
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setRoleToDelete(r)
                                setDeleteConfirmOpen(true)
                              }}
                              className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 hover:bg-rose-950 hover:border-rose-500 hover:text-rose-300 transition active:scale-95 cursor-pointer"
                              title="Delete Role"
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
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* VIEW 2: CREATE / EDIT ROLE SCREEN                                     */}
      {/* ===================================================================== */}
      {(currentView === 'create' || currentView === 'edit') && (
        <form onSubmit={handleSaveRole} className="space-y-6 animate-in fade-in duration-200">
          {/* TOP NAVIGATION & ACTIONS */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div>
              {/* Breadcrumb trail: Home > Settings > Role > Create/Edit */}
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
                <Link to="/admin" className="hover:text-white transition">Home</Link>
                <span>&gt;</span>
                <Link to="/admin/settings" className="hover:text-white transition">Settings</Link>
                <span>&gt;</span>
                <button
                  type="button"
                  onClick={() => setCurrentView('list')}
                  className="hover:text-white transition text-slate-400 cursor-pointer"
                >
                  Role
                </button>
                <span>&gt;</span>
                <span className="text-blue-400 font-bold">
                  {currentView === 'create' ? 'Create Role' : `Edit Role (${formData.code})`}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 text-lg border border-blue-500/20">
                  {currentView === 'create' ? '➕' : '✏️'}
                </span>
                <span>{currentView === 'create' ? 'Create New Role' : `Edit Role: ${formData.code}`}</span>
              </h2>
            </div>

            {/* Actions: "Cancel" (outlined/ghost) and "Save" (primary blue) */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setCurrentView('list')}
                className="rounded-xl border border-slate-700 bg-slate-900/80 px-5 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition active:scale-95 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-6 py-2 text-xs font-black text-white shadow-lg shadow-blue-600/30 transition hover:brightness-110 active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {saving && (
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}
                <span>Save</span>
              </button>
            </div>
          </div>

          {formError && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-950/60 p-3 text-xs font-bold text-rose-300 animate-in fade-in">
              <span>⚠️</span>
              <span>{formError}</span>
            </div>
          )}

          {/* GENERAL INFORMATION FORM CARD */}
          <div
            className={`rounded-2xl border p-5 sm:p-6 transition-all shadow-sm space-y-4 ${
              isDark
                ? 'border-slate-800 bg-slate-950/70 text-white'
                : 'border-slate-200 bg-white text-slate-900 shadow-slate-100'
            }`}
          >
            <div className="border-b pb-3 border-slate-800/80 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-blue-400">
                  General Information
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Input the general role information
                </p>
              </div>

              {/* Active: Checkbox, default true */}
              <label className="inline-flex items-center gap-2 text-xs font-bold cursor-pointer text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-400 focus:ring-offset-slate-950 cursor-pointer"
                />
                <span>Active</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              {/* Code: Text input, disabled/read-only with placeholder AUTO GENERATE CODE */}
              <div className="sm:col-span-4 space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Code
                </label>
                <input
                  type="text"
                  disabled
                  readOnly
                  value={formData.code}
                  placeholder="AUTO GENERATE CODE"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 py-2 text-xs font-mono font-bold text-slate-400 cursor-not-allowed outline-none"
                />
              </div>

              {/* Description: Text input, marked with red required asterisk * */}
              <div className="sm:col-span-4 space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Description <span className="text-rose-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Shift Supervisor, Store Manager..."
                  className={`w-full rounded-xl border px-3.5 py-2 text-xs font-semibold outline-none transition ${
                    isDark
                      ? 'border-slate-700 bg-slate-950 text-white placeholder-slate-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20'
                      : 'border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-xs'
                  }`}
                />
              </div>

              {/* Second Language: Text input (optional) */}
              <div className="sm:col-span-4 space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Second Language
                </label>
                <input
                  type="text"
                  value={formData.secondLanguage}
                  onChange={(e) => setFormData({ ...formData, secondLanguage: e.target.value })}
                  placeholder="e.g. អ្នកគ្រប់គ្រង, ប្រធានវេន..."
                  className={`w-full rounded-xl border px-3.5 py-2 text-xs font-semibold outline-none transition ${
                    isDark
                      ? 'border-slate-700 bg-slate-950 text-white placeholder-slate-600 focus:border-blue-400'
                      : 'border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-blue-500 shadow-xs'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* PRIVILEGE MATRIX SECTION */}
          <div
            className={`rounded-2xl border p-5 sm:p-6 transition-all shadow-sm space-y-5 ${
              isDark
                ? 'border-slate-800 bg-slate-950/70 text-white'
                : 'border-slate-200 bg-white text-slate-900 shadow-slate-100'
            }`}
          >
            {/* Header with Quick Utilities: "Reset" and "Copy" */}
            <div className="border-b pb-3 border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-blue-400">
                  Privilege
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Detail of Privilege (Hierarchical Tree: Modules &gt; Sections &gt; Actions)
                </p>
              </div>

              {/* Quick Utilities (top right): "Reset" and "Copy" button */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleExpandAll(true)}
                  className="text-[11px] font-bold text-blue-400 hover:text-blue-300 hover:underline cursor-pointer mr-1"
                >
                  Expand All
                </button>
                <span className="text-slate-600">|</span>
                <button
                  type="button"
                  onClick={() => handleExpandAll(false)}
                  className="text-[11px] font-bold text-slate-400 hover:text-slate-300 hover:underline cursor-pointer mr-3"
                >
                  Collapse All
                </button>

                <button
                  type="button"
                  onClick={handleResetAllPrivileges}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-300 hover:bg-rose-500/20 transition active:scale-95 cursor-pointer"
                >
                  <span>🔄</span>
                  <span>Reset</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCopyModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-blue-500/40 bg-blue-500/15 px-3 py-1.5 text-xs font-bold text-blue-300 hover:bg-blue-500/25 transition active:scale-95 cursor-pointer"
                >
                  <span>📋</span>
                  <span>Copy</span>
                </button>
              </div>
            </div>

            {/* Filter Bar: Search input & Module dropdown */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 flex-1">
                {/* Search input: Filter permission items by text */}
                <div className="relative flex-1 min-w-[200px]">
                  <input
                    type="text"
                    value={privilegeSearch}
                    onChange={(e) => setPrivilegeSearch(e.target.value)}
                    placeholder="Search permission item by name..."
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs font-semibold text-white placeholder-slate-500 outline-none focus:border-blue-400"
                  />
                  {privilegeSearch && (
                    <button
                      type="button"
                      onClick={() => setPrivilegeSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Module dropdown select: Filter by modules */}
                <select
                  value={selectedModuleFilter}
                  onChange={(e) => setSelectedModuleFilter(e.target.value)}
                  className="rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs font-bold text-blue-300 outline-none focus:border-blue-400 cursor-pointer min-w-[190px]"
                >
                  {MODULE_LIST.map((mod) => (
                    <option key={mod} value={mod}>
                      {mod === 'All Modules' ? '📂 All Modules (12)' : `📁 ${mod}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* PERMISSION TABLE / TREE TABLE */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 overflow-hidden shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  {/* Table Header */}
                  <thead className="sticky top-0 z-10 border-b border-slate-800 bg-slate-900 text-[11px] font-black uppercase tracking-wider text-slate-300 shadow-xs">
                    <tr>
                      <th className="px-5 py-3">Description</th>
                      <th className="px-5 py-3">Second Language</th>
                      <th className="px-5 py-3 text-center w-28 text-rose-400">No Access</th>
                      <th className="px-5 py-3 text-center w-28 text-cyan-400">Read</th>
                      <th className="px-5 py-3 text-center w-28 text-emerald-400">Modify</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-800/40">
                    {filteredTree.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-400">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <span className="text-2xl">🔍</span>
                            <span className="font-bold">No permission items match your search</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredTree.map((mod) => {
                        const isModOpen = expandedModules[mod.module] ?? true

                        // Check if all actions in this entire module have a uniform permission
                        let allModNoAccess = true
                        let allModRead = true
                        let allModModify = true
                        let totalModActions = 0

                        mod.sections.forEach((s) => {
                          s.actions.forEach((a) => {
                            totalModActions++
                            const lvl = formData.privileges[a.id] || 'NO_ACCESS'
                            if (lvl !== 'NO_ACCESS') allModNoAccess = false
                            if (lvl !== 'READ') allModRead = false
                            if (lvl !== 'MODIFY') allModModify = false
                          })
                        })

                        return (
                          <React.Fragment key={mod.module}>
                            {/* ================================================= */}
                            {/* LEVEL 1: MODULE NAME ROW                          */}
                            {/* ================================================= */}
                            <tr className="bg-slate-900/95 border-t border-b border-slate-700/80 select-none">
                              {/* Module title and expand/collapse */}
                              <td
                                colSpan={2}
                                onClick={() => toggleModuleAccordion(mod.module)}
                                className="px-4 py-2.5 cursor-pointer hover:bg-slate-800/60 transition"
                              >
                                <div className="flex items-center gap-2.5">
                                  <span
                                    className={`inline-block text-[11px] font-bold text-blue-400 transition-transform duration-200 ${
                                      isModOpen ? 'rotate-90' : ''
                                    }`}
                                  >
                                    ▶
                                  </span>
                                  <span className="text-sm">{mod.icon}</span>
                                  <span className="font-black text-sm text-white tracking-wide">
                                    {mod.module}
                                  </span>
                                  <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                                    {totalModActions} items
                                  </span>
                                </div>
                              </td>

                              {/* Module Level Cascade Radio: No Access */}
                              <td className="px-5 py-2.5 text-center">
                                <label
                                  className="inline-flex items-center justify-center p-1 cursor-pointer"
                                  title={`Cascade 'No Access' to all ${totalModActions} items in ${mod.module}`}
                                >
                                  <input
                                    type="radio"
                                    name={`module_cascade_${mod.module}`}
                                    checked={allModNoAccess}
                                    onChange={() => handleCascadeModule(mod, 'NO_ACCESS')}
                                    className="h-4 w-4 text-rose-500 bg-slate-900 border-slate-700 focus:ring-rose-400 cursor-pointer"
                                  />
                                </label>
                              </td>

                              {/* Module Level Cascade Radio: Read */}
                              <td className="px-5 py-2.5 text-center">
                                <label
                                  className="inline-flex items-center justify-center p-1 cursor-pointer"
                                  title={`Cascade 'Read' to all ${totalModActions} items in ${mod.module}`}
                                >
                                  <input
                                    type="radio"
                                    name={`module_cascade_${mod.module}`}
                                    checked={allModRead}
                                    onChange={() => handleCascadeModule(mod, 'READ')}
                                    className="h-4 w-4 text-cyan-500 bg-slate-900 border-slate-700 focus:ring-cyan-400 cursor-pointer"
                                  />
                                </label>
                              </td>

                              {/* Module Level Cascade Radio: Modify */}
                              <td className="px-5 py-2.5 text-center">
                                <label
                                  className="inline-flex items-center justify-center p-1 cursor-pointer"
                                  title={`Cascade 'Modify' to all ${totalModActions} items in ${mod.module}`}
                                >
                                  <input
                                    type="radio"
                                    name={`module_cascade_${mod.module}`}
                                    checked={allModModify}
                                    onChange={() => handleCascadeModule(mod, 'MODIFY')}
                                    className="h-4 w-4 text-emerald-500 bg-slate-900 border-slate-700 focus:ring-emerald-400 cursor-pointer"
                                  />
                                </label>
                              </td>
                            </tr>

                            {/* ================================================= */}
                            {/* LEVEL 2: SUB-CATEGORY ROWS & LEVEL 3: ACTIONS     */}
                            {/* ================================================= */}
                            {isModOpen &&
                              mod.sections.map((sec) => {
                                const isSecOpen = expandedSections[sec.sectionKey] ?? true

                                // Check if all items in this category share same level
                                let catAllNoAccess = true
                                let catAllRead = true
                                let catAllModify = true

                                sec.actions.forEach((a) => {
                                  const lvl = formData.privileges[a.id] || 'NO_ACCESS'
                                  if (lvl !== 'NO_ACCESS') catAllNoAccess = false
                                  if (lvl !== 'READ') catAllRead = false
                                  if (lvl !== 'MODIFY') catAllModify = false
                                })

                                return (
                                  <React.Fragment key={sec.sectionKey}>
                                    {/* LEVEL 2 SUB-CATEGORY HEADER ROW */}
                                    <tr className="bg-slate-950/90 border-t border-slate-800/80 hover:bg-slate-900/50 transition select-none">
                                      <td
                                        colSpan={2}
                                        onClick={() => toggleSectionAccordion(sec.sectionKey)}
                                        className="pl-8 pr-4 py-2 cursor-pointer"
                                      >
                                        <div className="flex items-center gap-2">
                                          <span
                                            className={`inline-block text-[9px] font-bold text-slate-400 transition-transform duration-200 ${
                                              isSecOpen ? 'rotate-90' : ''
                                            }`}
                                          >
                                            ▶
                                          </span>
                                          <span className="font-bold text-xs text-blue-300">
                                            {sec.label}
                                          </span>
                                          <span className="text-[10px] text-slate-400 font-medium">
                                            ({sec.secondLanguage})
                                          </span>
                                          <span className="text-[9px] text-slate-400 bg-slate-800/80 px-1.5 py-0.2 rounded font-mono">
                                            {sec.actions.length}
                                          </span>
                                        </div>
                                      </td>

                                      {/* Category Header Radio Button: No Access */}
                                      <td className="px-5 py-2 text-center">
                                        <label
                                          className="inline-flex items-center justify-center p-1 cursor-pointer"
                                          title={`Cascade 'No Access' to all items in ${sec.label}`}
                                        >
                                          <input
                                            type="radio"
                                            name={`cat_cascade_${sec.sectionKey}`}
                                            checked={catAllNoAccess}
                                            onChange={() => handleCascadeCategory(sec.actions, 'NO_ACCESS')}
                                            className="h-3.5 w-3.5 text-rose-500 bg-slate-900 border-slate-700 focus:ring-rose-400 cursor-pointer"
                                          />
                                        </label>
                                      </td>

                                      {/* Category Header Radio Button: Read */}
                                      <td className="px-5 py-2 text-center">
                                        <label
                                          className="inline-flex items-center justify-center p-1 cursor-pointer"
                                          title={`Cascade 'Read' to all items in ${sec.label}`}
                                        >
                                          <input
                                            type="radio"
                                            name={`cat_cascade_${sec.sectionKey}`}
                                            checked={catAllRead}
                                            onChange={() => handleCascadeCategory(sec.actions, 'READ')}
                                            className="h-3.5 w-3.5 text-cyan-500 bg-slate-900 border-slate-700 focus:ring-cyan-400 cursor-pointer"
                                          />
                                        </label>
                                      </td>

                                      {/* Category Header Radio Button: Modify */}
                                      <td className="px-5 py-2 text-center">
                                        <label
                                          className="inline-flex items-center justify-center p-1 cursor-pointer"
                                          title={`Cascade 'Modify' to all items in ${sec.label}`}
                                        >
                                          <input
                                            type="radio"
                                            name={`cat_cascade_${sec.sectionKey}`}
                                            checked={catAllModify}
                                            onChange={() => handleCascadeCategory(sec.actions, 'MODIFY')}
                                            className="h-3.5 w-3.5 text-emerald-500 bg-slate-900 border-slate-700 focus:ring-emerald-400 cursor-pointer"
                                          />
                                        </label>
                                      </td>
                                    </tr>

                                    {/* LEVEL 3 INDIVIDUAL ACTION ITEMS */}
                                    {isSecOpen &&
                                      sec.actions.map((act) => {
                                        const currentLevel = formData.privileges[act.id] || 'NO_ACCESS'

                                        return (
                                          <tr
                                            key={act.id}
                                            className={`transition-colors ${
                                              currentLevel === 'MODIFY'
                                                ? 'bg-emerald-500/5 hover:bg-emerald-500/10'
                                                : currentLevel === 'READ'
                                                ? 'bg-cyan-500/5 hover:bg-cyan-500/10'
                                                : 'hover:bg-slate-900/30'
                                            }`}
                                          >
                                            {/* Description (indented) */}
                                            <td className="pl-14 pr-4 py-2 font-semibold text-slate-100 whitespace-nowrap">
                                              <span>{act.name}</span>
                                            </td>

                                            {/* Second Language */}
                                            <td className="px-5 py-2 text-slate-300 font-medium whitespace-nowrap">
                                              <span>{act.secondLanguage || '—'}</span>
                                            </td>

                                            {/* Radio Button: No Access */}
                                            <td className="px-5 py-2 text-center">
                                              <label className="inline-flex items-center justify-center p-1 cursor-pointer">
                                                <input
                                                  type="radio"
                                                  name={`perm_action_${act.id}`}
                                                  checked={currentLevel === 'NO_ACCESS'}
                                                  onChange={() => handlePrivilegeChange(act.id, 'NO_ACCESS')}
                                                  className="h-4 w-4 text-rose-500 bg-slate-900 border-slate-700 focus:ring-rose-400 cursor-pointer"
                                                />
                                              </label>
                                            </td>

                                            {/* Radio Button: Read */}
                                            <td className="px-5 py-2 text-center">
                                              <label className="inline-flex items-center justify-center p-1 cursor-pointer">
                                                <input
                                                  type="radio"
                                                  name={`perm_action_${act.id}`}
                                                  checked={currentLevel === 'READ'}
                                                  onChange={() => handlePrivilegeChange(act.id, 'READ')}
                                                  className="h-4 w-4 text-cyan-500 bg-slate-900 border-slate-700 focus:ring-cyan-400 cursor-pointer"
                                                />
                                              </label>
                                            </td>

                                            {/* Radio Button: Modify */}
                                            <td className="px-5 py-2 text-center">
                                              <label className="inline-flex items-center justify-center p-1 cursor-pointer">
                                                <input
                                                  type="radio"
                                                  name={`perm_action_${act.id}`}
                                                  checked={currentLevel === 'MODIFY'}
                                                  onChange={() => handlePrivilegeChange(act.id, 'MODIFY')}
                                                  className="h-4 w-4 text-emerald-500 bg-slate-900 border-slate-700 focus:ring-emerald-400 cursor-pointer"
                                                />
                                              </label>
                                            </td>
                                          </tr>
                                        )
                                      })}
                                  </React.Fragment>
                                )
                              })}
                          </React.Fragment>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* ===================================================================== */}
      {/* COPY PRIVILEGES SUB-MODAL                                             */}
      {/* ===================================================================== */}
      {copyModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-5 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <span>📋</span>
                <span>Copy Privileges from Existing Role</span>
              </h3>
              <button
                type="button"
                onClick={() => setCopyModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Select an existing role to copy all hierarchical privilege assignments into this form:
            </p>

            <select
              value={copySourceRoleId}
              onChange={(e) => setCopySourceRoleId(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs font-semibold text-white outline-none focus:border-blue-400 cursor-pointer"
            >
              <option value="">-- Select Role to Copy --</option>
              {roles
                .filter((r) => !formData.id || r.id !== formData.id)
                .map((r) => (
                  <option key={r.id} value={r.id}>
                    [{r.code}] {r.description} ({r.secondLanguage || ''})
                  </option>
                ))}
            </select>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setCopyModalOpen(false)}
                className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!copySourceRoleId}
                onClick={handleCopyPrivileges}
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 disabled:opacity-40 cursor-pointer"
              >
                Apply Privileges
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* DELETE CONFIRMATION MODAL                                             */}
      {/* ===================================================================== */}
      {deleteConfirmOpen && roleToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-rose-500/30 bg-slate-950 p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 text-xl border border-rose-500/20">
                ⚠️
              </span>
              <div>
                <h3 className="text-base font-black text-white">
                  Confirm Role Deletion
                </h3>
                <p className="text-xs text-rose-400 font-mono font-bold">
                  {roleToDelete.code} — {roleToDelete.description}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to delete role &quot;{roleToDelete.description}&quot;? This action cannot be undone.
            </p>

            {roleToDelete.numberOfUsers > 0 && (
              <div className="rounded-xl border border-rose-500/40 bg-rose-950/40 p-3 text-xs text-rose-200 font-semibold">
                ⚠️ Notice: {roleToDelete.numberOfUsers} user(s) currently belong to this role. You must reassign those users to another role before this role can be removed.
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setDeleteConfirmOpen(false)
                  setRoleToDelete(null)
                }}
                className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="rounded-xl bg-rose-600 px-5 py-2 text-xs font-bold text-white hover:bg-rose-500 shadow-md shadow-rose-600/30 cursor-pointer"
              >
                Delete Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
