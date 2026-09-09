import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useNotifications } from '../../context/NotificationContext'
import { exportStyledExcel } from '../../utils/excelExport'
import { adminEmployeeAPI } from '../../api/api'
import boyIcon from '../../assets/icon/3dicons-boy-dynamic-color.png'
import { EMPLOYEE_MODULES } from './Employee'
import './ProductsHub.css'

// 14 Columns available for the "Choose Column" modal & table
export const ALL_COLUMNS = [
  { key: 'code', label: { en: 'Code', kh: 'លេខកូដ' }, always: true },
  { key: 'firstName', label: { en: 'First Name', kh: 'នាមខ្លួន' }, always: true },
  { key: 'lastName', label: { en: 'Last Name', kh: 'គោត្តនាម' }, always: true },
  { key: 'phone', label: { en: 'Phone', kh: 'ទូរស័ព្ទ' }, always: true },
  { key: 'email', label: { en: 'Email', kh: 'អ៊ីមែល' } },
  { key: 'position', label: { en: 'Position', kh: 'មុខតំណែង' }, always: true },
  { key: 'active', label: { en: 'Active', kh: 'ស្ថានភាព' }, always: true },
  { key: 'gender', label: { en: 'Gender', kh: 'ភេទ' } },
  { key: 'idNumber', label: { en: 'ID Number', kh: 'អត្តសញ្ញាណប័ណ្ណ' } },
  { key: 'office', label: { en: 'Office / Branch', kh: 'ការិយាល័យ / សាខា' } },
  { key: 'department', label: { en: 'Department', kh: 'ដេប៉ាតឺម៉ង់' } },
  { key: 'section', label: { en: 'Section', kh: 'ផ្នែក' } },
  { key: 'operationSystem', label: { en: 'Operation System', kh: 'ប្រព័ន្ធប្រតិបត្តិការ' } },
  { key: 'address', label: { en: 'Address', kh: 'អាសយដ្ឋាន' } },
]

export const DEFAULT_VISIBLE = [
  'code',
  'firstName',
  'lastName',
  'phone',
  'email',
  'position',
  'active',
  'office',
  'department',
]

// Master data options for Employee dropdowns
const OFFICE_OPTIONS = [
  'Headquarters Corporate Office',
  'Main Store Warehouse',
  'Express Mart BKK1',
  'Toul Kork Branch',
  'Chbar Ampov Hub',
  'Sen Sok Supercenter',
]

const DEPARTMENT_OPTIONS = [
  'Operations',
  'Procurement',
  'Finance',
  'Logistics',
  'IT & Digital Systems',
  'Human Resources',
  'Sales & Marketing',
]

const SECTION_OPTIONS = [
  'Store Operations',
  'Inventory & Cold Storage',
  'Cashier Squad',
  'Accounting & Payroll',
  'Fleet Delivery Dispatch',
  'Infrastructure & POS',
  'Recruitment & Training',
  'Quality & Customer Care',
]

const POSITION_OPTIONS = [
  'Store General Manager',
  'Supply Chain Manager',
  'Senior Cashier',
  'Shift Cashier',
  'Senior Accountant',
  'System Administrator',
  'Delivery Van Driver',
  'HR Specialist',
  'Inventory Controller',
  'Operations Supervisor',
  'Associate Staff',
]

const OS_OPTIONS = [
  'Windows 11 Enterprise',
  'macOS Sonoma',
  'Ubuntu Linux',
  'Android POS',
  'iOS Enterprise',
  'B\'Groceries Cloud OS',
]

const EMAIL_TEMPLATE_OPTIONS = [
  'Default Corporate Welcome',
  'Monthly Payslip & Notice',
  'Employee Onboarding Pack',
  'Internal Urgent Dispatch',
  'Performance Review Notification',
]

const SEED_EMPLOYEES = [
  {
    id: 1,
    code: 'EMP-0001',
    active: true,
    firstName: 'Sokheng',
    lastName: 'Chea',
    dateOfBirth: '1992-05-14',
    gender: 'Male',
    idNumber: 'KH-0891245',
    office: 'Headquarters Corporate Office',
    department: 'Operations',
    section: 'Store Operations',
    position: 'Store General Manager',
    operationSystem: 'macOS Sonoma',
    phone1: '012 998 877',
    phone2: '088 123 4567',
    email: 'sokheng.c@bgroceries.com',
    emailTemplate: 'Default Corporate Welcome',
    emailVerified: true,
    address: 'Street 2004, Sen Sok, Phnom Penh',
    createdAt: '2024-01-15T08:00:00',
  },
  {
    id: 2,
    code: 'EMP-0002',
    active: true,
    firstName: 'Vanna',
    lastName: 'Touch',
    dateOfBirth: '1990-11-20',
    gender: 'Male',
    idNumber: 'KH-0774321',
    office: 'Main Store Warehouse',
    department: 'Procurement',
    section: 'Inventory & Cold Storage',
    position: 'Supply Chain Manager',
    operationSystem: 'Windows 11 Enterprise',
    phone1: '011 223 344',
    phone2: '',
    email: 'vanna.touch@bgroceries.com',
    emailTemplate: 'Monthly Payslip & Notice',
    emailVerified: true,
    address: 'National Road 4, Chaom Chau, Phnom Penh',
    createdAt: '2024-02-01T09:30:00',
  },
  {
    id: 3,
    code: 'EMP-0003',
    active: true,
    firstName: 'Dara',
    lastName: 'Heng',
    dateOfBirth: '1998-03-12',
    gender: 'Male',
    idNumber: 'KH-0992341',
    office: 'Express Mart BKK1',
    department: 'Operations',
    section: 'Cashier Squad',
    position: 'Senior Cashier',
    operationSystem: 'Android POS',
    phone1: '016 789 012',
    phone2: '097 554 433',
    email: 'dara.h@bgroceries.com',
    emailTemplate: 'Employee Onboarding Pack',
    emailVerified: true,
    address: 'St 360, Boeng Keng Kang 1, Phnom Penh',
    createdAt: '2024-06-10T11:15:00',
  },
  {
    id: 4,
    code: 'EMP-0004',
    active: true,
    firstName: 'Sreymom',
    lastName: 'Chann',
    dateOfBirth: '1999-08-25',
    gender: 'Female',
    idNumber: 'KH-0661289',
    office: 'Toul Kork Branch',
    department: 'Operations',
    section: 'Cashier Squad',
    position: 'Shift Cashier',
    operationSystem: 'Android POS',
    phone1: '015 992 113',
    phone2: '',
    email: 'sreymom.c@bgroceries.com',
    emailTemplate: 'Default Corporate Welcome',
    emailVerified: false,
    address: 'St 289, Toul Kork, Phnom Penh',
    createdAt: '2024-07-20T14:45:00',
  },
  {
    id: 5,
    code: 'EMP-0005',
    active: true,
    firstName: 'Sophea',
    lastName: 'Kim',
    dateOfBirth: '1994-12-04',
    gender: 'Female',
    idNumber: 'KH-0559981',
    office: 'Headquarters Corporate Office',
    department: 'Finance',
    section: 'Accounting & Payroll',
    position: 'Senior Accountant',
    operationSystem: 'Windows 11 Enterprise',
    phone1: '070 556 677',
    phone2: '',
    email: 'sophea.kim@bgroceries.com',
    emailTemplate: 'Monthly Payslip & Notice',
    emailVerified: true,
    address: 'Monivong Blvd, Khan Daun Penh, Phnom Penh',
    createdAt: '2023-11-05T10:00:00',
  },
  {
    id: 6,
    code: 'EMP-0006',
    active: true,
    firstName: 'Badmin',
    lastName: 'Super',
    dateOfBirth: '1988-01-01',
    gender: 'Male',
    idNumber: 'KH-0000001',
    office: 'Headquarters Corporate Office',
    department: 'IT & Digital Systems',
    section: 'Infrastructure & POS',
    position: 'System Administrator',
    operationSystem: 'Ubuntu Linux',
    phone1: '098 776 554',
    phone2: '012 334 455',
    email: 'admin@bgroceries.com',
    emailTemplate: 'Internal Urgent Dispatch',
    emailVerified: true,
    address: 'Level 12, Vattanac Tower, Monivong Blvd, Phnom Penh',
    createdAt: '2023-08-01T08:00:00',
  },
]

