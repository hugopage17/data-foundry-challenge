export interface IServiceRequest {
    serviceRequestName: string;
    serviceRequestDescription: string;
    creationDate: string;
    severity: string;
    resolutionDate: string;
    reporterName: string;
    contactInformation: string;
    location: string;
    caseNumber: string;
}

export type IServiceRequestParams = Omit<IServiceRequest, 'caseNumber'>