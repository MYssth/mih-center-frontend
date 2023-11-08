/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import InputMask from 'react-input-mask';
// @mui
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Autocomplete,
  Stack,
  Divider,
  Radio,
  Box,
} from '@mui/material';
import { SubmtERR, SubmtINC } from '../../../../components/dialogs/response';

function IIOSTaskProc({ openDialg, onCloseDialg, data, operList, estList, statList }) {
  const [levelId, setLevelId] = useState('');

  const [statusId, setStatusId] = useState('');
  const [statusName, setStatusName] = useState('');
  const [tempStatus, setTempStatus] = useState('');

  const [operatorName, setOperatorName] = useState('');
  const [operatorId, setOperatorId] = useState('');

  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [categoryName, setCategoryName] = useState('');

  const [estimationId, setEstimationId] = useState('');
  const [estimationName, setEstimationName] = useState('');

  const [deviceId, setDeviceId] = useState('');
  const [serialnumber, setSerialnumber] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [taskCost, setTaskCost] = useState('');
  const [permitId, setPermitId] = useState('');
  const [solution, setSolution] = useState('');
  const [userPermitId, setUserPermitId] = useState('');

  const [taskNote, setTaskNote] = useState('');
  const [tempNote, setTempNote] = useState('');

  const [isProgramChange, setIsProgramChange] = useState(null);
  const [isStatusChange, setIsStatusChange] = useState(false);
  const [isDisStatus, setIsDisStatus] = useState(false);

  const [dialogStatus, setDialogStatus] = useState('');

  const [submitINC, setSubmitINC] = useState(false);
  const [submitERR, setSubmitERR] = useState(false);

  const isSkip = (value) => value !== '';

  const rToken = localStorage.getItem('token');

  useEffect(() => {
    if (openDialg) {
      setLevelId(data.level_id);
      setDialogStatus(data.status_id);
      if (
        data.operator_id !== '' &&
        data.operator_id !== null &&
        operList.find((o) => o.personnel_id === data.operator_id)?.personnel_firstname !== undefined
      ) {
        setOperatorName(
          `${operList.find((o) => o.personnel_id === data.operator_id).personnel_firstname} ${
            operList.find((o) => o.personnel_id === data.operator_id).personnel_lastname
          }`
        );
        setOperatorId(data.operator_id);
      }
      setDeviceId(data.task_device_id);
      setSerialnumber(data.task_serialnumber);
      setPhoneNo(data.task_phone_no);
      setTaskNote(data.task_note);
      setStatusId(data.status_id);
      setTempStatus(data.status_id);
      setStatusName(data.status_name);
      setTaskCost(data.task_cost);
      setCategoryId(data.category_id);
      setCategoryName(data.category_name);
      setEstimationId(data.estimation_id);
      setEstimationName(data.estimation_name);
      setPermitId(data.permit_id);
      setUserPermitId(data.user_permit_id);

      setTempNote(data.task_note);

      fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_dmisPort}/getcategories/${data.level_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${rToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setCategories(data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }, [openDialg]);

  useEffect(() => {
    setIsDisStatus(false);
    if (
      ((permitId === '' || permitId === null) && categoryId === 1) ||
      ((userPermitId === '' || userPermitId === null) && categoryId === 16)
    ) {
      setIsDisStatus(true);
      setStatusId(2);
      setStatusName('กำลังดำเนินการ');
    }
  }, [categoryId]);

  // useEffect(() => {
  //   console.log(`s = ${isStatusChange}`);
  // }, [isStatusChange]);

  function clearData() {
    setLevelId('');
    setOperatorId('');
    setOperatorName('');
    setPhoneNo('');
    setDeviceId('');
    setSolution('');
    setTaskCost('');
    setSerialnumber('');
    setCategoryName('');
    setCategoryId('');
    setTaskNote('');
    setEstimationId('');
    setEstimationName('');
    setIsStatusChange(false);
    setIsProgramChange(null);

    setTempNote('');
  }

  const handleProcessTask = (taskCase) => {
    if (categoryId === 1) {
      if (permitId === '' || permitId === null) {
        taskCase = 'request';
      }
      if (permitId !== '' && permitId !== null && statusId === 5) {
        taskCase = 'pRequest';
      }
    } else if (categoryId === 16) {
      if (userPermitId === '' || userPermitId === null) {
        if (permitId !== '' && permitId !== null && statusId === 5) {
          taskCase = 'pRequest';
        } else {
          taskCase = 'request';
        }
      }
      if (permitId !== '' && permitId !== null && statusId === 5) {
        taskCase = 'pRequest';
      }
    }

    if (isStatusChange && tempStatus !== 2) {
      taskCase = statusId === 5 ? 'complete' : 'request';
    }

    let isOSC = false;
    if (dialogStatus === 4 && taskCase === 'complete' && (levelId === 'DMIS_MT' || levelId === 'DMIS_MER')) {
      taskCase = 'osRequest';
      isOSC = true;
    }

    const jsonData = {
      task_id: data.task_id,
      level_id: levelId,
      task_solution: solution,
      task_cost: document.getElementById('cost').value,
      task_serialnumber: serialnumber,
      task_device_id: deviceId,
      // status_id_request: (permitId === "" || permitId === null) && categoryId === 1 ? 2 : statusId,
      status_id_request: !isOSC ? statusId : 5,
      operator_id: operatorId,
      category_id: categoryId,
      task_phone_no: phoneNo,
      task_note:
        (taskCase === 'complete' || taskCase === 'pRequest' || taskCase === 'osRequest') && taskNote === tempNote
          ? ''
          : taskNote,
      estimation_id: estimationId,
      is_program_change: isProgramChange,
      // eslint-disable-next-line object-shorthand
      taskCase: taskCase,
    };

    // console.log(jsonData);

    if (
      jsonData.status_id_request === '' ||
      jsonData.status_id_request === null ||
      jsonData.operator_id === '' ||
      (jsonData.status_id_request !== 0 && (jsonData.category_id === '' || jsonData.category_id === null)) ||
      (jsonData.task_device_id !== '' && jsonData.task_device_id.length !== 18) ||
      (jsonData.status_id_request === 5 && jsonData.task_solution === '') ||
      (jsonData.taskCase === 'complete' && jsonData.task_solution === '') ||
      jsonData.estimation_id === '' ||
      jsonData.estimation_id === null ||
      ((jsonData.status_id_request === 3 || jsonData.status_id_request === 4) &&
        (jsonData.task_note === '' || jsonData.task_note === null)) ||
      (jsonData.category_id === 16 && jsonData.task_cost === '')
    ) {
      setSubmitINC(true);
      return;
    }

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_dmisPort}/processtask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
      body: JSON.stringify(jsonData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'ok') {
          clearData();
          onCloseDialg();
        } else {
          setSubmitERR(true);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setSubmitERR(true);
      });
  };

  return (
    <>
      <SubmtINC openDialg={submitINC} onCloseDialg={() => setSubmitINC(false)} />
      <SubmtERR openDialg={submitERR} onCloseDialg={() => setSubmitERR(false)} />
      <Dialog
        fullWidth
        maxWidth="md"
        open={openDialg}
        onClose={() => {
          clearData();
          onCloseDialg();
        }}
      >
        <DialogTitle>บันทึกงานแจ้งซ่อม</DialogTitle>
        <DialogContent>
          <DialogContentText>กรุณาระบุรายละเอียดงาน</DialogContentText>
          <Stack spacing={2} sx={{ width: 'auto', p: 2 }}>
            <Autocomplete
              value={statusName}
              // disabled={(permitId === "" || permitId === null) && categoryId === 1}
              disabled={isDisStatus}
              onChange={(event, newValue) => {
                setStatusName(newValue);
                if (newValue !== null) {
                  if (statList.find((o) => o.status_name === newValue).status_id !== tempStatus) {
                    setIsStatusChange(true);
                  } else {
                    setIsStatusChange(false);
                  }
                  setStatusId(statList.find((o) => o.status_name === newValue).status_id);
                  if (statList.find((o) => o.status_name === newValue).status_id !== 5) {
                    setSolution('');
                  }
                } else {
                  setStatusId('');
                }
              }}
              id="controllable-states-status-id"
              options={Object.values(statList).map((option) => option.status_name)}
              fullWidth
              required
              renderInput={(params) => <TextField {...params} label="สถานะของงาน" />}
              sx={{
                '& .MuiAutocomplete-inputRoot': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: statusName ? 'green' : 'red',
                  },
                },
              }}
            />
          </Stack>
          <Divider />
          <Stack spacing={2} sx={{ width: 'auto', p: 2 }}>
            <TextField
              id="phoneNo"
              name="phoneNo"
              value={phoneNo === null ? '' : phoneNo}
              onChange={(event) => {
                setPhoneNo(event.target.value);
              }}
              label="เบอร์โทรติดต่อผู้แจ้งซ่อม"
            />
            <InputMask
              value={deviceId === null ? '' : deviceId}
              onChange={(event) => {
                setDeviceId(event.target.value);
              }}
              mask="99-99-999-999-9999"
              disabled={false}
              maskChar=""
            >
              {() => <TextField id="deviceId" name="deviceId" label="รหัสทรัพย์สิน" placeholder="xx-xx-xxx-xxx-xxxx" />}
            </InputMask>
            {((dialogStatus === 3 || dialogStatus === 4 || dialogStatus === 6) && dialogStatus === statusId) ||
            statusId === 5 ? (
              <>
                <TextField
                  id="solution"
                  name="solution"
                  label="รายละเอียดของการแก้ปัญหา"
                  value={solution === null ? '' : solution}
                  onChange={(event) => {
                    setSolution(event.target.value);
                  }}
                  inputProps={{ maxLength: 140 }}
                  sx={{
                    '& input:valid + fieldset': {
                      borderColor: solution ? 'green' : 'red',
                    },
                  }}
                />
              </>
            ) : (
              <></>
            )}

            <TextField
              id="serialnumber"
              name="serialnumber"
              value={serialnumber === null ? '' : serialnumber}
              onChange={(event) => {
                setSerialnumber(event.target.value);
              }}
              label="Serial Number"
            />
            <TextField
              id="cost"
              name="cost"
              value={taskCost === null ? '' : taskCost}
              onChange={(event) => {
                setTaskCost(event.target.value);
              }}
              label="งบประมาณที่ใช้"
              sx={{
                '& input:valid + fieldset': {
                  borderColor: categoryId === 16 ? (taskCost ? 'green' : 'red') : '',
                },
              }}
            />
            <Autocomplete
              value={estimationName === null ? '' : estimationName}
              onChange={(event, newValue) => {
                setEstimationName(newValue);
                if (newValue !== null && newValue !== '') {
                  setEstimationId(estList.find((o) => o.estimation_name === newValue).estimation_id);
                } else {
                  setEstimationId('');
                }
              }}
              id="controllable-states-estimation-id"
              options={Object.values(estList).map((option) => option.estimation_name)}
              fullWidth
              required
              renderInput={(params) => <TextField {...params} label="การประมาณวันดำเนินงาน" />}
              sx={{
                '& .MuiAutocomplete-inputRoot': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: estimationName ? 'green' : 'red',
                  },
                },
              }}
            />
            <Autocomplete
              value={operatorName}
              onChange={(event, newValue) => {
                setOperatorName(newValue);
                if (newValue !== null) {
                  setOperatorId(
                    operList.find((o) => `${o.personnel_firstname} ${o.personnel_lastname}` === newValue).personnel_id
                  );
                } else {
                  setOperatorId('');
                }
              }}
              id="controllable-states-operator-id"
              options={
                levelId === 'DMIS_IT'
                  ? Object.values(operList)
                      .map((option) =>
                        option.level_id === 'DMIS_IT' || option.level_id === 'DMIS_HIT'
                          ? `${option.personnel_firstname} ${option.personnel_lastname}`
                          : ''
                      )
                      .filter(isSkip)
                  : levelId === 'DMIS_MT'
                  ? Object.values(operList)
                      .map((option) =>
                        option.level_id === 'DMIS_MT' || option.level_id === 'DMIS_ENV'
                          ? `${option.personnel_firstname} ${option.personnel_lastname}`
                          : ''
                      )
                      .filter(isSkip)
                  : Object.values(operList)
                      .map((option) =>
                        option.level_id === 'DMIS_MER' || option.level_id === 'DMIS_ENV'
                          ? `${option.personnel_firstname} ${option.personnel_lastname}`
                          : ''
                      )
                      .filter(isSkip)
              }
              fullWidth
              required
              renderInput={(params) => <TextField {...params} label="ผู้รับผิดชอบงาน" />}
              sx={{
                '& .MuiAutocomplete-inputRoot': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: operatorName ? 'green' : 'red',
                  },
                },
              }}
            />
            <Autocomplete
              value={categoryName === null ? '' : categoryName}
              onChange={(event, newValue) => {
                setCategoryName(newValue);
                if (newValue !== null) {
                  setCategoryId(categories.find((o) => o.category_name === newValue).category_id);
                } else {
                  setCategoryId('');
                }
              }}
              id="controllable-states-categories-id"
              options={
                levelId === 'DMIS_IT'
                  ? Object.values(categories)
                      .map((option) => (option.level_id === 'DMIS_IT' ? option.category_name : ''))
                      .filter(isSkip)
                  : levelId === 'DMIS_MT'
                  ? Object.values(categories)
                      .map((option) => (option.level_id === 'DMIS_MT' ? option.category_name : ''))
                      .filter(isSkip)
                  : Object.values(categories)
                      .map((option) => (option.level_id === 'DMIS_MER' ? option.category_name : ''))
                      .filter(isSkip)
              }
              fullWidth
              required
              renderInput={(params) => <TextField {...params} label="หมวดหมู่งาน" />}
              sx={{
                '& .MuiAutocomplete-inputRoot': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: statusId === 0 ? '' : categoryName ? 'green' : 'red',
                  },
                },
              }}
            />
            {/* {(permitId === "" || permitId === null) && categoryId === 1 ? */}
            {isDisStatus ? (
              <Box>
                {categoryId === 1 ? (
                  <Typography sx={{ color: 'error.main', ml: 1 }}>
                    งานนี้จะเข้าสู่กระบวนการอนุมัติเมื่อกดดำเนินการ
                    กรณีที่งานนี้เสร็จสิ้นแล้วผู้ดำเนินงานต้องกลับมาปิดงานนี้อีกครั้งหลังอนุมัติ
                  </Typography>
                ) : categoryId === 16 ? (
                  <Typography sx={{ color: 'error.main', ml: 1 }}>
                    งานนี้จะเข้าสู่กระบวนการรออนุมัติแก้ไขโปรแกรม กรุณาแจ้งหน่วยงานต้นเรื่องเพื่อทำการอนุมัติ
                  </Typography>
                ) : (
                  ''
                )}
              </Box>
            ) : (
              ''
            )}
            {(categoryId === 1 || categoryId === 16) && statusId === 5 ? (
              <Box>
                <Radio
                  checked={isProgramChange === true}
                  onClick={() => setIsProgramChange(true)}
                  name="radio-buttons"
                />
                มีการวางโปรแกรม
                <Radio
                  checked={isProgramChange === false}
                  onClick={() => setIsProgramChange(false)}
                  name="radio-buttons"
                />
                ไม่มีการวางโปรแกรม
              </Box>
            ) : (
              ''
            )}
            <TextField
              id="taskNote"
              name="taskNote"
              label="หมายเหตุ"
              value={taskNote === null ? '' : taskNote}
              onChange={(event) => {
                setTaskNote(event.target.value);
              }}
              inputProps={{ maxLength: 140 }}
              sx={{
                '& input:valid + fieldset': {
                  borderColor: statusId === 0 || statusId === 3 || statusId === 4 ? (taskNote ? 'green' : 'red') : '',
                },
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          {(dialogStatus === 3 || dialogStatus === 4 || dialogStatus === 6) && dialogStatus === statusId ? (
            <>
              <Button
                variant="contained"
                onClick={() => {
                  handleProcessTask('complete');
                }}
              >
                ปิดงาน
              </Button>
            </>
          ) : (
            <></>
          )}
          <div style={{ flex: '1 0 0' }} />
          <Button
            onClick={() => {
              clearData();
              onCloseDialg();
            }}
          >
            ยกเลิก
          </Button>
          {/* <Button variant="contained" onClick={() => { handleProcessTask(dialogStatus === 2 && isStatusChange ? "request" : "edit") }}>ดำเนินการ</Button> */}
          <Button
            variant="contained"
            onClick={() => {
              handleProcessTask(isStatusChange ? 'request' : 'edit');
            }}
            disabled={isProgramChange === null && statusId === 5 && (categoryId === 1 || categoryId === 16)}
          >
            ดำเนินการ
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default IIOSTaskProc;
