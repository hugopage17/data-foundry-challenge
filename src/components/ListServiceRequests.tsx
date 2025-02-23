import React from 'react';
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, styled, Chip, Typography, Divider, LinearProgress, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { useServiceRequests } from '../hooks/useServiceRequests';

const PrimaryTableCell = styled(TableCell)<{ bold?: boolean }>(({ theme, bold }) => ({
    color: theme.palette.text.primary,
    fontWeight: bold ? theme.typography.fontWeightBold : theme.typography.fontWeightRegular
}));

const SecondaryTableCell = styled(TableCell)(({ theme }) => ({
    color: theme.palette.text.secondary
}));

const ListServiceRequests: React.FC = () => {
    const { loading, serviceRequests } = useServiceRequests();

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
