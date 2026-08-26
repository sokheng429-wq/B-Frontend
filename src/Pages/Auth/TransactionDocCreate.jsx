import { useEffect, useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { adminProductAPI, adminUnitAPI } from '../../api/api'
import { LOCATIONS } from './stockStore'
import { Field, TextInput, SelectInput, PrimaryButton, GhostButton, Pill } from './stockUI'

const ORANGE = '#FF9900'

// Full-page Stock document form (opened by "Create" on the Issue Products /
// Adjustment Products / Request Transfer lists). Layout mirrors
// ReceiveProductsCreate: General Information card on top, Product card below
// with live search and a line table, then a save confirmation styled like a
// print preview.

const CONFIG = {
  'issue-products': {
    kind: 'issue',
    codePrefix: 'GI',
    types: ['Internal Use', 'Write-off', 'Sample', 'Damaged Goods', 'Other'],
    typeLabel: { en: 'Issue Type', kh: 'ប្រភេទនៃការដកចេញ' },
    byLabel: { en: 'Issued By', kh: 'អ្នកដកចេញ' },
    dateLabel: { en: 'Issue Date', kh: 'កាលបរិច្ឆេទដកចេញ' },
    sheetTitle: { en: 'STOCK ISSUE NOTE', kh: 'បញ្ជាដកស្តុក' },
    noteOptions: [
      { value: '', en: '—', kh: '—' },
      { value: 'internal-use', en: 'Internal use', kh: 'ប្រើប្រាស់ខាងក្នុង' },
      { value: 'write-off', en: 'Write-off', kh: 'កំណាត់ចោល' },
      { value: 'sample', en: 'Sample for customer', kh: 'គំរូអតិថិជន' },
      { value: 'damaged', en: 'Damaged goods', kh: 'ទំនិញខូច' },
    ],
  },
  'adjustment-products': {
    kind: 'adjust',
    codePrefix: 'ADJ',
    types: ['Stock Count', 'Breakage', 'Theft / Loss', 'Correction', 'Other'],
    typeLabel: { en: 'Adjustment Type', kh: 'ប្រភេទនៃការកែតម្រូវ' },
    byLabel: { en: 'Adjusted By', kh: 'អ្នកកែតម្រូវ' },
    dateLabel: { en: 'Adjustment Date', kh: 'កាលបរិច្ឆេទកែតម្រូវ' },
    sheetTitle: { en: 'STOCK ADJUSTMENT NOTE', kh: 'បញ្ជាកែតម្រូវស្តុក' },
    noteOptions: [
      { value: '', en: '—', kh: '—' },
      { value: 'stock-count', en: 'Physical stock count', kh: 'រាប់ស្តុកជាក់ស្តែង' },
      { value: 'breakage', en: 'Breakage', kh: 'ការខូចខាត' },
      { value: 'theft-loss', en: 'Theft or loss', kh: 'ការលួចឬបាត់បង់' },
      { value: 'correction', en: 'Data correction', kh: 'កែតម្រូវទិន្នន័យ' },
    ],
  },
  'request-transfer': {
    kind: 'transfer-request',
    codePrefix: 'TR',
    types: [],
    typeLabel: null,
    dateLabel: { en: 'Request Date', kh: 'កាលបរិច្ឆេទស្នើសុំ' },
    sheetTitle: { en: 'TRANSFER REQUEST', kh: 'សំណើផ្ទេរទំនិញ' },
    noteOptions: [
      { value: '', en: '—', kh: '—' },
      { value: 'restock', en: 'Restock branch', kh: 'បំពេញស្តុកសាខា' },
      { value: 'shortage', en: 'Cover shortage', kh: 'ដោះស្រាយស្តុកខ្វះ' },
      { value: 'rebalance', en: 'Stock rebalancing', kh: 'តម្រឹមស្តុករវាងហាង' },
    ],
  },
}

export const TransactionDocCreate = ({ sectionKey, products, onCreated, onClose }) => {
  const { lang } = useLanguage()
  const t = (en, kh) => (lang === 'en' ? en : kh)
  const cfg = CONFIG[sectionKey]

  /* ---------- general information ---------- */
  const [units, setUnits] = useState([])
  // creating generates a fresh document code (no editing for these documents)
  const [code] = useState(() => `${cfg.codePrefix}-${String(Date.now()).slice(-6)}`)
  const [docType, setDocType] = useState(cfg.types[0] || '')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [reference, setReference] = useState('')
  const [issuedBy, setIssuedBy] = useState('')
  const [outlet, setOutlet] = useState('main')
  const [fromLoc, setFromLoc] = useState('main')
  const [toLoc, setToLoc] = useState('branch-a')
  const [noteType, setNoteType] = useState('')
  const [noteText, setNoteText] = useState('')

  /* ---------- product lines ---------- */
  const [lines, setLines] = useState([])
  const [productQuery, setProductQuery] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [postedDoc, setPostedDoc] = useState(null) // set after save → print-preview message

  useEffect(() => {
    adminUnitAPI.getAll().then((res) => setUnits(Array.isArray(res?.data) ? res.data : [])).catch(() => {})
  }, [])

  const productName = (p) => (typeof p.name === 'object' ? p.name?.en : p.name) || `#${p.id}`
  // show the unit the way it was created — description first (e.g. "Kilogram (kg)")
  const uomLabel = (u) => u?.description || u?.code || ''
  const uomValue = (u) => u?.code || u?.description || String(u?.id ?? '')
  const isAdjust = cfg.kind === 'adjust'

  /* ---------- product search & add ---------- */
  const matches = (() => {
    const q = productQuery.trim().toLowerCase()
    if (!q) return []
    return products.filter((p) =>
      [p.code, p.barCode, productName(p)].some((v) => String(v || '').toLowerCase().includes(q))
    ).slice(0, 6)
  })()

  const addProduct = (p) => {
    if (lines.some((l) => String(l.productId) === String(p.id))) {
      setError(t('Product is already added.', 'ផលិតផលបានបន្ថែមរួចហើយ។'))
      return
    }
    setError(null)
    setLines([...lines, {
      productId: p.id,
      code: p.code || '',
      barCode: p.barCode || '',
      name: productName(p),
      imageUrl: p.imageUrl || '',
      onHand: Number(p.onHand) || 0,
      // adjust pre-fills the counted quantity with the system amount
      qty: '',
      counted: isAdjust ? String(Number(p.onHand) || 0) : '',
      // unit cost defaults to the product's moving average cost
      cost: String(Number(p.averageCost ?? 0).toFixed(2)),
      uom: p.uom || '',
      raw: p,
    }])
    setProductQuery('')
  }

  const patchLine = (i, patch) =>
    setLines(lines.map((l, j) => (j === i ? { ...l, ...patch } : l)))

  const removeLine = (i) => setLines(lines.filter((_, j) => j !== i))

  const lineDiff = (l) => (Number(l.counted) || 0) - (Number(l.onHand) || 0)
  // line cost = qty × unit cost for issues; counted-value change for adjustments
  const lineTotal = (l) => isAdjust
    ? Math.abs(lineDiff(l)) * (Number(l.cost) || 0)
    : (Number(l.qty) || 0) * (Number(l.cost) || 0)
  const grandTotal = lines.reduce((s, l) => s + lineTotal(l), 0)
  const totalItems = lines.reduce((s, l) => s + (isAdjust ? 1 : (Number(l.qty) || 0)), 0)
  const totalDiff = lines.reduce((s, l) => s + (Number(lineDiff(l)) || 0), 0)

  /* ---------- save ---------- */
  const save = async () => {
    if (!lines.length) {
      setError(t('Add at least one product.', 'សូមបន្ថែមផលិតផលយ៉ាងតិចមួយ។'))
      return
    }
    if (cfg.kind === 'transfer-request' && fromLoc === toLoc) {
      setError(t('From and To locations must be different.', 'ទីតាំងចេញនិងទីតាំងទៅត្រូវខុសគ្នា។'))
      return
    }
    const badLine = lines.find((l) => !(isAdjust ? Number(l.counted) >= 0 : Number(l.qty) > 0))
    if (badLine) {
      setError(isAdjust
        ? t(`Counted quantity required for ${badLine.name}.`, `ត្រូវការបរិមាណរាប់បានសម្រាប់ ${badLine.name}។`)
        : t(`Quantity required for ${badLine.name}.`, `ត្រូវការបរិមាណសម្រាប់ ${badLine.name}។`))
      return
    }

    const note = NOTE_TEXT(noteType, noteText, lang, cfg)

    // transfer request — workflow-only document, no backend stock movement yet
    if (cfg.kind === 'transfer-request') {
      onCreated({
        kind: cfg.kind,
        code,
        date,
        fromLoc,
        toLoc,
        outlet,
        note,
        lines: lines.map((l) => ({ productId: l.productId, name: l.name, qty: Number(l.qty), uom: l.uom })),
      })
      setPostedDoc({ fails: [], totalItems })
      return
    }

    // issue / adjust — refresh products first so we post against CURRENT
    // on-hand values, not stale ones from page load
    setSaving(true)
    setError(null)
    let fresh = products
    try {
      const res = await adminProductAPI.getAll()
      if (Array.isArray(res?.data)) fresh = res.data
    } catch { /* fall back to the list we already have */ }

    const posted = []
    const fails = []
    for (const l of lines) {
      try {
        const p = fresh.find((x) => String(x.id) === String(l.productId))
        if (!p) throw new Error(t('product not found', 'រកមិនឃើញផលិតផល'))
        const onHand = Number(p.onHand) || 0
        const before = onHand
        let after
        if (cfg.kind === 'issue') {
          const qty = Number(l.qty)
          if (qty > onHand) throw new Error(t('insufficient stock', 'ស្តុកមិនគ្រប់គ្រាន់'))
          after = before - qty
        } else {
          after = Number(l.counted) || 0
        }
        await adminProductAPI.update(p.id, { ...p, onHand: after })
        posted.push({
          productId: l.productId, name: l.name, qty: isAdjust ? null : Number(l.qty),
          counted: isAdjust ? Number(l.counted) : null, before, after, diff: after - before,
        })
      } catch (err) {
        fails.push(`${l.name}: ${err.message}`)
      }
    }
    setSaving(false)
    if (!posted.length) {
      setError(t('Nothing was saved.', 'មិនមានអ្វីបានរក្សាទុកទេ។'))
      return
    }
    onCreated({
      kind: cfg.kind,
      code,
      date,
      type: docType,
      outlet,
      reference,
      issuedBy,
      totalCost: Math.round(grandTotal * 100) / 100,
      location: outlet,
      note,
      posted,
    })
    setPostedDoc({ fails, totalItems: posted.reduce((s, l) => s + (l.qty || 1), 0) })
  }

  return (
    <div className="space-y-5">
      {/* ---------- general information ---------- */}
      <section className="rounded-2xl border border-slate-700/60 bg-slate-900/80 shadow-xl shadow-black/20">
        <h2 className="border-b border-slate-700/60 px-5 py-4 text-sm font-extrabold uppercase tracking-wide text-white">
          {t('General Information', 'ព័ត៌មានទូទៅ')}
        </h2>
        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
          {cfg.kind === 'transfer-request' ? (
            <>
              <Field label={t('From Location', 'ទីតាំងចេញ')} required>
                <SelectInput value={fromLoc} onChange={(e) => setFromLoc(e.target.value)}>
                  {LOCATIONS.map((l) => <option key={l.key} value={l.key}>{l[lang]}</option>)}
                </SelectInput>
              </Field>
              <Field label={t('To Location', 'ទីតាំងទៅ')} required>
                <SelectInput value={toLoc} onChange={(e) => setToLoc(e.target.value)}>
                  {LOCATIONS.map((l) => <option key={l.key} value={l.key}>{l[lang]}</option>)}
                </SelectInput>
              </Field>
            </>
          ) : (
            <>
              <Field label={t('Outlet', 'ហាង')}>
                <SelectInput value={outlet} onChange={(e) => setOutlet(e.target.value)}>
                  {LOCATIONS.map((l) => <option key={l.key} value={l.key}>{l[lang]}</option>)}
                </SelectInput>
              </Field>
              <Field label={t(cfg.typeLabel.en, cfg.typeLabel.kh)}>
                <SelectInput value={docType} onChange={(e) => setDocType(e.target.value)}>
                  {cfg.types.map((tp) => <option key={tp} value={tp}>{tp}</option>)}
                </SelectInput>
              </Field>
            </>
          )}

          <Field label={t(cfg.dateLabel.en, cfg.dateLabel.kh)} required>
            <TextInput type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>

          <Field label={t('Reference', 'យោង')}>
            <TextInput value={reference} onChange={(e) => setReference(e.target.value)} placeholder={t('Ref / document no…', 'លេខយោង / ឯកសារ…')} />
          </Field>

          <Field label={t(cfg.byLabel.en, cfg.byLabel.kh)}>
            <TextInput value={issuedBy} onChange={(e) => setIssuedBy(e.target.value)} placeholder={t('Person in charge…', 'អ្នកទទួលបន្ទុក…')} />
          </Field>

          {/* Code — auto generated */}
          <Field label={t('Code', 'កូដ')}>
            <div className="flex items-center gap-2">
              <TextInput value={code} readOnly className="cursor-not-allowed opacity-70" />
              <Pill tone="green">AUTO</Pill>
            </div>
          </Field>

          <Field label={cfg.kind === 'transfer-request'
            ? t('Request Note', 'ចំណាំសំណើ')
            : t(`${cfg.kind === 'issue' ? 'Issue' : 'Adjustment'} Note`, `${cfg.kind === 'issue' ? 'ចំណាំការដកចេញ' : 'ចំណាំការកែតម្រូវ'}`)}>
            <SelectInput value={noteType} onChange={(e) => setNoteType(e.target.value)}>
              {cfg.noteOptions.map((n) => <option key={n.value} value={n.value}>{n[lang]}</option>)}
            </SelectInput>
          </Field>

          {noteType && (
            <Field label={t('Note Detail', 'ពណ៌នាចំណាំ')}>
              <TextInput value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder={t('Details…', 'លម្អិត…')} />
            </Field>
          )}
        </div>
      </section>

      {/* ---------- product side ---------- */}
      <section className="overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/80 shadow-xl shadow-black/20">
        <h2 className="border-b border-slate-700/60 px-5 py-4 text-sm font-extrabold uppercase tracking-wide text-white">
          {t('Product', 'ផលិតផល')}
        </h2>

        {/* product search — only products not yet added appear */}
        <div className="relative border-b border-slate-700/60 p-4">
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"><SearchIcon /></span>
            <input
              type="text"
              value={productQuery}
              onChange={(e) => setProductQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && matches.length) addProduct(matches[0]) }}
              placeholder={t('Search product by code / barcode / description…', 'ស្វែងរកផលិតផលតាមកូដ / បាកូដ / ពណ៌នា…')}
              className="w-full rounded-lg border border-slate-700/70 bg-slate-950/60 py-2.5 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-green-400 focus:bg-slate-950 focus:ring-4 focus:ring-green-500/10"
            />
          </div>
          {matches.length > 0 && (
            <ul className="absolute z-30 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/50">
              {matches.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => addProduct(p)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-200 transition hover:bg-slate-800"
                  >
                    <span className="font-mono text-xs text-green-300">{p.code || `#${p.id}`}</span>
                    <span className="truncate">{productName(p)}</span>
                    <span className="ml-auto text-xs text-slate-500">{t('on hand', 'នៅលើដៃ')}: {Number(p.onHand) || 0}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {error && (
            <p className="mt-2 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300">{error}</p>
          )}
        </div>

        {/* added-product table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-700/60 bg-slate-800/40 text-xs font-bold uppercase tracking-wide text-slate-500">
                <th className="whitespace-nowrap px-4 py-3">{t('Image', 'រូបភាព')}</th>
                <th className="whitespace-nowrap px-4 py-3">{t('Code / Barcode', 'កូដ / បាកូដ')}</th>
                <th className="whitespace-nowrap px-4 py-3">{t('Description', 'ពណ៌នា')}</th>
                <th className="whitespace-nowrap px-4 py-3 text-right">{t('On Hand', 'មានក្នុងស្តុក')}</th>
                {isAdjust ? (
                  <>
                    <th className="whitespace-nowrap px-4 py-3">{t('Counted Qty', 'បរិមាណរាប់បាន')}</th>
                    <th className="whitespace-nowrap px-4 py-3 text-right">{t('Diff', 'ភាពខុសគ្នា')}</th>
                  </>
                ) : (
                  <>
                    <th className="whitespace-nowrap px-4 py-3">{t('QTY', 'បរិមាណ')}</th>
                    <th className="whitespace-nowrap px-4 py-3">{t('Cost', 'ចំណាយ')}</th>
                    <th className="whitespace-nowrap px-4 py-3">{t('UOM', 'ឯកតា')}</th>
                  </>
                )}
                <th className="w-16 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {lines.length === 0 ? (
                <tr>
                  <td colSpan={isAdjust ? 7 : 7} className="px-4 py-14 text-center">
                    <span className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-800"><SearchIcon /></span>
                    <p className="text-sm text-slate-400">{t('No products added yet — search above to add.', 'មិនទាន់បានបន្ថែមផលិតផល — ស្វែងរកខាងលើដើម្បីបន្ថែម។')}</p>
                  </td>
                </tr>
              ) : (
                lines.map((l, i) => (
                  <tr key={l.productId} className="border-b border-slate-800/60 transition last:border-0 hover:bg-slate-800/40">
                    <td className="px-4 py-3">
                      {l.imageUrl
                        ? <img src={l.imageUrl} alt="" className="h-10 w-10 rounded-lg object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                        : <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-slate-600">📦</span>}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <p className="font-mono text-xs font-semibold text-green-300">{l.code || `#${l.productId}`}</p>
                      <p className="font-mono text-[11px] text-slate-500">{l.barCode || '—'}</p>
                    </td>
                    <td className="px-4 py-3"><span className="text-slate-200">{l.name}</span></td>
                    <td className="px-4 py-3 text-right"><span className="text-slate-400">{Number(l.onHand).toFixed(2)}</span></td>
                    {isAdjust ? (
                      <>
                        <td className="px-4 py-3">
                          <input
                            type="number" min="0"
                            value={l.counted}
                            onChange={(e) => patchLine(i, { counted: e.target.value })}
                            placeholder="0"
                            className="w-24 rounded-lg border border-slate-700/70 bg-slate-950/60 px-2 py-1.5 text-sm text-white outline-none focus:border-green-400 focus:ring-4 focus:ring-green-500/10"
                          />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Pill tone={lineDiff(l) >= 0 ? 'green' : 'red'}>
                            {lineDiff(l) >= 0 ? `+${lineDiff(l)}` : lineDiff(l)}
                          </Pill>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3">
                          <input
                            type="number" min="0"
                            value={l.qty}
                            onChange={(e) => patchLine(i, { qty: e.target.value })}
                            placeholder="0"
                            className="w-24 rounded-lg border border-slate-700/70 bg-slate-950/60 px-2 py-1.5 text-sm text-white outline-none focus:border-green-400 focus:ring-4 focus:ring-green-500/10"
                          />
                        </td>
                        <td className="px-4 py-3">
                          {/* defaults to the product's average cost, editable like Receive */}
                          <input
                            type="number" min="0" step="0.01"
                            value={l.cost}
                            onChange={(e) => patchLine(i, { cost: e.target.value })}
                            title={t('Unit cost (defaults to average cost)', 'ចំណាយ/ឯកតា (លំនាំដើមជាចំណាយមធ្យម)')}
                            className="w-24 rounded-lg border border-slate-700/70 bg-slate-950/60 px-2 py-1.5 text-sm text-white outline-none focus:border-green-400 focus:ring-4 focus:ring-green-500/10"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={l.uom}
                            onChange={(e) => patchLine(i, { uom: e.target.value })}
                            className="rounded-lg border border-slate-700/70 bg-slate-950/60 px-2 py-1.5 text-sm text-white outline-none focus:border-green-400"
                          >
                            <option value="">—</option>
                            {units.map((u) => (
                              <option key={u.id} value={uomValue(u)}>{uomLabel(u)}</option>
                            ))}
                          </select>
                        </td>
                      </>
                    )}
                    <td className="px-4 py-3">
                      <button type="button" onClick={() => removeLine(i)} style={{ color: ORANGE }} aria-label={t('Remove', 'ដកចេញ')} title={t('Remove', 'ដកចេញ')}>
                        <TrashIcon />
                      </button>
                    </td>
                  </tr>
                ))
              )}
              {lines.length > 0 && (
                <tr className="bg-slate-800/30">
                  <td colSpan={isAdjust ? 5 : 6} className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                    {t('Grand Total', 'សរុបរួม')}
                  </td>
                  {isAdjust ? (
                    <>
                      <td className="px-4 py-3 text-right"><Pill tone={totalDiff >= 0 ? 'green' : 'red'}>{totalDiff >= 0 ? `+${totalDiff}` : totalDiff}</Pill></td>
                      <td className="whitespace-nowrap px-4 py-3 text-right"><span className="font-black text-green-300">${grandTotal.toFixed(2)}</span></td>
                    </>
                  ) : (
                    <td colSpan={3} className="px-4 py-3 text-right">
                      <span className="font-black text-green-300">${grandTotal.toFixed(2)}</span>
                      <span className="ml-3 font-semibold text-white">{totalItems}<span className="text-xs font-normal text-slate-500"> {t('items', 'ទំនិញ')}</span></span>
                    </td>
                  )}
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* footer actions */}
        <div className="flex items-center justify-between gap-3 border-t border-slate-700/60 px-5 py-4">
          <GhostButton onClick={onClose}>{t('Cancel', 'បោះបង់')}</GhostButton>
          <PrimaryButton onClick={save} disabled={saving}>
            {saving ? t('Saving…', 'កំពុងរក្សាទុក…') : t('Save', 'រក្សាទុក')}
          </PrimaryButton>
        </div>
      </section>

      {/* ---------- save confirmation — print-preview style ---------- */}
      {postedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div role="dialog" aria-modal="true" className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/40">
            {/* fake print-preview sheet */}
            <div className="mx-auto mt-6 w-[85%] rotate-[-1deg] rounded-lg bg-white p-4 font-mono text-[11px] leading-relaxed text-slate-800 shadow-xl">
              <p className="mb-1 text-center text-xs font-black tracking-widest">B&#39;GROCERIES</p>
              <p className="mb-2 text-center text-[10px] text-slate-500">{t(cfg.sheetTitle.en, cfg.sheetTitle.kh)}</p>
              <div className="border-y border-dashed border-slate-300 py-1.5">
                <p>{t('Code', 'កូដ')}: {code}</p>
                <p>{t('Date', 'កាលបរិច្ឆេទ')}: {date}</p>
                {cfg.kind === 'transfer-request'
                  ? (<p>{t('Route', 'បណ្តោយ')}: {LOCATIONS.find((l) => l.key === fromLoc)?.[lang]} → {LOCATIONS.find((l) => l.key === toLoc)?.[lang]}</p>)
                  : (<p>{t(cfg.typeLabel.en, cfg.typeLabel.kh)}: {docType}</p>)}
              </div>
              <p className="mt-1.5">{t('Items', 'ទំនិញ')}: {lines.length} · {t('Total', 'សរុប')}: {postedDoc.totalItems}</p>
            </div>
            <div className="p-5 text-center">
              <p className="text-base font-extrabold text-white">✓ {t('Document saved successfully', 'ឯកសារបានរក្សាទុកដោយជោគជ័យ')}</p>
              {postedDoc.fails.length > 0 && (
                <p className="mt-1 text-xs font-semibold" style={{ color: ORANGE }}>
                  {t(`${postedDoc.fails.length} line(s) failed`, `${postedDoc.fails.length} ជួរដេកបរាជ័យ`)}
                </p>
              )}
              <PrimaryButton className="mt-4 w-full justify-center" onClick={onClose}>
                {t('Continue', 'បន្ត')}
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Compose the stored note from the preset select + free-text detail
const NOTE_TEXT = (noteType, noteText, lang, cfg) => {
  const preset = cfg.noteOptions.find((n) => n.value === noteType)
  const parts = []
  if (preset && preset.value) parts.push(preset[lang])
  if (noteText.trim()) parts.push(noteText.trim())
  return parts.join(' — ')
}

/* ---------- icons ---------- */
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.5" y2="16.5" />
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

export default TransactionDocCreate
