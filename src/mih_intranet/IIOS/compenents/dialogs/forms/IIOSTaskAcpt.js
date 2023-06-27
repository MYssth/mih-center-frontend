/* eslint-disable react/prop-types */
import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Autocomplete,
    TextField,
} from '@mui/material';
import {
    SubmtERR,
    SubmtINC,
} from '../../../../components/dialogs/response';

function IIOSTaskAcpt({ openDialg, onCloseDialg, data, operList, estList, recvId }) {

    const [operatorId, setOperatorId] = useState('');
    const [operatorName, setOperatorName] = useState('');

    const [estimationId, setEstimationId] = useState('');
    const [estimationName, setEstimationName] = useState('');

    const [submitINC, setSubmitINC] = useState(false);
    const [submitERR, setSubmitERR] = useState(false);

    const isSkip = (value) => value !== '';

    const handleAcceptTask = () => {

        const jsonData = {
            task_id: data.task_id,
            level_id: data.level_id,
            receiver_id: recvId,
            receiver_name: `${operList.find(o => o.personnel_id === recvId).personnel_firstname} ${operList.find(o => o.personnel_id === recvId).personnel_lastname}`,
            operator_id: operatorId,
            operator_name: operatorName,
            estimation_id: estimationId,
        };

        // console.log(jsonData);

        fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dmisPort}/api/dmis/accepttask`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData)
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.status === 'ok') {
                    onCloseDialg();
                }
                else {
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
            <SubmtINC openDialg={submitINC} onCloseDialg={() => setSubmitINC(false)} />
            <SubmtERR openDialg={submitERR} onCloseDialg={() => setSubmitERR(false)} />
            <Dialog fullWidth maxWidth="md" open={openDialg} onClose={onCloseDialg}>
                <DialogTitle>รับเรื่อง</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        กรุณาระบุผู้รับผิดชอบงาน
                    </DialogContentText>
                    <Autocomplete
                        value={operatorName}
                        onChange={(event, newValue) => {
                            setOperatorName(newValue);
                            if (newValue !== null && newValue !== "") {
                                setOperatorId(operList?.find(o => `${o.personnel_firstname} ${o.personnel_lastname}` === newValue).personnel_id);
                            }
                            else {
                                setOperatorId("");
                            }
                        }}
                        id="controllable-states-operator-id"
                        options={
                            data?.level_id === "DMIS_IT" ?
                                Object.values(operList).map((option) => option.level_id === "DMIS_IT" || option.level_id === "DMIS_HIT" ? `${option.personnel_firstname} ${option.personnel_lastname}` : "").filter(isSkip)
                                : data?.level_id === "DMIS_MT" ? Object.values(operList).map((option) => option.level_id === "DMIS_MT" || option.level_id === "DMIS_ENV" ? `${option.personnel_firstname} ${option.personnel_lastname}` : "").filter(isSkip)
                                    : Object.values(operList).map((option) => option.level_id === "DMIS_MER" || option.level_id === "DMIS_ENV" ? `${option.personnel_firstname} ${option.personnel_lastname}` : "").filter(isSkip)
                        }
                        fullWidth
                        required
                        renderInput={(params) => <TextField {...params} label="" />}
                    />
                    <DialogContentText>
                        กรุณาระบุการประมาณวันดำเนินงาน
                    </DialogContentText>
                    <Autocomplete
                        value={estimationName}
                        onChange={(event, newValue) => {
                            setEstimationName(newValue);
                            if (newValue !== null && newValue !== "") {
                                setEstimationId(estList?.find(o => o.estimation_name === newValue).estimation_id);
                            }
                            else {
                                setEstimationId("");
                            }
                        }}
                        id="controllable-states-estimation-id"
                        options={Object.values(estList).map((option) => option.estimation_name)}
                        fullWidth
                        required
                        renderInput={(params) => <TextField {...params} label="" />}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onCloseDialg}>ยกเลิก</Button>
                    <Button variant="contained" onClick={handleAcceptTask}>รับเรื่อง</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default IIOSTaskAcpt