import { useAuthenticator } from '@aws-amplify/ui-react';
import { useEffect, useState } from 'react';
import moment from 'moment-timezone';
import type { Schema } from '../../amplify/data/resource'
import { generateClient } from 'aws-amplify/data';

interface IServiceRequest {
    serviceRequestName: string;
    serviceRequestDescription: string;
    creationDate:string;
    severity:string;
    resolutionDate: string;
    reporterName:string;
    contactInformation: string;
    location: string;
    userId:string;
    caseNumber:string;
    sortKey:string;
}

export const useServiceRequests = () => {
    const [serviceRequests, setServiceRequests] = useState<IServiceRequest[]>([]);
    const [loading, isLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | undefined>(undefined);

    const apiClient = generateClient<Schema>();

    const { user } = useAuthenticator((context) => [context.user]);
    

    useEffect(() => {
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

    return { serviceRequests, loading, error }
}