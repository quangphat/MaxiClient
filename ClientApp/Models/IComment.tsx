import { IAuthor } from './IAuthor'

export interface IComment {
    id: string,
    content: string,
    author: IAuthor,
    articleId: string,
    likes: number,
    replies: number,
    isHidden: boolean,
    createdTime: Date,
    modifiedTime: Date,
    projectId: string,

}