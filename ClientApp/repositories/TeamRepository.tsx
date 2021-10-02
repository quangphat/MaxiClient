import * as Models from '../Models'
import { Fetch } from './Fetch'
import * as ApiHelpers from '../infrastructure/ApiHelpers'
export const TeamRepository = {
    CreateJob: async (model: Models.IJobCreateModel) => {
        return Fetch.Post('/jobs', model).then(response => {
            return response;
        })
    },
    ApplyJob: async (formData: FormData) => {
        return fetch("/jobs/applyjob", {
            method: 'POST',
            body: formData,
            credentials: 'include'
        }).then(rsp => {
            if (rsp != null)
                return rsp.json()
            return null
        })
    },
    CreateJobDraft: async () => {
        return Fetch.Post('/articles/draft', null).then(response => {
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
    
    GetEmploymentTypes: async () => {
        let path = ApiHelpers.GetApiUrl("jobs/employmenttypes-simples", null)
        return Fetch.Get(path).then(response => {
            return response;
        })
    },

    GetJobsByTags: async (tags: string, page: number, limit: number) => {
        let path = ApiHelpers.GetApiUrl("/articles/tags", {
            tags: tags,
            page: page,
            limit:limit
        })
        return Fetch.Get(path).then(response => {
            return response;
        })
    },
    GetByFriendlyUrl: async (url: string) => {
        return Fetch.Get(`/jobs/friendlyUrl/${url}`, null).then(response => {
            return response;
        })
    },
    GetDetail: async (id: number) => {
        return Fetch.Get(`/api/teams/${id}`, null).then(response => {
            return response;
        })
    },
    LikeJob: async (articleId: string, isLike: boolean) => {
        return Fetch.Post(`/articles/like/${articleId}/${isLike}`, null).then(response => {
            return response;
        })
    },
    UpdateJob: async (model: Models.IJob) => {
        return Fetch.PUT(`/jobs`, model).then(response => {
            return response;
        })
    },
}
