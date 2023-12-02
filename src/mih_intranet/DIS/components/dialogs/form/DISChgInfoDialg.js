import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  TextField,
  Stack,
} from '@mui/material';
import { ErrMsgDialg } from '../../../../components/dialogs/response';
import DISWordTeamplate from './DISSelTemplate';

function DISChgInfoDialg({ openDialg, onCloseDialg, rToken, mode, data, instGrp, proptyGrp, warnGrp }) {
  const [file, setFile] = useState({});
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [imageChange, setImageChange] = useState(false);

  const [id, setId] = useState('');
  const [nameEN, setNameEN] = useState('');
  const [nameTH, setNameTH] = useState('');
  const [remark, setRemark] = useState('');

  const [inst, setInst] = useState('');
  const [instGrpId, setInstGrpId] = useState(0);
  const [instGrpName, setInstGrpName] = useState('');
  const [instDis, setInstDis] = useState(false);

  const [propty, setPropty] = useState('');
  const [proptyGrpId, setProptyGrpId] = useState(0);
  const [proptyGrpName, setProptyGrpName] = useState('');
  const [proptyDis, setProptyDis] = useState(false);

  const [warn, setWarn] = useState('');
  const [warnGrpId, setWarnGrpId] = useState(0);
  const [warnGrpName, setWarnGrpName] = useState('');
  const [warnDis, setWarnDis] = useState(false);

  const [openErrMsg, setOpenErrMsg] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const [openWordTemplate, setOpenWordTeamplate] = useState(false);
  const [tempMode, setTempMode] = useState('');

  useEffect(() => {
    if (openDialg) {
      setFile({});
      setImagePreviewUrl(null);
      setImageChange(false);
      setId('');
      setNameEN('');
      setNameTH('');
      setRemark('');
      setInst('');
      setInstGrpId(0);
      setInstDis(false);
      setPropty('');
      setProptyGrpId(0);
      setProptyDis(false);
      setWarn('');
      setWarnGrpId(0);
      setWarnDis(false);
      if (mode === 'edit') {
        setId(data.id);
        setNameEN(data.name_en);
        setNameTH(data.name_th);
        setRemark(data.remark);
        setInst(data.inst);
        setInstGrpId(data.instGrpId);
        setInstDis(data.instGrpId !== '' && data.instGrpId !== null && data.instGrpId !== undefined);
        setPropty(data.propty);
        setProptyGrpId(data.porptyGrpId);
        setProptyDis(data.porptyGrpId !== '' && data.porptyGrpId !== null && data.porptyGrpId !== undefined);
        setWarn(data.warn);
        setWarnGrpId(data.warnGrpId);
        setWarnDis(data.warnGrpId !== '' && data.warnGrpId !== null && data.warnGrpId !== undefined);
      }
    }
  }, [openDialg]);

  const handleSubmit = (inactive) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('id', id);
    formData.append('name_en', nameEN);
    formData.append('name_th', nameTH);
    formData.append('remark', remark);
    formData.append('inactive', inactive);
    formData.append('inst', inst);
    formData.append('inst_grp_id', instGrpId ?? 0);
    formData.append('propty', propty);
    formData.append('propty_grp_id', proptyGrpId ?? 0);
    formData.append('warn', warn);
    formData.append('warn_grp_id', warnGrpId ?? 0);

    formData.append(mode === 'new' ? 'create_by' : 'last_edit_by', jwtDecode(localStorage.getItem('token')).psn_id);
    fetch(
      `${process.env.REACT_APP_host}${process.env.REACT_APP_disPort}/${
        mode === 'new' ? 'adddruginfo' : 'updatedruginfo'
      }`,
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
        header={mode === 'new' ? 'ไม่สามารถเพิ่มข้อมูลได้' : 'ไม่สามารถแก้ไขข้อมูลได้'}
      />

      <DISWordTeamplate
        openDialg={openWordTemplate}
        onCloseDialg={(mode, id, name, descr) => {
          if (mode === 'inst') {
            setInstGrpId(id);
            setInstGrpName(name);
            setInst(descr);
            setInstDis(true);
          } else if (mode === 'propty') {
            setProptyGrpId(id);
            setProptyGrpName(name);
            setPropty(descr);
            setProptyDis(true);
          } else if (mode === 'warn') {
            setWarnGrpId(id);
            setWarnGrpName(name);
            setWarn(descr);
            setWarnDis(true);
          }
          setOpenWordTeamplate(false);
        }}
        rToken={rToken}
        mode={tempMode}
        data={tempMode === 'inst' ? instGrp : tempMode === 'propty' ? proptyGrp : warnGrp}
      />

      <Dialog open={openDialg} onClose={onCloseDialg}>
        <DialogTitle>{mode === 'new' ? 'เพิ่มข้อมูลยาใหม่' : `แก้ไขข้อมูลยารหัสเลขที่ ${id}`}</DialogTitle>
        <DialogContent>
          <div style={{ display: 'flex', height: '100%' }}>
            <Box sx={{ width: 1 }}>
              <div style={{ flexGrow: 1 }}>
                <img
                  src={
                    mode === 'new'
                      ? imagePreviewUrl
                      : imageChange
                      ? imagePreviewUrl
                      : `${process.env.REACT_APP_host}${process.env.REACT_APP_disPort}/getdrugimg/${id}`
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
              <Typography>รหัสยา</Typography>
              <TextField
                fullWidth
                label="ความยาวไม่เกิน 8 ตัวอักษร"
                value={id}
                inputProps={{ maxLength: 8 }}
                disabled={mode === 'edit'}
                onChange={(event) => {
                  setId(event.target.value);
                }}
                sx={{
                  '& input:valid + fieldset': {
                    borderColor: id ? 'green' : 'red',
                  },
                  mt: 1,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>ชื่อภาษาอังกฤษ</Typography>
              <TextField
                fullWidth
                label="ความยาวไม่เกิน 100 ตัวอักษร"
                value={nameEN}
                inputProps={{ maxLength: 100 }}
                onChange={(event) => {
                  setNameEN(event.target.value);
                }}
                sx={{ mt: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>ชื่อภาษาไทย</Typography>
              <TextField
                fullWidth
                label="ความยาวไม่เกิน 100 ตัวอักษร"
                value={nameTH}
                inputProps={{ maxLength: 100 }}
                onChange={(event) => {
                  setNameTH(event.target.value);
                }}
                sx={{ mt: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" spacing={1}>
                <Box display="flex" sx={{ width: '50%' }}>
                  <Typography sx={{ mt: 2 }}>วิธีใช้</Typography>
                </Box>
                <Box display="flex" justifyContent="flex-end" alignItems="flex-end" sx={{ width: 1 }}>
                  {instDis ? (
                    <>
                      {instGrpName}
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                          setInstGrpId('');
                          setInstGrpName('');
                          setInst(data.inst);
                          setInstDis(false);
                        }}
                        sx={{ ml: 1 }}
                      >
                        ยกเลิก
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={() => {
                        setTempMode('inst');
                        setOpenWordTeamplate(true);
                      }}
                    >
                      ใช้ Template
                    </Button>
                  )}
                </Box>
              </Stack>
              <TextField
                fullWidth
                label="ความยาวไม่เกิน 100 ตัวอักษร"
                value={inst}
                disabled={instDis}
                inputProps={{ maxLength: 100 }}
                onChange={(event) => {
                  setInst(event.target.value);
                }}
                sx={{ mt: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" spacing={1}>
                <Box display="flex" sx={{ width: '50%' }}>
                  <Typography sx={{ mt: 2 }}>รายละเอียดยา</Typography>
                </Box>
                <Box display="flex" justifyContent="flex-end" alignItems="flex-end" sx={{ width: 1 }}>
                  {proptyDis ? (
                    <>
                      {proptyGrpName}
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                          setProptyGrpId('');
                          setProptyGrpName('');
                          setPropty(data.propty);
                          setProptyDis(false);
                        }}
                        sx={{ ml: 1 }}
                      >
                        ยกเลิก
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={() => {
                        setTempMode('propty');
                        setOpenWordTeamplate(true);
                      }}
                    >
                      ใช้ Template
                    </Button>
                  )}
                </Box>
              </Stack>
              <TextField
                multiline
                rows={5}
                fullWidth
                label="ความยาวไม่เกิน 1000 ตัวอักษร"
                value={propty}
                disabled={proptyDis}
                inputProps={{ maxLength: 1000 }}
                onChange={(event) => {
                  setPropty(event.target.value);
                }}
                sx={{ mt: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" spacing={1}>
                <Box display="flex" sx={{ width: '50%' }}>
                  <Typography sx={{ mt: 2 }}>ข้อควรระวัง</Typography>
                </Box>
                <Box display="flex" justifyContent="flex-end" alignItems="flex-end" sx={{ width: 1 }}>
                  {warnDis ? (
                    <>
                      {warnGrpName}
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                          setWarnGrpId('');
                          setWarnGrpName('');
                          setWarn(data.warn);
                          setWarnDis(false);
                        }}
                        sx={{ ml: 1 }}
                      >
                        ยกเลิก
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={() => {
                        setTempMode('warn');
                        setOpenWordTeamplate(true);
                      }}
                    >
                      ใช้ Template
                    </Button>
                  )}
                </Box>
              </Stack>
              <TextField
                multiline
                rows={5}
                fullWidth
                label="ความยาวไม่เกิน 1000 ตัวอักษร"
                value={warn}
                disabled={warnDis}
                inputProps={{ maxLength: 1000 }}
                onChange={(event) => {
                  setWarn(event.target.value);
                }}
                sx={{ mt: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>หมายเหตุ (ไม่แสดงในหน้าข้อมูลยาของผู้ป่วย)</Typography>
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
        </DialogContent>
        <DialogActions>
          {mode === 'new' ? (
            ''
          ) : data?.inactive ? (
            <Button
              onClick={() => {
                handleSubmit(null);
              }}
              className="btn btn-success"
            >
              Active
            </Button>
          ) : (
            <Button
              onClick={async () => {
                handleSubmit(1);
              }}
              className="btn btn-danger"
            >
              Inactive
            </Button>
          )}
          <div style={{ flex: '1 0 0' }} />
          <Button
            onClick={() => {
              handleSubmit(data.inactive ? 1 : 0);
            }}
            className="btn btn-success"
            disabled={id === '' || id === null}
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

export default DISChgInfoDialg;
