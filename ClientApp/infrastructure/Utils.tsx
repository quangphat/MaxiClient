import * as H from 'history';
import {  IOptionSimple, ISelectItem,IAccount, IUSPTeam, IUSPEmployee } from '../Models'
import { createBrowserHistory } from 'history';
import { IAuthor } from '../Models/IAuthor';
import { store } from 'react-notifications-component';
import { getMessageByCode} from './messagesCode'
export const history = createBrowserHistory();


export const convertSelectItemsToOptionSimple = (data: ISelectItem[],
    init: boolean = false,
    initLabel: string = 'Vui lòng chọn'): IOptionSimple[] => {

    let results = [] as IOptionSimple[]
    if (isArrNullOrHaveNoItem(data)) {
        if (init) {
            results.push({ code: getNewGuid(), display: initLabel })
            return results
        }
        return results
    }

    data.map(p => results.push({ code: p.value, display: p.label }))
    return results
}

export const convertOptionSimplesToSelectItems = (data: any[],
    init: boolean = false,
    initLabel: string = 'Vui lòng chọn'): any[] => {

    let results = data
    if (isArrNullOrHaveNoItem(data)) {
        if (init) {
            results.push({ value: getNewGuid(), label: initLabel })
            return results
        }
        return results
    }
    return results
}

export const convertUspTeamsToSelectItems = (data: IUSPTeam[],
    init: boolean = false,
    initLabel: string = 'Vui lòng chọn'): any[] => {

    let results = [] as ISelectItem[]
    if (isArrNullOrHaveNoItem(data)) {
        if (init) {
            results.push({ value: getNewGuid(), label: initLabel })
            return results
        }
        return results
    }
    else
    {
        data.forEach(p=>{
            results.push({value:p.id.toString(), label:p.name})
        })
    }
    return results
}
export const convertUspEmployeesToSelectItems = (data: IUSPEmployee[],
    init: boolean = false,
    initLabel: string = 'Vui lòng chọn'): any[] => {

    let results = [] as ISelectItem[]
    if (isArrNullOrHaveNoItem(data)) {
        if (init) {
            results.push({ value: getNewGuid(), label: initLabel })
            return results
        }
        return results
    }
    else
    {
        data.forEach(p=>{
            results.push({value:p.id.toString(), label:p.fullName})
        })
    }
    return results
}

export const convertOptionSimpleToSelectItem=(data: IOptionSimple):ISelectItem=> {

   if (isNullOrUndefined(data)) {
       return null
   }

   return {value:data.code, label:data.display};
}


let notificationObj = {
    title: '',
    message: '',
    type: 'success',
    insert: "top",
    container: "top-right",
    animationIn: ["animated", "fadeIn"],
    animationOut: ["animated", "fadeOut"],
    showIcon: true,
    dismiss: { duration: 4000,pauseOnHover: true },
    dismissable: { click: true }
}

export const ShowSuccess = (code: string) => {
    notificationObj.type = "success"
    notificationObj.message = getMessageByCode(code)
    store.addNotification(notificationObj);
}

export const ShowError = (code: string) => {
    notificationObj.type = "danger"
    notificationObj.message = getMessageByCode(code)
    store.addNotification(notificationObj);
}

export const getClass = (classNames: string, additionalClass: string = ''): string => {
    if (isNullOrWhiteSpace(additionalClass))
        return classNames

    return `${classNames} ${additionalClass}`
}

export const objectToFormData = (model: any, blob? :any, fileName?:string): any => {
    var form_data = new FormData();

    for (var key in model) {
        
        form_data.append(key, model[key]);
    }
    if (blob != null) {
        form_data.append('file', blob, blob.name);
    }

    return form_data
}

export const getNewGuid = (): string => {
    const s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
}
export const isNullOrWhiteSpace = (str: string): boolean => {
    if (str == null || str === '' || str == undefined || str.trim() == '')
        return true
    return false;
}
export const isNullOrUndefined = (obj: any): boolean => {
    if (obj == null || obj === '' || obj == undefined)
        return true
    return false;
}
export const isArrNullOrHaveNoItem = (arr: any[]): boolean => {
    if (arr == null || arr.length == 0 || arr == undefined)
        return true
    return false;
}
export const getParamSingle = (search: string, param: string): any => {
    let queries = new URLSearchParams(search);
    if (queries.get(param)) {
        return queries.get(param)
    }
    return null
}
export const joinObject = (obj: Object) => {
    let path = '', arr_keyParams = Object.keys(obj)
    arr_keyParams.map(key => {
        if ((obj[key] || obj[key] === 0) && obj[key] != null) {
            path += '&' + key + '=' + obj[key]
        }
    })
    path = path.substring(1)
    return path
}
export const buildSearchQuery = (locationPathname: string, paging: Object): string => {
    return locationPathname + '?' + joinObject(paging)
}

