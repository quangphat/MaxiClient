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
const getMessageCodeByFieldName = (field: string, type:string="input", code:string=''): string => {
    if(Utils.isNullOrWhiteSpace(field))
        return `Please_input_${field}`

    if(!Utils.isNullOrWhiteSpace(code))
        return code

    if(type=="invalid")
    {
        return `Invalid_${field}`
    }

    return `Please_${type}_${field}`
    // if(type=="input")
    // {
    //     return `Please_input_${field}`
    // }
    // else if(type=="select")
    // {
    //     return `Please_input_${field}`
    // }
}

export const IsValidObject = (model: any): boolean => {

    if(Utils.isNullOrUndefined(model) || model =={})
        return false
        
    if(Object.keys(model).length === 0 && model.constructor === Object)
    {
        return false
    }
        
    let result = true;
    Object.keys(model).forEach(field=>{
        
        var needValidate = validateObjectFields.find(p=>p.name==field)
        if(needValidate!=null)
        {
            let value = model[field]
            if(field=="email")
            {
                if(Utils.isNullOrWhiteSpace(value))
                {
                    Utils.ShowError(getMessageCodeByFieldName(field))
                    return result = false;
                }
                    
                result = IsValidEmail(value)
                if(result==false)
                {
                    Utils.ShowError(getMessageCodeByFieldName(field,"invalid"))
                    return result;
                }
                
            }
            else if(field=="phone")
            {
                if(Utils.isNullOrWhiteSpace(value))
                {
                    Utils.ShowError(getMessageCodeByFieldName(field))
                    return result= false;
                }
                else
                {
                    result= isValidPhoneNumber(value)
                    if(result==false)
                    {
                       Utils.ShowError(getMessageCodeByFieldName(field,"invalid"))
                       return result;
                    }
                }
                     
            }
            else if(field=="password" || field=="confirmPassword")
            {
                if(Utils.isNullOrWhiteSpace(value))
                {
                    Utils.ShowError(getMessageCodeByFieldName(field))
                    return result = false;
                }
                if(!isValidPassword(value))
                {
                    Utils.ShowError(getMessageCodeByFieldName(field,"invalid"))
                    return result = false
                    
                }
                else
                {
                    if(model["password"] != model["confirmPassword"])
                    {
                        Utils.ShowError("password_not_match");
                        return result = false
                    }
                }

                
            }
            else
            {
                if(needValidate.type=="bool")
                {
                    if(value==false)
                    {
                        Utils.ShowError(`Please_accept_with ${field}`)
                        return result = false
                    }
                       
                }
                else if(needValidate.type=="string")
                {
                    if(Utils.isNullOrWhiteSpace(value))
                    {
                        Utils.ShowError(getMessageCodeByFieldName(field))
                        return result= false
                    }
                    
                }
                else{
                    if(Utils.isNullOrUndefined(value))
                    {
                        Utils.ShowError(getMessageCodeByFieldName(field,"invalid"))
                        return result= false
                    }
                }
            }
        }
    })

    return result;
}
