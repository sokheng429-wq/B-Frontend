/**
 * Utility to determine whether a user or role has administrative / staff portal access.
 *
 * Any account with an assigned operational or administrative role
 * (e.g. ADMIN, SUPERADMIN, MANAGER, STORE, CASHIER, SALES, STORE MANAGER,
 *  INVENTORY AUDITOR, PURCHASING OFFICER, ROL-001, or any role assigned in User Management / Settings)
 * is authorized to access the Admin Dashboard (/admin).
 *
 * Only pure unauthenticated guests or public unprivileged e-commerce retail customers
 * (e.g., 'CUSTOMER', 'CLIENT', 'GUEST') are restricted to the public shop.
 */
export const isStaffOrAdminRole = (userOrRole) => {
  let target = userOrRole
  if (!target && typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('user')
      if (stored) {
        target = JSON.parse(stored)
      }
    } catch {}
  }
  if (!target) return false

  let rawRole = ''
  if (typeof target === 'string') {
    rawRole = target
  } else if (typeof target === 'object') {
    if (typeof target.role === 'string') {
      rawRole = target.role
    } else if (target.user && typeof target.user.role === 'string') {
      rawRole = target.user.role
    } else if (target.data?.user && typeof target.data.user.role === 'string') {
      rawRole = target.data.user.role
    } else if (Array.isArray(target.roles) && target.roles.length > 0) {
      const first = target.roles[0]
      rawRole = typeof first === 'string' ? first : first.name || first.role || ''
    } else if (typeof target.roleName === 'string') {
      rawRole = target.roleName
    }
  }

  // Fallback to localStorage if user object in state is incomplete
  if (!rawRole && typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('user')
      if (stored) {
        const parsed = JSON.parse(stored)
        rawRole =
          parsed?.role ||
          parsed?.user?.role ||
          parsed?.roleName ||
          (Array.isArray(parsed?.roles) ? parsed.roles[0]?.name || parsed.roles[0] : '') ||
          ''
      }
    } catch {
      // ignore parse errors
    }
  }

  if (!rawRole) return false

  const normalized = String(rawRole).trim().toUpperCase().replace(/^ROLE_/, '')
  if (!normalized) return false

  // Pure public retail customer roles that shop online and don't manage the store
  const EXCLUDED_ROLES = ['CUSTOMER', 'CLIENT', 'GUEST', 'USER']
  if (EXCLUDED_ROLES.includes(normalized)) {
    return false
  }

  // Any user assigned a role by the administrator (ADMIN, MANAGER, CASHIER, SALES,
  // STORE MANAGER, INVENTORY AUDITOR, PURCHASING OFFICER, ROL-XXX, etc.) has access!
  return true
}

/**
 * Extract normalized role name/code string from user object or string
 */
export const getUserRole = (userOrRole) => {
  let target = userOrRole
  if (!target && typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('user')
      if (stored) target = JSON.parse(stored)
    } catch {}
  }
  if (!target) return ''
  if (typeof target === 'string') return target.trim()

  let raw = ''
  if (typeof target.role === 'string') {
    raw = target.role
  } else if (target.user && typeof target.user.role === 'string') {
    raw = target.user.role
  } else if (target.data?.user && typeof target.data.user.role === 'string') {
    raw = target.data.user.role
  } else if (Array.isArray(target.roles) && target.roles.length > 0) {
    const f = target.roles[0]
    raw = typeof f === 'string' ? f : f.name || f.role || ''
  } else if (typeof target.roleName === 'string') {
    raw = target.roleName
  }

  if (!raw && typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('user')
      if (stored) {
        const parsed = JSON.parse(stored)
        raw = parsed?.role || parsed?.user?.role || parsed?.roleName || ''
      }
    } catch {
      // ignore
    }
  }

  return raw ? raw.trim() : ''
}

/**
 * Check if the user/role has super administrative / full-system access.
 */
export const isFullAccessAdmin = (userOrRole) => {
  const role = getUserRole(userOrRole).toUpperCase().replace(/^ROLE_/, '')
  return (
    role === 'ADMIN' ||
    role === 'SUPERADMIN' ||
    role === 'SUPER_ADMIN' ||
    role === 'SUPER ADMINISTRATOR' ||
    role === 'ROL-001'
  )
}

/**
 * Get display badge styling, icon, and formatted title for any role
 */
