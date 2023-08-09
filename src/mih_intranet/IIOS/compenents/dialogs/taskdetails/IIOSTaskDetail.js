/* eslint-disable react/prop-types */
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, styled, Box } from '@mui/material';
import reportPDF from '../../report-pdf';

const Item = styled('div')(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: 'left',
}));

function ShowDetail({ openDialg, onCloseDialg, data }) {
  return (
    <>
      <Dialog fullWidth maxWidth="md" open={openDialg} onClose={onCloseDialg}>
        <DialogTitle>รายละเอียดงานแจ้งปัญหาออนไลน์</DialogTitle>
        <DialogContent>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>สถานะ:</Item>
              </Grid>
              <Grid item xs={8}>
                {/* <Item>{data?.status_name}</Item> */}
                <Item>{`${
                  data?.status_id === 0
                    ? data?.status_name
                    : data?.task_iscomplete === null || data?.task_iscomplete === ''
                    ? data?.status_id_request === null || data?.status_id_request === ''
                      ? data?.status_name
                      : `${data?.status_name} (รออนุมัติ - ${data?.status_name_request})`
                    : data?.audit_id === null || data?.audit_id === ''
                    ? data?.status_id === 3
                      ? `เปลี่ยนอะไหล่ (ยังไม่ตรวจรับ)`
                      : `${data?.status_name} (ยังไม่ตรวจรับ)`
                    : data?.status_id === 5 || data?.status_id === 0
                    ? data?.status_name
                    : data?.status_id === 3
                    ? `ดำเนินการเสร็จสิ้น (เปลี่ยนอะไหล่)`
                    : `ดำเนินการเสร็จสิ้น (${data?.status_name})`
                }`}</Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>เลขที่เอกสาร:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{data?.task_id}</Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>ประเภทงาน:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>
                  {data?.level_id === 'DMIS_IT' ? 'IT' : data?.level_id === 'DMIS_MT' ? 'ซ่อมบำรุง' : 'เครื่องมือแพทย์'}
                </Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>วันที่แจ้ง:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>
                  {data?.task_date_start ? (data?.task_date_start).replace('T', ' ').replace('.000Z', ' น.') : ''}
                </Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>แผนกที่แจ้งปัญหา:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{data?.issue_department_name}</Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>รายละเอียดงานที่แจ้ง:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{data?.task_issue}</Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>Serial Number:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{data?.task_serialnumber}</Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>รหัสทรัพย์สิน:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{data?.task_device_id}</Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>ผู้แจ้ง:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>
                  {data?.informer_firstname} {data?.informer_lastname}
                </Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>เบอร์โทรติดต่อ:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{data?.task_phone_no}</Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>วันที่รับเรื่อง:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>
                  {data?.task_date_accept ? (data?.task_date_accept).replace('T', ' ').replace('.000Z', ' น.') : ''}
                </Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>เวลาดำเนินงาน:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{data?.estimation_name}</Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>ผู้รับเรื่อง:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>
                  {data?.receiver_firstname} {data?.receiver_lastname}
                </Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>วันที่ดำเนินการล่าสุด:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>
                  {data?.task_date_process ? (data?.task_date_process).replace('T', ' ').replace('.000Z', ' น.') : ''}
                </Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>ผู้รับผิดชอบ:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>
                  {data?.operator_firstname} {data?.operator_lastname}
                </Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>หมายเหตุ:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{data?.task_note}</Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>วันที่เสร็จสิ้น:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>
                  {data?.task_date_end ? (data?.task_date_end).replace('T', ' ').replace('.000Z', ' น.') : ''}
                </Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>รายละเอียดการแก้ไขปัญหา:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{data?.task_solution}</Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ textAlign: 'right' }}>งบประมาณที่ใช้:</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>{data?.task_cost}</Item>
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

export default ShowDetail;
