import { IPaging } from "../Models";


export const parseFreeTextQuery = (freeText: string) => {
    return encodeURIComponent(freeText.trim() || "").replace(/%20/g, "+");
};
export const parsePaging = (search: string, hasPaging: boolean=true): IPaging => {
    let queries = new URLSearchParams(search);
    let paging = new Object as IPaging
    paging.query = '';
    paging.tab_id = '';
    paging.status = '';
    paging.hidden = false;
    paging.page = null as number;
    paging.limit = null as number
    paging.startDate = '';
    paging.endDate = '';
    paging.over = ''
    paging.tags = ''
    
    if (queries.get('query')) {
        paging.query = queries.get('query')
    }
    if (queries.get('tags')) {
        paging.tags = queries.get('tags')
    }
    if (queries.get('status')) {
        paging.status = queries.get('status')
    }
    if (queries.get('tab_id')) {
        paging.tab_id = queries.get('tab_id')
    }
    
    if (queries.get('startDate')) {
        paging.startDate = queries.get('startDate')
    }
    if (queries.get('endDate')) {
        paging.endDate = queries.get('endDate')
    }
    if (queries.get('over')) {
        paging.over = queries.get('over')
    }
    if (queries.get('hidden')) {
        let value = queries.get('hidden')
        if (value && value.toLowerCase() === 'true') {
            paging.hidden = true
        }
    }
    
    if (queries.get('page')) {
        let tmp = parseInt(queries.get('page'))
        if (!isNaN(tmp)) {
            paging.page = tmp
        }
    }
    if (queries.get('limit')) {
        let tmp = parseInt(queries.get('limit'))
        if (!isNaN(tmp)) {
            paging.limit = tmp
        }
    }
    
    let defaultPage = hasPaging ? 1 : null
    let defaultLimit = hasPaging ? 10 : null
    return paging;
}