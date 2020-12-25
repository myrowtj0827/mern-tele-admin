import axios from "axios";
import config from "../../../config/index";

import {
    POST_ARTICLE,
    PUBLISHED_ALL,
    ARTICLES_ALL,
    ARTICLE_DETAILS,
    ARTICLE_DELETE,
    CATEGORY_LIST,
    CATEGORY_ADD,
    UPDATE_ARTICLE,
    ARTICLE_DETAILS_DISPLAY,
    GET_COMMENT_BYID,

    POST_NOTE,
    GET_NOTE,
    GET_ONE_NOTE,
    UPDATE_NOTE,
    DELETE_NOTE, SHOW_SPINNING,
} from "../types/types";

export const reset = () => dispatch => {
    dispatch({
        type: POST_NOTE,
        payload: '',
    });
    dispatch({
        type: GET_NOTE,
        payload: '',
    });
    dispatch({
        type: UPDATE_NOTE,
        payload: '',
    });
    dispatch({
        type: DELETE_NOTE,
        payload: '',
    });
    dispatch({
        type: UPDATE_ARTICLE,
        payload: '',
    });
    dispatch({
        type: ARTICLE_DELETE,
        payload: '',
    });
};

export const postArticle = (data) => dispatch => {
    dispatch({type: SHOW_SPINNING, payload: true});
    axios
        .post(config.SIM_API_URL + "api/articles/post-article", data)
        .then(res => {
            dispatch({type: SHOW_SPINNING, payload: false});
            dispatch({
                type: POST_ARTICLE,
                payload: res.data.msg,
            });
        })
        .catch(err => {
            dispatch({type: SHOW_SPINNING, payload: false});
            dispatch({
                type: POST_ARTICLE,
                payload: err.response.data.msg,
            });
        })
};

export function articleImageUpload(data) {
    return axios.post(config.SIM_API_URL + "api/documents/file-upload", data);
}

export const updateArticle = (data) => dispatch => {
    dispatch({type: SHOW_SPINNING, payload: true});
    axios
        .post(config.SIM_API_URL + "api/articles/update-article", data)
        .then(res => {
            dispatch({type: SHOW_SPINNING, payload: false});
            dispatch({
                type: UPDATE_ARTICLE,
                payload: res.data.msg,
            });
        })
        .catch(err => {
            dispatch({type: SHOW_SPINNING, payload: false});
            dispatch({
                type: UPDATE_ARTICLE,
                payload: err.response.data.msg,
            });
        })
};

export const getPublishedArticle = (data) => dispatch => {
    dispatch({type: SHOW_SPINNING, payload: true});
    axios
        .post(config.SIM_API_URL + "api/articles/get-published", data)
        .then(res => {
            console.log(res.data.msg);
            dispatch({type: SHOW_SPINNING, payload: false});
            dispatch({
                type: PUBLISHED_ALL,
                payload: res.data.results,
            });
        })
        .catch(err => {
            dispatch({type: SHOW_SPINNING, payload: false});
            console.log("Failed.", err.response.data.msg);
        })
};

export const getAllArticles = (data) => dispatch => {
    dispatch({type: SHOW_SPINNING, payload: true});
    axios
        .post(config.SIM_API_URL + "api/articles/get-all-articles", data)
        .then(res => {
            console.log(res.data.results);
            dispatch({type: SHOW_SPINNING, payload: false});
            dispatch({
                type: ARTICLES_ALL,
                payload: res.data.results,
            });
        })
        .catch(err => {
            dispatch({type: SHOW_SPINNING, payload: false});
            console.log("Failed.", err.response.data.msg);
        })
};

export const getArticleDetails = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/articles/edit-article", data)
        .then(res => {
            console.log(res.data.results);
            dispatch({
                type: ARTICLE_DETAILS,
                payload: res.data.results,
            });
        })
        .catch(err => {
            console.log("Failed.", err.response.data.msg);
        })
};

export const getArticleDetailsById = (data) => dispatch =>{
    axios
        .post(config.SIM_API_URL + "api/articles/get-article", data)
        .then(res => {
            console.log(res.data.results);
            dispatch({
                type: ARTICLE_DETAILS_DISPLAY,
                payload: res.data.results,
            });
        })
        .catch(err => {
            console.log("Getting of the article's details by Id failed.", err.response.data.msg);
        })
};

