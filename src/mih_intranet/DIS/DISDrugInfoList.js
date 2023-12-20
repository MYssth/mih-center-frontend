import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { Typography, styled, alpha, Button, Box, Stack } from '@mui/material';
import { DataGrid, gridClasses, GridToolbarQuickFilter } from '@mui/x-data-grid';
import MainHeader from '../components/MainHeader';
import MainSidebar from '../components/nav/MainSidebar';
import DISChgInfoDialg from './components/dialogs/form/DISChgInfoDialg';
import DISTemplateList from './components/dialogs/form/DISTemplateList';

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

function DISDrugInfoList() {
  const [open, setOpen] = useState(false);
  const [showActive, setShowActive] = useState(true);
  const [chgInfoDialg, setChgInfoDialg] = useState(false);
  const [tmpListDialg, setTmpListDialg] = useState(false);

  const [version, setVersion] = useState('');
  const [pageSize, setPageSize] = useState(25);
  const [drugInfoList, setDruginfoList] = useState([]);
  const [filterDrugInfoList, setFilterDrugInfoList] = useState([]);

  const [mode, setMode] = useState('');
  const [data, setData] = useState('');

  const [instGrp, setInstGrp] = useState([]);
  const [proptyGrp, setProptyGrp] = useState([]);
  const [warnGrp, setWarnGrp] = useState([]);

  function QuickSearchToolbar() {
    return (
      <Box
        sx={{
          p: 0.5,
          pb: 0,
        }}
      >
        <GridToolbarQuickFilter />
      </Box>
    );
  }

  const Columns = [
    {
      field: 'action',
      headerName: '',
      sortable: false,
      flex: 0.3,
      maxWidth: 110,
      minWidth: 110,

      renderCell: (params) => {
        const handleBttn = () => {
          setMode('edit');
          setData(params.row);
          setChgInfoDialg(true);
          //   setPRHeader(params.row);
          //   setOpenPRData(true);
        };

        return (
          <Button size="small" variant="outlined" onClick={handleBttn}>
            แก้ไขข้อมูล
          </Button>
        );
      },
    },
    {
      field: 'id',
      headerName: 'รหัสยา',
      maxWidth: 110,
      minWidth: 110,
      flex: 1,
    },
    {
      field: 'name_en',
      headerName: 'ชื่อภาษาอังกฤษ',
      // maxWidth: 110,
      minWidth: 200,
      flex: 1,
    },
    {
      field: 'name_th',
      headerName: 'ชื่อภาษาไทย',
      // maxWidth: 110,
      minWidth: 200,
      flex: 1,
    },
    {
      field: 'prod_view',
      headerName: 'แสดงข้อมูลยา',
      // maxWidth: 110,
      minWidth: 200,
      flex: 1,
      renderCell: (params) => {
        const link = `${process.env.REACT_APP_disLinkInfo}${params.row.id}`;
        return (
          <a href={link} target="_blank" rel="noopener noreferrer">
            ดูหน้าข้อมูล
          </a>
        );
      },
    },
    {
      field: 'remark',
      headerName: 'หมายเหตุ',
      //   maxWidth: 100,
      minWidth: 200,
      flex: 1,
    },
  ];

  useEffect(() => {
    if (localStorage.getItem('token') !== null) {
      rToken = localStorage.getItem('token');

      refreshTable();

      fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_disPort}/getversion`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${rToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setVersion(data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }, []);

  useEffect(() => {
    filterList(drugInfoList);
  }, [showActive]);

  const refreshTable = () => {
    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_disPort}/getalldruginfo`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setDruginfoList(data);
        filterList(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_disPort}/getinstgrp`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setInstGrp(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_disPort}/getproptygrp`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setProptyGrp(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_disPort}/getwarngrp`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setWarnGrp(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const filterList = (data) => {
    if (showActive) {
      setFilterDrugInfoList(data.filter((data) => data.inactive === null || data.inactive === '' || !data.inactive));
    } else {
      setFilterDrugInfoList(data.filter((data) => data.inactive));
    }
  };

  return (
    <>
      <Helmet>
        <title> ลงข้อมูลยาออนไลน์ | MIH Center </title>
      </Helmet>
      <MainHeader onOpenNav={() => setOpen(true)} />
      <MainSidebar name="disdruginfolist" openNav={open} onCloseNav={() => setOpen(false)} />
      <DISChgInfoDialg
        openDialg={chgInfoDialg}
        onCloseDialg={() => {
          setChgInfoDialg(false);
          refreshTable();
        }}
        rToken={rToken}
        mode={mode}
        data={data}
        instGrp={instGrp}
        proptyGrp={proptyGrp}
        warnGrp={warnGrp}
      />

      <DISTemplateList
        openDialg={tmpListDialg}
        onCloseDialg={() => {
          setTmpListDialg(false);
          refreshTable();
        }}
        onRefresh={() => {
          refreshTable();
        }}
        rToken={rToken}
        instGrp={instGrp}
        proptyGrp={proptyGrp}
        warnGrp={warnGrp}
      />

      <main id="main" className="main">
        <div className="pagetitle">
          <h1>ระบบข้อมูลยาออนไลน์ - Drug Info Service (DIS) version: {version}</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item my-2">
                <a href="/intranet">หน้าหลัก</a>
              </li>
              <li className="breadcrumb-item my-2">ระบบข้อมูลยาออนไลน์</li>
              {/* <li className="breadcrumb-item my-2">รายการข้อมูลยา</li> */}
            </ol>
          </nav>
        </div>

        {/* <!-- End Page Title --> */}
        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body pt-3">
                  <Typography sx={{ p: 1 }} variant="h6" id="tableTitle" component="div">
                    รายการข้อมูลยา - {showActive ? 'Active' : 'Inactive'}
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
                        <Button
                          className="btn btn-primary"
                          onClick={() => {
                            setTmpListDialg(true);
                          }}
                        >
                          จัดการ Template
                        </Button>
                      </Stack>
                    </Box>
                    <Box display="flex" justifyContent="flex-end" alignItems="flex-end" sx={{ width: 1 }}>
                      <Button
                        className="btn btn-success"
                        onClick={() => {
                          setMode('new');
                          setChgInfoDialg(true);
                        }}
                      >
                        เพิ่มข้อมูลยา
                      </Button>
                    </Box>
                  </Stack>

                  <div style={{ display: 'flex', height: '100%' }}>
                    <div style={{ flexGrow: 1 }}>
                      <StripedDataGrid
                        // getRowId={(row) => row.RQONO}
                        getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
                        autoHeight
                        getRowHeight={() => 'auto'}
                        sx={{
                          [`& .${gridClasses.cell}`]: {
                            py: 1,
                          },
                        }}
                        disableSelectionOnClick
                        columns={Columns}
                        rows={filterDrugInfoList}
                        // pageSize={10}
                        pageSize={pageSize}
                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                        components={{ Toolbar: QuickSearchToolbar }}
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

export default DISDrugInfoList;
