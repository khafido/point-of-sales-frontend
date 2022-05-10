import apiClient from 'api'

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

export async function create(storeData) {
	return apiClient.post(url, storeData)
}

export async function update(id, storeData) {
	return apiClient.put(`${url}/${id}`, storeData)
}

export async function remove(id) {
	return apiClient.delete(`${url}/${id}`)
}