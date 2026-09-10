import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useNotifications } from '../../context/NotificationContext'
import { useTheme } from '../../context/ThemeContext'
import { exportStyledExcel } from '../../utils/excelExport'
import {
  adminStockDocAPI,
  adminReceiveDocAPI,
  adminIssueDocAPI,
  adminAdjustmentDocAPI,
  adminTransferAPI,
  adminProductAPI,
  adminCategoryAPI,
  adminBrandAPI,
  adminProductGroupAPI,
  adminSupplierAPI,
  adminOfficeAPI,
  adminSectionAPI,
  adminSaleInvoiceAPI,
  adminPurchaseOrderAPI,
  adminEnterBillAPI,
  adminCashOperationAPI,
  adminConsignmentAPI,
  adminSaleOrderAPI,
  adminWebOrderAPI,
  adminAgingInvoiceAPI,
  adminCustomerAPI,
  adminCustomerDepositAPI,
  adminSalePromotionAPI,
  adminCustomerRefundAPI,
  adminPaymentTermAPI,
} from '../../api/api'

// 3D Icons
import chartIcon from '../../assets/icon/3dicons-chart-dynamic-color.png'
import cubeIcon from '../../assets/icon/3dicons-cube-dynamic-color.png'
import moneyBagIcon from '../../assets/icon/3dicons-money-bag-dynamic-color.png'
import fileTextIcon from '../../assets/icon/3dicons-file-text-dynamic-color.png'
import travelIcon from '../../assets/icon/3dicons-travel-dynamic-color.png'
import calculatorIcon from '../../assets/icon/3dicons-calculator-dynamic-color.png'
import creditCardIcon from '../../assets/icon/3dicons-credit-card-dynamic-color.png'
import walletIcon from '../../assets/icon/3dicons-wallet-dynamic-color.png'
import dollarIcon from '../../assets/icon/3dicons-dollar-dynamic-color.png'
import toolsIcon from '../../assets/icon/3dicons-tools-dynamic-color.png'
import clockIcon from '../../assets/icon/3dicons-clock-dynamic-color.png'
import targetIcon from '../../assets/icon/3dicons-target-dynamic-color.png'
import forwardIcon from '../../assets/icon/3dicons-forward-dynamic-color.png'
import flashIcon from '../../assets/icon/3dicons-flash-dynamic-color.png'
import callInIcon from '../../assets/icon/3dicons-call-in-dynamic-color.png'
import callOutIcon from '../../assets/icon/3dicons-call-out-dynamic-color.png'
import './ProductsHub.css'

// 1. THE 7 MAIN REPORT MODULES
export const REPORT_MODULES = [
  {
    key: 'stock',
    icon: cubeIcon,
    en: 'Stock',
    kh: 'ស្តុក',
    descEn: 'View report of stock',
    descKh: 'មើលរបាយការណ៍ស្តុក',
    color: '#3B82F6',
    bg: 'rgba(59, 130, 246, 0.12)',
    route: '/admin/report/stock',
    tag: '11 Reports',
  },
  {
    key: 'sale-payment',
    icon: moneyBagIcon,
    en: 'Sale Payment',
    kh: 'ការទូទាត់លក់',
    descEn: 'View report of sale payment',
    descKh: 'មើលរបាយការណ៍ការទូទាត់លក់',
    color: '#77BC1F',
    bg: 'rgba(119, 188, 31, 0.12)',
    route: '/admin/report/sale-payment',
    tag: '15 Reports',
  },
  {
    key: 'order-management',
    icon: fileTextIcon,
    en: 'Order Management',
    kh: 'ការគ្រប់គ្រងការបញ្ជាទិញ',
    descEn: 'View report of order management',
    descKh: 'មើលរបាយការណ៍ការគ្រប់គ្រងការបញ្ជាទិញ',
    color: '#FF9900',
    bg: 'rgba(255, 153, 0, 0.12)',
    route: '/admin/report/order-management',
    tag: '2 Reports',
  },
  {
    key: 'consignment',
    icon: travelIcon,
    en: 'Consignment',
    kh: 'ការលក់បញ្ញើ',
    descEn: 'View report of Consignment',
    descKh: 'មើលរបាយការណ៍ការលក់បញ្ញើ',
    color: '#a855f7',
    bg: 'rgba(168, 85, 247, 0.12)',
    route: '/admin/report/consignment',
    tag: '2 Reports',
  },
  {
    key: 'purchase-management',
    icon: calculatorIcon,
    en: 'Purchase Management',
    kh: 'ការគ្រប់គ្រងការទិញ',
    descEn: 'View report of purchase management',
    descKh: 'មើលរបាយការណ៍ការគ្រប់គ្រងការទិញ',
    color: '#06b6d4',
    bg: 'rgba(6, 182, 212, 0.12)',
    route: '/admin/report/purchase-management',
    tag: '4 Reports',
  },
  {
    key: 'payable-management',
    icon: creditCardIcon,
    en: 'Payable Management',
    kh: 'ការគ្រប់គ្រងបំណុល',
    descEn: 'View report of payable management',
    descKh: 'មើលរបាយការណ៍ការគ្រប់គ្រងបំណុល',
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.12)',
    route: '/admin/report/payable-management',
    tag: '7 Reports',
  },
  {
    key: 'cash-book',
    icon: walletIcon,
    en: 'Cash Book',
    kh: 'សៀវភៅលុយ',
    descEn: 'View report of cash book',
    descKh: 'មើលរបាយការណ៍សៀវភៅលុយ',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.12)',
    route: '/admin/report/cash-book',
    tag: '3 Reports',
  },
]

// Exact Entity Column Schemas for the 11 Stock Reports as requested by user
export const STOCK_REPORT_SCHEMAS = {
  received: ['documentCode', 'date', 'currency', 'supplier', 'receivedBy', 'totalCost'],
  'request-transfer': ['productCode', 'barcode', 'description', 'uom', 'requestQty', 'shipQty', 'acceptQty', 'closedQty', 'voidedQty', 'remainQty'],
  'ship-request-transfer': ['productCode', 'barcode', 'description', 'uom', 'shipQty', 'acceptQty', 'rejectQty', 'remainQty'],
  transferred: ['currency', 'fromOutlet', 'toOutlet', 'qty', 'cost', 'totalCost'],
  adjustment: ['currency', 'date', 'supplier', 'qty', 'totalCost'],
  issued: ['currency', 'totalCost'],
  'inventory-list': ['outlet', 'productCode', 'barcode', 'description', 'qty', 'uom', 'avgCost', 'lastCost', 'totalCost', 'price', 'totalPrice'],
  'price-list': ['code', 'barcode', 'description', 'uom', 'basePrice'],
  'transaction-history': ['transactionType', 'document', 'date', 'productCode', 'description', 'outlet', 'location', 'qty', 'stockUom', 'tranUom', 'cost', 'amount', 'balanceQty'],
  'order-point': ['productCode', 'description', 'onhand', 'uom', 'orderPoint', 'orderQuantity'],
  'stock-evaluation': ['productCode', 'description', 'uom', 'beginning', 'receive', 'issue', 'adjust', 'transferIn', 'transferOut', 'sale', 'return', 'balance'],
}

// Realistic Product Catalog for Product Search Modal & Live Filtering
export const STOCK_CATALOG_PRODUCTS = [
  { id: 1, code: 'PRD-001', barcode: '8850124001', title: 'Organic Jasmine Rice 5kg', category: 'Grains', brand: 'Heritage Organic', uom: 'Bag', costPrice: 4.50, sellingPrice: 6.80, onHand: 120 },
  { id: 2, code: 'PRD-002', barcode: '8850124002', title: 'Fresh Organic Milk 1L', category: 'Dairy', brand: 'Angkor Harvest', uom: 'Carton', costPrice: 1.80, sellingPrice: 2.75, onHand: 85 },
  { id: 3, code: 'PRD-003', barcode: '8850124003', title: 'Australian Angus Beef 500g', category: 'Meat', brand: 'CP Foods', uom: 'Pack', costPrice: 8.50, sellingPrice: 12.90, onHand: 42 },
  { id: 4, code: 'PRD-004', barcode: '8850124004', title: 'Pure Mineral Water 500ml', category: 'Beverages', brand: 'Angkor Harvest', uom: 'Case', costPrice: 3.20, sellingPrice: 5.00, onHand: 160 },
  { id: 5, code: 'PRD-005', barcode: '8850124005', title: 'Farm Fresh Large Eggs 30s', category: 'Dairy', brand: 'CP Foods', uom: 'Tray', costPrice: 3.80, sellingPrice: 5.50, onHand: 95 },
  { id: 6, code: 'PRD-006', barcode: '8850124006', title: 'Extra Virgin Olive Oil 750ml', category: 'Pantry Staples', brand: 'Heritage Organic', uom: 'Bottle', costPrice: 6.90, sellingPrice: 10.50, onHand: 55 },
  { id: 7, code: 'PRD-007', barcode: '8850124007', title: 'Whole Wheat Sandwich Bread', category: 'Bakery', brand: 'Lucky Local', uom: 'Loaf', costPrice: 1.40, sellingPrice: 2.20, onHand: 40 },
  { id: 8, code: 'PRD-008', barcode: '8850124008', title: 'Organic Green Apples 1kg', category: 'Produce', brand: 'Heritage Organic', uom: 'Bag', costPrice: 2.90, sellingPrice: 4.50, onHand: 70 },
  { id: 9, code: 'PRD-009', barcode: '8850124009', title: 'Kampot Black Pepper 100g', category: 'Spices', brand: 'Angkor Harvest', uom: 'Jar', costPrice: 3.50, sellingPrice: 5.90, onHand: 110 },
  { id: 10, code: 'PRD-010', barcode: '8850124010', title: 'Arabica Coffee Beans 250g', category: 'Beverages', brand: 'Lucky Local', uom: 'Pack', costPrice: 4.80, sellingPrice: 7.50, onHand: 65 },
  { id: 11, code: 'PRD-011', barcode: '8850124011', title: 'Wild Blossom Honey 500g', category: 'Pantry Staples', brand: 'Heritage Organic', uom: 'Jar', costPrice: 4.20, sellingPrice: 6.50, onHand: 50 },
  { id: 12, code: 'PRD-012', barcode: '8850124012', title: 'Organic Broccoli Florets 400g', category: 'Produce', brand: 'Lucky Local', uom: 'Pack', costPrice: 1.50, sellingPrice: 2.40, onHand: 35 },
]

// 2. THE 11 STOCK SUB-REPORTS SPECIFIED BY USER
export const STOCK_REPORTS = [
  {
    key: 'received',
    icon: callInIcon,
    en: 'Received',
    kh: 'បញ្ជីបានទទួល',
    descEn: 'View report of received goods',
    descKh: 'មើលរបាយការណ៍បញ្ជីបានទទួល',
    color: '#10B981',
    bg: 'rgba(16, 185, 129, 0.12)',
    route: '/admin/report/stock/received',
  },
  {
    key: 'request-transfer',
    icon: flashIcon,
    en: 'Request Transfer',
    kh: 'ស្នើសុំផ្ទេរ',
    descEn: 'View report of request transfer',
    descKh: 'មើលរបាយការណ៍ស្នើសុំផ្ទេរ',
    color: '#6366F1',
    bg: 'rgba(99, 102, 241, 0.12)',
    route: '/admin/report/stock/request-transfer',
  },
  {
    key: 'ship-request-transfer',
    icon: travelIcon,
    en: 'Ship Request Transfer',
    kh: 'ដឹកជញ្ជូនផ្ទេរ',
    descEn: 'View report of ship request transfer',
    descKh: 'មើលរបាយការណ៍ដឹកជញ្ជូនផ្ទេរ',
    color: '#06B6D4',
    bg: 'rgba(6, 182, 212, 0.12)',
    route: '/admin/report/stock/ship-request-transfer',
  },
  {
    key: 'transferred',
    icon: forwardIcon,
    en: 'Transferred Report',
    kh: 'របាយការណ៍បានផ្ទេរ',
    descEn: 'View report of transfer',
    descKh: 'មើលរបាយការណ៍បានផ្ទេរ',
    color: '#8B5CF6',
    bg: 'rgba(139, 92, 246, 0.12)',
    route: '/admin/report/stock/transferred',
  },
  {
    key: 'adjustment',
    icon: toolsIcon,
    en: 'Adjustment',
    kh: 'កែតម្រូវ',
    descEn: 'View report of adjustment',
    descKh: 'មើលរបាយការណ៍កែតម្រូវ',
    color: '#F59E0B',
    bg: 'rgba(245, 158, 11, 0.12)',
    route: '/admin/report/stock/adjustment',
  },
  {
    key: 'issued',
    icon: callOutIcon,
    en: 'Issued',
    kh: 'បញ្ចេញទំនិញ',
    descEn: 'View report of issue',
    descKh: 'មើលរបាយការណ៍បញ្ចេញទំនិញ',
    color: '#EC4899',
    bg: 'rgba(236, 72, 153, 0.12)',
    route: '/admin/report/stock/issued',
  },
  {
    key: 'inventory-list',
    icon: cubeIcon,
    en: 'Inventory List',
    kh: 'បញ្ជីសារពើភ័ណ្ឌ',
    descEn: 'View report of inventory list',
    descKh: 'មើលរបាយការណ៍បញ្ជីសារពើភ័ណ្ឌ',
    color: '#3B82F6',
    bg: 'rgba(59, 130, 246, 0.12)',
    route: '/admin/report/stock/inventory-list',
  },
  {
    key: 'price-list',
    icon: dollarIcon,
    en: 'Price List',
    kh: 'តារាងតម្លៃ',
    descEn: 'View report of price list',
    descKh: 'មើលរបាយការណ៍តារាងតម្លៃ',
    color: '#77BC1F',
    bg: 'rgba(119, 188, 31, 0.12)',
    route: '/admin/report/stock/price-list',
  },
  {
    key: 'transaction-history',
    icon: clockIcon,
    en: 'Transaction History',
    kh: 'ប្រវត្តិប្រតិបត្តិការ',
    descEn: 'View report of transaction history',
    descKh: 'មើលរបាយការណ៍ប្រវត្តិប្រតិបត្តិការ',
    color: '#EAB308',
    bg: 'rgba(234, 179, 8, 0.12)',
    route: '/admin/report/stock/transaction-history',
  },
  {
    key: 'order-point',
    icon: targetIcon,
    en: 'Order Point',
    kh: 'ចំណុចបញ្ជាទិញ',
    descEn: 'View report of order point',
    descKh: 'មើលរបាយការណ៍ចំណុចបញ្ជាទិញ',
    color: '#EF4444',
    bg: 'rgba(239, 68, 68, 0.12)',
    route: '/admin/report/stock/order-point',
  },
  {
    key: 'stock-evaluation',
    icon: chartIcon,
    en: 'Stock Evaluation',
    kh: 'ការវាយតម្លៃស្តុក',
    descEn: 'View report of stock evaluation',
    descKh: 'មើលរបាយការណ៍វាយតម្លៃស្តុក',
    color: '#14B8A6',
    bg: 'rgba(20, 184, 166, 0.12)',
    route: '/admin/report/stock/stock-evaluation',
  },
]

// 3. THE 15 SALE PAYMENT SUB-REPORTS SPECIFIED BY USER
export const SALE_PAYMENT_REPORTS = [
  {
    key: 'end-of-day',
    icon: clockIcon,
    en: 'End of Day',
    kh: 'បិទបញ្ជីចុងថ្ងៃ',
    descEn: 'View report of end of day',
    descKh: 'មើលរបាយការណ៍បិទបញ្ជីចុងថ្ងៃ',
    color: '#3B82F6',
    bg: 'rgba(59, 130, 246, 0.12)',
    route: '/admin/report/sale-payment/end-of-day',
  },
  {
    key: 'sale-transaction',
    icon: moneyBagIcon,
    en: 'Sale Transaction',
    kh: 'ប្រតិបត្តិការលក់',
    descEn: 'View report of sale transaction',
    descKh: 'មើលរបាយការណ៍ប្រតិបត្តិការលក់',
    color: '#10B981',
    bg: 'rgba(16, 185, 129, 0.12)',
    route: '/admin/report/sale-payment/sale-transaction',
  },
  {
    key: 'aging-invoice',
    icon: fileTextIcon,
    en: 'Aging Invoice',
    kh: 'វិក្កយបត្រតាមអាយុកាល',
    descEn: 'View report of aging invoice',
    descKh: 'មើលរបាយការណ៍វិក្កយបត្រតាមអាយុកាល',
    color: '#EF4444',
    bg: 'rgba(239, 68, 68, 0.12)',
    route: '/admin/report/sale-payment/aging-invoice',
  },
  {
    key: 'payment-gateway',
    icon: creditCardIcon,
    en: 'Payment Gateway',
    kh: 'ច្រកទូទាត់ប្រាក់',
    descEn: 'View report of payment gateway',
    descKh: 'មើលរបាយការណ៍ច្រកទូទាត់ប្រាក់',
    color: '#6366F1',
    bg: 'rgba(99, 102, 241, 0.12)',
    route: '/admin/report/sale-payment/payment-gateway',
  },
  {
    key: 'customer-balance',
    icon: walletIcon,
    en: 'Customer Balance',
    kh: 'សមតុល្យអតិថិជន',
    descEn: 'View report of customer balance',
    descKh: 'មើលរបាយការណ៍សមតុល្យអតិថិជន',
    color: '#F59E0B',
    bg: 'rgba(245, 158, 11, 0.12)',
    route: '/admin/report/sale-payment/customer-balance',
  },
  {
    key: 'customer-credit-deposit',
    icon: dollarIcon,
    en: 'Customer Credit & Deposit',
    kh: 'ឥណទាន និងប្រាក់កក់អតិថិជន',
    descEn: 'View report of customer credit & deposit',
    descKh: 'មើលរបាយការណ៍ឥណទាន និងប្រាក់កក់អតិថិជន',
    color: '#06B6D4',
    bg: 'rgba(6, 182, 212, 0.12)',
    route: '/admin/report/sale-payment/customer-credit-deposit',
  },
  {
    key: 'invoice-payment',
    icon: calculatorIcon,
    en: 'Invoice Payment',
    kh: 'ការទូទាត់វិក្កយបត្រ',
    descEn: 'View report of invoice payment',
    descKh: 'មើលរបាយការណ៍ការទូទាត់វិក្កយបត្រ',
    color: '#8B5CF6',
    bg: 'rgba(139, 92, 246, 0.12)',
    route: '/admin/report/sale-payment/invoice-payment',
  },
  {
    key: 'ar-invoice-status',
    icon: targetIcon,
    en: 'AR Invoice Status',
    kh: 'ស្ថានភាពវិក្កយបត្រ AR',
    descEn: 'View report of ar invoice status',
    descKh: 'មើលរបាយការណ៍ស្ថានភាពវិក្កយបត្រ AR',
    color: '#EC4899',
    bg: 'rgba(236, 72, 153, 0.12)',
    route: '/admin/report/sale-payment/ar-invoice-status',
  },
  {
    key: 'top-bottom-sale',
    icon: chartIcon,
    en: 'Top and Bottom Sale',
    kh: 'ការលក់ច្រើន និងតិចបំផុត',
    descEn: 'View report of top & bottom sale',
    descKh: 'មើលរបាយការណ៍ការលក់ច្រើន និងតិចបំផុត',
    color: '#EAB308',
    bg: 'rgba(234, 179, 8, 0.12)',
    route: '/admin/report/sale-payment/top-bottom-sale',
  },
  {
    key: 'cash-receipt',
    icon: callInIcon,
    en: 'Cash Receipt',
    kh: 'បង្កាន់ដៃសាច់ប្រាក់',
    descEn: 'View report of cash receipt',
    descKh: 'មើលរបាយការណ៍បង្កាន់ដៃសាច់ប្រាក់',
    color: '#14B8A6',
    bg: 'rgba(20, 184, 166, 0.12)',
    route: '/admin/report/sale-payment/cash-receipt',
  },
  {
    key: 'profits',
    icon: dollarIcon,
    en: 'Profits',
    kh: 'ប្រាក់ចំណេញ',
    descEn: 'View report of profit',
    descKh: 'មើលរបាយការណ៍ប្រាក់ចំណេញ',
    color: '#77BC1F',
    bg: 'rgba(119, 188, 31, 0.12)',
    route: '/admin/report/sale-payment/profits',
  },
  {
    key: 'sale-payment-type',
    icon: creditCardIcon,
    en: 'Sale Payment Type',
    kh: 'ប្រភេទនៃការទូទាត់លក់',
    descEn: 'View report of sale payment type',
    descKh: 'មើលរបាយការណ៍ប្រភេទនៃការទូទាត់លក់',
    color: '#3B82F6',
    bg: 'rgba(59, 130, 246, 0.12)',
    route: '/admin/report/sale-payment/sale-payment-type',
  },
  {
    key: 'close-shift',
    icon: clockIcon,
    en: 'Close Shift',
    kh: 'បិទវេនលក់',
    descEn: 'View report of close shift report',
    descKh: 'មើលរបាយការណ៍បិទវេនលក់',
    color: '#F97316',
    bg: 'rgba(249, 115, 22, 0.12)',
    route: '/admin/report/sale-payment/close-shift',
  },
  {
    key: 'sale-promotion-report',
    icon: flashIcon,
    en: 'Sale Promotion Report',
    kh: 'របាយការណ៍ប្រូម៉ូសិនលក់',
    descEn: 'View of sale promotion report',
    descKh: 'មើលរបាយការណ៍ប្រូម៉ូសិនលក់',
    color: '#D946EF',
    bg: 'rgba(217, 70, 239, 0.12)',
    route: '/admin/report/sale-payment/sale-promotion-report',
  },
  {
    key: 'sale-package-item-report',
    icon: cubeIcon,
    en: 'Sale Package Item Report',
    kh: 'របាយការណ៍កញ្ចប់ទំនិញលក់',
    descEn: 'View of sale package item report',
    descKh: 'មើលរបាយការណ៍កញ្ចប់ទំនិញលក់',
    color: '#84CC16',
    bg: 'rgba(132, 204, 22, 0.12)',
    route: '/admin/report/sale-payment/sale-package-item-report',
  },
]

// 4. THE 2 ORDER MANAGEMENT SUB-REPORTS
export const ORDER_MANAGEMENT_REPORTS = [
  {
    key: 'sale-order-status',
    icon: fileTextIcon,
    en: 'Sale Order Status',
    kh: 'ស្ថានភាពការបញ្ជាទិញលក់',
    descEn: 'View report of sale order status',
    descKh: 'មើលរបាយការណ៍ស្ថានភាពការបញ្ជាទិញលក់',
    color: '#FF9900',
    bg: 'rgba(255, 153, 0, 0.12)',
    route: '/admin/report/order-management/sale-order-status',
  },
  {
    key: 'sale-order-shipment',
    icon: travelIcon,
    en: 'Sale Order Shipment',
    kh: 'ការដឹកជញ្ជូនការបញ្ជាទិញលក់',
    descEn: 'View report of sale order shipment',
    descKh: 'មើលរបាយការណ៍ដឹកជញ្ជូនការបញ្ជាទិញលក់',
    color: '#3B82F6',
    bg: 'rgba(59, 130, 246, 0.12)',
    route: '/admin/report/order-management/sale-order-shipment',
  },
]

// 5. THE 2 CONSIGNMENT SUB-REPORTS
export const CONSIGNMENT_REPORTS = [
  {
    key: 'consignment-shipment',
    icon: travelIcon,
    en: 'Consignment Shipment',
    kh: 'ការដឹកជញ្ជូនទំនិញបញ្ញើ',
    descEn: 'View report of consignment shipment',
    descKh: 'មើលរបាយការណ៍ដឹកជញ្ជូនទំនិញបញ្ញើ',
    color: '#A855F7',
    bg: 'rgba(168, 85, 247, 0.12)',
    route: '/admin/report/consignment/consignment-shipment',
  },
  {
    key: 'consignment-status-report',
    icon: targetIcon,
    en: 'Consignment Status Report',
    kh: 'របាយការណ៍ស្ថានភាពទំនិញបញ្ញើ',
    descEn: 'View report of consignment status',
    descKh: 'មើលរបាយការណ៍ស្ថានភាពទំនិញបញ្ញើ',
    color: '#10B981',
    bg: 'rgba(16, 185, 129, 0.12)',
    route: '/admin/report/consignment/consignment-status-report',
  },
]

// 6. THE 4 PURCHASE MANAGEMENT SUB-REPORTS
export const PURCHASE_MANAGEMENT_REPORTS = [
  {
    key: 'requisition',
    icon: fileTextIcon,
    en: 'Requisition',
    kh: 'ការស្នើសុំទិញទំនិញ',
    descEn: 'View report of purchase requisition',
    descKh: 'មើលរបាយការណ៍ស្នើសុំទិញទំនិញ',
    color: '#06B6D4',
    bg: 'rgba(6, 182, 212, 0.12)',
    route: '/admin/report/purchase-management/requisition',
  },
  {
    key: 'purchase-order-status',
    icon: calculatorIcon,
    en: 'Purchase Order Status',
    kh: 'ស្ថានភាពការបញ្ជាទិញ',
    descEn: 'View report of purchase order status',
    descKh: 'មើលរបាយការណ៍ស្ថានភាពបញ្ជាទិញ',
    color: '#3B82F6',
    bg: 'rgba(59, 130, 246, 0.12)',
    route: '/admin/report/purchase-management/purchase-order-status',
  },
  {
    key: 'purchase-order-products-status',
    icon: cubeIcon,
    en: 'Purchase Order Products Status',
    kh: 'ស្ថានភាពទំនិញតាមការបញ្ជាទិញ',
    descEn: 'View report of purchase order products status',
    descKh: 'មើលរបាយការណ៍ស្ថានភាពទំនិញតាមការបញ្ជាទិញ',
    color: '#F59E0B',
    bg: 'rgba(245, 158, 11, 0.12)',
    route: '/admin/report/purchase-management/purchase-order-products-status',
  },
  {
    key: 'receive-return-purchase-order',
    icon: callInIcon,
    en: 'Receive / Return Purchase Order',
    kh: 'ការទទួល និងបង្វិលការបញ្ជាទិញ',
    descEn: 'View report of receive & return purchase order',
    descKh: 'មើលរបាយការណ៍ទទួល និងបង្វិលសងការបញ្ជាទិញ',
    color: '#EF4444',
    bg: 'rgba(239, 68, 68, 0.12)',
    route: '/admin/report/purchase-management/receive-return-purchase-order',
  },
]

// 7. THE 7 PAYABLE MANAGEMENT SUB-REPORTS
export const PAYABLE_MANAGEMENT_REPORTS = [
  {
    key: 'bill-aging',
    icon: clockIcon,
    en: 'Bill Aging',
    kh: 'វិក្កយបត្របំណុលតាមអាយុកាល',
    descEn: 'View report of bill aging',
    descKh: 'មើលរបាយការណ៍វិក្កយបត្របំណុលតាមអាយុកាល',
    color: '#EF4444',
    bg: 'rgba(239, 68, 68, 0.12)',
    route: '/admin/report/payable-management/bill-aging',
  },
  {
    key: 'bill-payment',
    icon: creditCardIcon,
    en: 'Bill Payment',
    kh: 'ការទូទាត់វិក្កយបត្របំណុល',
    descEn: 'View report of bill payment',
    descKh: 'មើលរបាយការណ៍ការទូទាត់វិក្កយបត្របំណុល',
    color: '#10B981',
    bg: 'rgba(16, 185, 129, 0.12)',
    route: '/admin/report/payable-management/bill-payment',
  },
  {
    key: 'bill-status',
    icon: fileTextIcon,
    en: 'Bill Status',
    kh: 'ស្ថានភាពវិក្កយបត្របំណុល',
    descEn: 'View report of bill status',
    descKh: 'មើលរបាយការណ៍ស្ថានភាពវិក្កយបត្របំណុល',
    color: '#3B82F6',
    bg: 'rgba(59, 130, 246, 0.12)',
    route: '/admin/report/payable-management/bill-status',
  },
  {
    key: 'freight-status',
    icon: travelIcon,
    en: 'Freight Status',
    kh: 'ស្ថានភាពថ្លៃដឹកជញ្ជូន',
    descEn: 'View report of freight status',
    descKh: 'មើលរបាយការណ៍ស្ថានភាពថ្លៃដឹកជញ្ជូន',
    color: '#F59E0B',
    bg: 'rgba(245, 158, 11, 0.12)',
    route: '/admin/report/payable-management/freight-status',
  },
  {
    key: 'supplier-deposit-debit',
    icon: dollarIcon,
    en: 'Supplier Deposit / Debit',
    kh: 'ប្រាក់កក់ និងឥណពន្ធអ្នកផ្គត់ផ្គង់',
    descEn: 'View report of supplier deposit & debit',
    descKh: 'មើលរបាយការណ៍ប្រាក់កក់ និងឥណពន្ធអ្នកផ្គត់ផ្គង់',
    color: '#8B5CF6',
    bg: 'rgba(139, 92, 246, 0.12)',
    route: '/admin/report/payable-management/supplier-deposit-debit',
  },
  {
    key: 'ap-cash-payment',
    icon: walletIcon,
    en: 'AP Cash Payment',
    kh: 'ការទូទាត់សាច់ប្រាក់បំណុល (AP)',
    descEn: 'View report of AP cash payment',
    descKh: 'មើលរបាយការណ៍ការទូទាត់សាច់ប្រាក់បំណុល',
    color: '#14B8A6',
    bg: 'rgba(20, 184, 166, 0.12)',
    route: '/admin/report/payable-management/ap-cash-payment',
  },
  {
    key: 'supplier-list',
    icon: targetIcon,
    en: 'Supplier List',
    kh: 'បញ្ជីអ្នកផ្គត់ផ្គង់',
    descEn: 'View report of supplier list',
    descKh: 'មើលរបាយការណ៍បញ្ជីអ្នកផ្គត់ផ្គង់',
    color: '#6366F1',
    bg: 'rgba(99, 102, 241, 0.12)',
    route: '/admin/report/payable-management/supplier-list',
  },
]

// 8. THE 3 CASH BOOK SUB-REPORTS
export const CASH_BOOK_REPORTS = [
  {
    key: 'cash-in-out-status',
    icon: callInIcon,
    en: 'Cash In / Out Status',
    kh: 'ស្ថានភាពចំណូល និងចំណាយសាច់ប្រាក់',
    descEn: 'View report of cash in & out status',
    descKh: 'មើលរបាយការណ៍ចំណូល និងចំណាយសាច់ប្រាក់',
    color: '#10B981',
    bg: 'rgba(16, 185, 129, 0.12)',
    route: '/admin/report/cash-book/cash-in-out-status',
  },
  {
    key: 'cash-statement',
    icon: fileTextIcon,
    en: 'Cash Statement',
    kh: 'របាយការណ៍ចរន្តសាច់ប្រាក់',
    descEn: 'View report of cash statement',
    descKh: 'មើលរបាយការណ៍ចរន្តសាច់ប្រាក់',
    color: '#3B82F6',
    bg: 'rgba(59, 130, 246, 0.12)',
    route: '/admin/report/cash-book/cash-statement',
  },
  {
    key: 'bank-transfer',
    icon: forwardIcon,
    en: 'Bank Transfer',
    kh: 'ការផ្ទេរប្រាក់តាមធនាគារ',
    descEn: 'View report of bank transfer',
    descKh: 'មើលរបាយការណ៍ផ្ទេរប្រាក់តាមធនាគារ',
    color: '#8B5CF6',
    bg: 'rgba(139, 92, 246, 0.12)',
    route: '/admin/report/cash-book/bank-transfer',
  },
]

// Master dictionary mapping each module key to its specialized sub-reports list
export const MODULE_SUB_REPORTS = {
  stock: STOCK_REPORTS,
  'sale-payment': SALE_PAYMENT_REPORTS,
  'order-management': ORDER_MANAGEMENT_REPORTS,
  consignment: CONSIGNMENT_REPORTS,
  'purchase-management': PURCHASE_MANAGEMENT_REPORTS,
  'payable-management': PAYABLE_MANAGEMENT_REPORTS,
  'cash-book': CASH_BOOK_REPORTS,
}

// Date Preset Helper
function calculateDateRange(preset) {
  const now = new Date()
  const formatDate = (d) => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  if (preset === 'today') {
    const t = formatDate(now)
    return { from: t, to: t }
  }
  if (preset === 'yesterday') {
    const y = new Date(now)
    y.setDate(y.getDate() - 1)
    const formatted = formatDate(y)
    return { from: formatted, to: formatted }
  }
  if (preset === 'this-week') {
    const currentDay = now.getDay() || 7
    const mon = new Date(now)
    mon.setDate(now.getDate() - (currentDay - 1))
    const sun = new Date(mon)
    sun.setDate(mon.getDate() + 6)
    return { from: formatDate(mon), to: formatDate(sun) }
  }
  if (preset === 'last-week') {
    const currentDay = now.getDay() || 7
    const prevMon = new Date(now)
    prevMon.setDate(now.getDate() - (currentDay - 1) - 7)
    const prevSun = new Date(prevMon)
    prevSun.setDate(prevMon.getDate() + 6)
    return { from: formatDate(prevMon), to: formatDate(prevSun) }
  }
  if (preset === 'this-month') {
    const first = new Date(now.getFullYear(), now.getMonth(), 1)
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    return { from: formatDate(first), to: formatDate(last) }
  }
  if (preset === 'last-month') {
    const first = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const last = new Date(now.getFullYear(), now.getMonth(), 0)
    return { from: formatDate(first), to: formatDate(last) }
  }
  return { from: '', to: '' }
}

