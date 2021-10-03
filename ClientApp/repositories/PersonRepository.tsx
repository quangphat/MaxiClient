import * as Models from '../Models'
import { Fetch } from './Fetch'
import * as ApiHelpers from '../infrastructure/ApiHelpers'
export const PersonRepository = {
    Create: async (model: Models.IUpdateEmployeeModel) => {
        return Fetch.Post('/api/employees', model).then(response => {
            return response;
        })
    },
    GetDetail: async (id: number) => {
        return Fetch.Get(`/api/employees/${id}`, null).then(response => {
            return response;
        })
    },
    Search: async (searchStr: string, page: number, limit: number) => {
        let path = ApiHelpers.GetApiUrl('/api/employees', {
            page: page,
            limit: limit,
            freeText: searchStr
        })
        return Fetch.Get(path, null).then(response => {
            return response;
        })
    },
    Update: async (model: Models.IUpdateEmployeeModel) => {
        return Fetch.PUT(`/api/employees`, model).then(response => {
            return response;
        })
    },
}
