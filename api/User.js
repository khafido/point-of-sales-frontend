import apiClient from "api";

const url = '/user'

export async function listUser(isPaginated, page, size, searchValue, sortBy, sortDirection) {
    return apiClient
        .get(url, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '3600',
                'Access-Control-Allow-Credentials': 'true',
            },
            params: {
                isPaginated,
                page,
                size,
                searchValue,
                sortBy,
                sortDirection
            }
        })
        .then(response => {
            if (response) {
                return response.data
            }
            return false
        })
        .catch(err => console.log(err))
}

export async function addUser(req) {
    return apiClient
        .post(url, req, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '3600',
                'Access-Control-Allow-Credentials': 'true',
            },
        })
        .then(response => {
            if (response) {
                return response.data
            }
            return false
        })
        .catch(err => console.log(err))
}

export async function editUser(id, req) {
    return apiClient
        .put(url + "/" + id, req, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'PUT',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '3600',
                'Access-Control-Allow-Credentials': 'true',
            },
        })
        .then(response => {
            if (response) {
                return response.data
            }
            return false
        })
        .catch(err => console.log(err))
}

export async function getById(id) {
    return apiClient
        .get(url + "/" + id, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '3600',
                'Access-Control-Allow-Credentials': 'true',
            },
        })
        .then(response => {
            if (response) {
                return response.data
            }
            return false
        })
        .catch(err => console.log(err))
}

export async function deleteUser(id) {
    return apiClient
        .patch(url + "/" + id)
        .then(response => {
            if (response) {
                return response.data
            }
            return false
        })
        .catch(err => console.log(err))
}

export async function checkUsernameIsExist(username) {
    return apiClient
        .get(`${url}/check-username/${username}/`, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '3600',
                'Access-Control-Allow-Credentials': 'true',
            },
        })
        .then(response => {
            return response;
        }
        ).catch(err => console.log(err))
}

export async function checkEmailIsExist(email) {
    return apiClient
        .get(`${url}/check-email/${email}/`, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '3600',
                'Access-Control-Allow-Credentials': 'true',
            },
        })
        .then(response => {
            return response;
        }
        ).catch(err => console.log(err))
}

export async function addRole(id, req) {
    return apiClient
        .patch(`${url}/${id}/add-roles`, req, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'PATCH',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '3600',
                'Access-Control-Allow-Credentials': 'true',
            }
        })
        .then(response => {
            return response.data;
        })
        .catch(err => console.log(err))
}

export async function removeRole(id, req) {
    return apiClient
        .patch(`${url}/${id}/remove-roles`, req, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'PATCH',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '3600',
                'Access-Control-Allow-Credentials': 'true',
            }
        })
        .then(response => {
            return response.data;
        })
        .catch(err => console.log(err))
}
