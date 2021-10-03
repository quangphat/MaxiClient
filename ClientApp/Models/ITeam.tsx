export interface IUSPTeam {
	id: number,
	name: string,
	leaderName: string,
	leaderId: number,
	parentName: string,
	parentTeamId: number,
	createdAt: Date,
	createdBy: number,
	updatedAt: Date,
	updatedBy: number

}

export interface IUpdateTeamModel
{
	 id: number,
	 name: string,
	 parentId: number,
	 leaderId: number,

}

export interface IUSPEmployee {
	id: number,
	fullName: string,
	code: string,
	title: string,
	levelId: number,
	phone:string,
	email:string,
	levelName: string,
	teamId:number,
	teamName: string,
	leaderId: number,
	leaderName: string,
	createdAt: Date,
	createdBy: number,
	updatedAt: Date,
	updatedBy: number

}

export interface IEmployee {
	id: number,
	code: string,
	fullName: string,
	title: string,
	birthday?: Date,
	levelId: number,
	phone: string,
	teamId: number,

}
export interface IUpdateEmployeeModel
{
	 id: number,
	 fullName: string,
	 phone: string,
	 email: string,
	 title: string,
	 teamId: number,

}