const nonUnicodeChars = new Array("a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a",
    "d",
    "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e",
    "i", "i", "i", "i", "i",
    "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o",
    "u", "u", "u", "u", "u", "u", "u", "u", "u", "u", "u",
    "y", "y", "y", "y", "y", "-", "-", "-",
    "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A",
    "D",
    "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E",
    "I", "I", "I", "I", "I",
    "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O",
    "U", "U", "U", "U", "U", "U", "U", "U", "U", "U", "U",
    "Y", "Y", "Y", "Y", "Y",
);
const unicodeChars = new Array("á", "à", "ả", "ã", "ạ", "â", "ấ", "ầ", "ẩ", "ẫ", "ậ", "ă", "ắ", "ằ", "ẳ", "ẵ", "ặ",
    "đ",
    "é", "è", "ẻ", "ẽ", "ẹ", "ê", "ế", "ề", "ể", "ễ", "ệ",
    "í", "ì", "ỉ", "ĩ", "ị",
    "ó", "ò", "ỏ", "õ", "ọ", "ô", "ố", "ồ", "ổ", "ỗ", "ộ", "ơ", "ớ", "ờ", "ở", "ỡ", "ợ",
    "ú", "ù", "ủ", "ũ", "ụ", "ư", "ứ", "ừ", "ử", "ữ", "ự",
    "ý", "ỳ", "ỷ", "ỹ", "ỵ", " ", "<", ">",
    "Á", "À", "Ả", "Ã", "Ạ", "Â", "Ấ", "Ầ", "Ẩ", "Ẫ", "Ậ", "Ă", "Ắ", "Ằ", "Ẳ", "Ẵ", "Ặ",
    "Đ",
    "É", "È", "Ẻ", "Ẽ", "Ẹ", "Ê", "Ế", "Ề", "Ể", "Ễ", "Ệ",
    "Í", "Ì", "Ỉ", "Ĩ", "Ị",
    "Ó", "Ò", "Ỏ", "Õ", "Ọ", "Ô", "Ố", "Ồ", "Ổ", "Ỗ", "Ộ", "Ơ", "Ớ", "Ờ", "Ở", "Ỡ", "Ợ",
    "Ú", "Ù", "Ủ", "Ũ", "Ụ", "Ư", "Ứ", "Ừ", "Ử", "Ữ", "Ự",
    "Ý", "Ỳ", "Ỷ", "Ỹ", "Ỵ",
);
export function NonUnicode(value: string, toLowerCase: boolean = true) {
    if (value != null && value.length > 0) {
        value = toLowerCase ? value.trim().toLowerCase() : value.trim();
        var outString = value;
        var stringLength = 0;
        var countSpace = 0;

        while (stringLength < value.length) {
            if (value[stringLength] == " ")
                countSpace++;
            else
                countSpace = 0;

            if (countSpace > 1)
                outString = outString.replace(" ", "");
            else {
                var idx = unicodeChars.indexOf(value[stringLength]);
                if (idx != -1) {
                    outString = outString.replace(unicodeChars[idx], nonUnicodeChars[idx]);
                }
            }
            stringLength++;
        }

        return outString;
    }

    return value;
}
export const GetAccount = (): IAccount => {
    if (isLogin() == false) return null
    let account = document['account'] as IAccount
    return account;
}
export const isLogin = (): boolean => {
    let account = document['account'] as IAccount
    if (isNullOrUndefined(account)) return false;
    if (isNullOrWhiteSpace(account.personId)
        || isNullOrUndefined(account.projectId)
        || isNullOrWhiteSpace(account.email))
        return false;
    return true;
}

export const getAuthor = (): IAuthor => {
    if (isLogin() == false) return null
    let account = document['account'] as IAccount
    let author = {
        firstName: account.firstname,
        lastName: account.lastname,
        avatar: account.avatar,
        email: account.email,
        projectId: account.projectId,
        displayName: account.displayName,
        profileName: account.profileName,
        id: account.personId
    } as IAuthor
    return author;
}

export const JoinFullName = (lastName: string, firstName: string, isDisplay: boolean = true): string => {
    let fullName = '';
    if (!isNullOrWhiteSpace(lastName) || !isNullOrWhiteSpace(firstName)) {
        if (!isNullOrWhiteSpace(lastName)) {
            fullName = lastName;
        }
        if (!isNullOrWhiteSpace(firstName)) {
            fullName += ' ' + firstName;
        }
    }
    else {
        if (isDisplay == true)
            fullName = '---';
        else
            fullName = '';
    }
    return fullName.trim();
}
export const getListYear = (min: number = 1959) => {
    let thisYear = new Date().getFullYear()

    let years = []
    for (let y = thisYear; y > min; y--) {
        years.push({ value: y.toString(), display: y.toString() })
    }
    return years;
}
export const ListMonth = [
    { value: '1', display: 'Tháng 1' },
    { value: '2', display: 'Tháng 2' },
    { value: '3', display: 'Tháng 3' },
    { value: '4', display: 'Tháng 4' },
    { value: '5', display: 'Tháng 5' },
    { value: '6', display: 'Tháng 6' },
    { value: '7', display: 'Tháng 7' },
    { value: '8', display: 'Tháng 8' },
    { value: '9', display: 'Tháng 9' },
    { value: '10', display: 'Tháng 10' },
    { value: '11', display: 'Tháng 11' },
    { value: '12', display: 'Tháng 12' }
]