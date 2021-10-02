
import { IAuthor } from '../Models/IAuthor'
import { ILocation, ILocationSimple } from '../Models/ILocation'
export interface IJob {
    id: string,
    title: string,
    preview: string,
    content: string,
    status: number,
    //company: Company,
    locations: ILocationSimple[],
    minSalary?: number,
    maxSalary?: number,
    salaryType: number,
    isNegotiationSalary: boolean,
    employmentType: string,
    experienceLevel: string,
    tags: string[],
    statusReason: string,
    isHeadHunt: boolean,
    friendlyUrl: string

}
export interface IJobCreateModel {
    title: string,
    preview: string,
    content: string,
    status: number,
    locations: ILocation[],
    minSalary?: number,
    maxSalary?: number,
    salaryType: number,
    isNegotiationSalary: boolean,
    employmentType: string,
    experienceLevel: string,
    tags: string[],
    isHeadHunt: boolean,

}

