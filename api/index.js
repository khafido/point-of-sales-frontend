import axios from 'axios'

const baseURL = 'http://localhost:8080/api/v1'

let apiClient = axios.create({
    baseURL: baseURL
})

// apiClient.interceptors.request.use(function (config) {
//     config.headers.Authorization = `Bearer ${getAccessToken()}`
//     return config
// })

export default apiClient