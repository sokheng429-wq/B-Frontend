/**
 * Complete Catalogue of Privileges across 12 Business Modules
 * Each item contains module, category (Setup, Operation, Report), featureName (English), and secondLanguage (Khmer).
 */
export const ROLE_PRIVILEGES_DATA = [
  // ==========================================
  // 1. Stock
  // ==========================================
  { id: 'stock_brand', module: 'Stock', category: 'Setup', featureName: 'Brand', secondLanguage: 'ម៉ាកទំនិញ' },
  { id: 'stock_category', module: 'Stock', category: 'Setup', featureName: 'Category', secondLanguage: 'ប្រភេទមុខទំនិញ' },
  { id: 'stock_product', module: 'Stock', category: 'Setup', featureName: 'Product', secondLanguage: 'ផលិតផល / ទំនិញ' },
  { id: 'stock_product_group', module: 'Stock', category: 'Setup', featureName: 'Product-Group', secondLanguage: 'ក្រុមផលិតផល' },
  { id: 'stock_serial_info', module: 'Stock', category: 'Setup', featureName: 'Serial Information', secondLanguage: 'ព័ត៌មានលេខសម្គាល់ (Serial)' },
  { id: 'stock_cost', module: 'Stock', category: 'Setup', featureName: 'Stock Cost', secondLanguage: 'ថ្លៃដើមស្តុក' },
  { id: 'stock_price', module: 'Stock', category: 'Setup', featureName: 'Stock Price', secondLanguage: 'តម្លៃលក់ស្តុក' },
  { id: 'stock_supplier', module: 'Stock', category: 'Setup', featureName: 'Supplier', secondLanguage: 'អ្នកផ្គត់ផ្គង់' },
  { id: 'stock_supplier_group', module: 'Stock', category: 'Setup', featureName: 'Supplier-Group', secondLanguage: 'ក្រុមអ្នកផ្គត់ផ្គង់' },
  { id: 'stock_uom', module: 'Stock', category: 'Setup', featureName: 'Unit of Measure', secondLanguage: 'ខ្នាតរង្វាស់ (UOM)' },
  { id: 'stock_variant_attribute', module: 'Stock', category: 'Setup', featureName: 'Variant Attribute', secondLanguage: 'លក្ខណៈវ៉ារ្យ៉ង់' },

  // ==========================================
  // 2. Sale
  // ==========================================
  // Setup
  { id: 'sale_customer', module: 'Sale', category: 'Setup', featureName: 'Customer', secondLanguage: 'អតិថិជន' },
  { id: 'sale_customer_group', module: 'Sale', category: 'Setup', featureName: 'Customer -Group', secondLanguage: 'ក្រុមអតិថិជន' },
  { id: 'sale_payment_term', module: 'Sale', category: 'Setup', featureName: 'Payment-Term', secondLanguage: 'លក្ខខណ្ឌនៃការទូទាត់' },
  { id: 'sale_term_condition', module: 'Sale', category: 'Setup', featureName: 'Term Condition', secondLanguage: 'លក្ខខណ្ឌកិច្ចសន្យា' },
  // Operation
  { id: 'sale_aging_invoice', module: 'Sale', category: 'Operation', featureName: 'Aging Invoice', secondLanguage: 'វិក្កយបត្រតាមអាយុកាល' },
  { id: 'sale_ar_collection', module: 'Sale', category: 'Operation', featureName: 'AR Collection', secondLanguage: 'ការប្រមូលបំណុល (AR)' },
  { id: 'sale_ar_refund', module: 'Sale', category: 'Operation', featureName: 'AR Refund', secondLanguage: 'សងប្រាក់អតិថិជនវិញ' },
  { id: 'sale_change_salesperson', module: 'Sale', category: 'Operation', featureName: 'Change Sale Person', secondLanguage: 'ផ្លាស់ប្តូរបុគ្គលិកលក់' },
  { id: 'sale_discount_ar', module: 'Sale', category: 'Operation', featureName: 'Discount AR Collection', secondLanguage: 'បញ្ចុះតម្លៃការប្រមូលបំណុល' },
  { id: 'sale_discount_invoice', module: 'Sale', category: 'Operation', featureName: 'Discount Invoice', secondLanguage: 'បញ្ចុះតម្លៃលើវិក្កយបត្រ' },
  { id: 'sale_discount_items', module: 'Sale', category: 'Operation', featureName: 'Discount items', secondLanguage: 'បញ្ចុះតម្លៃមុខទំនិញ' },
  { id: 'sale_enter_deposit', module: 'Sale', category: 'Operation', featureName: 'Enter-Deposit', secondLanguage: 'បញ្ចូលប្រាក់កក់' },
  // Report
  { id: 'sale_ar_invoice_status', module: 'Sale', category: 'Report', featureName: 'AR Invoice Status', secondLanguage: 'ស្ថានភាពវិក្កយបត្រ AR' },
  { id: 'sale_cash_receipt', module: 'Sale', category: 'Report', featureName: 'Cash Receipt', secondLanguage: 'បង្កាន់ដៃទទួលប្រាក់' },
  { id: 'sale_close_shift', module: 'Sale', category: 'Report', featureName: 'Close Shift', secondLanguage: 'បិទវេនលក់' },
  { id: 'sale_customer_balance', module: 'Sale', category: 'Report', featureName: 'Customer Balance', secondLanguage: 'សមតុល្យគណនីអតិថិជន' },
  { id: 'sale_customer_credit_deposit', module: 'Sale', category: 'Report', featureName: 'Customer Credit/Deposit', secondLanguage: 'ឥណទាន និងប្រាក់កក់អតិថិជន' },
  { id: 'sale_daily_sale', module: 'Sale', category: 'Report', featureName: 'Daily Sale', secondLanguage: 'ការលក់ប្រចាំថ្ងៃ' },
  { id: 'sale_discount_report', module: 'Sale', category: 'Report', featureName: 'Discount Report', secondLanguage: 'របាយការណ៍បញ្ចុះតម្លៃ' },
  { id: 'sale_discount_trans_report', module: 'Sale', category: 'Report', featureName: 'Discount Transaction Report', secondLanguage: 'របាយការណ៍ប្រតិបត្តិការបញ្ចុះតម្លៃ' },
  { id: 'sale_eod', module: 'Sale', category: 'Report', featureName: 'End-of-Day', secondLanguage: 'សង្ខេបបិទបញ្ចប់ថ្ងៃ (EOD)' },
  { id: 'sale_return_invoice', module: 'Sale', category: 'Report', featureName: 'Return Invoice', secondLanguage: 'វិក្កយបត្របង្វិលសង' },
  { id: 'sale_history', module: 'Sale', category: 'Report', featureName: 'Sale History', secondLanguage: 'ប្រវត្តិនៃការលក់' },

  // ==========================================
  // 3. Setting
  // ==========================================
  // Setup
  { id: 'setting_approval_type', module: 'Setting', category: 'Setup', featureName: 'Approval-Type', secondLanguage: 'ប្រភេទការអនុម័ត' },
  { id: 'setting_company', module: 'Setting', category: 'Setup', featureName: 'Company', secondLanguage: 'ព័ត៌មានក្រុមហ៊ុន' },
  { id: 'setting_currency', module: 'Setting', category: 'Setup', featureName: 'Currency', secondLanguage: 'រូបិយប័ណ្ណ' },
  { id: 'setting_email', module: 'Setting', category: 'Setup', featureName: 'Email', secondLanguage: 'ការកំណត់អ៊ីមែល' },
  { id: 'setting_import_beginning', module: 'Setting', category: 'Setup', featureName: 'Import Beginning', secondLanguage: 'នាំចូលសមតុល្យដើមគ្រា' },
  { id: 'setting_location', module: 'Setting', category: 'Setup', featureName: 'Location', secondLanguage: 'ទីតាំងស្តុក' },
  { id: 'setting_outlet', module: 'Setting', category: 'Setup', featureName: 'Outlet', secondLanguage: 'សាខា និងច្រកលក់' },
  { id: 'setting_payment', module: 'Setting', category: 'Setup', featureName: 'Payment', secondLanguage: 'មធ្យោបាយទូទាត់' },
  { id: 'setting_preference', module: 'Setting', category: 'Setup', featureName: 'Preference', secondLanguage: 'ចំណូលចិត្តប្រព័ន្ធ' },
  { id: 'setting_price_book', module: 'Setting', category: 'Setup', featureName: 'Price Book', secondLanguage: 'សៀវភៅតម្លៃ' },
  { id: 'setting_role', module: 'Setting', category: 'Setup', featureName: 'Role', secondLanguage: 'តួនាទី និងសិទ្ធិ' },
  { id: 'setting_tax', module: 'Setting', category: 'Setup', featureName: 'Tax', secondLanguage: 'ពន្ធដារ (VAT)' },
  { id: 'setting_user', module: 'Setting', category: 'Setup', featureName: 'User', secondLanguage: 'អ្នកប្រើប្រាស់' },
  // Operation
  { id: 'setting_key_change', module: 'Setting', category: 'Operation', featureName: 'Key-Change', secondLanguage: 'ផ្លាស់ប្តូរលេខកូដសម្ងាត់' },

  // ==========================================
  // 4. Promotion
  // ==========================================
  { id: 'promo_promotion', module: 'Promotion', category: 'Setup', featureName: 'Promotion', secondLanguage: 'កម្មវិធីផ្សព្វផ្សាយ និងបញ្ចុះតម្លៃ' },

  // ==========================================
  // 5. Sale Order
  // ==========================================
  // Operation
  { id: 'so_consignment', module: 'Sale Order', category: 'Operation', featureName: 'Consignment', secondLanguage: 'ទំនិញផ្ញើលក់ (Consignment)' },
  { id: 'so_consignment_shipment', module: 'Sale Order', category: 'Operation', featureName: 'Consignment Shipment', secondLanguage: 'ដឹកជញ្ជូនទំនិញផ្ញើលក់' },
  { id: 'so_quotation', module: 'Sale Order', category: 'Operation', featureName: 'Quotation', secondLanguage: 'តារាងតម្លៃស្នើសុំ (Quotation)' },
  { id: 'so_return_consignment_shipment', module: 'Sale Order', category: 'Operation', featureName: 'Return Consignment Shipment', secondLanguage: 'បង្វិលទំនិញផ្ញើលក់' },
  { id: 'so_return_shipment', module: 'Sale Order', category: 'Operation', featureName: 'Return Shipment', secondLanguage: 'បង្វិលការដឹកជញ្ជូន' },
  { id: 'so_sale_order', module: 'Sale Order', category: 'Operation', featureName: 'Sale Order', secondLanguage: 'ការបញ្ជាទិញទំនិញ (Sale Order)' },
  { id: 'so_sale_order_history', module: 'Sale Order', category: 'Operation', featureName: 'Sale Order history', secondLanguage: 'ប្រវត្តិបញ្ជាទិញ' },
  { id: 'so_shipment', module: 'Sale Order', category: 'Operation', featureName: 'Shipment', secondLanguage: 'ការដឹកជញ្ជូនទំនិញ' },
  { id: 'so_web_order', module: 'Sale Order', category: 'Operation', featureName: 'WebOrder', secondLanguage: 'ការបញ្ជាទិញតាមអនឡាញ' },
  // Report
  { id: 'so_report_shipment', module: 'Sale Order', category: 'Report', featureName: 'sale Order Shipment', secondLanguage: 'របាយការណ៍ដឹកជញ្ជូន Sale Order' },
  { id: 'so_report_status', module: 'Sale Order', category: 'Report', featureName: 'Sale order Status', secondLanguage: 'ស្ថានភាពបញ្ជាលក់' },

  // ==========================================
  // 6. Employee
  // ==========================================
  { id: 'emp_department', module: 'Employee', category: 'Setup', featureName: 'Department', secondLanguage: 'នាយកដ្ឋាន' },
  { id: 'emp_employee', module: 'Employee', category: 'Setup', featureName: 'Employee', secondLanguage: 'បុគ្គលិក' },
  { id: 'emp_office', module: 'Employee', category: 'Setup', featureName: 'Office', secondLanguage: 'ការិយាល័យ' },
  { id: 'emp_position', module: 'Employee', category: 'Setup', featureName: 'Position', secondLanguage: 'តួនាទី / មុខតំណែង' },
  { id: 'emp_section', module: 'Employee', category: 'Setup', featureName: 'Section', secondLanguage: 'ផ្នែក' },

  // ==========================================
  // 7. Point Of Sale
  // ==========================================
  // Setup
  { id: 'pos_device_config', module: 'Point of Sale', category: 'Setup', featureName: 'Device Configuration (Android)', secondLanguage: 'កំណត់រចនាសម្ព័ន្ធឧបករណ៍ (Android)' },
  // Operation
  { id: 'pos_cancel_order', module: 'Point of Sale', category: 'Operation', featureName: 'Cancel Order', secondLanguage: 'បោះបង់ការបញ្ជាទិញ' },
  { id: 'pos_change_customer', module: 'Point of Sale', category: 'Operation', featureName: 'Change Customer', secondLanguage: 'ផ្លាស់ប្តូរអតិថិជន' },
  { id: 'pos_delete_item', module: 'Point of Sale', category: 'Operation', featureName: 'Delete item order', secondLanguage: 'លុបទំនិញពីការបញ្ជាទិញ' },
  { id: 'pos_discount_invoice', module: 'Point of Sale', category: 'Operation', featureName: 'Discount invoice', secondLanguage: 'បញ្ចុះតម្លៃលើវិក្កយបត្រ' },
  { id: 'pos_discount_item', module: 'Point of Sale', category: 'Operation', featureName: 'Discount Item', secondLanguage: 'បញ្ចុះតម្លៃទំនិញ POS' },
  { id: 'pos_edit_price', module: 'Point of Sale', category: 'Operation', featureName: 'Edit Price', secondLanguage: 'កែប្រែតម្លៃលក់ផ្ទាល់' },
  { id: 'pos_edit_qty_uom', module: 'Point of Sale', category: 'Operation', featureName: 'Edit QTY & UOM', secondLanguage: 'កែប្រែចំនួន និងខ្នាត' },
  { id: 'pos_load_pending', module: 'Point of Sale', category: 'Operation', featureName: 'Load Pending', secondLanguage: 'ផ្ទុកការបញ្ជាទិញដែលផ្អាក' },
  { id: 'pos_modify_product', module: 'Point of Sale', category: 'Operation', featureName: 'Modify Product', secondLanguage: 'កែប្រែព័ត៌មានទំនិញ' },
  { id: 'pos_open_drawer', module: 'Point of Sale', category: 'Operation', featureName: 'Open Cash Drawer', secondLanguage: 'បើកថតដាក់ប្រាក់' },
  { id: 'pos_quick_order', module: 'Point of Sale', category: 'Operation', featureName: 'Quick Order', secondLanguage: 'ការបញ្ជាទិញរហ័ស' },
  { id: 'pos_return_invoice', module: 'Point of Sale', category: 'Operation', featureName: 'Return invoice', secondLanguage: 'បង្វិលវិក្កយបត្រ POS' },
  { id: 'pos_save_pending', module: 'Point of Sale', category: 'Operation', featureName: 'save pending', secondLanguage: 'រក្សាទុកការបញ្ជាទិញផ្អាក' },
  { id: 'pos_shift_in', module: 'Point of Sale', category: 'Operation', featureName: 'Shift in', secondLanguage: 'ចាប់ផ្តើមវេន (Shift In)' },
  { id: 'pos_shift_out', module: 'Point of Sale', category: 'Operation', featureName: 'Shift out', secondLanguage: 'បញ្ចប់វេន (Shift Out)' },
  { id: 'pos_discount_limit', module: 'Point of Sale', category: 'Operation', featureName: 'User Discount Limit', secondLanguage: 'កម្រិតកំណត់បញ្ចុះតម្លៃ' },
  { id: 'pos_void_order', module: 'Point of Sale', category: 'Operation', featureName: 'Void order(After load Pending)', secondLanguage: 'លុបចោលការបញ្ជាទិញ (ក្រោយផ្ទុក)' },
  { id: 'pos_void_pending', module: 'Point of Sale', category: 'Operation', featureName: 'Void pending', secondLanguage: 'លុបចោលការផ្អាក' },
  // Report POS
  { id: 'pos_close_shift_summary', module: 'Point of Sale', category: 'Report POS', featureName: 'Close Shift Summary', secondLanguage: 'សង្ខេបការបិទវេនលក់' },
  { id: 'pos_print_close_shift', module: 'Point of Sale', category: 'Report POS', featureName: 'Print Close shift report', secondLanguage: 'បោះពុម្ពរបាយការណ៍បិទវេន' },
  { id: 'pos_print_eod', module: 'Point of Sale', category: 'Report POS', featureName: 'Print End of Days Report', secondLanguage: 'បោះពុម្ពរបាយការណ៍ចុងថ្ងៃ' },
  { id: 'pos_reprint_invoice', module: 'Point of Sale', category: 'Report POS', featureName: 'Reprint invoice', secondLanguage: 'បោះពុម្ពវិក្កយបត្រឡើងវិញ' },

  // ==========================================
  // 8. Base Menu
  // ==========================================
  // Setup
  { id: 'base_cashbook_dash', module: 'Base Menu', category: 'Setup', featureName: 'Cash Book Dashboard', secondLanguage: 'ផ្ទាំងសៀវភៅសាច់ប្រាក់' },
  { id: 'base_consignment', module: 'Base Menu', category: 'Setup', featureName: 'Consignment management', secondLanguage: 'គ្រប់គ្រងការផ្ញើលក់' },
  { id: 'base_dashboard', module: 'Base Menu', category: 'Setup', featureName: 'Dashboard', secondLanguage: 'ផ្ទាំងគ្រប់គ្រងទូទៅ' },
  { id: 'base_employee', module: 'Base Menu', category: 'Setup', featureName: 'Employee', secondLanguage: 'គ្រប់គ្រងបុគ្គលិក' },
  { id: 'base_integrate', module: 'Base Menu', category: 'Setup', featureName: 'Intergrate', secondLanguage: 'ការតភ្ជាប់ប្រព័ន្ធ' },
  { id: 'base_order_mgmt', module: 'Base Menu', category: 'Setup', featureName: 'Order Management', secondLanguage: 'គ្រប់គ្រងការបញ្ជាទិញ' },
  { id: 'base_payable', module: 'Base Menu', category: 'Setup', featureName: 'Payable', secondLanguage: 'គ្រប់គ្រងការទូទាត់សង' },
  { id: 'base_purchase_mgmt', module: 'Base Menu', category: 'Setup', featureName: 'Purchase Management', secondLanguage: 'គ្រប់គ្រងការទិញទំនិញ' },
  { id: 'base_sale_dash', module: 'Base Menu', category: 'Setup', featureName: 'Sale Dashboard', secondLanguage: 'ផ្ទាំងទិដ្ឋភាពការលក់' },
  { id: 'base_sale_payment', module: 'Base Menu', category: 'Setup', featureName: 'Sale Payment', secondLanguage: 'ការទូទាត់ការលក់' },
  { id: 'base_setting', module: 'Base Menu', category: 'Setup', featureName: 'Setting', secondLanguage: 'ការកំណត់ប្រព័ន្ធ' },
  { id: 'base_stock', module: 'Base Menu', category: 'Setup', featureName: 'Stock', secondLanguage: 'គ្រប់គ្រងស្តុកទំនិញ' },
  // Report
  { id: 'base_po_report_dash', module: 'Base Menu', category: 'Report', featureName: 'Purchase Order Report Dashboard', secondLanguage: 'ផ្ទាំងរបាយការណ៍បញ្ជាទិញ' },
  { id: 'base_so_report_dash', module: 'Base Menu', category: 'Report', featureName: 'Sale Order Report Dashboard', secondLanguage: 'ផ្ទាំងរបាយការណ៍បញ្ជាលក់' },

  // ==========================================
  // 9. Integration
  // ==========================================
  { id: 'int_api_key', module: 'Integration', category: 'Setup', featureName: 'API Key', secondLanguage: 'កូនសោ API (API Key)' },
  { id: 'int_communication', module: 'Integration', category: 'Setup', featureName: 'Communication', secondLanguage: 'ប្រព័ន្ធទំនាក់ទំនង' },
  { id: 'int_payment', module: 'Integration', category: 'Setup', featureName: 'Intergreate-Payment', secondLanguage: 'តភ្ជាប់ការទូទាត់' },
  { id: 'int_template', module: 'Integration', category: 'Setup', featureName: 'integreate-Template', secondLanguage: 'តភ្ជាប់ទម្រង់គំរូ' },
  { id: 'int_station_info', module: 'Integration', category: 'Setup', featureName: 'Station-info', secondLanguage: 'ព័ត៌មានស្ថានីយ' },
  { id: 'int_sync_notif', module: 'Integration', category: 'Setup', featureName: 'Sync-Notification', secondLanguage: 'ជូនដំណឹងសមកាលកម្ម' },

  // ==========================================
  // 10. Purchase Management
  // ==========================================
  // Setup
  { id: 'pm_pending_receipt', module: 'Purchase Management', category: 'Setup', featureName: 'Pending Receipt PO', secondLanguage: 'រង់ចាំទទួលទំនិញ PO' },
  { id: 'pm_product_supplier', module: 'Purchase Management', category: 'Setup', featureName: 'Product-Supplier', secondLanguage: 'ផលិតផល និងអ្នកផ្គត់ផ្គង់' },
  { id: 'pm_shipment_method', module: 'Purchase Management', category: 'Setup', featureName: 'Shipment-Method', secondLanguage: 'មធ្យោបាយដឹកជញ្ជូន' },
  { id: 'pm_shipment_tariff', module: 'Purchase Management', category: 'Setup', featureName: 'Shipment-Tariff', secondLanguage: 'ពន្ធនិងថ្លៃដឹកជញ្ជូន' },
  // Operation
  { id: 'pm_purchase_order', module: 'Purchase Management', category: 'Operation', featureName: 'Purchase-Order', secondLanguage: 'បញ្ជាទិញទំនិញ (PO)' },
  { id: 'pm_po_history', module: 'Purchase Management', category: 'Operation', featureName: 'Purchase Order history', secondLanguage: 'ប្រវត្តិបញ្ជាទិញ' },
  { id: 'pm_receive_po', module: 'Purchase Management', category: 'Operation', featureName: 'Receive-PO', secondLanguage: 'ទទួលទំនិញតាម PO' },
  { id: 'pm_requisition_po', module: 'Purchase Management', category: 'Operation', featureName: 'Requisition Purchase Order', secondLanguage: 'ស្នើសុំបញ្ជាទិញ (PR)' },
  { id: 'pm_return_po', module: 'Purchase Management', category: 'Operation', featureName: 'Return-PO', secondLanguage: 'បង្វិលទំនិញទៅអ្នកផ្គត់ផ្គង់' },
  // Report
  { id: 'pm_po_items_status', module: 'Purchase Management', category: 'Report', featureName: 'Purchase Order items Status', secondLanguage: 'ស្ថានភាពមុខទំនិញបញ្ជាទិញ' },
  { id: 'pm_po_status', module: 'Purchase Management', category: 'Report', featureName: 'Purchase Order Status', secondLanguage: 'ស្ថានភាពការបញ្ជាទិញ' },
  { id: 'pm_receive_return_po', module: 'Purchase Management', category: 'Report', featureName: 'Receive / Return Purchase Order', secondLanguage: 'របាយការណ៍ទទួល/បង្វិល PO' },
  { id: 'pm_requisition_report', module: 'Purchase Management', category: 'Report', featureName: 'Requisition Report', secondLanguage: 'របាយការណ៍ស្នើសុំបញ្ជាទិញ' },

  // ==========================================
  // 11. Payable Management
  // ==========================================
  // Operation
  { id: 'ap_bill_payment', module: 'Payable Management', category: 'Operation', featureName: 'Bill Payment', secondLanguage: 'ការទូទាត់វិក្កយបត្រ' },
  { id: 'ap_enter_bill', module: 'Payable Management', category: 'Operation', featureName: 'Enter Bill', secondLanguage: 'បញ្ចូលវិក្កយបត្រទិញ' },
  { id: 'ap_supplier_deposit', module: 'Payable Management', category: 'Operation', featureName: 'Supplier Deposit', secondLanguage: 'ប្រាក់កក់អ្នកផ្គត់ផ្គង់' },
  { id: 'ap_supplier_refund', module: 'Payable Management', category: 'Operation', featureName: 'Supplier Refund', secondLanguage: 'សំណងពីអ្នកផ្គត់ផ្គង់' },
  // Report
  { id: 'ap_aging', module: 'Payable Management', category: 'Report', featureName: 'Aging', secondLanguage: 'របាយការណ៍បំណុលតាមអាយុកាល' },
  { id: 'ap_cash_payment', module: 'Payable Management', category: 'Report', featureName: 'AP Cash Payment', secondLanguage: 'ការទូទាត់សាច់ប្រាក់ AP' },
  { id: 'ap_bill_payment_report', module: 'Payable Management', category: 'Report', featureName: 'Bill Payment', secondLanguage: 'របាយការណ៍ទូទាត់វិក្កយបត្រ' },
  { id: 'ap_bill_status', module: 'Payable Management', category: 'Report', featureName: 'Bill Status', secondLanguage: 'ស្ថានភាពវិក្កយបត្រ' },
  { id: 'ap_freight_status', module: 'Payable Management', category: 'Report', featureName: 'Freight Status', secondLanguage: 'ស្ថានភាពថ្លៃដឹកជញ្ជូន' },
  { id: 'ap_supplier_deposit_debit', module: 'Payable Management', category: 'Report', featureName: 'Supplier Deposit / Debit', secondLanguage: 'ប្រាក់កក់/ឥណពន្ធអ្នកផ្គត់ផ្គង់' },
  { id: 'ap_supplier_list', module: 'Payable Management', category: 'Report', featureName: 'Supplier List', secondLanguage: 'បញ្ជីអ្នកផ្គត់ផ្គង់' },

  // ==========================================
  // 12. Cash Book
  // ==========================================
  // Setup
  { id: 'cb_bank_account', module: 'Cash Book', category: 'Setup', featureName: 'Bank Account', secondLanguage: 'គណនីធនាគារ' },
  { id: 'cb_cashbook', module: 'Cash Book', category: 'Setup', featureName: 'CashBook', secondLanguage: 'សៀវភៅសាច់ប្រាក់' },
  { id: 'cb_cash_category', module: 'Cash Book', category: 'Setup', featureName: 'Cash category', secondLanguage: 'ប្រភេទសាច់ប្រាក់' },
  // Operation
  { id: 'cb_bank_deposit', module: 'Cash Book', category: 'Operation', featureName: 'Bank Deposit', secondLanguage: 'ដាក់ប្រាក់ចូលធនាគារ' },
  { id: 'cb_bank_transfer', module: 'Cash Book', category: 'Operation', featureName: 'Bank Transfer', secondLanguage: 'ផ្ទេរប្រាក់រវាងធនាគារ' },
  { id: 'cb_cash_in_out', module: 'Cash Book', category: 'Operation', featureName: 'Cash in / Cash Out', secondLanguage: 'ប្រាក់ចូល / ប្រាក់ចេញ' },
  // Report
  { id: 'cb_cash_statement', module: 'Cash Book', category: 'Report', featureName: 'Cash Statment', secondLanguage: 'របាយការណ៍ចលនាសាច់ប្រាក់' },
  { id: 'cb_cash_status', module: 'Cash Book', category: 'Report', featureName: 'Cash Status', secondLanguage: 'ស្ថានភាពសាច់ប្រាក់' },
]

