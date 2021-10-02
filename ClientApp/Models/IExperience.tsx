import { ILocation } from './ILocation'
import { IJobFunction } from './IJobFunction'
export interface IExperience {
    id: string,
    title: string,
    companyName: string,
    location: ILocation,
    isPresent: boolean,
    jobFunction: IJobFunction,
    workAs: string,
    description: string,
    personId: string,
    createdTime: Date,
    modifiedTime: Date,
    startMonth: number,
    startYear: number,
    endMonth?: number,
    endYear?: number,
}
//<AppendNewHere>
