import { ICategory } from '../Models/ICategory'
import { IAuthor } from '../Models/IAuthor'
export interface IArticle {
    id: string,
    title: string,
    preview: string,
    createdTime?: Date,
    modifiedTime?: Date,
    createdBy: string,
    modifiedBy: string,
    content: string,
    imageUrl: string,
    isDelete: boolean,
    isLiked?: boolean,
    likes: number,
    comments: number,
    shares: number,
    views: number,
    category: ICategory,
    categoryIds: string[],
    categoryNames: string[],
    author?: IAuthor,
    projectId: number,
    friendlyUrl: string,
    status: number,
    tags: string[],
    isSerie: boolean,
    lastPartId: string,
    partNumber: number
}
//<AppendNewHere>