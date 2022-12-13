import jwtDecode from "jwt-decode";
// component
import { Icon } from '@iconify/react';
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'หน้าหลัก',
    path: '/dashboard/app',
    icon: <Icon icon="ic:baseline-dashboard" width="30" height="30" />,
  },
  // {
  //   title: 'product',
  //   path: '/dashboard/products',
  //   icon: icon('ic_cart'),
  // },
  // {
  //   title: 'blog',
  //   path: '/dashboard/blog',
  //   icon: icon('ic_blog'),
  // },
  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: icon('ic_lock'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
];

try {
  const token = jwtDecode(localStorage.getItem('token'));
  if (token !== null) {
    for (let i = 0; i < token.level_list.length; i += 1) {
      if (token.level_list[i].level_id === "PMS_ADMIN") {
        navConfig.push(
          {
            title: 'จัดการผู้ใช้',
            path: '/dashboard/user',
            icon: <Icon icon="ic:baseline-person" width="30" height="30" />,
          },
          {
            title: 'จัดการโครงสร้างองค์กร',
            path: '/dashboard/<ยังไม่สร้าง>',
            icon: <Icon icon="ic:baseline-maps-home-work" width="30" height="30" />,
          },
        );
      }
    }
  }
}
catch (error) {
  console.error(error);
}

export default navConfig;