export const getRoleDisplayDetails = (userOrRole) => {
  const rawRole = getUserRole(userOrRole)
  const norm = rawRole.toUpperCase().replace(/^ROLE_/, '')

  if (!norm) {
    return {
      title: 'Staff Member',
      icon: '👤',
      badgeClass: 'bg-slate-500/10 text-slate-400 border-slate-700/50',
    }
  }

  if (isFullAccessAdmin(userOrRole)) {
    return {
      title: rawRole || 'Super Administrator',
      icon: '🛡️',
      badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-purple-500/10',
    }
  }

  if (norm.includes('STORE') || norm.includes('MANAGER') || norm === 'ROL-002') {
    return {
      title: rawRole || 'Store Manager',
      icon: '🏪',
      badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-blue-500/10',
    }
  }

  if (norm.includes('CASHIER') || norm === 'ROL-003') {
    return {
      title: rawRole || 'Cashier',
      icon: '💵',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-emerald-500/10',
    }
  }

  if (norm.includes('AUDITOR') || norm.includes('INVENTORY') || norm === 'ROL-004') {
    return {
      title: rawRole || 'Inventory Auditor',
      icon: '📦',
      badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-amber-500/10',
    }
  }

  if (norm.includes('PURCHAS') || norm === 'ROL-005') {
    return {
      title: rawRole || 'Purchasing Officer',
      icon: '🚚',
      badgeClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-indigo-500/10',
    }
  }

  if (norm.includes('SALE')) {
    return {
      title: rawRole || 'Sales Representative',
      icon: '💼',
      badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-cyan-500/10',
    }
  }

  return {
    title: rawRole,
    icon: '🔑',
    badgeClass: 'bg-teal-500/20 text-teal-300 border-teal-500/40 shadow-teal-500/10',
  }
}

/**
 * Standard 12 Business Modules
 */
