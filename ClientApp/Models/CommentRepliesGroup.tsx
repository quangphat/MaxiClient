import { IReplyComment } from './IReplyComment'
export interface ICommentRepliesGroup {
    commentId: string,
    replies: IReplyComment[]
}