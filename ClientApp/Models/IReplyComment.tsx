import { IAuthor } from './IAuthor'

export interface IReplyComment {
    id: string,
    commentId: string,
    articleId: string,
    content: string,
    author: IAuthor,
    likes: number,
    isHidden: boolean,
    createdTime: Date,
    modifiedTime: Date,
    projectId: string,

}