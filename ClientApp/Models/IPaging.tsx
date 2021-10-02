export interface IPaging {
    page: number,
    limit: number,
    offset?: number,
    totalRecord?: number,
    hasMore?: boolean,
    query: string,
    status: string,
    hidden: boolean,
    startDate?: string,
    endDate?: string,
    over?: string,
    tab_id?: string,
    tags?: string
}
