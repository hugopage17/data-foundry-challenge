import React from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/data';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import moment from 'moment-timezone';
import { FormControl, TextField, Button, MenuItem, InputLabel, Select, Box, SelectChangeEvent, styled, Typography, Card, ButtonGroup, useTheme, } from '@mui/material';
import type { Schema } from '../../amplify/data/resource'

interface IServiceRequestState {
    serviceRequestName: string;
    serviceRequestDescription: string;
    creationDate: string;
    severity: string;
    resolutionDate: string;
    reporterName: string;
    contactInformation: string;
    location: string;
}

type Action =
    | { type: "SET_FIELD"; field: keyof IServiceRequestState; value: string }
    | { type: "RESET" };

const serviceRequestReducer = (state: IServiceRequestState, action: Action): IServiceRequestState => {
    switch (action.type) {
        case "SET_FIELD":
            return { ...state, [action.field]: action.value };
        case "RESET":
            return initialState;
        default:
            return state;
    }
};

const initialState: IServiceRequestState = {
    serviceRequestName: "",
    serviceRequestDescription: "",
    creationDate: moment().format("YYYY-MM-DD"),
    severity: "",
    resolutionDate: "",
    reporterName: "",
    contactInformation: "",
    location: "",
};

const FormPanel = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing(1)
}));


const CreateServiceRequest: React.FC = () => {
    const [state, dispatch] = React.useReducer(serviceRequestReducer, initialState);
    const [isFormValid, setIsFormValid] = React.useState(false);
    const [submitting, isSubmitted] = React.useState(false);

    const apiClient = generateClient<Schema>();

    const { user } = useAuthenticator((context) => [context.user]);

    React.useEffect(() => {
        if (state.creationDate && state.severity) {
            const creationDate = new Date(state.creationDate);
            let resolutionDays = 0;

            if (state.severity === "Low") {
                resolutionDays = 5;
            } else if (state.severity === "Medium") {
                resolutionDays = 3;
            } else if (state.severity === "High") {
                resolutionDays = 1;
            }

            const resolutionDate = new Date(creationDate);
            resolutionDate.setDate(creationDate.getDate() + resolutionDays);

            dispatch({
                type: "SET_FIELD",
                field: "resolutionDate",
                value: resolutionDate.toISOString().split("T")[0], // Format to YYYY-MM-DD
            });
        }
    }, [state.creationDate, state.severity]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
        const target = e.target;
        dispatch({ type: "SET_FIELD", field: target.name as keyof IServiceRequestState, value: target.value });
    };

    React.useEffect(() => {
        const isValidEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(state.contactInformation);

        const creationDate = new Date(state.creationDate);
        creationDate.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const isCreationDateValid = creationDate >= today;
        const isFormValid = Object.values(state).every(value => value !== "") && isValidEmail && isCreationDateValid;

        setIsFormValid(isFormValid);
    }, [state]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        isSubmitted(true);
        const caseNumber = `SR${Math.floor(10000000 + Math.random() * 90000000)}`
        await apiClient.models.ServiceRequest.create({
            ...state,
            sortKey: `${state.creationDate}#${caseNumber}`,
            userId: user.userId,
            caseNumber
        });
        isSubmitted(false);
        dispatch({ type: "RESET" });
    };

    const theme = useTheme()

    return (
        <Card sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing(2),
            width: 960,
            margin: 'auto',
            marginTop: theme.spacing(12),
            padding: theme.spacing(2),
        }} elevation={4} component="form" onSubmit={handleSubmit}>
            <Typography variant='h5' sx={{ textAlign: 'center' }}>Create a new Service Request</Typography>
            <FormPanel>
                <TextField
                    label="Service Request Name"
                    name="serviceRequestName"
                    value={state.serviceRequestName}
                    onChange={handleChange}
                    fullWidth
                    required
                    size="small"
                />
                <FormControl size="small" required fullWidth>
                    <InputLabel id="severity-select-label">Severity</InputLabel>
                    <Select
                        name="severity"
                        labelId="severity-select-label"
                        id="severity-select"
                        value={state.severity}
                        label="Severity"
                        onChange={handleChange}
                    >
                        <MenuItem value="Low">Low</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="High">High</MenuItem>
                    </Select>
                </FormControl>
            </FormPanel>

            <FormPanel>
                <TextField
                    label="Description"
                    name="serviceRequestDescription"
                    value={state.serviceRequestDescription}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={3}
                    required
                    size="small"
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                    <TextField
                        label="Creation Date"
                        name="creationDate"
                        type="date"
                        value={state.creationDate}
                        onChange={handleChange}
                        fullWidth
                        size="small"
                        required
                        slotProps={{ inputLabel: { shrink: true } }}
                        error={new Date(state.creationDate).getTime() < new Date().setHours(0, 0, 0, 0)}
                        helperText={
                            new Date(state.creationDate).getTime() < new Date().setHours(0, 0, 0, 0)
                                ? "Creation date cannot be in the past"
                                : ""
                        }
                    />
                    <TextField
                        label="Resolution Date"
                        name="resolutionDate"
                        type="date"
                        value={state.resolutionDate}
                        onChange={handleChange}
                        fullWidth
                        disabled
                        size="small"
                        slotProps={{ inputLabel: { shrink: true } }}
                    />
                </Box>
            </FormPanel>
            <FormPanel>

            </FormPanel>
            <TextField
                label="Reporter Name"
                name="reporterName"
                value={state.reporterName}
                onChange={handleChange}
                fullWidth
                required
                size="small"
            />

            <TextField
                label="Contact Information"
                name="contactInformation"
                value={state.contactInformation}
                onChange={handleChange}
                fullWidth
                type="email"
                required
                size="small"
                error={!!(state.contactInformation && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(state.contactInformation))}
                helperText={state.contactInformation && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(state.contactInformation) ? "Please enter a valid email address" : ""}
            />

            <TextField
                label="Location"
                name="location"
                value={state.location}
                onChange={handleChange}
                fullWidth
                required
                size="small"
            />
            <ButtonGroup variant="contained" sx={{ width: '100%' }}>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!isFormValid}
                    loading={submitting}
                    fullWidth
                    sx={{ textTransform: 'none', fontWeight: 'bold' }}
                >
                    Submit
                </Button>
                <Button
                    type="button"
                    variant="outlined"
                    onClick={() => dispatch({ type: "RESET" })}
                >
                    <RestartAltIcon />
                </Button>
            </ButtonGroup>
        </Card>
    );
};

export default CreateServiceRequest;
