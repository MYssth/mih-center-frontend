import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { Typography, styled, alpha, Button, Stack, Box } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { format } from 'date-fns';
import MainHeader from '../components/MainHeader';
import TRSSidebar from './components/nav/TRSSidebar';
import TRSTopicMgrDialg from './components/dialg/TRSTopicMgrDialg';

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

function TRSTopicMgr() {
  const [open, setOpen] = useState(false);
  const [pageSize, setPageSize] = useState(25);
  const [showActive, setShowActive] = useState(true);

  const [topicList, setTopicList] = useState([]);
  const [filterTopicList, setFilterTopicList] = useState([]);

  const [subTopicList, setSubTopicList] = useState([]);

  const [mode, setMode] = useState('');
  const [data, setData] = useState({});
  const [topicMgrDialg, setTopicMgrDialg] = useState(false);

  const topicListCol = [
    {
      field: 'action',
      disableExport: true,
      headerName: '',
      minWidth: 100,
      maxWidth: 100,
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        const onClick = (e) => {
          e.stopPropagation(); // don't select this row after clicking
          setMode('edit');
          setData(params.row);
          setTopicMgrDialg(true);
        };

        return (
          <Button variant="outlined" onClick={onClick}>
            แก้ไข
          </Button>
        );
      },
    },
    {
      field: 'id',
      headerName: 'เลขที่',
      maxWidth: 120,
      minWidth: 120,
      flex: 1,
    },
    {
      field: 'start_sdate',
      headerName: 'เปิดวันที่',
      maxWidth: 100,
      minWidth: 100,
      flex: 1,
      // valueGetter: (params) => `${format(new Date(params.row.start_date), 'dd/MM/yyyy')}`,
      valueGetter: (params) =>
        `${new Date(params.row.start_sdate).getUTCDate()}/${
          new Date(params.row.start_sdate).getUTCMonth() + 1
        }/${new Date(params.row.start_sdate).getUTCFullYear()}`,
    },
    {
      field: 'end_sdate',
      headerName: 'ถึงวันที่',
      maxWidth: 100,
      minWidth: 100,
      flex: 1,
      // valueGetter: (params) => `${format(new Date(params.row.start_date), 'dd/MM/yyyy')}`,
      valueGetter: (params) =>
        `${new Date(params.row.end_sdate).getUTCDate()}/${new Date(params.row.end_sdate).getUTCMonth() + 1}/${new Date(
          params.row.end_sdate
        ).getUTCFullYear()}`,
    },
    {
      field: 'name',
      headerName: 'ชื่อเรื่อง',
      minWidth: 200,
      flex: 1,
    },
  ];

  useEffect(() => {
    if (localStorage.getItem('token') !== null) {
      rToken = localStorage.getItem('token');

      refreshTable();
    }
  }, []);

  useEffect(() => {
    filterList(topicList);
  }, [showActive]);

  const refreshTable = () => {
    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_trsPort}/getalltopiclist`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setTopicList(data);
        filterList(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_trsPort}/getallsubtopiclist`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setSubTopicList(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const filterList = (data) => {
    if (showActive) {
      setFilterTopicList(data.filter((data) => data.isactive));
    } else {
      setFilterTopicList(data.filter((data) => data.isactive === null || data.isactive === '' || !data.isactive));
    }
  };

  return (
    <>
      <Helmet>
        <title> จัดการหัวข้อกิจกรรม | MIH Center </title>
      </Helmet>
      <MainHeader onOpenNav={() => setOpen(true)} />
      <TRSSidebar name="trstopicmgr" openNav={open} onCloseNav={() => setOpen(false)} />

      <TRSTopicMgrDialg
        openDialg={topicMgrDialg}
        onCloseDialg={() => {
          setMode('');
          setTopicMgrDialg(false);
          refreshTable();
        }}
        onRefresh={() => {
          refreshTable();
        }}
        rToken={rToken}
        mode={mode}
        data={data}
        subTopicList={subTopicList}
      />

      <main id="main" className="main">
        <div className="pagetitle">
          <h1>จัดการหัวข้อกิจกรรม</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item my-2">
                <a href="/intranet">หน้าหลัก</a>
              </li>
              <li className="breadcrumb-item my-2">
                <a href="/trsdashboard">หน้าหลักระบบลงทะเบียนร่วมกิจกรรม</a>
              </li>
              <li className="breadcrumb-item my-2">จัดการหัวข้อกิจกรรม</li>
            </ol>
          </nav>
        </div>

        {/* <!-- End Page Title --> */}
        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body pt-3">
                  <Typography sx={{ flex: '1 1 100%', p: 1 }} variant="h6" id="tableTitle" component="div">
                    รายการกิจกรรม - {showActive ? 'Active' : 'Inactive'}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Box display="flex" sx={{ width: '100%', height: '100%' }}>
                      <Stack direction={{ sm: 'row' }} spacing={1} rowGap={1}>
                        <Button
                          className={showActive ? 'btn btn-danger' : 'btn btn-success'}
                          onClick={() => {
                            setShowActive(!showActive);
                          }}
                        >
                          {showActive ? 'แสดง Inactive' : 'แสดง Active'}
                        </Button>
                      </Stack>
                    </Box>
                    <Box display="flex" justifyContent="flex-end" alignItems="flex-end" sx={{ width: 1 }}>
                      <Button
                        className="btn btn-success"
                        onClick={() => {
                          setMode('new');
                          setTopicMgrDialg(true);
                        }}
                      >
                        เพิ่มกิจกรรมใหม่
                      </Button>
                    </Box>
                  </Stack>
                  <div style={{ display: 'flex', height: '100%' }}>
                    <div style={{ flexGrow: 1 }}>
                      <StripedDataGrid
                        getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
                        autoHeight
                        getRowHeight={() => 'auto'}
                        sx={{
                          [`& .${gridClasses.cell}`]: {
                            py: 1,
                          },
                        }}
                        columns={topicListCol}
                        rows={filterTopicList}
                        pageSize={pageSize}
                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                        hideFooterSelectedRowCount
                        componentsProps={{
                          toolbar: {
                            printOptions: { hideFooter: true, hideToolbar: true },
                            csvOptions: { utf8WithBom: true },
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default TRSTopicMgr;
