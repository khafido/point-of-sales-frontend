import apiClient from "api";

const url = '/role'

export async function getRoleById(id) {
    return apiClient
    .get(`${url}/${id}`)
    .then(response=> {
        if(response) {
            return response.data
        }
        return false
    })
    .catch(err => console.log(err))
}