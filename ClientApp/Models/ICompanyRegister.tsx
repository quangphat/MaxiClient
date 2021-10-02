import {IOptionSimple} from './IOptionSimple'
import {ILocationSimple} from './ILocationSimple'

export interface ICompanyRegister
{
	 phone: string,
	 skills: IOptionSimple[],
	 industry: IOptionSimple,
	 headquarter: ILocationSimple,
     displayName: string,
	 email: string,
	 password: string,
	 confirmPassword: string,
	 isAcceptPolicy: boolean,

}