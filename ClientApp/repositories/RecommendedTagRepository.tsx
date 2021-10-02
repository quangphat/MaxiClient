import * as Models from '../Models'
import { Fetch } from './Fetch'
import * as ApiHelpers from '../infrastructure/ApiHelpers'
export const RecommendedTagRepository = {
    GetAll: async () => {
        return Fetch.Get('/RecommendedTags').then(response => {
            return response;
        })
    },
    
}
