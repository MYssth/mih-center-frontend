import { Helmet } from 'react-helmet-async';
import * as React from 'react';
import {
    Container,
    Typography,
    Card,
    Paper,
    TextField,
    DialogActions,
    Button,
} from '@mui/material';
import { Scheduler } from "@aldabil/react-scheduler";
import type {
    ProcessedEvent,
    SchedulerHelpers
} from "@aldabil/react-scheduler/types";

const headSname = `${localStorage.getItem('sname')} Center`;

const CustomEditorProps = "";
const scheduler = "";

interface CustomEditorProps {
    scheduler: SchedulerHelpers;
}
const CustomEditor = ({ scheduler }: CustomEditorProps) => {
    const event = scheduler.edited;

    // Make your own form/state
    const [state, setState] = React.useState({
        title: event?.title || "",
        description: event?.description || ""
    });
    const [error, setError] = React.useState("");

    const handleChange = (value: string, name: string) => {
        setState((prev) => {
            return {
                ...prev,
                [name]: value
            };
        });
    };
    const handleSubmit = async () => {
        // Your own validation
        if (state.title.length < 3) {
            return setError("Min 3 letters");
        }

        try {
            scheduler.loading(true);

            /** Simulate remote data saving */
            const addedUpdatedEvent = (await new Promise((res) => {
                /**
                 * Make sure the event have 4 mandatory fields
                 * event_id: string|number
                 * title: string
                 * start: Date|string
                 * end: Date|string
                 */
                setTimeout(() => {
                    res({
                        event_id: event?.event_id || Math.random(),
                        title: state.title,
                        start: scheduler.state.start.value,
                        end: scheduler.state.end.value,
                        description: state.description
                    });
                }, 3000);
            })) as ProcessedEvent;

            scheduler.onConfirm(addedUpdatedEvent, event ? "edit" : "create");
            scheduler.close();
            return null;
        } finally {
            scheduler.loading(false);
        }
    };
    return (
        <div>
            <div style={{ padding: "1rem" }}>
                <p>Load your custom form/fields</p>
                <TextField
                    label="Title"
                    value={state.title}
                    onChange={(e) => handleChange(e.target.value, "title")}
                    error={!!error}
                    helperText={error}
                    fullWidth
                />
                <TextField
                    label="Description"
                    value={state.description}
                    onChange={(e) => handleChange(e.target.value, "description")}
                    fullWidth
                />
            </div>
            <DialogActions>
                <Button onClick={scheduler.close}>Cancel</Button>
                <Button onClick={handleSubmit}>Confirm</Button>
            </DialogActions>
        </div>
    );
};

export default function DSMSDashboard() {

    return (
        <>
            <Helmet>
                <title> ระบบจองเวรแพทย์ | {headSname} </title>
            </Helmet>

            <Container maxWidth="xl">
                <Typography variant="h4" sx={{ mb: 5 }}>
                    ระบบจองเวรแพทย์ - Doctor Shift Management Service(DSMS)
                </Typography>

                <Card>
                    <Paper sx={{ p: 1 }}>
                        <Scheduler
                            view="month"
                            week={null}
                            day={null}
                            customEditor={(scheduler) => <CustomEditor scheduler={scheduler} />}
                            viewerExtraComponent={(fields, event) => {
                                return (
                                    <div>
                                        <p>Useful to render custom fields...</p>
                                        <p>Description: {event.description || "Nothing..."}</p>
                                    </div>
                                );
                            }}
                            translations={{
                                navigation: {
                                    month: "เดือน",
                                    week: "สัปดาห์",
                                    day: "วัน",
                                    today: "ไปที่วันนี้"
                                },
                                form: {
                                    addTitle: "เพิ่มกิจกรรม",
                                    editTitle: "แก้ไขกิจกรรม",
                                    confirm: "ยืนยัน",
                                    delete: "ลบ",
                                    cancel: "ยกเลิก"
                                },
                                event: {
                                    title: "หัวข้อ",
                                    start: "เริ่ม",
                                    end: "จบ",
                                    allDay: "ทั้งวัน"
                                },
                                moreEvents: "อื่นๆ...",
                                loading: "กำลังโหลด..."
                            }}
                        />
                    </Paper>
                </Card>
            </Container>
        </>
    );
}