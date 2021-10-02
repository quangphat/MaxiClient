export interface IApplyJobModel {
	fullName: string,
	email: string,
	phone: string,
	jobId: string,
	minSalary?: number,
	file: Blob,

}