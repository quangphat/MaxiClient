export interface ICategory {
    id: string,
    categoryName: string,
    isRoot: boolean,
    parentCategoryId?: string,
    level: number,
    createdTime?: Date,
    modifiedTime?: Date,
    subCategories?: ICategory[],
    categoryIds?: string[],
    categoryNames?: string[],
    isOpen?: boolean,
    isCheck?: boolean
}