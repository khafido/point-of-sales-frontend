import apiClient from "api";

const url = '/item'

export async function listItems(isPaginated, page, size, searchValue, sortBy, sortDirection){
    return apiClient
        .get(url, {
            params: {
                isPaginated,
                page,
                size,
                searchValue,
                sortBy,
                sortDirection
        }})
        .then(response => {
            if(response){
                response.data.result.currentPageContent.map(item => {
                    if (item.image == "string" | item.image == "" | item.image == null) {
                        item.image = "https://archive.org/download/no-photo-available/no-photo-available.png";
                    };
                })
                return response.data
            }
            return false
        })
        .catch(err => console.log(err))
}

export async function addItem({name, image, barcode, category, packaging}){
    return apiClient
        .post(url, {
            name,
            image,
            barcode,
            category,
            packaging
        })
        .then(response => {
            console.log(response)
            return response.data
        })
        .catch(err => console.log(err))
}

export async function updateItem(id, {name, image, barcode, category, packaging}){
    return apiClient
        .put(`${url}/${id}`, {
            name,
            image,
            barcode,
            category,
            packaging
        })
        .then(response => {
            console.log(response)
            if(response){
                return response.data
            }
            return false
        })
        .catch(err => console.log(err))
}

export async function deleteItem(id){
    return apiClient
        .patch(`${url}/${id}`)
        .then(response => {
            console.log(response)
            if(response){
                return response.data
            }
            return false
        })
        .catch(err => console.log(err))
}

export async function checkBarcodeExist(barcode){
    return apiClient
        .get(`${url}/check-barcode`, {params: {barcode}})
        .then(response => {
            console.log(response)
            return response.data
        })
        .catch(err => console.log(err))
}