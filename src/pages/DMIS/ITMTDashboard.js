import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import jwtDecode from "jwt-decode";
import { Helmet } from 'react-helmet-async';
// @mui
import { useTheme } from '@mui/material/styles';
import { Card, Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

// ----------------------------------------------------------------------

function createData(name, calories, fat, carbs, protein) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
  };
}

const rows = [
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Donut', 452, 25.0, 51, 4.9),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
  createData('Honeycomb', 408, 3.2, 87, 6.5),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Jelly Bean', 375, 0.0, 94, 0.0),
  createData('KitKat', 518, 26.0, 65, 7.0),
  createData('Lollipop', 392, 0.2, 98, 0.0),
  createData('Marshmallow', 318, 0, 81, 2.0),
  createData('Nougat', 360, 19.0, 9, 37.0),
  createData('Oreo', 437, 18.0, 63, 4.0),
];

export default function ITMTDashboard() {

  // =========================================================
  const theme = useTheme();
  const [tokenData, setTokenData] = useState([]);
  const [taskList, setTaskList] = useState([]);

  const [levelId, setLevelId] = useState('');
  const [personnelId, setPersonnelId] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {

    setLevelId(location.state.level_id);
    setPersonnelId(location.state.personnel_id);
    console.log(location.state.level_id);
    console.log(personnelId);

    // fetch(`http://${process.env.host}:${process.env.psnDataDistPort}/api/getpersonnel`)
    fetch(`http://localhost:5003/api/dmis/gettasklist/${location.state.personnel_id}/${location.state.level_id}`)
      .then((response) => response.json())
      .then((data) => {
        setTaskList(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

  }, []);
  // ========================================================

  return (
    <>
      <Helmet>
        <title> ระบบแจ้งซ่อมอุปกรณ์ | MIH Center </title>
      </Helmet>

      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          ระบบแจ้งซ่อมอุปกรณ์ - Device Maintenance Inform Service(DMIS) (หน้าสำหรับ IT และ MT)
        </Typography>
        <Card>
          <TableContainer component={Paper}>
            <Typography
              sx={{ flex: '1 1 100%' }}
              variant="h6"
              id="tableTitle"
              component="div"
            >
              รายการงานแจ้งซ่อมอุปกรณ์
            </Typography>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">

              <TableHead>
                <TableRow>
                  <TableCell>รายละเอียด</TableCell>
                  <TableCell>แผนก</TableCell>
                  <TableCell>วันที่แจ้ง</TableCell>
                  <TableCell>สถานะ</TableCell>
                  <TableCell> </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {taskList.map((row) => (
                  <TableRow
                    key={row.task_id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell sx={{ maxWidth: 300 }} >
                      {row.task_issue}
                    </TableCell>
                    <TableCell>{row.issue_department_id}</TableCell>
                    <TableCell>{row.task_date_start}</TableCell>
                    <TableCell>{row.status_id}</TableCell>
                    <TableCell><Button>ดำเนินการ</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Container>
    </>
  );
}
