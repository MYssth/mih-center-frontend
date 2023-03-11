import jwtDecode from "jwt-decode";
// component
import { Icon } from '@iconify/react';

// ----------------------------------------------------------------------

const navConfig = [
  {
    title: 'หน้าหลัก',
    path: '/dashboard/app',
    icon: <Icon icon="ic:baseline-dashboard" width="30" height="30" />,
  },
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
            path: '/dashboard/rolemgr',
            icon: <Icon icon="ic:baseline-maps-home-work" width="30" height="30" />,
          },
          {
            title: 'ตั้งค่าเว็บไซต์',
            path: '/dashboard/sitesetting',
            icon: <Icon icon="dashicons:admin-site-alt3" width="30" height="30" />,
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
