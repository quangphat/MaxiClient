const isNullOrWhiteSpace = (str: string): boolean => {
    if (str == null || str === '' || str == undefined || str.trim() == '')
        return true
    return false;
}
export const Path = {
    test: '/test',
    employee: '/employees',
    employee_create: '/employees/create',
    employee_edit: (id?: number): string => {
        if (isNaN(id))
            return '/employees/:id'
        return `/employees/${id}`
    },
    home:'/',
    team_create:'/teams/create',
    team_edit: (id?: string): string => {
        if (isNullOrWhiteSpace(id))
            return '/teams/:id'
        return `/teams/${id}`
    },
    //article
    article: '/article',
    article_edit: (id?: string): string => {
        if (isNullOrWhiteSpace(id))
            return '/article/edit/:id'
        return `/article/edit/${id}`
    },
    article_create: '/article/create',
    article_draft: (id?: string): string => {
        if (isNullOrWhiteSpace(id))
            return '/article/draft/:id'
        return `/article/draft/${id}`
    },
    article_detail: (id?: string): string => {
        if (isNullOrWhiteSpace(id))
            return '/article/:id'
        return `/article/${id}`
    },
    register: '/register',
    legal_term: '/legal/terms',
    recommend_tags: '/recommend_tags',
    article_by_tags: '/tags',
    search_global: '/search',
    profile: (profileName?: string): string => {
        if (isNullOrWhiteSpace(profileName))
            return '/profile/:profileName'
        return `/profile/${profileName}`
    },
    job_edit: (id?: string): string => {
        if (isNullOrWhiteSpace(id))
            return '/job/edit/:id'
        return `/job/edit/${id}`
    },
    job_detail: (id?: string): string => {
        if (isNullOrWhiteSpace(id))
            return '/job/:id'
        return `/job/${id}`
    },
    job_apply: (id?: string): string => {
        if (isNullOrWhiteSpace(id))
            return '/job/apply/:id'
        return `/job/apply/${id}`
    },
    job_create: '/job/create',
    login: '/login'
}