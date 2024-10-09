// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  // {
  //   title: 'dashboard',
  //   path: '/dashboard/app',
  //   icon: getIcon('eva:pie-chart-2-fill'),
  // },

  {
    title: 'projects',
    path: '/dashboard/projects',
    icon: getIcon('si:projects-alt-fill'),
    permission: ['ALL'],
  },
  {
    title: 'enquiry',
    path: '/dashboard/enquiry',
    icon: getIcon('mdi:comment-question'),
    permission: ['ALL'],
  },
  {
    title: 'blogs',
    path: '/dashboard/blog',
    icon: getIcon('eva:file-text-fill'),
    permission: ['ALL'],
  },
  {
    title: 'news',
    path: '/dashboard/news',
    icon: getIcon('mdi:newspaper'),
    permission: ['ALL'],
  },
  {
    title: 'Categories',
    path: '/dashboard/category',
    icon: getIcon('bxs:category'),
    permission: ['ALL'],
  },
  {
    title: 'admins',
    path: '/dashboard/account',
    icon: getIcon('eos-icons:admin'),
    permission: ['ALL'],
  },
  // {
  //   title: 'employees',
  //   path: '/dashboard/employee',
  //   icon: getIcon('clarity:employee-solid'),
  //   permission: ['SUPER_ADMIN', 'ADMIN'],
  // },
  // {
  //   title: 'configurations',
  //   path: '/dashboard/configurations',
  //   icon: getIcon('eva:settings-2-fill'),
  //   permission: ['SUPER_ADMIN', 'ADMIN'],
  // },


  // {
  //   title: 'user',
  //   path: '/dashboard/user',
  //   icon: getIcon('eva:people-fill'),
  // },
  // {
  //   title: 'product',
  //   path: '/dashboard/products',
  //   icon: getIcon('eva:shopping-bag-fill'),
  // },
  // {
  //   title: 'blog',
  //   path: '/dashboard/blog',
  //   icon: getIcon('eva:file-text-fill'),
  // },
  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: getIcon('eva:lock-fill'),
  // },
  // {
  //   title: 'register',
  //   path: '/register',
  //   icon: getIcon('eva:person-add-fill'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: getIcon('eva:alert-triangle-fill'),
  // },
];

export default navConfig;
