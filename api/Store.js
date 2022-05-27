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
        .then(response => {
            if (response) {
                return response.data
            }
            return false
        })
        .catch(err => console.log(err))
}

export async function getByStoreId(storeId) {
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

export async function assignManager(storeId, userId) {
    return apiClient.post(`${url}/${storeId}/manager`, {
        userId
    }).then(response => {
        if (response) {
            return response.data
        }
        return false
    })
        .catch(err => console.log(err))
}

export async function storeListofExpiredItems(storeId, isPaginated, page, size, search, sortBy, sortDirection, start, end) {
    return apiClient
        .get(`${url}/${storeId}/expired-item`, {
            params: {
                isPaginated,
                page,
                size,
                search,
                sortBy,
                sortDirection,
                start,
                end
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

export async function storeListOfItems(storeId, isPaginated, page, size, searchValue, sortBy, sortDirection) {
    return apiClient
        .get(`${url}/${storeId}/item`, {
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

export async function addItemToStore(storeId, itemIdList = []) {
    return apiClient
        .post(`${url}/${storeId}/item`, {
            itemIdList
        })
        .then(response => {
            if (response) {
                return response.data
            }
            return false
        })
        .catch(err => console.log(err))
}

export async function updateStoreItemPrice(storeId, itemId, { priceMode, fixedPrice }) {
    return apiClient
        .patch(`${url}/${storeId}/item/${itemId}`, {
            priceMode,
            fixedPrice
        })
        .then(response => {
            if (response) {
                return response.data
            }
            return false
        })
        .catch(err => console.log(err))
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

export async function addEmployee(employee) {
	return apiClient.post(`${url}/add-employee`, employee)
}
