import * as Models from '../Models'
import { Fetch } from './Fetch'
import * as ApiHelpers from '../infrastructure/ApiHelpers'
export const IndustryRepository = {
    Search: async (freeText: string, page: number, limit: number) => {
        let path = ApiHelpers.GetApiUrl('/Industry/search', {
            page: page,
            limit: limit,
            freeText: freeText
        })
        return Fetch.Get(path).then(response => {
            return response;
        })
    },
}
