/* eslint-disable react-hooks/rules-of-hooks */
import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Stack, Typography, Card } from '@mui/material';

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
                        รายการงานรอตรวจสอบ/ยืนยัน
                    </Typography>

                    <Stack spacing={2} sx={{ width: 'auto', p: 2 }}>
                        This is temp page
                    </Stack>
                </Card>

            </Container>
        </>
    );
}