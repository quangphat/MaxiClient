import * as Models from '../Models'
import { Fetch } from './Fetch'
import * as ApiHelpers from '../infrastructure/ApiHelpers'
export const ArticleRepository = {
    CreateArticle: async (article: Models.IArticle) => {
        return Fetch.Post('/articles', article).then(response => {
            return response;
        })
    },
    CreateArticleDraft: async () => {
        return Fetch.Post('/articles/draft', null).then(response => {
            return response;
        })
    },
    SaveArticleDraft: async (article: Models.IArticle) => {
        return Fetch.PUT('/articles/draft', article).then(response => {
            return response;
        })
    },
    Search: async (searchStr: string, authorId: string, categoryId: string, page: number, limit: number) => {
        let path = ApiHelpers.GetApiUrl('/articles/search', {
            page: page,
            limit: limit,
            searchStr: searchStr,
            authorId: authorId,
            categoryId: categoryId
        })
        return Fetch.Get(path, null).then(response => {
            return response;
        })
    },
    GetSeriesByAuthor: async (searchStr: string, authorId: string,  page: number, limit: number) => {
        let path = ApiHelpers.GetApiUrl('/articles/series', {
            page: page,
            limit: limit,
            searchStr: searchStr,
            authorId: authorId
           
        })
        return Fetch.Get(path, null).then(response => {
            return response;
        })
    },
    GetTop3ByAuthor: async (authorId: string, ignoreIds: Models.StringModel) => {
        let path = `/articles/top3byAuthor/${authorId}`
        return Fetch.Post(path, ignoreIds).then(response => {
            return response;
        })
    },
    GetArticlesByAuthor: async (authorId: string, page: number, limit: number) => {
        let path = ApiHelpers.GetApiUrl(`/articles/byauthor/${authorId}`, {
            page: page,
            limit: limit
        })
        return Fetch.Get(path).then(response => {
            return response;
        })
    },
    GetRelateByTags: async (ignoreAuthorId: string, model: Models.StringModelV2) => {
        let path = `/articles/relatebytags/${ignoreAuthorId}`
        return Fetch.Post(path, model).then(response => {
            return response;
        })
    },
    GetArticlesByTags: async (tags: string, page: number, limit: number) => {
        let path = ApiHelpers.GetApiUrl("/articles/tags", {
            tags: tags,
            page: page,
            limit:limit
        })
        return Fetch.Get(path).then(response => {
            return response;
        })
    },
    GetDetail: async (id: string) => {
        return Fetch.Get(`/articles/${id}`, null).then(response => {
            return response;
        })
    },
    GetDraftById: async (id: string) => {
        return Fetch.Get(`/articles/draft/${id}`, null).then(response => {
            return response;
        })
    },
    GetByFriendlyUrl: async (url: string) => {
        return Fetch.Get(`/articles/friendlyurl/${url}`, null).then(response => {
            return response;
        })
    },
    LikeArticle: async (articleId: string, isLike: boolean) => {
        return Fetch.Post(`/articles/like/${articleId}/${isLike}`, null).then(response => {
            return response;
        })
    },
    UpdateArticle: async (article: Models.IArticle) => {
        return Fetch.PUT(`/articles`, article).then(response => {
            return response;
        })
    },
}