export const RBAC_MODULES = [
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

/**
 * Default permission matrix for known standard roles (matches backend seeders)
 */
export const DEFAULT_ROLE_PERMISSIONS = {
  // 1. Super Administrator (Full Access to all 12 modules)
  SUPERADMIN: {
    Stock: 'MODIFY',
    Sale: 'MODIFY',
    Setting: 'MODIFY',
    Promotion: 'MODIFY',
    'Sale Order': 'MODIFY',
    Employee: 'MODIFY',
    'Point of Sale': 'MODIFY',
    'Base Menu': 'MODIFY',
    Integration: 'MODIFY',
    'Purchase Management': 'MODIFY',
    'Payable Management': 'MODIFY',
    'Cash Book': 'MODIFY',
  },

  // 2. Store Manager
  STORE_MANAGER: {
    Stock: 'MODIFY',
    Sale: 'MODIFY',
    'Point of Sale': 'MODIFY',
    'Sale Order': 'MODIFY',
    Promotion: 'MODIFY',
    'Base Menu': 'MODIFY',
    Setting: 'READ',
    Employee: 'READ',
    'Cash Book': 'READ',
    'Purchase Management': 'READ',
    'Payable Management': 'NO_ACCESS',
    Integration: 'NO_ACCESS',
  },

  // 3. Cashier (POS, Cash Book, Sales, Stock view)
  CASHIER: {
    'Point of Sale': 'MODIFY',
    'Cash Book': 'MODIFY',
    Sale: 'READ',
    Stock: 'READ',
    'Base Menu': 'READ',
    Promotion: 'READ',
    'Sale Order': 'READ',
    Setting: 'NO_ACCESS',
    Employee: 'NO_ACCESS',
    'Purchase Management': 'NO_ACCESS',
    'Payable Management': 'NO_ACCESS',
    Integration: 'NO_ACCESS',
  },

  // 4. Inventory Auditor (Stock, Purchase, Orders)
  INVENTORY_AUDITOR: {
    Stock: 'MODIFY',
    'Purchase Management': 'MODIFY',
    'Sale Order': 'READ',
    'Base Menu': 'READ',
    Setting: 'NO_ACCESS',
    Sale: 'NO_ACCESS',
    'Point of Sale': 'NO_ACCESS',
    Employee: 'NO_ACCESS',
    'Cash Book': 'NO_ACCESS',
    'Payable Management': 'NO_ACCESS',
    Integration: 'NO_ACCESS',
    Promotion: 'NO_ACCESS',
  },

  // 5. Purchasing Officer (Purchase, Payables, Stock view)
  PURCHASING_OFFICER: {
    'Purchase Management': 'MODIFY',
    'Payable Management': 'MODIFY',
    Stock: 'READ',
    'Cash Book': 'READ',
    'Base Menu': 'READ',
    Setting: 'NO_ACCESS',
    Sale: 'NO_ACCESS',
    'Point of Sale': 'NO_ACCESS',
    Employee: 'NO_ACCESS',
    'Sale Order': 'NO_ACCESS',
    Integration: 'NO_ACCESS',
    Promotion: 'NO_ACCESS',
  },

  // 6. Sales Representative
  SALES: {
    Sale: 'MODIFY',
    'Point of Sale': 'MODIFY',
    'Sale Order': 'MODIFY',
    Promotion: 'READ',
    Stock: 'READ',
    'Base Menu': 'READ',
    Setting: 'NO_ACCESS',
    Employee: 'NO_ACCESS',
    'Cash Book': 'NO_ACCESS',
    'Purchase Management': 'NO_ACCESS',
    'Payable Management': 'NO_ACCESS',
    Integration: 'NO_ACCESS',
  },
}

/**
 * Resolve effective permissions for all 12 modules for a user and role list
 */
export const resolveModulePermissions = (user, rolesList = []) => {
  // 1. Super Admin or Full Access gets MODIFY everywhere
  if (isFullAccessAdmin(user)) {
    const full = {}
    RBAC_MODULES.forEach((m) => {
      full[m] = 'MODIFY'
    })
    return full
  }

  const rawRole = getUserRole(user)
  const norm = rawRole.toUpperCase().replace(/^ROLE_/, '').trim()

  // 2. Check if a live or cached role object matches by code or description
  const matchedRole = rolesList.find((r) => {
    if (!r) return false
    const rCode = String(r.code || '').toUpperCase().trim()
    const rDesc = String(r.description || '').toUpperCase().trim()
    return rCode === norm || rDesc === norm || norm.includes(rCode) || norm.includes(rDesc)
  })

  const permissions = {}
  RBAC_MODULES.forEach((m) => {
    permissions[m] = 'NO_ACCESS'
  })

  if (matchedRole) {
    // If role has explicit privileges array
    if (Array.isArray(matchedRole.privileges) && matchedRole.privileges.length > 0) {
      matchedRole.privileges.forEach((p) => {
        const mod = p.module
        const lvl = p.accessLevel
        if (permissions[mod] !== undefined) {
          if (lvl === 'MODIFY') {
            permissions[mod] = 'MODIFY'
          } else if (lvl === 'READ' && permissions[mod] !== 'MODIFY') {
            permissions[mod] = 'READ'
          }
        }
      })
      return permissions
    }

    // If role has privilegesJson
    if (matchedRole.privilegesJson) {
      try {
        const parsed = JSON.parse(matchedRole.privilegesJson)
        if (typeof parsed === 'object') {
          Object.entries(parsed).forEach(([modOrAction, lvl]) => {
            // Check if key directly matches a module
            if (permissions[modOrAction] !== undefined) {
              if (lvl === 'MODIFY' || lvl === true) permissions[modOrAction] = 'MODIFY'
              else if (lvl === 'READ') permissions[modOrAction] = 'READ'
            } else {
              // Try to map action ID (e.g. stock_brand -> Stock)
              const modMatch = RBAC_MODULES.find((m) =>
                modOrAction.toLowerCase().startsWith(m.toLowerCase().replace(/\s+/g, ''))
              )
              if (modMatch) {
                if (lvl === 'MODIFY') permissions[modMatch] = 'MODIFY'
                else if (lvl === 'READ' && permissions[modMatch] !== 'MODIFY') permissions[modMatch] = 'READ'
              }
            }
          })
          return permissions
        }
      } catch {
        // ignore json parse error
      }
    }
  }

  // 3. Match against built-in default role profiles
  if (norm.includes('STORE') || norm.includes('MANAGER') || norm === 'ROL-002') {
    return { ...permissions, ...DEFAULT_ROLE_PERMISSIONS.STORE_MANAGER }
  }
  if (norm.includes('CASHIER') || norm === 'ROL-003') {
    return { ...permissions, ...DEFAULT_ROLE_PERMISSIONS.CASHIER }
  }
  if (norm.includes('AUDITOR') || norm.includes('INVENTORY') || norm === 'ROL-004') {
    return { ...permissions, ...DEFAULT_ROLE_PERMISSIONS.INVENTORY_AUDITOR }
  }
  if (norm.includes('PURCHAS') || norm === 'ROL-005') {
    return { ...permissions, ...DEFAULT_ROLE_PERMISSIONS.PURCHASING_OFFICER }
  }
  if (norm.includes('SALE')) {
    return { ...permissions, ...DEFAULT_ROLE_PERMISSIONS.SALES }
  }

  // 4. Default: If a role has been assigned, allow basic operational modules (Base Menu, Stock, Sale view)
  return {
    ...permissions,
    'Base Menu': 'READ',
    Stock: 'READ',
    Sale: 'READ',
    Promotion: 'READ',
  }
}

/**
 * Check if the user has access (READ or MODIFY) to a given module
 */
export const hasModuleAccess = (permissionsMap, moduleName) => {
  if (!permissionsMap) return true // fallback if uninitialized
  const lvl = permissionsMap[moduleName]
  return lvl === 'READ' || lvl === 'MODIFY'
}

/**
 * Check if user can modify/write to a given module
 */
export const canModifyModule = (permissionsMap, moduleName) => {
  if (!permissionsMap) return true
  return permissionsMap[moduleName] === 'MODIFY'
}
