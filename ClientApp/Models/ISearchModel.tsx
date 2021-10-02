import { IAuthor} from './IAuthor'
export interface ISearchModel {
    id: string,
    feedId: string,
    objectType: number,
    title: string,
    tags: string[],
    projectId: string,
    likes: number,
    views: number,
    comments: number,
    shares: number,
    createdTime: Date,
    friendlyUrl: string,
    author: IAuthor,
    preview: string,

}