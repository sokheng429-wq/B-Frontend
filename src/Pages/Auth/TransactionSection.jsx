import { useEffect, useState } from 'react'
import * as XLSX from 'xlsx'
import { useLanguage } from '../../context/LanguageContext'
import { adminProductAPI } from '../../api/api'
import { useCollection, nextAverageCost, LOCATIONS } from './stockStore'
import ReceiveProductsCreate from './ReceiveProductsCreate'
import { SectionShell, Field, TextInput, SelectInput, PrimaryButton, GhostButton, Modal, DataTable, Pill } from './stockUI'

const ORANGE = '#FF9900'

// Per-operation configuration.
const OPS = {
  'receive-products': {
    icon: '📥', color: '#22c55e', kind: 'receive',
    title: { en: 'Receive Products', kh: 'ទទួលទំនិញ' },
    subtitle: { en: 'Goods receipt from a supplier or PO — raises on-hand and recalculates moving average cost.', kh: 'ការទទួលទំនិញពីអ្នកផ្គត់ផ្គង់ ឬ PO — បង្កើនស្តុក និងគណនាចំណាយមធ្យមឡើងវិញ។' },
    docPrefix: 'GRN',
  },
  'issue-products': {
    icon: '📤', color: '#f97316', kind: 'issue',
    title: { en: 'Issue Products', kh: 'ដកទំនិញចេញ' },
    subtitle: { en: 'Deduct stock for internal use, write-offs, samples or other non-sale outflows.', kh: 'ដកស្តុកសម្រាប់ប្រើប្រាស់ខាងក្នុង ជាគំរូ ឬការដកចេញផ្សេងទៀត។' },
    docPrefix: 'GI',
  },
  'adjustment-products': {
    icon: '🔧', color: '#eab308', kind: 'adjust',
    title: { en: 'Adjustment Products', kh: 'កែតម្រូវស្តុក' },
    subtitle: { en: 'Reconcile physical counts with system quantities (breakage, theft, counting errors).', kh: 'តម្រឹមការរាប់ជាមួយបរិមាណក្នុងប្រព័ន្ធ (ខូច បាត់បង់ កំហុសរាប់)។' },
    docPrefix: 'ADJ',
  },
  // ---- transfer workflow: request → ship → receive ------------------------
  'request-transfer': {
    icon: '📨', color: '#0ea5e9', kind: 'transfer-request',
    title: { en: 'Request Transfer Products', kh: 'សំណើផ្ទេរទំនិញ' },
    subtitle: { en: 'A branch requests stock from another location. Requests start as PENDING until shipped.', kh: 'សាខាស្នើសុំស្តុកពីទីតាំងផ្សេង។ សំណើចាប់ផ្តើមជាស្ថានភាព PENDING រហូតដល់ដឹកជញ្ជូន។' },
    docPrefix: 'TR',
  },
  'ship-request-transfer': {
    icon: '🛫', color: '#8b5cf6', kind: 'transfer-ship',
    title: { en: 'Ship & Request Transfer Products', kh: 'ដឹកជញ្ជូនសំណើផ្ទេរ' },
    subtitle: { en: 'Review pending transfer requests, pick items and mark them In-Transit.', kh: 'ពិនិត្យសំណើដែលរង់ចាំ ជ្រើសរើសទំនិញ និងសម្គាល់ជាកំពុងដឹកជញ្ជូន។' },
    docPrefix: '',
  },
  'transfer-products': {
    icon: '🔁', color: '#14b8a6', kind: 'transfer-receive',
    title: { en: 'Transfer Products', kh: 'ទទួលទំនិញផ្ទេរ' },
    subtitle: { en: 'Confirm receipt of in-transit items to add them to local on-hand stock.', kh: 'បញ្ជាក់ការទទួលទំនិញកំពុងដឹកជញ្ជូន ដើម្បីបន្ថែមលើស្តុកមូលដ្ឋាន។' },
    docPrefix: '',
  },
}

// Receive List columns (Receive Products only) — mirrors the receive entity.
// "code" is the identity column and is always shown; the rest are offered in
// the Choose Column modal (same layout as Suppliers Group / Product Groups).
const RECEIVE_CODE_COL = { key: 'code', label: { en: 'Code', kh: 'កូដ' } }
const RECEIVE_OPTIONAL_COLS = [
  { key: 'date', label: { en: 'Date', kh: 'កាលបរិច្ឆេទ' } },
  { key: 'supplier', label: { en: 'Supplier', kh: 'អ្នកផ្គត់ផ្គង់' } },
  { key: 'totalCost', label: { en: 'Total Cost', kh: 'ចំណាយសរុប' } },
  { key: 'receiveType', label: { en: 'Receive Type', kh: 'ប្រភេទនៃការទទួល' } },
  { key: 'reference', label: { en: 'Reference', kh: 'យោង' } },
  { key: 'receivedBy', label: { en: 'Received By', kh: 'អ្នកទទួល' } },
  { key: 'status', label: { en: 'Status', kh: 'ស្ថានភាព' } },
]

