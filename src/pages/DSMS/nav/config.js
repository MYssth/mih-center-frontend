import jwtDecode from "jwt-decode";
// component
import { Icon } from '@iconify/react';

// ----------------------------------------------------------------------

const navConfig = [
  {
    title: 'หน้าหลักระบบจองเวรแพทย์',
    path: '/dsms/app',
    icon: <Icon icon="ic:baseline-dashboard" width="30" height="30" />,
  },
];

try {

  // let havePermitTask = 0;

  const token = jwtDecode(localStorage.getItem('token'));
  if (token !== null) {
    for (let i = 0; i < token.level_list.length; i += 1) {
      if (token.level_list[i].level_id === "DSMS_USER" || token.level_list[i].level_id === "DSMS_ADMIN") {

          navConfig.push(
            {
              title: 'จองเวร',
              path: '/dsms/dsmsbookshift',
              icon: <Icon icon="zondicons:date-add" width="30" height="30" />,
            },
            // {
            //   title: 'เปลี่ยนเวร',
            //   path: '/dsms/เปลี่ยนเวร',
            //   icon: <Icon icon="material-symbols:edit-calendar-rounded" width="30" height="30" />,
            // },
            // {
            //   title: 'แลกเวร',
            //   path: '/dsms/แลกเวร',
            //   icon: <Icon icon="material-symbols:change-circle-outline-rounded" width="30" height="30" />,
            // },
          );
          if (token.level_list[i].level_id === "DSMS_ADMIN") {
            navConfig.push(
              {
                title: `จัดการสถานะการจองเวร`,
                path: '/dsms/dsmssetting',
                icon: <Icon icon="material-symbols:manage-history-rounded" width="30" height="30" />,
              },
              {
                title: `แก้ไขเวร`,
                path: '/dsms/dsmsmanagebook',
                icon: <Icon icon="material-symbols:edit-square-outline-rounded" width="30" height="30" />,
              },
            );
          }

        break;
      }
    }
    navConfig.push(
      {
        title: 'ย้อนกลับ',
        path: '/dashboard/app',
        icon: <Icon icon="ic:baseline-keyboard-return" width="30" height="30" />,
      },
    );
  }
}
catch (error) {
  console.error(error);
}

export default navConfig;