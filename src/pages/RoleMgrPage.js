import { Helmet } from 'react-helmet-async';
// @mui
import {
  Container,
  Typography,
  Card,
  Stack,
  Autocomplete,
  TextField,
  Button, Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  Box,
} from '@mui/material';
import { useEffect, useState } from 'react';
// ----------------------------------------------------------------------

export default function RoleMgrPage() {

  const [filterFields, setFilterFields] = useState([]);
  const [fields, setFields] = useState([]);
  const [fieldId, setFieldId] = useState('');
  const [fieldName, setFieldName] = useState('');
  const [fieldIsactive, setFieldIsactive] = useState('');

  const [filterFactions, setFilterFactions] = useState([]);
  const [factions, setFactions] = useState([]);
  const [factionId, setFactionId] = useState('');
  const [factionName, setFactionName] = useState('');
  const [factionIsactive, setFactionIsactive] = useState('');

  const [filterDepartments, setFilterDepartments] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [departmentId, setDepartmentId] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const [departmentIsactive, setDepartmentIsactive] = useState('');

  const [filterPositions, setFilterPositions] = useState([]);
  const [positions, setPositions] = useState([]);
  const [positionId, setPositionId] = useState('');
  const [positionName, setPositionName] = useState('');
  const [positionIsactive, setPositionIsactive] = useState('');

  const [showActive, setShowActive] = useState(true);
  const isSkip = (value) => value !== '';

  const [showName, setShowName] = useState('');
  const [role, setRole] = useState("");
  const [addRoleDialogOpen, setAddRoleDialogOpen] = useState(false);
  const [updateRoleDialogOpen, setUpdateRoleDialogOpen] = useState(false);
  const [inputRoleName, setInputRoleName] = useState('');
  const [inputUpperRoleId, setInputUpperRoleId] = useState('');
  const [inputUpperRoleName, setInputUpperRoleName] = useState('');
  const [statusRoleDialogOpen, setStatusRoleDialogOpen] = useState(false);
  const [statusRole, setStatusRole] = useState('');
  const [deleteRoleDialogOpen, setDeleteRoleDialogOpen] = useState(false);


  useEffect(() => {

    fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_psnDataDistPort}/api/getfields`)
      .then((response) => response.json())
      .then((data) => {
        setFields(data);
        setFilterFields(data.filter(dt => dt.field_isactive === showActive));
      })
      .catch((error) => {
        console.error(error);
      });

    fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_psnDataDistPort}/api/getfactions`)
      .then((response) => response.json())
      .then((data) => {
        setFactions(data);
        setFilterFactions(data.filter(dt => dt.faction_isactive === showActive));
      })
      .catch((error) => {
        console.error(error);
      });

    fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_psnDataDistPort}/api/getdepartments`)
      .then((response) => response.json())
      .then((data) => {
        setDepartments(data);
        setFilterDepartments(data.filter(dt => dt.department_isactive === showActive));
      })
      .catch((error) => {
        console.error(error);
      });

    fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_psnDataDistPort}/api/getpositions`)
      .then((response) => response.json())
      .then((data) => {
        setPositions(data);
        setFilterPositions(data.filter(dt => dt.position_isactive === showActive));
      })
      .catch((error) => {
        console.error(error);
      });

  }, []);

  useEffect(() => {

    setFieldId("");
    setFieldName("");
    setFactionId("");
    setFactionName("");
    setDepartmentId("");
    setDepartmentName("");
    setPositionId("");
    setPositionName("");

    setFilterFields(fields.filter(dt => dt.field_isactive === showActive));
    setFilterFactions(factions.filter(dt => dt.faction_isactive === showActive));
    setFilterDepartments(departments.filter(dt => dt.department_isactive === showActive));
    setFilterPositions(positions.filter(dt => dt.position_isactive === showActive));


  }, [showActive]);

  useEffect(() => {
    if (positionId !== "") {
      setDepartmentId(positions.find(o => o.position_id === positionId).department_id);
      setDepartmentName(departments.find(o => o.department_id === positions.find(o => o.position_id === positionId).department_id).department_name);
      setDepartmentIsactive(departments.find(o => o.department_id === positions.find(o => o.position_id === positionId).department_id).department_isactive);
    }
  }, [positionId]);

  useEffect(() => {
    if (departmentId !== "") {
      setFactionId(departments.find(o => o.department_id === departmentId).faction_id);
      setFactionName(factions.find(o => o.faction_id === departments.find(o => o.department_id === departmentId).faction_id).faction_name);
      setFactionIsactive(factions.find(o => o.faction_id === departments.find(o => o.department_id === departmentId).faction_id).faction_isactive);
    }
    else {
      setPositionId("");
      setPositionName("");
      setPositionIsactive("");
    }
  }, [departmentId]);

  useEffect(() => {
    if (factionId !== "") {
      setFieldId(factions.find(o => o.faction_id === factionId).field_id);
      setFieldName(fields.find(o => o.field_id === factions.find(o => o.faction_id === factionId).field_id).field_name);
      setFieldIsactive(fields.find(o => o.field_id === factions.find(o => o.faction_id === factionId).field_id).field_isactive);
    }
    else {
      setDepartmentId("");
      setDepartmentName("");
      setDepartmentIsactive("");
    }
  }, [factionId]);

  const handleShowActive = () => {
    setShowActive(!showActive);
  }

  const handleOpenAddRoleDialog = (role, sName) => {
    setRole(role);
    setShowName(sName);
    setAddRoleDialogOpen(true);
  }

  const handleCloseAddRoleDialog = () => {
    setAddRoleDialogOpen(false);
    setRole("");
    setShowName("");
  }

  const handleAddRole = () => {

    let jsonData = "";

    if (role === "field") {
      jsonData = {
        field_name: document.getElementById("role_name").value,
      };
    }
    else if (role === "faction") {
      jsonData = {
        faction_name: document.getElementById("role_name").value,
        field_id: fieldId,
      };
    }
    else if (role === "department") {
      jsonData = {
        department_name: document.getElementById("role_name").value,
        faction_id: factionId,
      };
    }
    else if (role === "position") {
      jsonData = {
        position_name: document.getElementById("role_name").value,
        department_id: departmentId,
      };
    }

    fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_roleCrudPort}/api/add${role}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData)
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'ok') {
          alert(`เพิ่ม${showName}สำเร็จ`);
          handleCloseAddRoleDialog();
          window.location.reload(false);
        }
        else {
          alert(`ไม่สามารถเพิ่ม${showName}ได้`);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert(`เกิดข้อผิดพลาดในการเพิ่ม${showName}`);
      });

  }

  const handleOpenUpdateRoleDialog = (role, sName) => {
    setRole(role);
    setShowName(sName);
    setInputRoleName(role === "field" ? fieldName : role === "faction" ? factionName : role === "department" ? departmentName : positionName);
    setInputUpperRoleId(role === "field" ? "" : role === "faction" ? fieldId : role === "department" ? factionId : departmentId);
    setInputUpperRoleName(role === "field" ? "" : role === "faction" ? fieldName : role === "department" ? factionName : departmentName);
    setUpdateRoleDialogOpen(true);
  }

  const handleCloseUpdateRoleDialog = () => {
    setUpdateRoleDialogOpen(false);
    setRole("");
    setShowName("");
    setInputRoleName("");
  }

  const handleUpdateRole = () => {

    let jsonData = "";
    if (role === "field") {
      jsonData = {
        field_id: fieldId,
        field_name: inputRoleName,
      }
    }
    else if (role === "faction") {
      jsonData = {
        faction_id: factionId,
        faction_name: inputRoleName,
        field_id: inputUpperRoleId,
      }
    }
    else if (role === "department") {
      jsonData = {
        department_id: departmentId,
        department_name: inputRoleName,
        faction_id: inputUpperRoleId,
      }
    }
    else if (role === "position") {
      jsonData = {
        position_id: positionId,
        position_name: inputRoleName,
        department_id: inputUpperRoleId,
      }
    }
    fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_roleCrudPort}/api/update${role}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData)
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'ok') {
          alert(`แก้ไข${showName}สำเร็จ`);
          handleCloseUpdateRoleDialog();
          window.location.reload(false);
        }
        else {
          alert(`ไม่สามารถแก้ไข${showName}ได้`);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert(`เกิดข้อผิดพลาดในการแก้ไข${showName}`);
      });

  }

  const handleOpenStatusRoleDialog = (status, role, sName) => {
    setStatusRole(status);
    setRole(role);
    setShowName(sName);
    setStatusRoleDialogOpen(true);
  }

  const handleCloseStatusRoleDialog = () => {
    setStatusRole("");
    setRole("");
    setShowName("");
    setStatusRoleDialogOpen(false);
  }

  const handleStatusRole = () => {

    let jsonData = "";
    if (role === "field") {
      jsonData = {
        field_id: fieldId,
        field_isactive: statusRole,
      }
    }
    else if (role === "faction") {
      jsonData = {
        faction_id: factionId,
        faction_isactive: statusRole,
        field_id: fieldId,
      }
    }
    else if (role === "department") {
      jsonData = {
        department_id: departmentId,
        department_isactive: statusRole,
        faction_id: factionId,
      }
    }
    else if (role === "position") {
      jsonData = {
        position_id: positionId,
        position_isactive: statusRole,
        department_id: departmentId,
      }
    }
    fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_roleCrudPort}/api/set${role}activate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData)
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'ok') {
          alert(`${statusRole === "0" ? "Deactive" : "Active"} ${showName}สำเร็จ`);
          handleCloseStatusRoleDialog();
          window.location.reload(false);
        }
        else {
          alert(`ไม่สามารถ ${statusRole === "0" ? "Deactive" : "Active"} ${showName}ได้ (message:${data.message})`);
          handleCloseStatusRoleDialog();
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert(`เกิดข้อผิดพลาดในการ ${statusRole === "0" ? "Deactive" : "Active"} ${showName}`);
      });

  }

  const handleOpenDeleteRoleDialog = (role, sName) => {
    setRole(role);
    setShowName(sName);
    setDeleteRoleDialogOpen(true);
  }

  const handleCloseDeleteRoleDialog = () => {
    setRole("");
    setShowName("");
    setDeleteRoleDialogOpen(false);
  }

  const handleDeleteRole = () => {
    let inputRoleId = "";
    let inputRoleName = "";
    if (role === "field") {
      inputRoleId = fieldId;
      inputRoleName = fieldName;
    }
    else if (role === "faction") {
      inputRoleId = factionId;
      inputRoleName = factionName;
    }
    else if (role === "department") {
      inputRoleId = departmentId;
      inputRoleName = departmentName;
    }
    else if (role === "position") {
      inputRoleId = positionId;
      inputRoleName = positionName;
    }
    if (document.getElementById('role_name').value !== inputRoleName) {
      alert(`ชื่อ${showName}ยืนยันการลบไม่ถูกต้องไม่สามารถลบ${showName}ได้`);
      return;
    }

    fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_roleCrudPort}/api/delete${role}/${inputRoleId}`, {
      method: 'DELETE'
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'ok') {
          alert(`ลบ${showName}สำเร็จ`);
          handleCloseDeleteRoleDialog();
          window.location.reload(false);
        }
        else {
          alert(`ไม่สามารถทำการลบ${showName}ได้ (message: ${data.message})`);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert(`เกิดข้อผิดพลาดในการลบ${showName}`);
        handleCloseDeleteRoleDialog();
        window.location.reload(false);
      });
  }

  return (
    <>
      <Helmet>
        <title> จัดการโครงสร้างองค์กร | MIH Center </title>
      </Helmet>

      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" sx={{ mb: 5 }}>
            จัดการโครงสร้างองค์กร {showActive ? "" : "(แสดงเฉพาะรายการ Deactive)"}
          </Typography>
          <Button variant="contained" onClick={handleShowActive}>
            {showActive ? "แสดงรายการ Deactive" : "แสดงรายการ Active"}
          </Button>
        </Stack>
        <Card>

          <Stack spacing={2} sx={{ width: 'auto', p: 2 }}>
            <Typography variant='h5'>สายงาน</Typography>
            <Stack direction="row" spacing={2} sx={{ width: 'auto', }}>
              <Autocomplete
                value={fieldName}
                onChange={(event, newValue) => {
                  setFieldName(newValue);
                  if (newValue !== null) {
                    setFieldId(fields.find(o => o.field_name === newValue).field_id);
                    setFieldIsactive(fields.find(o => o.field_name === newValue).field_isactive);
                    setFactionId("");
                    setFactionName("");
                    setDepartmentId("");
                    setDepartmentName("");
                    setPositionId("");
                    setPositionName("");
                  }
                  else {
                    setFieldId("");
                    setFieldIsactive("");
                    setFactionId("");
                    setFactionName("");
                  }
                }}
                id="controllable-states-fields-id"
                options={Object.values(filterFields).map((option) => option.field_name)}
                sx={{ width: 600 }}
                renderInput={(params) => <TextField {...params} />}
              />
              {showActive ? (
                <>
                  <Button variant="contained" sx={{ width: 200 }} onClick={() => { handleOpenAddRoleDialog("field", "สายงาน") }} >เพิ่มสายงาน</Button>
                  <Button variant="contained" disabled={fieldId === ""} sx={{ width: 200 }} onClick={() => { handleOpenUpdateRoleDialog("field", "สายงาน") }} >แก้ไขชื่อ/สังกัด</Button>
                  <Button variant="contained" disabled={fieldId === ""} color="error" sx={{ width: 200 }} onClick={() => { handleOpenStatusRoleDialog("0", "field", "สายงาน") }} >Deactive</Button>
                </>
              ) : (
                <>
                  <Button variant="contained" disabled={fieldId === "" || fieldIsactive} color="success" sx={{ width: 200 }} onClick={() => { handleOpenStatusRoleDialog("1", "field", "สายงาน") }} >Active</Button>
                  <Button variant="contained" disabled={fieldId === "" || fieldIsactive} color="error" sx={{ width: 200 }} onClick={() => { handleOpenDeleteRoleDialog("field", "สายงาน") }} >ลบสายงาน</Button>
                </>
              )}
            </Stack>
          </Stack>

          <Stack spacing={2} sx={{ width: 'auto', p: 2 }}>
            <Typography variant='h5'>ฝ่าย {fieldName === "" || fieldName === null ? '' : `ภายในสายงาน${fieldName}`}</Typography>
            <Stack direction="row" spacing={2} sx={{ width: 'auto', }}>
              <Autocomplete
                value={factionName}
                onChange={(event, newValue) => {
                  setFactionName(newValue);
                  if (newValue !== null) {
                    setFactionId(factions.find(o => o.faction_name === newValue).faction_id);
                    setFactionIsactive(factions.find(o => o.faction_name === newValue).faction_isactive);
                    setDepartmentId("");
                    setDepartmentName("");
                    setPositionId("");
                    setPositionName("");
                  }
                  else {
                    setFactionId("");
                    setFactionIsactive("");
                  }
                }}
                id="controllable-states-factions-id"
                options={fieldId === "" ? Object.values(filterFactions).map((option) => option.faction_name) : Object.values(filterFactions).map((option) => option.field_id === fieldId ? option.faction_name : '').filter(isSkip)}
                sx={{ width: 600 }}
                renderInput={(params) => <TextField {...params} />}
              />
              {showActive ? (
                <>
                  <Button variant="contained" disabled={fieldId === ""} sx={{ width: 200 }} onClick={() => { handleOpenAddRoleDialog("faction", "ฝ่าย") }} >เพิ่มฝ่าย</Button>
                  <Button variant="contained" disabled={factionId === ""} sx={{ width: 200 }} onClick={() => { handleOpenUpdateRoleDialog("faction", "ฝ่าย") }} >แก้ไขชื่อ/สังกัด</Button>
                  <Button variant="contained" disabled={factionId === ""} color="error" sx={{ width: 200 }} onClick={() => { handleOpenStatusRoleDialog("0", "faction", "ฝ่าย") }} >Deactive</Button>
                </>
              ) : (
                <>
                  <Button variant="contained" disabled={factionId === "" || factionIsactive} color="success" sx={{ width: 200 }} onClick={() => { handleOpenStatusRoleDialog("1", "faction", "ฝ่าย") }} >Active</Button>
                  <Button variant="contained" disabled={factionId === "" || factionIsactive} color="error" sx={{ width: 200 }} onClick={() => { handleOpenDeleteRoleDialog("faction", "ฝ่าย") }} >ลบฝ่าย</Button>
                </>
              )}

            </Stack>
          </Stack>

          <Stack spacing={2} sx={{ width: 'auto', p: 2 }}>
            <Typography variant='h5'>แผนก {factionName === "" || factionName === null ? '' : `ภายในฝ่าย${factionName}`}</Typography>
            <Stack direction="row" spacing={2} sx={{ width: 'auto', }}>
              <Autocomplete
                value={departmentName}
                onChange={(event, newValue) => {
                  setDepartmentName(newValue);
                  if (newValue !== null) {
                    setDepartmentId(departments.find(o => o.department_name === newValue).department_id);
                    setDepartmentIsactive(departments.find(o => o.department_name === newValue).department_isactive);
                    setPositionId("");
                    setPositionName("");
                  }
                  else {
                    setDepartmentId("");
                    setDepartmentIsactive("");
                  }
                }}
                id="controllable-states-departments-id"
                options={fieldId === "" ? Object.values(filterDepartments).map((option) => option.department_name) : factionId === "" ? Object.values(filterDepartments).map((option) => option.field_id === fieldId ? option.department_name : '').filter(isSkip) : Object.values(filterDepartments).map((option) => option.faction_id === factionId ? option.department_name : '').filter(isSkip)}
                sx={{ width: 600 }}
                renderInput={(params) => <TextField {...params} />}
              />
              {showActive ? (
                <>
                  <Button variant="contained" disabled={factionId === ""} sx={{ width: 200 }} onClick={() => { handleOpenAddRoleDialog("department", "แผนก") }} >เพิ่มแผนก</Button>
                  <Button variant="contained" disabled={departmentId === ""} sx={{ width: 200 }} onClick={() => { handleOpenUpdateRoleDialog("department", "แผนก") }} >แก้ไขชื่อ/สังกัด</Button>
                  <Button variant="contained" disabled={departmentId === ""} color="error" sx={{ width: 200 }} onClick={() => { handleOpenStatusRoleDialog("0", "department", "แผนก") }} >Deactive</Button>
                </>
              ) : (
                <>
                  <Button variant="contained" disabled={departmentId === "" || departmentIsactive} color="success" sx={{ width: 200 }} onClick={() => { handleOpenStatusRoleDialog("1", "department", "แผนก") }} >Active</Button>
                  <Button variant="contained" disabled={departmentId === "" || departmentIsactive} color="error" sx={{ width: 200 }} onClick={() => { handleOpenDeleteRoleDialog("department", "แผนก") }} >ลบแผนก</Button>
                </>
              )}

            </Stack>
          </Stack>

          <Stack spacing={2} sx={{ width: 'auto', p: 2 }}>
            <Typography variant='h5'>ตำแหน่ง {departmentName === "" || departmentName === null ? '' : `ภายในแผนก${departmentName}`}</Typography>
            <Stack direction="row" spacing={2} sx={{ width: 'auto', }}>
              <Autocomplete
                value={positionName}
                onChange={(event, newValue) => {
                  setPositionName(newValue);
                  if (newValue !== null) {
                    setPositionId(positions.find(o => o.position_name === newValue).position_id);
                    setPositionIsactive(positions.find(o => o.position_name === newValue).position_isactive);
                  }
                  else {
                    setPositionId("");
                    setPositionIsactive("");
                  }
                }}
                id="controllable-states-positions-id"
                options={fieldId === "" ? Object.values(filterPositions).map((option) => option.position_name) : factionId === "" ? Object.values(filterPositions).map((option) => option.field_id === fieldId ? option.position_name : '').filter(isSkip) : departmentId === "" ? Object.values(filterPositions).map((option) => option.faction_id === factionId ? option.position_name : '').filter(isSkip) : Object.values(filterPositions).map((option) => option.department_id === departmentId ? option.position_name : '').filter(isSkip)}
                sx={{ width: 600 }}
                renderInput={(params) => <TextField {...params} />}
              />
              {showActive ? (
                <>
                  <Button variant="contained" disabled={departmentId === ""} sx={{ width: 200 }} onClick={() => { handleOpenAddRoleDialog("position", "ตำแหน่ง") }} >เพิ่มตำแหน่ง</Button>
                  <Button variant="contained" disabled={positionId === ""} sx={{ width: 200 }} onClick={() => { handleOpenUpdateRoleDialog("position", "ตำแหน่ง") }} >แก้ไขชื่อ/สังกัด</Button>
                  <Button variant="contained" disabled={positionId === ""} color="error" sx={{ width: 200 }} onClick={() => { handleOpenStatusRoleDialog("0", "position", "ตำแหน่ง") }} >Deactive</Button>
                </>
              ) : (
                <>
                  <Button variant="contained" disabled={positionId === "" || positionIsactive} color="success" sx={{ width: 200 }} onClick={() => { handleOpenStatusRoleDialog("1", "position", "ตำแหน่ง") }} >Active</Button>
                  <Button variant="contained" disabled={positionId === "" || positionIsactive} color="error" sx={{ width: 200 }} onClick={() => { handleOpenDeleteRoleDialog("position", "ตำแหน่ง") }} >ลบตำแหน่ง</Button>
                </>
              )}

            </Stack>
          </Stack>

        </Card>

      </Container>

      {/* ============================ เพิ่ม ======================================= */}
      <Dialog fullWidth maxWidth="md" open={addRoleDialogOpen} onClose={handleCloseAddRoleDialog}>
        <DialogTitle>เพิ่ม{showName}ใหม่</DialogTitle>
        <DialogContent>
          <Box sx={{ flexGrow: 1, p: 2 }}>
            <Grid spacing={1}>
              <DialogContentText sx={{ mb: 1 }}>
                {role === "field" ? "" : role === "faction" ? `เพิ่มฝ่ายภายในสายงาน ${fieldName}` : role === "department" ? `เพิ่มแผนกภายในฝ่าย ${factionName}` : `เพิ่มตำแหน่งภายในแผนก ${departmentName}`}
              </DialogContentText>
              <TextField id="role_name" name="role_name" label={`ชื่อ${showName}`} fullWidth />
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddRoleDialog}>ยกเลิก</Button>
          <Button variant="contained" onClick={handleAddRole}>เพิ่ม{showName}</Button>
        </DialogActions>
      </Dialog>
      {/* ================================================================================== */}

      {/* ============================ แก้ไข ======================================= */}
      <Dialog fullWidth maxWidth="md" open={updateRoleDialogOpen} onClose={handleCloseUpdateRoleDialog}>
        <DialogTitle>แก้ไข{showName}</DialogTitle>
        <DialogContent>
          <Box sx={{ flexGrow: 1, p: 2 }}>
            <Grid spacing={1}>
              <Autocomplete
                value={inputUpperRoleName}
                onChange={(event, newValue) => {
                  setInputUpperRoleName(newValue);
                  if (newValue !== null) {
                    setInputUpperRoleId(role === "faction" ? fields.find(o => o.field_name === newValue).field_id : role === "department" ? factions.find(o => o.faction_name === newValue).faction_id : departments.find(o => o.department_name === newValue).department_id);
                  }
                  else {
                    setInputUpperRoleId("");
                    setInputUpperRoleName("");
                  }
                }}
                disabled={role === "field"}
                id="controllable-states-role"
                options={role === "faction" ? Object.values(filterFields).map((option) => option.field_name).filter(isSkip) : role === "department" ? Object.values(filterFactions).map((option) => option.faction_name).filter(isSkip) : Object.values(filterDepartments).map((option) => option.department_name).filter(isSkip)}
                fullWidth
                sx={{ mb: 2 }}
                renderInput={(params) => <TextField {...params} label={`${role === "field" ? "ไม่มีสังกัด" : role === "faction" ? "สังกัดสายงาน" : role === "department" ? "สังกัดฝ่าย" : "สังกัดแผนก"}`} />}
              />
              <TextField id="role_name" name="role_name" label={`ชื่อ${showName}`} fullWidth value={inputRoleName} onChange={(event) => { setInputRoleName(event.target.value) }} />
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateRoleDialog}>ยกเลิก</Button>
          <Button variant="contained" onClick={handleUpdateRole}>แก้ไข{showName}</Button>
        </DialogActions>
      </Dialog>
      {/* ================================================================================== */}

      {/* ============================ Active/Deactive ======================================= */}
      <Dialog fullWidth maxWidth="md" open={statusRoleDialogOpen} onClose={handleCloseStatusRoleDialog}>
        <DialogTitle>{statusRole === "0" ? "Deactive" : "Active"} {showName}{role === "field" ? fieldName : role === "faction" ? factionName : role === "department" ? departmentName : positionName}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            คุณต้องการ {statusRole === "0" ? "Deactive" : "Active"} {showName}{role === "field" ? fieldName : role === "faction" ? factionName : role === "department" ? departmentName : positionName} ใช่หรือไม่
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusRoleDialog}>ยกเลิก</Button>
          <Button variant="contained" onClick={handleStatusRole}>{statusRole === "0" ? "Deactive" : "Active"} {showName}</Button>
        </DialogActions>
      </Dialog>
      {/* ================================================================================== */}

      {/* ============================ Delete ======================================= */}
      <Dialog fullWidth maxWidth="md" open={deleteRoleDialogOpen} onClose={handleCloseDeleteRoleDialog}>
        <DialogTitle>ลบ{showName} {role === "field" ? fieldName : role === "faction" ? factionName : role === "department" ? departmentName : positionName}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            กรุณากรอกชื่อ{showName} "{role === "field" ? fieldName : role === "faction" ? factionName : role === "department" ? departmentName : positionName}" เพื่อยืนยันการลบข้อมูล
          </DialogContentText>
          <TextField id="role_name" name="role_name" label={`ชื่อ${showName}`} fullWidth />
          <DialogContentText sx={{ color: 'error.main' }}>
            *คำเตือน: หากลบ{showName}แล้วข้อมูล{showName}จะหายไปอย่างถาวรไม่สามารถกู้คืนได้*
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteRoleDialog}>ยกเลิก</Button>
          <Button variant="contained" onClick={handleDeleteRole}>ลบ{showName}</Button>
        </DialogActions>
      </Dialog>
      {/* ================================================================================== */}

    </>
  );
}
