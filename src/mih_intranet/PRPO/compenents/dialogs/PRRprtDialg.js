/* eslint-disable react/prop-types */
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Grid,
  Box,
  Typography,
} from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';

const moment = require('moment');

moment.locale('th');

function PRRprtDialg({ openDialg, onCloseDialg, PRHeader, PRDetail }) {
  const col = [
    {
      field: 'id',
      headerName: 'ลำดับ',
      maxWidth: 60,
      minWidth: 60,
      flex: 1,
      valueGetter: (params) => PRDetail.findIndex((data) => data.ITMNO === params.row.ITMNO) + 1,
    },
    {
      field: 'PRDNAM',
      headerName: 'รายการ',
      // maxWidth: 110,
      minWidth: 250,
      flex: 1,
      renderCell: (params) => {
        return (
          <div>
            <div>{params.row.PRDNAM}</div>
            {params.row.REMARK ? <div>หมายเหตุ : {params.row.REMARK}</div> : ''}
          </div>
        );
      },
    },
    {
      field: 'QTY',
      headerName: 'Qty',
      // maxWidth: 110,
      minWidth: 100,
      flex: 1,
      valueGetter: (params) => params.row.QTY.toLocaleString(),
    },
    {
      field: 'CVF',
      headerName: 'Cvf',
      // maxWidth: 110,
      minWidth: 100,
      flex: 1,
      valueGetter: (params) => params.row.CVF.toLocaleString(),
    },
    {
      field: 'PRDUP',
      headerName: 'ราคา',
      // maxWidth: 110,
      minWidth: 100,
      flex: 1,
      valueGetter: (params) => params.row.PRDUP.toLocaleString(),
    },
    {
      field: 'TOTAL',
      headerName: 'ราคารวม',
      // maxWidth: 110,
      minWidth: 100,
      flex: 1,
      valueGetter: (params) => params.row.TOTAL.toLocaleString(),
    },
  ];

  if (PRDetail.length === 0 || PRDetail === null) {
    return (
      <Dialog
        fullWidth
        maxWidth="md"
        open={openDialg}
        onClose={() => {
          onCloseDialg();
        }}
      >
        <DialogTitle>ข้อมูล PR</DialogTitle>
        <DialogContent>
          <DialogContentText>Loading...</DialogContentText>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog
        fullWidth
        maxWidth="md"
        open={openDialg}
        onClose={() => {
          onCloseDialg();
        }}
      >
        <DialogTitle>ข้อมูล PR</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Grid container spacing={1}>
              <Grid item xs={5} sm={3} md={2}>
                เลขที่เอกสาร :
              </Grid>
              <Grid item xs={7} sm={9} md={10}>
                {PRHeader.RQONO}
              </Grid>
              <Grid item xs={5} sm={3} md={2}>
                วันที่:
              </Grid>
              <Grid item xs={7} sm={9} md={10}>
                {moment(PRDetail[0].RQODTE, 'YYYYMMDD').format('DD MMMM YYYY')}
              </Grid>
              <Grid item xs={5} sm={3} md={2}>
                หน่วยงานที่ขอ:
              </Grid>
              <Grid item xs={7} sm={9} md={10}>
                {PRHeader.DIVNAM}
              </Grid>
              <Grid item xs={5} sm={3} md={2}>
                ผู้สอบทาน:
              </Grid>
              <Grid item xs={7} sm={9} md={10}>
                {PRHeader.ISTNAM}
              </Grid>
              <Grid item xs={12}>
                จำนวนรายการทั้งหมด {PRDetail.length} รายการ ดังนี้
              </Grid>
              <Grid item xs={12}>
                <DataGrid
                  getRowId={(row) => row.ITMNO}
                  getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
                  autoHeight
                  getRowHeight={() => 'auto'}
                  sx={{
                    [`& .${gridClasses.cell}`]: {
                      py: 1,
                    },
                  }}
                  disableSelectionOnClick
                  columns={col}
                  rows={PRDetail}
                  pageSize={10}
                  componentsProps={{
                    toolbar: {
                      printOptions: { hideFooter: true, hideToolbar: true },
                      csvOptions: { utf8WithBom: true },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h4" color={'error'} sx={{ justifyContent: 'flex-end' }}>
                    รวม {PRHeader.NETAMT.toLocaleString()} บาท
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                หมายเหตุ :
              </Grid>
              <Grid item xs={12}>
                {PRHeader.REMARK}
              </Grid>
            </Grid>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default PRRprtDialg;