export const deleteArticle = (data) => dispatch => {
    dispatch({type: SHOW_SPINNING, payload: true});
    axios
        .post(config.SIM_API_URL + "api/articles/delete-article", data)
        .then(res => {
            console.log(res.data.msg);
            dispatch({type: SHOW_SPINNING, payload: false});
            dispatch({
                type: ARTICLE_DELETE,
                payload: res.data.msg,
            });
           window.location.href = '/published';
        })
        .catch(err => {
            dispatch({type: SHOW_SPINNING, payload: false});
            console.log("Deleting of the article failed.", err.response.data.msg);
            dispatch({
                type: ARTICLE_DELETE,
                payload: err.response.data.msg,
            });
        })
};

/**
 * Adding the category
 */
export const addCategory = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/articles/add-category", data)
        .then(res => {
            console.log(res.data.msg);
            dispatch({
                type: CATEGORY_ADD,
                payload: res.data.msg,
            });
        })
        .catch(err => {
            console.log("Adding the category failed.", err.response.data.msg);
            dispatch({
                type: CATEGORY_ADD,
                payload: err.response.data.msg,
            });
        })
};

/**
 * Deleting the category
 */
export const deleteCategory = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/articles/delete-category", data)
        .then(res => {
            console.log(res.data.msg);
            dispatch({
                type: CATEGORY_ADD,
                payload: res.data.msg,
            });
        })
        .catch(err => {
            console.log("Adding the category failed.", err.response.data.msg);
            dispatch({
                type: CATEGORY_ADD,
                payload: err.response.data.msg,
            });
        })
};

export const getListCategory = () => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/articles/get-category-list",)
        .then(res => {
            console.log(res.data.msg);
            dispatch({
                type: CATEGORY_LIST,
                payload: res.data.results,
            });
        })
        .catch(err => {
            console.log("Getting of the category list failed.", err.response.data.msg);
        })
};

/**
 * Getting the comments by article ID
 * @type {Router}
 */
export const getArticleCommentById = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/articles/get-comment", data)
        .then(res => {
            console.log(res.data.msg);
            dispatch({
                type: GET_COMMENT_BYID,
                payload: res.data.results,
            });
        })
        .catch(err => {
            console.log("Posting of the comment failed.", err.response.data.msg);
        })
};

/**
 * Notes
 */
export const postNotes = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/articles/post-notes", data)
        .then(res => {
            console.log("Post Success -> ", res.data.msg);
            dispatch({
                type: POST_NOTE,
                payload: res.data.msg,
            });

        })
        .catch(err => {
            console.log("Post Failed -> ", err.response.data.msg);
            dispatch({
                type: POST_NOTE,
                payload: err.response.data.msg,
            });
        })
};

export const getNotes = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/articles/get-notes", data)
        .then(res => {
            dispatch({
                type: GET_NOTE,
                payload: res.data.results,
            });
        })
        .catch(err => {
            dispatch({
                type: GET_NOTE,
                payload: err.response.data.msg,
            });
        })
};

export const getOneNote = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/articles/get-one-note", data)
        .then(res => {
            dispatch({
                type: GET_ONE_NOTE,
                payload: res.data.results,
            });
        })
        .catch(err => {
            dispatch({
                type: GET_ONE_NOTE,
                payload: err.response.data.msg,
            });
        })
};

export const updateNotes = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/articles/update-notes", data)
        .then(res => {
            dispatch({
                type: UPDATE_NOTE,
                payload: res.data.msg,
            });
        })
        .catch(err => {
            dispatch({
                type: UPDATE_NOTE,
                payload: err.response.data.msg,
            });
        })
};

export const deleteNotes = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/articles/delete-notes", data)
        .then(res => {
            dispatch({
                type: DELETE_NOTE,
                payload: res.data.msg,
            });
        })
        .catch(err => {
            dispatch({
                type: DELETE_NOTE,
                payload: err.response.data.msg,
            });
        })
};