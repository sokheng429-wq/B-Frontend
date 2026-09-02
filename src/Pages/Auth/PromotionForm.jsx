import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useNotifications } from '../../context/NotificationContext'
import { adminSalePromotionAPI, adminProductAPI } from '../../api/api'
import giftIcon from '../../assets/icon/3dicons-gift-box-dynamic-color.png'

const PRICE_BOOKS = [
  'Standard Retail Price Book',
  'Wholesale Tier 1 Book',
  'VIP Club Member Book',
  'Special Partner Book',
]

const PRODUCT_GROUPS = [
  'Fresh Fruits & Vegetables',
  'Beverages & Soft Drinks',
  'Meat & Seafood',
  'Dairy & Eggs',
  'Snacks & Confectionery',
  'Organic & Specialty',
]

export const PromotionForm = () => {
  const { lang } = useLanguage()
  const { addNotification } = useNotifications()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  // Primary Information
  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')
  const [secondLanguage, setSecondLanguage] = useState('')
  const [active, setActive] = useState(true)

  // Price Book
  const [priceBook, setPriceBook] = useState(PRICE_BOOKS[0])

  // Discount Type: PERCENTAGE | FIXED_AMOUNT | BUY_X_GET_Y
  const [discountType, setDiscountType] = useState('PERCENTAGE')

  // Minimum Requirement: ENTIRE_ORDER | MIN_PURCHASE_AMOUNT | MIN_QUANTITY
  const [minReqType, setMinReqType] = useState('ENTIRE_ORDER')
  const [minReqValue, setMinReqValue] = useState('')

  // Discount Value Scope: ENTIRE_ORDER | SPECIFIC_PRODUCT_GROUP | SPECIFIC_PRODUCT
  const [discountScope, setDiscountScope] = useState('ENTIRE_ORDER')
  const [targetScopeName, setTargetScopeName] = useState(PRODUCT_GROUPS[0])
  const [discountValue, setDiscountValue] = useState('10')

  // Active Date: INTERVAL | RECURRENT
  const [dateType, setDateType] = useState('INTERVAL')
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10))
  const [endDate, setEndDate] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 30)
    return d.toISOString().slice(0, 10)
  })

  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(isEdit)

  // Load next code or existing promotion
  useEffect(() => {
    if (isEdit) {
      adminSalePromotionAPI.getById(id)
        .then((res) => {
          const p = res?.data || res
          if (p) {
            setCode(p.code || '')
            setDescription(p.description || '')
            setSecondLanguage(p.secondLanguage || '')
            setActive(p.active !== false)
            setPriceBook(p.priceBook || PRICE_BOOKS[0])
            setDiscountType(p.discountType || 'PERCENTAGE')
            setMinReqType(p.minRequirementType || 'ENTIRE_ORDER')
            setMinReqValue(p.minRequirementValue ? String(p.minRequirementValue) : '')
            setDiscountScope(p.discountValueScope || 'ENTIRE_ORDER')
            setTargetScopeName(p.targetScopeName || PRODUCT_GROUPS[0])
            setDiscountValue(p.discountValue ? String(p.discountValue) : '0')
            setDateType(p.dateType || 'INTERVAL')
            if (p.startDate) setStartDate(p.startDate)
            if (p.endDate) setEndDate(p.endDate)
          }
          setLoading(false)
        })
        .catch((err) => {
          console.error('Failed to load promo:', err)
          setLoading(false)
        })
    } else {
      adminSalePromotionAPI.getNextCode()
        .then((res) => {
          if (res?.data?.nextCode || res?.nextCode) {
            setCode(res.data?.nextCode || res.nextCode)
          }
        })
        .catch(() => {})
    }
  }, [id, isEdit])

  const handleSubmit = async (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault()
    }
    if (!description.trim()) {
      addNotification?.({
        type: 'warning',
        title: 'Description Required',
        message: 'Please enter a promotion description.',
      })
      return
    }

    setSaving(true)
    const payload = {
      code: code.trim(),
      description: description.trim(),
      secondLanguage: secondLanguage.trim(),
      active: active,
      priceBook: priceBook,
      discountType: discountType,
      minRequirementType: minReqType,
      minRequirementValue: Number(minReqValue) || 0,
      discountValueScope: discountScope,
      targetScopeName: discountScope !== 'ENTIRE_ORDER' ? targetScopeName : null,
      discountValue: Number(discountValue) || 0,
      dateType: dateType,
      startDate: startDate || null,
      endDate: endDate || null,
    }

    try {
      if (isEdit) {
        await adminSalePromotionAPI.update(id, payload)
        addNotification?.({
          type: 'success',
          title: 'Promotion Updated',
          message: `Promotion #${code} updated successfully.`,
        })
      } else {
        await adminSalePromotionAPI.create(payload)
        addNotification?.({
          type: 'success',
          title: 'Promotion Created',
          message: `New promotion #${code} is now active.`,
        })
      }
      navigate('/admin/sale-dashboard/promotions')
    } catch (err) {
      console.error('Save promo failed:', err)
      setSaving(false)
      addNotification?.({
        type: 'error',
        title: 'Save Failed',
        message: err.message || 'Could not save promotion.',
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-green-500 border-t-transparent" />
          <span className="text-xs text-slate-400">Loading promotion details...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/sale-dashboard/promotions"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <img src={giftIcon} alt="Promotion" className="w-10 h-10 object-contain drop-shadow-md" />
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>{isEdit ? (lang === 'en' ? 'Edit Promotion' : 'កែប្រែការផ្សព្វផ្សាយ') : (lang === 'en' ? 'Create Promotion' : 'បង្កើតការផ្សព្វផ្សាយថ្មី')}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-green-500/10 text-[#77BC1F] border border-green-500/20 font-bold">
                {code || 'PROMO'}
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'en'
                ? 'Configure discounts, eligibility requirements, price books, and duration schedules'
                : 'កំណត់ការបញ្ចុះតម្លៃ លក្ខខណ្ឌតម្រូវ និងកាលវិភាគសុពលភាព'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/sale-dashboard/promotions"
            className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-xs font-bold text-slate-300 hover:bg-slate-800 transition"
          >
            {lang === 'en' ? 'Cancel' : 'បោះបង់'}
          </Link>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#77BC1F] to-[#5ea113] hover:from-[#65a317] hover:to-[#4e880e] text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-green-500/20 transition active:scale-95 disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
            {saving ? 'Saving...' : isEdit ? 'Update Promotion' : 'Save Promotion'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: PRIMARY INFORMATION */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-500/20 text-[#77BC1F] font-black text-xs">
                1
              </span>
              <h2 className="text-sm font-black uppercase tracking-wider text-white">
                {lang === 'en' ? 'Primary Information' : 'ព័ត៌មានចម្បង'}
              </h2>
            </div>
            {/* Active TickBox */}
            <label className="inline-flex items-center gap-2 text-xs font-bold cursor-pointer select-none">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="w-4 h-4 accent-[#77BC1F] rounded cursor-pointer"
              />
              <span className={active ? 'text-[#77BC1F]' : 'text-slate-500'}>
                {active ? 'Active Promotion' : 'Inactive'}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-400 uppercase mb-1.5">
                {lang === 'en' ? 'Promotion Code' : 'លេខកូដការផ្សព្វផ្សាយ'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. PR-260902-0001"
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-orange-400 font-bold focus:border-green-400 focus:outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] uppercase font-bold text-slate-500">
                  Auto
                </span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-400 uppercase mb-1.5">
                {lang === 'en' ? 'Second Language (Khmer/Alternative)' : 'ភាសាទីពីរ (ភាសាខ្មែរ)'}
              </label>
              <input
                type="text"
                value={secondLanguage}
                onChange={(e) => setSecondLanguage(e.target.value)}
                placeholder="ឧ. បញ្ចុះតម្លៃពិសេសចុងសប្តាហ៍..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-white focus:border-green-400 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-400 uppercase mb-1.5">
                {lang === 'en' ? 'Description *' : 'ការពិពណ៌នា *'}
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. 15% OFF for All Fresh Fruits on Orders over $30"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-white font-semibold focus:border-green-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: PRICE BOOK */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 font-black text-xs">
              2
            </span>
            <h2 className="text-sm font-black uppercase tracking-wider text-white">
              {lang === 'en' ? 'Price Book' : 'សៀវភៅតម្លៃ'}
            </h2>
          </div>

          <div className="text-xs">
            <label className="block font-bold text-slate-400 uppercase mb-1.5">
              {lang === 'en' ? 'Select Applicable Price Book' : 'ជ្រើសរើសសៀវភៅតម្លៃ'}
            </label>
            <select
              value={priceBook}
              onChange={(e) => setPriceBook(e.target.value)}
              className="w-full sm:w-1/2 rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-white font-semibold focus:border-green-400 focus:outline-none cursor-pointer"
            >
              {PRICE_BOOKS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>

        {/* SECTION 3: DISCOUNT TYPE */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 font-black text-xs">
              3
            </span>
            <h2 className="text-sm font-black uppercase tracking-wider text-white">
              {lang === 'en' ? 'Discount Type' : 'ប្រភេទនៃការបញ្ចុះតម្លៃ'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {/* Percentage Tick Box */}
            <label
              onClick={() => setDiscountType('PERCENTAGE')}
              className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                discountType === 'PERCENTAGE'
                  ? 'border-[#77BC1F] bg-green-500/10 text-white font-bold'
                  : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
              }`}
            >
              <input
                type="radio"
                name="discountType"
                checked={discountType === 'PERCENTAGE'}
                onChange={() => setDiscountType('PERCENTAGE')}
                className="accent-[#77BC1F] w-4 h-4"
              />
              <div>
                <p className="text-white font-bold">Percentage (%)</p>
                <p className="text-[11px] text-slate-500">Discount by percentage</p>
              </div>
            </label>

            {/* Fixed Amount Tick Box */}
            <label
              onClick={() => setDiscountType('FIXED_AMOUNT')}
              className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                discountType === 'FIXED_AMOUNT'
                  ? 'border-[#77BC1F] bg-green-500/10 text-white font-bold'
                  : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
              }`}
            >
              <input
                type="radio"
                name="discountType"
                checked={discountType === 'FIXED_AMOUNT'}
                onChange={() => setDiscountType('FIXED_AMOUNT')}
                className="accent-[#77BC1F] w-4 h-4"
              />
              <div>
                <p className="text-white font-bold">Fixed Amount ($)</p>
                <p className="text-[11px] text-slate-500">Direct dollar reduction</p>
              </div>
            </label>

            {/* Buy X Get Y Tick Box */}
            <label
              onClick={() => setDiscountType('BUY_X_GET_Y')}
              className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                discountType === 'BUY_X_GET_Y'
                  ? 'border-[#77BC1F] bg-green-500/10 text-white font-bold'
                  : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
              }`}
            >
              <input
                type="radio"
                name="discountType"
                checked={discountType === 'BUY_X_GET_Y'}
                onChange={() => setDiscountType('BUY_X_GET_Y')}
                className="accent-[#77BC1F] w-4 h-4"
              />
              <div>
                <p className="text-white font-bold">Buy X Get Y</p>
                <p className="text-[11px] text-slate-500">Free item promotions</p>
              </div>
            </label>
          </div>
        </div>

        {/* SECTION 4: MINIMUM REQUIREMENT */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400 font-black text-xs">
              4
            </span>
            <h2 className="text-sm font-black uppercase tracking-wider text-white">
              {lang === 'en' ? 'Minimum Requirement' : 'លក្ខខណ្ឌតម្រូវអប្បបរមា'}
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            {/* Entire Order Tick Box */}
            <label
              onClick={() => setMinReqType('ENTIRE_ORDER')}
              className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                minReqType === 'ENTIRE_ORDER'
                  ? 'border-purple-500 bg-purple-500/10 text-white font-bold'
                  : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
              }`}
            >
              <input
                type="radio"
                name="minReqType"
                checked={minReqType === 'ENTIRE_ORDER'}
                onChange={() => setMinReqType('ENTIRE_ORDER')}
                className="accent-purple-500 w-4 h-4"
              />
              <span>{lang === 'en' ? 'Entire Order (No minimum required)' : 'គ្រប់ការបញ្ជាទិញ (គ្មានលក្ខខណ្ឌអប្បបរមា)'}</span>
            </label>

            {/* Minimum Purchase Amount Tick Box */}
            <label
              onClick={() => setMinReqType('MIN_PURCHASE_AMOUNT')}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                minReqType === 'MIN_PURCHASE_AMOUNT'
                  ? 'border-purple-500 bg-purple-500/10 text-white font-bold'
                  : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="minReqType"
                  checked={minReqType === 'MIN_PURCHASE_AMOUNT'}
                  onChange={() => setMinReqType('MIN_PURCHASE_AMOUNT')}
                  className="accent-purple-500 w-4 h-4"
                />
                <span>{lang === 'en' ? 'Minimum Purchase Amount ($)' : 'ចំនួនទឹកប្រាក់ទិញអប្បបរមា ($)'}</span>
              </div>
              {minReqType === 'MIN_PURCHASE_AMOUNT' && (
                <div className="flex items-center gap-2 pl-7 sm:pl-0">
                  <span className="text-slate-400">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={minReqValue}
                    onChange={(e) => setMinReqValue(e.target.value)}
                    placeholder="50.00"
                    className="w-28 rounded-lg border border-purple-400/50 bg-slate-950 px-2.5 py-1 text-white font-bold focus:outline-none"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}
            </label>

            {/* Minimum Quantity of Products Tick Box */}
            <label
              onClick={() => setMinReqType('MIN_QUANTITY')}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                minReqType === 'MIN_QUANTITY'
                  ? 'border-purple-500 bg-purple-500/10 text-white font-bold'
                  : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="minReqType"
                  checked={minReqType === 'MIN_QUANTITY'}
                  onChange={() => setMinReqType('MIN_QUANTITY')}
                  className="accent-purple-500 w-4 h-4"
                />
                <span>{lang === 'en' ? 'Minimum Quantity of Products' : 'ចំនួនបរិមាណទំនិញអប្បបរមា'}</span>
              </div>
              {minReqType === 'MIN_QUANTITY' && (
                <div className="flex items-center gap-2 pl-7 sm:pl-0">
                  <input
                    type="number"
                    value={minReqValue}
                    onChange={(e) => setMinReqValue(e.target.value)}
                    placeholder="3"
                    className="w-28 rounded-lg border border-purple-400/50 bg-slate-950 px-2.5 py-1 text-white font-bold focus:outline-none"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="text-slate-400">items</span>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* SECTION 5: DISCOUNT VALUE */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 font-black text-xs">
              5
            </span>
            <h2 className="text-sm font-black uppercase tracking-wider text-white">
              {lang === 'en' ? 'Discount Value & Target Scope' : 'តម្លៃបញ្ចុះ និងទំហំអនុវត្ត'}
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            {/* Entire Order Tick Box */}
            <label
              onClick={() => setDiscountScope('ENTIRE_ORDER')}
              className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                discountScope === 'ENTIRE_ORDER'
                  ? 'border-emerald-500 bg-emerald-500/10 text-white font-bold'
                  : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
              }`}
            >
              <input
                type="radio"
                name="discountScope"
                checked={discountScope === 'ENTIRE_ORDER'}
                onChange={() => setDiscountScope('ENTIRE_ORDER')}
                className="accent-emerald-500 w-4 h-4"
              />
              <span>{lang === 'en' ? 'Entire Order' : 'លើការបញ្ជាទិញទាំងមូល'}</span>
            </label>

            {/* Specific Product Group Tick Box */}
            <label
              onClick={() => setDiscountScope('SPECIFIC_PRODUCT_GROUP')}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                discountScope === 'SPECIFIC_PRODUCT_GROUP'
                  ? 'border-emerald-500 bg-emerald-500/10 text-white font-bold'
                  : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="discountScope"
                  checked={discountScope === 'SPECIFIC_PRODUCT_GROUP'}
                  onChange={() => setDiscountScope('SPECIFIC_PRODUCT_GROUP')}
                  className="accent-emerald-500 w-4 h-4"
                />
                <span>{lang === 'en' ? 'Specific Product Group' : 'ក្រុមទំនិញជាក់លាក់'}</span>
              </div>
              {discountScope === 'SPECIFIC_PRODUCT_GROUP' && (
                <select
                  value={targetScopeName}
                  onChange={(e) => setTargetScopeName(e.target.value)}
                  className="rounded-lg border border-emerald-400/50 bg-slate-950 px-3 py-1.5 text-white font-semibold focus:outline-none cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  {PRODUCT_GROUPS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              )}
            </label>

            {/* Specific Product Tick Box */}
            <label
              onClick={() => setDiscountScope('SPECIFIC_PRODUCT')}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                discountScope === 'SPECIFIC_PRODUCT'
                  ? 'border-emerald-500 bg-emerald-500/10 text-white font-bold'
                  : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="discountScope"
                  checked={discountScope === 'SPECIFIC_PRODUCT'}
                  onChange={() => setDiscountScope('SPECIFIC_PRODUCT')}
                  className="accent-emerald-500 w-4 h-4"
                />
                <span>{lang === 'en' ? 'Specific Product' : 'ទំនិញជាក់លាក់'}</span>
              </div>
              {discountScope === 'SPECIFIC_PRODUCT' && (
                <input
                  type="text"
                  value={targetScopeName}
                  onChange={(e) => setTargetScopeName(e.target.value)}
                  placeholder="e.g. Fresh Red Apple, Organic Milk 1L..."
                  className="rounded-lg border border-emerald-400/50 bg-slate-950 px-3 py-1.5 text-white font-semibold focus:outline-none"
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </label>

            {/* Value Input */}
            <div className="pt-2">
              <label className="block font-bold text-slate-400 uppercase mb-1.5">
                {lang === 'en' ? 'Discount Value' : 'តម្លៃបញ្ចុះ'} ({discountType === 'PERCENTAGE' ? '%' : '$'})
              </label>
              <div className="relative w-44">
                <input
                  type="number"
                  step="0.01"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  placeholder="0.00"
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-emerald-400 text-base font-black focus:border-emerald-400 focus:outline-none"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-black text-slate-400">
                  {discountType === 'PERCENTAGE' ? '%' : '$'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 6: ACTIVE DATE */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400 font-black text-xs">
              6
            </span>
            <h2 className="text-sm font-black uppercase tracking-wider text-white">
              {lang === 'en' ? 'Active Date & Schedule' : 'កាលបរិច្ឆេទសុពលភាព'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Interval Tick Box */}
            <label
              onClick={() => setDateType('INTERVAL')}
              className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                dateType === 'INTERVAL'
                  ? 'border-rose-500 bg-rose-500/10 text-white font-bold'
                  : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
              }`}
            >
              <input
                type="radio"
                name="dateType"
                checked={dateType === 'INTERVAL'}
                onChange={() => setDateType('INTERVAL')}
                className="accent-rose-500 w-4 h-4"
              />
              <div>
                <p className="text-white font-bold">Interval (Continuous Date Range)</p>
                <p className="text-[11px] text-slate-500">Active continuously between start & end date</p>
              </div>
            </label>

            {/* Recurrent Tick Box */}
            <label
              onClick={() => setDateType('RECURRENT')}
              className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                dateType === 'RECURRENT'
                  ? 'border-rose-500 bg-rose-500/10 text-white font-bold'
                  : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
              }`}
            >
              <input
                type="radio"
                name="dateType"
                checked={dateType === 'RECURRENT'}
                onChange={() => setDateType('RECURRENT')}
                className="accent-rose-500 w-4 h-4"
              />
              <div>
                <p className="text-white font-bold">Recurrent (Scheduled Cycle)</p>
                <p className="text-[11px] text-slate-500">Repeats periodically (e.g. weekends)</p>
              </div>
            </label>

            <div>
              <label className="block font-bold text-slate-400 uppercase mb-1.5">
                {lang === 'en' ? 'Start Date' : 'កាលបរិច្ឆេទចាប់ផ្តើម'}
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-white focus:border-rose-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-400 uppercase mb-1.5">
                {lang === 'en' ? 'End Date' : 'កាលបរិច្ឆេទបញ្ចប់'}
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-white focus:border-rose-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Bottom Controls */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Link
            to="/admin/sale-dashboard/promotions"
            className="px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-xs font-bold text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-7 py-2.5 rounded-xl bg-gradient-to-r from-[#77BC1F] to-[#5ea113] hover:from-[#65a317] hover:to-[#4e880e] text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-green-500/20 disabled:opacity-50"
          >
            {saving ? 'Saving...' : isEdit ? 'Update Promotion' : 'Save Promotion'}
          </button>
        </div>
      </form>
    </div>
  )
}
export default PromotionForm
