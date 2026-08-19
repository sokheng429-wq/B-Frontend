import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useNotifications } from '../../context/NotificationContext'

const DEPARTMENTS = [
  { en: 'Engineering', kh: 'វិស្វកម្ម' },
  { en: 'Design', kh: 'រចនា' },
  { en: 'Marketing', kh: 'ទីផ្សារ' },
  { en: 'Sales', kh: 'ផ្នែកលក់' },
  { en: 'Customer Support', kh: 'គាំទ្រអតិថិជន' },
  { en: 'Operations', kh: 'ប្រតិបត្តិការ' },
  { en: 'Other', kh: 'ផ្សេងទៀត' },
]

const JOB_TYPES = [
  { en: 'Full-time', kh: 'ពេញម៉ោង' },
  { en: 'Part-time', kh: 'ក្រៅម៉ោង' },
  { en: 'Contract', kh: 'កិច្ចសន្យា' },
  { en: 'Internship', kh: 'កម្មសិក្សា' },
  { en: 'Remote', kh: 'ពីចម្ងាយ' },
]

const TEXTS = {
  heroTitle: { en: 'Job board', kh: 'ផ្ទាំងការងារ' },
  heroSub: { en: 'Open new positions and fine-tune existing listings before they reach applicants.', kh: 'បើកមុខតំណែងថ្មី និងកែសម្រួលបញ្ជីដែលមានស្រាប់ មុនពេលបង្ហាញដល់អ្នកដាក់ពាក្យ។' },
  formTitle: { en: 'Position details', kh: 'ព័ត៌មានមុខតំណែង' },
  formSub: { en: 'Required fields keep the listing live. Salary and requirements are optional but recommended.', kh: 'ព័ត៌មានចាំបាច់រក្សាបញ្ជីឱ្យដំណើរការ។ ប្រាក់ខែ និងតម្រូវការជាជម្រើន ប៉ុន្តែត្រូវបានណែនាំ។' },
  title: { en: 'Job title', kh: 'ចំណងជើងការងារ' },
  titlePlaceholder: { en: 'e.g. Senior Frontend Developer', kh: 'ឧ. Senior Frontend Developer' },
  department: { en: 'Department', kh: 'ផ្នែក' },
  departmentPlaceholder: { en: 'Select department', kh: 'ជ្រើសរើសផ្នែក' },
  type: { en: 'Job type', kh: 'ប្រភេទការងារ' },
  typePlaceholder: { en: 'Select type', kh: 'ជ្រើសរើសប្រភេទ' },
  location: { en: 'Location', kh: 'ទីតាំង' },
  locationPlaceholder: { en: 'e.g. Phnom Penh, Remote', kh: 'ឧ. ភ្នំពេញ, ពីចម្ងាយ' },
  salary: { en: 'Salary range', kh: 'ចន្លោះប្រាក់ខែ' },
  salaryPlaceholder: { en: 'e.g. $500 - $800', kh: 'ឧ. ៥០០ - ៨០០ ដុល្លារ' },
  description: { en: 'Job description', kh: 'ការពិពណ៌នាការងារ' },
  descriptionPlaceholder: { en: 'Describe the role, responsibilities, and what a day looks like...', kh: 'ពិពណ៌នាអំពីតួនាទី ទំនួលខុសត្រូវ និងថ្ងៃធ្វើការ...' },
  requirements: { en: 'Requirements', kh: 'តម្រូវការ' },
  requirementsPlaceholder: { en: 'List required skills, experience, or qualifications...', kh: 'រាយបញ្ជីជំនាញ បទពិសោធន៍ ឬគុណវុឌ្ឍិ...' },
  postBtn: { en: 'Post job', kh: 'ប្រកាសការងារ' },
  updateBtn: { en: 'Save job', kh: 'រក្សាទុកការងារ' },
  cancelBtn: { en: 'Cancel edit', kh: 'បោះបង់ការកែប្រែ' },
  required: { en: 'Required', kh: 'ត្រូវការ' },
  optional: { en: 'Optional', kh: 'មិនចាំបាច់' },
  errTitle: { en: 'Job title is required', kh: 'ត្រូវការចំណងជើងការងារ' },
  errDepartment: { en: 'Please select a department', kh: 'សូមជ្រើសរើសផ្នែក' },
  errLocation: { en: 'Location is required', kh: 'ត្រូវការទីតាំង' },
  errType: { en: 'Please select a job type', kh: 'សូមជ្រើសរើសប្រភេទការងារ' },
  errDescription: { en: 'Description is required', kh: 'ត្រូវការការពិពណ៌នា' },
  listTitle: { en: 'Open positions', kh: 'មុខតំណែងកំពុងបើក' },
  empty: { en: 'No openings yet. Add the first role and it will appear here for quick edits.', kh: 'មិនទាន់មានមុខតំណែងនៅឡើយ។ បន្ថែមតួនាទីដំបូង ហើយវានឹងបង្ហាញនៅទីនេះ។' },
  viewCareer: { en: 'View career page', kh: 'មើលទំព័រការងារ' },
  posted: { en: 'Posted', kh: 'បានប្រកាស' },
  requirementsLabel: { en: 'Requirements', kh: 'តម្រូវការ' },
  remove: { en: 'Remove', kh: 'លុប' },
  edit: { en: 'Edit', kh: 'កែប្រែ' },
  delete: { en: 'Delete', kh: 'លុប' },
  back: { en: 'Dashboard', kh: 'ផ្ទាំងគ្រប់គ្រង' },
  livePreview: { en: 'Live preview', kh: 'មើលជាមុន' },
  untitled: { en: 'Untitled position', kh: 'មុខតំណែងគ្មានឈ្មោះ' },
  items: { en: 'Openings', kh: 'ការងារ' },
  departments: { en: 'Departments', kh: 'ផ្នែក' },
  types: { en: 'Job types', kh: 'ប្រភេទ' },
  withSalary: { en: 'With salary', kh: 'មានប្រាក់ខែ' },
}

