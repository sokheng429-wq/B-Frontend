// Shared Company Profile and Inventory Format Settings Utility

export const TIMEZONES = [
  { id: 'Asia/Phnom_Penh', label: '(GMT+07:00) Indochina Time - Phnom Penh, Bangkok, Jakarta', city: 'Phnom Penh', offset: '+07:00' },
  { id: 'Asia/Singapore', label: '(GMT+08:00) Singapore, Kuala Lumpur, Manila', city: 'Singapore', offset: '+08:00' },
  { id: 'Asia/Hong_Kong', label: '(GMT+08:00) Hong Kong, Beijing, Taipei', city: 'Hong Kong', offset: '+08:00' },
  { id: 'Asia/Tokyo', label: '(GMT+09:00) Tokyo, Osaka, Seoul', city: 'Tokyo', offset: '+09:00' },
  { id: 'Asia/Yangon', label: '(GMT+06:30) Yangon, Naypyidaw', city: 'Yangon', offset: '+06:30' },
  { id: 'Asia/Dhaka', label: '(GMT+06:00) Dhaka, Almaty', city: 'Dhaka', offset: '+06:00' },
  { id: 'Asia/Kolkata', label: '(GMT+05:30) Mumbai, New Delhi, Kolkata', city: 'New Delhi', offset: '+05:30' },
  { id: 'Asia/Dubai', label: '(GMT+04:00) Dubai, Abu Dhabi, Muscat', city: 'Dubai', offset: '+04:00' },
  { id: 'Europe/London', label: '(GMT+00:00) London, Dublin, Lisbon (GMT/BST)', city: 'London', offset: '+00:00' },
  { id: 'Europe/Paris', label: '(GMT+01:00) Paris, Berlin, Rome, Madrid (CET)', city: 'Paris', offset: '+01:00' },
  { id: 'Europe/Athens', label: '(GMT+02:00) Athens, Cairo, Istanbul (EET)', city: 'Athens', offset: '+02:00' },
  { id: 'America/New_York', label: '(GMT-05:00) Eastern Time - New York, Toronto, Miami', city: 'New York', offset: '-05:00' },
  { id: 'America/Chicago', label: '(GMT-06:00) Central Time - Chicago, Dallas, Houston', city: 'Chicago', offset: '-06:00' },
  { id: 'America/Denver', label: '(GMT-07:00) Mountain Time - Denver, Salt Lake City', city: 'Denver', offset: '-07:00' },
  { id: 'America/Los_Angeles', label: '(GMT-08:00) Pacific Time - Los Angeles, San Francisco, Seattle', city: 'Los Angeles', offset: '-08:00' },
  { id: 'Australia/Sydney', label: '(GMT+10:00) Sydney, Melbourne, Brisbane (AEST)', city: 'Sydney', offset: '+10:00' },
  { id: 'Pacific/Auckland', label: '(GMT+12:00) Auckland, Wellington (NZST)', city: 'Auckland', offset: '+12:00' },
  { id: 'UTC', label: '(GMT+00:00) Coordinated Universal Time (UTC)', city: 'UTC', offset: '+00:00' },
]

export const SECONDARY_CURRENCIES = [
  { code: 'KHR', symbol: '៛', name: 'Cambodian Riel', label: 'KHR (៛) - Cambodian Riel' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht', label: 'THB (฿) - Thai Baht' },
  { code: 'VND', symbol: '₫', name: 'Vietnamese Dong', label: 'VND (₫) - Vietnamese Dong' },
  { code: 'EUR', symbol: '€', name: 'Euro', label: 'EUR (€) - Euro' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', label: 'CNY (¥) - Chinese Yuan' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', label: 'SGD (S$) - Singapore Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', label: 'JPY (¥) - Japanese Yen' },
  { code: 'GBP', symbol: '£', name: 'British Pound', label: 'GBP (£) - British Pound' },
]

export const DATE_FORMATS = [
  { id: 'MM/DD/YYYY', label: 'MM/DD/YYYY (09/14/2026)', sample: '09/14/2026' },
  { id: 'DD/MM/YYYY', label: 'DD/MM/YYYY (14/09/2026)', sample: '14/09/2026' },
  { id: 'YYYY-MM-DD', label: 'YYYY-MM-DD (2026-09-14)', sample: '2026-09-14' },
  { id: 'DD-MMM-YYYY', label: 'DD-MMM-YYYY (14-Sep-2026)', sample: '14-Sep-2026' },
  { id: 'MMMM DD, YYYY', label: 'MMMM DD, YYYY (September 14, 2026)', sample: 'September 14, 2026' },
]

export const TIME_FORMATS = [
  { id: 'hh:mm A', label: 'hh:mm A (08:25 AM - 12h)', sample: '08:25 AM' },
  { id: 'hh:mm:ss A', label: 'hh:mm:ss A (08:25:00 AM - 12h with seconds)', sample: '08:25:00 AM' },
  { id: 'HH:mm', label: 'HH:mm (08:25 - 24h military)', sample: '08:25' },
  { id: 'HH:mm:ss', label: 'HH:mm:ss (08:25:00 - 24h with seconds)', sample: '08:25:00' },
]

export const NEGATIVE_PATTERNS = [
  { id: '-1,234.00', label: '-1,234.00 (Standard Minus Prefix)' },
  { id: '(1,234.00)', label: '(1,234.00) (Accounting Parentheses)' },
  { id: '1,234.00-', label: '1,234.00- (Trailing Minus Suffix)' },
]

export const DEFAULT_COMPANY_PROFILE = {
  // General Information
  company: "B'Groceries Supermarket Co., Ltd.",
  secondLanguage: "ក្រុមហ៊ុន ប៊ី ហ្រ្គូសឺរីស៍ មាត ឯ.ក",
  currency: 'USD',
  dollar: '$',
  secondCurrency: 'KHR',
  businessLicense: '00048291/2022',
  logoUrl: '',

  // Contact
  taxNo: 'K008-902203114',
  phone: '+855 (0) 23 888 999',
  email: 'bgroceriescompany@gmail.com',
  website: 'https://bgroceries.com',
  fax: '+855 (0) 23 888 998',
  mobile: '+855 (0) 12 345 678',

  // Location
  address: 'Building #18, Preah Monivong Blvd, Sangkat Boeung Keng Kang I',
  city: 'Phnom Penh',
  state: 'Phnom Penh Capital',
  postCode: '120102',
  timeZone: 'Asia/Phnom_Penh',
  country: 'Cambodia',

  // Format Settings
  dateFormat: 'MM/DD/YYYY',
  timeFormat: 'hh:mm A',
  qtyDecimal: '2',
  qtySeparator: ',',
  negativePattern: '-1,234.00',
  factorDecimal: '2',
  factorSeparator: ',',
  percentageDecimal: '2',
}

const STORAGE_KEY = 'bg_company_profile_settings'

export function getCompanySettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_COMPANY_PROFILE }
    const parsed = JSON.parse(raw)
    return { ...DEFAULT_COMPANY_PROFILE, ...parsed }
  } catch (e) {
    console.warn('Failed to parse company settings from localStorage, using default:', e)
    return { ...DEFAULT_COMPANY_PROFILE }
  }
}

