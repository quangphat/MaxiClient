import * as Models from '../Models'
import { Fetch } from './Fetch'
export const ReplyCommentRepository = {
    CreateReplyComment: async (comment: Models.IReplyComment) => {
        return Fetch.Post('/reply', comment).then(response => {
            return response;
        })
    },
    GetByCommentId: async (commentId: string, page: number, limit: number) => {
        return Fetch.Get(`/reply/${commentId}/${page}/${limit}`).then(response => {
            return response;
        })
    }
}
