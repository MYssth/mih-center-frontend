import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField } from '@mui/material';
import { ErrMsgDialg } from '../../../../components/dialogs/response';

function DISChgTmptDialg({ openDialg, onCloseDialg, mode, tag, data, rToken }) {
  const [openErrMsg, setOpenErrMsg] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const [name, setName] = useState('');
  const [descr, setDescr] = useState('');
  const [remark, setRemark] = useState('');

  useEffect(() => {
    setName('');
    setDescr('');
    setRemark('');
    if (openDialg) {
      if (mode === 'edit') {
        setName(data.name);
        setDescr(data.descr);
        setRemark(data.remark);
      }
    }
  }, [openDialg]);

  const handleSubmit = (inactive) => {
    const jsonData = {
      id: data?.id,
      name,
      descr,
      remark,
      inactive,
      create_by: mode === 'new' ? jwtDecode(localStorage.getItem('token')).psn_id : null,
      last_edit_by: mode === 'edit' ? jwtDecode(localStorage.getItem('token')).psn_id : null,
    };

    // console.log(jsonData);

    fetch(
      `${process.env.REACT_APP_host}${process.env.REACT_APP_disPort}/${mode === 'new' ? 'add' : 'update'}${tag}grp`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${rToken}`,
        },
        body: JSON.stringify(jsonData),
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

  return (
    <>
      <ErrMsgDialg
        openDialg={openErrMsg}
        onCloseDialg={() => {
          setErrMsg('');
          setOpenErrMsg(false);
        }}
        msg={errMsg}
        header="ไม่สามารถจัดการ Template ได้"
      />

      <Dialog open={openDialg} onClose={onCloseDialg}>
        <DialogTitle>
          {mode === 'new' ? 'เพิ่ม Template ' : 'แก้ไข Template '}
          {tag === 'inst' ? 'วิธีใช้' : tag === 'propty' ? 'รายละเอียดยา' : 'ข้อควรระวัง'}
        </DialogTitle>
        <DialogContent>
          <Grid container rowSpacing={{ xs: 2 }} columnSpacing={{ xs: 2 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="ชื่อ Template"
                value={name}
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
              {tag === 'inst' ? (
                <TextField
                  fullWidth
                  label="คำอธิบาย"
                  value={descr}
                  sx={{ mt: 1 }}
                  onChange={(event) => {
                    setDescr(event.target.value);
                  }}
                />
              ) : (
                <TextField
                  multiline
                  rows={5}
                  label="คำอธิบาย"
                  fullWidth
                  value={descr}
                  sx={{ mt: 1 }}
                  onChange={(event) => {
                    setDescr(event.target.value);
                  }}
                />
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="หมายเหตุ"
                value={remark}
                sx={{ mt: 1 }}
                onChange={(event) => {
                  setRemark(event.target.value);
                }}
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
              handleSubmit(null);
            }}
            className="btn btn-success"
            disabled={name === '' || name === null}
          >
            บันทึก
          </Button>
          <Button onClick={onCloseDialg} color="error">
            ยกเลิก
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default DISChgTmptDialg;
