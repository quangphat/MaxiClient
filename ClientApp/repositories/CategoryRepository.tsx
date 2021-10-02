import * as Models from '../Models'
import { Fetch } from './Fetch'
export const CategoryRepository = {
    CreateCategory: async (category: Models.ICategory) => {
        return Fetch.Post('/Categories/create', category).then(response => {
            return response;
        })
    },
    GetAll: async () => {
        return Fetch.Get('/Categories').then(response => {
            return response;
        })
    }
}
