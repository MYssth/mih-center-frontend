import { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, alpha, styled } from '@mui/material';
import { DataGrid, gridClasses, GridToolbarQuickFilter } from '@mui/x-data-grid';
import DISChgTmptDialg from './DISChgTmptDialg';

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

function DISTemplateList({ openDialg, onCloseDialg, onRefresh, instGrp, proptyGrp, warnGrp, rToken }) {
  const [filterInstGrp, setFilterInstGrp] = useState([]);
  const [filterProptyGrp, setFilterProptyGrp] = useState([]);
  const [filterWarnGrp, setFilterWarnGrp] = useState([]);

  const [showActive, setShowActive] = useState(true);

  const [openChgTmptDialg, setOpenChgTmptDialg] = useState(false);
  const [data, setData] = useState({});
  const [tag, setTag] = useState('inst');
  const [mode, setMode] = useState('');

  useEffect(() => {
    setFilterInstGrp([]);
    setFilterProptyGrp([]);
    setFilterWarnGrp([]);
    setShowActive(true);
    setData({});
    setTag('inst');
    setMode('');
    if (openDialg) {
      filterList();
    }
  }, [openDialg]);

  useEffect(() => {
    filterList();
  }, [showActive, instGrp, proptyGrp, warnGrp]);

  const filterList = () => {
    if (showActive) {
      setFilterInstGrp(instGrp.filter((data) => data.inactive === null || data.inactive === '' || !data.inactive));
      setFilterProptyGrp(proptyGrp.filter((data) => data.inactive === null || data.inactive === '' || !data.inactive));
      setFilterWarnGrp(warnGrp.filter((data) => data.inactive === null || data.inactive === '' || !data.inactive));
    } else {
      setFilterInstGrp(instGrp.filter((data) => data.inactive));
      setFilterProptyGrp(proptyGrp.filter((data) => data.inactive));
      setFilterWarnGrp(warnGrp.filter((data) => data.inactive));
    }
  };

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
          setData(params.row);
          setMode('edit');
          setOpenChgTmptDialg(true);
        };

        return (
          <Button size="small" variant="outlined" onClick={handleBttn}>
            แก้ไขข้อมูล
          </Button>
        );
      },
    },
    {
      field: 'name',
      headerName: 'ชื่อ',
      // maxWidth: 110,
      minWidth: 200,
      flex: 1,
    },
    {
      field: 'remark',
      headerName: 'หมายเหตุ',
      //   maxWidth: 100,
      minWidth: 200,
      flex: 1,
    },
  ];

  return (
    <>
      <DISChgTmptDialg
        openDialg={openChgTmptDialg}
        onCloseDialg={() => {
          setOpenChgTmptDialg(false);
          onRefresh();
        }}
        rToken={rToken}
        mode={mode}
        tag={tag}
        data={data}
      />

      <Dialog open={openDialg} onClose={onCloseDialg} fullWidth>
        <DialogTitle>จัดการ Template</DialogTitle>
        <DialogContent>
          <ul className="nav nav-tabs nav-tabs-bordered">
            <li className="nav-item">
              <button
                className="nav-link active"
                data-bs-toggle="tab"
                data-bs-target="#inst"
                onClick={() => {
                  setTag('inst');
                }}
              >
                วิธีใช้
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link"
                data-bs-toggle="tab"
                data-bs-target="#propty"
                onClick={() => {
                  setTag('propty');
                }}
              >
                รายละเอียดยา
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link"
                data-bs-toggle="tab"
                data-bs-target="#warn"
                onClick={() => {
                  setTag('warn');
                }}
              >
                ข้อควรระวัง
              </button>
            </li>
          </ul>
          <div className="tab-content pt-3">
            <div className="tab-pane fade show active profile-overview pt-2" id="inst">
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
                columns={Columns}
                rows={filterInstGrp}
                pageSize={10}
                components={{ Toolbar: QuickSearchToolbar }}
                componentsProps={{
                  toolbar: {
                    printOptions: { hideFooter: true, hideToolbar: true },
                    csvOptions: { utf8WithBom: true },
                  },
                }}
              />
            </div>
            <div className="tab-pane fade profile-overview pt-2" id="propty">
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
                columns={Columns}
                rows={filterProptyGrp}
                pageSize={10}
                components={{ Toolbar: QuickSearchToolbar }}
                componentsProps={{
                  toolbar: {
                    printOptions: { hideFooter: true, hideToolbar: true },
                    csvOptions: { utf8WithBom: true },
                  },
                }}
              />
            </div>
            <div className="tab-pane fade profile-overview pt-2" id="warn">
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
                columns={Columns}
                rows={filterWarnGrp}
                pageSize={10}
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
        </DialogContent>
        <DialogActions>
          <Button
            className={showActive ? 'btn btn-danger' : 'btn btn-success'}
            onClick={() => {
              setShowActive(!showActive);
            }}
          >
            {showActive ? 'แสดง Inactive' : 'แสดง Active'}
          </Button>
          <div style={{ flex: '1 0 0' }} />
          <Button
            onClick={() => {
              setMode('new');
              setOpenChgTmptDialg(true);
            }}
            className="btn btn-success"
          >
            เพิ่ม Template
          </Button>
          <Button onClick={onCloseDialg} color="error">
            ปิด
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default DISTemplateList;