// Fallback seed data if a particular table is empty
const SEED_DATA = {
  received: [
    { documentCode: 'GRN-2024-001', date: '2024-03-01', currency: 'USD', supplier: 'Cambodia Agri-Trading Ltd', receivedBy: 'Vanna Touch', totalCost: 1850.00, products: ['PRD-001', '8850124001', 'Organic Jasmine Rice 5kg', 'PRD-006', 'Extra Virgin Olive Oil 750ml'] },
    { documentCode: 'GRN-2024-002', date: '2024-03-02', currency: 'USD', supplier: 'CP Food Supplies Cambodia', receivedBy: 'Dara Heng', totalCost: 4200.00, products: ['PRD-002', '8850124002', 'Fresh Organic Milk 1L', 'PRD-003', 'Australian Angus Beef 500g', 'PRD-005', 'Farm Fresh Large Eggs 30s'] },
    { documentCode: 'GRN-2024-003', date: '2024-03-04', currency: 'USD', supplier: 'Mekong Beverage Ltd', receivedBy: 'Sophea Kim', totalCost: 960.00, products: ['PRD-004', '8850124004', 'Pure Mineral Water 500ml', 'PRD-010', 'Arabica Coffee Beans 250g'] },
    { documentCode: 'GRN-2024-004', date: '2024-03-05', currency: 'USD', supplier: 'Heritage Organic Farms', receivedBy: 'Sokha Ly', totalCost: 2150.00, products: ['PRD-008', '8850124008', 'Organic Green Apples 1kg', 'PRD-011', 'Wild Blossom Honey 500g'] },
    { documentCode: 'GRN-2024-005', date: '2024-03-06', currency: 'USD', supplier: 'Angkor Harvest Ltd', receivedBy: 'Vanna Touch', totalCost: 1420.00, products: ['PRD-009', '8850124009', 'Kampot Black Pepper 100g', 'PRD-012', 'Organic Broccoli Florets 400g'] },
  ],
  'request-transfer': [
    { productCode: 'PRD-001', barcode: '8850124001', description: 'Organic Jasmine Rice 5kg', uom: 'Bag', requestQty: 50, shipQty: 40, acceptQty: 40, closedQty: 0, voidedQty: 0, remainQty: 10, requestOutlet: 'Central Warehouse', requestLocation: 'Warehouse Floor A', toOutlet: 'Main Mart', toLocation: 'Main Shelf B', productGroup: 'Pantry Staples', brand: 'Heritage Organic', category: 'Grains', status: 'PENDING', requestTransferType: 'STANDARD', date: '2024-03-01' },
    { productCode: 'PRD-002', barcode: '8850124002', description: 'Fresh Organic Milk 1L', uom: 'Carton', requestQty: 100, shipQty: 100, acceptQty: 95, closedQty: 5, voidedQty: 0, remainQty: 0, requestOutlet: 'Central Warehouse', requestLocation: 'Cold Storage #1', toOutlet: 'BKK1 Branch', toLocation: 'Chiller Room 2', productGroup: 'Cold Chain', brand: 'Heritage Organic', category: 'Dairy', status: 'APPROVED', requestTransferType: 'URGENT_RESTOCK', date: '2024-03-02' },
    { productCode: 'PRD-003', barcode: '8850124003', description: 'Australian Angus Beef 500g', uom: 'Pack', requestQty: 30, shipQty: 25, acceptQty: 25, closedQty: 0, voidedQty: 5, remainQty: 0, requestOutlet: 'Main Mart', requestLocation: 'Meat Freezer #1', toOutlet: 'Toul Kork Branch', toLocation: 'Aisle 3 Chiller', productGroup: 'Fresh Grocery', brand: 'CP Foods', category: 'Meat', status: 'IN_TRANSIT', requestTransferType: 'INTER_BRANCH', date: '2024-03-04' },
    { productCode: 'PRD-004', barcode: '8850124004', description: 'Pure Mineral Water 500ml', uom: 'Case', requestQty: 80, shipQty: 60, acceptQty: 60, closedQty: 0, voidedQty: 0, remainQty: 20, requestOutlet: 'SR Depot', requestLocation: 'Warehouse Floor A', toOutlet: 'Central Warehouse', toLocation: 'Warehouse Floor A', productGroup: 'Beverages', brand: 'Coca-Cola', category: 'Beverages', status: 'COMPLETED', requestTransferType: 'EMERGENCY', date: '2024-03-05' },
    { productCode: 'PRD-005', barcode: '8850124005', description: 'Farm Fresh Large Eggs 30s', uom: 'Tray', requestQty: 45, shipQty: 45, acceptQty: 40, closedQty: 5, voidedQty: 0, remainQty: 0, requestOutlet: 'BKK1 Branch', requestLocation: 'Chiller Room 2', toOutlet: 'Main Mart', toLocation: 'Main Shelf B', productGroup: 'Cold Chain', brand: 'Angkor Harvest', category: 'Dairy', status: 'CLOSED', requestTransferType: 'INTERNAL_RETURN', date: '2024-03-06' },
  ],
  'ship-request-transfer': [
    { productCode: 'PRD-001', barcode: '8850124001', description: 'Organic Jasmine Rice 5kg', uom: 'Bag', shipQty: 40, acceptQty: 40, rejectQty: 0, remainQty: 0, requestOutlet: 'Central Warehouse', requestLocation: 'Warehouse Floor A', toOutlet: 'Main Mart', toLocation: 'Main Shelf B', productGroup: 'Pantry Staples', brand: 'Heritage Organic', category: 'Grains', status: 'COMPLETED', date: '2024-03-01' },
    { productCode: 'PRD-002', barcode: '8850124002', description: 'Fresh Organic Milk 1L', uom: 'Carton', shipQty: 100, acceptQty: 95, rejectQty: 5, remainQty: 0, requestOutlet: 'Central Warehouse', requestLocation: 'Cold Storage #1', toOutlet: 'BKK1 Branch', toLocation: 'Chiller Room 2', productGroup: 'Cold Chain', brand: 'Heritage Organic', category: 'Dairy', status: 'APPROVED', date: '2024-03-02' },
    { productCode: 'PRD-003', barcode: '8850124003', description: 'Australian Angus Beef 500g', uom: 'Pack', shipQty: 25, acceptQty: 25, rejectQty: 0, remainQty: 0, requestOutlet: 'Main Mart', requestLocation: 'Meat Freezer #1', toOutlet: 'Toul Kork Branch', toLocation: 'Aisle 3 Chiller', productGroup: 'Fresh Grocery', brand: 'CP Foods', category: 'Meat', status: 'IN_TRANSIT', date: '2024-03-04' },
    { productCode: 'PRD-004', barcode: '8850124004', description: 'Pure Mineral Water 500ml', uom: 'Case', shipQty: 80, acceptQty: 60, rejectQty: 0, remainQty: 20, requestOutlet: 'SR Depot', requestLocation: 'Warehouse Floor A', toOutlet: 'Central Warehouse', toLocation: 'Warehouse Floor A', productGroup: 'Beverages', brand: 'Coca-Cola', category: 'Beverages', status: 'IN_TRANSIT', date: '2024-03-05' },
    { productCode: 'PRD-005', barcode: '8850124005', description: 'Farm Fresh Large Eggs 30s', uom: 'Tray', shipQty: 45, acceptQty: 40, rejectQty: 5, remainQty: 0, requestOutlet: 'BKK1 Branch', requestLocation: 'Chiller Room 2', toOutlet: 'Main Mart', toLocation: 'Main Shelf B', productGroup: 'Cold Chain', brand: 'Angkor Harvest', category: 'Dairy', status: 'COMPLETED', date: '2024-03-06' },
  ],
  transferred: [
    { currency: 'USD', fromOutlet: 'Central Warehouse', toOutlet: 'BKK1 Branch', qty: 140, cost: 4.50, totalCost: 630.00 },
    { currency: 'USD', fromOutlet: 'Main Mart', toOutlet: 'Toul Kork Mart', qty: 85, cost: 8.20, totalCost: 697.00 },
    { currency: 'USD', fromOutlet: 'Central Warehouse', toOutlet: 'Siem Reap Hub', qty: 210, cost: 2.10, totalCost: 441.00 },
  ],
  adjustment: [
    { currency: 'USD', date: '2024-03-05', supplier: 'Cambodia Agri-Trading Ltd', qty: -12, totalCost: -48.00, outlet: 'Central Warehouse', location: 'Warehouse Floor A', adjustType: 'Breakage', productCode: 'PRD-001', barcode: '8850124001', description: 'Organic Jasmine Rice 5kg', productGroup: 'Pantry Staples', brand: 'Heritage Organic', category: 'Grains' },
    { currency: 'USD', date: '2024-03-06', supplier: 'CP Food Supplies Cambodia', qty: -4, totalCost: -18.50, outlet: 'Main Mart', location: 'Cold Storage #1', adjustType: 'Stock Count', productCode: 'PRD-002', barcode: '8850124002', description: 'Fresh Organic Milk 1L', productGroup: 'Cold Chain', brand: 'Angkor Harvest', category: 'Dairy' },
    { currency: 'USD', date: '2024-03-07', supplier: 'Mekong Beverage Ltd', qty: 15, totalCost: 37.50, outlet: 'BKK1 Branch', location: 'Aisle 3 Chiller', adjustType: 'Correction', productCode: 'PRD-004', barcode: '8850124004', description: 'Pure Mineral Water 500ml', productGroup: 'Beverages', brand: 'Coca-Cola', category: 'Beverages' },
    { currency: 'USD', date: '2024-03-08', supplier: 'Lucky Local Supplies', qty: -8, totalCost: -32.00, outlet: 'Toul Kork Branch', location: 'Meat Freezer #1', adjustType: 'Damaged Goods', productCode: 'PRD-005', barcode: '8850124005', description: 'Farm Fresh Large Eggs 30s', productGroup: 'Cold Chain', brand: 'Angkor Harvest', category: 'Dairy' },
    { currency: 'USD', date: '2024-03-09', supplier: 'Internal Store', qty: -3, totalCost: -25.50, outlet: 'Central Warehouse', location: 'Warehouse Floor A', adjustType: 'Theft / Loss', productCode: 'PRD-003', barcode: '8850124003', description: 'Australian Angus Beef 500g', productGroup: 'Fresh Grocery', brand: 'Heritage Organic', category: 'Meat' },
  ],
  issued: [
    { currency: 'USD', totalCost: 320.00, outlet: 'Central Warehouse', location: 'Warehouse Floor A', productCode: 'PRD-001', barcode: '8850124001', description: 'Organic Jasmine Rice 5kg', productGroup: 'Pantry Staples', brand: 'Heritage Organic', category: 'Grains', date: '2024-03-05' },
    { currency: 'USD', totalCost: 85.00, outlet: 'Main Mart', location: 'Cold Storage #1', productCode: 'PRD-002', barcode: '8850124002', description: 'Fresh Organic Milk 1L', productGroup: 'Cold Chain', brand: 'Angkor Harvest', category: 'Dairy', date: '2024-03-06' },
    { currency: 'USD', totalCost: 145.50, outlet: 'BKK1 Branch', location: 'Aisle 3 Chiller', productCode: 'PRD-004', barcode: '8850124004', description: 'Pure Mineral Water 500ml', productGroup: 'Beverages', brand: 'Coca-Cola', category: 'Beverages', date: '2024-03-07' },
    { currency: 'USD', totalCost: 96.00, outlet: 'Toul Kork Branch', location: 'Meat Freezer #1', productCode: 'PRD-005', barcode: '8850124005', description: 'Farm Fresh Large Eggs 30s', productGroup: 'Cold Chain', brand: 'Angkor Harvest', category: 'Dairy', date: '2024-03-08' },
    { currency: 'USD', totalCost: 210.00, outlet: 'Central Warehouse', location: 'Warehouse Floor A', productCode: 'PRD-003', barcode: '8850124003', description: 'Australian Angus Beef 500g', productGroup: 'Fresh Grocery', brand: 'Heritage Organic', category: 'Meat', date: '2024-03-09' },
  ],
  'inventory-list': [
    { outlet: 'Main Mart', productCode: 'PRD-001', barcode: '8850124001', description: 'Fresh Organic Milk 1L', qty: 240, uom: 'Bottle', avgCost: 2.15, lastCost: 2.20, totalCost: 516.00, price: 3.00, totalPrice: 720.00, brand: 'Angkor Harvest', category: 'Dairy', productGroup: 'Cold Chain', expiryDays: 5, expiryDate: '2026-09-15', status: 'Active', onhand: 240 },
    { outlet: 'Central Warehouse', productCode: 'PRD-002', barcode: '8850124002', description: 'Australian Angus Beef 500g', qty: 65, uom: 'Pack', avgCost: 8.40, lastCost: 8.50, totalCost: 546.00, price: 12.00, totalPrice: 780.00, brand: 'Heritage Organic', category: 'Meat', productGroup: 'Fresh Grocery', expiryDays: 25, expiryDate: '2026-10-05', status: 'Active', onhand: 65 },
    { outlet: 'BKK1 Branch', productCode: 'PRD-003', barcode: '8850124003', description: 'Organic Jasmine Rice 5kg', qty: 120, uom: 'Bag', avgCost: 5.20, lastCost: 5.30, totalCost: 624.00, price: 7.50, totalPrice: 900.00, brand: 'Heritage Organic', category: 'Grains', productGroup: 'Pantry Staples', expiryDays: 180, expiryDate: '2027-03-09', status: 'Active', onhand: 120 },
    { outlet: 'Toul Kork Mart', productCode: 'PRD-004', barcode: '8850124004', description: 'Pure Mineral Water 500ml', qty: 8, uom: 'Case', avgCost: 3.10, lastCost: 3.20, totalCost: 24.80, price: 4.50, totalPrice: 36.00, brand: 'Coca-Cola', category: 'Beverages', productGroup: 'Beverages', expiryDays: 365, expiryDate: '2027-09-10', status: 'Low Stock', onhand: 8 },
    { outlet: 'Main Mart', productCode: 'PRD-005', barcode: '8850124005', description: 'Farm Fresh Large Eggs 30s', qty: 0, uom: 'Tray', avgCost: 3.50, lastCost: 3.60, totalCost: 0.00, price: 5.00, totalPrice: 0.00, brand: 'Angkor Harvest', category: 'Dairy', productGroup: 'Cold Chain', expiryDays: -2, expiryDate: '2026-09-08', status: 'Out of Stock', onhand: 0 },
    { outlet: 'Central Warehouse', productCode: 'PRD-006', barcode: '8850124006', description: 'Kampot Black Pepper 100g', qty: 150, uom: 'Jar', avgCost: 2.80, lastCost: 2.90, totalCost: 420.00, price: 4.20, totalPrice: 630.00, brand: 'Lucky Local', category: 'Spices', productGroup: 'Pantry Staples', expiryDays: 50, expiryDate: '2026-10-30', status: 'Active', onhand: 150 },
  ],
  'price-list': [
    { code: 'PRD-001', barcode: '8850124001', description: 'Fresh Organic Milk 1L', uom: 'Bottle', basePrice: 3.00 },
    { code: 'PRD-002', barcode: '8850124002', description: 'Australian Angus Beef 500g', uom: 'Pack', basePrice: 12.00 },
    { code: 'PRD-003', barcode: '8850124003', description: 'Organic Jasmine Rice 5kg', uom: 'Bag', basePrice: 7.50 },
    { code: 'PRD-004', barcode: '8850124004', description: 'Pure Mineral Water 500ml', uom: 'Case', basePrice: 4.20 },
  ],
  'transaction-history': [
    { transactionType: 'RECEIVE', document: 'GRN-2024-001', date: '2024-03-01', productCode: 'PRD-001', description: 'Fresh Organic Milk 1L', outlet: 'Central Warehouse', location: 'Warehouse Floor A', qty: 50, stockUom: 'Box', tranUom: 'Bottle', cost: 2.20, amount: 110.00, balanceQty: 240 },
    { transactionType: 'TRANSFER', document: 'TRF-2024-022', date: '2024-03-03', productCode: 'PRD-002', description: 'Australian Angus Beef 500g', outlet: 'Main Mart', location: 'Cold Storage #1', qty: 20, stockUom: 'Pack', tranUom: 'Pack', cost: 8.50, amount: 170.00, balanceQty: 65 },
    { transactionType: 'ADJUST', document: 'ADJ-2024-005', date: '2024-03-05', productCode: 'PRD-003', description: 'Organic Jasmine Rice 5kg', outlet: 'BKK1 Branch', location: 'Shelf B2', qty: -5, stockUom: 'Bag', tranUom: 'Bag', cost: 5.30, amount: -26.50, balanceQty: 115 },
  ],
  'order-point': [
    { productCode: 'PRD-001', description: 'Fresh Organic Milk 1L', onhand: 24, uom: 'Bottle', orderPoint: 50, orderQuantity: 60 },
    { productCode: 'PRD-002', description: 'Australian Angus Beef 500g', onhand: 12, uom: 'Pack', orderPoint: 30, orderQuantity: 40 },
    { productCode: 'PRD-005', description: 'Hass Avocados Grade A', onhand: 5, uom: 'Kg', orderPoint: 20, orderQuantity: 35 },
    { productCode: 'PRD-006', description: 'Kampot Black Pepper 100g', onhand: 45, uom: 'Jar', orderPoint: 15, orderQuantity: 0 },
  ],
  'stock-evaluation': [
    { productCode: 'PRD-001', description: 'Fresh Organic Milk 1L', uom: 'Bottle', beginning: 180, receive: 120, issue: 10, adjust: -2, transferIn: 20, transferOut: 15, sale: 53, return: 0, balance: 240 },
    { productCode: 'PRD-002', description: 'Australian Angus Beef 500g', uom: 'Pack', beginning: 50, receive: 40, issue: 5, adjust: 0, transferIn: 10, transferOut: 10, sale: 20, return: 0, balance: 65 },
    { productCode: 'PRD-003', description: 'Organic Jasmine Rice 5kg', uom: 'Bag', beginning: 100, receive: 60, issue: 8, adjust: -2, transferIn: 15, transferOut: 15, sale: 30, return: 0, balance: 120 },
    { productCode: 'PRD-004', description: 'Pure Mineral Water 500ml', uom: 'Case', beginning: 80, receive: 50, issue: 0, adjust: 0, transferIn: 0, transferOut: 20, sale: 35, return: 5, balance: 80 },
  ],
  'sale-payment': [
    { code: 'INV-2024-001', date: '2024-03-01', customer: 'Sovann Phka Mart', outlet: 'Main Mart', location: 'POS Counter 1', product: 'Grocery Bulk Pack', category: 'Dairy', brand: 'Heritage Organic', supplier: 'Global Dairy', method: 'ABA PayWay', total: 450.00, paid: 450.00, balance: 0.00, status: 'PAID' },
  ],
  'end-of-day': [
    { date: '2024-03-06', outlet: 'Main Mart (Central)', register: 'POS-01', cashier: 'Sokha Ly', totalInvoices: 142, grossSales: 4850.00, discount: 120.00, tax: 473.00, netSales: 5203.00, cashAmount: 1450.00, abaAmount: 2953.00, cardAmount: 800.00, totalCollected: 5203.00, status: 'BALANCED' },
    { date: '2024-03-06', outlet: 'BKK1 Express Store', register: 'POS-02', cashier: 'Dara Heng', totalInvoices: 98, grossSales: 3120.00, discount: 85.00, tax: 303.50, netSales: 3338.50, cashAmount: 820.00, abaAmount: 2118.50, cardAmount: 400.00, totalCollected: 3338.50, status: 'BALANCED' },
    { date: '2024-03-06', outlet: 'Toul Kork Mart', register: 'POS-01', cashier: 'Kalyan Meng', totalInvoices: 115, grossSales: 3950.00, discount: 95.00, tax: 385.50, netSales: 4240.50, cashAmount: 1100.00, abaAmount: 2540.50, cardAmount: 600.00, totalCollected: 4240.50, status: 'BALANCED' },
  ],
  'sale-transaction': [
    { docNo: 'INV-2024-101', date: '2024-03-06', customer: 'Sovann Phka Mart', outlet: 'Main Mart', cashier: 'Sokha Ly', paymentMethod: 'ABA PayWay', subtotal: 320.00, discount: 15.00, tax: 30.50, grandTotal: 335.50, paidAmount: 335.50, balance: 0.00, status: 'PAID' },
    { docNo: 'INV-2024-102', date: '2024-03-06', customer: 'Angkor Organic Cafe', outlet: 'Main Mart', cashier: 'Sokha Ly', paymentMethod: 'Cash', subtotal: 185.00, discount: 0.00, tax: 18.50, grandTotal: 203.50, paidAmount: 203.50, balance: 0.00, status: 'PAID' },
    { docNo: 'INV-2024-103', date: '2024-03-06', customer: 'Bayon Bakery Kitchen', outlet: 'BKK1 Express', cashier: 'Dara Heng', paymentMethod: 'Wing Bank', subtotal: 540.00, discount: 25.00, tax: 51.50, grandTotal: 566.50, paidAmount: 566.50, balance: 0.00, status: 'PAID' },
    { docNo: 'INV-2024-104', date: '2024-03-06', customer: 'Rosewood Phnom Penh', outlet: 'Main Mart', cashier: 'Vanna Touch', paymentMethod: 'Visa / MasterCard', subtotal: 1250.00, discount: 50.00, tax: 120.00, grandTotal: 1320.00, paidAmount: 1320.00, balance: 0.00, status: 'PAID' },
  ],
  'aging-invoice': [
    { code: 'CUST-001', customer: 'Sovann Phka Mart', phone: '+855 12 889 900', current: 450.00, days1to30: 1200.00, days31to60: 0.00, days61to90: 0.00, over90Days: 0.00, totalDue: 1650.00, salesperson: 'Borith Keo', status: 'GOOD_STANDING' },
    { code: 'CUST-002', customer: 'Angkor Organic Cafe', phone: '+855 10 334 455', current: 320.00, days1to30: 450.00, days31to60: 280.00, days61to90: 0.00, over90Days: 0.00, totalDue: 1050.00, salesperson: 'Chheang Meng', status: 'ATTENTION' },
    { code: 'CUST-003', customer: 'Bayon Bakery Kitchen', phone: '+855 77 665 544', current: 0.00, days1to30: 0.00, days31to60: 620.00, days61to90: 410.00, over90Days: 150.00, totalDue: 1180.00, salesperson: 'Sokha Ly', status: 'OVERDUE' },
    { code: 'CUST-004', customer: 'Khmer Gourmet Delights', phone: '+855 15 221 133', current: 890.00, days1to30: 150.00, days31to60: 0.00, days61to90: 0.00, over90Days: 0.00, totalDue: 1040.00, salesperson: 'Borith Keo', status: 'GOOD_STANDING' },
  ],
  'payment-gateway': [
    { txnId: 'GW-ABA-9821', date: '2024-03-06', gateway: 'ABA PayWay QR', referenceNo: 'REF-8921820', customer: 'Sovann Phka Mart', orderRef: 'INV-2024-101', amount: 335.50, fee: 2.68, netAmount: 332.82, currency: 'USD', settlementStatus: 'SETTLED', status: 'SUCCESS' },
    { txnId: 'GW-WNG-4412', date: '2024-03-06', gateway: 'Wing Bank KHQR', referenceNo: 'REF-3310492', customer: 'Bayon Bakery Kitchen', orderRef: 'INV-2024-103', amount: 566.50, fee: 4.53, netAmount: 561.97, currency: 'USD', settlementStatus: 'SETTLED', status: 'SUCCESS' },
    { txnId: 'GW-VSA-7731', date: '2024-03-06', gateway: 'Visa Credit Card', referenceNo: 'REF-7729104', customer: 'Rosewood Phnom Penh', orderRef: 'INV-2024-104', amount: 1320.00, fee: 19.80, netAmount: 1300.20, currency: 'USD', settlementStatus: 'PENDING_BATCH', status: 'SUCCESS' },
    { txnId: 'GW-ACL-1092', date: '2024-03-06', gateway: 'ACLEDA KHQR', referenceNo: 'REF-1192834', customer: 'Fresh Table Deli', orderRef: 'INV-2024-099', amount: 184.20, fee: 1.47, netAmount: 182.73, currency: 'USD', settlementStatus: 'SETTLED', status: 'SUCCESS' },
  ],
  'customer-balance': [
    { code: 'CUST-001', customer: 'Sovann Phka Mart', customerGroup: 'Supermarket Wholesale', creditLimit: 5000.00, currentBalance: 1650.00, unpaidInvoices: 2, depositBalance: 500.00, availableCredit: 3350.00, lastPaymentDate: '2024-03-04', status: 'ACTIVE' },
    { code: 'CUST-002', customer: 'Angkor Organic Cafe', customerGroup: 'Restaurant & F&B', creditLimit: 3000.00, currentBalance: 1050.00, unpaidInvoices: 3, depositBalance: 200.00, availableCredit: 1950.00, lastPaymentDate: '2024-03-01', status: 'ACTIVE' },
    { code: 'CUST-003', customer: 'Bayon Bakery Kitchen', customerGroup: 'Bakery Chain', creditLimit: 4000.00, currentBalance: 1180.00, unpaidInvoices: 3, depositBalance: 0.00, availableCredit: 2820.00, lastPaymentDate: '2024-02-20', status: 'ACTIVE' },
    { code: 'CUST-004', customer: 'Rosewood Phnom Penh', customerGroup: 'Hotel & Luxury', creditLimit: 15000.00, currentBalance: 3420.00, unpaidInvoices: 1, depositBalance: 2500.00, availableCredit: 11580.00, lastPaymentDate: '2024-03-05', status: 'VIP' },
  ],
  'customer-credit-deposit': [
    { docNo: 'DEP-2024-001', date: '2024-03-01', customer: 'Rosewood Phnom Penh', depositType: 'PREPAID_DEPOSIT', outlet: 'Central Warehouse', amount: 3000.00, utilizedAmount: 500.00, remainingBalance: 2500.00, paymentMethod: 'Bank Transfer (ABA)', note: 'Quarterly produce advance', status: 'ACTIVE' },
    { docNo: 'DEP-2024-002', date: '2024-03-02', customer: 'Sovann Phka Mart', depositType: 'SECURITY_DEPOSIT', outlet: 'Main Mart', amount: 1000.00, utilizedAmount: 500.00, remainingBalance: 500.00, paymentMethod: 'Cash', note: 'Cold-chain tote deposit', status: 'ACTIVE' },
    { docNo: 'DEP-2024-003', date: '2024-03-04', customer: 'Angkor Organic Cafe', depositType: 'PREPAID_DEPOSIT', outlet: 'BKK1 Branch', amount: 500.00, utilizedAmount: 300.00, remainingBalance: 200.00, paymentMethod: 'Wing Bank', note: 'Monthly catering credit', status: 'ACTIVE' },
  ],
  'invoice-payment': [
    { paymentNo: 'RCT-2024-401', date: '2024-03-06', invoiceCode: 'INV-2024-101', customer: 'Sovann Phka Mart', outlet: 'Main Mart', paymentMethod: 'ABA PayWay', paidAmount: 335.50, discountTaken: 0.00, bankAccount: 'ABA 001 224 889', collectedBy: 'Sokha Ly', status: 'CONFIRMED' },
    { paymentNo: 'RCT-2024-402', date: '2024-03-06', invoiceCode: 'INV-2024-102', customer: 'Angkor Organic Cafe', outlet: 'Main Mart', paymentMethod: 'Cash', paidAmount: 203.50, discountTaken: 0.00, bankAccount: 'Cash Drawer #1', collectedBy: 'Sokha Ly', status: 'CONFIRMED' },
    { paymentNo: 'RCT-2024-403', date: '2024-03-06', invoiceCode: 'INV-2024-103', customer: 'Bayon Bakery Kitchen', outlet: 'BKK1 Express', paymentMethod: 'Wing Bank', paidAmount: 566.50, discountTaken: 0.00, bankAccount: 'Wing 092 110 334', collectedBy: 'Dara Heng', status: 'CONFIRMED' },
    { paymentNo: 'RCT-2024-404', date: '2024-03-06', invoiceCode: 'INV-2024-104', customer: 'Rosewood Phnom Penh', outlet: 'Main Mart', paymentMethod: 'Visa Card', paidAmount: 1320.00, discountTaken: 0.00, bankAccount: 'Visa Merchant Terminal', collectedBy: 'Vanna Touch', status: 'CONFIRMED' },
  ],
  'ar-invoice-status': [
    { invoiceNo: 'INV-2024-088', issueDate: '2024-02-15', dueDate: '2024-03-01', customer: 'Bayon Bakery Kitchen', outlet: 'Main Mart', totalAmount: 850.00, paidAmount: 230.00, outstandingBalance: 620.00, daysOverdue: 5, paymentStatus: 'PARTIAL', status: 'OVERDUE' },
    { invoiceNo: 'INV-2024-091', issueDate: '2024-02-20', dueDate: '2024-03-06', customer: 'Angkor Organic Cafe', outlet: 'BKK1 Express', totalAmount: 280.00, paidAmount: 0.00, outstandingBalance: 280.00, daysOverdue: 0, paymentStatus: 'UNPAID', status: 'DUE_TODAY' },
    { invoiceNo: 'INV-2024-095', issueDate: '2024-02-28', dueDate: '2024-03-14', customer: 'Sovann Phka Mart', outlet: 'Main Mart', totalAmount: 1200.00, paidAmount: 0.00, outstandingBalance: 1200.00, daysOverdue: 0, paymentStatus: 'UNPAID', status: 'CURRENT' },
    { invoiceNo: 'INV-2024-099', issueDate: '2024-03-01', dueDate: '2024-03-15', customer: 'Rosewood Phnom Penh', outlet: 'Main Mart', totalAmount: 3420.00, paidAmount: 0.00, outstandingBalance: 3420.00, daysOverdue: 0, paymentStatus: 'UNPAID', status: 'CURRENT' },
  ],
  'top-bottom-sale': [
    { code: 'PRD-001', name: 'Fresh Organic Milk 1L', category: 'Dairy', soldQty: 840, unitCost: 2.20, sellingPrice: 3.00, totalRevenue: 2520.00, grossProfit: 672.00, profitMargin: '26.7%', ranking: '#1 Top', performanceType: 'TOP' },
    { code: 'PRD-003', name: 'Organic Jasmine Rice 5kg', category: 'Grains', soldQty: 320, unitCost: 6.50, sellingPrice: 9.00, totalRevenue: 2880.00, grossProfit: 800.00, profitMargin: '27.8%', ranking: '#2 Top', performanceType: 'TOP' },
    { code: 'PRD-002', name: 'Australian Angus Beef 500g', category: 'Meat', soldQty: 195, unitCost: 8.50, sellingPrice: 12.00, totalRevenue: 2340.00, grossProfit: 682.50, profitMargin: '29.2%', ranking: '#3 Top', performanceType: 'TOP' },
    { code: 'PRD-019', name: 'Artisan Herb Mustard 150g', category: 'Condiments', soldQty: 4, unitCost: 3.80, sellingPrice: 5.50, totalRevenue: 22.00, grossProfit: 6.80, profitMargin: '30.9%', ranking: '#1 Bottom', performanceType: 'BOTTOM' },
    { code: 'PRD-022', name: 'Organic Cacao Powder 250g', category: 'Baking', soldQty: 6, unitCost: 5.20, sellingPrice: 7.50, totalRevenue: 45.00, grossProfit: 13.80, profitMargin: '30.7%', ranking: '#2 Bottom', performanceType: 'BOTTOM' },
  ],
  'cash-receipt': [
    { receiptNo: 'CSH-REC-001', date: '2024-03-06', customer: 'Walk-in Retail Buyer', outlet: 'Main Mart', cashier: 'Sokha Ly', receivedFrom: 'POS Cashier Counter #1', cashAmount: 450.00, currency: 'USD', reason: 'Retail Grocery Sales Payment', receivedBy: 'Sokha Ly', status: 'VERIFIED' },
    { receiptNo: 'CSH-REC-002', date: '2024-03-06', customer: 'Angkor Organic Cafe', outlet: 'Main Mart', cashier: 'Sokha Ly', receivedFrom: 'Wholesale Buyer Drop', cashAmount: 203.50, currency: 'USD', reason: 'Invoice Payment INV-2024-102', receivedBy: 'Sokha Ly', status: 'VERIFIED' },
    { receiptNo: 'CSH-REC-003', date: '2024-03-06', customer: 'Walk-in Retail Buyer', outlet: 'BKK1 Express', cashier: 'Dara Heng', receivedFrom: 'POS Cashier Counter #2', cashAmount: 320.00, currency: 'USD', reason: 'Express Mart Store Sales', receivedBy: 'Dara Heng', status: 'VERIFIED' },
  ],
  'profits': [
    { period: 'March 2024 (Month-to-Date)', outlet: 'All Outlets Combined', category: 'Enterprise P&L', revenue: 48500.00, cogs: 34150.00, grossProfit: 14350.00, profitMargin: '29.6%', operationalExpense: 5200.00, netProfit: 9150.00, roiPct: '18.9%', status: 'HIGH_PERFORMING' },
    { period: 'February 2024', outlet: 'All Outlets Combined', category: 'Enterprise P&L', revenue: 142000.00, cogs: 100820.00, grossProfit: 41180.00, profitMargin: '29.0%', operationalExpense: 15400.00, netProfit: 25780.00, roiPct: '18.2%', status: 'STABLE' },
    { period: 'January 2024', outlet: 'All Outlets Combined', category: 'Enterprise P&L', revenue: 138500.00, cogs: 98600.00, grossProfit: 39900.00, profitMargin: '28.8%', operationalExpense: 14900.00, netProfit: 25000.00, roiPct: '18.1%', status: 'STABLE' },
  ],
  'sale-payment-type': [
    { paymentType: 'ABA PayWay (Mobile QR)', outlet: 'All Outlets', transactionCount: 1420, totalAmount: 26850.00, pctOfTotal: '55.4%', avgTicketSize: 18.90, processingFee: 214.80, netSettlement: 26635.20, status: 'PRIMARY' },
    { paymentType: 'Cash at Counter', outlet: 'All Outlets', transactionCount: 890, totalAmount: 12450.00, pctOfTotal: '25.7%', avgTicketSize: 13.98, processingFee: 0.00, netSettlement: 12450.00, status: 'STANDARD' },
    { paymentType: 'Visa / MasterCard', outlet: 'All Outlets', transactionCount: 280, totalAmount: 5820.00, pctOfTotal: '12.0%', avgTicketSize: 20.78, processingFee: 87.30, netSettlement: 5732.70, status: 'ACTIVE' },
    { paymentType: 'Wing Bank / KHQR', outlet: 'All Outlets', transactionCount: 140, totalAmount: 2380.00, pctOfTotal: '4.9%', avgTicketSize: 17.00, processingFee: 19.04, netSettlement: 2360.96, status: 'ACTIVE' },
    { paymentType: 'Customer Deposit Account', outlet: 'All Outlets', transactionCount: 45, totalAmount: 1000.00, pctOfTotal: '2.0%', avgTicketSize: 22.22, processingFee: 0.00, netSettlement: 1000.00, status: 'INTERNAL' },
  ],
  'close-shift': [
    { shiftNo: 'SFT-01', date: '2024-03-06', shiftName: 'Morning Shift (07:00 - 15:00)', cashier: 'Sokha Ly', outlet: 'Main Mart', openingCash: 100.00, cashSales: 850.00, electronicSales: 1650.00, cashInDrawer: 950.00, variance: 0.00, closedAt: '15:05:12', status: 'BALANCED' },
    { shiftNo: 'SFT-02', date: '2024-03-06', shiftName: 'Evening Shift (15:00 - 22:00)', cashier: 'Vanna Touch', outlet: 'Main Mart', openingCash: 100.00, cashSales: 600.00, electronicSales: 1303.00, cashInDrawer: 700.00, variance: 0.00, closedAt: '22:08:44', status: 'BALANCED' },
    { shiftNo: 'SFT-03', date: '2024-03-06', shiftName: 'Full Day Shift (08:00 - 20:00)', cashier: 'Dara Heng', outlet: 'BKK1 Express', openingCash: 100.00, cashSales: 820.00, electronicSales: 2518.50, cashInDrawer: 920.00, variance: 0.00, closedAt: '20:12:00', status: 'BALANCED' },
  ],
  'sale-promotion-report': [
    { promoCode: 'PROMO-FARM10', promoName: 'Farm Fresh Weekend 10%', discountType: 'PERCENTAGE_10', startDate: '2024-03-01', endDate: '2024-03-03', appliedCount: 340, totalDiscountGiven: 480.00, revenueGenerated: 4800.00, roiPct: '900%', status: 'EXPIRED' },
    { promoCode: 'PROMO-ORGANIC5', promoName: 'Organic Certified Discount', discountType: 'FIXED_$5', startDate: '2024-03-04', endDate: '2024-03-10', appliedCount: 185, totalDiscountGiven: 925.00, revenueGenerated: 6475.00, roiPct: '600%', status: 'ACTIVE' },
    { promoCode: 'PROMO-VIPMEMBER', promoName: 'Gold Member Exclusive Savings', discountType: 'PERCENTAGE_15', startDate: '2024-03-01', endDate: '2024-03-31', appliedCount: 520, totalDiscountGiven: 1420.00, revenueGenerated: 11200.00, roiPct: '688%', status: 'ACTIVE' },
  ],
  'sale-package-item-report': [
    { packageCode: 'PKG-VEG-01', packageName: 'Organic Family Veggie Basket', category: 'Fresh Produce', itemsCount: 6, packagePrice: 15.00, itemsTotalValue: 18.50, packagesSold: 120, totalRevenue: 1800.00, costPrice: 11.20, profit: 456.00, status: 'BEST_SELLER' },
    { packageCode: 'PKG-BBQ-02', packageName: 'Gourmet Weekend BBQ Combo', category: 'Meat & Seafood', itemsCount: 4, packagePrice: 35.00, itemsTotalValue: 42.00, packagesSold: 85, totalRevenue: 2975.00, costPrice: 24.50, profit: 892.50, status: 'POPULAR' },
    { packageCode: 'PKG-BRK-03', packageName: 'Healthy Breakfast Essentials', category: 'Dairy & Bakery', itemsCount: 5, packagePrice: 12.00, itemsTotalValue: 14.20, packagesSold: 160, totalRevenue: 1920.00, costPrice: 8.80, profit: 512.00, status: 'HIGH_DEMAND' },
  ],
  // ORDER MANAGEMENT SUB-REPORTS
  'sale-order-status': [
    { orderNo: 'SO-2024-001', date: '2024-03-06', customer: 'Bayon Market Toul Kork', outlet: 'Central Warehouse', items: 18, totalAmount: 850.00, paymentStatus: 'PAID', orderStatus: 'PROCESSING', salesperson: 'Borith Keo' },
    { orderNo: 'SO-2024-002', date: '2024-03-06', customer: 'Angkor Organic Cafe', outlet: 'Main Mart', items: 8, totalAmount: 320.50, paymentStatus: 'PARTIAL', orderStatus: 'CONFIRMED', salesperson: 'Sokha Ly' },
    { orderNo: 'SO-2024-003', date: '2024-03-05', customer: 'Rosewood Phnom Penh', outlet: 'Main Mart', items: 25, totalAmount: 2450.00, paymentStatus: 'PENDING', orderStatus: 'DISPATCHED', salesperson: 'Dara Heng' },
    { orderNo: 'SO-2024-004', date: '2024-03-04', customer: 'Sovann Phka Mart', outlet: 'Central Warehouse', items: 12, totalAmount: 640.00, paymentStatus: 'PAID', orderStatus: 'DELIVERED', salesperson: 'Vanna Touch' },
  ],
  'sale-order-shipment': [
    { shipmentNo: 'SHP-ORD-101', orderNo: 'SO-2024-001', dispatchDate: '2024-03-06', customer: 'Bayon Market Toul Kork', deliveryAddress: '#128 St. 598 Toul Kork, Phnom Penh', carrier: 'Fleet Truck #3', trackingNo: 'TRK-KH-8891', shipmentStatus: 'OUT_FOR_DELIVERY' },
    { shipmentNo: 'SHP-ORD-102', orderNo: 'SO-2024-003', dispatchDate: '2024-03-05', customer: 'Rosewood Phnom Penh', deliveryAddress: 'Vattanac Capital Tower, Monivong Blvd', carrier: 'Cold Express #2', trackingNo: 'TRK-KH-8892', shipmentStatus: 'DELIVERED' },
    { shipmentNo: 'SHP-ORD-103', orderNo: 'SO-2024-004', dispatchDate: '2024-03-04', customer: 'Sovann Phka Mart', deliveryAddress: '#45 St. 271, Boeng Tumpun', carrier: 'Van Express #1', trackingNo: 'TRK-KH-8893', shipmentStatus: 'DELIVERED' },
  ],

  // CONSIGNMENT SUB-REPORTS
  'consignment-shipment': [
    { shipmentNo: 'CSG-SHP-001', date: '2024-03-05', vendor: 'Khmer Heritage Farm', outlet: 'Main Mart', receivedBy: 'Dara Heng', totalPackages: 45, carrier: 'Farm Direct Truck', status: 'RECEIVED' },
    { shipmentNo: 'CSG-SHP-002', date: '2024-03-04', vendor: 'Kampot Organic Spice Co', outlet: 'Central Warehouse', receivedBy: 'Sokha Ly', totalPackages: 20, carrier: 'Phnom Penh Post Logistics', status: 'VERIFIED' },
    { shipmentNo: 'CSG-SHP-003', date: '2024-03-02', vendor: 'Mondulkiri Fresh Honey', outlet: 'BKK1 Express Store', receivedBy: 'Vanna Touch', totalPackages: 15, carrier: 'Local Express Delivery', status: 'RECEIVED' },
  ],
  'consignment-status-report': [
    { contractNo: 'CSG-CT-01', vendor: 'Khmer Heritage Farm', product: 'Pure Organic Honey 500g', consignedQty: 300, soldQty: 245, returnQty: 5, remainingQty: 50, settlementAmount: 735.00, status: 'ACTIVE' },
    { contractNo: 'CSG-CT-02', vendor: 'Kampot Organic Spice Co', product: 'Black Pepper Grade A 100g', consignedQty: 500, soldQty: 410, returnQty: 0, remainingQty: 90, settlementAmount: 1230.00, status: 'ACTIVE' },
    { contractNo: 'CSG-CT-03', vendor: 'Mondulkiri Fresh Honey', product: 'Wildflower Honey 250ml', consignedQty: 200, soldQty: 180, returnQty: 2, remainingQty: 18, settlementAmount: 540.00, status: 'NEAR_RECONCILE' },
  ],

  // PURCHASE MANAGEMENT SUB-REPORTS
  'requisition': [
    { reqNo: 'PR-2024-051', date: '2024-03-06', department: 'Fresh Produce Dept', requestedBy: 'Sokha Ly', totalItems: 6, estimatedCost: 1450.00, priority: 'HIGH', status: 'APPROVED' },
    { reqNo: 'PR-2024-052', date: '2024-03-05', department: 'Dairy & Chilled Section', requestedBy: 'Kalyan Meng', totalItems: 4, estimatedCost: 820.00, priority: 'NORMAL', status: 'PENDING' },
    { reqNo: 'PR-2024-053', date: '2024-03-04', department: 'Warehouse Logistics', requestedBy: 'Borith Keo', totalItems: 12, estimatedCost: 3100.00, priority: 'URGENT', status: 'PO_CREATED' },
  ],
  'purchase-order-status': [
    { poNo: 'PO-2024-041', date: '2024-03-05', supplier: 'Cambodia Agri-Trading Ltd', outlet: 'Central Warehouse', term: 'Net 30', totalAmount: 4200.00, receivingStatus: 'PARTIAL', paymentStatus: 'UNPAID', status: 'OPEN' },
    { poNo: 'PO-2024-042', date: '2024-03-04', supplier: 'CP Food Supplies Cambodia', outlet: 'Main Mart', term: 'Net 15', totalAmount: 3450.00, receivingStatus: 'RECEIVED', paymentStatus: 'PAID', status: 'CLOSED' },
    { poNo: 'PO-2024-043', date: '2024-03-02', supplier: 'Mekong Beverage Ltd', outlet: 'BKK1 Express', term: 'Immediate', totalAmount: 1280.00, receivingStatus: 'RECEIVED', paymentStatus: 'PAID', status: 'CLOSED' },
  ],
  'purchase-order-products-status': [
    { poNo: 'PO-2024-041', code: 'PRD-003', product: 'Organic Jasmine Rice 5kg', supplier: 'Cambodia Agri-Trading Ltd', orderedQty: 400, receivedQty: 300, unitCost: 6.50, totalCost: 1950.00, status: 'PARTIAL_DELIVERY' },
    { poNo: 'PO-2024-041', code: 'PRD-004', product: 'Brown Rice Organic 2kg', supplier: 'Cambodia Agri-Trading Ltd', orderedQty: 250, receivedQty: 250, unitCost: 3.20, totalCost: 800.00, status: 'COMPLETED' },
    { poNo: 'PO-2024-042', code: 'PRD-002', product: 'Australian Angus Beef 500g', supplier: 'CP Food Supplies Cambodia', orderedQty: 150, receivedQty: 150, unitCost: 8.50, totalCost: 1275.00, status: 'COMPLETED' },
  ],
  'receive-return-purchase-order': [
    { docNo: 'GRN-REC-081', date: '2024-03-05', poNo: 'PO-2024-041', supplier: 'Cambodia Agri-Trading Ltd', type: 'RECEIVE', items: 14, totalValue: 2750.00, handledBy: 'Dara Heng', status: 'VERIFIED' },
    { docNo: 'RET-PO-012', date: '2024-03-04', poNo: 'PO-2024-039', supplier: 'CP Food Supplies Cambodia', type: 'RETURN', items: 2, totalValue: 145.00, handledBy: 'Sokha Ly', status: 'CREDIT_MEMO' },
    { docNo: 'GRN-REC-082', date: '2024-03-03', poNo: 'PO-2024-042', supplier: 'Mekong Beverage Ltd', type: 'RECEIVE', items: 8, totalValue: 1280.00, handledBy: 'Vanna Touch', status: 'VERIFIED' },
  ],

  // PAYABLE MANAGEMENT SUB-REPORTS
  'bill-aging': [
    { code: 'SUP-001', supplier: 'Cambodia Agri-Trading Ltd', phone: '+855 12 770 112', current: 2400.00, days1to30: 1800.00, days31to60: 0.00, days61to90: 0.00, over90Days: 0.00, totalDue: 4200.00, status: 'CURRENT' },
    { code: 'SUP-002', supplier: 'CP Food Supplies Cambodia', phone: '+855 23 881 234', current: 1250.00, days1to30: 600.00, days31to60: 450.00, days61to90: 0.00, over90Days: 0.00, totalDue: 2300.00, status: 'OVERDUE_30' },
    { code: 'SUP-003', supplier: 'Global Dairy Import Inc', phone: '+855 11 992 001', current: 0.00, days1to30: 0.00, days31to60: 1200.00, days61to90: 800.00, over90Days: 0.00, totalDue: 2000.00, status: 'OVERDUE_60' },
    { code: 'SUP-004', supplier: 'Mekong Beverage Ltd', phone: '+855 16 554 433', current: 890.00, days1to30: 0.00, days31to60: 0.00, days61to90: 0.00, over90Days: 0.00, totalDue: 890.00, status: 'CURRENT' },
  ],
  'bill-payment': [
    { paymentNo: 'PAY-BILL-001', date: '2024-03-06', billRef: 'BIL-2024-089', supplier: 'CP Food Supplies Cambodia', paymentMethod: 'Bank Transfer (ABA)', paidAmount: 3450.00, bankAccount: 'ABA Enterprise 001 889', paidBy: 'Finance Admin', status: 'EXECUTED' },
    { paymentNo: 'PAY-BILL-002', date: '2024-03-05', billRef: 'BIL-2024-085', supplier: 'Mekong Beverage Ltd', paymentMethod: 'Bank Transfer (Wing)', paidAmount: 1280.00, bankAccount: 'Wing Corp 092 441', paidBy: 'Finance Admin', status: 'EXECUTED' },
    { paymentNo: 'PAY-BILL-003', date: '2024-03-03', billRef: 'BIL-2024-081', supplier: 'Cambodia Agri-Trading Ltd', paymentMethod: 'Cheque', paidAmount: 2000.00, bankAccount: 'Canadia Bank 109 22', paidBy: 'Managing Director', status: 'CLEARED' },
  ],
  'bill-status': [
    { billNo: 'BIL-2024-091', date: '2024-03-01', dueDate: '2024-03-31', supplier: 'Cambodia Agri-Trading Ltd', outlet: 'Central Warehouse', totalAmount: 4200.00, paidAmount: 1800.00, balanceDue: 2400.00, status: 'PARTIALLY_PAID' },
    { billNo: 'BIL-2024-092', date: '2024-03-02', dueDate: '2024-03-17', supplier: 'CP Food Supplies Cambodia', outlet: 'Main Mart', totalAmount: 3450.00, paidAmount: 3450.00, balanceDue: 0.00, status: 'FULLY_PAID' },
    { billNo: 'BIL-2024-093', date: '2024-02-20', dueDate: '2024-03-06', supplier: 'Global Dairy Import Inc', outlet: 'Central Warehouse', totalAmount: 2000.00, paidAmount: 0.00, balanceDue: 2000.00, status: 'DUE_TODAY' },
  ],
  'freight-status': [
    { freightNo: 'FRT-2024-011', carrier: 'Phnom Penh Cold Express', date: '2024-03-05', origin: 'Kampong Cham Depot', destination: 'Main Mart Cold Room', freightCharge: 120.00, tax: 12.00, totalCharge: 132.00, paymentStatus: 'PAID' },
    { freightNo: 'FRT-2024-012', carrier: 'Angkor Freight Logistics', date: '2024-03-04', origin: 'Battambang Farm Hub', destination: 'Central Warehouse', freightCharge: 240.00, tax: 24.00, totalCharge: 264.00, paymentStatus: 'PENDING' },
    { freightNo: 'FRT-2024-013', carrier: 'Fast Track Logistics KH', date: '2024-03-03', origin: 'Sihanoukville Port', destination: 'Central Warehouse Dock 1', freightCharge: 450.00, tax: 45.00, totalCharge: 495.00, paymentStatus: 'PAID' },
  ],
  'supplier-deposit-debit': [
    { docNo: 'SDEP-2024-01', date: '2024-02-28', supplier: 'Cambodia Agri-Trading Ltd', type: 'ADVANCE_DEPOSIT', amount: 5000.00, utilizedAmount: 3000.00, balance: 2000.00, method: 'Bank Transfer (ABA)', status: 'ACTIVE' },
    { docNo: 'SDEP-2024-02', date: '2024-03-01', supplier: 'CP Food Supplies Cambodia', type: 'SECURITY_DEPOSIT', amount: 1500.00, utilizedAmount: 0.00, balance: 1500.00, method: 'Bank Transfer (Wing)', status: 'HELD' },
    { docNo: 'SDEB-2024-01', date: '2024-03-04', supplier: 'Global Dairy Import Inc', type: 'DEBIT_MEMO', amount: 350.00, utilizedAmount: 350.00, balance: 0.00, method: 'Credit Offset', status: 'SETTLED' },
  ],
  'ap-cash-payment': [
    { voucherNo: 'AP-CSH-101', date: '2024-03-06', supplier: 'Local Farmers Cooperative', billRef: 'BIL-AGRI-04', amountPaid: 185.00, cashAccount: 'Petty Cash Box #1', approvedBy: 'Finance Officer', status: 'PAID' },
    { voucherNo: 'AP-CSH-102', date: '2024-03-05', supplier: 'Phnom Penh Packaging Supplies', billRef: 'BIL-PKG-88', amountPaid: 320.00, cashAccount: 'General Cash Drawer', approvedBy: 'Store Manager', status: 'PAID' },
    { voucherNo: 'AP-CSH-103', date: '2024-03-04', supplier: 'City Disinfectant Supplies', billRef: 'BIL-CL-22', amountPaid: 95.00, cashAccount: 'Petty Cash Box #1', approvedBy: 'Finance Officer', status: 'PAID' },
  ],
  'supplier-list': [
    { code: 'SUP-001', supplier: 'Cambodia Agri-Trading Ltd', contactPerson: 'Mr. Touch Vanna', phone: '+855 12 770 112', category: 'Grains & Rice', paymentTerm: 'Net 30', activeOrders: 3, balanceDue: 2400.00, status: 'ACTIVE' },
    { code: 'SUP-002', supplier: 'CP Food Supplies Cambodia', contactPerson: 'Ms. Keo Sreymom', phone: '+855 23 881 234', category: 'Meat & Poultry', paymentTerm: 'Net 15', activeOrders: 2, balanceDue: 0.00, status: 'PREFERRED' },
    { code: 'SUP-003', supplier: 'Global Dairy Import Inc', contactPerson: 'Mr. David Miller', phone: '+855 11 992 001', category: 'Dairy & Cheese', paymentTerm: 'Net 30', activeOrders: 1, balanceDue: 2000.00, status: 'ACTIVE' },
    { code: 'SUP-004', supplier: 'Mekong Beverage Ltd', contactPerson: 'Mr. Heng Dara', phone: '+855 16 554 433', category: 'Beverages', paymentTerm: 'Immediate', activeOrders: 0, balanceDue: 0.00, status: 'ACTIVE' },
  ],

  // CASH BOOK SUB-REPORTS
  'cash-in-out-status': [
    { entryNo: 'CSH-ENTRY-001', date: '2024-03-06', account: 'Main Cash Drawer POS-1', type: 'CASH_IN', amount: 1450.00, reason: 'Retail Grocery POS Sales', authorizedBy: 'Sokha Ly', status: 'VERIFIED' },
    { entryNo: 'CSH-ENTRY-002', date: '2024-03-06', account: 'Petty Cash Operations', type: 'CASH_OUT', amount: 65.00, reason: 'Store Cleaning Consumables', authorizedBy: 'Store Manager', status: 'APPROVED' },
    { entryNo: 'CSH-ENTRY-003', date: '2024-03-05', account: 'Main Cash Vault', type: 'CASH_IN', amount: 4850.00, reason: 'End of Day POS Drop', authorizedBy: 'Finance Officer', status: 'RECONCILED' },
  ],
  'cash-statement': [
    { statementDate: '2024-03-06', account: 'Store Operating Cash Vault', openingBalance: 8500.00, totalInflow: 4850.00, totalOutflow: 1200.00, closingBalance: 12150.00, status: 'RECONCILED' },
    { statementDate: '2024-03-05', account: 'Store Operating Cash Vault', openingBalance: 6200.00, totalInflow: 4100.00, totalOutflow: 1800.00, closingBalance: 8500.00, status: 'RECONCILED' },
    { statementDate: '2024-03-04', account: 'Store Operating Cash Vault', openingBalance: 5100.00, totalInflow: 3800.00, totalOutflow: 2700.00, closingBalance: 6200.00, status: 'RECONCILED' },
  ],
  'bank-transfer': [
    { transferNo: 'BNK-TRF-088', date: '2024-03-06', fromBank: 'ABA PayWay Settlement', toBank: 'ABA Corporate Main 001', amount: 8500.00, fee: 0.00, netTransfer: 8500.00, referenceNo: 'ABA-TXN-992144', status: 'COMPLETED' },
    { transferNo: 'BNK-TRF-089', date: '2024-03-05', fromBank: 'Wing Merchant Account', toBank: 'Canadia Operating Account', amount: 3200.00, fee: 1.50, netTransfer: 3198.50, referenceNo: 'WNG-TXN-441209', status: 'COMPLETED' },
    { transferNo: 'BNK-TRF-090', date: '2024-03-04', fromBank: 'Cash Vault Deposit', toBank: 'ABA Corporate Main 001', amount: 5000.00, fee: 0.00, netTransfer: 5000.00, referenceNo: 'BNK-DEP-338210', status: 'COMPLETED' },
  ],
}

function ChevronIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronLeftIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Reusable Card for Report Navigation
function HubItemCard({ item, lang }) {
  const { isDark } = useTheme()
  return (
    <Link
      to={item.route}
      className={`hub-card group relative overflow-hidden flex flex-col justify-between rounded-2xl border p-5 text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${isDark
        ? 'border-slate-800 bg-[#141922]/90 hover:border-slate-700 hover:bg-[#1a2230] hover:shadow-black/40'
        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 hover:shadow-slate-200/60'
        }`}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-10 blur-2xl transition-opacity group-hover:opacity-25"
        style={{ background: item.color }}
      />

      <div className="relative space-y-3.5">
        <div className="flex items-start justify-between gap-2">
          <div
            className="hub-icon flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-2xl ring-1 transition-all duration-300 group-hover:scale-110"
            style={{
              background: item.bg,
              borderColor: item.color + '40',
            }}
          >
            <img src={item.icon} alt="" className="h-7 w-7 sm:h-8 sm:w-8 object-contain drop-shadow" />
          </div>
          {item.tag && (
            <span
              className="rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider font-mono shadow-sm"
              style={{
                background: item.bg,
                color: item.color,
                border: `1px solid ${item.color}40`,
              }}
            >
              {item.tag}
            </span>
          )}
        </div>

        <div>
          <h3 className={`text-base font-black tracking-tight transition-colors font-['Montserrat'] ${isDark ? 'text-white group-hover:text-white' : 'text-slate-800 group-hover:text-slate-900'
            }`}>
            {lang === 'kh' ? item.kh : item.en}
          </h3>
          <p className={`mt-1 text-xs leading-relaxed font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
            {lang === 'kh' ? item.descKh : item.descEn}
          </p>
        </div>
      </div>

      <div
        className={`relative mt-5 flex items-center justify-between pt-3 border-t text-xs font-bold transition-all ${isDark ? 'border-slate-800/80' : 'border-slate-100'
          }`}
        style={{ color: item.color }}
      >
        <span>{lang === 'kh' ? 'បើករបាយការណ៍' : 'View Report'}</span>
        <span className="transform transition-transform duration-200 group-hover:translate-x-1.5">
          <ChevronIcon />
        </span>
      </div>
    </Link>
  )
}

// Clean Professional Column Titles Dictionary for Paper & Screen
const COLUMN_TITLES = {
  // Exact 11 Stock Reports Entity Headers
  documentCode: 'Document Code',
  productCode: 'Product Code',
  barcode: 'Barcode',
  description: 'Description',
  uom: 'UOM',
  requestQty: 'Request Qty',
  shipQty: 'Ship QTY',
  acceptQty: 'Accept Qty',
  closedQty: 'Closed QTY',
  voidedQty: 'Voided Qty',
  remainQty: 'Remain Qty',
  rejectQty: 'Reject Qty',
  fromOutlet: 'From Outlet',
  toOutlet: 'To Outlet',
  qty: 'QTY',
  cost: 'Cost',
  avgCost: 'AVG Cost',
  lastCost: 'Last Cost',
  price: 'Price',
  totalPrice: 'Total Price',
  basePrice: 'BASEPRICE',
  transactionType: 'Transaction Type',
  document: 'Document',
  stockUom: 'Stock UOM',
  tranUom: 'Tran UOM',
  balanceQty: 'Balance QTY',
  onhand: 'Onhand',
  orderPoint: 'Order Point',
  orderQuantity: 'Order Quantity',
  beginning: 'Beginning',
  receive: 'Receive',
  issue: 'Issue',
  adjust: 'Adjust',
  transferIn: 'Transfer In',
  transferOut: 'Transfer Out',
  sale: 'Sale',
  return: 'Return',
  balance: 'Balance',
  docNo: 'Document #',
  reqNo: 'Request #',
  shipNo: 'Shipment #',
  trfNo: 'Transfer #',
  adjNo: 'Adjustment #',
  issueNo: 'Issue #',
  txnId: 'Transaction ID',
  code: 'Item Code',
  name: 'Product Name',
  product: 'Product Description',
  category: 'Category',
  brand: 'Brand',
  outlet: 'Outlet / Branch',
  location: 'Location / Bay',
  supplier: 'Supplier / Source',
  customer: 'Customer / Party',
  date: 'Date',
  items: 'Total Items',
  totalCost: 'Total Cost ($)',
  unitCost: 'Unit Cost ($)',
  sellingPrice: 'Selling Price ($)',
  baseCost: 'Base Cost ($)',
  memberPrice: 'Member Price ($)',
  marginPct: 'Margin %',
  availableQty: 'Available Qty',
  totalQty: 'Total Qty',
  varianceQty: 'Variance Qty',
  costImpact: 'Cost Impact ($)',
  issuedCost: 'Issued Cost ($)',
  settlement: 'Settlement ($)',
  consignedQty: 'Consigned Qty',
  soldQty: 'Sold Qty',
  total: 'Grand Total ($)',
  paid: 'Paid Amount ($)',
  balance: 'Balance Due ($)',
  amount: 'Total Amount ($)',
  fifoCost: 'FIFO Cost ($)',
  retailValuation: 'Retail Valuation ($)',
  valuation: 'Valuation ($)',
  potentialMargin: 'Potential Margin',
  skus: 'Active SKUs',
  units: 'Total Units',
  currentStock: 'Current Stock',
  safetyStock: 'Safety Stock',
  reorderPoint: 'Reorder Point',
  suggestedPO: 'Suggested PO',
  leadTime: 'Lead Time',
  carrier: 'Carrier / Fleet',
  operator: 'Operator',
  receivedBy: 'Received By',
  requestedBy: 'Requested By',
  adjustedBy: 'Adjusted By',
  issuedBy: 'Issued By',
  adjustmentType: 'Adjustment Type',
  priority: 'Priority',
  method: 'Payment Method',
  type: 'Transaction Type',
  term: 'Payment Term',
  receiving: 'Receiving Status',
  invoiceRef: 'Invoice Ref #',
  dueDate: 'Due Date',
  department: 'Department Scope',
  delivery: 'Delivery Status',
  status: 'Status',
  // 15 Sale Payment Reports Custom Column Headers
  register: 'Register / POS',
  cashier: 'Cashier / Staff',
  totalInvoices: 'Total Invoices',
  grossSales: 'Gross Sales ($)',
  discount: 'Discount ($)',
  tax: 'Tax ($)',
  netSales: 'Net Sales ($)',
  cashAmount: 'Cash Amount ($)',
  abaAmount: 'ABA Amount ($)',
  cardAmount: 'Card Amount ($)',
  totalCollected: 'Total Collected ($)',
  paymentMethod: 'Payment Method',
  subtotal: 'Subtotal ($)',
  grandTotal: 'Grand Total ($)',
  paidAmount: 'Paid Amount ($)',
  phone: 'Phone Number',
  current: 'Current (0-30d) ($)',
  days1to30: '1-30 Days ($)',
  days31to60: '31-60 Days ($)',
  days61to90: '61-90 Days ($)',
  over90Days: 'Over 90 Days ($)',
  totalDue: 'Total Due ($)',
  salesperson: 'Salesperson',
  gateway: 'Payment Gateway',
  referenceNo: 'Reference #',
  orderRef: 'Order Ref #',
  fee: 'Processing Fee ($)',
  netAmount: 'Net Amount ($)',
  currency: 'Currency',
  settlementStatus: 'Settlement Status',
  customerGroup: 'Customer Group',
  creditLimit: 'Credit Limit ($)',
  currentBalance: 'Current Balance ($)',
  unpaidInvoices: 'Unpaid Invoices',
  depositBalance: 'Deposit Balance ($)',
  availableCredit: 'Available Credit ($)',
  lastPaymentDate: 'Last Payment Date',
  depositType: 'Deposit Type',
  utilizedAmount: 'Utilized Amount ($)',
  remainingBalance: 'Remaining Balance ($)',
  note: 'Remarks / Notes',
  paymentNo: 'Payment Receipt #',
  invoiceCode: 'Invoice Code',
  discountTaken: 'Discount Taken ($)',
  bankAccount: 'Bank / Destination Account',
  collectedBy: 'Collected By',
  invoiceNo: 'Invoice #',
  issueDate: 'Issue Date',
  outstandingBalance: 'Outstanding Balance ($)',
  daysOverdue: 'Days Overdue',
  paymentStatus: 'Payment Status',
  totalRevenue: 'Total Revenue ($)',
  grossProfit: 'Gross Profit ($)',
  profitMargin: 'Profit Margin',
  ranking: 'Sales Rank',
  performanceType: 'Performance Type',
  receiptNo: 'Receipt #',
  receivedFrom: 'Received From',
  reason: 'Reason / Description',
  period: 'Financial Period',
  revenue: 'Total Revenue ($)',
  cogs: 'Cost of Goods Sold ($)',
  operationalExpense: 'Operating Expense ($)',
  netProfit: 'Net Profit ($)',
  roiPct: 'Net Margin / ROI',
  paymentType: 'Payment Method / Type',
  transactionCount: 'Total Transactions',
  pctOfTotal: '% of Total Volume',
  avgTicketSize: 'Avg Ticket Size ($)',
  processingFee: 'Processing Fee ($)',
  netSettlement: 'Net Settlement ($)',
  shiftNo: 'Shift #',
  shiftName: 'Shift Name / Schedule',
  openingCash: 'Opening Cash Float ($)',
  cashSales: 'Cash Sales ($)',
  electronicSales: 'Electronic / QR ($)',
  cashInDrawer: 'Actual Drawer Cash ($)',
  variance: 'Cash Variance ($)',
  closedAt: 'Shift Closed Time',
  promoCode: 'Promotion Code',
  promoName: 'Promotion Title',
  discountType: 'Discount Mechanism',
  startDate: 'Start Date',
  endDate: 'End Date',
  appliedCount: 'Times Applied',
  totalDiscountGiven: 'Total Discount ($)',
  revenueGenerated: 'Revenue Generated ($)',
  packageCode: 'Package SKU',
  packageName: 'Package / Bundle Title',
  packagePrice: 'Bundle Price ($)',
  itemsTotalValue: 'Standard Item Value ($)',
  packagesSold: 'Bundles Sold',
  costPrice: 'Bundle Cost ($)',
  profit: 'Gross Profit ($)',
  // Additional Module Sub-Report Columns
  orderNo: 'Order #',
  orderStatus: 'Order Status',
  shipmentNo: 'Shipment #',
  dispatchDate: 'Dispatch Date',
  deliveryAddress: 'Delivery Address',
  trackingNo: 'Tracking #',
  shipmentStatus: 'Shipment Status',
  vendor: 'Vendor / Consignor',
  totalPackages: 'Total Packages',
  contractNo: 'Contract #',
  returnQty: 'Return Qty',
  remainingQty: 'Remaining Qty',
  settlementAmount: 'Settlement Amount ($)',
  totalItems: 'Total Items',
  estimatedCost: 'Estimated Cost ($)',
  poNo: 'PO #',
  receivingStatus: 'Receiving Status',
  orderedQty: 'Ordered Qty',
  receivedQty: 'Received Qty',
  totalValue: 'Total Value ($)',
  handledBy: 'Handled By',
  billRef: 'Bill Ref #',
  paidBy: 'Paid By',
  billNo: 'Bill #',
  balanceDue: 'Balance Due ($)',
  freightNo: 'Freight #',
  origin: 'Origin',
  destination: 'Destination',
  freightCharge: 'Freight Charge ($)',
  totalCharge: 'Total Charge ($)',
  voucherNo: 'Voucher #',
  amountPaid: 'Amount Paid ($)',
  cashAccount: 'Cash / Payment Account',
  approvedBy: 'Approved By',
  contactPerson: 'Contact Person',
  paymentTerm: 'Payment Term',
  activeOrders: 'Active Orders',
  entryNo: 'Entry #',
  account: 'Account',
  authorizedBy: 'Authorized By',
  statementDate: 'Statement Date',
  openingBalance: 'Opening Balance ($)',
  totalInflow: 'Total Inflow ($)',
  totalOutflow: 'Total Outflow ($)',
  closingBalance: 'Closing Balance ($)',
  transferNo: 'Transfer #',
  fromBank: 'Source Bank / Account',
  toBank: 'Destination Bank / Account',
  netTransfer: 'Net Transfer ($)',
  // Exact 11 Stock Report Entity Titles (Strict match to user specifications)
  documentCode: 'Document Code',
  productCode: 'Product Code',
  barcode: 'Barcode',
  description: 'Description',
  uom: 'UOM',
  requestQty: 'Request Qty',
  shipQty: 'Ship QTY',
  acceptQty: 'Accept Qty',
  closedQty: 'Closed QTY',
  voidedQty: 'Voided Qty',
  remainQty: 'Remain Qty',
  rejectQty: 'Reject Qty',
  fromOutlet: 'From Outlet',
  toOutlet: 'To Outlet',
  qty: 'QTY',
  cost: 'Cost',
  avgCost: 'AVG Cost',
  lastCost: 'Last Cost',
  totalCost: 'Total Cost',
  price: 'Price',
  totalPrice: 'Total Price',
  basePrice: 'BASEPRICE',
  transactionType: 'Transaction Type',
  document: 'Document',
  stockUom: 'Stock UOM',
  tranUom: 'Tran UOM',
  balanceQty: 'Balance QTY',
  onhand: 'Onhand',
  orderPoint: 'Order Point',
  orderQuantity: 'Order Quantity',
  beginning: 'Beginning',
  receive: 'Receive',
  issue: 'Issue',
  adjust: 'Adjust',
  transferIn: 'Transfer In',
  transferOut: 'Transfer Out',
  sale: 'Sale',
  return: 'Return',
  balance: 'Balance',
  code: 'Code',
  outlet: 'Outlet',
  location: 'Location',
  supplier: 'Supplier',
  receivedBy: 'Received By',
  currency: 'Currency',
  amount: 'Amount',
}

const getColumnLabel = (key) => {
  if (COLUMN_TITLES[key]) return COLUMN_TITLES[key]
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
}

const getColumnAlignment = (key) => {
  const centerKeys = [
    'date', 'status', 'priority', 'type', 'method', 'tax', 'leadTime', 'receiving', 'delivery',
    'term', 'register', 'shiftNo', 'closedAt', 'ranking', 'performanceType', 'currency',
    'settlementStatus', 'paymentStatus', 'depositType', 'discountType', 'promoCode', 'packageCode',
    'issueDate', 'dueDate', 'lastPaymentDate', 'startDate', 'endDate', 'unpaidInvoices', 'daysOverdue',
    'dispatchDate', 'trackingNo', 'shipmentStatus', 'orderStatus', 'contractNo', 'poNo', 'receivingStatus',
    'billNo', 'billRef', 'freightNo', 'voucherNo', 'statementDate', 'transferNo', 'entryNo',
    'uom', 'stockUom', 'tranUom', 'transactionType'
  ]
  const rightKeys = [
    'items', 'totalCost', 'unitCost', 'sellingPrice', 'baseCost', 'memberPrice',
    'marginPct', 'availableQty', 'totalQty', 'varianceQty', 'costImpact', 'issuedCost',
    'settlement', 'consignedQty', 'soldQty', 'total', 'paid', 'balance', 'amount',
    'fifoCost', 'retailValuation', 'skus', 'units', 'valuation',
    // Stock Report Entity numeric keys:
    'requestQty', 'shipQty', 'acceptQty', 'closedQty', 'voidedQty', 'remainQty', 'rejectQty',
    'qty', 'cost', 'avgCost', 'lastCost', 'price', 'totalPrice', 'basePrice',
    'balanceQty', 'onhand', 'orderPoint', 'orderQuantity',
    'beginning', 'receive', 'issue', 'adjust', 'transferIn', 'transferOut', 'sale', 'return',
    'grossSales', 'discount', 'netSales', 'cashAmount', 'abaAmount', 'cardAmount', 'totalCollected',
    'subtotal', 'grandTotal', 'paidAmount', 'current', 'days1to30', 'days31to60', 'days61to90', 'over90Days',
    'totalDue', 'fee', 'netAmount', 'creditLimit', 'currentBalance', 'depositBalance', 'availableCredit',
    'utilizedAmount', 'remainingBalance', 'discountTaken', 'outstandingBalance', 'totalRevenue', 'grossProfit',
    'revenue', 'cogs', 'operationalExpense', 'netProfit', 'transactionCount', 'avgTicketSize', 'processingFee',
    'netSettlement', 'openingCash', 'cashSales', 'electronicSales', 'cashInDrawer', 'variance', 'appliedCount',
    'totalDiscountGiven', 'revenueGenerated', 'packagePrice', 'itemsTotalValue', 'packagesSold', 'costPrice',
    'profit', 'totalInvoices', 'totalAmount', 'totalPackages', 'returnQty', 'remainingQty', 'settlementAmount',
    'totalItems', 'estimatedCost', 'orderedQty', 'receivedQty', 'totalValue', 'balanceDue', 'freightCharge',
    'totalCharge', 'amountPaid', 'activeOrders', 'openingBalance', 'totalInflow', 'totalOutflow', 'closingBalance',
    'netTransfer'
  ]
  if (centerKeys.includes(key)) return 'text-center'
  if (rightKeys.includes(key)) return 'text-right'
  return 'text-left'
}

const formatCellValue = (key, val) => {
  if (val == null || val === '') return '-'
  const lower = key.toLowerCase()

  // Quantity / Count Keys that must NEVER be formatted as currency
  const isNonCurrencyNumeric = (
    key === 'qty' ||
    key === 'requestQty' ||
    key === 'shipQty' ||
    key === 'acceptQty' ||
    key === 'closedQty' ||
    key === 'voidedQty' ||
    key === 'remainQty' ||
    key === 'rejectQty' ||
    key === 'balanceQty' ||
    key === 'onhand' ||
    key === 'orderPoint' ||
    key === 'orderQuantity' ||
    key === 'beginning' ||
    key === 'receive' ||
    key === 'issue' ||
    key === 'adjust' ||
    key === 'transferIn' ||
    key === 'transferOut' ||
    key === 'sale' ||
    key === 'return' ||
    key === 'currency' ||
    key === 'ranking' ||
    key === 'unpaidInvoices' ||
    key === 'daysOverdue' ||
    key === 'totalInvoices' ||
    key === 'transactionCount' ||
    key === 'appliedCount' ||
    key === 'packagesSold' ||
    key === 'soldQty' ||
    key === 'skus' ||
    key === 'units' ||
    key === 'items' ||
    key === 'totalQty' ||
    key === 'availableQty' ||
    key === 'varianceQty' ||
    key === 'totalPackages' ||
    key === 'returnQty' ||
    key === 'remainingQty' ||
    key === 'orderedQty' ||
    key === 'receivedQty' ||
    key === 'activeOrders' ||
    key === 'totalItems'
  )

  const isCurrency = !isNonCurrencyNumeric && (
    key === 'cost' ||
    key === 'totalCost' ||
    key === 'avgCost' ||
    key === 'lastCost' ||
    key === 'price' ||
    key === 'totalPrice' ||
    key === 'basePrice' ||
    key === 'amount' ||
    lower.includes('cost') ||
    lower.includes('price') ||
    lower.includes('valuation') ||
    lower.includes('settlement') ||
    lower.includes('paid') ||
    lower.includes('sales') ||
    lower.includes('revenue') ||
    lower.includes('profit') ||
    lower.includes('discount') ||
    lower.includes('fee') ||
    lower.includes('deposit') ||
    lower.includes('credit') ||
    lower.includes('due') ||
    lower.includes('cogs') ||
    lower.includes('expense') ||
    lower.includes('drawer') ||
    lower.includes('subtotal') ||
    (lower.includes('total') && !lower.includes('qty')) ||
    (lower.includes('balance') && !lower.includes('qty')) ||
    key === 'costImpact' ||
    key === 'current' ||
    key === 'days1to30' ||
    key === 'days31to60' ||
    key === 'days61to90' ||
    key === 'over90Days' ||
    key === 'openingCash' ||
    key === 'variance'
  )

  if (typeof val === 'number') {
    if (isCurrency) {
      if (val < 0) {
        return `-$${Math.abs(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      }
      return `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
    return val.toLocaleString()
  }

  // If string represents a numeric currency value
  if (isCurrency && typeof val === 'string' && !isNaN(Number(val)) && val.trim() !== '') {
    const num = Number(val)
    if (num < 0) {
      return `-$${Math.abs(num).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
    return `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  return String(val)
}

const computeReportTotals = (records) => {
  if (!records || records.length === 0) return {}
  const totals = {}
  const numericKeys = new Set([
    'items', 'totalCost', 'totalQty', 'varianceQty', 'costImpact', 'issuedCost',
    'availableQty', 'unitCost', 'sellingPrice', 'baseCost', 'memberPrice',
    'settlement', 'consignedQty', 'soldQty', 'total', 'paid', 'balance', 'amount',
    'skus', 'units', 'fifoCost', 'retailValuation', 'valuation',
    // Stock Report Entity numeric keys:
    'requestQty', 'shipQty', 'acceptQty', 'closedQty', 'voidedQty', 'remainQty', 'rejectQty',
    'qty', 'cost', 'avgCost', 'lastCost', 'price', 'totalPrice', 'basePrice',
    'balanceQty', 'onhand', 'orderPoint', 'orderQuantity',
    'beginning', 'receive', 'issue', 'adjust', 'transferIn', 'transferOut', 'sale', 'return',
    'totalInvoices', 'grossSales', 'discount', 'tax', 'netSales', 'cashAmount', 'abaAmount', 'cardAmount', 'totalCollected',
    'subtotal', 'grandTotal', 'paidAmount', 'current', 'days1to30', 'days31to60', 'days61to90', 'over90Days', 'totalDue',
    'fee', 'netAmount', 'creditLimit', 'currentBalance', 'unpaidInvoices', 'depositBalance', 'availableCredit',
    'utilizedAmount', 'remainingBalance', 'discountTaken', 'outstandingBalance', 'totalRevenue', 'grossProfit',
    'revenue', 'cogs', 'operationalExpense', 'netProfit', 'transactionCount', 'avgTicketSize', 'processingFee',
    'netSettlement', 'openingCash', 'cashSales', 'electronicSales', 'cashInDrawer', 'variance', 'appliedCount',
    'totalDiscountGiven', 'revenueGenerated', 'packagePrice', 'itemsTotalValue', 'packagesSold', 'costPrice', 'profit'
  ])

  records.forEach((row) => {
    Object.entries(row).forEach(([key, val]) => {
      if (numericKeys.has(key) || typeof val === 'number') {
        const num = typeof val === 'number' ? val : parseFloat(String(val).replace(/[^0-9.-]+/g, ''))
        if (!isNaN(num)) {
          totals[key] = (totals[key] || 0) + num
        }
      }
    })
  })
  return totals
}

export default function Report() {
  const { isDark } = useTheme()
  const { lang } = useLanguage()
  const { showNotification } = useNotifications()
  const location = useLocation()
  const printContentRef = useRef(null)

  // Routing State Breakdown:
  // 1. /admin/report -> Main 7 reports hub
  // 2. /admin/report/stock -> Stock 11 reports hub
  // 3. /admin/report/stock/:subKey -> Specific stock report detail table
  // 4. /admin/report/sale-payment -> Sale Payment 15 reports hub
  // URL Routing Structure:
  // 1. /admin/report -> Main 7 Modules Intelligence Hub
  // 2. /admin/report/:moduleKey -> Dedicated Sub-Reports Hub for that module
  // 3. /admin/report/:moduleKey/:subKey -> Specific Sub-Report Detail Table
  const pathParts = location.pathname.replace(/^\/admin\/report\/?/, '').split('/').filter(Boolean)

  // Module Hub View: /admin/report/:moduleKey
  const isModuleHub = pathParts.length === 1
  const moduleHubKey = isModuleHub ? pathParts[0] : null
  const currentModuleHub = useMemo(() => {
    return REPORT_MODULES.find((m) => m.key === moduleHubKey) || null
  }, [moduleHubKey])
  const currentModuleSubReports = useMemo(() => {
    return MODULE_SUB_REPORTS[moduleHubKey] || []
  }, [moduleHubKey])

  // Specific Sub-Report Detail Table: /admin/report/:moduleKey/:subKey
  const isSubReport = pathParts.length >= 2
  const parentModuleKey = isSubReport ? pathParts[0] : null
  const subReportKey = isSubReport ? pathParts[1] : null

  const isStockSub = parentModuleKey === 'stock'

  const parentModule = useMemo(() => {
    return REPORT_MODULES.find((m) => m.key === parentModuleKey) || null
  }, [parentModuleKey])

  const backRoute = parentModule ? parentModule.route : '/admin/report'
  const backLabel = parentModule
    ? (lang === 'kh' ? parentModule.kh : parentModule.en)
    : (lang === 'kh' ? 'មជ្ឈមណ្ឌល' : 'Reports Hub')

  const activeCurrentModule = useMemo(() => {
    if (isSubReport && parentModuleKey && subReportKey) {
      const subList = MODULE_SUB_REPORTS[parentModuleKey] || []
      const found = subList.find((s) => s.key === subReportKey)
      if (found) return found
    }
    return null
  }, [isSubReport, parentModuleKey, subReportKey])

  // Search states for Hubs
  const [searchMain, setSearchMain] = useState('')
  const [searchSubHub, setSearchSubHub] = useState('')

  // ----------------------------------------------------
  // PREVIEW REPORT CONTROLS STATE (User Specifications)
  // ----------------------------------------------------
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [datePreset, setDatePreset] = useState('all')
  const [customerFilter, setCustomerFilter] = useState('')

  // Advance Filters State
  const [advanceOpen, setAdvanceOpen] = useState(false)
  const [outletFilter, setOutletFilter] = useState('all')
  const [locationFilter, setLocationFilter] = useState('all')
  const [productFilter, setProductFilter] = useState('')
  const [productGroupFilter, setProductGroupFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [brandFilter, setBrandFilter] = useState('all')
  const [supplierFilter, setSupplierFilter] = useState('all')
  const [groupByFilter, setGroupByFilter] = useState('none')
  const [viewAsFilter, setViewAsFilter] = useState('detailed')

  // Request Transfer Specific Advance Filters State
  const [requestOutletFilter, setRequestOutletFilter] = useState('all')
  const [requestLocationFilter, setRequestLocationFilter] = useState('all')
  const [toOutletFilter, setToOutletFilter] = useState('all')
  const [toLocationFilter, setToLocationFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [requestTransferTypeFilter, setRequestTransferTypeFilter] = useState('all')

  // Adjustment Specific Advance Filter State
  const [adjustTypeFilter, setAdjustTypeFilter] = useState('all')

  // Inventory Specific Advance Filters State
  const [expiryDayFilter, setExpiryDayFilter] = useState('all')
  const [inventoryValueFilter, setInventoryValueFilter] = useState('')
  const [onhandFilter, setOnhandFilter] = useState('all')

  // Live Data & Loading State
  const [liveData, setLiveData] = useState([])
  const [loading, setLoading] = useState(false)

  // Live Dropdown Options for Advance Filter
  const [filterOptions, setFilterOptions] = useState({
    outlets: [],
    locations: [],
    categories: [],
    brands: [],
    productGroups: [],
    suppliers: [],
    products: [],
  })

  // Print Preview Modal State & Paper Customizations
  const [printPreviewOpen, setPrintPreviewOpen] = useState(false)
  const [printOrientation, setPrintOrientation] = useState('portrait') // portrait or landscape
  const [printDensity, setPrintDensity] = useState('compact') // normal, compact, dense
  const [showKpiCards, setShowKpiCards] = useState(true)
  const [showSignatures, setShowSignatures] = useState(true)
  const [showPrintNotes, setShowPrintNotes] = useState(true)

  // Choose Column Modal State & Visibility Map per Stock Report
  const [showColModal, setShowColModal] = useState(false)
  const [visibleCols, setVisibleCols] = useState(new Set())
  const [colDraft, setColDraft] = useState(new Set())

  // Advanced Product Search Modal State
  const [showProductModal, setShowProductModal] = useState(false)
  const [productModalQuery, setProductModalQuery] = useState('')
  const [productModalCategory, setProductModalCategory] = useState('all')

  // Active report data key
  const activeDataKey = subReportKey || moduleHubKey

  // Count active advance filters
  const activeAdvanceFilterCount = useMemo(() => {
    let count = 0
    if (activeDataKey === 'request-transfer') {
      if (requestOutletFilter !== 'all') count++
      if (requestLocationFilter !== 'all') count++
      if (toOutletFilter !== 'all') count++
      if (toLocationFilter !== 'all') count++
      if (productFilter.trim()) count++
      if (productGroupFilter !== 'all') count++
      if (brandFilter !== 'all') count++
      if (categoryFilter !== 'all') count++
      if (groupByFilter !== 'none') count++
      if (statusFilter !== 'all') count++
      if (requestTransferTypeFilter !== 'all') count++
      return count
    }
    if (activeDataKey === 'ship-request-transfer') {
      if (requestOutletFilter !== 'all') count++
      if (requestLocationFilter !== 'all') count++
      if (toOutletFilter !== 'all') count++
      if (toLocationFilter !== 'all') count++
      if (productFilter.trim()) count++
      if (productGroupFilter !== 'all') count++
      if (brandFilter !== 'all') count++
      if (categoryFilter !== 'all') count++
      if (groupByFilter !== 'none') count++
      if (statusFilter !== 'all') count++
      return count
    }
    if (activeDataKey === 'adjustment') {
      if (outletFilter !== 'all') count++
      if (locationFilter !== 'all') count++
      if (adjustTypeFilter !== 'all') count++
      if (productFilter.trim()) count++
      if (productGroupFilter !== 'all') count++
      if (categoryFilter !== 'all') count++
      if (brandFilter !== 'all') count++
      if (groupByFilter !== 'none') count++
      if (viewAsFilter !== 'detailed') count++
      return count
    }
    if (activeDataKey === 'issued') {
      if (outletFilter !== 'all') count++
      if (locationFilter !== 'all') count++
      if (productFilter.trim()) count++
      if (productGroupFilter !== 'all') count++
      if (categoryFilter !== 'all') count++
      if (brandFilter !== 'all') count++
      if (groupByFilter !== 'none') count++
      if (viewAsFilter !== 'detailed') count++
      return count
    }
    if (activeDataKey === 'inventory-list') {
      if (outletFilter !== 'all') count++
      if (brandFilter !== 'all') count++
      if (categoryFilter !== 'all') count++
      if (expiryDayFilter !== 'all') count++
      if (inventoryValueFilter.trim()) count++
      if (onhandFilter !== 'all') count++
      if (groupByFilter !== 'none') count++
      if (statusFilter !== 'all') count++
      if (viewAsFilter !== 'detailed') count++
      return count
    }
    if (outletFilter !== 'all') count++
    if (locationFilter !== 'all') count++
    if (productFilter.trim()) count++
    if (productGroupFilter !== 'all') count++
    if (categoryFilter !== 'all') count++
    if (brandFilter !== 'all') count++
    if (activeDataKey !== 'transferred' && activeDataKey !== 'adjustment' && activeDataKey !== 'issued' && activeDataKey !== 'inventory-list' && supplierFilter !== 'all') count++
    if (groupByFilter !== 'none') count++
    if (viewAsFilter !== 'detailed') count++
    return count
  }, [
    activeDataKey,
    requestOutletFilter,
    requestLocationFilter,
    toOutletFilter,
    toLocationFilter,
    statusFilter,
    requestTransferTypeFilter,
    adjustTypeFilter,
    outletFilter,
    locationFilter,
    productFilter,
    productGroupFilter,
    categoryFilter,
    brandFilter,
    supplierFilter,
    expiryDayFilter,
    inventoryValueFilter,
    onhandFilter,
    groupByFilter,
    viewAsFilter,
  ])

  // Handle Preset Change (Auto-populates From Date & To Date)
  const handleDatePresetChange = (preset) => {
    setDatePreset(preset)
    if (preset === 'all' || preset === 'custom') return
    const range = calculateDateRange(preset)
    setFromDate(range.from)
    setToDate(range.to)
  }

  // 1. Fetch Live Filter Options from backend database
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const [officesRes, sectionsRes, categoriesRes, brandsRes, groupsRes, suppliersRes, productsRes] =
          await Promise.allSettled([
            adminOfficeAPI.getAll(),
            adminSectionAPI.getAll(),
            adminCategoryAPI.getAll(),
            adminBrandAPI.getAll(),
            adminProductGroupAPI.getAll(),
            adminSupplierAPI.getAll(),
            adminProductAPI.getAll(),
          ])

        const extractData = (res) => {
          if (res.status === 'fulfilled' && res.value) {
            const val = res.value.data != null ? res.value.data : res.value
            return Array.isArray(val) ? val : []
          }
          return []
        }

        setFilterOptions({
          outlets: extractData(officesRes),
          locations: extractData(sectionsRes),
          categories: extractData(categoriesRes),
          brands: extractData(brandsRes),
          productGroups: extractData(groupsRes),
          suppliers: extractData(suppliersRes),
          products: extractData(productsRes),
        })
      } catch (err) {
        console.warn('Failed to load advance filter options:', err)
      }
    }

    loadFilterOptions()
  }, [])

  // Available products from live database API or catalog fallback
  const availableProducts = useMemo(() => {
    if (filterOptions.products && filterOptions.products.length > 0) {
      return filterOptions.products
    }
    return STOCK_CATALOG_PRODUCTS
  }, [filterOptions.products])

  // Unique categories for product search modal filter chips
  const productModalCategories = useMemo(() => {
    const set = new Set()
    availableProducts.forEach((p) => {
      if (p.category) set.add(p.category)
    })
    return ['all', ...Array.from(set)]
  }, [availableProducts])

  // Filtered products inside the search modal
  const modalFilteredProducts = useMemo(() => {
    let list = availableProducts
    if (productModalCategory !== 'all') {
      list = list.filter((p) => (p.category || '').toLowerCase() === productModalCategory.toLowerCase())
    }
    if (productModalQuery.trim()) {
      const q = productModalQuery.trim().toLowerCase()
      list = list.filter((p) =>
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.code && p.code.toLowerCase().includes(q)) ||
        (p.barcode && p.barcode.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.brand && p.brand.toLowerCase().includes(q))
      )
    }
    return list
  }, [availableProducts, productModalCategory, productModalQuery])

  // Select product from modal handler
  const handleSelectProduct = (prod) => {
    const val = prod.title || prod.name || prod.code
    setProductFilter(val)
    setShowProductModal(false)
    showNotification?.({
      type: 'success',
      title: 'Product Filter Applied',
      message: `Filtering report for: ${val} (${prod.code || 'SKU'}).`,
    })
  }

  // Live unique options for Request Transfer
  const liveRequestTransferOptions = useMemo(() => {
    const rawOutlets = (filterOptions.outlets || []).map((o) => o.description || o.name || o.code).filter(Boolean)
    const rawLocations = (filterOptions.locations || []).map((l) => l.description || l.name || l.code).filter(Boolean)
    const rawGroups = (filterOptions.productGroups || []).map((g) => g.description || g.name || g.code).filter(Boolean)
    const rawBrands = (filterOptions.brands || []).map((b) => b.description || b.name || b.code).filter(Boolean)
    const rawCategories = (filterOptions.categories || []).map((c) => c.description || c.name || c.code).filter(Boolean)

    const docRequestOutlets = []
    const docRequestLocations = []
    const docToOutlets = []
    const docToLocations = []
    const docStatuses = []
    const docTypes = []
    const docGroups = []
    const docBrands = []
    const docCategories = []

    if ((activeDataKey === 'request-transfer' || activeDataKey === 'ship-request-transfer') && Array.isArray(liveData)) {
      liveData.forEach((r) => {
        if (r.requestOutlet) docRequestOutlets.push(r.requestOutlet)
        if (r.fromOutlet) docRequestOutlets.push(r.fromOutlet)
        if (r.requestLocation) docRequestLocations.push(r.requestLocation)
        if (r.fromLocation) docRequestLocations.push(r.fromLocation)
        if (r.toOutlet) docToOutlets.push(r.toOutlet)
        if (r.toLocation) docToLocations.push(r.toLocation)
        if (r.status) docStatuses.push(r.status)
        if (r.requestTransferType) docTypes.push(r.requestTransferType)
        if (r.transferType) docTypes.push(r.transferType)
        if (r.productGroup) docGroups.push(r.productGroup)
        if (r.brand) docBrands.push(r.brand)
        if (r.category) docCategories.push(r.category)
      })
    }

    const uniqueList = (primary, secondary, defaults = []) => {
      const set = new Set()
      primary.forEach((v) => v && set.add(String(v).trim()))
      secondary.forEach((v) => v && set.add(String(v).trim()))
      if (set.size === 0) {
        defaults.forEach((v) => set.add(v))
      }
      return Array.from(set)
    }

    return {
      requestOutlets: uniqueList(rawOutlets, docRequestOutlets, ['Central Warehouse', 'Main Mart', 'BKK1 Branch', 'Toul Kork Branch', 'SR Depot']),
      requestLocations: uniqueList(rawLocations, docRequestLocations, ['Warehouse Floor A', 'Cold Storage #1', 'Chiller Room 2', 'Aisle 3 Chiller', 'Meat Freezer #1', 'Main Shelf B']),
      toOutlets: uniqueList(rawOutlets, docToOutlets, ['Main Mart', 'BKK1 Branch', 'Toul Kork Branch', 'SR Depot', 'Central Warehouse']),
      toLocations: uniqueList(rawLocations, docToLocations, ['Main Shelf B', 'Chiller Room 2', 'Aisle 3 Chiller', 'Meat Freezer #1', 'Warehouse Floor A', 'Cold Storage #1']),
      productGroups: uniqueList(rawGroups, docGroups, ['Fresh Grocery', 'Pantry Staples', 'Cold Chain', 'Beverages']),
      brands: uniqueList(rawBrands, docBrands, ['Heritage Organic', 'Angkor Harvest', 'CP Foods', 'Coca-Cola', 'Lucky Local']),
      categories: uniqueList(rawCategories, docCategories, ['Produce', 'Dairy', 'Meat', 'Bakery', 'Grains', 'Spices', 'Beverages']),
      statuses: uniqueList(['PENDING', 'APPROVED', 'IN_TRANSIT', 'COMPLETED', 'CLOSED', 'VOIDED', 'REJECTED'], docStatuses),
      types: uniqueList(['STANDARD', 'URGENT_RESTOCK', 'INTER_BRANCH', 'EMERGENCY', 'INTERNAL_RETURN'], docTypes),
    }
  }, [filterOptions, liveData, activeDataKey])

  // Live Adjust Types for Adjustment Report
  const liveAdjustTypeOptions = useMemo(() => {
    const defaultTypes = [
      'Stock Count',
      'Breakage',
      'Theft / Loss',
      'Correction',
      'Damaged Goods',
      'Expired',
      'Discrepancy',
      'Other',
    ]
    const set = new Set(defaultTypes)
    if (activeDataKey === 'adjustment' && Array.isArray(liveData)) {
      liveData.forEach((r) => {
        if (r.adjustType) set.add(String(r.adjustType).trim())
        if (r.adjustmentType) set.add(String(r.adjustmentType).trim())
        if (r.type) set.add(String(r.type).trim())
      })
    }
    return Array.from(set)
  }, [activeDataKey, liveData])

  // 2. Fetch Live Data function for ALL 11 Stock Reports and core report modules
  const fetchReportData = useCallback(async () => {
    if (!activeDataKey) return
    setLoading(true)

    let fetched = null
    try {
      // 1. STOCK REPORT: Received list
      if (activeDataKey === 'received') {
        const res = await adminReceiveDocAPI.getAll().catch(() => adminStockDocAPI.getAll('RECEIVE'))
        const items = res?.data || res
        if (Array.isArray(items) && items.length > 0) {
          fetched = items.map((doc) => ({
            documentCode: doc.code || `GRN-${doc.id}`,
            date: (doc.date || doc.createdAt || '').slice(0, 10),
            currency: doc.currency || 'USD',
            supplier: doc.supplier || doc.supplierName || 'Cambodia Agri-Trading Ltd',
            receivedBy: doc.receivedBy || 'Admin',
            totalCost: Number(doc.totalCost != null ? doc.totalCost : 0),
          }))
        }
      }

      // 2. STOCK REPORT: Request Transfer
      else if (activeDataKey === 'request-transfer') {
        const res = await adminTransferAPI.getAll({ docType: 'REQUEST' }).catch(() => adminTransferAPI.getAll())
        const items = res?.data || res
        if (Array.isArray(items) && items.length > 0) {
          const rows = []
          items.forEach((doc) => {
            const reqOutlet = doc.requestOutlet || doc.fromOutlet || doc.fromLoc || 'Central Warehouse'
            const reqLoc = doc.requestLocation || doc.fromLocation || 'Warehouse Floor A'
            const toOut = doc.toOutlet || doc.toLoc || 'Main Mart'
            const toLoc = doc.toLocation || 'Main Shelf B'
            const statusVal = doc.status || 'PENDING'
            const typeVal = doc.requestTransferType || doc.transferType || 'STANDARD'
            const dateVal = (doc.requestTransferDate || doc.transferDate || doc.date || doc.createdAt || '').slice(0, 10)

            if (Array.isArray(doc.lines) && doc.lines.length > 0) {
              doc.lines.forEach((l) => {
                const req = Number(l.qty || l.requestQty || 0)
                const ship = Number(l.shipQty || 0)
                const accept = Number(l.acceptQty || 0)
                const closed = Number(l.closedQty || 0)
                const voided = Number(l.voidedQty || 0)
                const remain = Number(l.remainQty ?? Math.max(0, req - ship))
                const pCode = l.code || l.productCode || (l.productId ? `PRD-${l.productId}` : 'PRD-001')
                const matchedProduct = availableProducts.find((p) =>
                  String(p.id) === String(l.productId) || (p.code && (p.code === pCode || p.code === l.code))
                )

                rows.push({
                  productCode: pCode,
                  barcode: l.barCode || l.barcode || matchedProduct?.barcode || '-',
                  description: l.name || l.description || matchedProduct?.title || matchedProduct?.name || 'Requested Item',
                  uom: l.uom || matchedProduct?.uom || 'Unit',
                  requestQty: req,
                  shipQty: ship,
                  acceptQty: accept,
                  closedQty: closed,
                  voidedQty: voided,
                  remainQty: remain,
                  requestOutlet: reqOutlet,
                  requestLocation: reqLoc,
                  toOutlet: toOut,
                  toLocation: toLoc,
                  status: statusVal,
                  requestTransferType: typeVal,
                  productGroup: l.productGroup || matchedProduct?.productGroup || doc.productGroup || 'Pantry Staples',
                  brand: l.brand || matchedProduct?.brand || doc.brand || 'Heritage Organic',
                  category: l.category || matchedProduct?.category || doc.category || 'Produce',
                  date: dateVal,
                })
              })
            } else {
              const req = Number(doc.totalQty || doc.qty || 1)
              const ship = Number(doc.shipQty || 0)
              const accept = Number(doc.acceptQty || 0)
              const closed = Number(doc.closedQty || 0)
              const voided = Number(doc.voidedQty || 0)
              const remain = Number(doc.remainQty ?? Math.max(0, req - ship))
              const pCode = doc.productCode || doc.code || `REQ-${doc.id}`
              const matchedProduct = availableProducts.find((p) =>
                (p.code && p.code === pCode) || (doc.productId && String(p.id) === String(doc.productId))
              )

              rows.push({
                productCode: pCode,
                barcode: doc.barcode || matchedProduct?.barcode || '-',
                description: doc.description || doc.reference || matchedProduct?.title || matchedProduct?.name || 'Transfer Request',
                uom: doc.uom || matchedProduct?.uom || 'Unit',
                requestQty: req,
                shipQty: ship,
                acceptQty: accept,
                closedQty: closed,
                voidedQty: voided,
                remainQty: remain,
                requestOutlet: reqOutlet,
                requestLocation: reqLoc,
                toOutlet: toOut,
                toLocation: toLoc,
                status: statusVal,
                requestTransferType: typeVal,
                productGroup: doc.productGroup || matchedProduct?.productGroup || 'Pantry Staples',
                brand: doc.brand || matchedProduct?.brand || 'Heritage Organic',
                category: doc.category || matchedProduct?.category || 'Produce',
                date: dateVal,
              })
            }
          })
          fetched = rows
        }
      }

      // 3. STOCK REPORT: Ship Request Transfer
      else if (activeDataKey === 'ship-request-transfer') {
        const res = await adminTransferAPI.getAll()
        const items = res?.data || res
        if (Array.isArray(items) && items.length > 0) {
          const rows = []
          items.forEach((doc) => {
            const reqOutlet = doc.requestOutlet || doc.fromOutlet || doc.fromLoc || 'Central Warehouse'
            const reqLoc = doc.requestLocation || doc.fromLocation || 'Warehouse Floor A'
            const toOut = doc.toOutlet || doc.toLoc || 'Main Mart'
            const toLoc = doc.toLocation || 'Main Shelf B'
            const statusVal = doc.status || 'COMPLETED'
            const dateVal = (doc.shipDate || doc.requestTransferDate || doc.transferDate || doc.date || doc.createdAt || '').slice(0, 10)

            if (Array.isArray(doc.lines) && doc.lines.length > 0) {
              doc.lines.forEach((l) => {
                const ship = Number(l.shipQty ?? l.qty ?? 0)
                const accept = Number(l.acceptQty ?? 0)
                const reject = Number(l.rejectQty ?? 0)
                const remain = Number(l.remainQty ?? Math.max(0, ship - accept - reject))
                const pCode = l.code || l.productCode || (l.productId ? `PRD-${l.productId}` : 'PRD-001')
                const matchedProduct = availableProducts.find((p) =>
                  String(p.id) === String(l.productId) || (p.code && (p.code === pCode || p.code === l.code))
                )

                rows.push({
                  productCode: pCode,
                  barcode: l.barCode || l.barcode || matchedProduct?.barcode || '-',
                  description: l.name || l.description || matchedProduct?.title || matchedProduct?.name || 'Ship Product',
                  uom: l.uom || matchedProduct?.uom || 'Unit',
                  shipQty: ship,
                  acceptQty: accept,
                  rejectQty: reject,
                  remainQty: remain,
                  requestOutlet: reqOutlet,
                  requestLocation: reqLoc,
                  toOutlet: toOut,
                  toLocation: toLoc,
                  status: statusVal,
                  productGroup: l.productGroup || matchedProduct?.productGroup || doc.productGroup || 'Pantry Staples',
                  brand: l.brand || matchedProduct?.brand || doc.brand || 'Heritage Organic',
                  category: l.category || matchedProduct?.category || doc.category || 'Produce',
                  date: dateVal,
                })
              })
            } else {
              const ship = Number(doc.totalQty || doc.shipQty || 10)
              const accept = Number(doc.acceptQty || 0)
              const reject = Number(doc.rejectQty || 0)
              const remain = Math.max(0, ship - accept - reject)
              const pCode = doc.productCode || doc.code || `SHP-${doc.id}`
              const matchedProduct = availableProducts.find((p) =>
                (p.code && p.code === pCode) || (doc.productId && String(p.id) === String(doc.productId))
              )

              rows.push({
                productCode: pCode,
                barcode: doc.barcode || matchedProduct?.barcode || '-',
                description: doc.description || doc.reference || matchedProduct?.title || matchedProduct?.name || 'Ship Request Transfer',
                uom: doc.uom || matchedProduct?.uom || 'Unit',
                shipQty: ship,
                acceptQty: accept,
                rejectQty: reject,
                remainQty: remain,
                requestOutlet: reqOutlet,
                requestLocation: reqLoc,
                toOutlet: toOut,
                toLocation: toLoc,
                status: statusVal,
                productGroup: doc.productGroup || matchedProduct?.productGroup || 'Pantry Staples',
                brand: doc.brand || matchedProduct?.brand || 'Heritage Organic',
                category: doc.category || matchedProduct?.category || 'Produce',
                date: dateVal,
              })
            }
          })
          fetched = rows
        }
      }

      // 4. STOCK REPORT: Transferred Report
      else if (activeDataKey === 'transferred') {
        const res = await adminTransferAPI.getAll()
        const items = res?.data || res
        if (Array.isArray(items) && items.length > 0) {
          fetched = items.map((doc) => {
            const qty = Number(doc.totalQty || (doc.lines?.reduce((s, l) => s + Number(l.qty || 0), 0)) || 1)
            const cost = Number(doc.unitCost || (doc.lines && doc.lines[0]?.unitCost) || 2.50)
            return {
              currency: doc.currency || 'USD',
              fromOutlet: doc.fromOutlet || doc.requestOutlet || 'Main Warehouse',
              toOutlet: doc.toOutlet || 'BKK1 Branch',
              qty: qty,
              cost: cost,
              totalCost: Number(doc.totalCost != null ? doc.totalCost : (qty * cost)),
            }
          })
        }
      }

      // 5. STOCK REPORT: Adjustment
      else if (activeDataKey === 'adjustment') {
        const res = await adminAdjustmentDocAPI.getAll().catch(() => adminStockDocAPI.getAll('ADJUST'))
        const items = res?.data || res
        if (Array.isArray(items) && items.length > 0) {
          const rows = []
          items.forEach((doc) => {
            const outVal = doc.outlet || doc.fromOutlet || doc.office || 'Central Warehouse'
            const locVal = doc.location || doc.fromLocation || doc.section || 'Warehouse Floor A'
            const adjTypeVal = doc.adjustmentType || doc.adjustType || doc.type || 'Stock Count'
            const dateVal = (doc.date || doc.createdAt || '').slice(0, 10)
            const suppVal = doc.supplier || doc.supplierName || 'Internal Store'
            const curVal = doc.currency || 'USD'

            if (Array.isArray(doc.lines) && doc.lines.length > 0) {
              doc.lines.forEach((l) => {
                const diff = Number(l.qtyDiff != null ? l.qtyDiff : (Number(l.countedQty ?? l.counted ?? 0) - Number(l.qtyBefore ?? l.onHand ?? 0)))
                const uCost = Number(l.unitCost || l.cost || 0)
                const lineTotal = Number(l.totalCost != null ? l.totalCost : (diff * uCost))
                const pCode = l.code || l.productCode || (l.productId ? `PRD-${l.productId}` : 'PRD-001')
                const matchedProduct = availableProducts.find((p) =>
                  String(p.id) === String(l.productId) || (p.code && (p.code === pCode || p.code === l.code))
                )

                rows.push({
                  currency: curVal,
                  date: dateVal,
                  supplier: suppVal,
                  qty: diff,
                  totalCost: lineTotal,
                  outlet: outVal,
                  location: locVal,
                  adjustType: adjTypeVal,
                  adjustmentType: adjTypeVal,
                  productCode: pCode,
                  barcode: l.barcode || matchedProduct?.barcode || '-',
                  description: l.name || l.nameSnapshot || l.description || matchedProduct?.title || matchedProduct?.name || 'Adjusted Item',
                  productGroup: l.productGroup || matchedProduct?.productGroup || 'Pantry Staples',
                  brand: l.brand || matchedProduct?.brand || 'Heritage Organic',
                  category: l.category || matchedProduct?.category || 'Produce',
                })
              })
            } else {
              const diff = Number(doc.totalDiff != null ? doc.totalDiff : (doc.qty != null ? doc.qty : 0))
              const totCost = Number(doc.totalCost != null ? doc.totalCost : 0)
              const pCode = doc.productCode || doc.code || `ADJ-${doc.id || '001'}`
              const matchedProduct = availableProducts.find((p) =>
                (p.code && p.code === pCode) || (doc.productId && String(p.id) === String(doc.productId))
              )

              rows.push({
                currency: curVal,
                date: dateVal,
                supplier: suppVal,
                qty: diff,
                totalCost: totCost,
                outlet: outVal,
                location: locVal,
                adjustType: adjTypeVal,
                adjustmentType: adjTypeVal,
                productCode: pCode,
                barcode: doc.barcode || matchedProduct?.barcode || '-',
                description: doc.description || doc.note || matchedProduct?.title || matchedProduct?.name || 'Stock Adjustment',
                productGroup: doc.productGroup || matchedProduct?.productGroup || 'Pantry Staples',
                brand: doc.brand || matchedProduct?.brand || 'Heritage Organic',
                category: doc.category || matchedProduct?.category || 'Produce',
              })
            }
          })
          fetched = rows
        }
      }

      // 6. STOCK REPORT: Issued
      else if (activeDataKey === 'issued') {
        const res = await adminIssueDocAPI.getAll().catch(() => adminStockDocAPI.getAll('ISSUE'))
        const items = res?.data || res
        if (Array.isArray(items) && items.length > 0) {
          const rows = []
          items.forEach((doc) => {
            const outVal = doc.outlet || doc.fromOutlet || doc.office || 'Central Warehouse'
            const locVal = doc.location || doc.fromLocation || doc.section || 'Warehouse Floor A'
            const dateVal = (doc.date || doc.createdAt || '').slice(0, 10)
            const curVal = doc.currency || 'USD'

            if (Array.isArray(doc.lines) && doc.lines.length > 0) {
              doc.lines.forEach((l) => {
                const uCost = Number(l.unitCost || l.cost || 0)
                const lineQty = Number(l.qty || 1)
                const lineTotal = Number(l.totalCost != null ? l.totalCost : (lineQty * uCost))
                const pCode = l.code || l.productCode || (l.productId ? `PRD-${l.productId}` : 'PRD-001')
                const matchedProduct = availableProducts.find((p) =>
                  String(p.id) === String(l.productId) || (p.code && (p.code === pCode || p.code === l.code))
                )

                rows.push({
                  currency: curVal,
                  totalCost: lineTotal,
                  outlet: outVal,
                  location: locVal,
                  productCode: pCode,
                  barcode: l.barcode || matchedProduct?.barcode || '-',
                  description: l.name || l.nameSnapshot || l.description || matchedProduct?.title || matchedProduct?.name || 'Issued Item',
                  productGroup: l.productGroup || matchedProduct?.productGroup || 'Pantry Staples',
                  brand: l.brand || matchedProduct?.brand || 'Heritage Organic',
                  category: l.category || matchedProduct?.category || 'Produce',
                  date: dateVal,
                })
              })
            } else {
              const totCost = Number(doc.totalCost != null ? doc.totalCost : 0)
              const pCode = doc.productCode || doc.code || `ISU-${doc.id || '001'}`
              const matchedProduct = availableProducts.find((p) =>
                (p.code && p.code === pCode) || (doc.productId && String(p.id) === String(doc.productId))
              )

              rows.push({
                currency: curVal,
                totalCost: totCost,
                outlet: outVal,
                location: locVal,
                productCode: pCode,
                barcode: doc.barcode || matchedProduct?.barcode || '-',
                description: doc.description || doc.note || matchedProduct?.title || matchedProduct?.name || 'Stock Issue',
                productGroup: doc.productGroup || matchedProduct?.productGroup || 'Pantry Staples',
                brand: doc.brand || matchedProduct?.brand || 'Heritage Organic',
                category: doc.category || matchedProduct?.category || 'Produce',
                date: dateVal,
              })
            }
          })
          fetched = rows
        }
      }

      // 7. STOCK REPORT: Inventory List
      else if (activeDataKey === 'inventory-list') {
        const res = await adminProductAPI.getAll()
        const items = res?.data || res
        if (Array.isArray(items) && items.length > 0) {
          fetched = items.map((p) => {
            const qty = Number(p.onHand ?? p.qty ?? 0)
            const avgCost = Number(p.averageCost || p.costPrice || 0)
            const lastCost = Number(p.standardCost || p.lastCost || p.costPrice || 0)
            const price = Number(p.sellingPrice || p.basePrice || 0)
            const brand = p.brand || p.brandName || (typeof p.brand === 'object' ? p.brand?.name : null) || 'Heritage Organic'
            const category = p.category || p.categoryName || (typeof p.category === 'object' ? p.category?.name : null) || 'General'
            const productGroup = p.productGroup || p.groupName || (typeof p.productGroup === 'object' ? p.productGroup?.name : null) || 'Grocery'
            const expiryDays = p.expiryDays != null ? Number(p.expiryDays) : (p.daysToExpiry != null ? Number(p.daysToExpiry) : null)
            const expiryDate = p.expiryDate || p.expireDate || null
            const status = p.status || (qty <= 0 ? 'Out of Stock' : qty <= 10 ? 'Low Stock' : 'Active')
            return {
              outlet: p.outlet || 'Main Mart',
              productCode: p.code || `PRD-${p.id}`,
              barcode: p.barCode || p.barcode || '-',
              description: p.title || (typeof p.name === 'object' ? p.name?.en : p.name) || 'Stock Product',
              qty: qty,
              uom: p.uom || 'Unit',
              avgCost: avgCost,
              lastCost: lastCost,
              totalCost: Number((qty * avgCost).toFixed(2)),
              price: price,
              totalPrice: Number((qty * price).toFixed(2)),
              brand,
              category,
              productGroup,
              expiryDays,
              expiryDate,
              status,
              onhand: qty,
            }
          })
        }
      }

      // 8. STOCK REPORT: Price List
      else if (activeDataKey === 'price-list') {
        const res = await adminProductAPI.getAll()
        const items = res?.data || res
        if (Array.isArray(items) && items.length > 0) {
          fetched = items.map((p) => ({
            code: p.code || `PRD-${p.id}`,
            barcode: p.barCode || p.barcode || '-',
            description: p.title || (typeof p.name === 'object' ? p.name?.en : p.name) || 'Stock Product',
            uom: p.uom || 'Unit',
            basePrice: Number(p.basePrice || p.sellingPrice || 0),
          }))
        }
      }

      // 9. STOCK REPORT: Transaction History
      else if (activeDataKey === 'transaction-history') {
        const res = await fetch('/api/activity-logs').then((r) => r.json()).catch(() => null)
        const items = res?.data || res
        if (Array.isArray(items) && items.length > 0) {
          fetched = items.map((l) => ({
            transactionType: (l.action || l.type || l.docType || 'RECEIVE').toUpperCase(),
            document: l.document || l.docNo || l.code || `DOC-${l.id || 101}`,
            date: (l.date || l.timestamp || l.createdAt || new Date().toISOString()).slice(0, 10),
            productCode: l.productCode || l.code || 'PRD-001',
            description: l.description || l.product || l.details || 'Stock Item',
            outlet: l.outlet || 'Central Warehouse',
            location: l.location || 'Warehouse Floor A',
            qty: Number(l.qty || 10),
            stockUom: l.stockUom || l.uom || 'Box',
            tranUom: l.tranUom || l.uom || 'Unit',
            cost: Number(l.cost || l.unitCost || 2.20),
            amount: Number(l.amount || l.totalCost || 22.00),
            balanceQty: Number(l.balanceQty ?? 150),
          }))
        }
      }

      // 10. STOCK REPORT: Order Point
      else if (activeDataKey === 'order-point') {
        const res = await adminProductAPI.getAll()
        const items = res?.data || res
        if (Array.isArray(items) && items.length > 0) {
          fetched = items.map((p) => {
            const onhand = Number(p.onHand ?? 0)
            const orderPoint = Number(p.minStockLevel || 15)
            const orderQuantity = onhand < orderPoint ? Math.max(0, orderPoint - onhand + 20) : 0
            return {
              productCode: p.code || `PRD-${p.id}`,
              description: p.title || p.name || 'Standard Product',
              onhand,
              uom: p.uom || 'Unit',
              orderPoint,
              orderQuantity,
            }
          })
        }
      }

      // 11. STOCK REPORT: Stock Evaluation
      else if (activeDataKey === 'stock-evaluation') {
        const res = await adminProductAPI.getAll()
        const items = res?.data || res
        if (Array.isArray(items) && items.length > 0) {
          fetched = items.map((p) => {
            const onhand = Number(p.onHand ?? 0)
            return {
              productCode: p.code || `PRD-${p.id}`,
              description: p.title || p.name || 'Stock Evaluation Item',
              uom: p.uom || 'Unit',
              beginning: Number(p.beginningQty ?? (onhand + 10)),
              receive: Number(p.receiveQty ?? 20),
              issue: Number(p.issueQty ?? 5),
              adjust: Number(p.adjustQty ?? 0),
              transferIn: Number(p.transferInQty ?? 2),
              transferOut: Number(p.transferOutQty ?? 2),
              sale: Number(p.saleQty ?? 15),
              return: Number(p.returnQty ?? 0),
              balance: onhand,
            }
          })
        }
      }

      // CORE MODULE: Sale Payment
      else if (activeDataKey === 'sale-payment') {
        const res = await adminSaleInvoiceAPI.getAll()
        const items = res?.data || res
        if (Array.isArray(items) && items.length > 0) {
          fetched = items.map((inv) => ({
            code: inv.code || `INV-${inv.id}`,
            date: (inv.date || inv.createdAt || '').slice(0, 10),
            customer: inv.customerName || inv.customer || 'Retail Shopper',
            outlet: inv.outlet || 'Main Mart',
            location: 'Cashier Counter 1',
            product: 'Supermarket Grocery Basket',
            category: 'Retail Sales',
            brand: 'Various Brands',
            supplier: "B'Groceries Stores",
            method: inv.paymentMethod || 'ABA PayWay',
            total: Number(inv.grandTotal || inv.total || 450.00),
            paid: Number(inv.paidAmount || inv.total || 450.00),
            balance: Number(inv.balance || 0.00),
            status: (inv.status || 'PAID').toUpperCase(),
          }))
        }
      }
      // ====================================================
      // ORDER MANAGEMENT SUB-REPORTS
      // ====================================================
      else if (activeDataKey === 'sale-order-status' || activeDataKey === 'order-management') {
        const res = await adminSaleOrderAPI.getAll().catch(() => adminWebOrderAPI.getAll())
        const items = res?.data || res
        if (Array.isArray(items) && items.length > 0) {
          fetched = items.map((ord) => ({
            orderNo: ord.code || `SO-${ord.id}`,
            date: (ord.date || ord.createdAt || '').slice(0, 10),
            customer: ord.customerName || ord.customer || 'Bayon Market',
            outlet: ord.outlet || 'Central Warehouse',
            items: ord.itemsCount || 10,
            totalAmount: Number(ord.totalAmount || ord.total || 680.00),
            paymentStatus: (ord.paymentStatus || 'PAID').toUpperCase(),
            orderStatus: (ord.status || 'PROCESSING').toUpperCase(),
            salesperson: ord.salesperson || ord.createdBy || 'Borith Keo',
          }))
        }
      }

      else if (activeDataKey === 'sale-order-shipment') {
        const res = await adminSaleOrderAPI.getAll().catch(() => adminTransferAPI.getAll())
        const items = res?.data || res
        if (Array.isArray(items) && items.length > 0) {
          fetched = items.map((ord) => ({
            shipmentNo: `SHP-${ord.code || ord.id}`,
            orderNo: ord.code || `SO-${ord.id}`,
            dispatchDate: (ord.dispatchDate || ord.date || ord.createdAt || '').slice(0, 10),
            customer: ord.customerName || ord.customer || 'Bayon Market',
            deliveryAddress: ord.deliveryAddress || ord.address || '#128 St. 598 Toul Kork, Phnom Penh',
            carrier: ord.carrier || 'Fleet Logistics KH',
            trackingNo: ord.trackingNo || `TRK-KH-${ord.id || 8890}`,
            shipmentStatus: (ord.deliveryStatus || 'IN_TRANSIT').toUpperCase(),
          }))
        }
      }

      // ====================================================
      // CONSIGNMENT SUB-REPORTS
      // ====================================================
      else if (activeDataKey === 'consignment-shipment') {
        const res = await adminConsignmentAPI.getAll().catch(() => null)
        const items = res?.data || res
        if (Array.isArray(items) && items.length > 0) {
          fetched = items.map((csg) => ({
            shipmentNo: `CSG-SHP-${csg.id || 101}`,
            date: (csg.date || csg.createdAt || '').slice(0, 10),
            vendor: csg.vendor || csg.supplier || 'Khmer Heritage Farm',
            outlet: csg.outlet || 'Main Mart',
            receivedBy: csg.receivedBy || 'Dara Heng',
            totalPackages: csg.totalPackages || 25,
            carrier: csg.carrier || 'Farm Direct Fleet',
            status: (csg.status || 'RECEIVED').toUpperCase(),
          }))
        }
      }

      else if (activeDataKey === 'consignment-status-report' || activeDataKey === 'consignment') {
        const res = await adminConsignmentAPI.getAll().catch(() => null)
        const items = res?.data || res
        if (Array.isArray(items) && items.length > 0) {
          fetched = items.map((csg) => ({
            contractNo: csg.code || `CSG-CT-${csg.id}`,
            vendor: csg.vendor || csg.supplier || 'Khmer Heritage Farm',
            product: csg.product || 'Artisan Specialty Goods',
            consignedQty: csg.consignedQty || 500,
            soldQty: csg.soldQty || 420,
            returnQty: csg.returnQty || 5,
            remainingQty: (csg.consignedQty || 500) - (csg.soldQty || 420) - (csg.returnQty || 0),
            settlementAmount: Number(csg.settlementAmount || 840.00),
            status: (csg.status || 'ACTIVE').toUpperCase(),
          }))
        }
      }

      // ====================================================
      // PURCHASE MANAGEMENT SUB-REPORTS
      // ====================================================
      else if (activeDataKey === 'requisition') {
        const res = await adminPurchaseOrderAPI.getAll().catch(() => null)
        const items = res?.data || res
        if (Array.isArray(items) && items.length > 0) {
          fetched = items.map((po) => ({
            reqNo: `PR-${po.code || po.id}`,
            date: (po.date || po.createdAt || '').slice(0, 10),
            department: po.department || 'Produce & Grocery Dept',
            requestedBy: po.requestedBy || 'Sokha Ly',
            totalItems: po.itemsCount || 8,
            estimatedCost: Number(po.totalAmount || po.amount || 1450.00),
            priority: po.priority || 'NORMAL',
            status: (po.status || 'APPROVED').toUpperCase(),
          }))
        }
      }

      else if (activeDataKey === 'purchase-order-status' || activeDataKey === 'purchase-management') {
        const res = await adminPurchaseOrderAPI.getAll().catch(() => null)
        const items = res?.data || res
        if (Array.isArray(items) && items.length > 0) {
          fetched = items.map((po) => ({
            poNo: po.code || `PO-${po.id}`,
            date: (po.date || po.createdAt || '').slice(0, 10),
            supplier: po.supplierName || 'Cambodia Agri-Trading Ltd',
            outlet: po.outlet || 'Central Warehouse',
            term: po.paymentTerm || 'Net 30',
            totalAmount: Number(po.totalAmount || po.amount || 4200.00),
            receivingStatus: (po.receivingStatus || 'RECEIVED').toUpperCase(),
            paymentStatus: (po.paymentStatus || 'UNPAID').toUpperCase(),
            status: (po.status || 'OPEN').toUpperCase(),
          }))
        }
      }

      else if (activeDataKey === 'purchase-order-products-status') {
        const res = await adminPurchaseOrderAPI.getAll().catch(() => null)
        const items = res?.data || res
        if (Array.isArray(items) && items.length > 0) {
          fetched = items.map((po) => ({
            poNo: po.code || `PO-${po.id}`,
            code: `PRD-${po.id || '001'}`,
            product: po.productName || 'Organic Supermarket Groceries',
            supplier: po.supplierName || 'Cambodia Agri-Trading Ltd',
            orderedQty: po.orderedQty || 200,
            receivedQty: po.receivedQty || 180,
            unitCost: Number(po.unitCost || 6.50),
            totalCost: Number(po.totalAmount || 1300.00),
            status: (po.status || 'PARTIAL_DELIVERY').toUpperCase(),
          }))
        }
      }

      else if (activeDataKey === 'receive-return-purchase-order') {
        const res = await adminReceiveDocAPI.getAll().catch(() => null)
        const items = res?.data || res
        if (Array.isArray(items) && items.length > 0) {
          fetched = items.map((doc) => ({
            docNo: doc.code || `GRN-${doc.id}`,
            date: (doc.date || doc.createdAt || '').slice(0, 10),
            poNo: doc.poNo || `PO-2024-0${doc.id || 41}`,
            supplier: doc.supplierName || doc.supplier || 'Cambodia Agri-Trading Ltd',
            type: doc.type || 'RECEIVE',
            items: doc.totalItems || 10,
            totalValue: Number(doc.totalValue || doc.amount || 1850.00),
            handledBy: doc.handledBy || doc.receivedBy || 'Dara Heng',
            status: (doc.status || 'VERIFIED').toUpperCase(),
          }))
        }
      }

      // ====================================================
      // PAYABLE MANAGEMENT SUB-REPORTS
      // ====================================================
      else if (activeDataKey === 'bill-aging') {
        const res = await adminEnterBillAPI.getAll().catch(() => null)
        const items = res?.data || res
        if (Array.isArray(items) && items.length > 0) {
          fetched = items.map((bill) => ({
            code: `SUP-${bill.id || '001'}`,
            supplier: bill.supplier || 'Cambodia Agri-Trading Ltd',
            phone: bill.phone || '+855 12 770 112',
            current: Number(bill.current || bill.balance || 0),
            days1to30: Number(bill.days1to30 || 0),
            days31to60: Number(bill.days31to60 || 0),
            days61to90: Number(bill.days61to90 || 0),
            over90Days: Number(bill.over90Days || 0),
            totalDue: Number(bill.balance || bill.amount || 0),
            status: (bill.status || 'CURRENT').toUpperCase(),
          }))
        }
      }

      else if (activeDataKey === 'bill-payment') {
        const res = await adminEnterBillAPI.getAll().catch(() => null)
        const items = res?.data || res
        if (Array.isArray(items) && items.length > 0) {
          fetched = items.map((bill) => ({
            paymentNo: `PAY-BILL-${bill.id || 101}`,
            date: (bill.date || bill.createdAt || '').slice(0, 10),
            billRef: bill.reference || `BIL-${bill.id}`,
            supplier: bill.supplier || 'Cambodia Agri-Trading Ltd',
            paymentMethod: bill.paymentMethod || 'Bank Transfer (ABA)',
            paidAmount: Number(bill.paidAmount || bill.amount || 3450.00),
            bankAccount: 'ABA Enterprise 001 889',
            paidBy: 'Finance Admin',
            status: 'EXECUTED',
          }))
        }
      }

      else if (activeDataKey === 'bill-status' || activeDataKey === 'payable-management') {
        const res = await adminEnterBillAPI.getAll().catch(() => null)
        const items = res?.data || res
        if (Array.isArray(items) && items.length > 0) {
          fetched = items.map((bill) => ({
            billNo: bill.code || `BIL-${bill.id}`,
            date: (bill.date || bill.createdAt || '').slice(0, 10),
            dueDate: bill.dueDate || '2024-03-31',
            supplier: bill.supplier || 'Cambodia Agri-Trading Ltd',
            outlet: bill.outlet || 'Central Warehouse',
            totalAmount: Number(bill.amount || 4200.00),
            paidAmount: Number(bill.paidAmount || (Number(bill.amount || 4200) - Number(bill.balance || 0))),
            balanceDue: Number(bill.balance || 0),
            status: (bill.status || 'CURRENT').toUpperCase(),
          }))
        }
      }

      else if (activeDataKey === 'freight-status') {
        const res = await adminEnterBillAPI.getAll().catch(() => null)
        const items = res?.data || res
        if (Array.isArray(items) && items.length > 0) {
          fetched = items.map((b, idx) => ({
            freightNo: `FRT-2024-${10 + (b.id || idx)}`,
            carrier: b.carrier || 'Phnom Penh Cold Express',
            date: (b.date || b.createdAt || '').slice(0, 10),
            origin: 'Kampong Cham Logistics Hub',
            destination: 'Main Mart Cold Room',
            freightCharge: 120.00,
            tax: 12.00,
            totalCharge: 132.00,
            paymentStatus: 'PAID',
          }))
        }
      }

      else if (activeDataKey === 'supplier-deposit-debit') {
        const res = await adminEnterBillAPI.getAll().catch(() => null)
        const items = res?.data || res
        if (Array.isArray(items) && items.length > 0) {
          fetched = items.map((b) => ({
            docNo: `SDEP-${b.id || 101}`,
            date: (b.date || b.createdAt || '').slice(0, 10),
            supplier: b.supplier || 'Cambodia Agri-Trading Ltd',
            type: 'ADVANCE_DEPOSIT',
            amount: Number(b.amount || 5000.00),
            utilizedAmount: Number(b.utilizedAmount || 3000.00),
            balance: Number(b.balance || 2000.00),
            method: 'Bank Transfer (ABA)',
            status: 'ACTIVE',
          }))
        }
      }

      else if (activeDataKey === 'ap-cash-payment') {
        const res = await adminCashOperationAPI.getAll().catch(() => null)
        const items = res?.data || res
        if (Array.isArray(items) && items.length > 0) {
          fetched = items.map((c) => ({
            voucherNo: `AP-CSH-${c.id || 101}`,
            date: (c.date || c.createdAt || '').slice(0, 10),
            supplier: c.partyName || 'Local Agricultural Cooperative',
            billRef: `BIL-REF-${c.id || 101}`,
            amountPaid: Number(c.amount || 185.00),
            cashAccount: 'Petty Cash Box #1',
            approvedBy: 'Finance Officer',
            status: 'PAID',
          }))
        }
      }

      else if (activeDataKey === 'supplier-list') {
        const res = await adminSupplierAPI.getAll().catch(() => null)
        const items = res?.data || res
        if (Array.isArray(items) && items.length > 0) {
          fetched = items.map((s) => ({
            code: s.code || `SUP-${s.id}`,
            supplier: s.name || s.supplierName || 'Cambodia Agri-Trading Ltd',
            contactPerson: s.contactPerson || s.contact || 'Mr. Touch Vanna',
            phone: s.phone || '+855 12 770 112',
            category: s.category || 'Grains & Fresh Produce',
            paymentTerm: s.paymentTerm || 'Net 30',
            activeOrders: s.activeOrdersCount || 2,
            balanceDue: Number(s.balanceDue || 0.00),
            status: (s.status || 'ACTIVE').toUpperCase(),
          }))
        }
      }

      // ====================================================
      // CASH BOOK SUB-REPORTS
      // ====================================================
      else if (activeDataKey === 'cash-in-out-status' || activeDataKey === 'cash-book') {
        const res = await adminCashOperationAPI.getAll().catch(() => null)
        const items = res?.data || res
        if (Array.isArray(items) && items.length > 0) {
          fetched = items.map((c) => ({
            entryNo: `CSH-ENTRY-${c.id || 101}`,
            date: (c.date || c.createdAt || '').slice(0, 10),
            account: c.account || 'Main Cash Drawer POS-1',
            type: c.type || 'CASH_IN',
            amount: Number(c.amount || 1450.00),
            reason: c.description || 'Retail Grocery POS Sales Flow',
            authorizedBy: c.authorizedBy || 'Sokha Ly',
            status: (c.status || 'VERIFIED').toUpperCase(),
          }))
        }
      }

      else if (activeDataKey === 'cash-statement') {
        const res = await adminCashOperationAPI.getAll().catch(() => null)
        const items = res?.data || res
        if (Array.isArray(items) && items.length > 0) {
          fetched = items.map((c) => ({
            statementDate: (c.date || c.createdAt || '').slice(0, 10),
            account: 'Store Operating Cash Vault',
            openingBalance: 8500.00,
            totalInflow: Number(c.amount || 4850.00),
            totalOutflow: 1200.00,
            closingBalance: 12150.00,
            status: 'RECONCILED',
          }))
        }
      }

      else if (activeDataKey === 'bank-transfer') {
        const res = await adminCashOperationAPI.getAll().catch(() => null)
        const items = res?.data || res
        if (Array.isArray(items) && items.length > 0) {
          fetched = items.map((c) => ({
            transferNo: `BNK-TRF-${c.id || 101}`,
            date: (c.date || c.createdAt || '').slice(0, 10),
            fromBank: 'ABA PayWay Settlement',
            toBank: 'ABA Corporate Main 001',
            amount: Number(c.amount || 8500.00),
            fee: 0.00,
            netTransfer: Number(c.amount || 8500.00),
            referenceNo: `ABA-TXN-${890000 + (c.id || 1)}`,
            status: 'COMPLETED',
          }))
        }
      }
    } catch (err) {
      console.warn('Backend live data query warning:', err)
    }

    if (Array.isArray(fetched) && fetched.length > 0) {
      setLiveData(fetched)
    } else {
      setLiveData(SEED_DATA[activeDataKey] || [])
    }

    setLoading(false)
  }, [activeDataKey])

  useEffect(() => {
    fetchReportData()
  }, [fetchReportData])

  // Generated Button Click
  const handleGenerateReport = () => {
    fetchReportData()
    showNotification?.({
      type: 'success',
      title: 'Live Data Refreshed',
      message: `Database synchronized for ${activeCurrentModule?.en || 'Report'}.`,
    })
  }

  // Filtered Records based on all Filter Controls
  const displayedRecords = useMemo(() => {
    let list = liveData

    // 1. Date Range Filter
    if (fromDate) {
      list = list.filter((r) => !r.date || r.date >= fromDate)
    }
    if (toDate) {
      list = list.filter((r) => !r.date || r.date <= toDate)
    }

    // 2. Customer Filter
    if (customerFilter.trim()) {
      const q = customerFilter.trim().toLowerCase()
      list = list.filter((r) =>
        (r.customer && r.customer.toLowerCase().includes(q)) ||
        (r.supplier && r.supplier.toLowerCase().includes(q)) ||
        (r.receivedBy && r.receivedBy.toLowerCase().includes(q))
      )
    }

    // 3. Outlet Filter
    if (outletFilter !== 'all') {
      const q = outletFilter.toLowerCase()
      list = list.filter((r) =>
        (r.outlet && r.outlet.toLowerCase().includes(q)) ||
        (r.fromOutlet && r.fromOutlet.toLowerCase().includes(q)) ||
        (r.toOutlet && r.toOutlet.toLowerCase().includes(q))
      )
    }

    // 4. Location Filter
    if (locationFilter !== 'all') {
      const q = locationFilter.toLowerCase()
      list = list.filter((r) => r.location && r.location.toLowerCase().includes(q))
    }

    // 5. Product Search
    if (productFilter.trim()) {
      const q = productFilter.trim().toLowerCase()
      list = list.filter((r) =>
        (r.product && r.product.toLowerCase().includes(q)) ||
        (r.name && r.name.toLowerCase().includes(q)) ||
        (r.code && r.code.toLowerCase().includes(q)) ||
        (r.productCode && r.productCode.toLowerCase().includes(q)) ||
        (r.barcode && r.barcode.toLowerCase().includes(q)) ||
        (r.description && r.description.toLowerCase().includes(q)) ||
        (r.documentCode && r.documentCode.toLowerCase().includes(q)) ||
        (r.document && r.document.toLowerCase().includes(q)) ||
        (Array.isArray(r.products) && r.products.some((p) => String(p).toLowerCase().includes(q))) ||
        (typeof r.products === 'string' && r.products.toLowerCase().includes(q)) ||
        (Array.isArray(r.items) && r.items.some((it) =>
          String(it.productName || it.title || it.name || it.code || it.barcode || '').toLowerCase().includes(q)
        ))
      )
    }

    // 6. Category Filter
    if (categoryFilter !== 'all') {
      const q = categoryFilter.toLowerCase()
      list = list.filter((r) => r.category && r.category.toLowerCase().includes(q))
    }

    // 7. Brand Filter
    if (brandFilter !== 'all') {
      const q = brandFilter.toLowerCase()
      list = list.filter((r) => r.brand && r.brand.toLowerCase().includes(q))
    }

    // 7b. Product Group Filter (General)
    if (productGroupFilter !== 'all') {
      const q = productGroupFilter.toLowerCase()
      list = list.filter((r) => r.productGroup && r.productGroup.toLowerCase() === q)
    }

    // 8. Supplier Filter (Hidden on Transferred, Adjustment, Issued & Inventory List reports)
    if (activeDataKey !== 'transferred' && activeDataKey !== 'adjustment' && activeDataKey !== 'issued' && activeDataKey !== 'inventory-list' && supplierFilter !== 'all') {
      const q = supplierFilter.toLowerCase()
      list = list.filter((r) => r.supplier && r.supplier.toLowerCase().includes(q))
    }

    // 8b. Adjust Type Filter (For Adjustment report)
    if (activeDataKey === 'adjustment' && adjustTypeFilter !== 'all') {
      const q = adjustTypeFilter.toLowerCase()
      list = list.filter((r) =>
        (r.adjustType && r.adjustType.toLowerCase() === q) ||
        (r.adjustmentType && r.adjustmentType.toLowerCase() === q) ||
        (r.type && r.type.toLowerCase() === q)
      )
    }

    // 9. Special Advance Filters for Request Transfer & Ship Request Transfer
    if (activeDataKey === 'request-transfer' || activeDataKey === 'ship-request-transfer') {
      if (requestOutletFilter !== 'all') {
        const q = requestOutletFilter.toLowerCase()
        list = list.filter((r) =>
          (r.requestOutlet && r.requestOutlet.toLowerCase() === q) ||
          (r.fromOutlet && r.fromOutlet.toLowerCase() === q)
        )
      }
      if (requestLocationFilter !== 'all') {
        const q = requestLocationFilter.toLowerCase()
        list = list.filter((r) =>
          (r.requestLocation && r.requestLocation.toLowerCase() === q) ||
          (r.fromLocation && r.fromLocation.toLowerCase() === q)
        )
      }
      if (toOutletFilter !== 'all') {
        const q = toOutletFilter.toLowerCase()
        list = list.filter((r) => r.toOutlet && r.toOutlet.toLowerCase() === q)
      }
      if (toLocationFilter !== 'all') {
        const q = toLocationFilter.toLowerCase()
        list = list.filter((r) => r.toLocation && r.toLocation.toLowerCase() === q)
      }
      if (statusFilter !== 'all') {
        const q = statusFilter.toLowerCase()
        list = list.filter((r) => r.status && r.status.toLowerCase() === q)
      }
      if (activeDataKey === 'request-transfer' && requestTransferTypeFilter !== 'all') {
        const q = requestTransferTypeFilter.toLowerCase()
        list = list.filter((r) =>
          (r.requestTransferType && r.requestTransferType.toLowerCase() === q) ||
          (r.transferType && r.transferType.toLowerCase() === q)
        )
      }
      if (productGroupFilter !== 'all') {
        const q = productGroupFilter.toLowerCase()
        list = list.filter((r) => r.productGroup && r.productGroup.toLowerCase() === q)
      }
      if (brandFilter !== 'all') {
        const q = brandFilter.toLowerCase()
        list = list.filter((r) => r.brand && r.brand.toLowerCase() === q)
      }
      if (categoryFilter !== 'all') {
        const q = categoryFilter.toLowerCase()
        list = list.filter((r) => r.category && r.category.toLowerCase() === q)
      }

      // Group By sorting for Request Transfer & Ship Request Transfer
      if (groupByFilter !== 'none') {
        list = [...list].sort((a, b) => {
          if (groupByFilter === 'by-request-outlet') {
            return String(a.requestOutlet || a.fromOutlet || '').localeCompare(String(b.requestOutlet || b.fromOutlet || ''))
          }
          if (groupByFilter === 'by-request-location') {
            return String(a.requestLocation || a.fromLocation || '').localeCompare(String(b.requestLocation || b.fromLocation || ''))
          }
          if (groupByFilter === 'by-to-outlet') {
            return String(a.toOutlet || '').localeCompare(String(b.toOutlet || ''))
          }
          if (groupByFilter === 'by-to-location') {
            return String(a.toLocation || '').localeCompare(String(b.toLocation || ''))
          }
          if (groupByFilter === 'by-status') {
            return String(a.status || '').localeCompare(String(b.status || ''))
          }
          if (activeDataKey === 'request-transfer' && groupByFilter === 'by-type') {
            return String(a.requestTransferType || a.transferType || '').localeCompare(String(b.requestTransferType || b.transferType || ''))
          }
          if (groupByFilter === 'by-product') {
            return String(a.description || a.productCode || '').localeCompare(String(b.description || b.productCode || ''))
          }
          if (groupByFilter === 'by-group') {
            return String(a.productGroup || '').localeCompare(String(b.productGroup || ''))
          }
          if (groupByFilter === 'by-brand') {
            return String(a.brand || '').localeCompare(String(b.brand || ''))
          }
          if (groupByFilter === 'by-category') {
            return String(a.category || '').localeCompare(String(b.category || ''))
          }
          if (groupByFilter === 'by-date') {
            return String(a.date || '').localeCompare(String(b.date || ''))
          }
          return 0
        })
      }
    }

    // Group By sorting for Adjustment report
    if (activeDataKey === 'adjustment' && groupByFilter !== 'none') {
      list = [...list].sort((a, b) => {
        if (groupByFilter === 'date') {
          return String(a.date || '').localeCompare(String(b.date || ''))
        }
        if (groupByFilter === 'by-adjust-type') {
          return String(a.adjustType || a.adjustmentType || '').localeCompare(String(b.adjustType || b.adjustmentType || ''))
        }
        if (groupByFilter === 'outlet') {
          return String(a.outlet || '').localeCompare(String(b.outlet || ''))
        }
        if (groupByFilter === 'location') {
          return String(a.location || '').localeCompare(String(b.location || ''))
        }
        if (groupByFilter === 'by-group') {
          return String(a.productGroup || '').localeCompare(String(b.productGroup || ''))
        }
        if (groupByFilter === 'category') {
          return String(a.category || '').localeCompare(String(b.category || ''))
        }
        if (groupByFilter === 'brand') {
          return String(a.brand || '').localeCompare(String(b.brand || ''))
        }
        if (groupByFilter === 'product') {
          return String(a.description || a.productCode || '').localeCompare(String(b.description || b.productCode || ''))
        }
        return 0
      })
    }

    // Group By sorting for Issued report
    if (activeDataKey === 'issued' && groupByFilter !== 'none') {
      list = [...list].sort((a, b) => {
        if (groupByFilter === 'date') {
          return String(a.date || '').localeCompare(String(b.date || ''))
        }
        if (groupByFilter === 'outlet') {
          return String(a.outlet || '').localeCompare(String(b.outlet || ''))
        }
        if (groupByFilter === 'location') {
          return String(a.location || '').localeCompare(String(b.location || ''))
        }
        if (groupByFilter === 'by-group') {
          return String(a.productGroup || '').localeCompare(String(b.productGroup || ''))
        }
        if (groupByFilter === 'category') {
          return String(a.category || '').localeCompare(String(b.category || ''))
        }
        if (groupByFilter === 'brand') {
          return String(a.brand || '').localeCompare(String(b.brand || ''))
        }
        if (groupByFilter === 'product') {
          return String(a.description || a.productCode || '').localeCompare(String(b.description || b.productCode || ''))
        }
        return 0
      })
    }

    // Special Advance Filters & Sorting for Inventory List
    if (activeDataKey === 'inventory-list') {
      // Expiry Day Filter
      if (expiryDayFilter !== 'all') {
        list = list.filter((r) => {
          let days = r.expiryDays != null ? Number(r.expiryDays) : null
          if (days == null && r.expiryDate) {
            const exp = new Date(r.expiryDate).getTime()
            const now = new Date().getTime()
            days = Math.round((exp - now) / (1000 * 60 * 60 * 24))
          }
          if (days == null) return false
          if (expiryDayFilter === 'expired') return days <= 0
          if (expiryDayFilter === 'within-7') return days > 0 && days <= 7
          if (expiryDayFilter === 'within-30') return days > 0 && days <= 30
          if (expiryDayFilter === 'within-60') return days > 0 && days <= 60
          if (expiryDayFilter === 'within-90') return days > 0 && days <= 90
          if (expiryDayFilter === 'good') return days > 90
          return true
        })
      }

      // Value Filter (Textbox)
      if (inventoryValueFilter.trim()) {
        const raw = inventoryValueFilter.trim()
        const opMatch = raw.match(/^([><]=?|=)\s*([0-9.]+)/)
        if (opMatch) {
          const op = opMatch[1]
          const val = parseFloat(opMatch[2])
          list = list.filter((r) => {
            const c = Number(r.totalCost || r.cost || 0)
            const p = Number(r.totalPrice || r.price || 0)
            if (op === '>=') return c >= val || p >= val
            if (op === '<=') return c <= val || p <= val
            if (op === '>') return c > val || p > val
            if (op === '<') return c < val || p < val
            return c === val || p === val
          })
        } else {
          const num = parseFloat(raw.replace(/[^0-9.-]+/g, ''))
          if (!isNaN(num)) {
            list = list.filter((r) => {
              const c = Number(r.totalCost || 0)
              const p = Number(r.totalPrice || 0)
              return c >= num || p >= num || String(c).includes(raw) || String(p).includes(raw)
            })
          } else {
            const q = raw.toLowerCase()
            list = list.filter((r) =>
              String(r.totalCost || '').toLowerCase().includes(q) ||
              String(r.totalPrice || '').toLowerCase().includes(q)
            )
          }
        }
      }

      // Onhand Filter (Dropdown)
      if (onhandFilter !== 'all') {
        list = list.filter((r) => {
          const stock = Number(r.qty ?? r.onhand ?? 0)
          if (onhandFilter === 'in-stock') return stock > 0
          if (onhandFilter === 'out-of-stock') return stock <= 0
          if (onhandFilter === 'low-stock') return stock > 0 && stock <= 10
          if (onhandFilter === 'overstock') return stock >= 100
          if (onhandFilter === 'negative') return stock < 0
          return true
        })
      }

      // Status Filter (Dropdown)
      if (statusFilter !== 'all') {
        const q = statusFilter.toLowerCase()
        list = list.filter((r) => r.status && r.status.toLowerCase().includes(q))
      }

      // Group By sorting for Inventory List
      if (groupByFilter !== 'none') {
        list = [...list].sort((a, b) => {
          if (groupByFilter === 'outlet') {
            return String(a.outlet || '').localeCompare(String(b.outlet || ''))
          }
          if (groupByFilter === 'brand') {
            return String(a.brand || '').localeCompare(String(b.brand || ''))
          }
          if (groupByFilter === 'category') {
            return String(a.category || '').localeCompare(String(b.category || ''))
          }
          if (groupByFilter === 'by-group') {
            return String(a.productGroup || '').localeCompare(String(b.productGroup || ''))
          }
          if (groupByFilter === 'by-status') {
            return String(a.status || '').localeCompare(String(b.status || ''))
          }
          if (groupByFilter === 'by-expiry') {
            const dA = a.expiryDays != null ? Number(a.expiryDays) : 9999
            const dB = b.expiryDays != null ? Number(b.expiryDays) : 9999
            return dA - dB
          }
          if (groupByFilter === 'by-onhand') {
            const qA = Number(a.qty ?? a.onhand ?? 0)
            const qB = Number(b.qty ?? b.onhand ?? 0)
            return qB - qA
          }
          if (groupByFilter === 'product') {
            return String(a.description || a.productCode || '').localeCompare(String(b.description || b.productCode || ''))
          }
          return 0
        })
      }
    }

    return list
  }, [
    liveData,
    activeDataKey,
    fromDate,
    toDate,
    customerFilter,
    outletFilter,
    locationFilter,
    adjustTypeFilter,
    productFilter,
    categoryFilter,
    brandFilter,
    supplierFilter,
    expiryDayFilter,
    inventoryValueFilter,
    onhandFilter,
    requestOutletFilter,
    requestLocationFilter,
    toOutletFilter,
    toLocationFilter,
    statusFilter,
    requestTransferTypeFilter,
    productGroupFilter,
    groupByFilter,
    viewAsFilter,
  ])

  // Table Columns extracted dynamically - strictly follows schema for all 11 Stock Reports
  const tableColumns = useMemo(() => {
    if (STOCK_REPORT_SCHEMAS[activeDataKey]) {
      return STOCK_REPORT_SCHEMAS[activeDataKey]
    }
    if (!displayedRecords || displayedRecords.length === 0) return []
    return Object.keys(displayedRecords[0])
  }, [activeDataKey, displayedRecords])

  // Sync selected columns from localStorage or default to all available columns
  useEffect(() => {
    if (!activeDataKey || tableColumns.length === 0) return
    try {
      const storageKey = `bg_stock_report_cols_v2_${activeDataKey}`
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          const valid = parsed.filter((col) => tableColumns.includes(col))
          if (valid.length > 0) {
            setVisibleCols(new Set(valid))
            return
          }
        }
      }
    } catch (e) {
      console.warn('Failed to load saved report columns:', e)
    }
    // Default to all columns if nothing valid is stored
    setVisibleCols(new Set(tableColumns))
  }, [activeDataKey, tableColumns])

  // Active columns to display on screen, paper print, and Excel export
  const activeColumns = useMemo(() => {
    if (visibleCols.size === 0) return tableColumns
    return tableColumns.filter((col) => visibleCols.has(col))
  }, [tableColumns, visibleCols])

  // Save selected columns handler
  const handleApplyColumns = () => {
    if (colDraft.size === 0) {
      showNotification?.({
        type: 'warning',
        title: 'Choose Column',
        message: 'Please select at least 1 column to display.',
      })
      return
    }
    const colsArray = Array.from(colDraft)
    setVisibleCols(new Set(colDraft))
    if (activeDataKey) {
      try {
        localStorage.setItem(`bg_stock_report_cols_v2_${activeDataKey}`, JSON.stringify(colsArray))
      } catch (e) {
        console.warn('Failed to save report columns:', e)
      }
    }
    setShowColModal(false)
    showNotification?.({
      type: 'success',
      title: 'Columns Updated',
      message: `Displaying ${colsArray.length} columns for ${activeCurrentModule?.en || 'Report'}.`,
    })
  }

  // Reset columns to all available
  const handleResetColumns = () => {
    setColDraft(new Set(tableColumns))
  }

  // Summary Totals calculated for Table Footer and Executive paper summary
  const printTotals = useMemo(() => {
    return computeReportTotals(displayedRecords)
  }, [displayedRecords])

  // Summary Quantity Total (units/items)
  const summaryQtyTotal = useMemo(() => {
    let sum = 0
    let hasVal = false
    const qtyKeys = ['items', 'totalQty', 'availableQty', 'units', 'consignedQty', 'soldQty', 'varianceQty']
    displayedRecords.forEach((row) => {
      for (const k of qtyKeys) {
        if (row[k] != null) {
          const num = Number(row[k])
          if (!isNaN(num)) {
            sum += num
            hasVal = true
          }
          break
        }
      }
    })
    return hasVal ? sum : null
  }, [displayedRecords])

  // Summary Valuation Total (monetary $)
  const summaryValuationTotal = useMemo(() => {
    let sum = 0
    let hasVal = false
    const valKeys = ['totalCost', 'valuation', 'fifoCost', 'retailValuation', 'costImpact', 'issuedCost', 'settlement', 'total', 'amount']
    displayedRecords.forEach((row) => {
      for (const k of valKeys) {
        if (row[k] != null) {
          const num = typeof row[k] === 'number' ? row[k] : parseFloat(String(row[k]).replace(/[^0-9.-]+/g, ''))
          if (!isNaN(num)) {
            sum += num
            hasVal = true
          }
          break
        }
      }
    })
    return hasVal ? sum : null
  }, [displayedRecords])

  // Reset all Advance Filters
  const handleResetAdvanceFilters = () => {
    setRequestOutletFilter('all')
    setRequestLocationFilter('all')
    setToOutletFilter('all')
    setToLocationFilter('all')
    setStatusFilter('all')
    setRequestTransferTypeFilter('all')
    setAdjustTypeFilter('all')
    setExpiryDayFilter('all')
    setInventoryValueFilter('')
    setOnhandFilter('all')
    setOutletFilter('all')
    setLocationFilter('all')
    setProductFilter('')
    setProductGroupFilter('all')
    setCategoryFilter('all')
    setBrandFilter('all')
    setSupplierFilter('all')
    setGroupByFilter('none')
    setViewAsFilter('detailed')
    showNotification?.({
      type: 'info',
      title: 'Advance Filters Reset',
      message: 'All advance criteria cleared.',
    })
  }

  // Export to Excel handler
  const handleExportExcel = () => {
    const rawTitle = activeCurrentModule ? activeCurrentModule.en : 'Received'
    const reportHeading = (/^received/i.test(rawTitle)
      ? 'Received Report'
      : /report$/i.test(rawTitle)
        ? rawTitle
        : `${rawTitle} Report`).trim()

    if (displayedRecords.length === 0) {
      showNotification?.({ type: 'warning', title: 'Export', message: 'No records available to export.' })
      return
    }

    const headers = activeColumns.map((k) => getColumnLabel(k))
    const dataRows = displayedRecords.map((row) => activeColumns.map((col) => row[col]))

    exportStyledExcel({
      sheetName: `${reportHeading}`.slice(0, 31),
      title: `B'Groceries - ${reportHeading}`,
      subtitle: `Period: ${fromDate || 'Start'} to ${toDate || 'End'} | Exported: ${new Date().toLocaleString()}`,
      headers,
      dataRows,
      fileName: `${reportHeading.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`,
    })

    showNotification?.({
      type: 'success',
      title: 'Excel Exported',
      message: `${reportHeading} (${activeColumns.length} columns) exported successfully.`,
    })
  }

  // Print Document Trigger
  const handlePrintDocument = () => {
    window.print()
  }

  // ==========================================
  // VIEW 1: PREVIEW REPORT (DETAIL / PREVIEW)
  // When path is /admin/report/stock/:subKey or /admin/report/:moduleKey
  // ==========================================
  if (activeCurrentModule) {
    const rawTitle = activeCurrentModule.en || 'Report'
    const reportHeading = (/^received/i.test(rawTitle)
      ? 'Received Report'
      : /report$/i.test(rawTitle)
        ? rawTitle
        : `${rawTitle} Report`).trim()
    const reportTitle = reportHeading

    return (
      <div className={`space-y-6 font-['Montserrat'] ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
        {/* PRINT CSS: Dedicated styles for clean, razor-sharp paper printing */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @media print {
              @page {
                size: ${printOrientation === 'landscape' ? 'A4 landscape' : 'A4 portrait'};
                margin: 8mm 10mm;
              }
              *, *::before, *::after {
                box-sizing: border-box !important;
              }
              html, body {
                background: #ffffff !important;
                color: #0f172a !important;
                margin: 0 !important;
                padding: 0 !important;
                font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
                font-size: ${printDensity === 'dense' ? '8.5pt' : printDensity === 'compact' ? '9.5pt' : '10.5pt'} !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              body * {
                visibility: hidden !important;
              }
              #printable-report, #printable-report * {
                visibility: visible !important;
              }
              #printable-report {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                background: #ffffff !important;
                color: #0f172a !important;
                padding: 0 !important;
                margin: 0 !important;
                box-shadow: none !important;
                border: none !important;
              }
              .no-print, .no-print * {
                display: none !important;
              }
              table {
                width: 100% !important;
                border-collapse: collapse !important;
                page-break-inside: auto !important;
                break-inside: auto !important;
              }
              thead {
                display: table-header-group !important;
              }
              tfoot {
                display: table-footer-group !important;
              }
              tr {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
              }
              th, td {
                padding: ${printDensity === 'dense' ? '3px 4px' : printDensity === 'compact' ? '4.5px 6px' : '7px 8px'} !important;
                word-break: break-word !important;
              }
            }
          `
        }} />

        {/* BREADCRUMB NAVIGATION */}
        <div className={`flex items-center gap-2 text-xs font-bold no-print ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          <Link to="/admin/report" className={`transition ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`}>Reports Hub</Link>
          <span>/</span>
          {parentModule && (
            <>
              <Link
                to={parentModule.route}
                className="hover:underline transition font-bold"
                style={{ color: parentModule.color }}
              >
                {lang === 'kh' ? parentModule.kh : parentModule.en}
              </Link>
              <span>/</span>
            </>
          )}
          <span className={`font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{lang === 'kh' ? activeCurrentModule.kh : activeCurrentModule.en}</span>
        </div>

        {/* 1. TOP HEADER SECTION */}
        <div className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-3xl border p-5 sm:p-6 shadow-xl no-print ${isDark
          ? 'border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950'
          : 'border-slate-200 bg-white shadow-slate-200/50'
          }`}>
          <div className="flex items-center gap-3.5">
            <span
              className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl ring-1 shadow-lg"
              style={{ background: activeCurrentModule.bg, borderColor: activeCurrentModule.color + '40' }}
            >
              <img src={activeCurrentModule.icon} alt="" className="h-8 w-8 object-contain drop-shadow" />
            </span>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-[#232F3F]'}`}>
                  {reportHeading}
                </h1>
                <span
                  className="rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase font-mono tracking-wider"
                  style={{ background: activeCurrentModule.bg, color: activeCurrentModule.color, border: `1px solid ${activeCurrentModule.color}40` }}
                >
                  {activeCurrentModule.tag || (activeCurrentModule.route?.includes('/stock/') ? 'Stock' : 'Report')}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  ● Live Data
                </span>
              </div>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {lang === 'kh'
                  ? `មើល និងទាញយកទិន្នន័យ ${activeCurrentModule.kh}`
                  : `Preview and export live data records for ${reportHeading.toLowerCase()}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <Link
              to={backRoute}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-bold transition active:scale-95 ${isDark
                ? 'border-slate-700 bg-slate-950/80 text-slate-300 hover:text-white hover:border-slate-500'
                : 'border-slate-300 bg-white text-slate-700 hover:text-slate-900 hover:border-slate-400 shadow-xs'
                }`}
            >
              <span>←</span>
              <span>{backLabel}</span>
            </Link>
          </div>
        </div>

        {/* 2. PREVIEW REPORT CONTROLS & ADVANCE FILTERS */}
        <section className={`rounded-3xl border p-5 sm:p-6 shadow-xl space-y-4 no-print ${isDark
          ? 'border-slate-800 bg-slate-900/90 text-slate-100'
          : 'border-slate-200 bg-white text-slate-800 shadow-slate-200/50'
          }`}>
          {/* PRIMARY CONTROLS ROW */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 items-end">
            {/* From Date */}
            <div className="sm:col-span-2">
              <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                From Date
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value)
                  setDatePreset('custom')
                }}
                className={`w-full rounded-xl border px-3 py-2 text-xs font-semibold outline-none focus:border-blue-400 ${isDark ? 'border-slate-700 bg-slate-950 text-white' : 'border-slate-300 bg-slate-50 text-slate-900'
                  }`}
              />
            </div>

            {/* To Date */}
            <div className="sm:col-span-2">
              <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                To Date
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value)
                  setDatePreset('custom')
                }}
                className={`w-full rounded-xl border px-3 py-2 text-xs font-semibold outline-none focus:border-blue-400 ${isDark ? 'border-slate-700 bg-slate-950 text-white' : 'border-slate-300 bg-slate-50 text-slate-900'
                  }`}
              />
            </div>

            {activeDataKey === 'inventory-list' ? (
              <>
                {/* Product - Textbox Search Icon */}
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Product ({availableProducts.length} Live)
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setProductModalQuery(productFilter)
                        setProductModalCategory('all')
                        setShowProductModal(true)
                      }}
                      className="text-[10px] font-bold text-blue-500 hover:text-blue-400 hover:underline inline-flex items-center gap-1 cursor-pointer transition"
                      title="Open full catalog search popup"
                    >
                      <span>🔍 Browse</span>
                    </button>
                  </div>
                  <div className="relative flex items-center group">
                    <button
                      type="button"
                      onClick={() => {
                        setProductModalQuery(productFilter)
                        setProductModalCategory('all')
                        setShowProductModal(true)
                      }}
                      className="absolute left-2.5 p-0.5 text-slate-400 hover:text-blue-500 transition cursor-pointer"
                      title="Click search icon to open product search popup"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>

                    <input
                      type="text"
                      list="live-products-datalist-inventory-top"
                      placeholder="Search SKU or name..."
                      value={productFilter}
                      onChange={(e) => setProductFilter(e.target.value)}
                      className={`w-full rounded-xl border pl-8 pr-7 py-2 text-xs font-semibold outline-none focus:border-blue-400 ${
                        isDark ? 'border-slate-700 bg-slate-950 text-white placeholder-slate-500' : 'border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400'
                      }`}
                    />

                    {productFilter && (
                      <button
                        type="button"
                        onClick={() => setProductFilter('')}
                        className="absolute right-2 p-1 text-slate-400 hover:text-white rounded-md transition text-xs cursor-pointer"
                        title="Clear product filter"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <datalist id="live-products-datalist-inventory-top">
                    {availableProducts.map((p) => (
                      <option key={p.id || p.code} value={p.title || p.name}>
                        {p.code ? `[${p.code}] ` : ''}{p.title || p.name}
                      </option>
                    ))}
                  </datalist>
                </div>

                {/* Product Group - DropDown */}
                <div className="sm:col-span-2">
                  <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Product Group ({filterOptions.productGroups.length} Live)
                  </label>
                  <select
                    value={productGroupFilter}
                    onChange={(e) => setProductGroupFilter(e.target.value)}
                    className={`w-full rounded-xl border px-3 py-2 text-xs font-semibold outline-none focus:border-blue-400 ${
                      isDark ? 'border-slate-700 bg-slate-950 text-white' : 'border-slate-300 bg-slate-50 text-slate-900'
                    }`}
                  >
                    <option value="all">All Product Groups</option>
                    {filterOptions.productGroups.map((pg) => (
                      <option key={pg.id || pg.name || pg.code} value={pg.description || pg.name || pg.code}>
                        {pg.description || pg.name || pg.code}
                      </option>
                    ))}
                    {filterOptions.productGroups.length === 0 && (
                      <>
                        <option value="Fresh Grocery">Fresh Grocery</option>
                        <option value="Pantry Staples">Pantry Staples</option>
                        <option value="Cold Chain">Cold Chain</option>
                        <option value="Beverages">Beverages</option>
                      </>
                    )}
                  </select>
                </div>
              </>
            ) : (
              <>
                {/* Date Preset Dropdown */}
                <div className="sm:col-span-2">
                  <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Date Range
                  </label>
                  <select
                    value={datePreset}
                    onChange={(e) => handleDatePresetChange(e.target.value)}
                    className={`w-full rounded-xl border px-3 py-2 text-xs font-semibold outline-none focus:border-blue-400 ${isDark ? 'border-slate-700 bg-slate-950 text-white' : 'border-slate-300 bg-slate-50 text-slate-900'
                      }`}
                  >
                    <option value="all">All Dates</option>
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="this-week">This Week</option>
                    <option value="last-week">Last Week</option>
                    <option value="this-month">This Month</option>
                    <option value="last-month">Last Month</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>

                {/* Customer */}
                <div className="sm:col-span-2">
                  <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Customer / Party
                  </label>
                  <input
                    type="text"
                    placeholder="Search customer / party..."
                    value={customerFilter}
                    onChange={(e) => setCustomerFilter(e.target.value)}
                    className={`w-full rounded-xl border px-3 py-2 text-xs font-semibold outline-none focus:border-blue-400 ${isDark ? 'border-slate-700 bg-slate-950 text-white placeholder-slate-500' : 'border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400'
                      }`}
                  />
                </div>
              </>
            )}

            {/* ACTION BUTTONS */}
            <div className="sm:col-span-4 flex flex-wrap items-center gap-2 justify-end">
              {/* Generated Button */}
              <button
                type="button"
                onClick={handleGenerateReport}
                disabled={loading}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-3.5 py-2 text-xs font-black text-white shadow-md shadow-blue-500/25 transition active:scale-95 disabled:opacity-50"
              >
                <span>⚡</span>
                <span>{loading ? 'Generating...' : 'Generated'}</span>
              </button>

              {/* Button preview for print */}
              <button
                type="button"
                onClick={() => setPrintPreviewOpen(true)}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition active:scale-95 ${isDark ? 'border-slate-700 bg-slate-800/90 hover:bg-slate-700 hover:text-white text-slate-300' : 'border-slate-300 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 text-slate-700'
                  }`}
              >
                <span>🖨️</span>
                <span>Preview for Print</span>
              </button>

              {/* Export Button */}
              <button
                type="button"
                onClick={handleExportExcel}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-3.5 py-2 text-xs font-black text-white shadow-md shadow-emerald-500/25 transition active:scale-95"
              >
                <span>📥</span>
                <span>Export</span>
              </button>

              {/* Choose Column Button */}
              <button
                type="button"
                onClick={() => {
                  setColDraft(new Set(visibleCols.size ? visibleCols : tableColumns))
                  setShowColModal(true)
                }}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition active:scale-95 ${isDark ? 'border-slate-700 bg-slate-800/90 hover:bg-slate-700 hover:text-white text-slate-300' : 'border-slate-300 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 text-slate-700'
                  }`}
                title="Choose columns to display on table and printout"
              >
                <span>📋</span>
                <span>Choose Column</span>
                <span className={`ml-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-mono border ${isDark ? 'bg-slate-950 text-blue-400 border-slate-800' : 'bg-white text-blue-600 border-slate-200'
                  }`}>
                  {activeColumns.length}/{tableColumns.length}
                </span>
              </button>

              {/* EYE-CATCHING ADVANCE BUTTON */}
              <button
                type="button"
                onClick={() => setAdvanceOpen(!advanceOpen)}
                className={`relative inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition-all active:scale-95 shadow-md ${advanceOpen
                  ? 'bg-purple-600 text-white ring-2 ring-purple-400 shadow-purple-600/30'
                  : 'bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white shadow-purple-600/25 ring-1 ring-purple-500/50 hover:scale-[1.02]'
                  }`}
              >
                <span className="text-sm">⚙️</span>
                <span>Advance</span>
                {activeAdvanceFilterCount > 0 ? (
                  <span className="inline-flex items-center justify-center h-4 px-1.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black animate-pulse">
                    {activeAdvanceFilterCount}
                  </span>
                ) : (
                  <span className="text-[10px] font-mono">{advanceOpen ? '▲ Hide' : '▼ Options'}</span>
                )}
              </button>
            </div>
          </div>

          {/* ACTIVE FILTER CHIPS (Visible when any filter is active) */}
          {activeAdvanceFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
              <span className="text-[11px] font-bold text-slate-400">Active Criteria:</span>
              {(activeDataKey === 'request-transfer' || activeDataKey === 'ship-request-transfer') ? (
                <>
                  {requestOutletFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 bg-purple-500/20 border border-purple-500/40 text-purple-300 px-2.5 py-0.5 rounded-lg text-[11px]">
                      Req Outlet: {requestOutletFilter}
                      <button type="button" onClick={() => setRequestOutletFilter('all')} className="hover:text-white">✕</button>
                    </span>
                  )}
                  {requestLocationFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 bg-purple-500/20 border border-purple-500/40 text-purple-300 px-2.5 py-0.5 rounded-lg text-[11px]">
                      Req Loc: {requestLocationFilter}
                      <button type="button" onClick={() => setRequestLocationFilter('all')} className="hover:text-white">✕</button>
                    </span>
                  )}
                  {toOutletFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 px-2.5 py-0.5 rounded-lg text-[11px]">
                      To Outlet: {toOutletFilter}
                      <button type="button" onClick={() => setToOutletFilter('all')} className="hover:text-white">✕</button>
                    </span>
                  )}
                  {toLocationFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 px-2.5 py-0.5 rounded-lg text-[11px]">
                      To Loc: {toLocationFilter}
                      <button type="button" onClick={() => setToLocationFilter('all')} className="hover:text-white">✕</button>
                    </span>
                  )}
                  {productFilter.trim() && (
                    <span className="inline-flex items-center gap-1 bg-blue-500/20 border border-blue-500/40 text-blue-300 px-2.5 py-0.5 rounded-lg text-[11px]">
                      Product: {productFilter}
                      <button type="button" onClick={() => setProductFilter('')} className="hover:text-white">✕</button>
                    </span>
                  )}
                  {productGroupFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 px-2.5 py-0.5 rounded-lg text-[11px]">
                      Group: {productGroupFilter}
                      <button type="button" onClick={() => setProductGroupFilter('all')} className="hover:text-white">✕</button>
                    </span>
                  )}
                  {brandFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 bg-pink-500/20 border border-pink-500/40 text-pink-300 px-2.5 py-0.5 rounded-lg text-[11px]">
                      Brand: {brandFilter}
                      <button type="button" onClick={() => setBrandFilter('all')} className="hover:text-white">✕</button>
                    </span>
                  )}
                  {categoryFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-2.5 py-0.5 rounded-lg text-[11px]">
                      Category: {categoryFilter}
                      <button type="button" onClick={() => setCategoryFilter('all')} className="hover:text-white">✕</button>
                    </span>
                  )}
                  {groupByFilter !== 'none' && (
                    <span className="inline-flex items-center gap-1 bg-slate-500/20 border border-slate-500/40 text-slate-300 px-2.5 py-0.5 rounded-lg text-[11px]">
                      Group By: {groupByFilter}
                      <button type="button" onClick={() => setGroupByFilter('none')} className="hover:text-white">✕</button>
                    </span>
                  )}
                  {statusFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 px-2.5 py-0.5 rounded-lg text-[11px]">
                      Status: {statusFilter}
                      <button type="button" onClick={() => setStatusFilter('all')} className="hover:text-white">✕</button>
                    </span>
                  )}
                  {activeDataKey === 'request-transfer' && requestTransferTypeFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 bg-violet-500/20 border border-violet-500/40 text-violet-300 px-2.5 py-0.5 rounded-lg text-[11px]">
                      Type: {requestTransferTypeFilter}
                      <button type="button" onClick={() => setRequestTransferTypeFilter('all')} className="hover:text-white">✕</button>
                    </span>
                  )}
                </>
              ) : (
                <>
                  {outletFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 bg-purple-500/20 border border-purple-500/40 text-purple-300 px-2.5 py-0.5 rounded-lg text-[11px]">
                      Outlet: {outletFilter}
                      <button type="button" onClick={() => setOutletFilter('all')} className="hover:text-white">✕</button>
                    </span>
                  )}
                  {locationFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 bg-purple-500/20 border border-purple-500/40 text-purple-300 px-2.5 py-0.5 rounded-lg text-[11px]">
                      Location: {locationFilter}
                      <button type="button" onClick={() => setLocationFilter('all')} className="hover:text-white">✕</button>
                    </span>
                  )}
                  {productFilter.trim() && (
                    <span className="inline-flex items-center gap-1 bg-blue-500/20 border border-blue-500/40 text-blue-300 px-2.5 py-0.5 rounded-lg text-[11px]">
                      Product: {productFilter}
                      <button type="button" onClick={() => setProductFilter('')} className="hover:text-white">✕</button>
                    </span>
                  )}
                  {activeDataKey === 'adjustment' && adjustTypeFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 bg-violet-500/20 border border-violet-500/40 text-violet-300 px-2.5 py-0.5 rounded-lg text-[11px]">
                      Adjust Type: {adjustTypeFilter}
                      <button type="button" onClick={() => setAdjustTypeFilter('all')} className="hover:text-white">✕</button>
                    </span>
                  )}
                  {productGroupFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 px-2.5 py-0.5 rounded-lg text-[11px]">
                      Group: {productGroupFilter}
                      <button type="button" onClick={() => setProductGroupFilter('all')} className="hover:text-white">✕</button>
                    </span>
                  )}
                  {categoryFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-2.5 py-0.5 rounded-lg text-[11px]">
                      Category: {categoryFilter}
                      <button type="button" onClick={() => setCategoryFilter('all')} className="hover:text-white">✕</button>
                    </span>
                  )}
                  {brandFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 bg-pink-500/20 border border-pink-500/40 text-pink-300 px-2.5 py-0.5 rounded-lg text-[11px]">
                      Brand: {brandFilter}
                      <button type="button" onClick={() => setBrandFilter('all')} className="hover:text-white">✕</button>
                    </span>
                  )}
                  {groupByFilter !== 'none' && (
                    <span className="inline-flex items-center gap-1 bg-slate-500/20 border border-slate-500/40 text-slate-300 px-2.5 py-0.5 rounded-lg text-[11px]">
                      Group By: {groupByFilter}
                      <button type="button" onClick={() => setGroupByFilter('none')} className="hover:text-white">✕</button>
                    </span>
                  )}
                  {viewAsFilter !== 'detailed' && (
                    <span className="inline-flex items-center gap-1 bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 px-2.5 py-0.5 rounded-lg text-[11px]">
                      View As: {viewAsFilter}
                      <button type="button" onClick={() => setViewAsFilter('detailed')} className="hover:text-white">✕</button>
                    </span>
                  )}
                  {activeDataKey === 'inventory-list' && expiryDayFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 px-2.5 py-0.5 rounded-lg text-[11px]">
                      Expiry: {expiryDayFilter}
                      <button type="button" onClick={() => setExpiryDayFilter('all')} className="hover:text-white">✕</button>
                    </span>
                  )}
                  {activeDataKey === 'inventory-list' && inventoryValueFilter.trim() && (
                    <span className="inline-flex items-center gap-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-2.5 py-0.5 rounded-lg text-[11px]">
                      Value: {inventoryValueFilter}
                      <button type="button" onClick={() => setInventoryValueFilter('')} className="hover:text-white">✕</button>
                    </span>
                  )}
                  {activeDataKey === 'inventory-list' && onhandFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 bg-teal-500/20 border border-teal-500/40 text-teal-300 px-2.5 py-0.5 rounded-lg text-[11px]">
                      Onhand: {onhandFilter}
                      <button type="button" onClick={() => setOnhandFilter('all')} className="hover:text-white">✕</button>
                    </span>
                  )}
                  {activeDataKey === 'inventory-list' && statusFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 bg-orange-500/20 border border-orange-500/40 text-orange-300 px-2.5 py-0.5 rounded-lg text-[11px]">
                      Status: {statusFilter}
                      <button type="button" onClick={() => setStatusFilter('all')} className="hover:text-white">✕</button>
                    </span>
                  )}
                  {activeDataKey !== 'transferred' && activeDataKey !== 'adjustment' && activeDataKey !== 'issued' && activeDataKey !== 'inventory-list' && supplierFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 px-2.5 py-0.5 rounded-lg text-[11px]">
                      Supplier: {supplierFilter}
                      <button type="button" onClick={() => setSupplierFilter('all')} className="hover:text-white">✕</button>
                    </span>
                  )}
                </>
              )}
              <button
                type="button"
                onClick={handleResetAdvanceFilters}
                className="text-[11px] font-bold text-rose-400 hover:text-rose-300 underline ml-1"
              >
                Clear All
              </button>
            </div>
          )}

          {/* ADVANCE FILTER PANEL (Expandable with Live Database Dropdowns) */}
          {advanceOpen && (
            <div className="pt-4 border-t border-slate-800 bg-slate-950/60 p-4 rounded-2xl border border-purple-500/20 space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="text-sm">⚡</span>
                  <span className="text-xs font-black text-white uppercase tracking-wider">
                    Advance Filter Options (Live Database Connected)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleResetAdvanceFilters}
                  className="inline-flex items-center gap-1 text-xs font-bold text-purple-400 hover:text-purple-300 transition"
                >
                  <span>🔄</span>
                  <span>Reset Advance Filters</span>
                </button>
              </div>

              {activeDataKey === 'request-transfer' || activeDataKey === 'ship-request-transfer' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
                  {/* 1. Request Outlet - Dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Request Outlet ({liveRequestTransferOptions.requestOutlets.length} Live)
                    </label>
                    <select
                      value={requestOutletFilter}
                      onChange={(e) => setRequestOutletFilter(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white outline-none focus:border-purple-400 transition"
                    >
                      <option value="all">All Request Outlets</option>
                      {liveRequestTransferOptions.requestOutlets.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>

                  {/* 2. Request Location - Dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Request Location ({liveRequestTransferOptions.requestLocations.length} Live)
                    </label>
                    <select
                      value={requestLocationFilter}
                      onChange={(e) => setRequestLocationFilter(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white outline-none focus:border-purple-400 transition"
                    >
                      <option value="all">All Request Locations</option>
                      {liveRequestTransferOptions.requestLocations.map((l) => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>

                  {/* 3. To Outlet - Dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      To Outlet ({liveRequestTransferOptions.toOutlets.length} Live)
                    </label>
                    <select
                      value={toOutletFilter}
                      onChange={(e) => setToOutletFilter(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white outline-none focus:border-purple-400 transition"
                    >
                      <option value="all">All To Outlets</option>
                      {liveRequestTransferOptions.toOutlets.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>

                  {/* 4. To Location - Dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      To Location ({liveRequestTransferOptions.toLocations.length} Live)
                    </label>
                    <select
                      value={toLocationFilter}
                      onChange={(e) => setToLocationFilter(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white outline-none focus:border-purple-400 transition"
                    >
                      <option value="all">All To Locations</option>
                      {liveRequestTransferOptions.toLocations.map((l) => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>

                  {/* 5. Product - Search icon + browse popup trigger */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Product ({availableProducts.length} Live)
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setProductModalQuery(productFilter)
                          setProductModalCategory('all')
                          setShowProductModal(true)
                        }}
                        className="text-[10px] font-bold text-purple-400 hover:text-purple-300 hover:underline inline-flex items-center gap-1 cursor-pointer transition"
                        title="Open full catalog search popup"
                      >
                        <span>🔍 Browse</span>
                      </button>
                    </div>
                    <div className="relative flex items-center group">
                      <button
                        type="button"
                        onClick={() => {
                          setProductModalQuery(productFilter)
                          setProductModalCategory('all')
                          setShowProductModal(true)
                        }}
                        className="absolute left-2.5 p-0.5 text-slate-400 hover:text-purple-400 transition cursor-pointer"
                        title="Click search icon to open product search popup"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </button>

                      <input
                        type="text"
                        list="live-products-datalist"
                        placeholder="Search product SKU/name..."
                        value={productFilter}
                        onChange={(e) => setProductFilter(e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-8 pr-20 py-2 text-xs font-semibold text-white placeholder-slate-500 outline-none focus:border-purple-400 transition"
                      />

                      <div className="absolute right-1.5 flex items-center gap-1">
                        {productFilter && (
                          <button
                            type="button"
                            onClick={() => setProductFilter('')}
                            className="p-1 text-slate-400 hover:text-white rounded-md transition text-xs cursor-pointer"
                            title="Clear product filter"
                          >
                            ✕
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setProductModalQuery(productFilter)
                            setProductModalCategory('all')
                            setShowProductModal(true)
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold transition shadow-xs active:scale-95 cursor-pointer"
                          title="Search Products Popup"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <span>Search</span>
                        </button>
                      </div>
                    </div>
                    <datalist id="live-products-datalist">
                      {availableProducts.map((p) => (
                        <option key={p.id || p.code} value={p.title || p.name}>
                          {p.code ? `[${p.code}] ` : ''}{p.title || p.name}
                        </option>
                      ))}
                    </datalist>
                  </div>

                  {/* 6. Product Group - Dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Product Group ({liveRequestTransferOptions.productGroups.length} Live)
                    </label>
                    <select
                      value={productGroupFilter}
                      onChange={(e) => setProductGroupFilter(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white outline-none focus:border-purple-400 transition"
                    >
                      <option value="all">All Product Groups</option>
                      {liveRequestTransferOptions.productGroups.map((pg) => (
                        <option key={pg} value={pg}>{pg}</option>
                      ))}
                    </select>
                  </div>

                  {/* 7. Brand - Dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Brand ({liveRequestTransferOptions.brands.length} Live)
                    </label>
                    <select
                      value={brandFilter}
                      onChange={(e) => setBrandFilter(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white outline-none focus:border-purple-400 transition"
                    >
                      <option value="all">All Brands</option>
                      {liveRequestTransferOptions.brands.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  {/* 8. Category - Dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Category ({liveRequestTransferOptions.categories.length} Live)
                    </label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white outline-none focus:border-purple-400 transition"
                    >
                      <option value="all">All Categories</option>
                      {liveRequestTransferOptions.categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* 9. Group By - Dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Group By
                    </label>
                    <select
                      value={groupByFilter}
                      onChange={(e) => setGroupByFilter(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white outline-none focus:border-purple-400 transition"
                    >
                      <option value="none">None (Standard)</option>
                      <option value="by-request-outlet">By Request Outlet</option>
                      <option value="by-request-location">By Request Location</option>
                      <option value="by-to-outlet">By To Outlet</option>
                      <option value="by-to-location">By To Location</option>
                      <option value="by-status">By Status</option>
                      {activeDataKey === 'request-transfer' && (
                        <option value="by-type">By Request Transfer Type</option>
                      )}
                      <option value="by-product">By Product</option>
                      <option value="by-group">By Product Group</option>
                      <option value="by-brand">By Brand</option>
                      <option value="by-category">By Category</option>
                      <option value="by-date">By Date</option>
                    </select>
                  </div>

                  {/* 10. Status - Dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Status ({liveRequestTransferOptions.statuses.length} Live)
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white outline-none focus:border-purple-400 transition"
                    >
                      <option value="all">All Statuses</option>
                      {liveRequestTransferOptions.statuses.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  {/* 11. Request Transfer Type - Dropdown (Only for Request Transfer) */}
                  {activeDataKey === 'request-transfer' && (
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Request Transfer Type ({liveRequestTransferOptions.types.length} Live)
                      </label>
                      <select
                        value={requestTransferTypeFilter}
                        onChange={(e) => setRequestTransferTypeFilter(e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white outline-none focus:border-purple-400 transition"
                      >
                        <option value="all">All Types</option>
                        {liveRequestTransferOptions.types.map((tp) => (
                          <option key={tp} value={tp}>{tp.replace(/_/g, ' ')}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Quick Action: Reset inside panel */}
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={handleResetAdvanceFilters}
                      className="w-full rounded-xl border border-purple-500/40 bg-purple-500/15 py-2 px-3 text-xs font-bold text-purple-300 hover:bg-purple-500/25 transition active:scale-95 text-center cursor-pointer"
                    >
                      ✕ Reset Advance
                    </button>
                  </div>
                </div>
              ) : activeDataKey === 'adjustment' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {/* 1. Outlet - Dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Outlet ({filterOptions.outlets.length} Live)
                    </label>
                    <select
                      value={outletFilter}
                      onChange={(e) => setOutletFilter(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white outline-none focus:border-purple-400 transition"
                    >
                      <option value="all">All Outlets</option>
                      {filterOptions.outlets.map((o) => (
                        <option key={o.id || o.name || o.code} value={o.description || o.name || o.code}>
                          {o.description || o.name || o.code}
                        </option>
                      ))}
                      {filterOptions.outlets.length === 0 && (
                        <>
                          <option value="Central Warehouse">Central Warehouse</option>
                          <option value="Main Mart">Main Mart</option>
                          <option value="BKK1 Branch">BKK1 Branch</option>
                          <option value="Toul Kork Branch">Toul Kork Branch</option>
                          <option value="SR Depot">SR Depot</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* 2. Location - Dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Location ({filterOptions.locations.length} Live)
                    </label>
                    <select
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white outline-none focus:border-purple-400 transition"
                    >
                      <option value="all">All Locations</option>
                      {filterOptions.locations.map((l) => (
                        <option key={l.id || l.name || l.code} value={l.description || l.name || l.code}>
                          {l.description || l.name || l.code}
                        </option>
                      ))}
                      {filterOptions.locations.length === 0 && (
                        <>
                          <option value="Warehouse Floor A">Warehouse Floor A</option>
                          <option value="Cold Storage #1">Cold Storage #1</option>
                          <option value="Chiller Room 2">Chiller Room 2</option>
                          <option value="Aisle 3 Chiller">Aisle 3 Chiller</option>
                          <option value="Meat Freezer #1">Meat Freezer #1</option>
                          <option value="Main Shelf B">Main Shelf B</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* 3. Adjust Type - Dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Adjust Type ({liveAdjustTypeOptions.length} Live)
                    </label>
                    <select
                      value={adjustTypeFilter}
                      onChange={(e) => setAdjustTypeFilter(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white outline-none focus:border-purple-400 transition"
                    >
                      <option value="all">All Adjust Types</option>
                      {liveAdjustTypeOptions.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  {/* 4. Product - Search icon + browse popup */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Product ({availableProducts.length} Live)
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setProductModalQuery(productFilter)
                          setProductModalCategory('all')
                          setShowProductModal(true)
                        }}
                        className="text-[10px] font-bold text-purple-400 hover:text-purple-300 hover:underline inline-flex items-center gap-1 cursor-pointer transition"
                        title="Open full catalog search popup"
                      >
                        <span>🔍 Browse</span>
                      </button>
                    </div>
                    <div className="relative flex items-center group">
                      <button
                        type="button"
                        onClick={() => {
                          setProductModalQuery(productFilter)
                          setProductModalCategory('all')
                          setShowProductModal(true)
                        }}
                        className="absolute left-2.5 p-0.5 text-slate-400 hover:text-purple-400 transition cursor-pointer"
                        title="Click search icon to open product search popup"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </button>

                      <input
                        type="text"
                        list="live-products-datalist-adjustment"
                        placeholder="Search product SKU/name..."
                        value={productFilter}
                        onChange={(e) => setProductFilter(e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-8 pr-20 py-2 text-xs font-semibold text-white placeholder-slate-500 outline-none focus:border-purple-400 transition"
                      />

                      <div className="absolute right-1.5 flex items-center gap-1">
                        {productFilter && (
                          <button
                            type="button"
                            onClick={() => setProductFilter('')}
                            className="p-1 text-slate-400 hover:text-white rounded-md transition text-xs cursor-pointer"
                            title="Clear product filter"
                          >
                            ✕
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setProductModalQuery(productFilter)
                            setProductModalCategory('all')
                            setShowProductModal(true)
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold transition shadow-xs active:scale-95 cursor-pointer"
                          title="Search Products Popup"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <span>Search</span>
                        </button>
                      </div>
                    </div>
                    <datalist id="live-products-datalist-adjustment">
                      {availableProducts.map((p) => (
                        <option key={p.id || p.code} value={p.title || p.name}>
                          {p.code ? `[${p.code}] ` : ''}{p.title || p.name}
                        </option>
                      ))}
                    </datalist>
                  </div>

                  {/* 5. Product Group - Dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Product Group ({filterOptions.productGroups.length} Live)
                    </label>
                    <select
                      value={productGroupFilter}
                      onChange={(e) => setProductGroupFilter(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white outline-none focus:border-purple-400 transition"
                    >
                      <option value="all">All Product Groups</option>
                      {filterOptions.productGroups.map((pg) => (
                        <option key={pg.id || pg.name || pg.code} value={pg.description || pg.name || pg.code}>
                          {pg.description || pg.name || pg.code}
                        </option>
                      ))}
                      {filterOptions.productGroups.length === 0 && (
                        <>
                          <option value="Fresh Grocery">Fresh Grocery</option>
                          <option value="Pantry Staples">Pantry Staples</option>
                          <option value="Cold Chain">Cold Chain</option>
                          <option value="Beverages">Beverages</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* 6. Category - Dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Category ({filterOptions.categories.length} Live)
                    </label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white outline-none focus:border-purple-400 transition"
                    >
                      <option value="all">All Categories</option>
                      {filterOptions.categories.map((c) => (
                        <option key={c.id || c.name || c.code} value={c.description || c.name || c.code}>
                          {c.description || c.name || c.code}
                        </option>
                      ))}
                      {filterOptions.categories.length === 0 && (
                        <>
                          <option value="Produce">Produce</option>
                          <option value="Dairy">Dairy</option>
                          <option value="Meat">Meat</option>
                          <option value="Bakery">Bakery</option>
                          <option value="Grains">Grains</option>
                          <option value="Spices">Spices</option>
                          <option value="Beverages">Beverages</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* 7. Brand - Dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Brand ({filterOptions.brands.length} Live)
                    </label>
                    <select
                      value={brandFilter}
                      onChange={(e) => setBrandFilter(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white outline-none focus:border-purple-400 transition"
                    >
                      <option value="all">All Brands</option>
                      {filterOptions.brands.map((b) => (
                        <option key={b.id || b.name || b.code} value={b.description || b.name || b.code}>
                          {b.description || b.name || b.code}
                        </option>
                      ))}
                      {filterOptions.brands.length === 0 && (
                        <>
                          <option value="Heritage Organic">Heritage Organic</option>
                          <option value="Angkor Harvest">Angkor Harvest</option>
                          <option value="CP Foods">CP Foods</option>
                          <option value="Coca-Cola">Coca-Cola</option>
                          <option value="Lucky Local">Lucky Local</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* 8. Group By - Dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Group By
                    </label>
                    <select
                      value={groupByFilter}
                      onChange={(e) => setGroupByFilter(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white outline-none focus:border-purple-400 transition"
                    >
                      <option value="none">None (Standard)</option>
                      <option value="date">By Date</option>
                      <option value="by-adjust-type">By Adjust Type</option>
                      <option value="outlet">By Outlet</option>
                      <option value="location">By Location</option>
                      <option value="by-group">By Product Group</option>
                      <option value="category">By Category</option>
                      <option value="brand">By Brand</option>
                      <option value="product">By Product</option>
                    </select>
                  </div>

                  {/* 9. View As - Dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      View As
                    </label>
                    <select
                      value={viewAsFilter}
                      onChange={(e) => setViewAsFilter(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white outline-none focus:border-purple-400 transition"
                    >
                      <option value="detailed">Detailed List</option>
                      <option value="summary">Summary Totals</option>
                      <option value="matrix">Financial Matrix</option>
                    </select>
                  </div>

                  {/* 10. Quick Action: Reset inside panel */}
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={handleResetAdvanceFilters}
                      className="w-full rounded-xl border border-purple-500/40 bg-purple-500/15 py-2 px-3 text-xs font-bold text-purple-300 hover:bg-purple-500/25 transition active:scale-95 text-center cursor-pointer"
                    >
                      ✕ Reset Advance
                    </button>
                  </div>
                </div>
              ) : activeDataKey === 'issued' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3.5">
                  {/* 1. Outlet - dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Outlet ({filterOptions.outlets.length} Live)
                    </label>
                    <select
                      value={outletFilter}
                      onChange={(e) => setOutletFilter(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white outline-none focus:border-purple-400 transition"
                    >
                      <option value="all">All Outlets</option>
                      {filterOptions.outlets.map((o) => (
                        <option key={o.id || o.name || o.code} value={o.description || o.name || o.code}>
                          {o.description || o.name || o.code}
                        </option>
                      ))}
                      {filterOptions.outlets.length === 0 && (
                        <>
                          <option value="Central Warehouse">Central Warehouse</option>
                          <option value="Main Mart">Main Mart</option>
                          <option value="BKK1 Branch">BKK1 Branch</option>
                          <option value="Toul Kork Branch">Toul Kork Branch</option>
                          <option value="SR Depot">SR Depot</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* 2. Location - dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Location ({filterOptions.locations.length} Live)
                    </label>
                    <select
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white outline-none focus:border-purple-400 transition"
                    >
                      <option value="all">All Locations</option>
                      {filterOptions.locations.map((l) => (
                        <option key={l.id || l.name || l.code} value={l.description || l.name || l.code}>
                          {l.description || l.name || l.code}
                        </option>
                      ))}
                      {filterOptions.locations.length === 0 && (
                        <>
                          <option value="Warehouse Floor A">Warehouse Floor A</option>
                          <option value="Cold Storage #1">Cold Storage #1</option>
                          <option value="Chiller Room 2">Chiller Room 2</option>
                          <option value="Aisle 3 Chiller">Aisle 3 Chiller</option>
                          <option value="Meat Freezer #1">Meat Freezer #1</option>
                          <option value="Main Shelf B">Main Shelf B</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* 3. Product - Search icon */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Product ({availableProducts.length} Live)
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setProductModalQuery(productFilter)
                          setProductModalCategory('all')
                          setShowProductModal(true)
                        }}
                        className="text-[10px] font-bold text-purple-400 hover:text-purple-300 hover:underline inline-flex items-center gap-1 cursor-pointer transition"
                        title="Open full catalog search popup"
                      >
                        <span>🔍 Browse</span>
                      </button>
                    </div>
                    <div className="relative flex items-center group">
                      <button
                        type="button"
                        onClick={() => {
                          setProductModalQuery(productFilter)
                          setProductModalCategory('all')
                          setShowProductModal(true)
                        }}
                        className="absolute left-2.5 p-0.5 text-slate-400 hover:text-purple-400 transition cursor-pointer"
                        title="Click search icon to open product search popup"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </button>

                      <input
                        type="text"
                        list="live-products-datalist-issued"
                        placeholder="Search product SKU/name..."
                        value={productFilter}
                        onChange={(e) => setProductFilter(e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-8 pr-20 py-2 text-xs font-semibold text-white placeholder-slate-500 outline-none focus:border-purple-400 transition"
                      />

                      <div className="absolute right-1.5 flex items-center gap-1">
                        {productFilter && (
                          <button
                            type="button"
                            onClick={() => setProductFilter('')}
                            className="p-1 text-slate-400 hover:text-white rounded-md transition text-xs cursor-pointer"
                            title="Clear product filter"
                          >
                            ✕
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setProductModalQuery(productFilter)
                            setProductModalCategory('all')
                            setShowProductModal(true)
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold transition shadow-xs active:scale-95 cursor-pointer"
                          title="Search Products Popup"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <span>Search</span>
                        </button>
                      </div>
                    </div>
                    <datalist id="live-products-datalist-issued">
                      {availableProducts.map((p) => (
                        <option key={p.id || p.code} value={p.title || p.name}>
                          {p.code ? `[${p.code}] ` : ''}{p.title || p.name}
                        </option>
                      ))}
                    </datalist>
                  </div>

                  {/* 4. Product Group - dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Product Group ({filterOptions.productGroups.length} Live)
                    </label>
                    <select
                      value={productGroupFilter}
                      onChange={(e) => setProductGroupFilter(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white outline-none focus:border-purple-400 transition"
                    >
                      <option value="all">All Product Groups</option>
                      {filterOptions.productGroups.map((pg) => (
                        <option key={pg.id || pg.name || pg.code} value={pg.description || pg.name || pg.code}>
                          {pg.description || pg.name || pg.code}
                        </option>
                      ))}
                      {filterOptions.productGroups.length === 0 && (
                        <>
                          <option value="Fresh Grocery">Fresh Grocery</option>
                          <option value="Pantry Staples">Pantry Staples</option>
                          <option value="Cold Chain">Cold Chain</option>
                          <option value="Beverages">Beverages</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* 5. Category - dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Category ({filterOptions.categories.length} Live)
                    </label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white outline-none focus:border-purple-400 transition"
                    >
                      <option value="all">All Categories</option>
                      {filterOptions.categories.map((c) => (
                        <option key={c.id || c.name || c.code} value={c.description || c.name || c.code}>
                          {c.description || c.name || c.code}
                        </option>
                      ))}
                      {filterOptions.categories.length === 0 && (
                        <>
                          <option value="Produce">Produce</option>
                          <option value="Dairy">Dairy</option>
                          <option value="Meat">Meat</option>
                          <option value="Bakery">Bakery</option>
                          <option value="Grains">Grains</option>
                          <option value="Spices">Spices</option>
                          <option value="Beverages">Beverages</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* 6. Brand - dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Brand ({filterOptions.brands.length} Live)
                    </label>
                    <select
                      value={brandFilter}
                      onChange={(e) => setBrandFilter(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white outline-none focus:border-purple-400 transition"
                    >
                      <option value="all">All Brands</option>
                      {filterOptions.brands.map((b) => (
                        <option key={b.id || b.name || b.code} value={b.description || b.name || b.code}>
                          {b.description || b.name || b.code}
                        </option>
                      ))}
                      {filterOptions.brands.length === 0 && (
                        <>
                          <option value="Heritage Organic">Heritage Organic</option>
                          <option value="Angkor Harvest">Angkor Harvest</option>
                          <option value="CP Foods">CP Foods</option>
                          <option value="Coca-Cola">Coca-Cola</option>
                          <option value="Lucky Local">Lucky Local</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* 7. Group By - dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Group By
                    </label>
                    <select
                      value={groupByFilter}
                      onChange={(e) => setGroupByFilter(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white outline-none focus:border-purple-400 transition"
                    >
                      <option value="none">None (Standard)</option>
                      <option value="date">By Date</option>
                      <option value="outlet">By Outlet</option>
                      <option value="location">By Location</option>
                      <option value="by-group">By Product Group</option>
                      <option value="category">By Category</option>
                      <option value="brand">By Brand</option>
                      <option value="product">By Product</option>
                    </select>
                  </div>

                  {/* 8. View As - dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      View As
                    </label>
                    <select
                      value={viewAsFilter}
                      onChange={(e) => setViewAsFilter(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white outline-none focus:border-purple-400 transition"
                    >
                      <option value="detailed">Detailed List</option>
                      <option value="summary">Summary Totals</option>
                      <option value="matrix">Financial Matrix</option>
                    </select>
                  </div>

                  {/* Quick Action: Reset inside panel */}
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={handleResetAdvanceFilters}
                      className="w-full rounded-xl border border-purple-500/40 bg-purple-500/15 py-2 px-3 text-xs font-bold text-purple-300 hover:bg-purple-500/25 transition active:scale-95 text-center cursor-pointer"
                    >
                      ✕ Reset Advance
                    </button>
                  </div>
                </div>
              ) : activeDataKey === 'inventory-list' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
                  {/* 1. Outlet - Dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Outlet ({filterOptions.outlets.length} Live)
                    </label>
                    <select
                      value={outletFilter}
                      onChange={(e) => setOutletFilter(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white outline-none focus:border-purple-400 transition"
                    >
                      <option value="all">All Outlets</option>
                      {filterOptions.outlets.map((o) => (
                        <option key={o.id || o.name || o.code} value={o.description || o.name || o.code}>
                          {o.description || o.name || o.code}
                        </option>
                      ))}
                      {filterOptions.outlets.length === 0 && (
                        <>
                          <option value="Main Mart">Main Mart</option>
                          <option value="Central Warehouse">Central Warehouse</option>
                          <option value="BKK1 Branch">BKK1 Branch</option>
                          <option value="Toul Kork Mart">Toul Kork Mart</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* 2. Brand - Dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Brand ({filterOptions.brands.length} Live)
                    </label>
                    <select
                      value={brandFilter}
                      onChange={(e) => setBrandFilter(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white outline-none focus:border-purple-400 transition"
                    >
                      <option value="all">All Brands</option>
                      {filterOptions.brands.map((b) => (
                        <option key={b.id || b.name || b.code} value={b.description || b.name || b.code}>
                          {b.description || b.name || b.code}
                        </option>
                      ))}
                      {filterOptions.brands.length === 0 && (
                        <>
                          <option value="Heritage Organic">Heritage Organic</option>
                          <option value="Angkor Harvest">Angkor Harvest</option>
                          <option value="CP Foods">CP Foods</option>
                          <option value="Coca-Cola">Coca-Cola</option>
                          <option value="Lucky Local">Lucky Local</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* 3. Category - Dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Category ({filterOptions.categories.length} Live)
                    </label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white outline-none focus:border-purple-400 transition"
                    >
                      <option value="all">All Categories</option>
                      {filterOptions.categories.map((c) => (
                        <option key={c.id || c.name || c.code} value={c.description || c.name || c.code}>
                          {c.description || c.name || c.code}
                        </option>
                      ))}
                      {filterOptions.categories.length === 0 && (
                        <>
                          <option value="Produce">Produce</option>
                          <option value="Dairy">Dairy</option>
                          <option value="Meat">Meat</option>
                          <option value="Bakery">Bakery</option>
                          <option value="Grains">Grains</option>
                          <option value="Spices">Spices</option>
                          <option value="Beverages">Beverages</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* 4. Expiry Day - Dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Expiry Day
                    </label>
                    <select
                      value={expiryDayFilter}
                      onChange={(e) => setExpiryDayFilter(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white outline-none focus:border-purple-400 transition"
                    >
                      <option value="all">All Expiry Windows</option>
                      <option value="expired">Expired (Past Due)</option>
                      <option value="within-7">Expiring in ≤ 7 Days</option>
                      <option value="within-30">Expiring in ≤ 30 Days</option>
                      <option value="within-60">Expiring in ≤ 60 Days</option>
                      <option value="within-90">Expiring in ≤ 90 Days</option>
                      <option value="good">Good (&gt; 90 Days)</option>
                    </select>
                  </div>

                  {/* 5. Value - Textbox */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Value ($)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 500, >=100, <=1000..."
                      value={inventoryValueFilter}
                      onChange={(e) => setInventoryValueFilter(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white placeholder-slate-500 outline-none focus:border-purple-400 transition"
                    />
                  </div>

                  {/* 6. Onhand - Dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Onhand
                    </label>
                    <select
                      value={onhandFilter}
                      onChange={(e) => setOnhandFilter(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white outline-none focus:border-purple-400 transition"
                    >
                      <option value="all">All Onhand Qty</option>
                      <option value="in-stock">In Stock (&gt; 0)</option>
                      <option value="out-of-stock">Out of Stock (= 0)</option>
                      <option value="low-stock">Low Stock (≤ 10)</option>
                      <option value="overstock">Overstock (≥ 100)</option>
                      <option value="negative">Negative (&lt; 0)</option>
                    </select>
                  </div>

                  {/* 7. Group By - Dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Group By
                    </label>
                    <select
                      value={groupByFilter}
                      onChange={(e) => setGroupByFilter(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white outline-none focus:border-purple-400 transition"
                    >
                      <option value="none">None (Standard)</option>
                      <option value="outlet">By Outlet</option>
                      <option value="brand">By Brand</option>
                      <option value="category">By Category</option>
                      <option value="by-group">By Product Group</option>
                      <option value="by-status">By Status</option>
                      <option value="by-expiry">By Expiry Day</option>
                      <option value="by-onhand">By Onhand Qty</option>
                      <option value="product">By Product</option>
                    </select>
                  </div>

                  {/* 8. Status - Dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white outline-none focus:border-purple-400 transition"
                    >
                      <option value="all">All Statuses</option>
                      <option value="active">Active</option>
                      <option value="low-stock">Low Stock</option>
                      <option value="out-of-stock">Out of Stock</option>
                      <option value="discontinued">Discontinued</option>
                    </select>
                  </div>

                  {/* 9. View as - Dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      View As
                    </label>
                    <select
                      value={viewAsFilter}
                      onChange={(e) => setViewAsFilter(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white outline-none focus:border-purple-400 transition"
                    >
                      <option value="detailed">Detailed List</option>
                      <option value="summary">Summary Totals</option>
                      <option value="matrix">Financial Matrix</option>
                    </select>
                  </div>

                  {/* 10. Quick Action: Reset inside panel */}
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={handleResetAdvanceFilters}
                      className="w-full rounded-xl border border-purple-500/40 bg-purple-500/15 py-2 px-3 text-xs font-bold text-purple-300 hover:bg-purple-500/25 transition active:scale-95 text-center cursor-pointer"
                    >
                      ✕ Reset Advance
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {/* 1. Outlet Dropdown (Live from offices) */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Outlet ({filterOptions.outlets.length} Live)
                    </label>
                    <select
                      value={outletFilter}
                      onChange={(e) => setOutletFilter(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white outline-none focus:border-purple-400"
                    >
                      <option value="all">All Outlets</option>
                      {filterOptions.outlets.map((o) => (
                        <option key={o.id} value={o.description || o.name || o.code}>
                          {o.description || o.name || o.code}
                        </option>
                      ))}
                      {filterOptions.outlets.length === 0 && (
                        <>
                          <option value="Central Warehouse">Central Warehouse</option>
                          <option value="Main Mart">Main Mart</option>
                          <option value="BKK1 Branch">BKK1 Branch</option>
                          <option value="Toul Kork Branch">Toul Kork Branch</option>
                          <option value="SR Depot">SR Depot</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* 2. Location Dropdown (Live from sections) */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Location ({filterOptions.locations.length} Live)
                    </label>
                    <select
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white outline-none focus:border-purple-400"
                    >
                      <option value="all">All Locations</option>
                      {filterOptions.locations.map((l) => (
                        <option key={l.id} value={l.description || l.name || l.code}>
                          {l.description || l.name || l.code}
                        </option>
                      ))}
                      {filterOptions.locations.length === 0 && (
                        <>
                          <option value="Warehouse Floor A">Warehouse Floor A</option>
                          <option value="Cold Storage #1">Cold Storage #1</option>
                          <option value="Chiller Room 2">Chiller Room 2</option>
                          <option value="Aisle 3 Chiller">Aisle 3 Chiller</option>
                          <option value="Meat Freezer #1">Meat Freezer #1</option>
                          <option value="Main Shelf B">Main Shelf B</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* 3. Product Search with Dedicated Search Icon & Popup Trigger */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Product ({availableProducts.length} Live)
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setProductModalQuery(productFilter)
                          setProductModalCategory('all')
                          setShowProductModal(true)
                        }}
                        className="text-[10px] font-bold text-purple-400 hover:text-purple-300 hover:underline inline-flex items-center gap-1 cursor-pointer transition"
                        title="Open full catalog search popup"
                      >
                        <span>🔍 Browse Catalog</span>
                      </button>
                    </div>
                    <div className="relative flex items-center group">
                      <button
                        type="button"
                        onClick={() => {
                          setProductModalQuery(productFilter)
                          setProductModalCategory('all')
                          setShowProductModal(true)
                        }}
                        className="absolute left-2.5 p-0.5 text-slate-400 hover:text-purple-400 transition cursor-pointer"
                        title="Click to search products popup"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </button>

                      <input
                        type="text"
                        list="live-products-datalist"
                        placeholder="Search product SKU/name..."
                        value={productFilter}
                        onChange={(e) => setProductFilter(e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-8 pr-20 py-2 text-xs font-semibold text-white placeholder-slate-500 outline-none focus:border-purple-400 transition"
                      />

                      <div className="absolute right-1.5 flex items-center gap-1">
                        {productFilter && (
                          <button
                            type="button"
                            onClick={() => setProductFilter('')}
                            className="p-1 text-slate-400 hover:text-white rounded-md transition text-xs cursor-pointer"
                            title="Clear product filter"
                          >
                            ✕
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setProductModalQuery(productFilter)
                            setProductModalCategory('all')
                            setShowProductModal(true)
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold transition shadow-xs active:scale-95 cursor-pointer"
                          title="Search Products Popup"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <span>Search</span>
                        </button>
                      </div>
                    </div>
                    <datalist id="live-products-datalist">
                      {availableProducts.map((p) => (
                        <option key={p.id || p.code} value={p.title || p.name}>
                          {p.code ? `[${p.code}] ` : ''}{p.title || p.name}
                        </option>
                      ))}
                    </datalist>
                  </div>

                  {/* 4. Product Group Dropdown (Live from product groups) */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Product Group ({filterOptions.productGroups.length} Live)
                    </label>
                    <select
                      value={productGroupFilter}
                      onChange={(e) => setProductGroupFilter(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white outline-none focus:border-purple-400"
                    >
                      <option value="all">All Groups</option>
                      {filterOptions.productGroups.map((pg) => (
                        <option key={pg.id} value={pg.description || pg.name || pg.code}>
                          {pg.description || pg.name || pg.code}
                        </option>
                      ))}
                      {filterOptions.productGroups.length === 0 && (
                        <>
                          <option value="Fresh Grocery">Fresh Grocery</option>
                          <option value="Pantry Staples">Pantry Staples</option>
                          <option value="Cold Chain">Cold Chain</option>
                          <option value="Beverages">Beverages</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* 5. Category Dropdown (Live from categories) */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Category ({filterOptions.categories.length} Live)
                    </label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white outline-none focus:border-purple-400"
                    >
                      <option value="all">All Categories</option>
                      {filterOptions.categories.map((c) => (
                        <option key={c.id} value={c.description || c.name || c.code}>
                          {c.description || c.name || c.code}
                        </option>
                      ))}
                      {filterOptions.categories.length === 0 && (
                        <>
                          <option value="Produce">Produce</option>
                          <option value="Dairy">Dairy</option>
                          <option value="Meat">Meat</option>
                          <option value="Bakery">Bakery</option>
                          <option value="Grains">Grains</option>
                          <option value="Spices">Spices</option>
                          <option value="Beverages">Beverages</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* 6. Brand Dropdown (Live from brands) */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Brand ({filterOptions.brands.length} Live)
                    </label>
                    <select
                      value={brandFilter}
                      onChange={(e) => setBrandFilter(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white outline-none focus:border-purple-400"
                    >
                      <option value="all">All Brands</option>
                      {filterOptions.brands.map((b) => (
                        <option key={b.id} value={b.description || b.name || b.code}>
                          {b.description || b.name || b.code}
                        </option>
                      ))}
                      {filterOptions.brands.length === 0 && (
                        <>
                          <option value="Heritage Organic">Heritage Organic</option>
                          <option value="Angkor Harvest">Angkor Harvest</option>
                          <option value="CP Foods">CP Foods</option>
                          <option value="Coca-Cola">Coca-Cola</option>
                          <option value="Lucky Local">Lucky Local</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* 7. Supplier Dropdown (Live from suppliers) - Hidden for Transferred report */}
                  {activeDataKey !== 'transferred' && (
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Supplier ({filterOptions.suppliers.length} Live)
                      </label>
                      <select
                        value={supplierFilter}
                        onChange={(e) => setSupplierFilter(e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white outline-none focus:border-purple-400"
                      >
                        <option value="all">All Suppliers</option>
                        {filterOptions.suppliers.map((s) => (
                          <option key={s.id} value={s.name || s.description || s.code}>
                            {s.name || s.description || s.code}
                          </option>
                        ))}
                        {filterOptions.suppliers.length === 0 && (
                          <>
                            <option value="Cambodia Agri-Trading Ltd">Cambodia Agri-Trading Ltd</option>
                            <option value="CP Food Supplies Cambodia">CP Food Supplies Cambodia</option>
                            <option value="Global Dairy Import Inc">Global Dairy Import Inc</option>
                            <option value="Mekong Beverage Ltd">Mekong Beverage Ltd</option>
                            <option value="Lucky Local Supplies">Lucky Local Supplies</option>
                          </>
                        )}
                      </select>
                    </div>
                  )}

                  {/* 8. Group By Dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Group By
                    </label>
                    <select
                      value={groupByFilter}
                      onChange={(e) => setGroupByFilter(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white outline-none focus:border-purple-400"
                    >
                      <option value="none">None (Standard)</option>
                      <option value="date">By Date</option>
                      {activeDataKey !== 'transferred' && (
                        <option value="supplier">By Supplier</option>
                      )}
                      <option value="outlet">By Outlet</option>
                      <option value="category">By Category</option>
                      <option value="product">By Product</option>
                    </select>
                  </div>

                  {/* 9. View As Dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      View As
                    </label>
                    <select
                      value={viewAsFilter}
                      onChange={(e) => setViewAsFilter(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white outline-none focus:border-purple-400"
                    >
                      <option value="detailed">Detailed List</option>
                      <option value="summary">Summary Totals</option>
                      <option value="matrix">Financial Matrix</option>
                    </select>
                  </div>

                  {/* Quick Action: Reset inside panel */}
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={handleResetAdvanceFilters}
                      className="w-full rounded-xl border border-purple-500/40 bg-purple-500/15 py-2 px-3 text-xs font-bold text-purple-300 hover:bg-purple-500/25 transition active:scale-95 text-center"
                    >
                      ✕ Reset Advance
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* 3. REPORT LIST TABLE SECTION */}
        <section className={`rounded-3xl border p-5 sm:p-6 shadow-xl space-y-4 no-print ${isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white shadow-slate-200/50'
          }`}>
          <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
            <div>
              <h2 className={`text-lg font-black capitalize ${isDark ? 'text-white' : 'text-[#232F3F]'}`}>
                {reportHeading} Records
              </h2>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {lang === 'kh'
                  ? 'បង្ហាញព័ត៌មានលម្អិតនៃបញ្ជី'
                  : `Showing verified database rows and summary metrics for ${reportHeading.toLowerCase()}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold font-mono border ${isDark ? 'bg-blue-500/15 border-blue-500/30 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-700'
                }`}>
                {displayedRecords.length} Records
              </span>
              <button
                type="button"
                onClick={handleGenerateReport}
                title="Refresh from Database"
                className={`rounded-xl border px-3 py-1 text-xs font-bold transition ${isDark
                  ? 'border-slate-700 bg-slate-800 text-slate-300 hover:text-white'
                  : 'border-slate-200 bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200'
                  }`}
              >
                🔄 Refresh
              </button>
            </div>
          </div>

          {/* TABLE CONTAINER */}
          <div className={`overflow-x-auto rounded-2xl border ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            {loading ? (
              <div className={`py-16 text-center space-y-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-3 border-blue-500 border-t-transparent" />
                <p className="text-xs font-bold">Querying live database records...</p>
              </div>
            ) : displayedRecords.length > 0 ? (
              <table className={`w-full text-left text-xs ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                <thead className={`text-[11px] font-black uppercase tracking-wider border-b ${isDark ? 'bg-slate-950/90 text-slate-400 border-slate-800' : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                  <tr>
                    <th className={`py-3 px-3 w-10 text-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>#</th>
                    {activeColumns.map((col) => (
                      <th key={col} className={`py-3 px-4 whitespace-nowrap ${getColumnAlignment(col)}`}>
                        {getColumnLabel(col)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-slate-800/60 bg-slate-900/40' : 'divide-slate-200 bg-white'}`}>
                  {displayedRecords.map((row, idx) => (
                    <tr key={idx} className={`transition ${isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}>
                      <td className={`py-3 px-3 text-center font-mono text-[11px] font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {idx + 1}
                      </td>
                      {activeColumns.map((col, cellIdx) => {
                        const val = row[col]
                        const align = getColumnAlignment(col)
                        const isCode = col.toLowerCase().includes('no') || col.toLowerCase().includes('id') || col.toLowerCase().includes('code')
                        const isStatus = col === 'status' || col === 'priority'
                        const isNumeric = typeof val === 'number' || (col.toLowerCase().includes('cost') || col.toLowerCase().includes('price') || col.toLowerCase().includes('valuation') || col.toLowerCase().includes('amount') || col.toLowerCase().includes('total'))
                        const formatted = formatCellValue(col, val)

                        return (
                          <td key={cellIdx} className={`py-3 px-4 whitespace-nowrap font-medium ${align}`}>
                            {isCode ? (
                              <span className={`font-mono font-bold px-2 py-0.5 rounded-lg border ${isDark
                                ? 'text-blue-400 bg-blue-500/10 border-blue-500/25'
                                : 'text-blue-700 bg-blue-50 border-blue-200'
                                }`}>
                                {formatted}
                              </span>
                            ) : isStatus ? (
                              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${isDark
                                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                }`}>
                                ● {String(val).replace(/_/g, ' ')}
                              </span>
                            ) : isNumeric && (align === 'text-right' || typeof val === 'number') ? (
                              <span className={`font-mono font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                {formatted}
                              </span>
                            ) : (
                              <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>{formatted}</span>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
                {/* On-Screen Summary Totals Footer */}
                <tfoot className={`border-t-2 font-bold ${isDark ? 'border-slate-700 bg-slate-950 text-slate-200' : 'border-slate-300 bg-slate-100 text-slate-800'}`}>
                  <tr>
                    <td className={`py-3 px-3 text-center font-mono font-black ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Σ</td>
                    {activeColumns.map((col, cIdx) => {
                      const align = getColumnAlignment(col)
                      const hasTotal = printTotals[col] != null
                      if (cIdx === 0 && !hasTotal) {
                        return (
                          <td key={col} className={`py-3 px-4 uppercase tracking-wider text-[11px] font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Totals ({displayedRecords.length} Records)
                          </td>
                        )
                      }
                      if (hasTotal) {
                        return (
                          <td key={col} className={`py-3 px-4 font-mono font-black ${isDark ? 'text-emerald-400' : 'text-emerald-700'} ${align}`}>
                            {formatCellValue(col, printTotals[col])}
                          </td>
                        )
                      }
                      return <td key={col} className={`py-3 px-4 text-center font-mono ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>—</td>
                    })}
                  </tr>
                </tfoot>
              </table>
            ) : (
              <div className={`py-12 text-center space-y-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                <div className="text-3xl">📋</div>
                <p className="font-semibold">No records match the selected filter criteria</p>
                <button
                  type="button"
                  onClick={handleGenerateReport}
                  className={`rounded-xl border px-4 py-1.5 text-xs font-bold transition ${isDark
                    ? 'border-slate-700 bg-slate-800 text-white hover:bg-slate-700'
                    : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-100 shadow-xs'
                    }`}
                >
                  Reload Live Records
                </button>
              </div>
            )}
          </div>
        </section>

        {/* 4. PROFESSIONAL PRINT PREVIEW MODAL (UPGRADED ENTERPRISE PAPER SPECIFICATION) */}
        {printPreviewOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto no-print-bg">
            <div className={`w-full ${printOrientation === 'landscape' ? 'max-w-7xl' : 'max-w-5xl'} rounded-3xl border border-slate-800 bg-slate-900 p-4 sm:p-6 shadow-2xl space-y-4 my-4 text-slate-100 max-h-[94vh] flex flex-col transition-all`}>

              {/* Modal Header & Interactive Paper Options Bar */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 pb-3 border-b border-slate-800 shrink-0 no-print">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🖨️</span>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white">
                      Print Preview — {reportHeading}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Standard A4 official business print with formatted columns, summary totals & approval sign-offs
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Paper Orientation Selector */}
                  <div className="inline-flex rounded-xl border border-slate-700 bg-slate-950 p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setPrintOrientation('portrait')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition ${printOrientation === 'portrait' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      title="A4 Portrait layout"
                    >
                      📄 Portrait
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrintOrientation('landscape')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition ${printOrientation === 'landscape' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      title="A4 Landscape layout (Recommended for wide tables)"
                    >
                      📑 Landscape
                    </button>
                  </div>

                  {/* Print Density Selector */}
                  <div className="inline-flex rounded-xl border border-slate-700 bg-slate-950 p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setPrintDensity('normal')}
                      className={`px-2 py-1 rounded-lg font-bold transition ${printDensity === 'normal' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      title="Comfortable spacing"
                    >
                      Standard
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrintDensity('compact')}
                      className={`px-2 py-1 rounded-lg font-bold transition ${printDensity === 'compact' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      title="Compact spacing (Fits more rows)"
                    >
                      Compact
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrintDensity('dense')}
                      className={`px-2 py-1 rounded-lg font-bold transition ${printDensity === 'dense' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      title="Ultra-dense micro-spacing for 50+ lines"
                    >
                      Dense
                    </button>
                  </div>

                  {/* Paper Element Toggles */}
                  <div className="hidden sm:inline-flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-950/80 px-2 py-1 text-[11px] text-slate-300">
                    <label className="inline-flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showKpiCards}
                        onChange={(e) => setShowKpiCards(e.target.checked)}
                        className="rounded border-slate-700 bg-slate-900 text-blue-600 text-xs"
                      />
                      <span>KPIs</span>
                    </label>
                    <span className="text-slate-700">|</span>
                    <label className="inline-flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showSignatures}
                        onChange={(e) => setShowSignatures(e.target.checked)}
                        className="rounded border-slate-700 bg-slate-900 text-blue-600 text-xs"
                      />
                      <span>Signatures</span>
                    </label>
                    <span className="text-slate-700">|</span>
                    <label className="inline-flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showPrintNotes}
                        onChange={(e) => setShowPrintNotes(e.target.checked)}
                        className="rounded border-slate-700 bg-slate-900 text-blue-600 text-xs"
                      />
                      <span>Notes</span>
                    </label>
                  </div>

                  {/* Choose Columns inside Print Preview */}
                  <button
                    type="button"
                    onClick={() => {
                      setColDraft(new Set(visibleCols.size ? visibleCols : tableColumns))
                      setShowColModal(true)
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-700 transition"
                    title="Select which columns appear on this paper print"
                  >
                    <span>📋</span>
                    <span>Columns ({activeColumns.length}/{tableColumns.length})</span>
                  </button>

                  {/* Print Action Trigger */}
                  <button
                    type="button"
                    onClick={handlePrintDocument}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-1.5 text-xs font-black text-white shadow-md hover:brightness-110 active:scale-95 transition"
                  >
                    <span>🖨️</span>
                    <span>Print Paper</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPrintPreviewOpen(false)}
                    className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* PRINTABLE PAPER DOCUMENT CONTAINER */}
              <div className="flex-1 overflow-y-auto p-1 sm:p-2 scrollbar-thin">
                <div
                  id="printable-report"
                  ref={printContentRef}
                  className={`bg-white text-slate-950 p-6 sm:p-8 rounded-xl shadow-2xl space-y-5 font-['Montserrat'] border border-slate-300 mx-auto w-full transition-all ${printDensity === 'dense' ? 'text-[10px]' : printDensity === 'compact' ? 'text-[11px]' : 'text-xs'
                    }`}
                >
                  {/* Corporate Letterhead Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-4 border-b-2 border-slate-900">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-black tracking-tight text-emerald-800">B'GROCERIES</span>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                          SUPERMARKET ERP
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-800 mt-0.5">
                        Enterprise Logistics & Inventory Intelligence
                      </p>
                      <p className="text-[11px] text-slate-600">
                        Building #18, Preah Monivong Blvd, Phnom Penh, Cambodia
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Tel: +855 23 999 888 | Email: operations@bgroceries.com | Web: www.bgroceries.com
                      </p>
                    </div>

                    <div className="text-left sm:text-right font-mono text-xs text-slate-700 space-y-1">
                      <p className="text-base font-black text-slate-950 uppercase tracking-wide">
                        {reportHeading.toUpperCase()}
                      </p>
                      <p>
                        <span className="text-slate-500">Doc Ref:</span>{' '}
                        <span className="font-bold text-slate-900">
                          RPT-STK-{activeDataKey?.toUpperCase()}-{Date.now().toString().slice(-6)}
                        </span>
                      </p>
                      <p>
                        <span className="text-slate-500">Period:</span>{' '}
                        <span className="font-bold text-slate-900">
                          {fromDate || 'All Dates'} to {toDate || 'Present'}
                        </span>
                      </p>
                      <p>
                        <span className="text-slate-500">Printed:</span> {new Date().toLocaleString()}
                      </p>
                      <p className="text-[10px] font-bold text-emerald-800">
                        ● PostgreSQL Database Verified
                      </p>
                    </div>
                  </div>

                  {/* Filter Scope Summary Banner */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-300">
                    <div>
                      <span className="text-slate-500">Party / Vendor:</span>{' '}
                      <strong className="text-slate-900">{customerFilter || supplierFilter !== 'all' ? (customerFilter || supplierFilter) : 'All Parties'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Outlet Scope:</span>{' '}
                      <strong className="text-slate-900">{outletFilter}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Location / Bay:</span>{' '}
                      <strong className="text-slate-900">{locationFilter}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Columns Printed:</span>{' '}
                      <strong className="text-emerald-800 font-mono font-bold text-xs">
                        {activeColumns.length} of {tableColumns.length}
                      </strong>
                    </div>
                  </div>

                  {/* Executive KPI Summary Cards (Paper Print) */}
                  {showKpiCards && displayedRecords.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-2.5 bg-slate-50 border border-slate-300 rounded-lg">
                        <p className="text-[9.5px] font-bold uppercase tracking-wider text-slate-500">Total Records</p>
                        <p className="text-base font-black font-mono text-slate-900 mt-0.5">{displayedRecords.length} Lines</p>
                        <p className="text-[9px] text-slate-500">Document Count</p>
                      </div>
                      <div className="p-2.5 bg-slate-50 border border-slate-300 rounded-lg">
                        <p className="text-[9.5px] font-bold uppercase tracking-wider text-slate-500">Total Volume / Units</p>
                        <p className="text-base font-black font-mono text-blue-900 mt-0.5">
                          {summaryQtyTotal != null ? Number(summaryQtyTotal).toLocaleString() + ' Units' : `${displayedRecords.length} Items`}
                        </p>
                        <p className="text-[9px] text-slate-500">Physical Stock Volume</p>
                      </div>
                      <div className="p-2.5 bg-slate-50 border border-slate-300 rounded-lg">
                        <p className="text-[9.5px] font-bold uppercase tracking-wider text-slate-500">Total Valuation / Cost</p>
                        <p className="text-base font-black font-mono text-emerald-900 mt-0.5">
                          {summaryValuationTotal != null
                            ? `$${Number(summaryValuationTotal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                            : '$0.00'}
                        </p>
                        <p className="text-[9px] text-slate-500">Valuation in USD ($)</p>
                      </div>
                      <div className="p-2.5 bg-slate-50 border border-slate-300 rounded-lg">
                        <p className="text-[9.5px] font-bold uppercase tracking-wider text-slate-500">Audit Status</p>
                        <p className="text-base font-black font-mono text-slate-900 mt-0.5">VERIFIED</p>
                        <p className="text-[9px] text-emerald-700 font-bold">● Enterprise Standard</p>
                      </div>
                    </div>
                  )}

                  {/* DOCUMENT TABLE (PAPER PUBLISHING GRADE) */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse border border-slate-400">
                      {/* Paper Table Header */}
                      <thead>
                        <tr className="bg-slate-900 text-white font-black border-b-2 border-slate-900">
                          <th className="py-2 px-2 text-center w-8 border border-slate-400 font-mono text-[10px] text-slate-300">
                            #
                          </th>
                          {activeColumns.map((col) => (
                            <th
                              key={col}
                              className={`py-2 px-2.5 whitespace-nowrap border border-slate-400 uppercase tracking-wider text-[10px] ${getColumnAlignment(col)}`}
                            >
                              {getColumnLabel(col)}
                            </th>
                          ))}
                        </tr>
                      </thead>

                      {/* Paper Table Body */}
                      <tbody>
                        {displayedRecords.map((row, idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                            {/* Sequential Row Numbering */}
                            <td className="py-1.5 px-2 text-center border border-slate-300 font-mono font-bold text-slate-600 text-[10px]">
                              {idx + 1}
                            </td>

                            {/* Data Cells */}
                            {activeColumns.map((col, cellIdx) => {
                              const val = row[col]
                              const align = getColumnAlignment(col)
                              const isCode = col.toLowerCase().includes('no') || col.toLowerCase().includes('id') || col.toLowerCase().includes('code')
                              const isStatus = col === 'status' || col === 'priority'
                              const isDate = col.toLowerCase().includes('date')
                              const formatted = formatCellValue(col, val)

                              return (
                                <td
                                  key={cellIdx}
                                  className={`py-1.5 px-2.5 border border-slate-300 whitespace-nowrap text-slate-900 ${align}`}
                                >
                                  {isCode ? (
                                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-300 text-[10px]">
                                      {formatted}
                                    </span>
                                  ) : isStatus ? (
                                    <span className="inline-block font-mono font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border border-slate-700 bg-slate-100 text-slate-900">
                                      ● {String(val).replace(/_/g, ' ')}
                                    </span>
                                  ) : isDate ? (
                                    <span className="font-mono text-slate-700 text-[10px]">{formatted}</span>
                                  ) : align === 'text-right' ? (
                                    <span className="font-mono font-semibold text-slate-950">{formatted}</span>
                                  ) : (
                                    <span className="font-medium text-slate-900">{formatted}</span>
                                  )}
                                </td>
                              )
                            })}
                          </tr>
                        ))}
                      </tbody>

                      {/* Summary Totals Footer with Double Accounting Underline */}
                      <tfoot className="border-t-2 border-b-4 border-double border-slate-900 bg-slate-100/90 font-bold">
                        <tr>
                          <td className="py-2.5 px-2 text-center border border-slate-400 font-mono font-black text-slate-800 text-[10px]">
                            Σ
                          </td>
                          {activeColumns.map((col, cIdx) => {
                            const align = getColumnAlignment(col)
                            const hasTotal = printTotals[col] != null
                            if (cIdx === 0 && !hasTotal) {
                              return (
                                <td
                                  key={col}
                                  className="py-2.5 px-2.5 border border-slate-400 font-black text-slate-950 uppercase tracking-wider text-[10px]"
                                >
                                  TOTALS ({displayedRecords.length} Records)
                                </td>
                              )
                            }
                            if (hasTotal) {
                              return (
                                <td
                                  key={col}
                                  className={`py-2.5 px-2.5 border border-slate-400 font-mono font-black text-slate-950 text-[11px] whitespace-nowrap ${align}`}
                                >
                                  {formatCellValue(col, printTotals[col])}
                                </td>
                              )
                            }
                            return (
                              <td key={col} className="py-2.5 px-2.5 border border-slate-400 text-slate-400 text-center font-mono">
                                —
                              </td>
                            )
                          })}
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* Auditor & Inspection Notes Area */}
                  {showPrintNotes && (
                    <div className="p-3 bg-slate-50 border border-slate-300 rounded-lg space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-600">
                        <span>Inspector / Auditor Physical Notes & Observations:</span>
                        <span className="text-[9px] text-slate-400">Physical Stock Count Verified</span>
                      </div>
                      <div className="border-b border-dashed border-slate-400 pt-3 pb-0.5 text-[10px] text-slate-400 italic">
                        Notes: ____________________________________________________________________________________________________________________
                      </div>
                      <div className="border-b border-dashed border-slate-400 pt-3 pb-0.5 text-[10px] text-slate-400 italic">
                        Discrepancies / Remarks: _________________________________________________________________________________________________
                      </div>
                    </div>
                  )}

                  {/* Official Corporate Sign-Off Approval Block */}
                  {showSignatures && (
                    <div className="grid grid-cols-3 gap-6 pt-6 text-center text-xs text-slate-700">
                      <div className="space-y-10">
                        <p className="font-bold text-slate-900 uppercase tracking-wide text-[11px]">
                          Prepared By
                        </p>
                        <div className="border-t border-slate-500 pt-2 space-y-0.5">
                          <p className="font-bold text-slate-900">Warehouse Officer</p>
                          <p className="text-[10px] text-slate-500">Signature: __________________</p>
                          <p className="text-[10px] text-slate-500">Date: ____ / ____ / 2026</p>
                        </div>
                      </div>

                      <div className="space-y-10">
                        <p className="font-bold text-slate-900 uppercase tracking-wide text-[11px]">
                          Audited By
                        </p>
                        <div className="border-t border-slate-500 pt-2 space-y-0.5">
                          <p className="font-bold text-slate-900">Inventory Auditor</p>
                          <p className="text-[10px] text-slate-500">Signature: __________________</p>
                          <p className="text-[10px] text-slate-500">Date: ____ / ____ / 2026</p>
                        </div>
                      </div>

                      <div className="space-y-10">
                        <p className="font-bold text-slate-900 uppercase tracking-wide text-[11px]">
                          Approved By
                        </p>
                        <div className="border-t border-slate-500 pt-2 space-y-0.5">
                          <p className="font-bold text-slate-900">Managing Director</p>
                          <p className="text-[10px] text-slate-500">Signature: __________________</p>
                          <p className="text-[10px] text-slate-500">Date: ____ / ____ / 2026</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Document Footer Notice */}
                  <div className="pt-3 border-t border-slate-300 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-[10px] text-slate-500 font-mono">
                    <span>CONFIDENTIAL — FOR INTERNAL AUDIT & ENTERPRISE MANAGEMENT ONLY</span>
                    <span>B'GROCERIES SUPERMARKET ERP SYSTEM • PAGE 1 OF 1</span>
                  </div>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800 shrink-0 no-print">
                <button
                  type="button"
                  onClick={() => setPrintPreviewOpen(false)}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition"
                >
                  Close Preview
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleExportExcel}
                    className="rounded-xl border border-emerald-600/40 bg-emerald-600/20 text-emerald-300 px-4 py-2 text-xs font-bold hover:bg-emerald-600/30 transition"
                  >
                    📥 Export Excel
                  </button>
                  <button
                    type="button"
                    onClick={handlePrintDocument}
                    className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2 text-xs font-black text-white shadow-md hover:brightness-110 active:scale-95 transition"
                  >
                    🖨️ Print Paper
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. CHOOSE COLUMN MODAL (FOR ALL STOCK REPORTS) */}
        {showColModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 no-print">
            <div className="w-full max-w-lg rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">📋</span>
                  <div>
                    <h3 className="text-base font-black text-white">Choose Column</h3>
                    <p className="text-xs text-slate-400">
                      Choose column you want to display on table and print paper
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowColModal(false)}
                  className="rounded-xl p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition text-sm"
                >
                  ✕
                </button>
              </div>

              {/* Quick Selection Toolbar */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="font-mono text-slate-400">
                  Selected: <strong className="text-blue-400 font-bold">{colDraft.size}</strong> of {tableColumns.length} columns
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setColDraft(new Set(tableColumns))}
                    className="text-[11px] font-bold text-blue-400 hover:text-blue-300 hover:underline"
                  >
                    Select All
                  </button>
                  <span className="text-slate-700">|</span>
                  <button
                    type="button"
                    onClick={() => setColDraft(new Set())}
                    className="text-[11px] font-bold text-slate-400 hover:text-slate-300 hover:underline"
                  >
                    Clear All
                  </button>
                  <span className="text-slate-700">|</span>
                  <button
                    type="button"
                    onClick={handleResetColumns}
                    className="text-[11px] font-bold text-purple-400 hover:text-purple-300 hover:underline"
                  >
                    Reset Default
                  </button>
                </div>
              </div>

              {/* Checkbox Column Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin">
                {tableColumns.map((col) => {
                  const isChecked = colDraft.has(col)
                  const align = getColumnAlignment(col)
                  const isNum = align === 'text-right'
                  const isCenter = align === 'text-center'

                  return (
                    <label
                      key={col}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition select-none ${isChecked
                        ? 'bg-blue-600/15 border-blue-500/40 text-white shadow-sm shadow-blue-500/10'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            const next = new Set(colDraft)
                            if (next.has(col)) {
                              next.delete(col)
                            } else {
                              next.add(col)
                            }
                            setColDraft(next)
                          }}
                          className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 h-4 w-4"
                        />
                        <span className="font-semibold truncate">{getColumnLabel(col)}</span>
                      </div>

                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 shrink-0 ml-1">
                        {isNum ? '123' : isCenter ? 'Tag' : 'Text'}
                      </span>
                    </label>
                  )
                })}
              </div>

              {/* Modal Footer Controls */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowColModal(false)}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyColumns}
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 text-xs font-black text-white shadow-md hover:brightness-110 active:scale-95 transition"
                >
                  Apply Columns ({colDraft.size})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 6. ADVANCED PRODUCT SEARCH POPUP MODAL */}
        {showProductModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 no-print animate-in fade-in duration-200">
            <div className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-800 p-4 sm:p-5 shrink-0 bg-gradient-to-r from-slate-900 via-purple-950/20 to-slate-900">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-600/20 border border-purple-500/40 text-purple-300 text-xl shadow-inner">
                    🔍
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                      Search Products
                      <span className="rounded-full bg-purple-500/15 border border-purple-500/30 px-2.5 py-0.5 text-[10px] font-mono font-bold text-purple-300">
                        {modalFilteredProducts.length} Items Found
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Find by product code, barcode, title, brand or category, then click to filter
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition text-base cursor-pointer"
                  title="Close popup"
                >
                  ✕
                </button>
              </div>

              {/* Modal Search Bar & Category Chips */}
              <div className="p-4 border-b border-slate-800/80 bg-slate-950/50 space-y-3 shrink-0">
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-slate-400 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    autoFocus
                    placeholder="Type product name, SKU (PRD-...), barcode (8850...), brand or category..."
                    value={productModalQuery}
                    onChange={(e) => setProductModalQuery(e.target.value)}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-900 pl-10 pr-10 py-2.5 text-sm font-semibold text-white placeholder-slate-500 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition shadow-inner"
                  />
                  {productModalQuery && (
                    <button
                      type="button"
                      onClick={() => setProductModalQuery('')}
                      className="absolute right-3 p-1 text-slate-400 hover:text-white rounded-lg transition cursor-pointer"
                      title="Clear search query"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Category Filter Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin text-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
                    Categories:
                  </span>
                  {productModalCategories.map((cat) => {
                    const isAll = cat === 'all'
                    const isSelected = productModalCategory === cat
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setProductModalCategory(cat)}
                        className={`rounded-xl px-3 py-1 text-xs font-bold whitespace-nowrap transition-all active:scale-95 cursor-pointer ${
                          isSelected
                            ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 ring-1 ring-purple-400'
                            : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                        }`}
                      >
                        {isAll ? 'All Categories' : cat}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Modal Products List Table */}
              <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
                {modalFilteredProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                    <span className="text-4xl">🔍</span>
                    <h4 className="text-sm font-bold text-white">No products found</h4>
                    <p className="text-xs text-slate-400 max-w-sm">
                      We couldn&apos;t find any products matching &ldquo;{productModalQuery}&rdquo;. Try another SKU, barcode or keyword.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setProductModalQuery('')
                        setProductModalCategory('all')
                      }}
                      className="rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-1.5 text-xs font-bold text-purple-400 hover:bg-slate-700 hover:text-purple-300 transition cursor-pointer"
                    >
                      Reset Filter
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/40">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950/80 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-800 sticky top-0 backdrop-blur-sm z-10">
                        <tr>
                          <th className="py-2.5 px-3">SKU & Barcode</th>
                          <th className="py-2.5 px-3">Product Title</th>
                          <th className="py-2.5 px-3">Category / Brand</th>
                          <th className="py-2.5 px-3 text-center">UOM</th>
                          <th className="py-2.5 px-3 text-right">On Hand</th>
                          <th className="py-2.5 px-3 text-right">Price / Cost</th>
                          <th className="py-2.5 px-3 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-medium">
                        {modalFilteredProducts.map((p) => {
                          const pCode = p.code || `PRD-${p.id}`
                          const pTitle = p.title || p.name || 'Product'
                          const isCurrentlyActive = productFilter.trim() && (
                            productFilter.toLowerCase() === pTitle.toLowerCase() ||
                            productFilter.toLowerCase() === pCode.toLowerCase() ||
                            pTitle.toLowerCase().includes(productFilter.toLowerCase())
                          )

                          return (
                            <tr
                              key={p.id || pCode}
                              onClick={() => handleSelectProduct(p)}
                              className={`group cursor-pointer transition-colors ${
                                isCurrentlyActive
                                  ? 'bg-purple-600/20 text-white'
                                  : 'hover:bg-slate-800/50 text-slate-200'
                              }`}
                            >
                              <td className="py-2.5 px-3 whitespace-nowrap">
                                <div className="flex flex-col">
                                  <span className="font-mono font-bold text-purple-400 group-hover:text-purple-300">
                                    {pCode}
                                  </span>
                                  {p.barcode && (
                                    <span className="font-mono text-[10px] text-slate-500">
                                      {p.barcode}
                                    </span>
                                  )}
                                </div>
                              </td>

                              <td className="py-2.5 px-3">
                                <div className="font-bold text-white group-hover:text-purple-300 transition-colors">
                                  {pTitle}
                                </div>
                              </td>

                              <td className="py-2.5 px-3 whitespace-nowrap">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  {p.category && (
                                    <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-300 border border-slate-700">
                                      {p.category}
                                    </span>
                                  )}
                                  {p.brand && (
                                    <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-300 border border-indigo-500/20">
                                      {p.brand}
                                    </span>
                                  )}
                                </div>
                              </td>

                              <td className="py-2.5 px-3 text-center whitespace-nowrap">
                                <span className="rounded-md bg-slate-800/60 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
                                  {p.uom || 'Unit'}
                                </span>
                              </td>

                              <td className="py-2.5 px-3 text-right whitespace-nowrap font-mono font-bold">
                                <span className={Number(p.onHand ?? 0) > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                                  {Number(p.onHand ?? 0)}
                                </span>
                              </td>

                              <td className="py-2.5 px-3 text-right whitespace-nowrap font-mono text-xs">
                                <div>
                                  <span className="font-bold text-emerald-400">
                                    ${Number(p.sellingPrice != null ? p.sellingPrice : 0).toFixed(2)}
                                  </span>
                                  {p.costPrice != null && (
                                    <div className="text-[10px] text-slate-500">
                                      Cost: ${Number(p.costPrice).toFixed(2)}
                                    </div>
                                  )}
                                </div>
                              </td>

                              <td className="py-2.5 px-3 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                <button
                                  type="button"
                                  onClick={() => handleSelectProduct(p)}
                                  className={`rounded-xl px-3 py-1 text-xs font-bold transition shadow-xs active:scale-95 cursor-pointer ${
                                    isCurrentlyActive
                                      ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                                      : 'bg-purple-600/30 border border-purple-500/50 text-purple-200 hover:bg-purple-600 hover:text-white'
                                  }`}
                                >
                                  {isCurrentlyActive ? '✓ Selected' : 'Select'}
                                </button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between border-t border-slate-800 p-4 shrink-0 bg-slate-950/60">
                <div className="flex items-center gap-2">
                  {productFilter && (
                    <button
                      type="button"
                      onClick={() => {
                        setProductFilter('')
                        setShowProductModal(false)
                        showNotification?.({
                          type: 'info',
                          title: 'Product Filter Cleared',
                          message: 'Now showing all products.',
                        })
                      }}
                      className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-300 hover:bg-rose-500/20 transition active:scale-95 cursor-pointer"
                    >
                      ✕ Clear Current Product Filter
                    </button>
                  )}
                  <span className="text-xs text-slate-500 hidden sm:inline">
                    Tip: Click any row to quickly select that product
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-1.5 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition active:scale-95 cursor-pointer"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    )
  }

  // ==========================================
  // VIEW 2: MODULE SUB-REPORTS HUB (Any of the 7 modules)
  // Route: /admin/report/:moduleKey
  // ==========================================
  if (isModuleHub && currentModuleHub) {
    const hubItems = currentModuleSubReports
    const filteredHub = hubItems.filter((item) => {
      if (!searchSubHub.trim()) return true
      const q = searchSubHub.toLowerCase().trim()
      return (
        item.en.toLowerCase().includes(q) ||
        item.kh.toLowerCase().includes(q) ||
        item.descEn.toLowerCase().includes(q) ||
        item.descKh.toLowerCase().includes(q)
      )
    })

    return (
      <div className="space-y-6 text-slate-100 font-['Montserrat']">
        {/* Banner */}
        <section
          className="relative overflow-hidden rounded-3xl border p-5 sm:p-7 shadow-2xl"
          style={{
            borderColor: `${currentModuleHub.color}30`,
            background: `linear-gradient(135deg, ${currentModuleHub.color}15 0%, #0f172a 60%, #080c14 100%)`,
            boxShadow: `0 20px 40px -15px ${currentModuleHub.color}20`,
          }}
        >
          <div
            className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full blur-3xl opacity-20"
            style={{ background: currentModuleHub.color }}
          />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <Link
                to="/admin/report"
                className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-950/60 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] transition hover:text-white active:scale-95"
                style={{ color: currentModuleHub.color }}
              >
                <ChevronLeftIcon /> {lang === 'en' ? 'Reports Hub' : 'មជ្ឈមណ្ឌលរបាយការណ៍'}
              </Link>

              <div className="flex items-center gap-3.5">
                <span
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ring-1 shadow-lg"
                  style={{
                    background: currentModuleHub.bg,
                    borderColor: `${currentModuleHub.color}40`,
                  }}
                >
                  <img src={currentModuleHub.icon} alt="" className="h-9 w-9 object-contain drop-shadow-md" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[11px] font-black uppercase tracking-[0.25em]" style={{ color: currentModuleHub.color }}>
                      {lang === 'en' ? `${currentModuleHub.en} Intelligence` : currentModuleHub.kh}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.2 rounded-full">
                      ● Live Data
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    {lang === 'en' ? `${currentModuleHub.en} Reports` : currentModuleHub.kh}
                  </h1>
                </div>
              </div>

              <p className="max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-300">
                {lang === 'kh' ? currentModuleHub.descKh : currentModuleHub.descEn}
              </p>
            </div>

            {/* Hub Quick Stats */}
            <div className="grid grid-cols-2 gap-3 shrink-0 min-w-[220px]">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3.5 shadow-md">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{lang === 'en' ? 'Sub-Reports' : 'របាយការណ៍'}</span>
                  <span className="font-bold" style={{ color: currentModuleHub.color }}>
                    {hubItems.length} Live
                  </span>
                </div>
                <p className="mt-1 font-mono text-2xl font-black text-white">{hubItems.length}</p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3.5 shadow-md">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{lang === 'en' ? 'Database' : 'មូលដ្ឋានទិន្នន័យ'}</span>
                  <span className="text-emerald-400 font-bold">● Active</span>
                </div>
                <p className="mt-1 font-mono text-xs font-semibold text-slate-300">PostgreSQL</p>
              </div>
            </div>
          </div>

          {/* Quick Pill Jump Bar */}
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              {lang === 'en'
                ? `Quick ${currentModuleHub.en} Sub-Reports (${hubItems.length}):`
                : `របាយការណ៍ឯកទេស (${hubItems.length})៖`}
            </p>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {hubItems.map((sr) => (
                <Link
                  key={sr.key}
                  to={sr.route}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap bg-slate-950/60 text-slate-300 border border-slate-800 hover:border-slate-600 hover:text-white hover:bg-slate-800/50 transition-all"
                  style={{
                    borderColor: `${sr.color}30`,
                  }}
                >
                  <img src={sr.icon} alt="" className="h-4 w-4 object-contain" />
                  <span>{lang === 'kh' ? sr.kh : sr.en}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Search Bar for Current Hub */}
        <div className="flex items-center justify-between rounded-2xl border border-slate-800/80 bg-[#1e293b]/70 backdrop-blur-md p-3.5 shadow-lg">
          <div className="relative flex-1 max-w-md">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
              🔍
            </span>
            <input
              type="text"
              value={searchSubHub}
              onChange={(e) => setSearchSubHub(e.target.value)}
              placeholder={
                lang === 'en'
                  ? `Search ${hubItems.length} ${currentModuleHub.en} reports...`
                  : `ស្វែងរករបាយការណ៍ទាំង ${hubItems.length}...`
              }
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/90 py-2 pl-9 pr-8 text-xs font-semibold text-white placeholder-slate-500 outline-none transition focus:ring-2"
              style={{
                borderColor: `${currentModuleHub.color}40`,
              }}
            />
            {searchSubHub && (
              <button
                type="button"
                onClick={() => setSearchSubHub('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          <div className="text-xs font-mono text-slate-400 hidden sm:block">
            {filteredHub.length} / {hubItems.length} {currentModuleHub.en} Reports
          </div>
        </div>

        {/* Sub-Reports Cards Grid */}
        <section className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredHub.map((item) => (
              <HubItemCard key={item.key} item={item} lang={lang} />
            ))}
          </div>
        </section>
      </div>
    )
  }

  // ==========================================
  // VIEW 3: MAIN REPORTS HUB (THE 7 CORE MODULES)
  // Route: /admin/report
  // ==========================================
  const filteredMainHub = REPORT_MODULES.filter((item) => {
    if (!searchMain.trim()) return true
    const q = searchMain.toLowerCase().trim()
    return (
      item.en.toLowerCase().includes(q) ||
      item.kh.toLowerCase().includes(q) ||
      item.descEn.toLowerCase().includes(q) ||
      item.descKh.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-6 text-slate-100 font-['Montserrat']">
      {/* Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-[#1e1b4b] via-[#0f172a] to-[#0b0f17] p-5 sm:p-7 shadow-2xl shadow-indigo-500/10">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-indigo-500/15 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/60 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-indigo-300 shadow-sm">
              <span>📊</span>
              <span>{lang === 'en' ? 'Intelligence Center' : 'មជ្ឈមណ្ឌលរបាយការណ៍'}</span>
            </div>

            <div className="flex items-center gap-3.5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/15 p-2 ring-1 ring-indigo-500/30 shadow-lg shadow-indigo-500/20">
                <img src={chartIcon} alt="" className="h-9 w-9 object-contain drop-shadow-md" />
              </span>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-indigo-400">
                  {lang === 'en' ? 'Enterprise Analytics & Export' : 'ការវិភាគ និងការនាំចេញទិន្នន័យ'}
                </p>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {lang === 'en' ? 'Report Hub' : 'របាយការណ៍'}
                </h1>
              </div>
            </div>

            <p className="max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-300">
              {lang === 'en'
                ? "Unified business reporting center for B'Groceries: Stock control, sale payments, order fulfillment, consignments, purchase procurement, payable management, and cash treasury."
                : 'មជ្ឈមណ្ឌលរបាយការណ៍អាជីវកម្មរួម៖ ការគ្រប់គ្រងស្តុក ការទូទាត់លក់ ការបញ្ជាទិញ ការលក់បញ្ញើ ការទិញទំនិញ បំណុល និងសៀវភៅលុយ។'}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 shrink-0 min-w-[300px]">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3.5 shadow-md">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{lang === 'en' ? 'Core Hubs' : 'ម៉ូឌុល'}</span>
                <span className="text-indigo-400 font-bold">7 Hubs</span>
              </div>
              <p className="mt-1 font-mono text-2xl font-black text-white">7</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3.5 shadow-md">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{lang === 'en' ? 'Sub-Reports' : 'របាយការណ៍'}</span>
                <span className="text-blue-400 font-bold">44 Reports</span>
              </div>
              <p className="mt-1 font-mono text-2xl font-black text-blue-400">44</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3.5 shadow-md">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{lang === 'en' ? 'Database' : 'មូលដ្ឋានទិន្នន័យ'}</span>
                <span className="text-emerald-400 font-bold">● Active</span>
              </div>
              <p className="mt-1 font-mono text-xs font-semibold text-slate-300">PostgreSQL</p>
            </div>
          </div>
        </div>

        {/* 7 Modules Quick Navigation Pills */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            {lang === 'en' ? 'Core Report Modules (7):' : 'របាយការណ៍ស្នូលទាំង ៧៖'}
          </p>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {REPORT_MODULES.map((m) => (
              <Link
                key={m.key}
                to={m.route}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap bg-slate-950/60 text-slate-300 border border-slate-800 hover:border-indigo-400 hover:text-white hover:bg-slate-800/50 transition-all"
              >
                <img src={m.icon} alt="" className="h-4 w-4 object-contain" />
                <span>{lang === 'kh' ? m.kh : m.en}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Search Bar for Main Hub */}
      <div className="flex items-center justify-between rounded-2xl border border-slate-800/80 bg-[#1e293b]/70 backdrop-blur-md p-3.5 shadow-lg">
        <div className="relative flex-1 max-w-md">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
            🔍
          </span>
          <input
            type="text"
            value={searchMain}
            onChange={(e) => setSearchMain(e.target.value)}
            placeholder={lang === 'en' ? 'Search 7 report modules...' : 'ស្វែងរករបាយការណ៍ទាំង ៧...'}
            className="w-full rounded-xl border border-slate-700/80 bg-slate-950/90 py-2 pl-9 pr-8 text-xs font-semibold text-white placeholder-slate-500 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
          />
          {searchMain && (
            <button
              type="button"
              onClick={() => setSearchMain('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>

        <div className="text-xs font-mono text-slate-400 hidden sm:block">
          7 Core Report Hubs
        </div>
      </div>

      {/* 7 Modules Grid */}
      <section className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredMainHub.map((item) => (
            <HubItemCard key={item.key} item={item} lang={lang} />
          ))}
        </div>
      </section>
    </div>
  )
}
