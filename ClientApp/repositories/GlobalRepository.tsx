import * as Models from '../Models'
import { Fetch } from './Fetch'
import * as ApiHelpers from '../infrastructure/ApiHelpers'
export const GlobalRepository = {
    Search: async (freeText: string,  page: number, limit: number) => {
        let path = ApiHelpers.GetApiUrl('/global', {
            page: page,
            limit: limit,
            freeText: freeText
            
        })
        return Fetch.Get(path, null).then(response => {
            return response;
        })
    },
}
