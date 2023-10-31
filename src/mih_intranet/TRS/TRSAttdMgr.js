import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { Button, Typography, styled, alpha, Radio } from '@mui/material';
import { DataGrid, gridClasses, GridToolbar } from '@mui/x-data-grid';
import { format } from 'date-fns';
import MainHeader from '../components/MainHeader';
import TRSSidebar from './components/nav/TRSSidebar';
import TRSAttdDelDialg from './components/dialg/TRSAttdDelDialg';
import TRSAttdAddDialg from './components/dialg/TRSAttdAddDialg';

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

let psnId;
let disBtn = true;

function TRSAttdMgr() {
  const [open, setOpen] = useState(false);
  const [pageSize, setPageSize] = useState(25);
  const [topicList, setTopicList] = useState([]);
  const [subTopicList, setSubTopicList] = useState([]);
  const [subTopicFilter, setSubTopicFilter] = useState([]);
  const [attdList, setAttdList] = useState([]);
  const [attdFilter, setAttdFilter] = useState([]);
  const [attdByTopicList, setAttdByTopicList] = useState([]);
  const [isDup, setIsDup] = useState(false);

  const [selTopicRes, setSelTopicRes] = useState('');
  const [selTopicName, setSelTopicName] = useState('');
  const [selSubTopicRes, setSelSubTopicRes] = useState('');
  const [selSubTopicName, setSelSubTopicName] = useState('');
  const [isFull, setIsFull] = useState(false);

  const [openAttdDel, setOpenAttdDel] = useState(false);
  const [openAttdAdd, setOpenAttdAdd] = useState(false);
  const [focusTopic, setFocusTopic] = useState([]);

  const [psnList, setPsnList] = useState([]);

  let rToken = '';

  const topicListCol = [
    {
      field: 'action',
      headerName: '',
      sortable: false,
      flex: 0.3,
      maxWidth: 50,
      minWidth: 50,
      renderCell: (params) => <Radio checked={selTopicRes === params.id} value={params.id} />,
    },
    {
      field: 'id',
      headerName: 'เลขที่',
      maxWidth: 120,
      minWidth: 120,
      flex: 1,
    },
    // {
    //   field: 'start_date',
    //   headerName: 'วันเวลา',
    //   maxWidth: 200,
    //   minWidth: 200,
    //   flex: 1,
    // },
    {
      field: 'name',
      headerName: 'ชื่อเรื่อง',
      minWidth: 200,
      flex: 1,
    },
  ];

  const topicSubListCol = [
    {
      field: 'action',
      headerName: '',
      sortable: false,
      flex: 0.3,
      maxWidth: 50,
      minWidth: 50,
      renderCell: (params) => <Radio checked={selSubTopicRes === params.id} value={params.id} />,
    },
    {
      field: 'id',
      headerName: 'เลขที่',
      maxWidth: 50,
      minWidth: 50,
      flex: 1,
    },
    {
      field: 'date',
      headerName: 'วันที่',
      maxWidth: 100,
      minWidth: 100,
      flex: 1,
      valueGetter: (params) => `${format(new Date(params.row.start_date), 'dd/MM/yyyy')}`,
    },
    {
      field: 'start_time',
      headerName: 'จากเวลา',
      maxWidth: 70,
      minWidth: 70,
      flex: 1,
      valueGetter: (params) =>
        `${String(new Date(params.row.start_date).getUTCHours()).padStart(2, '0')}:${String(
          new Date(params.row.start_date).getUTCMinutes()
        ).padStart(2, '0')}`,
    },
    {
      field: 'end_time',
      headerName: 'ถึงเวลา',
      maxWidth: 70,
      minWidth: 70,
      flex: 1,
      valueGetter: (params) =>
        `${String(new Date(params.row.end_date).getUTCHours()).padStart(2, '0')}:${String(
          new Date(params.row.end_date).getUTCMinutes()
        ).padStart(2, '0')}`,
    },
    {
      field: 'name',
      headerName: 'ชื่อเรื่อง',
      minWidth: 200,
      flex: 1,
    },
    {
      field: 'attd',
      headerName: 'จำนวนผู้ร่วมกิจกรรม',
      minWidth: 150,
      maxWidth: 150,
      flex: 1,
      valueGetter: (params) => `${params.row.attd ?? 0}/${params.row.lmt}`,
    },
  ];

  const attdListCol = [
    {
      field: 'action',
      headerName: '',
      sortable: false,
      flex: 0.3,
      maxWidth: 60,
      minWidth: 60,

      renderCell: (params) => {
        const handleAttdDel = () => {
          setFocusTopic(params.row);
          setOpenAttdDel(true);
        };

        return (
          <button className="btn btn-danger" onClick={handleAttdDel}>
            ลบ
          </button>
        );
      },

      // renderCell: (params) => <button className="btn btn-danger" onClick={}>ลบ</button>,
    },
    {
      field: 'psn_id',
      headerName: 'รหัสพนักงาน',
      maxWidth: 100,
      minWidth: 100,
      flex: 1,
    },
    {
      field: 'psn_name',
      headerName: 'ชื่อ',
      // maxWidth: 200,
      minWidth: 200,
      flex: 1,
    },
    {
      field: 'pos_name',
      headerName: 'ตำแหน่ง',
      // maxWidth: 200,
      minWidth: 200,
      flex: 1,
    },
    {
      field: 'dept_name',
      headerName: 'แผนก',
      // maxWidth: 200,
      minWidth: 200,
      flex: 1,
    },
  ];

  useEffect(() => {
    if (localStorage.getItem('token') !== null) {
      rToken = localStorage.getItem('token');
      psnId = jwtDecode(localStorage.getItem('token')).psn_id;
      refreshTable();
    }
  }, []);

  useEffect(() => {
    if (attdFilter.length !== 0) {
      disBtn = false;
      fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_trsPort}/getattdbytopic/${selTopicRes}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${rToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setAttdByTopicList(data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }, [attdFilter]);

  async function refreshTable() {
    setSelTopicRes('');
    setSelTopicName('');
    setSelSubTopicRes('');
    setSelSubTopicName('');
    setSubTopicFilter([]);
    setAttdFilter([]);
    setAttdByTopicList([]);
    setIsFull(false);
    setIsDup(false);

    disBtn = true;

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_psnDataDistPort}/getactvpersonnel`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPsnList(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_trsPort}/gettopiclist`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setTopicList(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_trsPort}/getsubtopiclist`, {
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

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_trsPort}/getattdpsn`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setAttdList(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  return (
    <>
      <Helmet>
        <title> จัดการผู้เข้าร่วมกิจกรรม | MIH Center </title>
      </Helmet>
      <MainHeader onOpenNav={() => setOpen(true)} />
      <TRSSidebar name="trsattdmgr" openNav={open} onCloseNav={() => setOpen(false)} />
      <TRSAttdDelDialg
        openDialg={openAttdDel}
        onCloseDialg={() => {
          refreshTable();
          setOpenAttdDel(false);
        }}
        topic={focusTopic}
        psnId={psnId}
        rToken={rToken}
      />

      <TRSAttdAddDialg
        openDialg={openAttdAdd}
        onCloseDialg={() => {
          refreshTable();
          setOpenAttdAdd(false);
        }}
        topic={focusTopic}
        psnList={psnList}
        attdByTopicList={attdByTopicList}
        rToken={rToken}
      />

      <main id="main" className="main">
        <div className="pagetitle">
          <h1>จัดการผู้เข้าร่วมกิจกรรม</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item my-2">
                <a href="/intranet">หน้าหลัก</a>
              </li>
              <li className="breadcrumb-item my-2">จัดการผู้เข้าร่วมกิจกรรม</li>
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
                    เลือกหัวข้อกิจกรรม
                  </Typography>
                  <div style={{ display: 'flex', height: '100%' }}>
                    <div style={{ flexGrow: 1 }}>
                      <StripedDataGrid
                        getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
                        autoHeight
                        getRowHeight={() => 'auto'}
                        columns={topicListCol}
                        rows={topicList}
                        pageSize={pageSize}
                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                        selectionModel={selTopicRes}
                        onSelectionModelChange={(newSelectionModel) => {
                          disBtn = true;
                          setSelTopicRes(newSelectionModel[0]);
                          setSelTopicName(topicList.find((data) => data.id === newSelectionModel[0])?.name);
                          setSubTopicFilter(subTopicList.filter((data) => data.topic_id === newSelectionModel[0]));
                        }}
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

                  <Typography sx={{ flex: '1 1 100%', p: 1 }} variant="h6" id="tableTitle" component="div">
                    เลือกรุ่นของหัวข้อกิจกรรม {selTopicName}
                  </Typography>
                  <div style={{ display: 'flex', height: '100%' }}>
                    <div style={{ flexGrow: 1 }}>
                      <StripedDataGrid
                        getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
                        autoHeight
                        getRowHeight={() => 'auto'}
                        columns={topicSubListCol}
                        rows={subTopicFilter}
                        pageSize={pageSize}
                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                        selectionModel={selTopicRes}
                        onSelectionModelChange={(newSelectionModel) => {
                          setSelSubTopicRes(newSelectionModel[0]);
                          setSelSubTopicName(
                            subTopicList.find(
                              (data) => data.id === newSelectionModel[0] && data.topic_id === selTopicRes
                            )?.name
                          );
                          setIsFull(
                            subTopicList.find(
                              (data) =>
                                data.id === newSelectionModel[0] &&
                                data.topic_id === selTopicRes &&
                                data.attd < data.lmt
                            ) === undefined
                          );
                          setAttdFilter(
                            attdList.filter(
                              (data) => data.topic_id === selTopicRes && data.sub_id === newSelectionModel[0]
                            )
                          );
                        }}
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

                  <Typography sx={{ flex: '1 1 100%', p: 1 }} variant="h6" id="tableTitle" component="div">
                    รายชื่อผู้เข้ากิจกรรม {selTopicName} {selSubTopicName}
                  </Typography>
                  <div style={{ display: 'flex', height: '100%' }}>
                    <div style={{ flexGrow: 1 }}>
                      <StripedDataGrid
                        getRowId={(row) => `${row.topic_id}${row.psn_id}`}
                        getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
                        autoHeight
                        getRowHeight={() => 'auto'}
                        sx={{
                          [`& .${gridClasses.cell}`]: {
                            py: 1,
                          },
                        }}
                        columns={attdListCol}
                        rows={attdFilter}
                        pageSize={pageSize}
                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                        hideFooterSelectedRowCount
                        components={{
                          Toolbar: GridToolbar,
                          // Toolbar: CustomToolbar,
                        }}
                        componentsProps={{
                          toolbar: {
                            // printOptions: { hideFooter: true, hideToolbar: true },
                            csvOptions: { utf8WithBom: true },
                          },
                        }}
                      />
                    </div>
                  </div>
                  <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    // disabled={disBtn || isFull}
                    disabled={disBtn}
                    onClick={() => {
                      setFocusTopic(subTopicFilter.find((data) => data.sub_id === selSubTopicRes));
                      setOpenAttdAdd(true);
                    }}
                  >
                    เพิ่มผู้เข้าร่วมกิจกรรม
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default TRSAttdMgr;
