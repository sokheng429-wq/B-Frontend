/* ============================================================
   B'GROCERIES — DEMO ORDER DATA
   Shared by the Order History page and the Tracking page.
   Each order references real products from the catalog.
   ============================================================ */

import { PRODUCTS } from './products'

const p = (id) => PRODUCTS.find((x) => x.id === id)

/* Stage → tracking step:
   processing = order placed + being packed (current step 2)
   transit    = out for delivery            (current step 3)
   delivered  = done                        (current step 4) */
export const STEPS = [
  { key: 'placed', icon: '📝', label: { en: 'Order placed', kh: 'បានបញ្ជាទិញ' } },
  { key: 'packed', icon: '📦', label: { en: 'Packed', kh: 'បានវេចខ្ចប់' } },
  { key: 'transit', icon: '🛵', label: { en: 'Out for delivery', kh: 'កំពុងដឹកជញ្ជូន' } },
  { key: 'delivered', icon: '✅', label: { en: 'Delivered', kh: 'បានដឹកជញ្ជូន' } },
]

export const STAGE_STEP = {
  processing: 2,
  transit: 3,
  delivered: 4,
}

export const STATUS_LABEL = {
  processing: { en: 'Processing', kh: 'កំពុងដំណើរការ' },
  transit: { en: 'In Transit', kh: 'កំពុងដឹកជញ្ជូន' },
  delivered: { en: 'Delivered', kh: 'បានដឹកជញ្ជូន' },
}

const courier = (name, phone, vehicle) => ({ name, phone, vehicle })

