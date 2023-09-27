import * as React from 'react';
import { DataGrid, gridClasses, GridToolbar } from '@mui/x-data-grid';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import jwtDecode from 'jwt-decode';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
// @mui
import { Stack, Typography, TextField, Button, alpha, styled, Box } from '@mui/material';
import MainHeader from '../components/MainHeader';
import CBSSidebar from './components/nav/CBSSidebar';
import reportPDF from './components/pdf';

const dateFns = require('date-fns');

const ODD_OPACITY = 0.2;

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
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY + theme.palette.action.selectedOpacity),
      '&:hover, &.Mui-hovered': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY + theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity
        ),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY + theme.palette.action.selectedOpacity),
        },
      },
    },
  },
}));

const rToken = localStorage.getItem('token');

function CBSBookRprt() {
  const [fromDate, setFromDate] = useState('');
  // const [toDate, setToDate] = useState(dateFns.format(new Date(), 'yyyy-MM-dd'));
  const [toDate, setToDate] = useState(new Date());
  const [allSched, setAllSched] = useState([]);
  const [filterSched, setFilterSched] = useState([]);

  // const [isIncomplete, setIsincomplete] = useState(false);
  // const [mode, setMode] = useState("");

  const [pageSize, setPageSize] = useState(25);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    // eslint-disable-next-line prefer-destructuring
    const token = jwtDecode(localStorage.getItem('token'));

    for (let i = 0; i < token.lv_list.length; i += 1) {
      if (token.lv_list[i].mihapp_id === 'CBS') {
        console.log(token.lv_list[i].view_id);
        // to be change to hims database
        fetch(
          `${process.env.REACT_APP_host}${process.env.REACT_APP_cbsPort}/getschedbydeptid/${token.lv_list[i].view_id}/${token.psn_id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${rToken}`,
            },
          }
        )
          .then((response) => response.json())
          .then((data) => {
            setAllSched(data);
            setFilterSched(data);
          })
          .catch((error) => {
            if (error.name === 'AbortError') {
              console.log('cancelled');
            } else {
              console.error('Error:', error);
            }
          });
        break;
      }
    }

    return () => {
      controller.abort();
    };
  }, []);

  const handleFindSchedId = () => {
    setFilterSched(allSched.filter((dt) => dt.id.includes(document.getElementById('schedId').value)));
  };

  const handleFindDate = () => {
    const tmpFromDate = dateFns.format(fromDate, 'yyyy-MM-dd');
    setFilterSched(
      allSched.filter(
        (dt) =>
          dt.req_date >= tmpFromDate &&
          dt.req_date <= dateFns.format(dateFns.addDays(new Date(toDate), 1), 'yyyy-MM-dd')
      )
    );
  };

  const columns = [
    {
      field: 'action',
      disableExport: true,
      headerName: '',
      minWidth: 90,
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        const onClick = (e) => {
          e.stopPropagation(); // don't select this row after clicking
          reportPDF(params.row);
          // setFocusTask(params.row);
          // setOpenTaskDetail(true);
        };

        return (
          <Button variant="contained" onClick={onClick}>
            ปริ้น
          </Button>
        );
      },
    },
    {
      field: 'id',
      headerName: 'เลขที่',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'from_date',
      headerName: 'วันที่ไป',
      flex: 1,
      minWidth: 100,
      valueGetter: (params) =>
        `${String(new Date(params.row.from_date).getUTCDate()).padStart(2, '0')}/${String(
          parseInt(new Date(params.row.from_date).getUTCMonth(), 10) + 1
        ).padStart(2, '0')}/${new Date(params.row.from_date).getUTCFullYear()}`,
    },
    {
      field: 'from_time',
      headerName: 'เวลาไป',
      flex: 1,
      minWidth: 60,
      valueGetter: (params) =>
        `${String(new Date(params.row.from_date).getUTCHours()).padStart(2, '0')}:${String(
          new Date(params.row.from_date).getUTCMinutes()
        ).padStart(2, '0')}`,
    },
    {
      field: 'to_date',
      headerName: 'วันที่กลับ',
      flex: 1,
      minWidth: 100,
      valueGetter: (params) =>
        `${String(new Date(params.row.to_date).getUTCDate()).padStart(2, '0')}/${String(
          parseInt(new Date(params.row.to_date).getUTCMonth(), 10) + 1
        ).padStart(2, '0')}/${new Date(params.row.to_date).getUTCFullYear()}`,
    },
    {
      field: 'to_time',
      headerName: 'เวลากลับ',
      flex: 1,
      minWidth: 60,
      valueGetter: (params) =>
        `${String(new Date(params.row.to_date).getUTCHours()).padStart(2, '0')}:${String(
          new Date(params.row.to_date).getUTCMinutes()
        ).padStart(2, '0')}`,
    },
    {
      field: 'dept_name',
      headerName: 'แผนกที่ขอ',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'place',
      headerName: 'สถานที่',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'province',
      headerName: 'จังหวัด',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'pax_amt',
      headerName: 'จำนวนผู้โดยสาร',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'detail',
      headerName: 'รายละเอียด',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'tel_no',
      headerName: 'เบอร์ติดต่อ',
      flex: 1,
      minWidth: 110,
    },
    {
      field: 'car_type_name',
      headerName: 'ประเภทรถ',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'car_name',
      headerName: 'รถที่ขอใช้',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'car_reg_no',
      headerName: 'ทะเบียนรถ',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'drv_name',
      headerName: 'ผู้ขับรถ',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'req_name',
      headerName: 'ผู้ขอใช้รถ',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'req_date',
      headerName: 'วันที่ขอ',
      flex: 1,
      minWidth: 100,
      valueGetter: (params) =>
        `${String(new Date(params.row.req_date).getUTCDate()).padStart(2, '0')}/${String(
          parseInt(new Date(params.row.req_date).getUTCMonth(), 10) + 1
        ).padStart(2, '0')}/${new Date(params.row.req_date).getUTCFullYear()}`,
    },
    {
      field: 'req_time',
      headerName: 'เวลาที่ขอ',
      flex: 1,
      minWidth: 60,
      valueGetter: (params) =>
        `${String(new Date(params.row.req_date).getUTCHours()).padStart(2, '0')}:${String(
          new Date(params.row.req_date).getUTCMinutes()
        ).padStart(2, '0')}`,
    },
    {
      field: 'status_name',
      headerName: 'สถานะ',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'rcv_name',
      headerName: 'ผู้รับเรื่อง',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'rcv_date',
      headerName: 'วันที่รับเรื่อง',
      flex: 1,
      minWidth: 100,
      valueGetter: (params) =>
        params.row.rcv_date
          ? `${String(new Date(params.row.rcv_date).getUTCDate()).padStart(2, '0')}/${String(
              parseInt(new Date(params.row.rcv_date).getUTCMonth(), 10) + 1
            ).padStart(2, '0')}/${new Date(params.row.rcv_date).getUTCFullYear()}`
          : '',
    },
    {
      field: 'rcv_time',
      headerName: 'เวลาที่รับเรื่อง',
      flex: 1,
      minWidth: 60,
      valueGetter: (params) =>
        params.row.rcv_date
          ? `${String(new Date(params.row.rcv_date).getUTCHours()).padStart(2, '0')}:${String(
              new Date(params.row.rcv_date).getUTCMinutes()
            ).padStart(2, '0')}`
          : '',
    },
    {
      field: 'permit_name',
      headerName: 'ผู้อนุมัติ',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'permit_date',
      headerName: 'วันที่อนุมัติ',
      flex: 1,
      minWidth: 100,
      valueGetter: (params) =>
        params.row.permit_date
          ? `${String(new Date(params.row.permit_date).getUTCDate()).padStart(2, '0')}/${String(
              parseInt(new Date(params.row.permit_date).getUTCMonth(), 10) + 1
            ).padStart(2, '0')}/${new Date(params.row.permit_date).getUTCFullYear()}`
          : '',
    },
    {
      field: 'permit_time',
      headerName: 'เวลาที่อนุมัติ',
      flex: 1,
      minWidth: 60,
      valueGetter: (params) =>
        params.row.permit_date
          ? `${String(new Date(params.row.permit_date).getUTCHours()).padStart(2, '0')}:${String(
              new Date(params.row.permit_date).getUTCMinutes()
            ).padStart(2, '0')}`
          : '',
    },
    {
      field: 'note',
      headerName: 'หมายเหตุ',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'dep_date',
      headerName: 'วันที่รถออก',
      flex: 1,
      minWidth: 100,
      valueGetter: (params) =>
        params.row.dep_date
          ? `${String(new Date(params.row.dep_date).getUTCDate()).padStart(2, '0')}/${String(
              parseInt(new Date(params.row.dep_date).getUTCMonth(), 10) + 1
            ).padStart(2, '0')}/${new Date(params.row.dep_date).getUTCFullYear()}`
          : '',
    },
    {
      field: 'dep_time',
      headerName: 'เวลาที่รถออก',
      flex: 1,
      minWidth: 60,
      valueGetter: (params) =>
        params.row.dep_date
          ? `${String(new Date(params.row.dep_date).getUTCHours()).padStart(2, '0')}:${String(
              new Date(params.row.dep_date).getUTCMinutes()
            ).padStart(2, '0')}`
          : '',
    },
    {
      field: 'dep_mi',
      headerName: 'เลขไมล์รถออก',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'arr_date',
      headerName: 'วันที่รถเข้า',
      flex: 1,
      minWidth: 100,
      valueGetter: (params) =>
        params.row.arr_date
          ? `${String(new Date(params.row.arr_date).getUTCDate()).padStart(2, '0')}/${String(
              parseInt(new Date(params.row.arr_date).getUTCMonth(), 10) + 1
            ).padStart(2, '0')}/${new Date(params.row.arr_date).getUTCFullYear()}`
          : '',
    },
    {
      field: 'arr_time',
      headerName: 'เวลาที่รถเข้า',
      flex: 1,
      minWidth: 60,
      valueGetter: (params) =>
        params.row.arr_date
          ? `${String(new Date(params.row.arr_date).getUTCHours()).padStart(2, '0')}:${String(
              new Date(params.row.arr_date).getUTCMinutes()
            ).padStart(2, '0')}`
          : '',
    },
    {
      field: 'arr_mi',
      headerName: 'เลขไมล์รถเข้า',
      flex: 1,
      minWidth: 100,
    },
  ];

  return (
    <>
      <Helmet>
        <title> ระบบบริหารจัดการยานพาหนะ | MIH Center </title>
      </Helmet>

      <div>
        <MainHeader onOpenNav={() => setOpen(true)} />
        <CBSSidebar name="bookrprt" openNav={open} onCloseNav={() => setOpen(false)} />

        {/* <!-- ======= Main ======= --> */}
        <main id="main" className="main">
          <div className="pagetitle">
            <h1>รายงานการใช้รถ</h1>
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item my-2">
                  <a href="../mih-intranet.html">หน้าหลัก</a>
                </li>
                <li className="breadcrumb-item my-2">
                  <a href="car-booking.html">หน้าหลักระบบบริหารจัดการยานพาหนะ</a>
                </li>
                <li className="breadcrumb-item my-2">รายงานการใช้รถ</li>
              </ol>
            </nav>
          </div>
          {/* <!-- End Page Title --> */}
          <section className="section">
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body pt-3">
                    <Stack direction="row" spacing={10} sx={{ width: 'auto' }}>
                      <Box>
                        <Typography variant="h5">ค้นหาตามเลขที่เอกสาร</Typography>
                        <Stack direction="row" spacing={1}>
                          <TextField id="schedId" name="schedId" label="เลขที่เอกสาร" />
                          <Button variant="contained" sx={{ width: 100 }} onClick={handleFindSchedId}>
                            ค้นหา
                          </Button>
                        </Stack>
                      </Box>
                      <Box>
                        <Typography variant="h5">ค้นหาตามวันเวลาที่แจ้งขอใช้รถ</Typography>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <Stack direction="row" spacing={1}>
                            <DatePicker
                              disableFuture
                              format="dd-MM-yyyy"
                              maxDate={toDate}
                              label="จากวันที่"
                              value={fromDate}
                              onChange={(newValue) => {
                                setFromDate(newValue);
                              }}
                              renderInput={(params) => <TextField {...params} />}
                            />
                            <DatePicker
                              disableFuture
                              format="dd-MM-yyyy"
                              minDate={fromDate}
                              label="ถึงวันที่"
                              value={toDate}
                              onChange={(newValue) => {
                                setToDate(newValue);
                              }}
                              renderInput={(params) => <TextField {...params} />}
                            />
                            <Button variant="contained" onClick={handleFindDate} sx={{ width: 100 }}>
                              ค้นหา
                            </Button>
                          </Stack>
                        </LocalizationProvider>
                      </Box>
                    </Stack>
                    <br />
                    <Stack spacing={2} sx={{ width: 'auto' }}>
                      <Typography variant="h5">รายการงานขอใช้รถ</Typography>
                      <div style={{ width: '100%' }}>
                        <StripedDataGrid
                          getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
                          autoHeight
                          getRowHeight={() => 'auto'}
                          sx={{
                            [`& .${gridClasses.cell}`]: {
                              py: 1,
                            },
                          }}
                          disableSelectionOnClick
                          columns={columns}
                          rows={filterSched}
                          pageSize={pageSize}
                          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                          components={{
                            Toolbar: GridToolbar,
                            // Toolbar: CustomToolbar,
                          }}
                          // initialState={{
                          //     columns: {
                          //         columnVisibilityModel: {
                          //             // Hide columns status and traderName, the other columns will remain visible
                          //             id: false,
                          //             task_cost: false,
                          //             task_date_accept: false,
                          //             task_date_process: false,
                          //             task_serialnumber: false,
                          //             receiver_firstname: false,
                          //             task_phone_no: false,
                          //         },
                          //     },
                          // }}
                          componentsProps={{
                            toolbar: {
                              csvOptions: { utf8WithBom: true },
                            },
                          }}
                        />
                      </div>
                    </Stack>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

export default CBSBookRprt;
