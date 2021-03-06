import apiClient from "api";

const url = '/voucher'

export async function listVoucher(isPaginated, page, size, searchVal, sortBy, sortDirection) {
  return apiClient
    .get(url, {
      params: {
        isPaginated,
        page,
        size,
        searchVal,
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

export async function addVoucher({ name, code, value, quota, startDate, endDate, minimumPurchase, description }) {
  return apiClient
    .post(url, { name, code, value, quota, startDate, endDate, minimumPurchase, description })
    .then(response => {
      if (response) {
        return response.data
      } return false
    })
    .catch(err => console.log(err))
}

export async function updateVoucher(id, { name, code, quota, value, startDate, endDate, minimumPurchase, description }) {
  return apiClient
    .put(`${url}/${id}`, { name, code, value, quota, startDate, endDate, minimumPurchase, description })
    .then(response => {
      if (response) {
        return response.data
      } return false
    })
    .catch(err => console.log(err))
}

export async function deleteVoucher(id) {
  return apiClient
    .patch(`${url}/${id}`)
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function checkCodeExist(code) {
  return apiClient
    .get(`${url}/check-voucher/${code}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}