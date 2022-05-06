import apiClient from "api";

const url = '/supplier'

export async function listSuppliers(isPaginated, page, size, searchValue, sortBy, sortDirection) {
    return apiClient
        .get(url, {
            params: {
                isPaginated,
                page,
                size,
                searchValue,
                sortBy,
                sortDirection
        }})
        .then(response=> {
            if(response) {
                return response.data
            }
            return false
        })
        .catch(err => console.log(err))
}

export async function addSupplier({name, email, phone, address, cpname}) {
    return apiClient
        .post(url, {
            name,
            email,
            phone,
            address,
            cpname
        })
        .then(response=> {
            if(response) {
                return response.data
            }
            return false
        })
        .catch(err => console.log(err))
}

export async function deleteSupplier(id) {
    return apiClient
        .delete(`${url}/${id}`)
        .then(response=> {
            if(response) {        
                return response.data
            }
            return false
        })
        .catch(err => console.log(err))
}

export async function updateSupplier(id, {name, email, phone, address, cpname}) {
    return apiClient
        .put(`${url}/${id}`, {
            name,
            email,
            phone,
            address,
            cpname
        })
        .then(response=> {
            if(response) {        
                return response.data
            }
            return false
        })
        .catch(err => console.log(err))
}
