/* eslint-disable react/prop-types */
import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  styled,
  alpha,
} from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { SubmtERR } from '../../../components/dialogs/response';

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

function TRSAttdShowDialg({ openDialg, onCloseDialg, attdList, subName }) {
  // const rToken = localStorage.getItem('token');

  const [submitERR, setSubmitERR] = useState(false);

  // console.log(jsonData);

  const attdListCol = [
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

  return (
    <>
      <SubmtERR openDialg={submitERR} onCloseDialg={() => setSubmitERR(false)} />
      <Dialog
        fullWidth
        maxWidth="md"
        open={openDialg}
        onClose={() => {
          onCloseDialg();
        }}
      >
        <DialogTitle>รายชื่อผู้เข้าร่วม {subName}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <StripedDataGrid
              getRowId={(row) => row.psn_id}
              getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
              autoHeight
              getRowHeight={() => 'auto'}
              sx={{
                [`& .${gridClasses.cell}`]: {
                  py: 1,
                },
              }}
              columns={attdListCol}
              rows={attdList}
              pageSize={10}
              hideFooterSelectedRowCount
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseDialg}>ปิด</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default TRSAttdShowDialg;
