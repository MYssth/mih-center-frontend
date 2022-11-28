// component
import { Icon } from '@iconify/react';
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

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
    path: '/dmis/<ยังไม่ทำ>',
    icon: <Icon icon="ic:baseline-folder-copy" width="30" height="30" />,
  },
  {
    title: 'ย้อนกลับ',
    path: '/dashboard/app',
    icon: <Icon icon="ic:baseline-keyboard-return" width="30" height="30" />,
  },
];




export default navConfig;
