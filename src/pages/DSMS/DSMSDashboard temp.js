import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
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

const headSname = `${localStorage.getItem('sname')} Center`;

const CustomEditor = (scheduler) => {
    const event = scheduler.edited;

    // Make your own form/state
    const [state, setState] = useState({
        title: event?.title || "",
        description: event?.description || ""
    });
    const [error, setError] = useState("");

    const handleChange = (value, name) => {
        setState((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // const handleSubmit = async () => {
    //     // Your own validation
    //     if (state.title.length < 3) {
    //         return setError("Min 3 letters");
    //     }

    //     try {
    //         scheduler.loading(true);

    //         /** Simulate remote data saving */
    //         const addedUpdatedEvent = (await new Promise((res) => {
    //             /**
    //              * Make sure the event have 4 mandatory fields
    //              * event_id: string|number
    //              * title: string
    //              * start: Date|string
    //              * end: Date|string
    //              */
    //             setTimeout(() => {
    //                 res({
    //                     event_id: event?.event_id || Math.random(),
    //                     title: state.title,
    //                     start: scheduler.state.start.value,
    //                     end: scheduler.state.end.value,
    //                     description: state.description
    //                 });
    //             }, 3000);
    //         }));

    //         scheduler.onConfirm(addedUpdatedEvent, event ? "edit" : "create");
    //         scheduler.close();
    //     } finally {
    //         scheduler.loading(false);
    //     }
    // };

    const handleSubmit = async () => {
        // Your own validation
        alert(scheduler.state.start.value);
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
                    <Paper sx={{ p:1}}>
                        {/* <Scheduler
                            view="month"
                            week={null}
                            day={null}
                            events={[
                                {
                                    event_id: 1,
                                    title: "Event 1",
                                    start: new Date("2023/3/2 09:30"),
                                    end: new Date("2023/3/2 10:30"),
                                },
                                {
                                    event_id: 2,
                                    title: "Event 2",
                                    start: new Date("2023/3/4 10:00"),
                                    end: new Date("2023/3/4 11:00"),
                                },
                            ]}
                        /> */}
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
                        />
                    </Paper>
                </Card>
            </Container>
        </>
    );
}