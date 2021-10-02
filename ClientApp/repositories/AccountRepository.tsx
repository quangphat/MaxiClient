import * as Models from '../Models'
import { Fetch } from './Fetch'
import * as ApiHelpers from '../infrastructure/ApiHelpers'
export const AccountRepository = {
    Login: async (account) => {
        return Fetch.Post(`/account/login`, account).then(response => {
            return response;
        })
    },
    SignUp: async (account) => {
        return Fetch.Post(`/account/signup`, account).then(response => {
            return response;
        })
    },
    EmployerSignup: async (account) => {
        return Fetch.Post(`/account/employer/signup`, account).then(response => {
            return response;
        })
    },
    SelectTags: async (model: Models.StringModel, personId: string) => {
        return Fetch.Post(`/account/selecttag/${personId}`, model).then(response => {
            return response;
        })
    },
    ChangePass: async (model: Models.IChangePassword) => {
        return Fetch.Post(`/account/security`, model).then(response => {
            return response;
        })
    }
}

