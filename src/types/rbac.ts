/**
 * Role & Privilege Management (RBAC) Type Definitions
 */

export type PermissionLevel = 'NO_ACCESS' | 'READ' | 'MODIFY'

export interface PermissionAction {
  id: string
  name: string
  secondLanguage?: string
  module: string
  category: string
}

export interface PermissionSection {
  name: string
  label: string
  secondLanguage?: string
  actions: PermissionAction[]
}

export interface PermissionModule {
  module: string
  icon: string
  secondLanguage?: string
  sections: PermissionSection[]
}

export interface RoleItem {
  id?: number
  code: string
  description: string
  secondLanguage?: string
  numberOfUsers?: number
  createdBy?: string
  active: boolean
  privileges?: Array<{
    module: string
    category: string
    featureName: string
    secondLanguage?: string
    accessLevel: PermissionLevel
  }>
}

export interface RoleFormData {
  id: number | null
  code: string
  active: boolean
  description: string
  secondLanguage: string
  privileges: Record<string, PermissionLevel>
}

export type SearchByOption = 'Any' | 'Code' | 'Description' | 'Second Language'

export type SortDirection = 'asc' | 'desc'

export interface SortConfig {
  key: string
  direction: SortDirection
}