// Build an .xlsx workbook from header + data rows and trigger a download
// (same pattern as StocksList.jsx).
const downloadExcel = (filename, sheetName, headerRow, dataRows) => {
  const ws = XLSX.utils.aoa_to_sheet([headerRow, ...dataRows])
  ws['!cols'] = headerRow.map((h) => ({ wch: Math.max(12, Math.min(28, String(h).length + 6)) }))
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, sheetName)
  XLSX.writeFile(wb, filename)
}

export const TransactionSection = ({ sectionKey }) => {
  const { lang } = useLanguage()
  const op = OPS[sectionKey]
  const [products, setProducts] = useState([])
  const [lines, setLines] = useState([])
  const [docNo] = useState(() => `${op?.docPrefix || 'DOC'}-${String(Date.now()).slice(-6)}`)
  const [formOpen, setFormOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState(null)
  // line editor
  const [productId, setProductId] = useState('')
  const [qty, setQty] = useState('')
  const [unitCost, setUnitCost] = useState('')   // receive only
  const [counted, setCounted] = useState('')     // adjust only
  const [fromLoc, setFromLoc] = useState('main')
  const [toLoc, setToLoc] = useState('branch-a')
  const [note, setNote] = useState('')
  // receive document metadata (receive only)
  const [receiveDate, setReceiveDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [supplier, setSupplier] = useState('')
  const [receiveType, setReceiveType] = useState('Purchase Order')
  const [reference, setReference] = useState('')
  const [receivedBy, setReceivedBy] = useState('')
  // Receive List: search + column visibility
  const [receiveQuery, setReceiveQuery] = useState('')
  const [receiveSearchBy, setReceiveSearchBy] = useState('any')
  const [showReceiveCols, setShowReceiveCols] = useState(false)
  const [receiveVisibleCols, setReceiveVisibleCols] = useState(() => new Set(RECEIVE_OPTIONAL_COLS.map((c) => c.key)))
  const [receiveColDraft, setReceiveColDraft] = useState(receiveVisibleCols)
  // full-page create form (replaces the old New Document modal for receives)
  const [showCreatePage, setShowCreatePage] = useState(false)
  const [editingDoc, setEditingDoc] = useState(null)

  // ledgers — shared transfer workflow + per-op posting history
  const [requests, requestApi] = useCollection('tr-requests')
  const [history, historyApi] = useCollection(`ledger-${sectionKey}`)

  useEffect(() => {
    adminProductAPI.getAll()
      .then((res) => setProducts(Array.isArray(res?.data) ? res.data : []))
      .catch(() => {})
  }, [])

  if (!op) return null

  const t = (en, kh) => (lang === 'en' ? en : kh)
  // shared dark select/button styling — green focus ring (matches Suppliers Group)
  const selectCls = 'w-full rounded-lg border border-slate-700/70 bg-slate-950/60 px-3 py-2.5 text-sm font-medium text-white outline-none transition focus:border-green-400 focus:bg-slate-950 focus:ring-4 focus:ring-green-500/10 hover:border-slate-600'
  const ghostBtnCls = 'inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-3.5 py-2.5 text-xs font-bold text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40'
  const productName = (idOrName) => {
    if (typeof idOrName === 'string' && !/^\d+$/.test(idOrName)) return idOrName
    const p = products.find((x) => String(x.id) === String(idOrName))
    return p ? (typeof p.name === 'object' ? p.name?.en : p.name) || `#${p.id}` : `#${idOrName}`
  }

  /* ---------- document line handling ---------- */
  const openForm = () => {
    setLines([])
    setFeedback(null)
    if (op.kind === 'receive') {
      setReceiveDate(new Date().toISOString().slice(0, 10))
      setSupplier('')
      setReceiveType('Purchase Order')
      setReference('')
      setReceivedBy('')
    }
    setFormOpen(true)
  }

  const addLine = () => {
    const n = Number(qty)
    if (!productId) return
    if (op.kind === 'receive') {
      if (!n) return
      lines.push({ productId, qty: n, unitCost: Number(unitCost) || 0 })
      setUnitCost('')
    } else if (op.kind === 'adjust') {
      const c = Number(counted)
      if (!productId || Number.isNaN(c)) return
      lines.push({ productId, counted: c })
    } else {
      if (!n) return
      lines.push({ productId, qty: n })
    }
    setLines([...lines])
    setProductId('')
    setQty('')
    setCounted('')
  }

  /* ---------- post the document (receive / issue / adjust) ---------- */
  const postDocument = async () => {
    if (!lines.length) return
    setSaving(true)
    setFeedback(null)
    let ok = 0
    const fails = []
    const posted = []

    for (const line of lines) {
      try {
        const p = products.find((x) => String(x.id) === String(line.productId))
        if (!p) throw new Error(t('product not found', 'រកមិនឃើញផលិតផល'))
        const onHand = Number(p.onHand) || 0
        const before = onHand
        let after = onHand

        if (op.kind === 'receive') {
          const newAvg = nextAverageCost(onHand, p.averageCost, line.qty, line.unitCost)
          after = before + line.qty
          await adminProductAPI.update(p.id, {
            ...p,
            onHand: after,
            averageCost: newAvg,
            availableStock: Number(p.availableStock) ? Number(p.availableStock) + line.qty : null,
          })
        } else if (op.kind === 'issue') {
          if (line.qty > onHand) throw new Error(t('insufficient stock', 'ស្តុកមិនគ្រប់គ្រាន់'))
          after = before - line.qty
          await adminProductAPI.update(p.id, { ...p, onHand: after })
        } else if (op.kind === 'adjust') {
          after = line.counted
          await adminProductAPI.update(p.id, { ...p, onHand: after })
        }
        posted.push({ ...line, before, after })
        ok += 1
      } catch (err) {
        fails.push(`${productName(line.productId)}: ${err.message}`)
      }
    }

    if (ok > 0) {
      if (op.kind === 'receive') {
        // Receive List keeps ONE document-level record with the receive entity
        // fields; line detail stays nested so quantities/costs remain traceable.
        historyApi.add({
          code: docNo,
          date: receiveDate,
          supplier,
          totalCost: Math.round(posted.reduce((sum, l) => sum + (Number(l.qty) || 0) * (Number(l.unitCost) || 0), 0) * 100) / 100,
          receiveType,
          reference,
          receivedBy,
          status: 'Received',
          lines: posted.map((l) => ({
            productId: l.productId,
            name: productName(l.productId),
            qty: l.qty,
            unitCost: l.unitCost,
            before: l.before,
            after: l.after,
          })),
        })
      } else {
        // issue/adjust keep the per-line history rows
        posted.forEach((l) =>
          historyApi.add({
            docNo,
            productId: l.productId,
            name: productName(l.productId),
            qty: l.qty ?? null,
            unitCost: l.unitCost ?? null,
            before: l.before,
            after: l.after,
            diff: op.kind === 'adjust' ? l.after - l.before : null,
          })
        )
      }
      setFeedback({
        tone: fails.length ? 'orange' : 'green',
        text: t(`✓ ${ok} line(s) posted`, `✓ បានកត់ត្រា ${ok} ជួរដេក`) + (fails.length ? ` · ${fails.length} failed` : ''),
        fails: fails.slice(0, 4),
      })
      setLines([])
    } else {
      setFeedback({ tone: 'red', text: t('Nothing was posted.', 'មិនមានអ្វីបានកត់ត្រាទេ។'), fails: fails.slice(0, 4) })
    }
    setSaving(false)
  }

  /* ---------- transfer workflow actions ---------- */
  const createTransferRequest = () => {
    if (!lines.length || fromLoc === toLoc) return
    requestApi.add({
      docNo, fromLoc, toLoc, status: 'PENDING', note,
      lines: lines.map((l) => ({ productId: l.productId, name: productName(l.productId), qty: l.qty })),
    })
    setFeedback({ tone: 'green', text: t(`✓ Request ${docNo} created`, `✓ បានបង្កើតសំណើ ${docNo}`), fails: [] })
    setLines([])
    setFormOpen(false)
  }

  const shipRequests = () => {
    const pending = requests.filter((r) => r.status === 'PENDING')
    pending.forEach((r) => requestApi.update(r.id, { status: 'IN-TRANSIT' }))
    setFeedback({ tone: 'blue', text: t(`${pending.length} request(s) marked In-Transit`, `${pending.length} សំណើជាកំពុងដឹកជញ្ជូន`), fails: [] })
  }

  const receiveTransfers = () => {
    const transit = requests.filter((r) => r.status === 'IN-TRANSIT')
    transit.forEach((r) => requestApi.update(r.id, { status: 'RECEIVED' }))
    setFeedback({ tone: 'green', text: t(`${transit.length} transfer(s) received into stock`, `${transit.length} ការផ្ទេរបានទទួល`), fails: [] })
  }

  /* ---------- render ---------- */
  const isTransferFlow = ['transfer-request', 'transfer-ship', 'transfer-receive'].includes(op.kind)

  /* ---------- Receive List: filtering + export ---------- */
  let filteredReceiveDocs = []
  if (op.kind === 'receive') {
    const q = receiveQuery.trim().toLowerCase()
    const match = (doc) => {
      switch (receiveSearchBy) {
        case 'code': return String(doc.code || doc.docNo || '').toLowerCase().includes(q)
        case 'supplier': return String(doc.supplier || '').toLowerCase().includes(q)
        case 'receiveType': return String(doc.receiveType || '').toLowerCase().includes(q)
        case 'receivedBy': return String(doc.receivedBy || '').toLowerCase().includes(q)
        default:
          return !q || (
            [doc.code, doc.docNo, doc.supplier, doc.receiveType, doc.reference, doc.receivedBy]
              .some((v) => String(v || '').toLowerCase().includes(q)) ||
            (doc.lines || []).some((l) => String(l.name || '').toLowerCase().includes(q))
          )
      }
    }
    filteredReceiveDocs = q ? history.filter(match) : history
  }

  const toggleReceiveCol = (key) => {
    const next = new Set(receiveColDraft)
    if (next.has(key)) {
      if (next.size === 1) return // never allow zero visible columns
      next.delete(key)
    } else {
      next.add(key)
    }
    setReceiveColDraft(next)
  }

  const openReceiveColModal = () => {
    setReceiveColDraft(new Set(receiveVisibleCols))
    setShowReceiveCols(true)
  }

  // Called by the full-page create form after posting — records the document
  // in the Receive List and returns to it.
  const handleReceiveCreated = (doc) => {
    if (editingDoc) {
      historyApi.update(editingDoc.id, doc)
      setEditingDoc(null)
    } else {
      historyApi.add(doc)
    }
    setShowCreatePage(false)
    setFeedback({ tone: 'green', text: t(`✓ Document ${doc.code} saved`, `✓ ឯកសារ ${doc.code} បានរក្សាទុក`), fails: [] })
  }

  const openEditReceive = (doc) => {
    setEditingDoc(doc)
    setShowCreatePage(true)
  }

  const closeCreatePage = () => {
    setShowCreatePage(false)
    setEditingDoc(null)
  }

  const exportReceiveList = () => {
    const cols = [RECEIVE_CODE_COL, ...RECEIVE_OPTIONAL_COLS.filter((c) => receiveVisibleCols.has(c.key))]
    downloadExcel(
      'b-groceries-receive-list.xlsx',
      'Receive List',
      cols.map((c) => c.label.en),
      filteredReceiveDocs.map((d) =>
        cols.map((c) => {
          const v = d[c.key]
          return typeof v === 'number' ? v : (v ?? '')
        })
      )
    )
  }

  const headers = isTransferFlow
    ? [t('Doc No', 'លេខឯកសារ'), t('From', 'ពី'), t('To', 'ទៅ'), t('Items', 'ទំនិញ'), t('Status', 'ស្ថានភាព')]
    : [t('Doc No', 'លេខឯកសារ'), t('Product', 'ផលិតផល'),
       ...(op.kind === 'adjust' ? [t('System', 'ប្រព័ន្ធ'), t('Counted', 'រាប់បាន'), t('Diff', 'ភាពខុសគ្នា')] : [t('Movement', 'ចលនা')]),
       ...(op.kind === 'receive' ? [t('Unit Cost', 'ចំណាយ/ឯកតា')] : []),
       t('Date', 'កាលបរិច្ឆេទ')]

  return (
    <SectionShell
      icon={op.icon}
      color={op.color}
      title={op.title}
      subtitle={op.subtitle}
      actions={op.kind === 'receive'
        ? <PrimaryButton onClick={() => { setEditingDoc(null); setShowCreatePage(true) }}>{editingDoc ? t('Editing…', 'កំពុងកែសម្រួល…') : t('+ Create', '+ បង្កើត')}</PrimaryButton>
        : <PrimaryButton onClick={openForm}>{t('+ New Document', '+ ឯកសារថ្មី')}</PrimaryButton>}
    >
      {op.kind === 'receive' && showCreatePage && (
        <ReceiveProductsCreate
          products={products}
          editingDoc={editingDoc}
          onPosted={handleReceiveCreated}
          onClose={closeCreatePage}
        />
      )}
      {feedback && (
        <div className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
          feedback.tone === 'green' ? 'border-green-500/40 bg-green-500/10 text-green-300'
            : feedback.tone === 'blue' ? 'border-sky-500/40 bg-sky-500/10 text-sky-300'
              : feedback.tone === 'red' ? 'border-red-500/40 bg-red-500/10 text-red-300'
                : 'border-orange-500/40 bg-orange-500/10'
        }`} style={feedback.tone === 'orange' ? { color: ORANGE } : undefined}>
          <p>{feedback.text}</p>
          {(feedback.fails || []).map((f, i) => <p key={i} className="text-xs text-slate-400">• {f}</p>)}
        </div>
      )}

      {/* transfer pages show the shared workflow ledger */}
      {isTransferFlow && (
        <>
          <DataTable
            headers={headers}
            rows={requests.map((r) => ({
              id: r.id,
              cells: [
                <span key="d" className="font-mono text-xs text-slate-300">{r.docNo}</span>,
                <span key="f" className="text-slate-200">{LOCATIONS.find((l) => l.v === r.fromLoc)?.[lang]}</span>,
                <span key="t2" className="text-slate-200">{LOCATIONS.find((l) => l.v === r.toLoc)?.[lang]}</span>,
                <span key="i" className="text-slate-300">{(r.lines || []).map((l) => `${l.name} ×${l.qty}`).join(', ')}</span>,
                <Pill key="s" tone={r.status === 'RECEIVED' ? 'green' : r.status === 'IN-TRANSIT' ? 'blue' : 'orange'}>{r.status}</Pill>,
              ],
            }))}
            emptyText={{ en: 'No transfer documents yet.', kh: 'មិនទាន់មានឯកសារផ្ទេរទេ។' }}
            emptyIcon={op.icon}
          />
          {op.kind === 'transfer-ship' && (
            <div className="flex justify-end">
              <PrimaryButton onClick={shipRequests} disabled={!requests.some((r) => r.status === 'PENDING')}>
                {t('Mark All Pending as In-Transit', 'ដាក់សំណើទាំងអស់ជាកំពុងដឹក')}
              </PrimaryButton>
            </div>
          )}
          {op.kind === 'transfer-receive' && (
            <div className="flex justify-end">
              <PrimaryButton onClick={receiveTransfers} disabled={!requests.some((r) => r.status === 'IN-TRANSIT')}>
                {t('Receive All In-Transit', 'ទទួលទាំងអស់')}
              </PrimaryButton>
            </div>
          )}
        </>
      )}

      {/* receive shows the searchable, column-configurable Receive List */}
      {op.kind === 'receive' && (
        <section className="overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/80 shadow-xl shadow-black/20">
          {/* Filter bar — same layout as Suppliers Group */}
          <div className="flex flex-col gap-3 border-b border-slate-700/60 p-4 lg:flex-row lg:items-center">
            {/* Search By dropdown */}
            <select
              value={receiveSearchBy}
              onChange={(e) => setReceiveSearchBy(e.target.value)}
              aria-label={t('Search By', 'ស្វែងរកដោយ')}
              className={`${selectCls} w-full sm:w-auto sm:min-w-[170px]`}
            >
              <option value="any">{t('Search By', 'ស្វែងរកដោយ')}: {t('Any', 'ណាមួយ')}</option>
              <option value="code">{t('Search By', 'ស្វែងរកដោយ')}: {t('Code', 'កូដ')}</option>
              <option value="supplier">{t('Search By', 'ស្វែងរកដោយ')}: {t('Supplier', 'អ្នកផ្គត់ផ្គង់')}</option>
              <option value="receiveType">{t('Search By', 'ស្វែងរកដោយ')}: {t('Receive Type', 'ប្រភេទនៃការទទួល')}</option>
              <option value="receivedBy">{t('Search By', 'ស្វែងរកដោយ')}: {t('Received By', 'អ្នកទទួល')}</option>
            </select>

            {/* Search input */}
            <div className="relative min-w-0 flex-1">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"><SearchIcon /></span>
              <input
                type="text"
                value={receiveQuery}
                onChange={(e) => setReceiveQuery(e.target.value)}
                placeholder={t('Type to search receive list…', 'បញ្ចូលដើម្បីស្វែងរកបញ្ជីទទួល…')}
                className="w-full rounded-lg border border-slate-700/70 bg-slate-950/60 py-2.5 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-green-400 focus:bg-slate-950 focus:ring-4 focus:ring-green-500/10"
              />
            </div>

            {/* Export + Choose Column triggers */}
            <button type="button" onClick={exportReceiveList} title={t('Export File Excel', 'នាំចេញ Excel')} className={`${ghostBtnCls}`}>
              <DownloadIcon /> <span className="hidden xl:inline">{t('Export File Excel', 'នាំចេញ Excel')}</span>
            </button>
            <button type="button" onClick={openReceiveColModal} title={t('Choose Column', 'ជ្រើសរើសជួរឈរ')} className={`${ghostBtnCls}`}>
              <ColumnsIcon /> <span className="hidden xl:inline">{t('Choose Column', 'ជ្រើសរើសជួរឈរ')}</span>
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-700/60 bg-slate-800/40 text-xs font-bold uppercase tracking-wide text-slate-500">
                  <th className="whitespace-nowrap px-4 py-3">{t('Code', 'កូដ')}</th>
                  {RECEIVE_OPTIONAL_COLS.filter((col) => receiveVisibleCols.has(col.key)).map((col) => (
                    <th key={col.key} className="whitespace-nowrap px-4 py-3">{col.label[lang]}</th>
                  ))}
                  <th className="w-24 px-4 py-3">{t('Action', 'សកម្មភាព')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredReceiveDocs.length === 0 ? (
                  <tr>
                    <td colSpan={1 + receiveVisibleCols.size} className="px-4 py-14 text-center">
                      <span className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-800"><SearchIcon /></span>
                      <p className="text-sm text-slate-400">{history.length === 0 ? t('No documents posted yet.', 'មិនទាន់មានឯកសារកត់ត្រាទេ។') : t('No documents match your filters.', 'រកមិនឃើញឯកសារតាមតម្រូវការ។')}</p>
                    </td>
                  </tr>
                ) : (
                  filteredReceiveDocs.map((d) => (
                    <tr key={d.id} className="border-b border-slate-800/60 transition last:border-0 hover:bg-slate-800/40">
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className="font-mono font-semibold text-green-300">{d.code}</span>
                      </td>
                      {RECEIVE_OPTIONAL_COLS.filter((col) => receiveVisibleCols.has(col.key)).map((col) => {
                        const renderCell = (key) => {
                          switch (key) {
                            case 'date': return <span className="text-slate-200">{d.date || '—'}</span>
                            case 'supplier': return <span className="text-slate-200">{d.supplier || '—'}</span>
                            case 'totalCost': return <span className="text-slate-200">${Number(d.totalCost || 0).toFixed(2)}</span>
                            case 'receiveType': return <span className="text-slate-200">{d.receiveType || '—'}</span>
                            case 'reference': return <span className="text-slate-200">{d.reference || '—'}</span>
                            case 'receivedBy': return <span className="text-slate-200">{d.receivedBy || '—'}</span>
                            case 'status': return <Pill tone="green">{d.status || t('Received', 'បានទទួល')}</Pill>
                            default: return null
                          }
                        }
                        return <td key={col.key} className="whitespace-nowrap px-4 py-3">{renderCell(col.key)}</td>
                      })}
                      <td className="px-4 py-3">
                        <span className="flex items-center justify-end gap-2">
                          <GhostButton onClick={() => openEditReceive(d)}>{t('Edit', 'កែ')}</GhostButton>
                          <button
                            type="button"
                            onClick={() => { if (window.confirm(t('Delete this document?', 'លុបឯកសារនេះ?'))) historyApi.remove(d.id) }}
                            className="transition hover:scale-110"
                            style={{ color: ORANGE }}
                            aria-label={t('Delete', 'លុប')}
                            title={t('Delete', 'លុប')}
                          >
                            <TrashIcon />
                          </button>
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* issue/adjust keep their per-line posting history */}
      {op.kind !== 'receive' && !isTransferFlow && (
        <DataTable
          headers={headers}
          rows={history.map((h) => ({
            id: h.id,
            cells: [
              <span key="d" className="font-mono text-xs text-slate-300">{h.docNo}</span>,
              <span key="p" className="text-slate-200">{h.name || h.productId}</span>,
              op.kind === 'adjust' ? (
                <span key="m" className="flex items-center gap-3">
                  <span className="text-slate-400">{Number(h.before)}</span>
                  <span>→</span>
                  <span className="text-slate-200">{Number(h.after)}</span>
                  <Pill tone={(h.diff ?? 0) >= 0 ? 'green' : 'red'}>{(h.diff ?? 0) >= 0 ? `+${h.diff}` : h.diff}</Pill>
                </span>
              ) : (
                <Pill key="m" tone={op.kind === 'receive' ? 'green' : 'orange'}>
                  {op.kind === 'receive' ? `+${h.qty}` : `−${h.qty}`}
                </Pill>
              ),
              ...(op.kind === 'receive' ? [<span key="c" className="text-slate-300">${h.unitCost ?? '—'}</span>] : []),
              <span key="dt" className="text-xs text-slate-500">{new Date(h.createdAt).toLocaleDateString()}</span>,
            ],
          }))}
          emptyText={{ en: 'No documents posted yet.', kh: 'មិនទាន់មានឯកសារកត់ត្រាទេ។' }}
          emptyIcon={op.icon}
        />
      )}

      {/* ---------- New Document modal ---------- */}
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={`${op.title[lang]} — ${docNo}`} wide>
        {op.kind === 'transfer-request' && (
          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label={t('From Location', 'ទីតាំងចេញ')}>
              <SelectInput value={fromLoc} onChange={(e) => setFromLoc(e.target.value)}>
                {LOCATIONS.map((l) => <option key={l.v} value={l.v}>{l[lang]}</option>)}
              </SelectInput>
            </Field>
            <Field label={t('To Location', 'ទីតាំងទៅ')}>
              <SelectInput value={toLoc} onChange={(e) => setToLoc(e.target.value)}>
                {LOCATIONS.map((l) => <option key={l.v} value={l.v}>{l[lang]}</option>)}
              </SelectInput>
            </Field>
          </div>
        )}

        {/* receive document metadata */}
        {op.kind === 'receive' && (
          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label={t('Code', 'កូដ')}>
              <TextInput value={docNo} readOnly className="cursor-not-allowed opacity-70" />
            </Field>
            <Field label={t('Date', 'កាលបរិច្ឆេទ')} required>
              <TextInput type="date" value={receiveDate} onChange={(e) => setReceiveDate(e.target.value)} />
            </Field>
            <Field label={t('Supplier', 'អ្នកផ្គត់ផ្គង់')}>
              <TextInput value={supplier} onChange={(e) => setSupplier(e.target.value)} placeholder={t('Supplier name…', 'ឈ្មោះអ្នកផ្គត់ផ្គង់…')} />
            </Field>
            <Field label={t('Receive Type', 'ប្រភេទនៃការទទួល')}>
              <SelectInput value={receiveType} onChange={(e) => setReceiveType(e.target.value)}>
                <option value="Purchase Order">{t('Purchase Order', 'លក់ដុំ')}</option>
                <option value="Return">{t('Return', 'ត្រឡប់')}</option>
                <option value="Donation">{t('Donation', 'ការបរិច្ចាគ')}</option>
                <option value="Other">{t('Other', 'ផ្សេងៗ')}</option>
              </SelectInput>
            </Field>
            <Field label={t('Reference', 'យោង')}>
              <TextInput value={reference} onChange={(e) => setReference(e.target.value)} placeholder={t('PO / invoice no…', 'លេខ PO / វិក្កយបត្រ…')} />
            </Field>
            <Field label={t('Received By', 'អ្នកទទួល')}>
              <TextInput value={receivedBy} onChange={(e) => setReceivedBy(e.target.value)} placeholder={t('Person receiving…', 'អ្នកទទួល…')} />
            </Field>
          </div>
        )}

        {/* line entry */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1fr_1fr_auto]">
          <Field label={t('Product', 'ផលិតផល')} required>
            <SelectInput value={productId} onChange={(e) => setProductId(e.target.value)}>
              <option value="">{t('Select product…', 'ជ្រើសរើសផលិតផល…')}</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {(typeof p.name === 'object' ? p.name?.en : p.name) || `#${p.id}`} — on hand: {Number(p.onHand) || 0}
                </option>
              ))}
            </SelectInput>
          </Field>
          <Field label={op.kind === 'adjust' ? t('Counted Qty', 'រាប់បាន') : t('Quantity', 'បរិមាណ')} required>
            <TextInput
              type="number" min="0"
              value={op.kind === 'adjust' ? counted : qty}
              onChange={(e) => (op.kind === 'adjust' ? setCounted(e.target.value) : setQty(e.target.value))}
            />
          </Field>
          {op.kind === 'receive' && (
            <Field label={t('Unit Cost ($)', 'ចំណាយ/ឯកតា ($)')}>
              <TextInput type="number" min="0" step="0.01" value={unitCost} onChange={(e) => setUnitCost(e.target.value)} />
            </Field>
          )}
          <div className="flex items-end">
            <GhostButton onClick={addLine}>{t('+ Add Line', '+ បន្ថែម')}</GhostButton>
          </div>
        </div>

        {lines.length > 0 && (
          <div className="mt-4 rounded-xl border border-slate-700/60 bg-slate-950/40 p-3">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">{t('Document Lines', 'ជួរដេកឯកសារ')}</p>
            <ul className="space-y-1.5">
              {lines.map((l, i) => (
                <li key={i} className="flex items-center justify-between gap-3 text-sm text-slate-300">
                  <span>{productName(l.productId)} × {l.counted ?? l.qty}{op.kind === 'receive' ? ` @ $${l.unitCost}` : ''}</span>
                  <button type="button" onClick={() => setLines(lines.filter((_, j) => j !== i))} style={{ color: ORANGE }} aria-label="Remove">
                    <TrashIcon />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {op.kind === 'transfer-request' && (
          <div className="mt-4">
            <Field label={t('Note', 'ចំណាំ')}>
              <TextInput value={note} onChange={(e) => setNote(e.target.value)} placeholder={t('Reason for the request…', 'មូលហេតុនៃសំណើ…')} />
            </Field>
          </div>
        )}

        <div className="mt-5 flex justify-end gap-3">
          <GhostButton onClick={() => setFormOpen(false)}>{t('Cancel', 'បោះបង់')}</GhostButton>
          {op.kind === 'transfer-request' ? (
            <PrimaryButton onClick={createTransferRequest} disabled={!lines.length || saving || fromLoc === toLoc}>
              {t('Create Request', 'បង្កើតសំណើ')}
            </PrimaryButton>
          ) : (
            <PrimaryButton onClick={postDocument} disabled={!lines.length || saving}>
              {saving ? t('Posting…', 'កំពុងកត់ត្រា…') : t('Post Document', 'កត់ត្រាឯកសារ')}
            </PrimaryButton>
          )}
        </div>
      </Modal>

      {/* ---------- Receive List: Choose Column modal ---------- */}
      {showReceiveCols && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setShowReceiveCols(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t('Choose Column', 'ជ្រើសរើសជួរឈរ')}
            className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/40"
            onClick={(e) => e.stopPropagation()}
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-slate-700/60 px-5 py-4">
              <h3 className="text-base font-extrabold text-white">{t('Choose Column', 'ជ្រើសរើសជួរឈរ')}</h3>
              <button
                type="button"
                onClick={() => setShowReceiveCols(false)}
                aria-label={t('Cancel', 'បោះបង់')}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-800 hover:text-white"
              >
                <XSmallIcon />
              </button>
            </div>

            {/* checkbox grid — the entity columns (Code is always shown) */}
            <div className="grid grid-cols-1 gap-x-6 gap-y-1 p-5 sm:grid-cols-2">
              {RECEIVE_OPTIONAL_COLS.map((col) => {
                const checked = receiveColDraft.has(col.key)
                return (
                  <label
                    key={col.key}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition ${checked ? 'text-white' : 'text-slate-400'} hover:bg-slate-800`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleReceiveCol(col.key)}
                      className="h-4 w-4 cursor-pointer rounded accent-green-500"
                    />
                    {col.label[lang]}
                  </label>
                )
              })}
            </div>

            {/* footer actions */}
            <div className="flex items-center justify-between gap-3 border-t border-slate-700/60 px-5 py-4">
              <button
                type="button"
                onClick={() => setReceiveColDraft(new Set(RECEIVE_OPTIONAL_COLS.map((c) => c.key)))}
                title={t('Reset to Normal', 'កំណត់ឡើងវិញតាមដើម')}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition hover:bg-slate-800"
                style={{ color: ORANGE }}
              >
                <ResetIcon /> {t('Reset to Normal', 'កំណត់ឡើងវិញតាមដើម')}
              </button>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowReceiveCols(false)}
                  className="rounded-lg border border-slate-700 px-5 py-2 text-sm font-bold text-slate-300 transition hover:bg-slate-800"
                >
                  {t('Cancel', 'បោះបង់')}
                </button>
                <button
                  type="button"
                  onClick={() => { setReceiveVisibleCols(new Set(receiveColDraft)); setShowReceiveCols(false) }}
                  className="rounded-lg bg-green-500 px-5 py-2 text-sm font-black text-slate-950 shadow-md shadow-green-500/20 transition hover:bg-green-400"
                >
                  {t('Apply', 'អនុវត្ត')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </SectionShell>
  )
}

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.5" y2="16.5" />
  </svg>
)

const DownloadIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

const ColumnsIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="9" y1="3" x2="9" y2="21" />
    <line x1="15" y1="3" x2="15" y2="21" />
  </svg>
)

const ResetIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M3 12a9 9 0 1 0 2.6-6.3L3 8" />
    <polyline points="3 3 3 8 8 8" />
  </svg>
)

const XSmallIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
)

export default TransactionSection
