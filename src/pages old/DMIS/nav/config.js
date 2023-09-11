import jwtDecode from "jwt-decode";
// component
import { Icon } from '@iconify/react';

// ----------------------------------------------------------------------

const navConfig = [
  {
    title: 'หน้าหลักระบบแจ้งปัญหา',
    path: '/dmis/app',
    icon: <Icon icon="ic:baseline-dashboard" width="30" height="30" />,
  },
];

try {

  // let havePermitTask = 0;

  const token = jwtDecode(localStorage.getItem('token'));
  if (token !== null) {
    for (let i = 0; i < token.level_list.length; i += 1) {
      if (token.level_list[i].level_id === "DMIS_IT" || token.level_list[i].level_id === "DMIS_MT"
        || token.level_list[i].level_id === "DMIS_MER" || token.level_list[i].level_id === "DMIS_ENV"
        || token.level_list[i].level_id === "DMIS_HIT" || token.level_list[i].level_id === "DMIS_ALL") {

          navConfig.push(
            {
              title: 'งานที่ได้รับ',
              path: '/dmis/itmtdashboard',
              icon: <Icon icon="ic:baseline-settings-suggest" width="30" height="30" />,
            },
          );
          if (token.level_list[i].level_id === "DMIS_ENV" || token.level_list[i].level_id === "DMIS_HIT") {
            navConfig.push(
              {
                title: `งานรอตรวจสอบ`,
                path: '/dmis/permitdashboard',
                icon: <Icon icon="ic:outline-fact-check" width="30" height="30" />,
              },
            );
          }
        break;
      }
    }
    navConfig.push(
      {
        title: 'งานที่ต้องดำเนินการเอง',
        path: '/dmis/informertask',
        icon: <Icon icon="mdi:user-arrow-left" width="30" height="30" />,
      },
      {
        title: 'งานรอตรวจรับ',
        path: '/dmis/auditdashboard',
        icon: <Icon icon="ic:baseline-recommend" width="30" height="30" />,
      },
      {
        title: 'แจ้งปัญหาออนไลน์',
        path: '/dmis/dmisnewcase',
        icon: <Icon icon="ic:baseline-note-add" width="30" height="30" />,
      },
      {
        title: 'รายงาน',
        path: '/dmis/dmisreport',
        icon: <Icon icon="ic:baseline-folder-copy" width="30" height="30" />,
      },
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