export interface IAuthor {
    id: string,
    firstName: string,
    lastName: string,
    avatar: string,
    createdTime?: Date,
    modifiedTime?: Date,
    email: string,
    projectId: string,
    workAs?: string,
    displayName: string,
    profileName: string,
    skillTags: string[]
}