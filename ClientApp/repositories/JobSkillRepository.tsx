import * as Models from '../Models'
import { Fetch } from './Fetch'
import * as ApiHelpers from '../infrastructure/ApiHelpers'
export const JobSkillRepository = {
    Search: async (freeText: string ='', page: number= 1, limit: number = 100) => {
        let path = ApiHelpers.GetApiUrl('/jobskills/search', {
            page: page,
            limit: limit,
            freeText: freeText
        })
        return Fetch.Get(path).then(response => {
            return response;
        })
    },
    GetSuggestedSkill: async () => {
        let path = '/jobskills/suggested';
        return Fetch.Get(path).then(response => {
            return response;
        })
    },
}
