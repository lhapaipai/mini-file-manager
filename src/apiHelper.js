import { notify } from "mini-notifier";
export async function jsonFetchOrNotify(url, params = {}, xRequestedWith = false) {
    try {
        return await jsonFetch(url, params, xRequestedWith);
    }
    catch (err) {
        if (err instanceof ApiError) {
            notify(err.title, {
                style: "error",
                time: 5000,
            });
        }
        else {
            notify(err, {
                style: "error",
                time: 5000,
            });
        }
        throw err;
    }
}
export async function formFetchOrNotify(url, params = {}, xRequestedWith = false) {
    try {
        return await formFetch(url, params, xRequestedWith);
    }
    catch (err) {
        if (err instanceof ApiError) {
            notify(err.title, {
                style: "error",
                time: 5000,
            });
        }
        else {
            notify(err, {
                style: "error",
                time: 5000,
            });
        }
        throw err;
    }
}
export async function fetchOrNotify(url, params = {}, xRequestedWith = false) {
    try {
        let headers = new Headers({
            Accept: "application/json",
        });
        if (xRequestedWith) {
            headers.append("X-Requested-With", "XMLHttpRequest");
        }
        params = {
            headers,
            method: "GET",
            ...params,
        };
        return await customFetch(url, params);
    }
    catch (err) {
        if (err instanceof ApiError) {
            notify(err.title, {
                style: "error",
                time: 5000,
            });
        }
        else {
            notify(err, {
                style: "error",
                time: 5000,
            });
        }
        throw err;
    }
}
export function jsonFetch(url, params = {}, xRequestedWith = false) {
    if (params.body instanceof FormData) {
        params.body = JSON.stringify(form2obj(params.body));
    }
    if (typeof params.body === "object") {
        params.body = JSON.stringify(params.body);
    }
    let headers = new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
    });
    if (xRequestedWith) {
        headers.append("X-Requested-With", "XMLHttpRequest");
    }
    params = {
        headers,
        method: "POST",
        ...params,
    };
    return customFetch(url, params);
}
export function formFetch(url, params = {}, xRequestedWith = false) {
    // if (!params.body) {
    //   throw new ApiError('No content to fetch', 500);
    // }
    if (params.body && typeof params.body === "object") {
        params.body = obj2form(params.body);
    }
    let headers = new Headers({
        Accept: "application/json",
    });
    if (xRequestedWith) {
        headers.append("X-Requested-With", "XMLHttpRequest");
    }
    params = {
        headers,
        method: "POST",
        ...params,
    };
    return customFetch(url, params);
}
function obj2form(obj) {
    const form = new FormData();
    for (let key in obj) {
        if (obj[key] instanceof Array) {
            for (let val of obj[key]) {
                form.append(`${key}[]`, val);
            }
        }
        else {
            form.append(key, obj[key]);
        }
    }
    return form;
}
function form2obj(form) {
    return Object.fromEntries(form.entries());
}
async function customFetch(url, params = {}) {
    let res, data;
    try {
        res = await fetch(url, params);
        if (res.status === 204) {
            return null;
        }
    }
    catch (e) {
        // erreur de type CORS (401 non autorisé)
        throw new ApiError("Erreur serveur.", 401);
    }
    if (res.headers.has("Content-Type") &&
        res.headers.get("Content-Type") !== "application/json") {
        if (!res.ok) {
            // le serveur a renvoyé une erreur mais pas présentée sous form json
            throw new ApiError("Erreur serveur.", 500);
        }
        return res;
    }
    try {
        data = await res.json();
    }
    catch (e) {
        throw new ApiError("Le contenu renvoyé est illisible.", 500);
    }
    // le serveur a renvoyé une erreur mais présentée en json avec un message lisible.
    if (!res.ok) {
        let title = data.err || data.title || data.detail || "Erreur serveur";
        throw new ApiError(title, res.status);
    }
    return data;
}
export class ApiError {
    title;
    status;
    constructor(title, status = 500) {
        this.title = title;
        this.status = status;
    }
}
//# sourceMappingURL=apiHelper.js.map