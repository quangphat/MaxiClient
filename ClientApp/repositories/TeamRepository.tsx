import * as Models from '../Models'
import { Fetch } from './Fetch'
import * as ApiHelpers from '../infrastructure/ApiHelpers'
export const TeamRepository = {
    CreateTeam: async (model: Models.IUpdateTeamModel) => {
        return Fetch.Post('/api/teams', model).then(response => {
            return response;
        })
    },
    Search: async (searchStr: string, page: number, limit: number) => {
        let path = ApiHelpers.GetApiUrl('/api/teams', {
            page: page,
            limit: limit,
            freeText: searchStr
        })
        return Fetch.Get(path, null).then(response => {
            return response;
        })
    },
    GetTeamMembers: async (teamId: number, page: number, limit: number) => {
        let path = ApiHelpers.GetApiUrl(`/api/teams/${teamId}/members`, {
            page: page,
            limit: limit
        })
        return Fetch.Get(path, null).then(response => {
            return response;
        })
    },
   
    GetDetail: async (id: number) => {
        return Fetch.Get(`/api/teams/${id}`, null).then(response => {
            return response;
        })
    },

    UpdateTeam: async (model: Models.IUpdateTeamModel) => {
        return Fetch.PUT(`/api/teams`, model).then(response => {
            return response;
        })
    },
}
