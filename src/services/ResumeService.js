import axios from "axios";

const url = "https://honor-carolina-resume-backend-rnarveka.apps.cloudapps.unc.edu/resumes/"

export function getAll() {
    return axios.get(url)
}

export function get(id) {
    return axios.get(url + id)
}

export function post(name, link, major, tags, status) {
    return axios.post(url, {
            "name": name,
            "link": link,
            "major": major,
            "tags": tags,
            "approved": status
    })
}

export function del(id) {
    return axios.delete(url + id)
}

export function update(id) {
    return axios.put(url + id, {
            "approved": "approved"
    })
}
