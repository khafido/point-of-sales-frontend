import apiClient from "api";

const url = '/parameter'

export async function getAllParameter() {
  return apiClient
    .get(url).then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function updateParameter(id, { value }) {
  return apiClient
    .put(`${url}/${id}`, { value })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function checkParameterExist(parameter) {
  return apiClient
    .get(`${url}/check-parameter/${parameter}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}