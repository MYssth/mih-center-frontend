/* eslint-disable react/button-has-type */
/* eslint-disable arrow-body-style */
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { DataGrid, gridClasses, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { Stack, styled, alpha, Box } from '@mui/material';
import MainHeader from '../components/MainHeader';
import CBSSidebar from './components/nav/CBSSidebar';
import { CBSDenyDialg, CBSPermitRepDialg } from './components/dialogs/forms';
import { CBSTaskDetail } from './components/dialogs/taskdetails';

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

let rToken = '';

function CBSReqPermit() {
  const columns = [
    {
      field: 'action',
      headerName: '',
      sortable: false,
      flex: 1,
      minWidth: 155,
      renderCell: (params) => {
        const handlePermit = () => {
          setPermitRepData(params.row);
          setPermitRepDialg(true);
        };
        const handleDeny = () => {
          setPermitRepData(params.row);
          setDenyDialg(true);
        };

        return (
          <Stack direction="row" spacing={1}>
            <button onClick={handlePermit} className="btn btn-success">
              จัดการ
            </button>
            <button type="submit" className="btn btn-danger" onClick={handleDeny}>
              ยกเลิก
            </button>
          </Stack>
        );
      },
    },
    {
      field: 'id',
      headerName: 'เลขที่',
      flex: 0.8,
      minWidth: 100,
    },
    {
      field: 'from_date',
      headerName: 'วันที่ไป',
      flex: 0.8,
      minWidth: 100,
      valueGetter: (params) =>
        `${String(new Date(params.row.from_date).getUTCDate()).padStart(2, '0')}/${String(
          parseInt(new Date(params.row.from_date).getUTCMonth(), 10) + 1
        ).padStart(2, '0')}/${new Date(params.row.from_date).getUTCFullYear()}`,
    },
    {
      field: 'from_time',
      headerName: 'เวลาไป',
      flex: 0.6,
      minWidth: 60,
      valueGetter: (params) =>
        `${String(new Date(params.row.from_date).getUTCHours()).padStart(2, '0')}:${String(
          new Date(params.row.from_date).getUTCMinutes()
        ).padStart(2, '0')}`,
    },
    {
      field: 'to_date',
      headerName: 'วันที่กลับ',
      flex: 0.8,
      minWidth: 100,
      valueGetter: (params) =>
        `${String(new Date(params.row.to_date).getUTCDate()).padStart(2, '0')}/${String(
          parseInt(new Date(params.row.to_date).getUTCMonth(), 10) + 1
        ).padStart(2, '0')}/${new Date(params.row.to_date).getUTCFullYear()}`,
    },
    {
      field: 'to_time',
      headerName: 'เวลากลับ',
      flex: 0.6,
      minWidth: 60,
      valueGetter: (params) =>
        `${String(new Date(params.row.to_date).getUTCHours()).padStart(2, '0')}:${String(
          new Date(params.row.to_date).getUTCMinutes()
        ).padStart(2, '0')}`,
    },
    {
      field: 'req_name',
      headerName: 'ผู้ขอ',
      flex: 1,
      minWidth: 180,
    },
    {
      field: 'dept_name',
      headerName: 'แผนก',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'car_type_name',
      headerName: 'ประเภทรถ',
      flex: 0.8,
      minWidth: 100,
    },
    {
      field: 'place',
      headerName: 'สถานที่',
      flex: 1,
      minWidth: 150,
    },
  ];

  function QuickSearchToolbar() {
    return (
      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="flex-end"
        sx={{
          p: 0.5,
          pb: 0,
        }}
      >
        <GridToolbarQuickFilter />
      </Box>
    );
  }

  const [sched, setSched] = useState([]);
  const [pageSize, setPageSize] = useState(10);

  const [open, setOpen] = useState(false);

  const [permitRepDialg, setPermitRepDialg] = useState(false);
  const [denyDialg, setDenyDialg] = useState(false);
  const [permitRepData, setPermitRepData] = useState([]);
  const [openTaskDetail, setOpenTaskDetail] = useState(false);
  const [focusTask, setFocusTask] = useState('');
  const [noti, setNoti] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('token') !== null) {
      rToken = localStorage.getItem('token');
      refreshTable();
    }
  }, []);

  function refreshTable() {
    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_cbsPort}/getpermitreqsched`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setSched(data);
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.log('cancelled');
        } else {
          console.error('Error:', error);
        }
      });
  }

  return (
    <>
      <Helmet>
        <title> ระบบบริหารจัดการยานพาหนะ | MIH Center </title>
      </Helmet>

      <div>
        <CBSTaskDetail
          openDialg={openTaskDetail}
          onCloseDialg={() => {
            setOpenTaskDetail(false);
            setNoti(!noti);
          }}
          data={focusTask}
        />

        <CBSDenyDialg
          openDialg={denyDialg}
          onCloseDialg={() => {
            setDenyDialg(false);
            setNoti(!noti);
            refreshTable();
          }}
          data={permitRepData}
        />

        <CBSPermitRepDialg
          openDialg={permitRepDialg}
          onCloseDialg={() => {
            setPermitRepDialg(false);
            setNoti(!noti);
            refreshTable();
          }}
          data={permitRepData}
        />

        <MainHeader onOpenNav={() => setOpen(true)} />
        <CBSSidebar name="permitReq" openNav={open} onCloseNav={() => setOpen(false)} notiTrigger={noti} />

        {/* <!-- ======= Main ======= --> */}
        <main id="main" className="main">
          <div className="pagetitle">
            <h1>จัดการคำขอใช้รถ</h1>
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item my-2">
                  <a href="/intranet">หน้าหลัก</a>
                </li>
                <li className="breadcrumb-item my-2">
                  <a href="/cbsdashboard">หน้าหลักระบบบริหารจัดการยานพาหนะ</a>
                </li>
                <li className="breadcrumb-item my-2">จัดการคำขอใช้รถ</li>
              </ol>
            </nav>
          </div>
          {/* <!-- End Page Title --> */}
          <section className="section">
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body pt-3">
                    <h5 className="card-title">รายการขอใช้รถ</h5>
                    <StripedDataGrid
                      autoHeight
                      getRowHeight={() => 'auto'}
                      sx={{
                        [`& .${gridClasses.cell}`]: {
                          py: 1,
                        },
                      }}
                      columns={columns}
                      rows={sched}
                      pageSize={pageSize}
                      onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                      rowsPerPageOptions={[10, 25, 100]}
                      hideFooterSelectedRowCount
                      // onCellDoubleClick={(params) => { handleOpenFocusTaskDialog(params.row) }}
                      // onCellDoubleClick={(params) => { showDetail(params.row, true) }}
                      onCellDoubleClick={(params) => {
                        setFocusTask(params.row);
                        setOpenTaskDetail(true);
                      }}
                      initialState={{
                        columns: {
                          columnVisibilityModel: {
                            // Hide columns status and traderName, the other columns will remain visible
                            // id: false,
                          },
                        },
                      }}
                      components={{ Toolbar: QuickSearchToolbar }}
                    />
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

export default CBSReqPermit;
