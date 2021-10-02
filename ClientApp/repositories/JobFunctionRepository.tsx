import * as Models from '../Models'
import * as ApiHelpers from '../infrastructure/ApiHelpers'
import { Fetch } from './Fetch'
export const JobFunctionRepository = {
    Search: async (freeText: string, page: number, limit: number) => {
        let path = ApiHelpers.GetApiUrl('/JobFunctions/search', {
            page: page,
            limit: limit,
            freeText: freeText
        })
        return Fetch.Get(path).then(response => {
            return response;
        })
    },
}
