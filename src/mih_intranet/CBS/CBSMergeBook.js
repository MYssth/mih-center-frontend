/* eslint-disable jsx-a11y/label-has-associated-control */
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { DataGrid, gridClasses, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { Stack, styled, alpha, Box, Checkbox, Grid, TextField, Autocomplete, Radio } from '@mui/material';
import jwtDecode from 'jwt-decode';
import MainHeader from '../components/MainHeader';
import CBSSidebar from './components/nav/CBSSidebar';
import { SubmtComp, SubmtERR } from '../components/dialogs/response';
import { CBSDelGrpSchedSubm } from './components/dialogs/forms';

let pid = '';
let pname = '';
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

const headSname = `${localStorage.getItem('sname')} Center`;
let selBookNew = [];
let selBookAdd = [];

function CBSMergeBook() {
  const columnsNew = [
    {
      field: 'action',
      headerName: '',
      sortable: false,
      flex: 0.3,
      minWidth: 50,
      renderCell: (params) => {
        const handleChkBox = (e) => {
          if (e.target.checked) {
            selBookNew.push(params.row);
          } else {
            const index = selBookNew.findIndex((o) => {
              return o.id === params.row.id;
            });
            if (index > -1) {
              selBookNew.splice(index, 1);
            }
          }
          if (selBookNew.length > 1) {
            setIsDisNew(false);
          } else {
            setIsDisNew(true);
          }
          // console.log(selBookNew);
        };

        return (
          <Box justifyContent={'flex-end'}>
            <Checkbox
              onChange={handleChkBox}
              checked={!!selBookNew.find((o) => o.id === params.row.id)}
              sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
            />
          </Box>
        );
      },
    },
    {
      field: 'id',
      headerName: 'เลขที่',
      flex: 0.8,
      minWidth: 100,
    },
    {
      field: 'from_date',
      headerName: 'วันที่ไป',
      flex: 0.8,
      minWidth: 100,
      valueGetter: (params) =>
        `${String(new Date(params.row.from_date).getUTCDate()).padStart(2, '0')}/${String(
          parseInt(new Date(params.row.from_date).getUTCMonth(), 10) + 1
        ).padStart(2, '0')}/${new Date(params.row.from_date).getUTCFullYear()}`,
    },
    {
      field: 'from_time',
      headerName: 'เวลาไป',
      flex: 0.6,
      minWidth: 60,
      valueGetter: (params) =>
        `${String(new Date(params.row.from_date).getUTCHours()).padStart(2, '0')}:${String(
          new Date(params.row.from_date).getUTCMinutes()
        ).padStart(2, '0')}`,
    },
    {
      field: 'to_date',
      headerName: 'วันที่กลับ',
      flex: 0.8,
      minWidth: 100,
      valueGetter: (params) =>
        `${String(new Date(params.row.to_date).getUTCDate()).padStart(2, '0')}/${String(
          parseInt(new Date(params.row.to_date).getUTCMonth(), 10) + 1
        ).padStart(2, '0')}/${new Date(params.row.to_date).getUTCFullYear()}`,
    },
    {
      field: 'to_time',
      headerName: 'เวลากลับ',
      flex: 0.6,
      minWidth: 60,
      valueGetter: (params) =>
        `${String(new Date(params.row.to_date).getUTCHours()).padStart(2, '0')}:${String(
          new Date(params.row.to_date).getUTCMinutes()
        ).padStart(2, '0')}`,
    },
    {
      field: 'req_name',
      headerName: 'ผู้ขอ',
      flex: 1,
      minWidth: 180,
    },
    {
      field: 'dept_name',
      headerName: 'แผนก',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'car_type_name',
      headerName: 'ประเภทรถ',
      flex: 0.8,
      minWidth: 100,
    },
    {
      field: 'place',
      headerName: 'สถานที่',
      flex: 1,
      minWidth: 150,
    },
  ];

  const columnsGrpAdd = [
    {
      field: 'action',
      headerName: '',
      sortable: false,
      flex: 0.3,
      minWidth: 50,
      renderCell: (params) => <Radio checked={selGrpAdd === params.id} value={params.id} />,
    },
    {
      field: 'id',
      headerName: 'เลขที่งานรวม',
      flex: 0.8,
      minWidth: 100,
    },
    {
      field: 'from_date',
      headerName: 'วันที่ไป',
      flex: 0.8,
      minWidth: 100,
      valueGetter: (params) =>
        `${String(new Date(params.row.from_date).getUTCDate()).padStart(2, '0')}/${String(
          parseInt(new Date(params.row.from_date).getUTCMonth(), 10) + 1
        ).padStart(2, '0')}/${new Date(params.row.from_date).getUTCFullYear()}`,
    },
    {
      field: 'from_time',
      headerName: 'เวลาไป',
      flex: 0.6,
      minWidth: 60,
      valueGetter: (params) =>
        `${String(new Date(params.row.from_date).getUTCHours()).padStart(2, '0')}:${String(
          new Date(params.row.from_date).getUTCMinutes()
        ).padStart(2, '0')}`,
    },
    {
      field: 'to_date',
      headerName: 'วันที่กลับ',
      flex: 0.8,
      minWidth: 100,
      valueGetter: (params) =>
        `${String(new Date(params.row.to_date).getUTCDate()).padStart(2, '0')}/${String(
          parseInt(new Date(params.row.to_date).getUTCMonth(), 10) + 1
        ).padStart(2, '0')}/${new Date(params.row.to_date).getUTCFullYear()}`,
    },
    {
      field: 'to_time',
      headerName: 'เวลากลับ',
      flex: 0.6,
      minWidth: 60,
      valueGetter: (params) =>
        `${String(new Date(params.row.to_date).getUTCHours()).padStart(2, '0')}:${String(
          new Date(params.row.to_date).getUTCMinutes()
        ).padStart(2, '0')}`,
    },
    {
      field: 'place',
      headerName: 'สถานที่',
      flex: 1,
      minWidth: 100,
      valueGetter: (params) => {
        let place = '';
        for (let i = 0; i < placeList.length; i += 1) {
          if (placeList[i].grp_id === params.row.id) {
            place += `${placeList[i].place}, `;
          }
        }
        return place;
      },
    },
    {
      field: 'req_name',
      headerName: 'ผู้รวมคำขอ',
      flex: 1,
      minWidth: 180,
    },
    {
      field: 'car_type_name',
      headerName: 'ประเภทรถ',
      flex: 0.8,
      minWidth: 100,
    },
    {
      field: 'car_name',
      headerName: 'รถที่ใช้',
      flex: 0.8,
      minWidth: 100,
    },
  ];

  const columnsAdd = [
    {
      field: 'action',
      headerName: '',
      sortable: false,
      flex: 0.3,
      minWidth: 50,
      renderCell: (params) => {
        const handleChkBox = (e) => {
          if (e.target.checked) {
            selBookAdd.push(params.row);
          } else {
            const index = selBookAdd.findIndex((o) => {
              return o.id === params.row.id;
            });
            if (index > -1) {
              selBookAdd.splice(index, 1);
            }
          }
          if (selBookAdd.length > 0) {
            setIsDisAdd(false);
          } else {
            setIsDisAdd(true);
          }
          // console.log(selectedBook);
        };

        return (
          <Box justifyContent={'flex-end'}>
            <Checkbox
              onChange={handleChkBox}
              checked={!!selBookAdd.find((o) => o.id === params.row.id)}
              sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
            />
          </Box>
        );
      },
    },
    {
      field: 'id',
      headerName: 'เลขที่',
      flex: 0.8,
      minWidth: 100,
    },
    {
      field: 'from_date',
      headerName: 'วันที่ไป',
      flex: 0.8,
      minWidth: 100,
      valueGetter: (params) =>
        `${String(new Date(params.row.from_date).getUTCDate()).padStart(2, '0')}/${String(
          parseInt(new Date(params.row.from_date).getUTCMonth(), 10) + 1
        ).padStart(2, '0')}/${new Date(params.row.from_date).getUTCFullYear()}`,
    },
    {
      field: 'from_time',
      headerName: 'เวลาไป',
      flex: 0.6,
      minWidth: 60,
      valueGetter: (params) =>
        `${String(new Date(params.row.from_date).getUTCHours()).padStart(2, '0')}:${String(
          new Date(params.row.from_date).getUTCMinutes()
        ).padStart(2, '0')}`,
    },
    {
      field: 'to_date',
      headerName: 'วันที่กลับ',
      flex: 0.8,
      minWidth: 100,
      valueGetter: (params) =>
        `${String(new Date(params.row.to_date).getUTCDate()).padStart(2, '0')}/${String(
          parseInt(new Date(params.row.to_date).getUTCMonth(), 10) + 1
        ).padStart(2, '0')}/${new Date(params.row.to_date).getUTCFullYear()}`,
    },
    {
      field: 'to_time',
      headerName: 'เวลากลับ',
      flex: 0.6,
      minWidth: 60,
      valueGetter: (params) =>
        `${String(new Date(params.row.to_date).getUTCHours()).padStart(2, '0')}:${String(
          new Date(params.row.to_date).getUTCMinutes()
        ).padStart(2, '0')}`,
    },
    {
      field: 'req_name',
      headerName: 'ผู้ขอ',
      flex: 1,
      minWidth: 180,
    },
    {
      field: 'dept_name',
      headerName: 'แผนก',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'car_type_name',
      headerName: 'ประเภทรถ',
      flex: 0.8,
      minWidth: 100,
    },
    {
      field: 'place',
      headerName: 'สถานที่',
      flex: 1,
      minWidth: 150,
    },
  ];

  const columnsGrpDel = [
    {
      field: 'action',
      headerName: '',
      sortable: false,
      flex: 0.3,
      minWidth: 50,
      renderCell: (params) => <Radio checked={selGrpDel === params.id} value={params.id} />,
    },
    {
      field: 'id',
      headerName: 'เลขที่งานรวม',
      flex: 0.8,
      minWidth: 100,
    },
    {
      field: 'from_date',
      headerName: 'วันที่ไป',
      flex: 0.8,
      minWidth: 100,
      valueGetter: (params) =>
        `${String(new Date(params.row.from_date).getUTCDate()).padStart(2, '0')}/${String(
          parseInt(new Date(params.row.from_date).getUTCMonth(), 10) + 1
        ).padStart(2, '0')}/${new Date(params.row.from_date).getUTCFullYear()}`,
    },
    {
      field: 'from_time',
      headerName: 'เวลาไป',
      flex: 0.6,
      minWidth: 60,
      valueGetter: (params) =>
        `${String(new Date(params.row.from_date).getUTCHours()).padStart(2, '0')}:${String(
          new Date(params.row.from_date).getUTCMinutes()
        ).padStart(2, '0')}`,
    },
    {
      field: 'to_date',
      headerName: 'วันที่กลับ',
      flex: 0.8,
      minWidth: 100,
      valueGetter: (params) =>
        `${String(new Date(params.row.to_date).getUTCDate()).padStart(2, '0')}/${String(
          parseInt(new Date(params.row.to_date).getUTCMonth(), 10) + 1
        ).padStart(2, '0')}/${new Date(params.row.to_date).getUTCFullYear()}`,
    },
    {
      field: 'to_time',
      headerName: 'เวลากลับ',
      flex: 0.6,
      minWidth: 60,
      valueGetter: (params) =>
        `${String(new Date(params.row.to_date).getUTCHours()).padStart(2, '0')}:${String(
          new Date(params.row.to_date).getUTCMinutes()
        ).padStart(2, '0')}`,
    },
    {
      field: 'req_name',
      headerName: 'ผู้รวมคำขอ',
      flex: 1,
      minWidth: 180,
    },
    {
      field: 'car_type_name',
      headerName: 'ประเภทรถ',
      flex: 0.8,
      minWidth: 100,
    },
    {
      field: 'car_name',
      headerName: 'รถที่ใช้',
      flex: 0.8,
      minWidth: 100,
    },
  ];

  const columnsDel = [
    {
      field: 'action',
      headerName: '',
      sortable: false,
      flex: 0.3,
      minWidth: 70,
      renderCell: (params) => {
        const handleDel = () => {
          setDelData(params.row);
          setDelGrpSchedSubmDialg(true);
        };

        return (
          <Stack direction="row" spacing={1}>
            <button type="submit" className="btn btn-danger" onClick={handleDel}>
              ลบ
            </button>
          </Stack>
        );
      },
    },
    {
      field: 'id',
      headerName: 'เลขที่',
      flex: 0.8,
      minWidth: 100,
    },
    {
      field: 'from_date',
      headerName: 'วันที่ไป',
      flex: 0.8,
      minWidth: 100,
      valueGetter: (params) =>
        `${String(new Date(params.row.from_date).getUTCDate()).padStart(2, '0')}/${String(
          parseInt(new Date(params.row.from_date).getUTCMonth(), 10) + 1
        ).padStart(2, '0')}/${new Date(params.row.from_date).getUTCFullYear()}`,
    },
    {
      field: 'from_time',
      headerName: 'เวลาไป',
      flex: 0.6,
      minWidth: 60,
      valueGetter: (params) =>
        `${String(new Date(params.row.from_date).getUTCHours()).padStart(2, '0')}:${String(
          new Date(params.row.from_date).getUTCMinutes()
        ).padStart(2, '0')}`,
    },
    {
      field: 'to_date',
      headerName: 'วันที่กลับ',
      flex: 0.8,
      minWidth: 100,
      valueGetter: (params) =>
        `${String(new Date(params.row.to_date).getUTCDate()).padStart(2, '0')}/${String(
          parseInt(new Date(params.row.to_date).getUTCMonth(), 10) + 1
        ).padStart(2, '0')}/${new Date(params.row.to_date).getUTCFullYear()}`,
    },
    {
      field: 'to_time',
      headerName: 'เวลากลับ',
      flex: 0.6,
      minWidth: 60,
      valueGetter: (params) =>
        `${String(new Date(params.row.to_date).getUTCHours()).padStart(2, '0')}:${String(
          new Date(params.row.to_date).getUTCMinutes()
        ).padStart(2, '0')}`,
    },
    {
      field: 'req_name',
      headerName: 'ผู้ขอ',
      flex: 1,
      minWidth: 180,
    },
    {
      field: 'dept_name',
      headerName: 'แผนก',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'car_type_name',
      headerName: 'ประเภทรถ',
      flex: 0.8,
      minWidth: 100,
    },
    {
      field: 'place',
      headerName: 'สถานที่',
      flex: 1,
      minWidth: 150,
    },
  ];

  function QuickSearchToolbar() {
    return (
      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="flex-end"
        sx={{
          p: 0.5,
          pb: 0,
        }}
      >
        <GridToolbarQuickFilter />
      </Box>
    );
  }

  const [sched, setSched] = useState([]);
  const [pageSize, setPageSize] = useState(10);

  const [open, setOpen] = useState(false);
  const [submitERR, setSubmitERR] = useState(false);
  const [submitComp, setSubmitComp] = useState(false);
  const [isDisNew, setIsDisNew] = useState(true);

  const [carType, setCarType] = useState([]);
  const [carTypeId, setCarTypeId] = useState(0);
  const [carTypeName, setCarTypeName] = useState('ไม่ระบุ');

  const [car, setCar] = useState([]);
  const [filteredCar, setFilteredCar] = useState([]);
  const [carId, setCarId] = useState(0);
  const [carName, setCarName] = useState('ไม่ระบุ');

  const [driver, setDriver] = useState([]);
  const [driverId, setDriverId] = useState(0);
  const [driverName, setDriverName] = useState('ไม่ระบุ');

  const [placeList, setPlaceList] = useState([]);

  // ************* Add State *******************

  const [schedGrp, setSchedGrp] = useState([]);
  const [pageSizeAdd, setPageSizeAdd] = useState(10);
  const [selGrpAdd, setSelGrpAdd] = useState('');
  const [isDisAdd, setIsDisAdd] = useState(true);

  // *******************************************

  // ************* Del State *******************

  const [delSched, setDelSched] = useState([]);
  const [filteredDelSched, setFilteredDelSched] = useState([]);
  const [pageSizeDel, setPageSizeDel] = useState(10);
  const [selGrpDel, setSelGrpDel] = useState('');

  const [delGrpSchedSubmDialg, setDelGrpSchedSubmDialg] = useState(false);
  const [delData, setDelData] = useState({});

  // *******************************************

  useEffect(() => {
    pid = jwtDecode(localStorage.getItem('token')).personnel_id;
    pname = jwtDecode(localStorage.getItem('token')).personnel_name;

    fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_cbsPort}/api/cbs/getcartype`)
      .then((response) => response.json())
      .then((data) => {
        setCarType(data);
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.log('cancelled');
        } else {
          console.error('Error:', error);
        }
      });

    fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_cbsPort}/api/cbs/getdriver`)
      .then((response) => response.json())
      .then((data) => {
        setDriver(data);
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.log('cancelled');
        } else {
          console.error('Error:', error);
        }
      });

    fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_cbsPort}/api/cbs/getcar`)
      .then((response) => response.json())
      .then((data) => {
        setCar(data);
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.log('cancelled');
        } else {
          console.error('Error:', error);
        }
      });

    refreshTable();
  }, []);

  useEffect(() => {
    setFilteredCar(car.filter((carData) => carData.type_id === carTypeId));
  }, [carTypeId]);

  useEffect(() => {
    setFilteredDelSched(delSched.filter((schedData) => schedData.grp_id === selGrpDel));
  }, [selGrpDel]);

  function refreshTable() {
    fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_cbsPort}/api/cbs/getallschednongrp`)
      .then((response) => response.json())
      .then((data) => {
        setSched(data);
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.log('cancelled');
        } else {
          console.error('Error:', error);
        }
      });

    fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_cbsPort}/api/cbs/getschedgrp`)
      .then((response) => response.json())
      .then((data) => {
        setSchedGrp(data);
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.log('cancelled');
        } else {
          console.error('Error:', error);
        }
      });

    fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_cbsPort}/api/cbs/getallsched`)
      .then((response) => response.json())
      .then((data) => {
        setDelSched(data);
        setFilteredDelSched(data.filter((schedData) => schedData.grp_id === selGrpDel));
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.log('cancelled');
        } else {
          console.error('Error:', error);
        }
      });

    fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_cbsPort}/api/cbs/getgrpplacelist`)
      .then((response) => response.json())
      .then((data) => {
        setPlaceList(data);
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.log('cancelled');
        } else {
          console.error('Error:', error);
        }
      });
  }

  function clearData() {
    selBookNew = [];
    setCarTypeId(0);
    setCarTypeName('ไม่ระบุ');
    setCarId(0);
    setCarName('ไม่ระบุ');
    setDriverId(0);
    setDriverName('ไม่ระบุ');

    selBookAdd = [];
    setSelGrpAdd('');

    setSelGrpDel('');

    refreshTable();
  }

  function handleMergeBook() {
    const jsonData = {
      req_pid: pid,
      req_name: pname,
      id_list: selBookNew,
      car_type_id: carTypeId,
      car_id: carId,
      drv_pid: driverId,
    };

    // console.log(jsonData);

    fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_cbsPort}/api/cbs/mergebook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'ok') {
          setSubmitComp(true);
        } else {
          setSubmitERR(true);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setSubmitERR(true);
      });
  }

  function handleMergeBookAdd() {
    const jsonData = {
      rcv_pid: pid,
      req_name: pname,
      id_list: selBookAdd,
      sched_grp: schedGrp.find((o) => o.id === selGrpAdd),
    };

    // console.log(jsonData);

    fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_cbsPort}/api/cbs/mergebookadd`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'ok') {
          setSubmitComp(true);
        } else {
          setSubmitERR(true);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setSubmitERR(true);
      });
  }

  return (
    <>
      <Helmet>
        <title> ระบบขอใช้รถ | {headSname} </title>
      </Helmet>
      <SubmtERR openDialg={submitERR} onCloseDialg={() => setSubmitERR(false)} />
      <SubmtComp
        openDialg={submitComp}
        onCloseDialg={() => {
          setSubmitComp(false);
          refreshTable();
        }}
      />
      <CBSDelGrpSchedSubm
        openDialg={delGrpSchedSubmDialg}
        onCloseDialg={() => {
          setDelGrpSchedSubmDialg(false);
          refreshTable();
        }}
        data={delData}
      />

      <div>
        <MainHeader onOpenNav={() => setOpen(true)} />
        <CBSSidebar name="mergeBook" openNav={open} onCloseNav={() => setOpen(false)} />

        {/* <!-- ======= Main ======= --> */}
        <main id="main" className="main">
          <div className="pagetitle">
            <h1>รวมคำขอใช้รถ</h1>
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item my-2">
                  <a href="/intranet">หน้าหลัก</a>
                </li>
                <li className="breadcrumb-item my-2">
                  <a href="/cbsdashboard">หน้าหลักระบบขอใช้รถ</a>
                </li>
                <li className="breadcrumb-item my-2">รวมคำขอใช้รถ</li>
              </ol>
            </nav>
          </div>
          {/* <!-- End Page Title --> */}
          <section className="section">
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body pt-3">
                    <ul className="nav nav-tabs nav-tabs-bordered">
                      <li className="nav-item">
                        <button
                          onClick={() => clearData()}
                          className="nav-link active"
                          data-bs-toggle="tab"
                          data-bs-target="#mergebook-new"
                        >
                          รวมงานใหม่
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          onClick={() => clearData()}
                          className="nav-link"
                          data-bs-toggle="tab"
                          data-bs-target="#mergebook-add"
                        >
                          ใส่งานเพิ่ม
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          onClick={() => clearData()}
                          className="nav-link"
                          data-bs-toggle="tab"
                          data-bs-target="#mergebook-del"
                        >
                          ลบงานออก
                        </button>
                      </li>
                    </ul>
                    <div className="tab-content pt-3">
                      <div className="tab-pane fade show active profile-overview pt-2" id="mergebook-new">
                        <h5 className="card-title">เลือกคำขอใช้รถที่ต้องการรวม</h5>
                        <StripedDataGrid
                          autoHeight
                          getRowHeight={() => 'auto'}
                          sx={{
                            [`& .${gridClasses.cell}`]: {
                              py: 1,
                            },
                          }}
                          columns={columnsNew}
                          rows={sched}
                          pageSize={pageSize}
                          onPageSizeChange={(PageSize) => setPageSize(PageSize)}
                          rowsPerPageOptions={[10, 25, 100]}
                          hideFooterSelectedRowCount
                          // onCellDoubleClick={(params) => { handleOpenFocusTaskDialog(params.row) }}
                          // onCellDoubleClick={(params) => { showDetail(params.row, true) }}
                          initialState={{
                            columns: {
                              columnVisibilityModel: {
                                // Hide columns status and traderName, the other columns will remain visible
                                // id: false,
                              },
                            },
                          }}
                          components={{ Toolbar: QuickSearchToolbar }}
                        />
                        <br />
                        <Grid container rowSpacing={{ xs: 2 }} columnSpacing={{ xs: 2 }}>
                          <Grid item md={3} xs={12}>
                            <label className="form-label">ประเภทรถ</label>
                            <Autocomplete
                              value={carTypeName}
                              onChange={(event, newValue) => {
                                setCarTypeName(newValue);
                                if (newValue !== null) {
                                  setCarTypeId(carType.find((o) => o.name === newValue).id);
                                } else {
                                  setCarTypeId(0);
                                  setCarTypeName('ไม่ระบุ');
                                }
                                setCarId(0);
                                setCarName('ไม่ระบุ');
                              }}
                              id="controllable-states-car-type-id"
                              options={Object.values(carType).map((option) => option.name)}
                              fullWidth
                              renderInput={(params) => <TextField {...params} />}
                            />
                          </Grid>
                          <Grid item md={4} xs={12}>
                            <label className="form-label">รถที่ขอใช้</label>
                            <Autocomplete
                              value={carName}
                              onChange={(event, newValue) => {
                                setCarName(newValue);
                                if (newValue !== null) {
                                  setCarId(filteredCar.find((o) => `${o.reg_no} ${o.name}` === newValue).id);
                                } else {
                                  setCarId(0);
                                  setCarName('ไม่ระบุ');
                                }
                              }}
                              disabled={!carTypeId}
                              id="controllable-states-car-type-id"
                              options={Object.values(filteredCar).map((option) => `${option.reg_no} ${option.name}`)}
                              fullWidth
                              renderInput={(params) => <TextField label="รถที่ขอใช้" {...params} />}
                            />
                          </Grid>
                          <Grid item md={4} xs={12}>
                            <label className="form-label">พนักงานขับรถ</label>
                            <Autocomplete
                              value={driverName}
                              onChange={(event, newValue) => {
                                setDriverName(newValue);
                                if (newValue !== null) {
                                  setDriverId(driver.find((o) => o.name === newValue).id);
                                } else {
                                  setDriverId(0);
                                  setDriverName('ไม่ระบุ');
                                }
                              }}
                              id="controllable-states-driver-id"
                              options={Object.values(driver).map((option) => option.name)}
                              fullWidth
                              renderInput={(params) => <TextField {...params} />}
                            />
                          </Grid>
                        </Grid>
                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                          <button
                            onClick={handleMergeBook}
                            className="btn btn-success"
                            disabled={isDisNew || !carTypeId || !carId || !driverId || driverId === '0'}
                          >
                            รวมงาน
                          </button>
                        </Stack>
                      </div>
                      <div className="tab-pane fade profile-overview pt-2" id="mergebook-add">
                        <h5 className="card-title">เลือกกลุ่มคำขอใช้รถ</h5>
                        <StripedDataGrid
                          autoHeight
                          getRowHeight={() => 'auto'}
                          sx={{
                            [`& .${gridClasses.cell}`]: {
                              py: 1,
                            },
                          }}
                          columns={columnsGrpAdd}
                          rows={schedGrp}
                          pageSize={pageSizeAdd}
                          onPageSizeChange={(PageSize) => setPageSizeAdd(PageSize)}
                          rowsPerPageOptions={[10, 25, 100]}
                          selectionModel={selGrpAdd}
                          onSelectionModelChange={(newSelectionModel) => {
                            setSelGrpAdd(newSelectionModel[0]);
                          }}
                          hideFooterSelectedRowCount
                          // onCellDoubleClick={(params) => { handleOpenFocusTaskDialog(params.row) }}
                          // onCellDoubleClick={(params) => { showDetail(params.row, true) }}
                          initialState={{
                            columns: {
                              columnVisibilityModel: {
                                // Hide columns status and traderName, the other columns will remain visible
                                // id: false,
                              },
                            },
                          }}
                          components={{ Toolbar: QuickSearchToolbar }}
                        />
                        <h5 className="card-title">เลือกคำขอใช้รถที่ต้องการเพิ่มใส่กลุ่ม</h5>
                        <StripedDataGrid
                          autoHeight
                          getRowHeight={() => 'auto'}
                          sx={{
                            [`& .${gridClasses.cell}`]: {
                              py: 1,
                            },
                          }}
                          columns={columnsAdd}
                          rows={sched}
                          pageSize={pageSize}
                          onPageSizeChange={(PageSize) => setPageSize(PageSize)}
                          rowsPerPageOptions={[10, 25, 100]}
                          hideFooterSelectedRowCount
                          // onCellDoubleClick={(params) => { handleOpenFocusTaskDialog(params.row) }}
                          // onCellDoubleClick={(params) => { showDetail(params.row, true) }}
                          initialState={{
                            columns: {
                              columnVisibilityModel: {
                                // Hide columns status and traderName, the other columns will remain visible
                                // id: false,
                              },
                            },
                          }}
                          components={{ Toolbar: QuickSearchToolbar }}
                        />
                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                          <button
                            onClick={handleMergeBookAdd}
                            className="btn btn-success"
                            disabled={!selGrpAdd || isDisAdd}
                          >
                            เพิ่มคำขอใช้รถเข้ากลุ่ม
                          </button>
                        </Stack>
                      </div>
                      <div className="tab-pane fade profile-overview pt-2" id="mergebook-del">
                        <h5 className="card-title">เลือกกลุ่มคำขอใช้รถ</h5>
                        <StripedDataGrid
                          autoHeight
                          getRowHeight={() => 'auto'}
                          sx={{
                            [`& .${gridClasses.cell}`]: {
                              py: 1,
                            },
                          }}
                          columns={columnsGrpDel}
                          rows={schedGrp}
                          pageSize={pageSizeDel}
                          onPageSizeChange={(PageSize) => setPageSizeDel(PageSize)}
                          rowsPerPageOptions={[10, 25, 100]}
                          selectionModel={selGrpDel}
                          onSelectionModelChange={(newSelectionModel) => {
                            setSelGrpDel(newSelectionModel[0]);
                          }}
                          hideFooterSelectedRowCount
                          // onCellDoubleClick={(params) => { handleOpenFocusTaskDialog(params.row) }}
                          // onCellDoubleClick={(params) => { showDetail(params.row, true) }}
                          initialState={{
                            columns: {
                              columnVisibilityModel: {
                                // Hide columns status and traderName, the other columns will remain visible
                                // id: false,
                              },
                            },
                          }}
                          components={{ Toolbar: QuickSearchToolbar }}
                        />
                        <h5 className="card-title">รายการคำขอใช้รถในกลุ่มงานเลขที่ {selGrpDel}</h5>
                        <StripedDataGrid
                          autoHeight
                          getRowHeight={() => 'auto'}
                          sx={{
                            [`& .${gridClasses.cell}`]: {
                              py: 1,
                            },
                          }}
                          columns={columnsDel}
                          rows={filteredDelSched}
                          pageSize={pageSizeDel}
                          onPageSizeChange={(PageSize) => setPageSizeDel(PageSize)}
                          rowsPerPageOptions={[10, 25, 100]}
                          hideFooterSelectedRowCount
                          // onCellDoubleClick={(params) => { handleOpenFocusTaskDialog(params.row) }}
                          // onCellDoubleClick={(params) => { showDetail(params.row, true) }}
                          initialState={{
                            columns: {
                              columnVisibilityModel: {
                                // Hide columns status and traderName, the other columns will remain visible
                                // id: false,
                              },
                            },
                          }}
                          components={{ Toolbar: QuickSearchToolbar }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

export default CBSMergeBook;
