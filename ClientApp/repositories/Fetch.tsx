
export interface IResponse<T> extends IResponseResult {
    data: T
}
export interface IResponseResult {
    error: IResponseError,
    success?: boolean
}
export interface IResponseError {
    code: string,
    message: string,
    trace_keys: string[]
}

export class Fetch {
    private static WaitCount: number = 0
    private static ProcessBarPercent: number = 0
    private static HasShowWait: boolean = false
    public static async CallAction(this, url: string) {
        var xhr = new XMLHttpRequest();
        xhr.open('get', url, true);
        xhr.send();
    }
    public static async Get<T>(this, url: string,
        hasShowWait: boolean = true,
        callback_success: Function = null,
        callback_fail: Function = null) {
        if (hasShowWait) {
            this.showWait(true)
        }

        return fetch(url, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (hasShowWait) {
                this.showWait(false)
            }
            if (response.status == 200) {
                let result = response.json() as Promise<IResponse<any>>
                if (callback_success || callback_fail) {
                    result.then((data) => {
                        if (!data.error) {
                            if (callback_success) {
                                callback_success(data)
                                return data
                            }
                        }
                        else {
                            if (callback_fail) {
                                this.context.ShowMessage('error', data.error.message, data.error.code)
                                callback_fail(data)
                                return data
                            }
                        }
                    })
                }
                else
                    return result
            }
            else {
                //Bad request
            }
        })
    }
    public static async Post<T>(this, url: string, data: object, hasShowWait: boolean = true,
        callback_success: Function = null,
        callback_fail: Function = null) {
        if (hasShowWait) {
            this.showWait(true)
        }

        return fetch(url, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (hasShowWait) {
                this.showWait(false)
            }

            if (response.status == 200) {
                let result = response.json() as Promise<IResponse<any>>
                if (callback_success || callback_fail) {
                    result.then((data) => {
                        if (!data.error) {
                            if (callback_success) {
                                callback_success(data)
                                return data
                            }
                        }
                        else {
                            if (callback_fail) {
                                this.context.ShowMessage('error', data.error.message, data.error.code)
                                callback_fail(data)
                                return data
                            }
                        }
                    })
                }
                else
                    return result
            }
            else {
                //Bad request
            }
        })
    }
    public static async PUT<T>(this, url: string, data: object, hasShowWait: boolean = true,
        callback_success: Function = null,
        callback_fail: Function = null) {
        if (hasShowWait) {
            this.showWait(true)
        }

        return fetch(url, {
            method: 'PUT',
            credentials: 'include',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (hasShowWait) {
                this.showWait(false)
            }

            if (response.status == 200) {
                let result = response.json() as Promise<IResponse<any>>
                if (callback_success || callback_fail) {
                    result.then((data) => {
                        if (!data.error) {
                            if (callback_success) {
                                callback_success(data)
                                return data
                            }
                        }
                        else {
                            if (callback_fail) {
                                this.context.ShowMessage('error', data.error.message, data.error.code)
                                callback_fail(data)
                                return data
                            }
                        }
                    })
                }
                else
                    return result
            }
            else {
                //Bad request
            }
        })
    }
    public static async Delete<T>(this, url: string, data: object, hasShowWait: boolean = true) {
        if (hasShowWait) {
            this.showWait(true)
        }

        return fetch(url, {
            method: 'DELETE',
            credentials: 'include',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (hasShowWait) {
                this.showWait(false)
            }

            return response.json() as Promise<IResponse<T>>
        })
    }
    private static showWait(this, hasShowWait: boolean, delayTime?: number) {
        if (hasShowWait) {
            this.WaitCount++

            if (this.ProcessBarPercent < 100) {
                this.ProcessBarPercent += 5
            }

            this.HasShowWait = true
        } else {
            this.WaitCount--

            if (this.WaitCount < 1) {
                this.WaitCount = 0

                let timeout = 0

                if (delayTime != null && delayTime > 0) {
                    timeout = delayTime
                }

                this.ProcessBarPercent = 20

                setTimeout(function () {
                    this.HasShowWait = false
                }, timeout)
            }
        }
    }
}