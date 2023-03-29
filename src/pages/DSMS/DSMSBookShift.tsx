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
    Grid,
    Box,
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
                    จองเวร
                </Typography>

                <Card>
                    <Paper sx={{ p:1 }}>
                    <Grid container columnSpacing={{ sm: 5, lg: 12 }}>
                            <Grid item xs={6} sm={9} md={9} lg={10} />
                            <Grid item xs={6} sm={3} md={3} lg={2}>
                                <Box sx={{}}>
                                    <Typography><span style={{
                                        height: 20,
                                        width: 20,
                                        backgroundColor: "#50b500",
                                        borderRadius: 50,
                                        display: 'inline-block',
                                        marginRight: 5,
                                    }} /> เวร 08.00-16.00</Typography>
                                    <Typography><span style={{
                                        height: 20,
                                        width: 20,
                                        backgroundColor: "#0073b5",
                                        borderRadius: 50,
                                        display: 'inline-block',
                                        marginRight: 5,
                                    }} /> เวร 16.00-24.00</Typography>
                                    <Typography><span style={{
                                        height: 20,
                                        width: 20,
                                        backgroundColor: "#7d23cc",
                                        borderRadius: 50,
                                        display: 'inline-block',
                                        marginRight: 5,
                                    }} /> เวร 00.00-08.00</Typography>
                                    <Typography><span style={{
                                        height: 20,
                                        width: 20,
                                        backgroundColor: "#ed6205",
                                        borderRadius: 50,
                                        display: 'inline-block',
                                        marginRight: 5,
                                    }} /> เวร 17.00-08.00</Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={12}>
                                <Scheduler
                                    view="month"
                                    editable={false}
                                    deletable={false}
                                    month={{
                                        weekDays: [0, 1, 2, 3, 4, 5, 6],
                                        weekStartOn: 1,
                                        startHour: 1,
                                        endHour: 23,
                                        // cellRenderer?: (props: CellProps) => JSX.Element,
                                        navigation: true,
                                        disableGoToDay: false
                                    }}
                                    week={null}
                                    day={null}
                                    // events={events}
                                    height={800}
                                    hourFormat={"24"}
                                    customEditor={(scheduler) => <CustomEditor scheduler={scheduler} />}
                                    // locale={th}
                                    translations={{
                                        navigation: {
                                            month: "Month",
                                            week: "Week",
                                            day: "Day",
                                            today: "กลับไปเดือนปัจจุบัน"
                                        },
                                        form: {
                                            addTitle: "Add Event",
                                            editTitle: "Edit Event",
                                            confirm: "Confirm",
                                            delete: "Delete",
                                            cancel: "Cancel"
                                        },
                                        event: {
                                            title: "Title",
                                            start: "Start",
                                            end: "End",
                                            allDay: "All Day"
                                        },
                                        moreEvents: "More...",
                                        loading: "Loading..."
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Card>

            </Container>
        </>
    );
}