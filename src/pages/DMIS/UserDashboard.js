import { useEffect, useState } from 'react';
import jwtDecode from "jwt-decode";
import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Typography, Card, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Stack, CardActionArea, CardContent, TablePagination } from '@mui/material';

// ----------------------------------------------------------------------

export default function UserDashboard() {
  const [taskList, setTaskList] = useState([]);
  const [completeTaskList, setCompleteTaskList] = useState([]);
  const [filterTaskList, setFilterTaskList] = useState([]);
  const [filterStatusId, setFilterStatusId] = useState('all');
  const [taskCount, setTaskCount] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {

    const token = jwtDecode(localStorage.getItem('token'));

    for (let i = 0; i < token.level_list.length; i += 1) {
      if (token.level_list[i].level_id === "DMIS_U1" ||
        token.level_list[i].level_id === "DMIS_U2" ||
        token.level_list[i].level_id === "DMIS_U3" ||
        token.level_list[i].level_id === "DMIS_U4" ||
        token.level_list[i].level_id === "DMIS_IT" ||
        token.level_list[i].level_id === "DMIS_MT") {

        fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dmisPort}/api/dmis/gettasklist/${token.personnel_id}/${token.level_list[i].level_id}/${true}`)
          .then((response) => response.json())
          .then((data) => {
            setTaskList(data);
            setFilterTaskList(data);
          })
          .catch((error) => {
            console.error('Error:', error);
          });

        fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dmisPort}/api/dmis/counttask/${token.personnel_id}/${token.level_list[i].level_id}/${true}`)
          .then((response) => response.json())
          .then((data) => {
            setTaskCount(data);
          })
          .catch((error) => {
            console.error('Error:', error);
          });

        fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dmisPort}/api/dmis/getcompletetasklist/${token.personnel_id}/${token.level_list[i].level_id}/${true}`)
          .then((response) => response.json())
          .then((data) => {
            setCompleteTaskList(data);
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      }
    }

  }, []);

  useEffect(() => {
    if (filterStatusId === 5) {
      setFilterTaskList(completeTaskList);
    }
    else {
      setFilterTaskList(filterStatusId === 'all' ? taskList : taskList.filter(dt => dt.status_id === filterStatusId));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatusId])

  return (
    <>
      <Helmet>
        <title> หน้าหลัก | MIH Center </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          ระบบแจ้งซ่อมอุปกรณ์ - Device Maintenance Inform Service(DMIS)
        </Typography>

        <Stack direction="row" align="center" sx={{ margin: 1, maxHeight: 100 }}>
          <Card sx={{ width: 200, mr: 2, backgroundColor: 'error.main' }}>
            <CardActionArea onClick={() => setFilterStatusId(1)}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  รอรับเรื่อง
                </Typography>
                <Typography variant="body1">
                  {taskCount.inform} รายการ
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card sx={{ width: 200, mr: 2, backgroundColor: 'warning.main' }}>
            <CardActionArea onClick={() => setFilterStatusId(2)}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  กำลังดำเนินการ
                </Typography>
                <Typography variant="body1">
                  {taskCount.accept} รายการ
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card sx={{ width: 200, mr: 2, backgroundColor: 'warning.main' }}>
            <CardActionArea onClick={() => setFilterStatusId(3)}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  รออะไหล่
                </Typography>
                <Typography variant="body1">
                  {taskCount.wait} รายการ
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card sx={{ width: 200, mr: 2, backgroundColor: 'warning.main' }}>
            <CardActionArea onClick={() => setFilterStatusId(4)}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  ส่งซ่อมภายนอก
                </Typography>
                <Typography variant="body1">
                  {taskCount.outside} รายการ
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card sx={{ width: 200, backgroundColor: 'success.main' }}>
            <CardActionArea onClick={() => setFilterStatusId(5)}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  เสร็จสิ้น
                </Typography>
                <Typography variant="body1">
                  {taskCount.complete} รายการ
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Stack>

        <Card>
          <TableContainer component={Paper}>
            <Typography
              sx={{ flex: '1 1 100%', p: 1 }}
              variant="h6"
              id="tableTitle"
              component="div"
            >
              รายการงานแจ้งซ่อมอุปกรณ์
            </Typography>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>เลขที่</TableCell>
                  <TableCell>ประเภทงาน</TableCell>
                  <TableCell>รายละเอียด</TableCell>
                  <TableCell>แผนก</TableCell>
                  <TableCell>ผู้แจ้ง</TableCell>
                  <TableCell>วันที่แจ้ง</TableCell>
                  <TableCell>ผู้รับผิดชอบ</TableCell>
                  <TableCell>หมายเหตุ</TableCell>
                  <TableCell>สถานะ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.values(filterTaskList).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                  <TableRow
                    key={`${row.task_id} ${row.level_id}`}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>{row.task_id}</TableCell>
                    <TableCell sx={{ maxWidth: 50 }} >{row.level_id === "DMIS_IT" ? "IT" : "งานช่าง"}</TableCell>
                    <TableCell sx={{ maxWidth: 250 }} >
                      {row.task_issue}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 150 }} >{row.issue_department_name}</TableCell>
                    <TableCell>{row.informer_firstname}</TableCell>
                    <TableCell sx={{ maxWidth: 110 }} >{(row.task_date_start).replace("T", " ").replace(".000Z", " น.")}</TableCell>
                    <TableCell sx={{ maxWidth: 50 }} >{row.operator_firstname}</TableCell>
                    <TableCell sx={{ maxWidth: 150 }} >
                      {row.task_note}
                    </TableCell>
                    <TableCell>{row.status_name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            rowsPerPageOptions={[10, 25, 100]}
            count={filterTaskList.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </>
  );
}
