import { useEffect, useMemo, useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { adminProductAPI } from '../../api/api'
import { useCollection, eanCheckDigit } from './stockStore'
import { SectionShell, Field, TextInput, SelectInput, PrimaryButton, GhostButton, Modal, DataTable, Pill } from './stockUI'

const ORANGE = '#FF9900'

const pName = (p) => (typeof p?.name === 'object' ? p.name?.en : p?.name) || `#${p?.id}`

export const ToolsSection = ({ sectionKey }) => {
  const { lang } = useLanguage()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [saving, setSaving] = useState(false)

  // per-tool local state
  const [priceEdits, setPriceEdits] = useState({})       // products-prices: id → new price
  const [costPct, setCostPct] = useState('')             // cost-change: % change
  const [suppliers] = useCollection('md-suppliers')
  const [supplierLinks, supplierLinkApi] = useCollection('ps-links') // products-supplier
  const [linkForm, setLinkForm] = useState(null)         // products-supplier modal
  const [attrDefs] = useCollection('md-attributes')
  const [changeAttr, setChangeAttr] = useState({ attrId: '', value: '' })
  const [labelSize, setLabelSize] = useState('40x30')

  useEffect(() => {
    adminProductAPI.getAll()
      .then((res) => setProducts(Array.isArray(res?.data) ? res.data : []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const t = (en, kh) => (lang === 'en' ? en : kh)

  const filtered = useMemo(
    () => products.filter((p) => JSON.stringify(p).toLowerCase().includes(query.toLowerCase())),
    [products, query]
  )

  /* ================= PRODUCTS QUANTITIES ================= */
  if (sectionKey === 'products-quantities') {
    return (
      <QuantitiesPage t={t} query={query} setQuery={setQuery} filtered={filtered} loading={loading} />
    )
  }

  /* ================= PRODUCTS PRICES ================= */
  if (sectionKey === 'products-prices') {
    const dirtyCount = Object.keys(priceEdits).length
    const saveAll = async () => {
      setSaving(true)
      let ok = 0
      for (const [id, price] of Object.entries(priceEdits)) {
        try {
          const p = products.find((x) => String(x.id) === String(id))
          await adminProductAPI.update(id, { ...p, basePrice: Number(price) })
          ok += 1
        } catch { /* keep going; count failures via ok mismatch */ }
      }
      setPriceEdits({})
      setFeedback({ tone: 'green', text: t(`✓ ${ok} price(s) updated`, `✓ បានធ្វើបច្ចុប្បន្នភាពតម្លៃ ${ok}`), fails: [] })
      setSaving(false)
    }
    return (
      <SectionShell
        icon="💲" color="#16a34a"
        title={{ en: 'Products Prices', kh: 'តម្លៃផលិតផល' }}
        subtitle={{ en: 'Edit retail prices inline and batch-save changes.', kh: 'កែតម្លៃដោយផ្ទាល់ និងរក្សាទុកជាក្រុម។' }}
        actions={
          <PrimaryButton onClick={saveAll} disabled={dirtyCount === 0 || saving}>
            {saving ? t('Saving…', 'កំពុងរក្សាទុក…') : t(`Save Changes (${dirtyCount})`, `រក្សាទុក (${dirtyCount})`)}
          </PrimaryButton>
        }
      >
        {feedback && <Banner feedback={feedback} />}
        <SearchBox query={query} setQuery={setQuery} t={t} />
        <DataTable
          headers={[t('Product', 'ផលិតផល'), t('Code', 'កូដ'), t('Current Price', 'តម្លៃបច្ចុប្បន្ន'), t('New Price', 'តម្លៃថ្មី')]}
          rows={filtered.map((p) => ({
            id: p.id,
            cells: [
              <span key="n" className="text-slate-200">{pName(p)}</span>,
              <span key="c" className="font-mono text-xs text-slate-400">{p.code || '—'}</span>,
              <span key="cur" className="text-slate-300">${Number(p.basePrice ?? 0).toFixed(2)}</span>,
              <input
                key="new"
                type="number" min="0" step="0.01"
                className="w-28 rounded-lg border border-slate-700 bg-slate-950/60 px-2 py-1.5 text-sm text-white outline-none focus:border-green-400"
                placeholder={String(Number(p.basePrice ?? 0).toFixed(2))}
                value={priceEdits[p.id] ?? ''}
                onChange={(e) => setPriceEdits({ ...priceEdits, [p.id]: e.target.value })}
              />,
            ],
          }))}
          emptyText={{ en: 'No products found.', kh: 'រកមិនឃើញផលិតផលទេ។' }}
          emptyIcon="💲"
        />
      </SectionShell>
    )
  }

  /* ================= COST CHANGE ================= */
  if (sectionKey === 'cost-change') {
    const pct = Number(costPct)
    const applyCostChange = async () => {
      if (!pct || Number.isNaN(pct)) return
      setSaving(true)
      let ok = 0
      for (const p of filtered) {
        try {
          const oldCost = Number(p.averageCost ?? p.standardCost ?? 0)
          await adminProductAPI.update(p.id, {
            ...p,
            averageCost: Math.round(oldCost * (1 + pct / 100) * 10000) / 10000,
          })
          ok += 1
        } catch { /* skip */ }
      }
      setFeedback({ tone: 'green', text: t(`✓ Cost updated on ${ok} product(s) by ${pct > 0 ? '+' : ''}${pct}%`, `✓ ធ្វើបច្ចុប្បន្នភាពចំណាយ ${ok} ផលិតផល ${pct > 0 ? '+' : ''}${pct}%`), fails: [] })
      setCostPct('')
      setSaving(false)
    }
    return (
      <SectionShell
        icon="💱" color="#f472b6"
        title={{ en: 'Cost Change', kh: 'ប្តូរចំណាយ' }}
        subtitle={{ en: 'Batch-update the average cost of the filtered products by a percentage.', kh: 'ធ្វើបច្ចុប្បន្នភាពចំណាយមធ្យមរបស់ផលិតផលទាំងអស់តាមព័ត៌មានលេខ។' }}
      >
        {feedback && <Banner feedback={feedback} />}
        <div className="mb-4 flex flex-wrap items-end gap-3 rounded-2xl border border-slate-700/60 bg-slate-900/80 p-4">
          <Field label={t('Change cost by (%) — negative to reduce', 'ប្តូរចំណាយ (%) — អវិជ្ជមានដើម្បីបន្ថយ')}>
            <TextInput type="number" step="0.1" value={costPct} onChange={(e) => setCostPct(e.target.value)} placeholder="e.g. 5 or -3" style={{ width: '12rem' }} />
          </Field>
          <PrimaryButton onClick={applyCostChange} disabled={!costPct || saving}>
            {saving ? t('Applying…', 'កំពុងអនុវត្ត…') : t('Apply to Filtered Products', 'អនុវត្តលើផលិតផលដែលច្រោះ')}
          </PrimaryButton>
        </div>
        <SearchBox query={query} setQuery={setQuery} t={t} />
        <DataTable
          headers={[t('Product', 'ផលិតផល'), t('Code', 'កូដ'), t('Avg Cost', 'ចំណាយមធ្យម'), t('Base Price', 'តម្លៃដើម')]}
          rows={filtered.map((p) => ({
            id: p.id,
            cells: [
              <span key="n" className="text-slate-200">{pName(p)}</span>,
              <span key="c" className="font-mono text-xs text-slate-400">{p.code || '—'}</span>,
              <span key="a" className="text-slate-300">${Number(p.averageCost ?? 0).toFixed(2)}</span>,
              <span key="b" className="text-slate-300">${Number(p.basePrice ?? 0).toFixed(2)}</span>,
            ],
          }))}
          emptyText={{ en: 'No products found.', kh: 'រកមិនឃើញផលិតផលទេ។' }}
          emptyIcon="💱"
        />
      </SectionShell>
    )
  }

  /* ================= SERIAL INFORMATION handled by <SerialInformation /> ==== */

  /* ================= PRINT LABEL ================= */
  if (sectionKey === 'print-label') {
    const SIZES = {
      '40x30': { w: 40, h: 30, font: 9 },
      '58x40': { w: 58, h: 40, font: 11 },
      '80x50': { w: 80, h: 50, font: 13 },
    }
    const size = SIZES[labelSize] || SIZES['40x30']
    const printable = filtered.slice(0, 60)

    const doPrint = () => {
      const win = window.open('', '_blank', 'width=820,height=900')
      if (!win) return
      const labels = printable.map((p) => `
        <div class="lbl" style="width:${size.w}mm;height:${size.h}mm">
          <div class="nm">${pName(p)}</div>
          <div class="code">${p.code || ''}</div>
          ${p.barCode ? `<div class="bc">${String(p.barCode).split('').join(' ')}</div>` : ''}
          <div class="pr">$${Number(p.basePrice ?? 0).toFixed(2)}</div>
        </div>`)
      win.document.write(`<html><head><title>B'Groceries Labels</title><style>
        body{font-family:'Montserrat',sans-serif;margin:0}
        .lbl{display:inline-flex;flex-direction:column;justify-content:center;align-items:center;border:1px dashed #999;box-sizing:border-box;padding:2mm;margin:1mm;text-align:center;page-break-inside:avoid}
        .nm{font-weight:800;font-size:${size.font}px;line-height:1.15}
        .code{font-size:${size.font - 2}px;color:#333;font-family:monospace}
        .bc{font-family:monospace;font-size:${size.font - 1}px;letter-spacing:-1px;margin-top:1mm}
        .pr{font-weight:900;font-size:${size.font + 6}px;margin-top:auto}
        @media print{.lbl{border-style:solid}}
      </style></head><body>${labels.join('')}<script>window.onload=()=>window.print()<` + `/script></body></html>`)
      win.document.close()
    }

    return (
      <SectionShell
        icon="🖨️" color="#a855f7"
        title={{ en: 'Print Label', kh: 'បោះពុម្ពស្លាក' }}
        subtitle={{ en: 'Barcode / shelf labels with product name, code and price for thermal printers.', kh: 'ស្លាកបារកូដ ឈ្មោះផលិតផល និងតម្លៃ សម្រាប់ម៉ាស៊ីនបោះពុម្ពស្លាក។' }}
        actions={
          <>
            <SelectInput value={labelSize} onChange={(e) => setLabelSize(e.target.value)} style={{ width: 'auto' }}>
              <option value="40x30">40×30 mm</option>
              <option value="58x40">58×40 mm</option>
              <option value="80x50">80×50 mm</option>
            </SelectInput>
            <PrimaryButton onClick={doPrint} disabled={!printable.length}>{t('Print Preview', 'មើលមុនបោះពុម្ព')}</PrimaryButton>
          </>
        }
      >
        <SearchBox query={query} setQuery={setQuery} t={t} />
        <p className="mb-3 text-xs text-slate-500">
          {t(`Previewing the first ${printable.length} label(s) of your filtered products.`, `មើលស្លាកចំនួន ${printable.length} នៃផលិតផលដែលបានច្រោះ។`)}
        </p>
        {/* label preview grid */}
        <div className="flex flex-wrap gap-3">
          {printable.map((p) => (
            <div key={p.id} className="flex flex-col items-center justify-between rounded-lg border border-dashed border-slate-600 bg-white/95 p-2 text-center text-slate-900 shadow-md" style={{ width: size.w * 3.4, height: size.h * 3.4 }}>
              <span className="font-extrabold leading-tight" style={{ fontSize: size.font - 1 }}>{pName(p)}</span>
              <span className="font-mono text-[9px] text-slate-500">{p.code}</span>
              <span className="font-mono text-[10px] tracking-tighter">{p.barCode ? String(p.barCode).split('').join(' ') : 'no barcode'}</span>
              <span className="text-xl font-black">${Number(p.basePrice ?? 0).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </SectionShell>
    )
  }

  /* ================= PRODUCTS SCALE ================= */
  if (sectionKey === 'products-scale') {
    // scale barcode format: 20 + 5-digit item code + 5-digit weight(grams) + check digit
    const scaleRows = filtered.filter((p) => Number(p.code)).slice(0, 30)
    const exportCsv = () => {
      const rows = [['item_code', 'name', 'barcode_format']]
      scaleRows.forEach((p) => {
        const code5 = String(Math.abs(Math.trunc(Number(p.code))) % 100000).padStart(5, '0')
        rows.push([code5, pName(p), `20${code5}00000${eanCheckDigit(`20${code5}00000`)}`])
      })
      const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
      const a = document.createElement('a')
      a.href = url
      a.download = 'scale-products.csv'
      a.click()
      URL.revokeObjectURL(url)
    }
    return (
      <SectionShell
        icon="🧮" color="#14b8a6"
        title={{ en: 'Products Scale', kh: 'ទំនិញជាត់' }}
        subtitle={{ en: 'Export weighed goods to scale barcodes (embedded-weight EAN format) for deli & produce scales.', kh: 'នាំចេញទំនិញជាត់ទៅជាបារកូដសម្រាប់ក្រៅនៃការជាត់។' }}
        actions={<PrimaryButton onClick={exportCsv} disabled={!scaleRows.length}>{t('Export Scale CSV', 'នាំចេញ CSV')}</PrimaryButton>}
      >
        <SearchBox query={query} setQuery={setQuery} t={t} />
        <p className="mb-3 text-xs text-slate-500">{t('Format: 20 + item code (5 digits) + weight placeholder (00000) + check digit.', 'ទម្រង់៖ ២០ + កូដទំនិញ (៥ ខ្ទងឹ) + ទម្ងន់ (០០០០០) + ខ្ទងឹពិនិត្យ។')}</p>
        <DataTable
          headers={[t('Product', 'ផលិតផល'), t('Item Code', 'កូដទំនិញ'), t('Scale Barcode', 'បារកូដជាត់')]}
          rows={scaleRows.map((p) => {
            const code5 = String(Math.abs(Math.trunc(Number(p.code))) % 100000).padStart(5, '0')
            const bc = `20${code5}00000${eanCheckDigit(`20${code5}00000`)}`
            return {
              id: p.id,
              cells: [
                <span key="n" className="text-slate-200">{pName(p)}</span>,
                <span key="c" className="font-mono text-xs text-slate-300">{code5}</span>,
                <span key="b" className="font-mono text-sm tracking-widest" style={{ color: ORANGE }}>{bc}</span>,
              ],
            }
          })}
          emptyText={{ en: 'No numeric product codes found — give products a numeric code first.', kh: 'រកមិនឃើញកូដលេខទេ — សូមដាក់កូដលេខជាមុនសិន។' }}
          emptyIcon="🧮"
        />
      </SectionShell>
    )
  }

  /* ================= CHANGE ATTRIBUTE ================= */
  if (sectionKey === 'change-attribute') {
    const defs = attrDefs.filter((d) => d.name)
    const applyAttr = async () => {
      const def = defs.find((d) => String(d.id) === changeAttr.attrId)
      if (!def || !changeAttr.value) return
      setSaving(true)
      let ok = 0
      for (const p of filtered) {
        try {
          const desc = [String(p.description || '').trim(), `${def.name}: ${changeAttr.value}`].filter(Boolean).join(' | ')
          await adminProductAPI.update(p.id, { ...p, description: desc })
          ok += 1
        } catch { /* skip */ }
      }
      setFeedback({ tone: 'green', text: t(`✓ Attribute "${def.name}: ${changeAttr.value}" applied to ${ok} product(s)`, `✓ លក្ខណៈសម្បត្តិ "${def.name}: ${changeAttr.value}" អនុវត្តលើ ${ok} ផលិតផល`), fails: [] })
      setChangeAttr({ attrId: '', value: '' })
      setSaving(false)
    }
    return (
      <SectionShell
        icon="🔀" color="#ec4899"
        title={{ en: 'Change Attribute', kh: 'ប្តូរលក្ខណៈសម្បត្តិ' }}
        subtitle={{ en: 'Bulk-reassign an attribute value across all filtered products.', kh: 'ប្តូរតម្លៃលក្ខណៈសម្បត្តិជាក្រុមលើផលិតផលដែលបានច្រោះ។' }}
      >
        {feedback && <Banner feedback={feedback} />}
        <div className="mb-4 flex flex-wrap items-end gap-3 rounded-2xl border border-slate-700/60 bg-slate-900/80 p-4">
          <Field label={t('Attribute (from Attribute page)', 'លក្ខណៈសម្បត្តិ (ពីទំព័រ Attribute)')}>
            <SelectInput value={changeAttr.attrId} onChange={(e) => setChangeAttr({ ...changeAttr, attrId: e.target.value })} style={{ width: '14rem' }}>
              <option value="">{t('Select attribute…', 'ជ្រើសរើស…')}</option>
              {defs.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </SelectInput>
          </Field>
          <Field label={t('Value', 'តម្លៃ')} required>
            <TextInput value={changeAttr.value} onChange={(e) => setChangeAttr({ ...changeAttr, value: e.target.value })} placeholder={t('e.g. Red / Large / Organic', 'ឧ. ក្រហម / ធំ / អ៊ីរ៉ាកុិ')} />
          </Field>
          <PrimaryButton onClick={applyAttr} disabled={!changeAttr.attrId || !changeAttr.value || saving}>
            {saving ? t('Applying…', 'កំពុងអនុវត្ត…') : t('Apply to Filtered Products', 'អនុវត្តលើផលិតផល')}
          </PrimaryButton>
        </div>
        {!defs.length && (
          <p className="mb-3 rounded-xl border border-orange-500/40 bg-orange-500/10 px-4 py-3 text-sm font-semibold" style={{ color: ORANGE }}>
            {t('No attributes defined yet — create some on the Attribute page first.', 'មិនទាន់មានលក្ខណៈសម្បត្តិ — បង្កើតនៅទំព័រ Attribute ជាមុនសិន។')}
          </p>
        )}
        <SearchBox query={query} setQuery={setQuery} t={t} />
        <DataTable
          headers={[t('Product', 'ផលិតផល'), t('Description / Attributes', 'ការពិពណ៌នា / លក្ខណៈសម្បត្តិ')]}
          rows={filtered.map((p) => ({
            id: p.id,
            cells: [
              <span key="n" className="text-slate-200">{pName(p)}</span>,
              <span key="d" className="text-slate-400">{p.description || '—'}</span>,
            ],
          }))}
          emptyText={{ en: 'No products found.', kh: 'រកមិនឃើញផលិតផលទេ។' }}
          emptyIcon="🔀"
        />
      </SectionShell>
    )
  }

  /* ================= PRODUCTS SUPPLIER ================= */
  if (sectionKey === 'products-supplier') {
    return (
      <SectionShell
        icon="🏭" color="#fb7185"
        title={{ en: 'Products Supplier', kh: 'ផលិតផល-អ្នកផ្គត់ផ្គង់' }}
        subtitle={{ en: 'Link products to suppliers with vendor part numbers and standard purchase costs.', kh: 'ភ្ជាប់ផលិតផលទៅអ្នកផ្គត់ផ្គង់ ជាមួយលេខផ្នែក និងតម្លៃទិញ។' }}
        actions={
          <PrimaryButton onClick={() => setLinkForm({ productId: '', supplierId: '', partNumber: '', cost: '' })} disabled={!suppliers.length}>
            + {t('New Link', 'ភ្ជាប់ថ្មី')}
          </PrimaryButton>
        }
      >
        {feedback && <Banner feedback={feedback} />}
        {!suppliers.length && (
          <p className="mb-3 rounded-xl border border-orange-500/40 bg-orange-500/10 px-4 py-3 text-sm font-semibold" style={{ color: ORANGE }}>
            {t('Create at least one supplier on the Suppliers page first.', 'បង្កើតអ្នកផ្គត់ផ្គង់យ៉ាងតិចមួយនៅទំព័រ Suppliers ជាមុនសិន។')}
          </p>
        )}
        <DataTable
          headers={[t('Product', 'ផលិតផល'), t('Supplier', 'អ្នកផ្គត់ផ្គង់'), t('Part No.', 'លេខផ្នែក'), t('Purchase Cost', 'តម្លៃទិញ'), '']}
          rows={supplierLinks.map((l) => ({
            id: l.id,
            cells: [
              <span key="p" className="text-slate-200">{l.productName || `#${l.productId}`}</span>,
              <span key="s" className="text-slate-200">{l.supplierName || '—'}</span>,
              <span key="pn" className="font-mono text-xs text-slate-300">{l.partNumber || '—'}</span>,
              <span key="c" className="text-slate-300">{l.cost != null && l.cost !== '' ? `$${l.cost}` : '—'}</span>,
              <button
                key="del"
                type="button"
                onClick={() => supplierLinkApi.remove(l.id)}
                className="transition hover:scale-110"
                style={{ color: ORANGE }}
                aria-label={t('Delete', 'លុប')}
              >
                <TrashIcon />
              </button>,
            ],
          }))}
          emptyText={{ en: 'No product–supplier links yet.', kh: 'មិនទាន់មានការភ្ជាប់ផលិតផល-អ្នកផ្គត់ផ្គង់ទេ។' }}
          emptyIcon="🏭"
        />

        <Modal open={!!linkForm} onClose={() => setLinkForm(null)} title={t('Link Product to Supplier', 'ភ្ជាប់ផលិតផលទៅអ្នកផ្គត់ផ្គង់')}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label={t('Product', 'ផលិតផល')} required>
              <SelectInput value={linkForm?.productId || ''} onChange={(e) => setLinkForm({ ...linkForm, productId: e.target.value })}>
                <option value="">{t('Select…', 'ជ្រើស…')}</option>
                {products.map((p) => <option key={p.id} value={p.id}>{pName(p)}</option>)}
              </SelectInput>
            </Field>
            <Field label={t('Supplier', 'អ្នកផ្គត់ផ្គង់')} required>
              <SelectInput value={linkForm?.supplierId || ''} onChange={(e) => setLinkForm({ ...linkForm, supplierId: e.target.value })}>
                <option value="">{t('Select…', 'ជ្រើស…')}</option>
                {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </SelectInput>
            </Field>
            <Field label={t('Vendor Part No.', 'លេខផ្នែកអ្នកលក់')}>
              <TextInput value={linkForm?.partNumber || ''} onChange={(e) => setLinkForm({ ...linkForm, partNumber: e.target.value })} />
            </Field>
            <Field label={t('Standard Purchase Cost ($)', 'តម្លៃទិញ ($)')}>
              <TextInput type="number" min="0" step="0.01" value={linkForm?.cost || ''} onChange={(e) => setLinkForm({ ...linkForm, cost: e.target.value })} />
            </Field>
          </div>
          <div className="mt-5 flex justify-end gap-3">
            <GhostButton onClick={() => setLinkForm(null)}>{t('Cancel', 'បោះបង់')}</GhostButton>
            <PrimaryButton
              disabled={!linkForm?.productId || !linkForm?.supplierId}
              onClick={() => {
                const sup = suppliers.find((s) => String(s.id) === linkForm.supplierId)
                const prod = products.find((p) => String(p.id) === linkForm.productId)
                supplierLinkApi.add({
                  productId: linkForm.productId,
                  productName: prod ? pName(prod) : '',
                  supplierId: linkForm.supplierId,
                  supplierName: sup?.name || '',
                  partNumber: linkForm.partNumber,
                  cost: linkForm.cost,
                })
                setLinkForm(null)
              }}
            >
              {t('Save Link', 'រក្សាទុក')}
            </PrimaryButton>
          </div>
        </Modal>
      </SectionShell>
    )
  }

  /* ================= SERIAL INFORMATION handled by <SerialInformation /> ==== */

  return null
}

/* ================= SERIAL INFORMATION (own component for hooks order) ======== */
export const SerialInformation = () => {
  const { lang } = useLanguage()
  const [products, setProducts] = useState([])
  const [serials, serialApi] = useCollection('serials')
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState({ productId: '', serial: '', batch: '', expiryDate: '' })
  const t = (en, kh) => (lang === 'en' ? en : kh)

  useEffect(() => {
    adminProductAPI.getAll()
      .then((res) => setProducts(Array.isArray(res?.data) ? res.data : []))
      .catch(() => {})
  }, [])

  const pName = (p) => (typeof p.name === 'object' ? p.name?.en : p.name) || `#${p.id}`

  return (
    <SectionShell
      icon="🔖" color="#38bdf8"
      title={{ en: 'Serial Information', kh: 'ព័ត៌មានសៀរៀល' }}
      subtitle={{ en: 'Individualized serial numbers and batch/lot tracking with expiry dates.', kh: 'លេខសៀរៀលរបស់ផលិតផលមួយៗ និងការតាមដានបាច់/ឡុត ជាមួយថ្ងៃផុតកំណត់។' }}
      actions={
        <PrimaryButton onClick={() => { setForm({ productId: '', serial: '', batch: '', expiryDate: '' }); setFormOpen(true) }}>
          + {t('New Serial', 'សៀរៀលថ្មី')}
        </PrimaryButton>
      }
    >
      <DataTable
        headers={[t('Product', 'ផលិតផល'), t('Serial No.', 'លេខសៀរៀល'), t('Batch / Lot', 'បាច់/ឡុត'), t('Expiry Date', 'ថ្ងៃផុតកំណត់'), '']}
        rows={serials.map((s) => ({
          id: s.id,
          cells: [
            <span key="p" className="text-slate-200">{s.productName || `#${s.productId}`}</span>,
            <span key="s" className="font-mono text-xs" style={{ color: ORANGE }}>{s.serial}</span>,
            <span key="b" className="text-slate-300">{s.batch || '—'}</span>,
            <span key="e" className="text-slate-300">{s.expiryDate || '—'}</span>,
            <button key="d" type="button" onClick={() => serialApi.remove(s.id)} className="transition hover:scale-110" style={{ color: ORANGE }} aria-label={t('Delete', 'លុប')}>
              <TrashIcon />
            </button>,
          ],
        }))}
        emptyText={{ en: 'No serials recorded yet.', kh: 'មិនទាន់មានលេខសៀរៀលទេ។' }}
        emptyIcon="🔖"
      />

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={t('Record Serial / Batch', 'កត់ត្រាសៀរៀល/បាច់')}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={t('Product', 'ផលិតផល')} required>
            <SelectInput value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })}>
              <option value="">{t('Select…', 'ជ្រើស…')}</option>
              {products.map((p) => <option key={p.id} value={p.id}>{pName(p)}</option>)}
            </SelectInput>
          </Field>
          <Field label={t('Serial No.', 'លេខសៀរៀល')} required>
            <TextInput value={form.serial} onChange={(e) => setForm({ ...form, serial: e.target.value })} placeholder="SN-2026-00001" />
          </Field>
          <Field label={t('Batch / Lot', 'បាច់/ឡុត')}>
            <TextInput value={form.batch} onChange={(e) => setForm({ ...form, batch: e.target.value })} placeholder="LOT-A17" />
          </Field>
          <Field label={t('Expiry Date', 'ថ្ងៃផុតកំណត់')}>
            <TextInput type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
          </Field>
        </div>
        <div className="mt-5 flex justify-end gap-3">
          <GhostButton onClick={() => setFormOpen(false)}>{t('Cancel', 'បោះបង់')}</GhostButton>
          <PrimaryButton
            disabled={!form.productId || !form.serial.trim()}
            onClick={() => {
              const prod = products.find((p) => String(p.id) === form.productId)
              serialApi.add({
                productId: form.productId,
                productName: prod ? pName(prod) : '',
                serial: form.serial.trim(),
                batch: form.batch,
                expiryDate: form.expiryDate,
              })
              setFormOpen(false)
            }}
          >
            {t('Save', 'រក្សាទុក')}
          </PrimaryButton>
        </div>
      </Modal>
    </SectionShell>
  )
}

/* ---------- small shared pieces ---------- */

const SearchBox = ({ query, setQuery, t }) => (
  <div className="mb-4 max-w-sm">
    <TextInput placeholder={t('Search products…', 'ស្វែងរកផលិតផល…')} value={query} onChange={(e) => setQuery(e.target.value)} />
  </div>
)

const Banner = ({ feedback }) => (
  <div className={`mb-4 rounded-xl border px-4 py-3 text-sm font-semibold ${
    feedback.tone === 'green' ? 'border-green-500/40 bg-green-500/10 text-green-300' : 'border-red-500/40 bg-red-500/10 text-red-300'
  }`}>
    {feedback.text}
  </div>
)

const QuantitiesPage = ({ t, query, setQuery, filtered, loading }) => (
  <SectionShell
    icon="🔢" color="#0ea5e9"
    title={{ en: 'Products Quantities', kh: 'បរិមាណផលិតផល' }}
    subtitle={{ en: 'Real-time stock ledger per SKU — on-hand, available and status across the catalog.', kh: 'បញ្ជីស្តុកពេលវេលាពិតរបស់ផលិតផលនីមួយៗ — ស្តុកមាន និងស្ថានភាព។' }}
  >
    <SearchBox query={query} setQuery={setQuery} t={t} />
    <DataTable
      headers={[t('Product', 'ផលិតផល'), t('Code', 'កូដ'), t('On Hand', 'មានក្នុងស្តុក'), t('Available', 'ដែលអាចលក់បាន'), t('Status', 'ស្ថានភាព'), t('UOM', 'ឯកតា')]}
      rows={filtered.map((p) => {
        const onHand = Number(p.onHand) || 0
        const available = p.availableStock != null && p.availableStock !== '' ? Number(p.availableStock) : onHand
        const status = !!p.outOfStock || onHand <= 0 ? 'OUT' : available <= 5 ? 'LOW' : 'IN'
        return {
          id: p.id,
          cells: [
            <span key="n" className="text-slate-200">{pName(p)}</span>,
            <span key="c" className="font-mono text-xs text-slate-400">{p.code || '—'}</span>,
            <span key="oh" className="font-bold text-white">{onHand}</span>,
            <span key="av" className="text-slate-300">{available}</span>,
            <Pill key="st" tone={status === 'IN' ? 'green' : status === 'LOW' ? 'orange' : 'red'}>{status}</Pill>,
            <span key="u" className="text-slate-400">{p.uom || '—'}</span>,
          ],
        }
      })}
      emptyText={{ en: loading ? 'Loading products…' : 'No products found.', kh: loading ? 'កំពុងផ្ទុក…' : 'រកមិនឃើញផលិតផលទេ។' }}
      emptyIcon="🔢"
    />
  </SectionShell>
)

const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
)

export default ToolsSection
