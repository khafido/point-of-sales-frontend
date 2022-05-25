import apiClient from 'api'
import jsCookie from 'js-cookie'

const url = '/store'

export async function getAll(
	isPaginated,
	page,
	size,
	searchValue,
	sortBy,
	sortDirection
) {
	return apiClient.get(url, {
		params: {
			isPaginated,
			page,
			size,
			searchValue,
			sortBy,
			sortDirection,
		},
	})
}

export async function getById(storeId) {
	return apiClient.get(`${url}/${storeId}`)
}

export async function create(storeData) {
	return apiClient.post(url, storeData)
}

export async function update(id, storeData) {
	return apiClient.put(`${url}/${id}`, storeData)
}

export async function remove(id) {
	return apiClient.delete(`${url}/${id}`)
}

export async function assignManager({ storeId, userId }) {
	return apiClient
		.post(`${url}/${storeId}/manager`, {
			userId,
		})
		.then((response) => {
			if (response) {
				return response.data
			}
			return false
		})
		.catch((err) => console.log(err))
}

export async function getEmployeeById(
	storeId,
	isPaginated,
	page,
	size,
	searchValue,
	sortBy,
	sortDirection
) {
	return apiClient.get(`${url}/${storeId}/employee`, {
		params: {
			isPaginated,
			page,
			size,
			searchValue,
			sortBy,
			sortDirection,
		},
	})
}

export async function adddEmployee(employee) {
	return apiClient.post(`${url}/add-employee`, employee)
}