export const Addjobs = () => {
  const { lang } = useLanguage()
  const { addNotification } = useNotifications()
  const [form, setForm] = useState({ title: '', department: '', location: '', type: '', salary: '', description: '', requirements: '' })
  const [errors, setErrors] = useState({})
  const [jobs, setJobs] = useState([])
  const [editingId, setEditingId] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = TEXTS.errTitle[lang]
    if (!form.department) e.department = TEXTS.errDepartment[lang]
    if (!form.location.trim()) e.location = TEXTS.errLocation[lang]
    if (!form.type) e.type = TEXTS.errType[lang]
    if (!form.description.trim()) e.description = TEXTS.errDescription[lang]
    return e
  }

  const startEdit = (job) => {
    setEditingId(job.id)
    setForm({ title: job.title, department: job.department, location: job.location, type: job.type, salary: job.salary || '', description: job.description, requirements: job.requirements || '' })
    setErrors({})
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm({ title: '', department: '', location: '', type: '', salary: '', description: '', requirements: '' })
    setErrors({})
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const v = validate()
    setErrors(v)
    if (Object.keys(v).length === 0) {
      if (editingId) {
        setJobs((prev) => prev.map((j) => j.id === editingId ? { ...j, ...form } : j))
        cancelEdit()
      } else {
        const newJob = {
          id: Date.now(),
          ...form,
          postedDate: new Date().toLocaleDateString(lang === 'kh' ? 'km-KH' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        }
        setJobs((prev) => [...prev, newJob])
        addNotification({
          type: 'job',
          action: 'add',
          title: lang === 'en' ? 'Job posted' : 'បានប្រកាសការងារ',
          detail: form.title,
        })
        setForm({ title: '', department: '', location: '', type: '', salary: '', description: '', requirements: '' })
      }
    }
  }

  const removeJob = (id) => {
    if (editingId === id) cancelEdit()
    setJobs((prev) => prev.filter((j) => j.id !== id))
  }

  const getDeptLabel = (deptEn) => DEPARTMENTS.find((d) => d.en === deptEn)?.[lang] || deptEn
  const getTypeLabel = (typeEn) => JOB_TYPES.find((t) => t.en === typeEn)?.[lang] || typeEn

  const deptCount = new Set(jobs.map((j) => j.department).filter(Boolean)).size
  const typeCount = new Set(jobs.map((j) => j.type).filter(Boolean)).size
  const withSalary = jobs.filter((j) => j.salary && j.salary.trim()).length

  const inputBase = 'w-full rounded-xl border border-slate-700/70 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-orange-400 focus:bg-slate-950 focus:ring-4 focus:ring-orange-500/10'
  const errorInput = 'border-red-500/80 bg-red-500/10 focus:border-red-400 focus:ring-red-500/10'

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-orange-500/20 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-6 shadow-2xl shadow-orange-500/10">
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-px w-2/3 bg-gradient-to-r from-transparent via-orange-400/50 to-transparent" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link to="/admin" className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-950/50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-orange-300 transition hover:border-orange-400 hover:text-orange-200">
              <ChevronLeftIcon /> {TEXTS.back[lang]}
            </Link>
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/15 text-3xl ring-1 ring-orange-400/30">💼</span>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-orange-300">B'Groceries careers</p>
                <h1 className="mt-1 text-3xl font-black tracking-tight text-white md:text-4xl">{TEXTS.heroTitle[lang]}</h1>
              </div>
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">{TEXTS.heroSub[lang]}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat value={jobs.length} label={TEXTS.items[lang]} />
            <Stat value={deptCount} label={TEXTS.departments[lang]} />
            <Stat value={typeCount} label={TEXTS.types[lang]} />
            <Stat value={withSalary} label={TEXTS.withSalary[lang]} />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 2xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="rounded-3xl border border-slate-700/60 bg-slate-900/80 p-6 shadow-xl shadow-black/20">
          <div className="mb-6 flex flex-col gap-3 border-b border-slate-700/60 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black text-white">{TEXTS.formTitle[lang]}</h2>
              <p className="mt-1 text-sm text-slate-400">{TEXTS.formSub[lang]}</p>
            </div>
            {editingId && (
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-300">
                ✏️ {TEXTS.updateBtn[lang]}
              </span>
            )}
          </div>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <Field label={TEXTS.title[lang]} badge={TEXTS.required[lang]} error={errors.title}>
              <input id="title" name="title" type="text" placeholder={TEXTS.titlePlaceholder[lang]} value={form.title} onChange={handleChange} className={`${inputBase} ${errors.title ? errorInput : ''}`} />
            </Field>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <Field label={TEXTS.department[lang]} badge={TEXTS.required[lang]} error={errors.department}>
                <select id="department" name="department" value={form.department} onChange={handleChange} className={`${inputBase} ${errors.department ? errorInput : ''}`}>
                  <option value="">{TEXTS.departmentPlaceholder[lang]}</option>
                  {DEPARTMENTS.map((d) => <option key={d.en} value={d.en}>{d[lang]}</option>)}
                </select>
              </Field>
              <Field label={TEXTS.type[lang]} badge={TEXTS.required[lang]} error={errors.type}>
                <select id="type" name="type" value={form.type} onChange={handleChange} className={`${inputBase} ${errors.type ? errorInput : ''}`}>
                  <option value="">{TEXTS.typePlaceholder[lang]}</option>
                  {JOB_TYPES.map((t) => <option key={t.en} value={t.en}>{t[lang]}</option>)}
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <Field label={TEXTS.location[lang]} badge={TEXTS.required[lang]} error={errors.location}>
                <input id="location" name="location" type="text" placeholder={TEXTS.locationPlaceholder[lang]} value={form.location} onChange={handleChange} className={`${inputBase} ${errors.location ? errorInput : ''}`} />
              </Field>
              <Field label={TEXTS.salary[lang]} badge={TEXTS.optional[lang]} muted>
                <input id="salary" name="salary" type="text" placeholder={TEXTS.salaryPlaceholder[lang]} value={form.salary} onChange={handleChange} className={inputBase} />
              </Field>
            </div>

            <Field label={TEXTS.description[lang]} badge={TEXTS.required[lang]} error={errors.description}>
              <textarea id="description" name="description" rows="5" placeholder={TEXTS.descriptionPlaceholder[lang]} value={form.description} onChange={handleChange} className={`${inputBase} min-h-32 resize-y ${errors.description ? errorInput : ''}`} />
            </Field>

            <Field label={TEXTS.requirements[lang]} badge={TEXTS.optional[lang]} muted>
              <textarea id="requirements" name="requirements" rows="4" placeholder={TEXTS.requirementsPlaceholder[lang]} value={form.requirements} onChange={handleChange} className={`${inputBase} min-h-28 resize-y`} />
            </Field>

            <div className="flex flex-col gap-3 border-t border-slate-700/60 pt-5 sm:flex-row">
              <button type="submit" className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300">
                {editingId ? <CheckIcon /> : <SendIcon />} {editingId ? TEXTS.updateBtn[lang] : TEXTS.postBtn[lang]}
              </button>
              {editingId && (
                <button type="button" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-5 py-3 text-sm font-bold text-slate-300 transition hover:border-slate-500 hover:bg-slate-800 hover:text-white" onClick={cancelEdit}>
                  <XIcon /> {TEXTS.cancelBtn[lang]}
                </button>
              )}
            </div>
          </form>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-orange-500/20 bg-gradient-to-br from-slate-900 to-slate-950 p-5 shadow-xl shadow-black/20">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-300">{TEXTS.livePreview[lang]}</p>
                <h3 className="mt-1 text-lg font-black text-white">{form.title || TEXTS.untitled[lang]}</h3>
              </div>
              {form.type && <span className="rounded-full bg-orange-500/15 px-3 py-1 text-xs font-black text-orange-300">{getTypeLabel(form.type)}</span>}
            </div>
            <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
              <div className="flex flex-wrap gap-2">
                {form.department && <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-300">{getDeptLabel(form.department)}</span>}
                {form.location && <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-slate-300">📍 {form.location}</span>}
                {form.salary && <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-bold text-green-300">💵 {form.salary}</span>}
              </div>
              <p className="mt-4 line-clamp-4 text-sm leading-6 text-slate-400">{form.description || TEXTS.descriptionPlaceholder[lang]}</p>
              {form.requirements && (
                <div className="mt-4 border-t border-slate-700/60 pt-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-orange-300">{TEXTS.requirementsLabel[lang]}</p>
                  <p className="mt-1 line-clamp-3 text-sm leading-6 text-slate-400">{form.requirements}</p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-700/60 bg-slate-900/80 p-5 shadow-xl shadow-black/20">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-black text-white">{TEXTS.listTitle[lang]}</h3>
              <span className="flex h-8 min-w-8 items-center justify-center rounded-full bg-orange-500 px-2 text-sm font-black text-slate-950">{jobs.length}</span>
            </div>

            {jobs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 p-8 text-center">
                <span className="text-4xl">💼</span>
                <p className="mt-3 text-sm leading-6 text-slate-400">{TEXTS.empty[lang]}</p>
              </div>
            ) : (
              <div className="max-h-[540px] space-y-3 overflow-y-auto pr-1 scrollbar-thin scrollbar-track-slate-900">
                {jobs.map((job) => (
                  <article key={job.id} className="group rounded-2xl border border-slate-700/70 bg-slate-950/50 p-4 transition hover:border-orange-500/50 hover:bg-slate-950">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate text-sm font-black text-white">{job.title}</h4>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          <span className="rounded-full bg-orange-500/10 px-2 py-0.5 text-[11px] font-bold text-orange-300">{getDeptLabel(job.department)}</span>
                          <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] font-bold text-slate-300">{getTypeLabel(job.type)}</span>
                          <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] font-bold text-slate-300">📍 {job.location}</span>
                        </div>
                        {job.salary && <p className="mt-2 text-xs font-bold text-green-300">💵 {job.salary}</p>}
                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-400">{job.description}</p>
                        {job.requirements && (
                          <details className="mt-2 group/det">
                            <summary className="cursor-pointer text-xs font-bold text-orange-300 hover:text-orange-200">{TEXTS.requirementsLabel[lang]}</summary>
                            <p className="mt-1 border-l-2 border-orange-500/40 pl-2 text-xs leading-5 text-slate-400">{job.requirements}</p>
                          </details>
                        )}
                        <p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-slate-500">🕐 {TEXTS.posted[lang]} {job.postedDate}</p>
                      </div>
                      <div className="flex flex-col gap-2 opacity-100 sm:opacity-70 sm:transition sm:group-hover:opacity-100">
                        <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 text-slate-400 transition hover:border-blue-400 hover:bg-blue-500/10 hover:text-blue-300" onClick={() => startEdit(job)} aria-label={TEXTS.edit[lang]}>
                          <EditIcon />
                        </button>
                        <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 text-slate-400 transition hover:border-red-400 hover:bg-red-500/10 hover:text-red-300" onClick={() => removeJob(job.id)} aria-label={TEXTS.remove[lang]}>
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <Link to="/career" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-3 text-sm font-bold text-orange-300 transition hover:border-orange-400 hover:bg-orange-500/10">
              <EyeIcon /> {TEXTS.viewCareer[lang]}
            </Link>
          </div>
        </aside>
      </section>
    </div>
  )
}

const Stat = ({ value, label }) => (
  <div className="min-w-[86px] rounded-xl bg-slate-900/70 px-4 py-3 text-center ring-1 ring-slate-700/60">
    <p className="text-2xl font-black text-white">{value}</p>
    <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">{label}</p>
  </div>
)

const Field = ({ label, badge, error, muted = false, children }) => (
  <label className="block space-y-2">
    <span className="flex items-center justify-between gap-3 text-sm font-bold text-slate-200">
      <span>{label}</span>
      {badge && <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${muted ? 'bg-slate-800 text-slate-500' : 'bg-orange-500/10 text-orange-300'}`}>{badge}</span>}
    </span>
    {children}
    {error && <span className="block text-xs font-semibold text-red-300">{error}</span>}
  </label>
)

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)

const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
)

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)

export default Addjobs