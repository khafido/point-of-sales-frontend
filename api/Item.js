import apiClient from "api";

const url = '/item'

export async function listItems(isPaginated, page, size, searchValue, sortBy, sortDirection) {
    return apiClient
        .get(url, {
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

export async function addItem({ name, image, barcode, category, packaging }) {
    return apiClient
        .post(url, {
            name,
            image,
            barcode,
            category,
            packaging
        })
        .then(response => {
            return response.data
        })
        .catch(err => console.log(err))
}

export async function updateItem(id, { name, image, barcode, category, packaging }) {
    return apiClient
        .put(`${url}/${id}`, {
            name,
            image,
            barcode,
            category,
            packaging
        })
        .then(response => {
            if (response) {
                return response.data
            }
            return false
        })
        .catch(err => console.log(err))
}

export async function deleteItem(id) {
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

export async function checkBarcodeOnAdd(barcode) {
    return apiClient
        .get(`${url}/check-barcode-add`, { params: { barcode } })
        .then(response => {
            return response.data
        })
        .catch(err => console.log(err))
}

export async function checkBarcodeOnEdit(id, barcode) {
    return apiClient
        .get(`${url}/check-barcode-update/${id}`, { params: { barcode } })
        .then(response => {
            return response.data
        })
        .catch(err => console.log(err))
}


export async function addStock(req) {
    return apiClient
        .post(`${url}/stock/`, req, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '3600',
                'Access-Control-Allow-Credentials': 'true',
            },
        })
        .then(response => {
            if (response) {
                return response.data
            }
            return false
        })
        .catch(err => console.log(err))
}

export async function getIncomingItem(isPaginated, page, size, search, sortBy, sortDirection, start, end) {
    return apiClient
        .get(`${url}/stock`, {
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