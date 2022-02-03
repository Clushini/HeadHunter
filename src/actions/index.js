/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable import/prefer-default-export */

export const addLiveSearch = (data) => ({
    type: "ADD_LIVE_SEARCH",
    payload: data
})

export const setSearchActive = (data) => ({
    type: "SET_SEARCH_ACTIVE",
    payload: data
})

export const setSearchInactive = (data) => ({
    type: "SET_SEARCH_INACTIVE",
    payload: data
})

export const removeSearch = (data) => ({
    type: "REMOVE_SEARCH",
    payload: data
})

export const updateSessionId = (data) => ({
    type: "UPDATE_SESSION_ID",
    payload: data
})

export const updateSetting = (data) => ({
    type: "UPDATE_SETTING",
    payload: data
})

export const addHit = (data) => ({
    type: "ADD_HIT",
    payload: data
})

export const removeHit = (data) => ({
    type: "REMOVE_HIT",
    payload: data
})

export const removeAllHit = (data) => ({
    type: "REMOVE_ALL_HITS",
    payload: data
})

export const clearEveryHit = (data) => ({
    type: "REMOVE_EVERY_HIT",
    payload: data
})

export const updateSocket = (data) => ({
    type: "UPDATE_SOCKET",
    payload: data
})

export const setInitialState = (data) => ({
    type: "SET_INITIAL_STATE",
    payload: data
})

export const updateCurrentTab = (data) => ({
    type: "SET_CURRENT_TAB",
    payload: data
})

export const updateAccessKey = (data) => ({
    type: "SET_UPDATE_ACCESS_KEY",
    payload: data
})