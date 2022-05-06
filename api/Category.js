import apiClient from "api";

const url = '/category'

export async function listCategory(isPaginated, page, size, searchValue, sortBy, sortDir){
    return apiClient
        .get(url, {
            params: {
                isPaginated,
                page,
                size,
                searchValue,
                sortBy,
                sortDir
        }})
        .then(response => {
            if(response){
                return response.data
            }
            return false
        })
        .catch(err => console.log(err))
}

export async function addCategory({name}){
    return apiClient
        .post(url, {
            name
        })
        .then(response => {
            console.log(response)
            return response.data
        })
        .catch(err => console.log(err))
}

export async function updateCategory(id, {name}){
    return apiClient
        .put(`${url}/${id}`, {name})
        .then(response => {
            if(response){
                return response.data
            }
            return false
        })
        .catch(err => console.log(err))
}

export async function deleteCategory(id){
    return apiClient
        .patch(`${url}/${id}`)
        .then(response => {
            if(response){
                return response.data
            }
            return false
        })
        .catch(err => console.log(err))
}

export async function checkCategoryExist(category){
    return apiClient
        .get(`${url}'/check-category'/${category}`)
        .then(response => {
            return response.data
        })
        .catch(err => console.log(err))
}