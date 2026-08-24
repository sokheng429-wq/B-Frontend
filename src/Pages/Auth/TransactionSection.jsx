import { useEffect, useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { adminProductAPI } from '../../api/api'
import { useCollection, nextAverageCost, LOCATIONS } from './stockStore'
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
  const productName = (idOrName) => {
    if (typeof idOrName === 'string' && !/^\d+$/.test(idOrName)) return idOrName
    const p = products.find((x) => String(x.id) === String(idOrName))
    return p ? (typeof p.name === 'object' ? p.name?.en : p.name) || `#${p.id}` : `#${idOrName}`
  }

  /* ---------- document line handling ---------- */
  const openForm = () => {
    setLines([])
    setFeedback(null)
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
      // write the ledger entries shown in the history table
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
      actions={<PrimaryButton onClick={openForm}>{t('+ New Document', '+ ឯកសារថ្មី')}</PrimaryButton>}
    >
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

      {/* receive/issue/adjust show their posting history */}
      {!isTransferFlow && (
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
    </SectionShell>
  )
}

const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
)

export default TransactionSection
