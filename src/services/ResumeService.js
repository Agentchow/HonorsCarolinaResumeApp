import axios from "axios";

const url = "https://honor-carolina-resume-backend-rnarveka.apps.cloudapps.unc.edu/resumes/"

export function getAll() {
    return axios.get(url)
}

export function get(id) {
    try{
        return axios.get(url + id)
    }
    catch (err) {
        return err.response
    }
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

export function newComment(id, commenter, message) {
    return axios.put("https://honor-carolina-resume-backend-rnarveka.apps.cloudapps.unc.edu/comment/" + id, {
        "name" : commenter,
        "comment" : message
    }) 
}
