/* eslint-disable react-hooks/rules-of-hooks */
import { Helmet } from 'react-helmet-async';
import jwtDecode from "jwt-decode";
import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
// @mui
import { DataGrid, gridClasses, GridToolbarQuickFilter } from '@mui/x-data-grid';
import {
  Container,
  Typography,
  Card,
  styled,
  alpha,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Grid,
  Stack,
} from '@mui/material';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import imageToBase64 from 'image-to-base64/browser';

const ODD_OPACITY = 0.2;

pdfMake.vfs = pdfFonts.pdfMake.vfs;
const dateFns = require('date-fns');

pdfMake.fonts = {
  THSarabunNew: {
    normal: 'THSarabunNew.ttf',
    bold: 'THSarabunNew-Bold.ttf',
    italics: 'THSarabunNew-Italic.ttf',
    bolditalics: 'THSarabunNew-BoldItalic.ttf'
  },
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf'
  }
}

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}`]: {
    // backgroundColor: theme.palette.grey[200],
    '&:hover, &.Mui-hovered': {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
    '&.Mui-selected': {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity,
      ),
      '&:hover, &.Mui-hovered': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY +
          theme.palette.action.selectedOpacity +
          theme.palette.action.hoverOpacity,
        ),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity,
          ),
        },
      },
    },
  },
}));

const Item = styled('div')(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: 'left',
}));

function QuickSearchToolbar() {
  return (
    <Box
      sx={{
        p: 0.5,
        pb: 0,
      }}
    >
      <GridToolbarQuickFilter />
      <Button variant="outlined" sx={{ ml: 1 }} startIcon={<Icon icon="ic:baseline-refresh" width="24" height="24" />} onClick={() => { window.location.reload(false); }} >แสดงทั้งหมด</Button>
    </Box>
  );
}

export default function auditdashboard() {

  const columns = [
    {
      field: 'action',
      disableExport: true,
      headerName: '',
      width: 110,
      sortable: false,
      renderCell: (params) => {
        const onClick = () => {
          handleOpenAuditTaskDialog(params.row.task_id, params.row.level_id, params.row.status_id);
          // return alert(`you choose level = ${params.row.level_id}`);
        };

        return <Button variant="contained" onClick={onClick}>ตรวจรับ</Button>;
      },
    },
    {
      field: 'id',
      headerName: 'ลำดับที่',
      width: 50,
    },
    {
      field: 'task_id',
      headerName: 'เลขที่เอกสาร',
    },
    {
      field: 'level_id',
      headerName: 'ประเภทงาน',
      width: 100,
      valueGetter: (params) =>
        `${params.row.level_id === "DMIS_IT" ? "IT" : (params.row.level_id === 'DMIS_MT' ? "ซ่อมบำรุง" : "เครื่องมือแพทย์")}`,
    },
    {
      field: 'task_issue',
      headerName: 'ปัญหา',
      width: 150,
    },
    {
      field: 'task_solution',
      headerName: 'การแก้ไข',
      width: 150,
    },
    {
      field: 'task_note',
      headerName: 'หมายเหตุ',
      width: 150,
    },
    {
      field: 'issue_department_name',
      headerName: 'แผนก',
      width: 130,
    },
    {
      field: 'status_name',
      headerName: 'สถานะ',
      width: 125,
    },
    {
      field: 'informer_firstname',
      headerName: 'ผู้แจ้ง',
      width: 100,
    },
    {
      field: 'task_date_start',
      headerName: 'วันที่แจ้ง',
      width: 110,
      valueGetter: (params) =>
        `${(params.row.task_date_start).replace("T", " ").replace(".000Z", " น.")}`,
    },
    {
      field: 'operator_firstname',
      headerName: 'ผู้รับผิดชอบ',
      width: 100,
    },
  ];

  let noSig = "";
  let inforSig = "";
  let recvSig = "";
  let operSig = "";
  let permitSig = "";
  let auditSig = "";

  async function getImgBase64(data) {

    noSig = `data:image/jpeg;base64,${await imageToBase64(`${process.env.PUBLIC_URL}/signature/nosignature.png`)}`;
    inforSig = `data:image/jpeg;base64,${await imageToBase64(`${process.env.PUBLIC_URL}/signature/${data.informer_id}.jpg`)}`;
    if (inforSig.length < 5000) {
      inforSig = noSig;
    }
    recvSig = `data:image/jpeg;base64,${await imageToBase64(`${process.env.PUBLIC_URL}/signature/${data.receiver_id}.jpg`)}`;
    if (recvSig.length < 5000) {
      recvSig = noSig;
    }
    operSig = `data:image/jpeg;base64,${await imageToBase64(`${process.env.PUBLIC_URL}/signature/${data.operator_id}.jpg`)}`;
    if (operSig.length < 5000) {
      operSig = noSig;
    }
    permitSig = `data:image/jpeg;base64,${await imageToBase64(`${process.env.PUBLIC_URL}/signature/${data.permit_id}.jpg`)}`;
    if (permitSig.length < 5000) {
      permitSig = noSig;
    }
    auditSig = `data:image/jpeg;base64,${await imageToBase64(`${process.env.PUBLIC_URL}/signature/${data.audit_id}.jpg`)}`;
    if (auditSig.length < 5000) {
      auditSig = noSig;
    }
    printPDF(data, inforSig, recvSig, operSig, permitSig, auditSig);

  }

  function printPDF(data, inforSig, recvSig, operSig, permitSig, auditSig) {
    const docDefinition = {
      pageOrientation: 'portrait',
      content: [
        // logo image hide here
        {
          image: 'data:image/jpeg;base64,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',
          fit: [150, 200],
        },
        {
          style: 'tableExample',
          table: {
            widths: ['auto', '*', 'auto'],
            body: [
              [{ text: 'รหัสแบบฟอร์ม\nDMIS-001', alignment: 'center' }, { text: `ใบแจ้งซ่อม/แจ้งติดตั้ง/แจ้งปัญหา\n${data.level_id === 'DMIS_IT' ? '(งานเทคโนโลยีสารสนเทศ)' : (data.level_id === 'DMIS_MT' ? '(งานซ่อมบำรุงทั่วไป)' : '(งานซ่อมบำรุงเครื่องมือแพทย์)')}`, style: 'header', alignment: 'center' }, { text: 'เริ่มใช้วันที่ 16 ม.ค. 2566\nปรับปรุงครั้งที่ 2 เมื่อ 16 ม.ค. 2566' }]
            ]
          },

        },
        '\n',
        { text: `เลขที่เอกสาร ${data.task_id}`, alignment: 'right' },
        {
          style: 'tableExample',
          table: {
            widths: ['*'],
            heights: [10, 'auto'],
            body: [
              [{ text: 'ผู้ขอใช้บริการ', style: 'header2' }],
              [{
                text: [
                  `ชื่อ: ${data.informer_firstname}\tนามสกุล: ${data.informer_lastname}\tตำแหน่ง: ${data.informer_position_name}\n`,
                  `แผนก: ${data.informer_department_name}\tฝ่าย: ${data.informer_faction_name}\tเบอร์โทรศัพท์: ${data.task_phone_no === null || data.task_phone_no === "" ? "ไม่ได้ระบุ" : data.task_phone_no}`,
                ]
              }],
            ]
          }
        },
        '\n',
        {
          style: 'tableExample',
          table: {
            widths: ['*'],
            heights: [10, 85],
            body: [
              [{ text: 'รายละเอียด', style: 'header2' }],
              [{
                text: [
                  `แผนกที่แจ้งปัญหา: ${data.issue_department_name}\t`,
                  `วันที่แจ้ง: ${dateFns.format(dateFns.addYears(new Date(data.task_date_start), 543), 'dd/MM/yyyy')}\n`,
                  `รหัสทรัพย์สิน: ${data.task_device_id === null || data.task_device_id === "" ? "ไม่ได้ระบุ" : data.task_device_id}\t`,
                  `Serial number: ${data.task_serialnumber === null || data.task_serialnumber === "" ? "ไม่ได้ระบุ" : data.task_serialnumber}\n`,
                  `รายละเอียดของปัญหา: ${data.task_issue}\n`,
                ]
              }],
            ]
          }
        },
        {
          columns: [
            {
              text: [
                { text: "\n", width: 60 },
                { text: 'ลงชื่อ', alignment: 'right', width: 60 },
              ]
            },
            {
              image: inforSig,
              fit: [110, 40],
              width: 110,
              alignment: 'center',
            },
            {
              text: [
                { text: "\n", width: 60 },
                { text: 'ผู้แจ้ง', width: 60 },
              ]
            },
            {
              text: [
                { text: "\n", width: 60 },
                { text: 'ลงชื่อ', alignment: 'right', width: 60 },
              ]
            },
            {
              image: recvSig,
              fit: [110, 40],
              width: 110,
              alignment: 'center',
            },
            {
              text: [
                { text: "\n" },
                { text: 'ผู้รับเรื่อง' },
              ]
            },
          ]
        },
        {
          columns: [
            {
              text: `(${data.informer_firstname} ${data.informer_lastname})`,
              alignment: 'center',
              width: 260,
            },
            {
              text: `${data.receiver_firstname === null || data.receiver_firstname === "" ? "(........................................)" : `(${data.receiver_firstname} ${data.receiver_lastname})`}`,
              alignment: 'center',
              width: 260,
            },
          ]
        },
        {
          columns: [
            {
              text: `วันที่ ${dateFns.format(dateFns.addYears(new Date(data.task_date_start), 543), 'dd/MM/yyyy')}`,
              alignment: 'center',
              width: 260,
            },
            {
              text: `วันที่${data.task_date_accept === null || data.task_date_accept === "" ? "..................................." : ` ${dateFns.format(dateFns.addYears(new Date(data.task_date_accept), 543), 'dd/MM/yyyy')}`}`,
              alignment: 'center',
              width: 260,
            },
          ]
        },
        '\n',
        {
          style: 'tableExample',
          table: {
            widths: ['*'],
            heights: [10, 95],
            body: [
              [{ text: 'ผลการดำเนินงาน', style: 'header2' }],
              [{
                text: [
                  `สถานะ: ${data.status_name}\t`,
                  `งบประมาณที่ใช้: ${data.task_cost === null || data.task_cost === "" ? "0" : data.task_cost}\t`,
                  `วันที่เสร็จสิ้นการดำเนินงาน: ${data.task_date_end === null || data.task_date_end === "" ? "สถานะงานยังไม่เสร็จสิ้น" : dateFns.format(dateFns.addYears(new Date(data.task_date_end), 543), 'dd/MM/yyyy')}\n`,
                  `รายละเอียดการแก้ไขปัญหา: ${data.task_solution === null || data.task_solution === "" ? "สถานะงานยังไม่เสร็จสิ้น" : data.task_solution}\n`,
                  `หมายเหตุ: ${data.task_note === null || data.task_note === "" ? "" : data.task_note}\n`,
                ]
              }],
            ]
          }
        },
        {
          columns: [
            {
              text: [
                { text: "\n", width: 60 },
                { text: 'ลงชื่อ', alignment: 'right', width: 60 },
              ]
            },
            {
              image: operSig,
              fit: [110, 40],
              width: 110,
              alignment: 'center',
            },
            {
              text: [
                { text: "\n", width: 60 },
                { text: 'ผู้ดำเนินการ', width: 60 },
              ]
            },
            {
              text: [
                { text: "\n", width: 60 },
                { text: 'ลงชื่อ', alignment: 'right', width: 60 },
              ]
            },
            {
              image: permitSig,
              fit: [110, 40],
              width: 110,
              alignment: 'center',
            },
            {
              text: [
                { text: "\n" },
                { text: 'ผู้ตรวจสอบ' },
              ]
            },
          ]
        },
        {
          columns: [
            {
              text: `${data.operator_firstname === null || data.operator_firstname === "" ? "(........................................)" : `(${data.operator_firstname} ${data.operator_lastname})`}`,
              alignment: 'center',
              width: 260,
            },
            {
              text: `${data.permit_firstname === null || data.permit_firstname === "" ? "(........................................)" : `(${data.permit_firstname} ${data.permit_lastname})`}`,
              alignment: 'center',
              width: 260,
            },
          ]
        },
        {
          columns: [
            {
              text: `วันที่${data.task_date_process === null || data.task_date_process === "" ? "..................................." : ` ${dateFns.format(dateFns.addYears(new Date(data.task_date_process), 543), 'dd/MM/yyyy')}`}`,
              alignment: 'center',
              width: 260,
            },
            {
              text: `วันที่${data.permit_date === null || data.permit_date === "" ? "..................................." : ` ${dateFns.format(dateFns.addYears(new Date(data.permit_date), 543), 'dd/MM/yyyy')}`}`,
              alignment: 'center',
              width: 260,
            },
          ]
        },
        {
          columns: [
            {
              text: [
                { text: "\n", width: 60 },
                { text: 'ลงชื่อ', alignment: 'right', width: 60 },
              ]
            },
            {
              image: auditSig,
              fit: [110, 40],
              width: 110,
              alignment: 'center',
            },
            {
              text: [
                { text: "\n" },
                { text: 'ผู้รับทราบผลดำเนินงาน' },
              ]
            },
          ]
        },
        {
          columns: [
            {
              text: `${data.audit_firstname === null || data.audit_firstname === "" ? "(........................................)" : `(${data.audit_firstname} ${data.audit_lastname})`}`,
              alignment: 'center',
              width: '*',
            },
          ]
        },
        {
          columns: [
            {
              text: `วันที่${data.audit_date === null || data.audit_date === "" ? "..................................." : ` ${dateFns.format(dateFns.addYears(new Date(data.audit_date), 543), 'dd/MM/yyyy')}`}`,
              alignment: 'center',
              width: '*',
            },
          ]
        },

      ],
      defaultStyle: {
        font: 'THSarabunNew',
        fontSize: 16,
      },
      styles: {
        header: {
          fontSize: 16,
          bold: true
        },
        header2: {
          fontSize: 16,
          bold: true
        },
        anotherStyle: {
          italics: true,
          alignment: 'right'
        }
      },
    };
    pdfMake.createPdf(docDefinition).open()
  }

  // =========================================================

  const [pageSize, setPageSize] = useState(10);

  const [auditTaskList, setAuditTaskList] = useState([]);
  const [filterAuditTaskList, setFilterAuditTaskList] = useState([]);
  const [showReplacement, setShowReplacement] = useState(false);

  const [focusTask, setFocusTask] = useState('');
  const [focusTaskDialogOpen, setFocusTaskDialogOpen] = useState(false);

  const [taskId, setTaskId] = useState('');
  const [levelId, setLevelId] = useState('');
  const [auditId, setAuditId] = useState('');
  const [statusId, setStatusId] = useState('');

  const [auditTaskDialogOpen, setAuditTaskDialogOpen] = useState(false);

  useEffect(() => {

    const controller = new AbortController();
    // eslint-disable-next-line prefer-destructuring
    const signal = controller.signal;
    const token = jwtDecode(localStorage.getItem('token'));
    setAuditId(token.personnel_id);
    for (let i = 0; i < token.level_list.length; i += 1) {
      if (token.level_list[i].level_id === "DMIS_USER" ||
        token.level_list[i].level_id === "DMIS_IT" ||
        token.level_list[i].level_id === "DMIS_MT" ||
        token.level_list[i].level_id === "DMIS_MER" ||
        token.level_list[i].level_id === "DMIS_ENV" ||
        token.level_list[i].level_id === "DMIS_HIT" ||
        token.level_list[i].level_id === "DMIS_ALL") {
        fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dmisPort}/api/dmis/getaudittasklist/${token.personnel_id}/${token.level_list[i].view_id}`, { signal })
          .then((response) => response.json())
          .then((data) => {
            setAuditTaskList(data);
            setFilterAuditTaskList(data.filter(dt => dt.status_id === 5));
          })
          .catch((error) => {
            if (error.name === "AbortError") {
              console.log("cancelled")
            }
            else {
              console.error('Error:', error);
            }
          })
        break;
      }
    }
  }, [])

  useEffect(() => {
    if (showReplacement) {
      setFilterAuditTaskList(auditTaskList.filter(dt => dt.status_id === 6));
    }
    else {
      setFilterAuditTaskList(auditTaskList.filter(dt => dt.status_id === 5));
    }
  }, [showReplacement])

  const handleOpenFocusTaskDialog = (task) => {
    setFocusTask(task);
    setFocusTaskDialogOpen(true);
  }

  const handleCloseFocusTaskDialog = () => {
    setFocusTask("");
    setFocusTaskDialogOpen(false);
  }

  const handleOpenAuditTaskDialog = (taskId, levelId, statusId) => {
    setTaskId(taskId);
    setLevelId(levelId);
    setStatusId(statusId);
    setAuditTaskDialogOpen(true);
  }

  const handleCloseAuditTaskDialog = () => {
    setTaskId('');
    setLevelId('');
    setStatusId('');
    setAuditTaskDialogOpen(false);
  }

  const handleAuditTask = () => {

    const jsonData = {
      task_id: taskId,
      level_id: levelId,
      audit_id: auditId,
      status_id: statusId,
      taskCase: "audit",
    };

    fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dmisPort}/api/dmis/processtask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData)
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'ok') {
          alert('ตรวจรับงานสำเร็จ');
          handleCloseAuditTaskDialog();
          window.location.reload(false);
        }
        else {
          alert('ไม่สามารถตรวจรับงานได้');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('เกิดข้อผิดพลาดในการตรวจรับงาน');
      });
  }

  const handleShowReplacement = () => {
    setShowReplacement(!showReplacement);
  }

  return (
    <>
      <Helmet>
        <title> ระบบแจ้งปัญหาออนไลน์ | MIH Center </title>
      </Helmet>

      <Container maxWidth="xl">

        <Typography variant="h4" sx={{ mb: 5 }}>
          ระบบแจ้งปัญหาออนไลน์ - Issue Inform Online Service(IIOS)
        </Typography>
        <Card>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
            <Typography sx={{ flex: '1 1 100%', p: 1 }} variant="h6" id="tableTitle" component="div" >
              รายการงานรอตรวจรับ - งานที่{showReplacement ? "ซื้อใหม่ทดแทน" : "ดำเนินการเสร็จสิ้น"}
            </Typography>
            <Button sx={{ mt: 1, mr: 1 }} variant="contained" onClick={handleShowReplacement}>
              แสดงงาน{showReplacement ? "ที่ดำเนินการเสร็จสิ้น" : "ซื้อใหม่ทดแทน"}
            </Button>
          </Stack>
          <div style={{ display: 'flex', height: '100%' }}>
            <div style={{ flexGrow: 1 }}>
              <StripedDataGrid
                autoHeight
                getRowHeight={() => 'auto'}
                sx={{
                  [`& .${gridClasses.cell}`]: {
                    py: 1,
                  },
                }}
                columns={columns}
                rows={filterAuditTaskList}
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                rowsPerPageOptions={[10, 25, 100]}
                onCellDoubleClick={(params) => { handleOpenFocusTaskDialog(params.row) }}
                initialState={{
                  columns: {
                    columnVisibilityModel: {
                      // Hide columns status and traderName, the other columns will remain visible
                      id: false,
                    },
                  },
                }}
                components={{ Toolbar: QuickSearchToolbar }}
              />
            </div>
          </div>
        </Card>

      </Container>

      {/* ============================รายละเอียดงานแจ้งปัญหาออนไลน์======================================= */}
      <Dialog fullWidth maxWidth="md" open={focusTaskDialogOpen} onClose={handleCloseFocusTaskDialog}>
        <DialogTitle>รายละเอียดงานแจ้งปัญหาออนไลน์</DialogTitle>
        <DialogContent>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={1}>
              <Grid xs={4}>
                <Item sx={{ textAlign: 'right' }}>สถานะ:</Item>
              </Grid>
              <Grid xs={8}>
                <Item>{focusTask.status_name}</Item>
              </Grid>
              <Grid xs={4}>
                <Item sx={{ textAlign: 'right' }}>เลขที่เอกสาร:</Item>
              </Grid>
              <Grid xs={8}>
                <Item>{focusTask.task_id}</Item>
              </Grid>
              <Grid xs={4}>
                <Item sx={{ textAlign: 'right' }}>ประเภทงาน:</Item>
              </Grid>
              <Grid xs={8}>
                <Item>{focusTask.level_id === "DMIS_IT" ? "IT" : (focusTask.level_id === 'DMIS_MT' ? "ซ่อมบำรุง" : "เครื่องมือแพทย์")}</Item>
              </Grid>
              <Grid xs={4}>
                <Item sx={{ textAlign: 'right' }}>วันที่แจ้ง:</Item>
              </Grid>
              <Grid xs={8}>
                <Item>{focusTask.task_date_start ? (focusTask.task_date_start).replace("T", " ").replace(".000Z", " น.") : ""}</Item>
              </Grid>
              <Grid xs={4}>
                <Item sx={{ textAlign: 'right' }}>แผนกที่แจ้งปัญหา:</Item>
              </Grid>
              <Grid xs={8}>
                <Item>{focusTask.issue_department_name}</Item>
              </Grid>
              <Grid xs={4}>
                <Item sx={{ textAlign: 'right' }}>รายละเอียดงานที่แจ้ง:</Item>
              </Grid>
              <Grid xs={8}>
                <Item>{focusTask.task_issue}</Item>
              </Grid>
              <Grid xs={4}>
                <Item sx={{ textAlign: 'right' }}>Serial Number:</Item>
              </Grid>
              <Grid xs={8}>
                <Item>{focusTask.task_serialnumber}</Item>
              </Grid>
              <Grid xs={4}>
                <Item sx={{ textAlign: 'right' }}>รหัสทรัพย์สิน:</Item>
              </Grid>
              <Grid xs={8}>
                <Item>{focusTask.task_device_id}</Item>
              </Grid>
              <Grid xs={4}>
                <Item sx={{ textAlign: 'right' }}>ผู้แจ้ง:</Item>
              </Grid>
              <Grid xs={8}>
                <Item>{focusTask.informer_firstname} {focusTask.informer_lastname}</Item>
              </Grid>
              <Grid xs={4}>
                <Item sx={{ textAlign: 'right' }}>เบอร์โทรติดต่อ:</Item>
              </Grid>
              <Grid xs={8}>
                <Item>{focusTask.task_phone_no}</Item>
              </Grid>
              <Grid xs={4}>
                <Item sx={{ textAlign: 'right' }}>วันที่รับเรื่อง:</Item>
              </Grid>
              <Grid xs={8}>
                <Item>{focusTask.task_date_accept ? (focusTask.task_date_accept).replace("T", " ").replace(".000Z", " น.") : ""}</Item>
              </Grid>
              <Grid xs={4}>
                <Item sx={{ textAlign: 'right' }}>เวลาดำเนินงาน:</Item>
              </Grid>
              <Grid xs={8}>
                <Item>{focusTask.estimation_name}</Item>
              </Grid>
              <Grid xs={4}>
                <Item sx={{ textAlign: 'right' }}>ผู้รับเรื่อง:</Item>
              </Grid>
              <Grid xs={8}>
                <Item>{focusTask.receiver_firstname} {focusTask.receiver_lastname}</Item>
              </Grid>
              <Grid xs={4}>
                <Item sx={{ textAlign: 'right' }}>วันที่ดำเนินการล่าสุด:</Item>
              </Grid>
              <Grid xs={8}>
                <Item>{focusTask.task_date_process ? (focusTask.task_date_process).replace("T", " ").replace(".000Z", " น.") : ""}</Item>
              </Grid>
              <Grid xs={4}>
                <Item sx={{ textAlign: 'right' }}>ผู้รับผิดชอบ:</Item>
              </Grid>
              <Grid xs={8}>
                <Item>{focusTask.operator_firstname} {focusTask.operator_lastname}</Item>
              </Grid>
              <Grid xs={4}>
                <Item sx={{ textAlign: 'right' }}>หมายเหตุ:</Item>
              </Grid>
              <Grid xs={8}>
                <Item>{focusTask.task_note}</Item>
              </Grid>
              <Grid xs={4}>
                <Item sx={{ textAlign: 'right' }}>วันที่เสร็จสิ้น:</Item>
              </Grid>
              <Grid xs={8}>
                <Item>{focusTask.task_date_end ? (focusTask.task_date_end).replace("T", " ").replace(".000Z", " น.") : ""}</Item>
              </Grid>
              <Grid xs={4}>
                <Item sx={{ textAlign: 'right' }}>รายละเอียดการแก้ไขปัญหา:</Item>
              </Grid>
              <Grid xs={8}>
                <Item>{focusTask.task_solution}</Item>
              </Grid>
              <Grid xs={4}>
                <Item sx={{ textAlign: 'right' }}>งบประมาณที่ใช้:</Item>
              </Grid>
              <Grid xs={8}>
                <Item>{focusTask.task_cost}</Item>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFocusTaskDialog}>ปิดหน้าต่าง</Button>
          <Button onClick={() => {getImgBase64(focusTask)}}>ปริ้นเอกสาร</Button>
        </DialogActions>
      </Dialog>
      {/* ================================================================================== */}

      {/* ==================================ตรวจรับงาน============================================= */}
      <Dialog fullWidth maxWidth="md" open={auditTaskDialogOpen} onClose={handleCloseAuditTaskDialog}>
        <DialogTitle>ตรวจรับงาน</DialogTitle>
        <DialogContent>
          <DialogContentText>
            คุณต้องการตรวจรับงานนี้ใช่หรือไม่
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAuditTaskDialog}>ยกเลิก</Button>
          <Button variant="contained" onClick={handleAuditTask}>ยืนยันการตรวจรับงาน</Button>
        </DialogActions>
      </Dialog>
      {/* ================================================================================== */}

    </>
  );
}