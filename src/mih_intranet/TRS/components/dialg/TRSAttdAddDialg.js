import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Autocomplete,
  TextField,
  Typography,
} from '@mui/material';
import { SubmtERR } from '../../../components/dialogs/response';

function TRSAttdAddDialg({ openDialg, onCloseDialg, topic, psnList, attdByTopicList, rToken }) {
  const [submitERR, setSubmitERR] = useState(false);

  const [psnId, setPsnId] = useState('');
  const [psnName, setPsnName] = useState('');
  const [dupData, setDupData] = useState('');

  useEffect(() => {
    setDupData(attdByTopicList.find((data) => data.psn_id === psnId));
  }, [psnId]);

  const handleTopicAttd = () => {
    if (dupData !== undefined) {
      fetch(
        `${process.env.REACT_APP_host}${process.env.REACT_APP_trsPort}/topicattddel/${dupData.topic_id}/${dupData.sub_id}/${dupData.psn_id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${rToken}`,
          },
        }
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.status !== 'ok') {
            setSubmitERR(true);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          setSubmitERR(true);
        });
    }

    const jsonData = {
      topic_id: topic?.topic_id,
      sub_id: topic?.sub_id,
      psn_id: psnId,
    };

    // console.log(jsonData);

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_trsPort}/topicattd`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
      body: JSON.stringify(jsonData),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === 'ok') {
          setPsnId('');
          setPsnName('');
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
      <SubmtERR openDialg={submitERR} onCloseDialg={() => setSubmitERR(false)} />
      <Dialog
        fullWidth
        maxWidth="md"
        open={openDialg}
        onClose={() => {
          onCloseDialg();
        }}
      >
        <DialogTitle>เพิ่มผู้ร่วมกิจกรรม</DialogTitle>
        <DialogContent>
          <DialogContentText>
            กรุณาเลือกบุคคลที่ต้องการเพิ่มในกิจกรรม {topic?.topic_name} {topic?.name}
            <Autocomplete
              options={Object.values(psnList).map(
                (option) => `${option.psn_id} ${option.pname}${option.fname} ${option.lname}`
              )}
              fullWidth
              value={psnName}
              onChange={(event, newValue) => {
                setPsnName(newValue);
                if (newValue !== null) {
                  setPsnId(psnList.find((o) => `${o.psn_id} ${o.pname}${o.fname} ${o.lname}` === newValue).psn_id);
                } else {
                  setPsnId('');
                }
              }}
              renderInput={(params) => <TextField label="ชื่อ - นามสกุล" {...params} />}
              sx={{
                '& .MuiAutocomplete-inputRoot': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: psnId ? 'green' : 'red',
                  },
                },
                mt: 1,
              }}
            />
            {dupData === undefined ? (
              ''
            ) : (
              <Typography color={'error'} sx={{ mt: 1 }}>
                ชื่อนี้มีลงชื่อแล้วใน {dupData.name} ต้องการย้ายมาที่ {topic?.name} หรือไม่
              </Typography>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseDialg}>ยกเลิก</Button>
          <Button variant="contained" onClick={handleTopicAttd} color="success">
            ยืนยันการเพิ่ม
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default TRSAttdAddDialg;
