/* eslint-disable react-hooks/exhaustive-deps */
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
// @mui
import { Stack, Button, Typography, styled, alpha } from '@mui/material';
import { DataGrid, GridToolbar, gridClasses } from '@mui/x-data-grid';
// components
import MainHeader from '../components/MainHeader';
import MainSidebar from '../components/nav/MainSidebar';
import { PMSEditDialg } from './components';

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

const headSname = `${localStorage.getItem('sname')} Center`;

function PMSUserMgr() {
  const [open, setOpen] = useState(null);
  const [personnel, setPersonnel] = useState([]);
  const [focusPSN, setFocusPSN] = useState({});
  const [openEdit, setOpenEdit] = useState(false);

  const [levels, setLevels] = useState([]);
  const [levelViews, setLevelViews] = useState([]);

  const [pageSize, setPageSize] = useState(25);
  const [version, setVersion] = useState('');
  const [himsVersion, setHimsVersion] = useState('');

  const rToken = localStorage.getItem('token');

  const columns = [
    {
      field: 'id',
      headerName: 'เลขที่',
      minWidth: 50,
      flex: 1,
    },
    {
      field: 'psn_id',
      headerName: 'รหัสพนักงาน',
      minWidth: 100,
      flex: 0.5,
    },
    {
      field: 'fname',
      headerName: 'ชื่อ-นามสกุล',
      minWidth: 200,
      flex: 1,
      valueGetter: (params) => `${params.row.fname} ${params.row.lname}`,
    },
    {
      field: 'pos_name',
      headerName: 'ตำแหน่ง',
      minWidth: 200,
      flex: 1,
    },
    {
      field: 'dept_name',
      headerName: 'แผนก',
      minWidth: 150,
      flex: 1,
    },
    {
      field: 'fac_name',
      headerName: 'ฝ่าย',
      minWidth: 150,
      flex: 1,
    },
    {
      field: 'fld_name',
      headerName: 'สายงาน',
      minWidth: 150,
      flex: 1,
    },
    {
      field: 'action',
      headerName: '',
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        const handleEdit = () => {
          setFocusPSN(params.row);
          setOpenEdit(true);
        };

        return (
          <Stack direction={'row'} spacing={1} sx={{ mt: 1, mb: 1 }}>
            <Button variant="contained" onClick={handleEdit}>
              แก้ไข
            </Button>
            {/* <Button variant="outlined">ปลดล็อค</Button> */}
          </Stack>
        );
      },
    },
  ];

  useEffect(() => {
    refreshTable();

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_psnDataDistPort}/getlevels`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setLevels(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_psnDataDistPort}/getlevelviews`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setLevelViews(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_psnDataDistPort}/getversion`, {
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

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_himsPort}/getversion`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setHimsVersion(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  const refreshTable = () => {
    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_psnDataDistPort}/getactvpersonnel`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPersonnel(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <>
      <Helmet>
        <title> จัดการผู้ใช้ | {headSname} </title>
      </Helmet>
      <MainHeader onOpenNav={() => setOpen(true)} />
      <MainSidebar name="pmsusermgr" openNav={open} onCloseNav={() => setOpen(false)} />

      <PMSEditDialg
        openDialg={openEdit}
        onCloseDialg={() => {
          refreshTable();
          setOpenEdit(false);
        }}
        data={focusPSN}
        levels={levels}
        levelViews={levelViews}
        rToken={rToken}
      />

      <main id="main" className="main">
        <div className="pagetitle">
          <h1>
            ระบบจัดการผู้ใช้ - Personnel Management Service (PMS) version: {version} HIMS: {himsVersion}
          </h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item my-2">
                <a href="/intranet">หน้าหลัก</a>
              </li>
              <li className="breadcrumb-item my-2">จัดการผู้ใช้</li>
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
                    รายชื่อพนักงาน
                  </Typography>

                  <div style={{ display: 'flex', height: '100%' }}>
                    <div style={{ flexGrow: 1 }}>
                      <StripedDataGrid
                        getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
                        autoHeight
                        getRowHeight={() => 'auto'}
                        columns={columns}
                        rows={personnel}
                        pageSize={pageSize}
                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                        components={{
                          Toolbar: GridToolbar,
                        }}
                        initialState={{
                          columns: {
                            columnVisibilityModel: {
                              // Hide columns status and traderName, the other columns will remain visible
                              id: false,
                            },
                          },
                        }}
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

export default PMSUserMgr;
