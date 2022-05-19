import apiClient from "api";

const url = '/auth';

export async function login(req) {
    return apiClient
        .post(`${url}/login/`, req, {
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
                return response;
            }
            return false;
        })
        .catch(err => {
            return err.response;
        })
}