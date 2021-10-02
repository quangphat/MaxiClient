import {isNullOrUndefined } from "./Utils";

let env = {
    baseUrl: '/',
    layout: null
}

export const Env = env;

const parseObjectToParam = (obj: Object) => {
    let path = ''
    Object.keys(obj).map(key => {
        if ((obj[key] || obj[key] === 0) && obj[key] != null) {
            path += '&' + key + '=' + encodeURIComponent(obj[key])
        }
    })
    path = path.substring(1)
    return path
}
export const setLayout = (layout: React.Component) => {
    env.layout = layout;
}

export const GetApiUrl = (path: string, value: object): string => {
    if (value) {
        var param = parseObjectToParam(value)
        if (!isNullOrUndefined(param))
            path += `?${param}`
    }
    return path
}

const api_call = async (method: string, body: any, apiId: string, path: string, errorSystem: string): Promise<any> => {
    let url = `${Env.baseUrl}call/${apiId}${path}`;
    try {
        let rp = await fetch(url, {
            method: method,
            body: body ? JSON.stringify(body) : null,
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        if (rp.status == 401) {
            if (env.layout)
                env.layout.openPopupAuthorizeException();
        } else if (rp.status == 403) {
            if (env.layout)
                env.layout.redirectPagePermission()
        }
        else if (rp.status == 200 || rp.status == 201 || rp.status == 304) {
            return await rp.json();
        } else {
            if (errorSystem && env.layout)
                env.layout.ShowMessage('error', errorSystem)
        }
    }
    catch (e) {
        if (env.layout) {
            env.layout.ShowMessage('error', 'Xin lỗi, đã có lỗi khi thực hiện');
        }

        throw e;
    }
    finally {

    }
}
export enum ApiType {
    com_api = "com_api",
    hac_api = 'hac_api'
}
export const api_call_get = (apiId: string, path: string, errorSystem?: string): Promise<any> => {
    return api_call('GET', null, apiId, path, errorSystem);
}
export const api_call_post = (apiId: string, path: string, body: any, errorSystem?: string): Promise<any> => {
    return api_call('POST', body, apiId, path, errorSystem);
}
export const api_call_put = (apiId: string, path: string, body?: any, errorSystem?: string): Promise<any> => {
    return api_call('PUT', body, apiId, path, errorSystem);
}
export const api_call_delete = (apiId: string, path: string, errorSystem?: string): Promise<any> => {
    return api_call('DELETE', null, apiId, path, errorSystem);
}
export const api_upload_file = (blob: Blob, fileName: string, path: string = 'file/upload'): Promise<any> => {
    let url = `${Env.baseUrl}call/${ApiType.com_api}/${path}`;
    let input = new FormData();
    input.append('file', blob, fileName);

    return fetch(url, {
        method: 'POST',
        body: input,
        credentials: 'include'
    }).then(rsp => {
        if (rsp != null)
            return rsp.json()
        return null
    })
}
export const api_upload_file_hac_api = async (blob: Blob, fileName: string, api: string = 'file/upload', errorSystem: string = ''): Promise<any> => {
    let url = `${Env.baseUrl}call/${ApiType.hac_api}/file/upload`;
    let input = new FormData();
    input.append('file', blob, fileName);

    let rp = await fetch(url, {
        method: 'POST',
        body: input,
        credentials: 'include'
    })
    try {
        let rp = await fetch(url, {
            method: 'POST',
            body: input,
            credentials: 'include'
        });
        if (rp.status == 401) {
            if (env.layout)
                env.layout.openPopupAuthorizeException();
        } else if (rp.status == 403) {
            if (env.layout){
                env.layout.ShowMessage('error', 'Bạn không có quyền upload file');
                env.layout.redirectPagePermission();
            }
        }
        else if (rp.status == 200 || rp.status == 201 || rp.status == 304) {
            return await rp.json();
        } else {
            if (errorSystem && env.layout)
                env.layout.ShowMessage('error', errorSystem)
        }
    }
    catch (e) {
        if (env.layout) {
            env.layout.ShowMessage('error', 'Xin lỗi, đã có lỗi khi thực hiện');
        }
        throw e;
    }
    finally {

    }
}
export const api_upload_file_multi = async (blob: any[], productId: number, errorSystem: string = ''): Promise<any> => {
    let url = `${Env.baseUrl}call/${ApiType.com_api}/products/${productId}/images`
    let input = new FormData();
    for (var i = 0; i != blob.length; i++) {
        input.append("files", blob[i]);
    }
    try {
        let rp = await fetch(url, {
            method: 'POST',
            body: input,
            credentials: 'include'
        });
        if (rp.status == 401) {
            if (env.layout)
                env.layout.openPopupAuthorizeException();
        } else if (rp.status == 403) {
            if (env.layout){
                env.layout.ShowMessage('error', 'Bạn không có quyền upload file');
                env.layout.redirectPagePermission();
            }
        }
        else if (rp.status == 200 || rp.status == 201 || rp.status == 304) {
            return await rp.json();
        } else {
            if (errorSystem && env.layout)
                env.layout.ShowMessage('error', errorSystem)
        }
    }
    catch (e) {
        if (env.layout) {
            env.layout.ShowMessage('error', 'Xin lỗi, đã có lỗi khi thực hiện');
        }
        throw e;
    }
    finally {

    }
}
