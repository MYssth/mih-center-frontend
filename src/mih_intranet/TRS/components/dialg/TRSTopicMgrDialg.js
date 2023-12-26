import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  alpha,
  styled,
  Grid,
  Typography,
  TextField,
  Stack,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import thLocale from 'date-fns/locale/th';
import { DataGrid, gridClasses, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { ErrMsgDialg } from '../../../components/dialogs/response';
import TRSSubTopicMgrDialg from './TRSSubTopicMgrDialg';

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

const moment = require('moment');

moment.locale('en');

function TRSTopicMgrDialg({ openDialg, onCloseDialg, onRefresh, data, subTopicList, mode, rToken }) {
  const [openErrMsg, setOpenErrMsg] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const [filterSubTopicList, setFilterSubTopicList] = useState([]);
  const [file, setFile] = useState({});
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [imageChange, setImageChange] = useState(false);

  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [startSdate, setStartSdate] = useState(null);
  const [endSdate, setEndSdate] = useState(null);
  const [remark, setRemark] = useState('');

  const [showActive, setShowActive] = useState(true);
  const [subTopicMgrDialg, setSubTopicMgrDialg] = useState(false);
  const [subData, setSubData] = useState({});
  const [subMode, setSubMode] = useState('');

  useEffect(() => {
    if (openDialg) {
      setFile({});
      setImagePreviewUrl(null);
      setImageChange(false);
      setId('');
      setName('');
      setStartSdate(null);
      setEndSdate(null);
      setRemark('');
      if (mode === 'edit') {
        // const tmpSSDate = moment.utc(data.start_sdate);
        // const tmpESDate = moment.utc(data.end_sdate);
        // console.log(tmpSSDate);
        setId(data.id);
        setName(data.name);
        setStartSdate(moment.utc(data.start_sdate));
        setEndSdate(moment.utc(data.end_sdate));
        setRemark(data.remark);
        filterSubList();
      }
    }
  }, [openDialg]);

  useEffect(() => {
    filterSubList();
  }, [showActive, subTopicList]);

  const filterSubList = () => {
    if (showActive) {
      setFilterSubTopicList(subTopicList.filter((o) => o.isactive && o.topic_id === data.id));
    } else {
      setFilterSubTopicList(
        subTopicList.filter((o) => (o.isactive === null || o.isactive === '' || !o.isactive) && o.topic_id === data.id)
      );
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
          setSubData(params.row);
          setSubMode('edit');
          setSubTopicMgrDialg(true);
        };

        return (
          <Button size="small" variant="outlined" onClick={handleBttn}>
            แก้ไขข้อมูล
          </Button>
        );
      },
    },
    {
      field: 'id',
      headerName: 'เลขที่',
      // maxWidth: 110,
      minWidth: 60,
      flex: 1,
    },
    {
      field: 'name',
      headerName: 'ชื่อ',
      // maxWidth: 110,
      minWidth: 150,
      flex: 1,
    },
    {
      field: 'start_date',
      headerName: 'เริ่มวันที่',
      maxWidth: 100,
      minWidth: 100,
      flex: 1,
      // valueGetter: (params) => `${format(new Date(params.row.start_date), 'dd/MM/yyyy')}`,
      valueGetter: (params) =>
        `${new Date(params.row.start_date).getUTCDate()}/${
          new Date(params.row.start_date).getUTCMonth() + 1
        }/${new Date(params.row.start_date).getUTCFullYear()}`,
    },
    {
      field: 'end_date',
      headerName: 'ถึงวันที่',
      maxWidth: 100,
      minWidth: 100,
      flex: 1,
      // valueGetter: (params) => `${format(new Date(params.row.start_date), 'dd/MM/yyyy')}`,
      valueGetter: (params) =>
        `${new Date(params.row.end_date).getUTCDate()}/${new Date(params.row.end_date).getUTCMonth() + 1}/${new Date(
          params.row.end_date
        ).getUTCFullYear()}`,
    },
    {
      field: 'remark',
      headerName: 'หมายเหตุ',
      //   maxWidth: 100,
      minWidth: 200,
      flex: 1,
    },
  ];

  const handleSubmit = (isactive) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('id', id);
    formData.append('name', name);
    formData.append('isactive', isactive);
    formData.append('img', data?.img);
    formData.append('start_sdate', `${moment(startSdate).format('YYYY-MM-DD')}T00:00:00.000Z`);
    formData.append('end_sdate', `${moment(endSdate).format('YYYY-MM-DD')}T00:00:00.000Z`);
    formData.append('remark', remark);
    formData.append(mode === 'new' ? 'create_by' : 'last_edit_by', jwtDecode(localStorage.getItem('token')).psn_id);

    fetch(
      `${process.env.REACT_APP_host}${process.env.REACT_APP_trsPort}/${mode === 'new' ? 'addtopic' : 'updatetopic'}`,
      {
        method: 'POST',
        headers: {
          // 'Content-Type': 'application/json',
          Authorization: `Bearer ${rToken}`,
        },
        body: formData,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'ok') {
          onCloseDialg();
        } else {
          setErrMsg(`เนื่องจาก ${data.message}`);
          setOpenErrMsg(true);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setErrMsg(`เนื่องจาก ${error}`);
        setOpenErrMsg(true);
      });
  };

  const handleUploadImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFile(file);
      setImagePreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
    setImageChange(true);
  };

  return (
    <>
      <ErrMsgDialg
        openDialg={openErrMsg}
        onCloseDialg={() => {
          setErrMsg('');
          setOpenErrMsg(false);
        }}
        msg={errMsg}
        header={mode === 'new' ? 'ไม่สามารถเพิ่มหัวข้อกิจกรรม' : 'ไม่สามารถแก้ไขข้อมูลได้'}
      />
      <TRSSubTopicMgrDialg
        openDialg={subTopicMgrDialg}
        onCloseDialg={() => {
          setSubMode('');
          setSubTopicMgrDialg(false);
          onRefresh();
        }}
        onRefresh={() => {
          onRefresh();
        }}
        rToken={rToken}
        mode={subMode}
        data={subData}
        subTopicList={subTopicList}
      />

      <Dialog open={openDialg} onClose={onCloseDialg}>
        <DialogTitle>{mode === 'new' ? 'เพิ่มกิจกรรม' : `แก้ไขข้อมูลกิจกรรม ${id}`}</DialogTitle>
        <DialogContent>
          <h5 className="card-title">ภาพประกอบ (เลือกได้ 1 รูป)</h5>
          <div style={{ display: 'flex', height: '100%' }}>
            <Box sx={{ width: 1 }}>
              <div style={{ flexGrow: 1 }}>
                <img
                  src={
                    mode === 'new'
                      ? imagePreviewUrl
                      : imageChange
                      ? imagePreviewUrl
                      : `${process.env.REACT_APP_host}${process.env.REACT_APP_trsPort}/getimg/${id}`
                  }
                  style={{ width: '400px', height: '400px', border: '1px solid black' }}
                  alt="ไม่มีรูปภาพ"
                />
                <input type="file" onChange={handleUploadImage} />
                {/* <button> Upload </button> */}
              </div>
            </Box>
          </div>

          <h5 className="card-title">รายละเอียด</h5>

          <Grid container rowSpacing={{ xs: 2 }} columnSpacing={{ xs: 2 }}>
            <Grid item xs={12}>
              <Typography>ชื่อกิจกรรม</Typography>
              <TextField
                fullWidth
                label="ความยาวไม่เกิน 200 ตัวอักษร"
                value={name}
                inputProps={{ maxLength: 200 }}
                onChange={(event) => {
                  setName(event.target.value);
                }}
                sx={{
                  '& input:valid + fieldset': {
                    borderColor: name ? 'green' : 'red',
                  },
                  mt: 1,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>วันที่เปิดลงทะเบียน</Typography>
              <LocalizationProvider dateAdapter={AdapterMoment} locale={thLocale}>
                <DatePicker
                  maxDate={endSdate}
                  label="เลือกวันที่เปิดลงทะเบียน"
                  format="DD/MM/YYYY"
                  value={startSdate}
                  onChange={(newValue) => {
                    setStartSdate(newValue);
                  }}
                  sx={{
                    '& fieldset.MuiOutlinedInput-notchedOutline': {
                      borderColor: startSdate ? 'green' : 'red',
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <Typography>วันที่ปิดลงทะเบียน</Typography>
              <LocalizationProvider dateAdapter={AdapterMoment} locale={thLocale}>
                <DatePicker
                  minDate={startSdate}
                  label="เลือกวันที่ปิดลงทะเบียน"
                  format="DD/MM/YYYY"
                  value={endSdate}
                  onChange={(newValue) => {
                    setEndSdate(newValue);
                  }}
                  sx={{
                    '& fieldset.MuiOutlinedInput-notchedOutline': {
                      borderColor: endSdate ? 'green' : 'red',
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <Typography>หมายเหตุ (เห็นเฉพาะ Admin ระบบ)</Typography>
              <TextField
                fullWidth
                label="ความยาวไม่เกิน 100 ตัวอักษร"
                value={remark}
                inputProps={{ maxLength: 100 }}
                onChange={(event) => {
                  setRemark(event.target.value);
                }}
                sx={{ mt: 1 }}
              />
            </Grid>
          </Grid>
          {mode === 'edit' ? (
            <>
              <h5 className="card-title">รุ่นกิจกรรม - {showActive ? 'Active' : 'Inactive'}</h5>
              <Stack direction="row" spacing={1}>
                <Box display="flex" sx={{ width: '100%', height: '100%' }}>
                  <Stack direction={{ sm: 'row' }} spacing={1} rowGap={1}>
                    <Button
                      className={showActive ? 'btn btn-danger' : 'btn btn-success'}
                      onClick={() => {
                        setShowActive(!showActive);
                      }}
                    >
                      {showActive ? 'แสดง Inactive' : 'แสดง Active'}
                    </Button>
                  </Stack>
                </Box>
                <Box display="flex" justifyContent="flex-end" alignItems="flex-end" sx={{ width: 1 }}>
                  <Button
                    className="btn btn-success"
                    onClick={() => {
                      setSubData({ topic_id: data.id });
                      setSubMode('new');
                      setSubTopicMgrDialg(true);
                    }}
                  >
                    เพิ่มรุ่นใหม่
                  </Button>
                </Box>
              </Stack>
              <Grid container rowSpacing={{ xs: 2 }} columnSpacing={{ xs: 2 }}>
                <Grid item xs={12}>
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
                    rows={filterSubTopicList}
                    pageSize={10}
                    components={{ Toolbar: QuickSearchToolbar }}
                    componentsProps={{
                      toolbar: {
                        printOptions: { hideFooter: true, hideToolbar: true },
                        csvOptions: { utf8WithBom: true },
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </>
          ) : (
            ''
          )}
        </DialogContent>
        <DialogActions>
          {mode === 'new' ? (
            ''
          ) : !data?.isactive ? (
            <Button
              onClick={() => {
                handleSubmit(1);
              }}
              className="btn btn-success"
            >
              Active
            </Button>
          ) : (
            <Button
              onClick={() => {
                handleSubmit(0);
              }}
              className="btn btn-danger"
            >
              Inactive
            </Button>
          )}
          <div style={{ flex: '1 0 0' }} />
          <Button
            onClick={() => {
              handleSubmit(data.isactive ? 1 : 0);
            }}
            className="btn btn-success"
            disabled={name === '' || startSdate === null || endSdate === null}
          >
            {mode === 'new' ? 'เพิ่มข้อมูล' : 'แก้ไขข้อมูล'}
          </Button>
          <Button onClick={onCloseDialg} color="error">
            ยกเลิก
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default TRSTopicMgrDialg;
