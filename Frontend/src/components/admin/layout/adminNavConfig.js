import {
  LayoutDashboard,
  Package,
  List,
  PlusCircle,
  Tags,
  ShoppingCart,
  Users,
  Mail,
  BarChart3,
  Settings,
  Lock,
  ShieldCheck,
} from 'lucide-react'

export const adminNavGroups = [
  {
    label: 'Main',
    items: [
      { path: '/admin', name: 'Dashboard', icon: LayoutDashboard, dropdown: false },
      { path: '/admin/reports', name: 'Reports', icon: BarChart3, dropdown: false },
      { path: '/admin/orders', name: 'Orders', icon: ShoppingCart, dropdown: false },
      { path: '/admin/users', name: 'Users', icon: Users, dropdown: false },
      { path: '/admin/contacts', name: 'Contacts', icon: Mail, dropdown: false },
    ],
  },
  {
    label: 'Catalog',
    items: [
      {
        path: '#',
        name: 'Products',
        icon: Package,
        dropdown: true,
        dropdownItems: [
          { path: '/admin/products', name: 'All Products', icon: List },
          { path: '/admin/products/create', name: 'Create Product', icon: PlusCircle },
          { path: '/admin/categories', name: 'Categories', icon: Tags },
        ],
      },
    ],
  },
  {
    label: 'Settings',
    items: [
      {
        path: '#',
        name: 'Settings',
        icon: Settings,
        dropdown: true,
        dropdownItems: [
          { path: '/admin/settings', name: 'Security', icon: Lock },
          { path: '/admin/settings/roles', name: 'Role Management', icon: ShieldCheck },
        ],
      },
    ],
  },
]

const pageMetaMap = [
  { match: (p) => p === '/admin', title: 'Dashboard', crumbs: ['Admin', 'Dashboard'] },
  { match: (p) => p === '/admin/reports', title: 'Business Reports', crumbs: ['Admin', 'Reports'] },
  { match: (p) => p === '/admin/products', title: 'All Products', crumbs: ['Admin', 'Catalog', 'Products'] },
  { match: (p) => p === '/admin/products/create', title: 'Create Product', crumbs: ['Admin', 'Catalog', 'Create Product'] },
  { match: (p) => p.includes('/admin/products/') && p.includes('/edit'), title: 'Edit Product', crumbs: ['Admin', 'Catalog', 'Edit Product'] },
  { match: (p) => p === '/admin/categories', title: 'Categories', crumbs: ['Admin', 'Catalog', 'Categories'] },
  { match: (p) => p === '/admin/orders', title: 'Orders', crumbs: ['Admin', 'Orders'] },
  { match: (p) => p === '/admin/users', title: 'Store Users', crumbs: ['Admin', 'Users'] },
  { match: (p) => p === '/admin/contacts', title: 'Contacts', crumbs: ['Admin', 'Contacts'] },
  { match: (p) => p === '/admin/profile', title: 'Profile', crumbs: ['Admin', 'Profile'] },
  { match: (p) => p === '/admin/settings', title: 'Security Settings', crumbs: ['Admin', 'Settings', 'Security'] },
  { match: (p) => p === '/admin/settings/roles', title: 'Role Management', crumbs: ['Admin', 'Settings', 'Roles'] },
]

export const getAdminPageMeta = (pathname) => {
  const found = pageMetaMap.find((entry) => entry.match(pathname))
  return found || { title: 'Admin Panel', crumbs: ['Admin'] }
}
