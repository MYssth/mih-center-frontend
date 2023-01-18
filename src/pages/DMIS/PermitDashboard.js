/* eslint-disable react-hooks/rules-of-hooks */
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
// @mui
import { DataGrid, gridClasses, GridToolbarQuickFilter } from '@mui/x-data-grid';
import {
  Container,
  Stack,
  Typography,
  Card,
  styled,
  alpha,
  Box,
  Button,
} from '@mui/material';

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

function QuickSearchToolbar() {
  return (
    <Box
      sx={{
        p: 0.5,
        pb: 0,
      }}
    >
      <GridToolbarQuickFilter />
      <Button variant="outlined" sx={{ ml: 1 }} startIcon={<Icon icon="ic:baseline-refresh" width="24" height="24" />} onClick={() => { window.location.reload(false); }} >Refresh</Button>
    </Box>
  );
}

export default function dmisnewcase() {

  const columns = [

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
      headerName: 'รายละเอียด',
      width: 210,
    },
    {
      field: 'issue_department_name',
      headerName: 'แผนก',
      width: 130,
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
    {
      field: 'task_note',
      headerName: 'หมายเหตุ',
      width: 150,
    },
    {
      field: 'status_name',
      headerName: 'สถานะ',
      width: 100,
    },
    {
      field: 'action',
      disableExport: true,
      headerName: '',
      width: 120,
      sortable: false,
      renderCell: (params) => {
        const onClick = () => {
          //   handleOpenTaskDialog(params.row.task_id, params.row.status_id, params.row.operator_id, params.row.level_id);
          // return alert(`you choose level = ${params.row.level_id}`);
        };

        // return <Button variant="contained" disabled={disableProcessTaskButton} onClick={onClick}>ดำเนินการ</Button>;
      },
    },
  ];

  // =========================================================

  const [pageSize, setPageSize] = useState(10);

  return (
    <>
      <Helmet>
        <title> แจ้งซ่อมอุปกรณ์ | MIH Center </title>
      </Helmet>

      <Container>

        <Typography variant="h4" sx={{ mb: 5 }}>
          ระบบแจ้งซ่อมอุปกรณ์ - Device Maintenance Inform Service(DMIS)
        </Typography>
        <Card>

          <Typography sx={{ flex: '1 1 100%', p: 1 }} variant="h6" id="tableTitle" component="div" >
            รายการงานรอตรวจสอบ
          </Typography>

          {/* <div style={{ display: 'flex', height: '100%' }}>
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
                rows={filterTaskList}
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
          </div> */}
        </Card>

      </Container>
    </>
  );
}