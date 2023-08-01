import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, styled, Box } from '@mui/material';
import reportPDF from '../../pdf';

const Item = styled('div')(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: 'left',
}));

function CBSTaskDetail({ openDialg, onCloseDialg, data }) {
  return (
    <>
      <Dialog fullWidth maxWidth="md" open={openDialg} onClose={onCloseDialg}>
        <DialogTitle>รายละเอียดคำขอใช้รถ</DialogTitle>
        <DialogContent>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>เลขที่:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{data?.id}</Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>เลขที่กลุ่มงาน:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{data?.grp_id}</Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>สถานะ:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{data?.status_name}</Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>จากวันที่:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>
                  {data?.from_date ? (data?.from_date).replace("T", " ").replace(".000Z", " น.") : ""}
                </Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>ถึงวันที่:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>
                {data?.to_date ? (data?.to_date).replace("T", " ").replace(".000Z", " น.") : ""}
                </Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>สถานที่:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{data?.place}</Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>จังหวัด:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{data?.province}</Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>จำนวนผู้โดยสาร:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{data?.pax_amt}</Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>รายละเอียด:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{data?.detail}</Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>เบอร์โทรติดต่อ:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{data?.tel_no}</Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>ผู้ขอใช้รถ:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{data?.req_name}</Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>แผนก:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{data?.dept_name}</Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>วันที่ขอใช้รถ:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>
                {data?.req_date ? (data?.req_date).replace("T", " ").replace(".000Z", " น.") : ""}
                </Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>ประเภทรถ:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{data?.car_type_name}</Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>รถที่ใช้:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{data?.car_name}</Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>พนักงานขับรถ:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{data?.drv_name}</Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>พนักงานขับรถ:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{data?.drv_name}</Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>ผู้รับคำขอใช้รถ:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{data?.rcv_name}</Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>วันที่รับคำขอใช้รถ:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>
                {data?.rcv_date ? (data?.rcv_date).replace("T", " ").replace(".000Z", " น.") : ""}
                </Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>ผู้อนุมัติคำขอใช้รถ:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{data?.permit_name}</Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>วันที่อนุมัติคำขอใช้รถ:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>
                {data?.permit_date ? (data?.permit_date).replace("T", " ").replace(".000Z", " น.") : ""}
                </Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>หมายเหตุ:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{data?.note}</Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>วันที่ไป:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>
                {data?.dep_date ? (data?.dep_date).replace("T", " ").replace(".000Z", " น.") : ""}
                </Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>เลขไมล์ขาไป:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{data?.dep_mi}</Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>วันที่กลับ:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>
                {data?.arr_date ? (data?.arr_date).replace("T", " ").replace(".000Z", " น.") : ""}
                </Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>เลขไมล์ขากลับ:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{data?.arr_mi}</Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>ผู้บันทึก:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{data?.rec_name}</Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>วันที่บันทึก:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>
                {data?.rec_date ? (data?.rec_date).replace("T", " ").replace(".000Z", " น.") : ""}
                </Item>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseDialg}>ปิดหน้าต่าง</Button>
          <Button
            onClick={() => {
              reportPDF(data);
            }}
          >
            ปริ้นเอกสาร
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CBSTaskDetail;
