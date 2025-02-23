# Data Foundry Technical Challenge
This repository is for the Data Foundry technical challenge.

[Live demo here](https://master.d39jj8npl6v464.amplifyapp.com).
You can login to the live demo with email datafoundryuser@gmail.com, password Df_1234! 

## Get Started
Get started by first installing required dependencies using the command below.
```bash
npm install
```
You can run the app locally using the following command
```bash
npm run dev
```
This application was developed using AWS Amplify and to provision the required resources in sandbox mode against an AWS account run the following command
```bash
npx ampx sandbox
```

## Implementation
This application was developed using React Typescript and on the backend uses a collection of AWS services such as Cognito for authentication, S3 for static file storage, DynamoDB for the database and AppSync GraphQL for the API.

I decided to use React as the frontend framework with the MUI component library as this is the Javascript UI framework I have the most experience with and it also has great documentation and a large ecosystem of developers using this UI kit.

When creating and storing Service Request records in the database I followed DynamoDB best practice by using a Partition key and Sort key for flexible, optimal querying against the database. I set the Partition key to be the userId and the Sort key to be the creationDate#caseNumber. This Primary key strucutre allows me to query for all the SR records against a single user over a particular date range (e.g give me all SR records for user id e4e8d4e8-0031-70e0-a6f4-0eebc06f0d58 between 2025-02-01 & 2025-02-28 and this will provide me with all SR records for that user for the month of February).

As the API is GraphQL which supports realtime subscribing to backend events, the frontend is listening to new Service Requests being created against the current authed user using the onCreate ServiceRequest subscriber and dynamically adding that newly created SR to the table of SRs below the Create Service Request form.

I have stored the application logo in S3 and displaying on the frontend after fetching from the S3 bucket

When developing the create Service Request form I am assuming a user wont be able to raise an SR for a previous date, only today or a future date. I am also defaulting the creation date to be the current date as in a real life scenario a user would very likely be raising an SR for an issue they are experiencing right now.