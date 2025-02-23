import React from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Table, TableContainer, TableHead, TableRow, Box, TableCell, TableBody, styled, Chip, Typography, Divider, LinearProgress, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import moment from 'moment-timezone';
import type { Schema } from '../../amplify/data/resource'
import { generateClient } from 'aws-amplify/data';

const PrimaryTableCell = styled(TableCell)<{ bold?: boolean }>(({ theme, bold }) => ({
    color: theme.palette.text.primary,
    fontWeight: bold ? theme.typography.fontWeightBold : theme.typography.fontWeightRegular
}));

const SecondaryTableCell = styled(TableCell)(({ theme }) => ({
    color: theme.palette.text.secondary
}));

interface IServiceRequest {
    serviceRequestName: string;
    serviceRequestDescription: string;
    creationDate: string;
    severity: string;
    resolutionDate: string;
    reporterName: string;
    contactInformation: string;
    location: string;
    userId: string;
    caseNumber: string;
    sortKey: string;
}


const ListServiceRequests: React.FC = () => {
    const [serviceRequests, setServiceRequests] = React.useState<IServiceRequest[]>([]);
    const [loading, isLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | undefined>(undefined);

    const apiClient = generateClient<Schema>();

    const { user } = useAuthenticator((context) => [context.user]);


    React.useEffect(() => {
        if (user) {
            apiClient.models.ServiceRequest.list({
                userId: user?.userId,
                sortKey: {
                    between: [moment().subtract(1, 'month').format('YYYY-MM-DD'), moment().add(1, 'month').format('YYYY-MM-DD')]
                },
                sortDirection: 'DESC'
            }).then((res) => {
                setServiceRequests(res.data);
                isLoading(false)
            });

            const subscriber = apiClient.models.ServiceRequest.onCreate({
                filter: {
                    userId: {
                        eq: user?.userId
                    }
                }
            }).subscribe({
                next: (data) => setServiceRequests((state) => [data, ...state]),
                error: (error) => setError(error)
            })
            return () => subscriber.unsubscribe();
        }
    }, [user]);

    const severityColor = (severity: string) => {
        switch (severity) {
            case 'High':
                return 'error';
            case 'Medium':
                return 'warning';
            default:
                return 'default'
        }
    }

    const descriptionPreview = (desc: string) => {
        if (desc.length >= 72) {
            return `${desc.slice(0, 42)}....................`
        }
        return desc
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
                <Typography variant='subtitle1'>There was an Error fetching Service Requests</Typography>
            </Box>
        )
    }

    return (
        <TableContainer>
            <Typography variant='h6' sx={{ margin: 1 }}>My Service Requests</Typography>
            <Divider />
            {loading && <LinearProgress />}
            <Table size="small" sx={{ minWidth: 950 }} aria-label="service-requests-table">
                <TableHead>
                    <TableRow>
                        <TableCell>Case Number</TableCell>
                        <TableCell>Severity</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Created At</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {serviceRequests.map((sr) => (
                        <TableRow
                            hover
                            key={sr.caseNumber}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
                        >
                            <PrimaryTableCell bold={true} component="th" scope="row">
                                {sr.caseNumber}
                            </PrimaryTableCell>
                            <SecondaryTableCell component="th" scope="row">
                                <Chip size='small' label={sr.severity} color={severityColor(sr.severity)} />
                            </SecondaryTableCell>
                            <PrimaryTableCell component="th" scope="row">
                                {sr.serviceRequestName}
                            </PrimaryTableCell>
                            <SecondaryTableCell component="th" scope="row">
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '4px' }}>
                                    {descriptionPreview(sr.serviceRequestDescription)}
                                    <Tooltip title={sr.serviceRequestDescription}>
                                        <InfoIcon sx={{ width: 18, height: 18 }} />
                                    </Tooltip>
                                </span>
                            </SecondaryTableCell>
                            <SecondaryTableCell>{sr.creationDate}</SecondaryTableCell>
                        </TableRow >
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
};

export default ListServiceRequests;