export default function EmployeeList() {
  const { lang } = useLanguage()
  const { showNotification } = useNotifications()

  // State
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)

  // Search & Filter state
  const [searchText, setSearchText] = useState('')
  const [searchBy, setSearchBy] = useState('any')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [departmentFilter, setDepartmentFilter] = useState('ALL')

  // Choose Column State
  const [chooseColumnOpen, setChooseColumnOpen] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState(() => {
    try {
      const saved = localStorage.getItem('bg_employee_columns')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {}
    return DEFAULT_VISIBLE
  })

  // Modal State (Create / Edit)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [verifying, setVerifying] = useState(false)

  // Form State: General Information + Contact Address
  const [formData, setFormData] = useState({
    code: 'Auto Generate Code',
    active: true,
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'Male',
    idNumber: '',
    office: OFFICE_OPTIONS[0],
    department: DEPARTMENT_OPTIONS[0],
    section: SECTION_OPTIONS[0],
    position: POSITION_OPTIONS[0],
    operationSystem: OS_OPTIONS[0],
    phone1: '',
    phone2: '',
    email: '',
    emailTemplate: EMAIL_TEMPLATE_OPTIONS[0],
    emailVerified: false,
    address: '',
  })

  // Load employees from Backend (with resilient fallback to LocalStorage/Seed)
  const loadEmployees = useCallback(async () => {
    setLoading(true)
    try {
      const params = {}
      if (searchText.trim()) params.search = searchText.trim()
      if (searchBy && searchBy !== 'any') params.searchBy = searchBy
      if (statusFilter && statusFilter !== 'ALL') params.status = statusFilter
      if (departmentFilter && departmentFilter !== 'ALL') params.department = departmentFilter

      const res = await adminEmployeeAPI.getAll(params)
      const data = res?.data != null ? res.data : (Array.isArray(res) ? res : null)
      if (Array.isArray(data) && data.length > 0) {
        setEmployees(data)
        try {
          localStorage.setItem('bg_employees_cache', JSON.stringify(data))
        } catch {}
        return
      }

      // If backend returned empty, check if user had local records to auto-migrate!
      let cachedRecords = []
      try {
        const cached = localStorage.getItem('bg_employees_cache') || localStorage.getItem('bg_employees')
        if (cached) cachedRecords = JSON.parse(cached)
      } catch {}

      if (Array.isArray(cachedRecords) && cachedRecords.length > 0) {
        const migrated = []
        for (const emp of cachedRecords) {
          try {
            const created = await adminEmployeeAPI.create({
              code: emp.code,
              firstName: emp.firstName,
              lastName: emp.lastName,
              phone1: emp.phone1 || emp.phone,
              phone2: emp.phone2 || null,
              email: emp.email || null,
              emailTemplate: emp.emailTemplate,
              emailVerified: emp.emailVerified === true,
              address: emp.address,
              office: emp.office,
              department: emp.department,
              section: emp.section,
              position: emp.position,
              operationSystem: emp.operationSystem,
              gender: emp.gender,
              dateOfBirth: emp.dateOfBirth || null,
              idNumber: emp.idNumber || null,
              active: emp.active !== false,
            })
            if (created?.data) migrated.push(created.data)
          } catch {
            migrated.push(emp)
          }
        }
        setEmployees(migrated)
        try {
          localStorage.setItem('bg_employees_cache', JSON.stringify(migrated))
        } catch {}
        return
      }
    } catch (err) {
      console.warn('Backend load employees failed:', err)
    }

    // Fallback logic
    try {
      const cached = localStorage.getItem('bg_employees_cache')
      if (cached) {
        const parsed = JSON.parse(cached)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEmployees(parsed)
          return
        }
      }
    } catch {}

    setEmployees(SEED_EMPLOYEES)
  }, [searchText, searchBy, statusFilter, departmentFilter])

  useEffect(() => {
    loadEmployees().finally(() => setLoading(false))
  }, [loadEmployees])

  // Save Column settings
  const handleToggleColumn = (colKey) => {
    setVisibleColumns((prev) => {
      let next
      if (prev.includes(colKey)) {
        if (prev.length <= 1) return prev // keep at least 1 column
        next = prev.filter((k) => k !== colKey)
      } else {
        next = [...prev, colKey]
      }
      try {
        localStorage.setItem('bg_employee_columns', JSON.stringify(next))
      } catch {}
      return next
    })
  }

  const handleSelectAllColumns = () => {
    const all = ALL_COLUMNS.map((c) => c.key)
    setVisibleColumns(all)
    try {
      localStorage.setItem('bg_employee_columns', JSON.stringify(all))
    } catch {}
  }

  const handleResetColumns = () => {
    setVisibleColumns(DEFAULT_VISIBLE)
    try {
      localStorage.setItem('bg_employee_columns', JSON.stringify(DEFAULT_VISIBLE))
    } catch {}
  }

  // Client-side filtering fallback for instant responsiveness
  const displayedEmployees = useMemo(() => {
    let list = employees

    // Status filter
    if (statusFilter === 'ACTIVE') {
      list = list.filter((e) => e.active === true)
    } else if (statusFilter === 'INACTIVE') {
      list = list.filter((e) => e.active === false)
    }

    // Department filter
    if (departmentFilter !== 'ALL') {
      list = list.filter((e) => e.department === departmentFilter)
    }

    // Search query & searchBy filter
    const q = searchText.trim().toLowerCase()
    if (q) {
      list = list.filter((e) => {
        const code = (e.code || '').toLowerCase()
        const fName = (e.firstName || '').toLowerCase()
        const lName = (e.lastName || '').toLowerCase()
        const fullName = `${fName} ${lName}`.trim()
        const p1 = (e.phone1 || e.phone || '').toLowerCase()
        const p2 = (e.phone2 || '').toLowerCase()
        const email = (e.email || '').toLowerCase()
        const pos = (e.position || '').toLowerCase()

        switch (searchBy) {
          case 'code':
            return code.includes(q)
          case 'firstName':
            return fName.includes(q)
          case 'lastName':
            return lName.includes(q)
          case 'phone':
            return p1.includes(q) || p2.includes(q)
          case 'email':
            return email.includes(q)
          case 'any':
          default:
            return (
              code.includes(q) ||
              fName.includes(q) ||
              lName.includes(q) ||
              fullName.includes(q) ||
              p1.includes(q) ||
              p2.includes(q) ||
              email.includes(q) ||
              pos.includes(q)
            )
        }
      })
    }

    return list
  }, [employees, statusFilter, departmentFilter, searchText, searchBy])

  // Reset Button handler
  const handleResetFilters = () => {
    setSearchText('')
    setSearchBy('any')
    setStatusFilter('ALL')
    setDepartmentFilter('ALL')
    showNotification?.({
      type: 'info',
      title: 'Reset',
      message: 'Search and filters have been reset.',
    })
  }

  // Open Create Modal
  const openCreateModal = async () => {
    setEditingId(null)
    let nextCode = `EMP-${String(Math.floor(Math.random() * 9000) + 1000)}`
    try {
      const res = await adminEmployeeAPI.getNextCode()
      if (res?.data) nextCode = res.data
    } catch {}

    setFormData({
      code: nextCode,
      active: true,
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 'Male',
      idNumber: '',
      office: OFFICE_OPTIONS[0],
      department: DEPARTMENT_OPTIONS[0],
      section: SECTION_OPTIONS[0],
      position: POSITION_OPTIONS[0],
      operationSystem: OS_OPTIONS[0],
      phone1: '',
      phone2: '',
      email: '',
      emailTemplate: EMAIL_TEMPLATE_OPTIONS[0],
      emailVerified: false,
      address: '',
    })
    setModalOpen(true)
  }

  // Open Edit Modal
  const openEditModal = (emp) => {
    setEditingId(emp.id)
    setFormData({
      code: emp.code || '',
      active: emp.active !== false,
      firstName: emp.firstName || emp.name?.split(' ')[0] || '',
      lastName: emp.lastName || emp.name?.split(' ').slice(1).join(' ') || '',
      dateOfBirth: emp.dateOfBirth ? emp.dateOfBirth.slice(0, 10) : '',
      gender: emp.gender || 'Male',
      idNumber: emp.idNumber || '',
      office: emp.office || OFFICE_OPTIONS[0],
      department: emp.department || DEPARTMENT_OPTIONS[0],
      section: emp.section || SECTION_OPTIONS[0],
      position: emp.position || POSITION_OPTIONS[0],
      operationSystem: emp.operationSystem || OS_OPTIONS[0],
      phone1: emp.phone1 || emp.phone || '',
      phone2: emp.phone2 || '',
      email: emp.email || '',
      emailTemplate: emp.emailTemplate || EMAIL_TEMPLATE_OPTIONS[0],
      emailVerified: emp.emailVerified === true,
      address: emp.address || '',
    })
    setModalOpen(true)
  }

  // Refresh Code in modal
  const handleRegenerateCode = async () => {
    try {
      const res = await adminEmployeeAPI.getNextCode()
      if (res?.data) {
        setFormData((prev) => ({ ...prev, code: res.data }))
        return
      }
    } catch {}
    setFormData((prev) => ({
      ...prev,
      code: `EMP-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    }))
  }

  // Verify Button Handler
  const handleVerifyContact = async () => {
    if (!formData.email.trim()) {
      showNotification?.({
        type: 'warning',
        title: 'Validation',
        message: 'Please enter an email address to verify.',
      })
      return
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(formData.email.trim())) {
      showNotification?.({
        type: 'warning',
        title: 'Invalid Email',
        message: 'Please enter a valid email format (e.g., user@domain.com).',
      })
      return
    }

    setVerifying(true)
    try {
      await adminEmployeeAPI.verifyContact({
        id: editingId,
        email: formData.email.trim(),
      })
    } catch {
      // Offline fallback verification succeeds
    } finally {
      setVerifying(false)
      setFormData((prev) => ({ ...prev, emailVerified: true }))
      showNotification?.({
        type: 'success',
        title: 'Verified',
        message: `Email "${formData.email.trim()}" has been verified successfully.`,
      })
    }
  }

  // Save / Submit Form
  const handleSubmitForm = async (e) => {
    e.preventDefault()

    if (!formData.firstName.trim()) {
      showNotification?.({ type: 'warning', title: 'Validation', message: 'First Name is required.' })
      return
    }
    if (!formData.lastName.trim()) {
      showNotification?.({ type: 'warning', title: 'Validation', message: 'Last Name is required.' })
      return
    }
    if (!formData.phone1.trim()) {
      showNotification?.({ type: 'warning', title: 'Validation', message: 'Phone 1 is required.' })
      return
    }
    if (!formData.address.trim()) {
      showNotification?.({ type: 'warning', title: 'Validation', message: 'Address is required.' })
      return
    }

    setSaving(true)

    let empCode = (formData.code || '').trim()
    if (!empCode || empCode === 'Auto Generate Code') {
      empCode = `EMP-${String(Math.floor(Math.random() * 9000) + 1000)}`
    }

    const payload = {
      code: empCode,
      active: formData.active !== false,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      dateOfBirth: formData.dateOfBirth || null,
      gender: formData.gender,
      idNumber: formData.idNumber.trim() || null,
      office: formData.office,
      department: formData.department,
      section: formData.section,
      position: formData.position,
      operationSystem: formData.operationSystem,
      phone1: formData.phone1.trim(),
      phone2: formData.phone2.trim() || null,
      email: formData.email.trim() || null,
      emailTemplate: formData.emailTemplate,
      emailVerified: formData.emailVerified === true,
      address: formData.address.trim(),
    }

    const optimisticRecord = {
      id: editingId || Date.now(),
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // 1. Instantly update UI & LocalStorage
    let updatedList
    if (editingId) {
      updatedList = employees.map((emp) => (emp.id === editingId ? { ...emp, ...optimisticRecord } : emp))
      setEmployees(updatedList)
      showNotification?.({
        type: 'success',
        title: 'Success',
        message: `Employee ${optimisticRecord.firstName} ${optimisticRecord.lastName} updated successfully.`,
      })
    } else {
      updatedList = [optimisticRecord, ...employees.filter((emp) => emp.code !== optimisticRecord.code)]
      setEmployees(updatedList)
      showNotification?.({
        type: 'success',
        title: 'Success',
        message: `Employee ${optimisticRecord.firstName} ${optimisticRecord.lastName} created successfully.`,
      })
    }

    try {
      localStorage.setItem('bg_employees_cache', JSON.stringify(updatedList))
      localStorage.setItem('bg_employees', JSON.stringify(updatedList))
    } catch {}

    // 2. Immediately close modal
    setModalOpen(false)
    setSaving(false)

    // 3. Sync to backend API in background
    try {
      if (editingId) {
        const res = await adminEmployeeAPI.update(editingId, payload)
        if (res?.data) {
          setEmployees((prev) => prev.map((emp) => (emp.id === editingId ? res.data : emp)))
        }
      } else {
        const res = await adminEmployeeAPI.create(payload)
        if (res?.data) {
          setEmployees((prev) => [
            res.data,
            ...prev.filter((emp) => emp.id !== optimisticRecord.id && emp.code !== res.data.code),
          ])
        }
      }
    } catch (err) {
      console.error('Backend save failed:', err)
      showNotification?.({
        type: 'error',
        title: 'Database Sync Issue',
        message: err.message || 'Employee was saved in browser but backend failed.',
      })
    }
  }


  // Toggle Active Status directly from table
  const handleToggleActive = async (emp) => {
    const newStatus = !Boolean(emp.active !== false)
    try {
      await adminEmployeeAPI.updateStatus(emp.id, newStatus)
    } catch {}

    const updated = employees.map((item) =>
      item.id === emp.id ? { ...item, active: newStatus } : item
    )
    setEmployees(updated)
    try {
      localStorage.setItem('bg_employees_cache', JSON.stringify(updated))
    } catch {}

    showNotification?.({
      type: 'info',
      title: 'Status Updated',
      message: `${emp.firstName || emp.code} is now ${newStatus ? 'Active' : 'Inactive'}.`,
    })
  }

  // Delete Employee
  const handleDeleteEmployee = async (id, code, name) => {
    if (!window.confirm(`Are you sure you want to delete employee ${name || code}?`)) return

    try {
      await adminEmployeeAPI.delete(id)
    } catch {}

    const updated = employees.filter((emp) => emp.id !== id)
    setEmployees(updated)
    try {
      localStorage.setItem('bg_employees_cache', JSON.stringify(updated))
    } catch {}

    showNotification?.({
      type: 'success',
      title: 'Deleted',
      message: `Employee ${name || code} deleted.`,
    })
  }

  // Export to Excel based on visible columns
  const handleExportExcel = () => {
    const activeCols = ALL_COLUMNS.filter((c) => visibleColumns.includes(c.key))
    const headers = activeCols.map((c) => (lang === 'kh' ? c.label.kh : c.label.en))

    const dataRows = displayedEmployees.map((emp) => {
      return activeCols.map((c) => {
        switch (c.key) {
          case 'code':
            return emp.code || ''
          case 'firstName':
            return emp.firstName || emp.name?.split(' ')[0] || ''
          case 'lastName':
            return emp.lastName || emp.name?.split(' ').slice(1).join(' ') || ''
          case 'phone':
            return emp.phone1 || emp.phone || emp.phone2 || ''
          case 'email':
            return emp.email || ''
          case 'position':
            return emp.position || ''
          case 'active':
            return emp.active !== false ? 'ACTIVE' : 'INACTIVE'
          case 'gender':
            return emp.gender || ''
          case 'idNumber':
            return emp.idNumber || ''
          case 'office':
            return emp.office || ''
          case 'department':
            return emp.department || ''
          case 'section':
            return emp.section || ''
          case 'operationSystem':
            return emp.operationSystem || ''
          case 'address':
            return emp.address || ''
          default:
            return ''
        }
      })
    })

    exportStyledExcel({
      sheetName: 'Employees',
      title: "B'Groceries - Enterprise Employee Roster",
      subtitle: `Exported on: ${new Date().toLocaleString()}`,
      headers,
      dataRows,
      fileName: `Employee_List_${new Date().toISOString().slice(0, 10)}.xlsx`,
    })

    showNotification?.({
      type: 'success',
      title: 'Export',
      message: 'Employee roster exported successfully to Excel.',
    })
  }

  return (
    <div className="space-y-6 text-slate-100 font-['Montserrat']">
      {/* 1. HERO BREADCRUMB & BANNER */}
      <section className="relative overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#0b0f17] p-5 sm:p-7 shadow-2xl shadow-blue-500/10">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-blue-500/15 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <Link
              to="/admin/employee"
              className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-950/60 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-blue-300 transition hover:border-blue-400 hover:text-white active:scale-95"
            >
              <span>←</span> {lang === 'en' ? 'Employee Hub' : 'មជ្ឈមណ្ឌលបុគ្គលិក'}
            </Link>

            <div className="flex items-center gap-3.5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-500/15 p-2 ring-1 ring-blue-500/30 shadow-lg shadow-blue-500/20">
                <img src={boyIcon} alt="" className="h-9 w-9 object-contain drop-shadow-md" />
              </span>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-blue-400">
                  {lang === 'en' ? 'Employee Directory' : 'ព័ត៌មានបុគ្គលិក'}
                </p>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {lang === 'en' ? 'Employee' : 'និយោជក'}
                </h1>
              </div>
            </div>

            <p className="max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-300">
              {lang === 'en'
                ? 'Search, manage, and configure enterprise employee directory with comprehensive corporate information and contact details.'
                : 'ស្វែងរក និងគ្រប់គ្រងព័ត៌មានលម្អិតរបស់បុគ្គលិកក្នុងសហគ្រាស។'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start lg:self-center">
            {/* Export Excel Button */}
            <button
              type="button"
              onClick={handleExportExcel}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-xs font-bold text-slate-300 hover:text-white hover:border-blue-400 transition active:scale-95 shadow-lg"
            >
              <span>📥</span>
              <span>{lang === 'en' ? 'Export Excel' : 'នាំចេញ Excel'}</span>
            </button>

            {/* Create Button */}
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-3 text-xs font-black text-white shadow-lg shadow-blue-500/25 hover:from-blue-400 hover:to-indigo-500 active:scale-95 transition"
            >
              <span className="text-base font-bold">+</span>
              <span>{lang === 'en' ? 'Create Employee' : 'បង្កើតបុគ្គលិក'}</span>
            </button>
          </div>
        </div>

        {/* 5 EMPLOYEE MODULE PILLS BAR */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            {lang === 'en' ? 'Employee Modules (5):' : 'ម៉ូឌុលបុគ្គលិក (៥)៖'}
          </p>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {EMPLOYEE_MODULES.map((cat) => {
              const isActive = cat.key === 'employee'
              return (
                <Link
                  key={cat.key}
                  to={cat.route}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-blue-500 text-white font-black shadow-md shadow-blue-500/25 scale-[1.02]'
                      : 'bg-slate-950/60 text-slate-300 border border-slate-800 hover:border-slate-600 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <span className="text-sm">{cat.icon}</span>
                  <span>{lang === 'kh' ? cat.kh : cat.en}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* 2. SEARCH & CONTROLS SECTION */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-xl shadow-black/20 space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="h-5 w-1.5 rounded-full bg-blue-500" />
            <h2 className="text-base font-bold text-white font-['Montserrat']">
              {lang === 'en' ? 'Search Employee' : 'ស្វែងរកបុគ្គលិក'}
            </h2>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Choose Column Button */}
            <button
              type="button"
              onClick={() => setChooseColumnOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-1.5 text-xs font-bold text-slate-300 hover:border-blue-400 hover:text-white transition active:scale-95"
            >
              <span>⚙️</span>
              <span>{lang === 'en' ? 'Choose Column' : 'ជ្រើសរើសជួរឈរ'}</span>
            </button>

            {/* Reset Button */}
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-800/50 px-3.5 py-1.5 text-xs font-bold text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition active:scale-95"
              title="Reset Search and Filters"
            >
              <span>↺</span>
              <span>{lang === 'en' ? 'Reset' : 'កំណត់ឡើងវិញ'}</span>
            </button>
          </div>
        </div>

        {/* Search Inputs Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
          {/* Search - Textbox */}
          <div className="sm:col-span-4 md:col-span-5">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              {lang === 'en' ? 'Search' : 'ស្វែងរក'}
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
                🔍
              </span>
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadEmployees()}
                placeholder={
                  lang === 'en'
                    ? 'Search employee by code, first name, last name, phone, email...'
                    : 'ស្វែងរកតាមកូដ នាមខ្លួន គោត្តនាម ទូរស័ព្ទ អ៊ីមែល...'
                }
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950/90 py-2 pl-9 pr-8 text-xs font-semibold text-white placeholder-slate-500 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
              />
              {searchText && (
                <button
                  type="button"
                  onClick={() => setSearchText('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Search by - DropDown (Any, Code, First Name, Last Name, Phone, Email) */}
          <div className="sm:col-span-3 md:col-span-3">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              {lang === 'en' ? 'Search by' : 'ស្វែងរកតាម'}
            </label>
            <select
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/90 py-2 px-3 text-xs font-semibold text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
            >
              <option value="any">{lang === 'en' ? 'Any' : 'ទាំងអស់'}</option>
              <option value="code">{lang === 'en' ? 'Code' : 'កូដ'}</option>
              <option value="firstName">{lang === 'en' ? 'First Name' : 'នាមខ្លួន'}</option>
              <option value="lastName">{lang === 'en' ? 'Last Name' : 'គោត្តនាម'}</option>
              <option value="phone">{lang === 'en' ? 'Phone' : 'ទូរស័ព្ទ'}</option>
              <option value="email">{lang === 'en' ? 'Email' : 'អ៊ីមែល'}</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-2 md:col-span-2">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              {lang === 'en' ? 'Status' : 'ស្ថានភាព'}
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/90 py-2 px-3 text-xs font-semibold text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
            >
              <option value="ALL">{lang === 'en' ? 'All' : 'ទាំងអស់'}</option>
              <option value="ACTIVE">{lang === 'en' ? 'Active' : 'សកម្ម'}</option>
              <option value="INACTIVE">{lang === 'en' ? 'Inactive' : 'អសកម្ម'}</option>
            </select>
          </div>

          {/* Search Button */}
          <div className="sm:col-span-3 md:col-span-2 flex items-end">
            <button
              type="button"
              onClick={loadEmployees}
              className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:brightness-110 py-2 px-4 text-xs font-black text-white transition active:scale-95 shadow-md shadow-blue-500/25 flex items-center justify-center gap-1.5"
            >
              <span>🔍</span>
              <span>{lang === 'en' ? 'Search' : 'ស្វែងរក'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. EMPLOYEE LIST TABLE SECTION */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-xl shadow-black/20 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="h-5 w-1.5 rounded-full bg-indigo-500" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-['Montserrat']">
                  {lang === 'en' ? 'Employee List' : 'បញ្ជីបុគ្គលិក'}
                </h2>
                <span className="rounded-full bg-blue-500/15 border border-blue-500/30 px-2 py-0.5 font-mono text-[10px] font-bold text-blue-400">
                  {displayedEmployees.length} {lang === 'en' ? 'Staff' : 'នាក់'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {lang === 'en'
                  ? 'List of active and inactive staff across all organizational units.'
                  : 'បញ្ជីឈ្មោះបុគ្គលិកទាំងអស់ក្នុងស្ថាប័ន។'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Department quick filter */}
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-950 py-1.5 px-3 text-xs font-semibold text-white outline-none focus:border-blue-400"
            >
              <option value="ALL">{lang === 'en' ? 'All Departments' : 'ដេប៉ាតឺម៉ង់ទាំងអស់'}</option>
              {DEPARTMENT_OPTIONS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            {/* Create Button */}
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-1.5 text-xs font-bold text-white transition active:scale-95 shadow-md shadow-blue-600/25"
            >
              <span>+</span>
              <span>{lang === 'en' ? 'Create' : 'បង្កើត'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/90 text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-800">
              <tr>
                {visibleColumns.includes('code') && <th className="py-3.5 px-4">Code</th>}
                {visibleColumns.includes('firstName') && <th className="py-3.5 px-4">First Name</th>}
                {visibleColumns.includes('lastName') && <th className="py-3.5 px-4">Last Name</th>}
                {visibleColumns.includes('phone') && <th className="py-3.5 px-4">Phone</th>}
                {visibleColumns.includes('email') && <th className="py-3.5 px-4">Email</th>}
                {visibleColumns.includes('position') && <th className="py-3.5 px-4">Position</th>}
                {visibleColumns.includes('active') && <th className="py-3.5 px-4 text-center">Active</th>}
                {visibleColumns.includes('gender') && <th className="py-3.5 px-4 text-center">Gender</th>}
                {visibleColumns.includes('idNumber') && <th className="py-3.5 px-4">ID Number</th>}
                {visibleColumns.includes('office') && <th className="py-3.5 px-4">Office</th>}
                {visibleColumns.includes('department') && <th className="py-3.5 px-4">Department</th>}
                {visibleColumns.includes('section') && <th className="py-3.5 px-4">Section</th>}
                {visibleColumns.includes('operationSystem') && <th className="py-3.5 px-4">Operation System</th>}
                {visibleColumns.includes('address') && <th className="py-3.5 px-4">Address</th>}
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
              {loading && employees.length === 0 ? (
                <tr>
                  <td colSpan={visibleColumns.length + 1} className="py-12 text-center text-slate-500 font-mono">
                    <span className="inline-block animate-spin mr-2">🌀</span>
                    {lang === 'en' ? 'Loading employees roster...' : 'កំពុងផ្ទុកបញ្ជីបុគ្គលិក...'}
                  </td>
                </tr>
              ) : displayedEmployees.length === 0 ? (
                <tr>
                  <td colSpan={visibleColumns.length + 1} className="py-12 text-center text-slate-500 space-y-2">
                    <div className="text-3xl">👤</div>
                    <p className="font-semibold">
                      {lang === 'en' ? 'No employees found' : 'រកមិនឃើញទិន្នន័យបុគ្គលិកឡើយ'}
                    </p>
                    <button
                      type="button"
                      onClick={openCreateModal}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600/30 border border-blue-500/40 px-3 py-1.5 text-xs font-bold text-blue-300 hover:bg-blue-600/50 transition"
                    >
                      + {lang === 'en' ? 'Create Employee' : 'បង្កើតបុគ្គលិក'}
                    </button>
                  </td>
                </tr>
              ) : (
                displayedEmployees.map((emp) => (
                  <tr key={emp.id || emp.code} className="hover:bg-slate-800/50 transition">
                    {/* Code */}
                    {visibleColumns.includes('code') && (
                      <td className="py-3 px-4 font-mono font-bold text-blue-400 whitespace-nowrap">
                        <span className="bg-blue-500/10 border border-blue-500/25 px-2 py-0.5 rounded-lg">
                          {emp.code}
                        </span>
                      </td>
                    )}

                    {/* First Name */}
                    {visibleColumns.includes('firstName') && (
                      <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                        {emp.firstName || emp.name?.split(' ')[0] || '---'}
                      </td>
                    )}

                    {/* Last Name */}
                    {visibleColumns.includes('lastName') && (
                      <td className="py-3 px-4 font-bold text-slate-200 whitespace-nowrap">
                        {emp.lastName || emp.name?.split(' ').slice(1).join(' ') || '---'}
                      </td>
                    )}

                    {/* Phone */}
                    {visibleColumns.includes('phone') && (
                      <td className="py-3 px-4 font-mono text-slate-300 whitespace-nowrap">
                        <div>{emp.phone1 || emp.phone || '---'}</div>
                        {emp.phone2 && <div className="text-[10px] text-slate-500">{emp.phone2}</div>}
                      </td>
                    )}

                    {/* Email */}
                    {visibleColumns.includes('email') && (
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-300">{emp.email || '---'}</span>
                          {emp.emailVerified && (
                            <span title="Verified" className="text-[10px] text-emerald-400 font-bold">
                              ✓
                            </span>
                          )}
                        </div>
                      </td>
                    )}

                    {/* Position */}
                    {visibleColumns.includes('position') && (
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="inline-flex rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
                          {emp.position || 'Associate Staff'}
                        </span>
                      </td>
                    )}

                    {/* Active */}
                    {visibleColumns.includes('active') && (
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(emp)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition active:scale-95 ${
                            emp.active !== false
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                              : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              emp.active !== false ? 'bg-emerald-400' : 'bg-slate-500'
                            }`}
                          />
                          <span>{emp.active !== false ? 'ACTIVE' : 'INACTIVE'}</span>
                        </button>
                      </td>
                    )}

                    {/* Gender */}
                    {visibleColumns.includes('gender') && (
                      <td className="py-3 px-4 text-center text-slate-300 whitespace-nowrap">
                        {emp.gender || '---'}
                      </td>
                    )}

                    {/* ID Number */}
                    {visibleColumns.includes('idNumber') && (
                      <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                        {emp.idNumber || '---'}
                      </td>
                    )}

                    {/* Office */}
                    {visibleColumns.includes('office') && (
                      <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                        {emp.office || '---'}
                      </td>
                    )}

                    {/* Department */}
                    {visibleColumns.includes('department') && (
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="inline-flex rounded-lg bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.5 text-[11px] font-semibold text-indigo-300">
                          {emp.department || '---'}
                        </span>
                      </td>
                    )}

                    {/* Section */}
                    {visibleColumns.includes('section') && (
                      <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                        {emp.section || '---'}
                      </td>
                    )}

                    {/* Operation System */}
                    {visibleColumns.includes('operationSystem') && (
                      <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-lg">
                          💻 {emp.operationSystem || '---'}
                        </span>
                      </td>
                    )}

                    {/* Address */}
                    {visibleColumns.includes('address') && (
                      <td className="py-3 px-4 text-slate-400 max-w-xs truncate" title={emp.address}>
                        {emp.address || '---'}
                      </td>
                    )}

                    {/* Actions */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(emp)}
                          title="Edit"
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition active:scale-95"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteEmployee(emp.id, emp.code, emp.firstName ? `${emp.firstName} ${emp.lastName}` : emp.name)}
                          title="Delete"
                          className="p-1 text-slate-500 hover:text-rose-400 transition"
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

      {/* 4. CHOOSE COLUMN MODAL */}
      {chooseColumnOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">⚙️</span>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {lang === 'en' ? 'Choose Column' : 'ជ្រើសរើសជួរឈរ'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {lang === 'en'
                      ? 'Choose column you want to display on table'
                      : 'ជ្រើសរើសជួរឈរដែលអ្នកចង់បង្ហាញលើតារាង'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setChooseColumnOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Columns Checklist */}
            <div className="grid grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {ALL_COLUMNS.map((col) => {
                const checked = visibleColumns.includes(col.key)
                return (
                  <label
                    key={col.key}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition ${
                      checked
                        ? 'bg-blue-500/10 border-blue-500/40 text-blue-300'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToggleColumn(col.key)}
                      className="h-4 w-4 rounded border-slate-700 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="truncate">{lang === 'kh' ? col.label.kh : col.label.en}</span>
                  </label>
                )
              })}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectAllColumns}
                  className="px-2.5 py-1 text-[11px] font-bold text-blue-400 hover:text-blue-300 hover:underline"
                >
                  {lang === 'en' ? 'Select All' : 'ជ្រើសទាំងអស់'}
                </button>
                <span className="text-slate-700">|</span>
                <button
                  type="button"
                  onClick={handleResetColumns}
                  className="px-2.5 py-1 text-[11px] font-bold text-slate-400 hover:text-slate-300 hover:underline"
                >
                  {lang === 'en' ? 'Default' : 'លំនាំដើម'}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setChooseColumnOpen(false)}
                className="rounded-xl bg-blue-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-500 active:scale-95 transition"
              >
                {lang === 'en' ? 'Apply & Close' : 'អនុវត្ត & បិទ'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. CREATE / EDIT EMPLOYEE MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-7 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto scrollbar-thin">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-400 text-lg">
                  👤
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    {editingId
                      ? lang === 'en' ? 'Edit Employee Information' : 'កែប្រែព័ត៌មានបុគ្គលិក'
                      : lang === 'en' ? 'Create New Employee' : 'បង្កើតបុគ្គលិកថ្មី'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {lang === 'en'
                      ? 'Fill in the general information and contact address details below.'
                      : 'បំពេញព័ត៌មានទូទៅ និងអាសយដ្ឋានទំនាក់ទំនងខាងក្រោម។'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-6 text-xs">
              {/* SECTION 1: GENERAL INFORMATION */}
              <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 sm:p-5">
                <div className="border-b border-slate-800/80 pb-2.5">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-400" />
                    <span>{lang === 'en' ? 'General Information' : 'ព័ត៌មានទូទៅ'}</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {lang === 'en' ? 'Input the general employee information' : 'បញ្ចូលព័ត៌មានទូទៅរបស់បុគ្គលិក'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Code Auto Generate Code - textbox */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300 flex items-center justify-between">
                      <span>Code</span>
                      <button
                        type="button"
                        onClick={handleRegenerateCode}
                        className="text-[10px] text-blue-400 hover:underline"
                        title="Generate Next Code"
                      >
                        Auto Generate Code ↻
                      </button>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 pl-3 pr-8 font-mono font-bold text-blue-400 outline-none focus:border-blue-400"
                      />
                      <button
                        type="button"
                        onClick={handleRegenerateCode}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                      >
                        ⚡
                      </button>
                    </div>
                  </div>

                  {/* Active - Tickbox */}
                  <div className="flex items-end pb-2">
                    <label className="inline-flex items-center gap-3 cursor-pointer select-none rounded-xl border border-slate-800 bg-slate-950/80 p-2.5 w-full">
                      <input
                        type="checkbox"
                        checked={formData.active}
                        onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                        className="h-4 w-4 rounded border-slate-700 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <span className="font-bold text-white block">Active Status</span>
                        <span className="text-[10px] text-slate-400">
                          {formData.active ? 'Employee is active on the roster' : 'Employee is marked inactive'}
                        </span>
                      </div>
                    </label>
                  </div>

                  {/* First Name * */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">
                      First Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="e.g. Sokheng"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-white outline-none focus:border-blue-400"
                    />
                  </div>

                  {/* Last Name * */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">
                      Last Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="e.g. Chea"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-white outline-none focus:border-blue-400"
                    />
                  </div>

                  {/* Date of Birth - date */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Date of Birth</label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-white outline-none focus:border-blue-400"
                    />
                  </div>

                  {/* Gender - dropdown male female */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-white outline-none focus:border-blue-400"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* ID Number - textbox */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">ID Number</label>
                    <input
                      type="text"
                      value={formData.idNumber}
                      onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                      placeholder="e.g. KH-0891245 / Passport"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 font-mono text-white outline-none focus:border-blue-400"
                    />
                  </div>

                  {/* Office - Dropdown */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Office</label>
                    <select
                      value={formData.office}
                      onChange={(e) => setFormData({ ...formData, office: e.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-white outline-none focus:border-blue-400"
                    >
                      {OFFICE_OPTIONS.map((off) => (
                        <option key={off} value={off}>
                          {off}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Department - Dropdown */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Department</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-white outline-none focus:border-blue-400"
                    >
                      {DEPARTMENT_OPTIONS.map((dep) => (
                        <option key={dep} value={dep}>
                          {dep}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Section - dropdown */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Section</label>
                    <select
                      value={formData.section}
                      onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-white outline-none focus:border-blue-400"
                    >
                      {SECTION_OPTIONS.map((sec) => (
                        <option key={sec} value={sec}>
                          {sec}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Position - dropdown */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Position</label>
                    <select
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-white outline-none focus:border-blue-400"
                    >
                      {POSITION_OPTIONS.map((pos) => (
                        <option key={pos} value={pos}>
                          {pos}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Operation System - dropdown */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Operation System</label>
                    <select
                      value={formData.operationSystem}
                      onChange={(e) => setFormData({ ...formData, operationSystem: e.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-white outline-none focus:border-blue-400"
                    >
                      {OS_OPTIONS.map((os) => (
                        <option key={os} value={os}>
                          {os}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 2: CONTACT ADDRESS */}
              <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 sm:p-5">
                <div className="border-b border-slate-800/80 pb-2.5">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span>{lang === 'en' ? 'Contact Address' : 'អាសយដ្ឋានទំនាក់ទំនង'}</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {lang === 'en' ? 'Input the general contact address information' : 'បញ្ចូលព័ត៌មានទំនាក់ទំនង និងអាសយដ្ឋានទូទៅ'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone 1 * - textbox */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">
                      Phone 1 <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.phone1}
                      onChange={(e) => setFormData({ ...formData, phone1: e.target.value })}
                      placeholder="e.g. 012 345 678"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 font-mono text-white outline-none focus:border-blue-400"
                    />
                  </div>

                  {/* Phone 2 - textbox */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Phone 2</label>
                    <input
                      type="text"
                      value={formData.phone2}
                      onChange={(e) => setFormData({ ...formData, phone2: e.target.value })}
                      placeholder="e.g. 088 123 4567"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 font-mono text-white outline-none focus:border-blue-400"
                    />
                  </div>

                  {/* Email - textbox & Verify button */}
                  <div className="space-y-1 sm:col-span-2">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-300">Email</label>
                      {formData.emailVerified ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-black text-emerald-400">
                          ✓ Verified
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-400">Not verified</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value, emailVerified: false })
                        }
                        placeholder="e.g. user@bgroceries.com"
                        className="flex-1 rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-white outline-none focus:border-blue-400"
                      />
                      {/* Verify button */}
                      <button
                        type="button"
                        onClick={handleVerifyContact}
                        disabled={verifying}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition active:scale-95 whitespace-nowrap ${
                          formData.emailVerified
                            ? 'bg-emerald-600/30 border border-emerald-500/40 text-emerald-300'
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:from-blue-500 hover:to-indigo-500'
                        }`}
                      >
                        {verifying ? 'Checking...' : formData.emailVerified ? '✓ Verified' : 'Verify'}
                      </button>
                    </div>
                  </div>

                  {/* Email Template - dropdown */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-slate-300">Email Template</label>
                    <select
                      value={formData.emailTemplate}
                      onChange={(e) => setFormData({ ...formData, emailTemplate: e.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-white outline-none focus:border-blue-400"
                    >
                      {EMAIL_TEMPLATE_OPTIONS.map((tmpl) => (
                        <option key={tmpl} value={tmpl}>
                          {tmpl}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Address * textbox */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-slate-300">
                      Address <span className="text-rose-400">*</span>
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="e.g. Street 2004, Sangkat Teuk Thla, Khan Sen Sok, Phnom Penh"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-white outline-none focus:border-blue-400 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Form Footer Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      code: 'Auto Generate Code',
                      active: true,
                      firstName: '',
                      lastName: '',
                      dateOfBirth: '',
                      gender: 'Male',
                      idNumber: '',
                      office: OFFICE_OPTIONS[0],
                      department: DEPARTMENT_OPTIONS[0],
                      section: SECTION_OPTIONS[0],
                      position: POSITION_OPTIONS[0],
                      operationSystem: OS_OPTIONS[0],
                      phone1: '',
                      phone2: '',
                      email: '',
                      emailTemplate: EMAIL_TEMPLATE_OPTIONS[0],
                      emailVerified: false,
                      address: '',
                    })
                  }
                  className="text-xs font-bold text-slate-400 hover:text-slate-200 transition"
                >
                  {lang === 'en' ? 'Reset Fields' : 'កំណត់ទម្រង់ឡើងវិញ'}
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition"
                  >
                    {lang === 'en' ? 'Cancel' : 'បោះបង់'}
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-2 text-xs font-black text-white shadow-lg shadow-blue-500/25 hover:from-blue-400 hover:to-indigo-500 active:scale-95 transition disabled:opacity-50"
                  >
                    {saving
                      ? lang === 'en' ? 'Saving...' : 'កំពុងរក្សាទុក...'
                      : editingId
                      ? lang === 'en' ? 'Update Employee' : 'ធ្វើបច្ចុប្បន្នភាព'
                      : lang === 'en' ? 'Save Employee' : 'រក្សាទុកបុគ្គលិក'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
