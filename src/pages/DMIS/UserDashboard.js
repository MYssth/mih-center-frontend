import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jwtDecode from "jwt-decode";
import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Typography, Card, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

// ----------------------------------------------------------------------

export default function UserDashboard() {
  const theme = useTheme();
  const [taskList, setTaskList] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {

    const token = jwtDecode(localStorage.getItem('token'));

    for (let i = 0; i < token.level_list.length; i += 1) {
      if (token.level_list[i].level_id === "DMIS_U1" ||
        token.level_list[i].level_id === "DMIS_U2" ||
        token.level_list[i].level_id === "DMIS_U3" ||
        token.level_list[i].level_id === "DMIS_U4") {

        fetch(`http://localhost:5003/api/dmis/gettasklist/${token.personnel_id}/${token.level_list[i].level_id}`)
          .then((response) => response.json())
          .then((data) => {
            setTaskList(data);
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      }
    }

  }, []);



  return (
    <>
      <Helmet>
        <title> หน้าหลัก | MIH Center </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          ระบบแจ้งซ่อมอุปกรณ์ - Device Maintenance Inform Service(DMIS)
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
                  <TableCell>ผู้แจ้ง</TableCell>
                  <TableCell>วันที่แจ้ง</TableCell>
                  <TableCell>ผู้รับผิดชอบ</TableCell>
                  <TableCell>สถานะ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {taskList.map((row) => (
                  <TableRow
                    key={`${row.task_id} ${row.level_id}`}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell sx={{ maxWidth: 300 }} >
                      {row.task_issue}
                    </TableCell>
                    <TableCell>{row.department_name}</TableCell>
                    <TableCell>{row.informer_name}</TableCell>
                    <TableCell sx={{ maxWidth: 90 }}>{(row.task_date_start).replace("T", " ").replace(".000Z", " น.")}</TableCell>
                    <TableCell>{row.operator_name}</TableCell>
                    <TableCell>{row.status_name}</TableCell>
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