export const ORDERS = [
  {
    id: 'BG-1087',
    date: '2026-08-16',
    stage: 'processing',
    items: [
      { product: p(71), qty: 1 },
      { product: p(27), qty: 2 },
      { product: p(30), qty: 1 },
    ],
    delivery: { fee: 0, label: { en: 'Free delivery', kh: 'ដឹកជញ្ជូនឥតគិតថ្លៃ' } },
    courier: courier('Sok Dara', '+855 12 345 678', 'Honda Wave'),
    eta: { en: 'Arriving in ~25 min', kh: 'នឹងមកដល់ក្នុង ~២៥ នាទី' },
    timeline: [
      { time: '10:04 AM', label: { en: 'Order placed', kh: 'បានបញ្ជាទិញ' } },
      { time: '10:09 AM', label: { en: 'Payment confirmed', kh: 'ការទូទាត់បានបញ្ជាក់' } },
      { time: '10:12 AM', label: { en: 'Being packed at the store', kh: 'កំពុងវេចខ្ចប់នៅហាង' } },
    ],
  },
  {
    id: 'BG-1076',
    date: '2026-08-15',
    stage: 'transit',
    items: [
      { product: p(17), qty: 2 },
      { product: p(48), qty: 1 },
      { product: p(37), qty: 1 },
      { product: p(14), qty: 2 },
    ],
    delivery: { fee: 0.9, label: { en: 'Express delivery', kh: 'ដឹកជញ្ជូនលឿន' } },
    courier: courier('Chan Rithy', '+855 97 876 543', 'Yamaha Nuvo'),
    eta: { en: 'Arriving in ~12 min', kh: 'នឹងមកដល់ក្នុង ~១២ នាទី' },
    timeline: [
      { time: '3:21 PM', label: { en: 'Order placed', kh: 'បានបញ្ជាទិញ' } },
      { time: '3:25 PM', label: { en: 'Payment confirmed', kh: 'ការទូទាត់បានបញ្ជាក់' } },
      { time: '3:30 PM', label: { en: 'Packed and ready', kh: 'បានវេចខ្ចប់រួចរាល់' } },
      { time: '3:41 PM', label: { en: 'Rider on the way to you', kh: 'អ្នកដឹកជញ្ជូនកំពុងមករកអ្នក' } },
    ],
  },
  {
    id: 'BG-1063',
    date: '2026-08-14',
    stage: 'delivered',
    items: [
      { product: p(73), qty: 1 },
      { product: p(22), qty: 1 },
      { product: p(57), qty: 2 },
    ],
    delivery: { fee: 0, label: { en: 'Free delivery', kh: 'ដឹកជញ្ជូនឥតគិតថ្លៃ' } },
    courier: courier('Sreymom K.', '+855 16 222 901', 'Honda Click'),
    eta: { en: 'Delivered Aug 14, 6:32 PM', kh: 'បានដឹកជញ្ជូន ថ្ងៃទី ១៤ សីហា វេលាម៉ោង ៦:៣២ ល្ងាច' },
    timeline: [
      { time: '5:58 PM', label: { en: 'Order placed', kh: 'បានបញ្ជាទិញ' } },
      { time: '6:02 PM', label: { en: 'Payment confirmed', kh: 'ការទូទាត់បានបញ្ជាក់' } },
      { time: '6:10 PM', label: { en: 'Packed and ready', kh: 'បានវេចខ្ចប់រួចរាល់' } },
      { time: '6:16 PM', label: { en: 'Out for delivery', kh: 'កំពុងដឹកជញ្ជូន' } },
      { time: '6:32 PM', label: { en: 'Delivered — enjoy!', kh: 'បានដឹកជញ្ជូន — រីករាយ!' } },
    ],
  },
  {
    id: 'BG-1049',
    date: '2026-08-11',
    stage: 'delivered',
    items: [
      { product: p(1), qty: 6 },
      { product: p(8), qty: 2 },
      { product: p(40), qty: 1 },
    ],
    delivery: { fee: 0.9, label: { en: 'Express delivery', kh: 'ដឹកជញ្ជូនលឿន' } },
    courier: courier('Vathana L.', '+855 61 555 432', 'Vision 110'),
    eta: { en: 'Delivered Aug 11, 11:08 AM', kh: 'បានដឹកជញ្ជូន ថ្ងៃទី ១១ សីហា វេលាម៉ោង ១១:០៨ ព្រឹក' },
    timeline: [
      { time: '10:41 AM', label: { en: 'Order placed', kh: 'បានបញ្ជាទិញ' } },
      { time: '10:52 AM', label: { en: 'Out for delivery', kh: 'កំពុងដឹកជញ្ជូន' } },
      { time: '11:08 AM', label: { en: 'Delivered — enjoy!', kh: 'បានដឹកជញ្ជូន — រីករាយ!' } },
    ],
  },
  {
    id: 'BG-1031',
    date: '2026-08-08',
    stage: 'delivered',
    items: [
      { product: p(15), qty: 3 },
      { product: p(12), qty: 4 },
    ],
    delivery: { fee: 0, label: { en: 'Free delivery', kh: 'ដឹកជញ្ជូនឥតគិតថ្លៃ' } },
    courier: courier('Kimhout S.', '+855 15 987 210', 'Honda Dash'),
    eta: { en: 'Delivered Aug 8, 7:45 PM', kh: 'បានដឹកជញ្ជូន ថ្ងៃទី ៨ សីហា វេលាម៉ោង ៧:៤៥ ល្ងាច' },
    timeline: [
      { time: '7:12 PM', label: { en: 'Order placed', kh: 'បានបញ្ជាទិញ' } },
      { time: '7:20 PM', label: { en: 'Packed and ready', kh: 'បានវេចខ្ចប់រួចរាល់' } },
      { time: '7:45 PM', label: { en: 'Delivered — enjoy!', kh: 'បានដឹកជញ្ជូន — រីករាយ!' } },
    ],
  },
  {
    id: 'BG-1018',
    date: '2026-08-05',
    stage: 'delivered',
    items: [
      { product: p(71), qty: 2 },
      { product: p(78), qty: 1 },
      { product: p(77), qty: 2 },
    ],
    delivery: { fee: 0.9, label: { en: 'Express delivery', kh: 'ដឹកជញ្ជូនលឿន' } },
    courier: courier('Borey M.', '+855 88 456 789', 'Honda Wave'),
    eta: { en: 'Delivered Aug 5, 9:20 AM', kh: 'បានដឹកជញ្ជូន ថ្ងៃទី ៥ សីហា វេលាម៉ោង ៩:២០ ព្រឹក' },
    timeline: [
      { time: '8:54 AM', label: { en: 'Order placed', kh: 'បានបញ្ជាទិញ' } },
      { time: '9:04 AM', label: { en: 'Out for delivery', kh: 'កំពុងដឹកជញ្ជូន' } },
      { time: '9:20 AM', label: { en: 'Delivered — enjoy!', kh: 'បានដឹកជញ្ជូន — រីករាយ!' } },
    ],
  },
]

/* Pretty date: "Aug 16, 2026" / Khmer version */
export const formatOrderDate = (iso, lang) => {
  const d = new Date(`${iso}T00:00:00`)
  if (lang === 'kh') {
    const months = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ']
    return `${d.getDate()} ${months[d.getMonth()]}, ${d.getFullYear()}`
  }
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export const orderTotal = (order) =>
  order.items.reduce((sum, it) => sum + it.product.price * it.qty, 0)
