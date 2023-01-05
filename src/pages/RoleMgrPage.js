import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Typography, Card, Stack, Autocomplete, TextField, Button, } from '@mui/material';
import { useEffect, useState } from 'react';
// ----------------------------------------------------------------------

export default function RoleMgrPage() {

  const [filterFields, setFilterFields] = useState([]);
  const [fields, setFields] = useState([]);
  const [fieldId, setFieldId] = useState('');
  const [fieldName, setFieldName] = useState('');

  const [filterFactions, setFilterFactions] = useState([]);
  const [factions, setFactions] = useState([]);
  const [factionId, setFactionId] = useState('');
  const [factionName, setFactionName] = useState('');

  const [filterDepartments, setFilterDepartments] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [departmentId, setDepartmentId] = useState('');
  const [departmentName, setDepartmentName] = useState('');

  const [filterPositions, setFilterPositions] = useState([]);
  const [positions, setPositions] = useState([]);
  const [positionId, setPositionId] = useState('');
  const [positionName, setPositionName] = useState('');

  const [showActive, setShowActive] = useState(true);
  const isSkip = (value) => value !== '';

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
    }
  }, [positionId]);

  useEffect(() => {
    if (departmentId !== "") {
      setFactionId(departments.find(o => o.department_id === departmentId).faction_id);
      setFactionName(factions.find(o => o.faction_id === departments.find(o => o.department_id === departmentId).faction_id).faction_name);
    }
    else {
      setPositionId("");
      setPositionName("");
    }
  }, [departmentId]);

  useEffect(() => {
    if (factionId !== "") {
      setFieldId(factions.find(o => o.faction_id === factionId).field_id);
      setFieldName(fields.find(o => o.field_id === factions.find(o => o.faction_id === factionId).field_id).field_name);
    }
    else {
      setDepartmentId("");
      setDepartmentName("");
    }
  }, [factionId]);

  const handleShowActive = () => {
    setShowActive(!showActive);
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
                    setFactionId("");
                    setFactionName("");
                    setDepartmentId("");
                    setDepartmentName("");
                    setPositionId("");
                    setPositionName("");
                  }
                  else {
                    setFieldId("");
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
                  <Button variant="contained" sx={{ width: 200 }} >เพิ่มสายงาน</Button>
                  <Button variant="contained" disabled={fieldId === ""} sx={{ width: 200 }} >แก้ไขชื่อ/สังกัด</Button>
                  <Button variant="contained" disabled={fieldId === ""} color="error" sx={{ width: 200 }} >Deactive</Button>
                </>
              ) : (
                <>
                  <Button variant="contained" disabled={fieldId === ""} color="success" sx={{ width: 200 }} >Active</Button>
                  <Button variant="contained" disabled={fieldId === ""} color="error" sx={{ width: 200 }} >ลบสายงาน</Button>
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
                    setDepartmentId("");
                    setDepartmentName("");
                    setPositionId("");
                    setPositionName("");
                  }
                  else {
                    setFactionId("");
                  }
                }}
                id="controllable-states-factions-id"
                options={fieldId === "" ? Object.values(filterFactions).map((option) => option.faction_name) : Object.values(filterFactions).map((option) => option.field_id === fieldId ? option.faction_name : '').filter(isSkip)}
                sx={{ width: 600 }}
                renderInput={(params) => <TextField {...params} />}
              />
              {showActive ? (
                <>
                  <Button variant="contained" disabled={fieldId === ""} sx={{ width: 200 }} >เพิ่มฝ่าย</Button>
                  <Button variant="contained" disabled={factionId === ""} sx={{ width: 200 }} >แก้ไขชื่อ/สังกัด</Button>
                  <Button variant="contained" disabled={factionId === ""} color="error" sx={{ width: 200 }} >Deactive</Button>
                </>
              ) : (
                <>
                  <Button variant="contained" disabled={factionId === ""} color="success" sx={{ width: 200 }} >Active</Button>
                  <Button variant="contained" disabled={factionId === ""} color="error" sx={{ width: 200 }} >ลบฝ่าย</Button>
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
                    setPositionId("");
                    setPositionName("");
                  }
                  else {
                    setDepartmentId("");
                  }
                }}
                id="controllable-states-departments-id"
                options={fieldId === "" ? Object.values(filterDepartments).map((option) => option.department_name) : factionId === "" ? Object.values(filterDepartments).map((option) => option.field_id === fieldId ? option.department_name : '').filter(isSkip) : Object.values(filterDepartments).map((option) => option.faction_id === factionId ? option.department_name : '').filter(isSkip)}
                sx={{ width: 600 }}
                renderInput={(params) => <TextField {...params} />}
              />
              {showActive ? (
                <>
                  <Button variant="contained" disabled={factionId === ""} sx={{ width: 200 }} >เพิ่มแผนก</Button>
                  <Button variant="contained" disabled={departmentId === ""} sx={{ width: 200 }} >แก้ไขชื่อ/สังกัด</Button>
                  <Button variant="contained" disabled={departmentId === ""} color="error" sx={{ width: 200 }} >Deactive</Button>
                </>
              ) : (
                <>
                  <Button variant="contained" disabled={departmentId === ""} color="success" sx={{ width: 200 }} >Active</Button>
                  <Button variant="contained" disabled={departmentId === ""} color="error" sx={{ width: 200 }} >ลบแผนก</Button>
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
                  }
                  else {
                    setPositionId("");
                  }
                }}
                id="controllable-states-positions-id"
                options={fieldId === "" ? Object.values(filterPositions).map((option) => option.position_name) : factionId === "" ? Object.values(filterPositions).map((option) => option.field_id === fieldId ? option.position_name : '').filter(isSkip) : departmentId === "" ? Object.values(filterPositions).map((option) => option.faction_id === factionId ? option.position_name : '').filter(isSkip) : Object.values(filterPositions).map((option) => option.department_id === departmentId ? option.position_name : '').filter(isSkip)}
                sx={{ width: 600 }}
                renderInput={(params) => <TextField {...params} />}
              />
              {showActive ? (
                <>
                  <Button variant="contained" disabled={departmentId === ""} sx={{ width: 200 }} >เพิ่มตำแหน่ง</Button>
                  <Button variant="contained" disabled={positionId === ""} sx={{ width: 200 }} >แก้ไขชื่อ/สังกัด</Button>
                  <Button variant="contained" disabled={positionId === ""} color="error" sx={{ width: 200 }} >Deactive</Button>
                </>
              ) : (
                <>
                  <Button variant="contained" disabled={positionId === ""} color="success" sx={{ width: 200 }} >Active</Button>
                  <Button variant="contained" disabled={positionId === ""} color="error" sx={{ width: 200 }} >ลบตำแหน่ง</Button>
                </>
              )}

            </Stack>
          </Stack>

        </Card>

      </Container>
    </>
  );
}
