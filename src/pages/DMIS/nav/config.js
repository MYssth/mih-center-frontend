// component
import { Icon } from '@iconify/react';

// ----------------------------------------------------------------------

const navConfig = [
  {
    title: 'หน้าหลักระบบแจ้งซ่อม',
    path: '/dmis/app',
    icon: <Icon icon="ic:baseline-settings-suggest" width="30" height="30" />,
  },
  {
    title: 'แจ้งซ่อมอุปกรณ์',
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
];




export default navConfig;
