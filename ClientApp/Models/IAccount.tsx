export interface IAccount {
    personId: string,
    displayName: string,
    profileName: string,
    avatar: string,
    workAs: string,
    company: string,
    rate: number,
    firstname: string,
    lastname: string,
    email: string,
    role: string,
    scopes: string[],
    projectId: string,
    password?: string
}
