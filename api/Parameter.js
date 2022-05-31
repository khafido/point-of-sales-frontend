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

export async function updateParameter(id, { name, value }) {
  return apiClient
    .put(`${url}/${id}`, { name, value })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}