export const MODULE_LIST = [
  'All Modules',
  'Stock',
  'Sale',
  'Setting',
  'Promotion',
  'Sale Order',
  'Employee',
  'Point of Sale',
  'Base Menu',
  'Integration',
  'Purchase Management',
  'Payable Management',
  'Cash Book',
]

export const MODULE_GROUPS = [
  {
    module: 'Stock',
    icon: '📦',
    categories: [
      { name: 'Setup', label: 'Stock - Setup', khLabel: 'ការរៀបចំស្តុក' },
    ],
  },
  {
    module: 'Sale',
    icon: '🛒',
    categories: [
      { name: 'Setup', label: 'Sale - Setup', khLabel: 'ការរៀបចំការលក់' },
      { name: 'Operation', label: 'Sale - Operation', khLabel: 'ប្រតិបត្តិការលក់' },
      { name: 'Report', label: 'Sale - Report', khLabel: 'របាយការណ៍លក់' },
    ],
  },
  {
    module: 'Setting',
    icon: '⚙️',
    categories: [
      { name: 'Setup', label: 'Setting - Setup', khLabel: 'ការរៀបចំប្រព័ន្ធ' },
      { name: 'Operation', label: 'Setting - Operation', khLabel: 'ប្រតិបត្តិការប្រព័ន្ធ' },
    ],
  },
  {
    module: 'Promotion',
    icon: '🎁',
    categories: [
      { name: 'Setup', label: 'Promotion - Setup', khLabel: 'កម្មវិធីប្រូម៉ូសិន' },
    ],
  },
  {
    module: 'Sale Order',
    icon: '📋',
    categories: [
      { name: 'Operation', label: 'Sale Order - Operation', khLabel: 'ប្រតិបត្តិការបញ្ជាលក់' },
      { name: 'Report', label: 'Sale Order - Report', khLabel: 'របាយការណ៍បញ្ជាលក់' },
    ],
  },
  {
    module: 'Employee',
    icon: '👥',
    categories: [
      { name: 'Setup', label: 'Employee - Setup', khLabel: 'ការរៀបចំបុគ្គលិក' },
    ],
  },
  {
    module: 'Point of Sale',
    icon: '💻',
    categories: [
      { name: 'Setup', label: 'Point of Sale - Setup', khLabel: 'ការរៀបចំម៉ាស៊ីន POS' },
      { name: 'Operation', label: 'Point of Sale - Operation', khLabel: 'ប្រតិបត្តិការ POS' },
      { name: 'Report POS', label: 'Point of Sale - Report POS', khLabel: 'របាយការណ៍ POS' },
    ],
  },
  {
    module: 'Base Menu',
    icon: '📑',
    categories: [
      { name: 'Setup', label: 'Base Menu - Setup', khLabel: 'មឺនុយគោល' },
      { name: 'Report', label: 'Base Menu - Report', khLabel: 'របាយការណ៍មឺនុយគោល' },
    ],
  },
  {
    module: 'Integration',
    icon: '🔌',
    categories: [
      { name: 'Setup', label: 'Integration - Setup', khLabel: 'ការតភ្ជាប់ប្រព័ន្ធ' },
    ],
  },
  {
    module: 'Purchase Management',
    icon: '🚚',
    categories: [
      { name: 'Setup', label: 'Purchase Management - Setup', khLabel: 'ការរៀបចំការទិញ' },
      { name: 'Operation', label: 'Purchase Management - Operation', khLabel: 'ប្រតិបត្តិការទិញ' },
      { name: 'Report', label: 'Purchase Management - Report', khLabel: 'របាយការណ៍ទិញ' },
    ],
  },
  {
    module: 'Payable Management',
    icon: '💳',
    categories: [
      { name: 'Operation', label: 'Payable Management - Operation', khLabel: 'ប្រតិបត្តិការទូទាត់សង' },
      { name: 'Report', label: 'Payable Management - Report', khLabel: 'របាយការណ៍ទូទាត់សង' },
    ],
  },
  {
    module: 'Cash Book',
    icon: '💰',
    categories: [
      { name: 'Setup', label: 'Cash Book - Setup', khLabel: 'ការរៀបចំសៀវភៅសាច់ប្រាក់' },
      { name: 'Operation', label: 'Cash Book - Operation', khLabel: 'ប្រតិបត្តិការសាច់ប្រាក់' },
      { name: 'Report', label: 'Cash Book - Report', khLabel: 'របាយការណ៍សាច់ប្រាក់' },
    ],
  },
]

// Hierarchical permission tree (Level 1: Module -> Level 2: Section -> Level 3: Action)
export const HIERARCHICAL_PERMISSIONS_TREE = MODULE_GROUPS.map((mg) => ({
  module: mg.module,
  icon: mg.icon,
  secondLanguage: mg.categories[0]?.khLabel || mg.module,
  sections: mg.categories.map((cat) => ({
    name: cat.name,
    label: cat.label,
    secondLanguage: cat.khLabel,
    actions: ROLE_PRIVILEGES_DATA.filter(
      (item) => item.module === mg.module && item.category === cat.name
    ).map((item) => ({
      id: item.id,
      name: item.featureName,
      secondLanguage: item.secondLanguage,
      module: item.module,
      category: item.category,
    })),
  })),
}))
