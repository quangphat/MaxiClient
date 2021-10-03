import * as H from 'history';
import {  IOptionSimple, ISelectItem, IUSPTeam, IUSPEmployee } from '../Models'
import { createBrowserHistory } from 'history';
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
