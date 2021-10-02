import * as Models from '../Models'
import { Fetch } from './Fetch'
export const CommentRepository = {
    CreateComment: async (comment: Models.IComment) => {
        return Fetch.Post('/comments', comment).then(response => {
            return response;
        })
    },
    GetByArticleId: async (articleId: string, page: number, limit: number) => {
        return Fetch.Get(`/comments/${articleId}/${page}/${limit}`).then(response => {
            return response;
        })
    }
}
