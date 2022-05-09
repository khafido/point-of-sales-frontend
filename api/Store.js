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