export function saveCompanySettings(settings) {
  try {
    const merged = { ...getCompanySettings(), ...settings }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
    // Dispatch custom event for real-time synchronization with AdminD and other components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('company_settings_updated', { detail: merged }))
    }
    return true
  } catch (e) {
    console.error('Failed to save company settings to localStorage:', e)
    return false
  }
}

/**
 * Format a Date object according to custom date format, time format, and timezone
 */
export function formatDateTimeByPattern(
  date = new Date(),
  dateFormat = 'MM/DD/YYYY',
  timeFormat = 'hh:mm A',
  timeZone = 'Asia/Phnom_Penh'
) {
  try {
    const validZone = timeZone || 'Asia/Phnom_Penh'
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: validZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })

    const parts = formatter.formatToParts(date)
    const getPart = (type) => parts.find((p) => p.type === type)?.value || ''

    const year = getPart('year')
    const month = getPart('month')
    const day = getPart('day')
    let hour24 = parseInt(getPart('hour'), 10) || 0
    if (hour24 === 24) hour24 = 0
    const minute = getPart('minute')
    const second = getPart('second')

    const hour12Num = hour24 % 12 || 12
    const hour12 = String(hour12Num).padStart(2, '0')
    const ampm = hour24 >= 12 ? 'PM' : 'AM'
    const hour24Str = String(hour24).padStart(2, '0')

    const MONTH_NAMES_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const MONTH_NAMES_FULL = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
    const mIdx = Math.max(0, Math.min(11, (parseInt(month, 10) || 1) - 1))
    const monthShort = MONTH_NAMES_SHORT[mIdx]
    const monthFull = MONTH_NAMES_FULL[mIdx]

    let dateStr = ''
    switch (dateFormat) {
      case 'DD/MM/YYYY':
        dateStr = `${day}/${month}/${year}`
        break
      case 'YYYY-MM-DD':
        dateStr = `${year}-${month}-${day}`
        break
      case 'DD-MMM-YYYY':
        dateStr = `${day}-${monthShort}-${year}`
        break
      case 'MMMM DD, YYYY':
        dateStr = `${monthFull} ${day}, ${year}`
        break
      case 'MM/DD/YYYY':
      default:
        dateStr = `${month}/${day}/${year}`
        break
    }

    let timeStr = ''
    switch (timeFormat) {
      case 'hh:mm:ss A':
        timeStr = `${hour12}:${minute}:${second} ${ampm}`
        break
      case 'HH:mm':
        timeStr = `${hour24Str}:${minute}`
        break
      case 'HH:mm:ss':
        timeStr = `${hour24Str}:${minute}:${second}`
        break
      case 'hh:mm A':
      default:
        timeStr = `${hour12}:${minute} ${ampm}`
        break
    }

    return `${dateStr} ${timeStr}`
  } catch (err) {
    return `${dateFormat} ${timeFormat}`
  }
}

/**
 * Format quantity / number sample dynamically
 */
export function formatQuantitySample(
  val = 1234,
  decimalPlaces = 2,
  thousandSep = ',',
  negativePattern = '-1,234.00'
) {
  const dec = Math.max(0, Math.min(6, parseInt(decimalPlaces, 10) || 0))
  const fixed = Math.abs(val).toFixed(dec)
  const [intPart, decPart] = fixed.split('.')
  const sep = typeof thousandSep === 'string' ? thousandSep : ','
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, sep)
  const formattedVal = decPart ? `${formattedInt}.${decPart}` : formattedInt

  if (val < 0) {
    if (negativePattern === '(1,234.00)') return `(${formattedVal})`
    if (negativePattern === '1,234.00-') return `${formattedVal}-`
    return `-${formattedVal}`
  }
  return formattedVal
}

/**
 * Format percentage sample dynamically
 */
export function formatPercentageSample(val = 68, decimalPlaces = 2) {
  const dec = Math.max(0, Math.min(6, parseInt(decimalPlaces, 10) || 0))
  return `${val.toFixed(dec)}%`
}
