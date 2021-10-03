import { invalid } from 'moment';
import *as Utils from './Utils'

interface IValidateObjectField{
name:string,
type:string
}

const validateObjectFields =[
    {name:"email",type:"string"},
    {name:"phone",type:"string"},
    {name:"displayName",type:"string"},
    {name:"password",type:"string"},
    {name:"confirmPassword",type:"string"},
    {name:"isAcceptPolicy",type:"bool"},
] as IValidateObjectField[]

export const isValidPassword = (input: string): boolean => {
    if(Utils.isNullOrWhiteSpace(input))
        return false;

    var rePassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!$%@#£€*?&.]{8,}$/;
    if (rePassword.test(input))
        return true;
    return false;
}

export const isValidPhoneNumber = (phone: string): boolean => {
    if (Utils.isNullOrWhiteSpace(phone)) 
        return false
    let patternPhone = /^\d{8,15}$/;
    if (patternPhone.test(phone))
        return true;
    return false;
}

export const IsValidEmail = (email: string): boolean => {
    var reEmail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return reEmail.test(email);
}


