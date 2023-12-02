import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  Autocomplete,
} from '@mui/material';
import { ErrMsgDialg } from '../../../../components/dialogs/response';

function DISSelTemplate({ openDialg, onCloseDialg, mode, data }) {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [descr, setDescr] = useState('');
  const [remark, setRemark] = useState('');

  const [openErrMsg, setOpenErrMsg] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    if (openDialg) {
      setId('');
      setName('');
      setDescr('');
      setRemark('');
    }
  }, [openDialg]);

  const handleSubmit = () => {
    onCloseDialg(mode, id, name, descr);
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
        header="ไม่สามารถใช้ Template ได้"
      />

      <Dialog open={openDialg} onClose={onCloseDialg}>
        <DialogTitle>
          {mode === 'inst' ? 'Template วิธีใช้' : mode === 'propty' ? 'Template รายละเอียดยา' : 'Template ข้อควรระวัง'}
        </DialogTitle>
        <DialogContent>
          <Grid container rowSpacing={{ xs: 2 }} columnSpacing={{ xs: 2 }}>
            <Grid item xs={12}>
              <Autocomplete
                options={Object.values(data).map((option) => option.name)}
                // options={Object.values(data)?.map((option) => console.log(option))}
                fullWidth
                value={name}
                onChange={(event, newValue) => {
                  setName(newValue);
                  if (newValue !== null) {
                    setId(data.find((o) => o.name === newValue).id);
                    setDescr(data.find((o) => o.name === newValue).descr);
                  } else {
                    setId('');
                    setDescr('');
                  }
                }}
                renderInput={(params) => <TextField label="ชื่อ Template" {...params} />}
                sx={{
                  '& .MuiAutocomplete-inputRoot': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: id ? 'green' : 'red',
                    },
                  },
                  mt: 1,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              {mode === 'inst' ? (
                <TextField fullWidth disabled label="คำอธิบาย" value={descr} sx={{ mt: 1 }} />
              ) : (
                <TextField multiline rows={5} label="คำอธิบาย" fullWidth disabled value={descr} sx={{ mt: 1 }} />
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth disabled label="หมายเหตุ" value={remark} sx={{ mt: 1 }} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleSubmit();
            }}
            className="btn btn-success"
            disabled={id === '' || id === null}
          >
            ใช้ Template
          </Button>
          <Button onClick={onCloseDialg} color="error">
            ยกเลิก
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default DISSelTemplate;
