/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable prefer-const */
/* eslint-disable no-case-declarations */
/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable import/prefer-default-export */

export const mainState = (state = {
    liveSearches: {},
    POESESSID: null,
    accessKey: null,
    settings: {
        autoClipboard: {value: false, display: "Auto-copy to clipboard (Premium)", premium: true},
        notifications: {value: false, display: "Show Notifications", premium: false},
        sounds: {value: true, display: "Play Sounds *Coming Soon*", premium: false},
    },
    currentTab: "livesearchmanager",
    userData: {}
}, action) => {
    switch(action.type) {
        case "SET_INITIAL_STATE": {
            let copyState = {...state, ...action.payload};
            return {
                ...state, ...copyState
            }
        }
        case "SET_CURRENT_TAB": {
            let copyState = {...state, currentTab: action.payload};
            return {
                ...state, ...copyState
            }
        }
        case "ADD_LIVE_SEARCH": {
            let copyState = {...state};
            let copyLiveSearches = {...copyState.liveSearches};
            copyLiveSearches[action.payload.code] = {
                title: action.payload.title,
                code: action.payload.code,
                league: action.payload.league,
                startDate: new Date(),
                alive: false,
                hits: []
            }
            return {
                ...state, liveSearches: {...copyLiveSearches}
            }
        }
        case "ADD_HIT": {
            let copyState = {...state};
            let copyLiveSearches = {...copyState.liveSearches};
            copyLiveSearches[action.payload.code].hits.unshift(action.payload.result)
            return {
                ...state, liveSearches: {...copyLiveSearches}
            }
        }
        case "REMOVE_HIT": {
            let copyState = {...state};
            let copyLiveSearches = {...copyState.liveSearches};
            let indexOf = 0;
            copyLiveSearches[action.payload.code].hits.map((hit, index) => {
                if (hit.id === action.payload.hit.id) {
                    indexOf = index;
                }
            })
            copyLiveSearches[action.payload.code].hits.splice(indexOf, 1);
            return {
                ...state, liveSearches: {...copyLiveSearches}
            }
        }
        case "REMOVE_EVERY_HIT": {
            let copyState = {...state};
            let copyLiveSearches = {...copyState.liveSearches};
            Object.keys(copyLiveSearches).map(code => {
                copyLiveSearches[code].hits = [];
                return true;
            })
            return {
                ...state, liveSearches: {...copyLiveSearches}
            }
        }
        case "REMOVE_ALL_HITS": {
            let copyState = {...state};
            let copyLiveSearches = {...copyState.liveSearches};
            copyLiveSearches[action.payload].hits = [];
            return {
                ...state, liveSearches: {...copyLiveSearches}
            }
        }
        case "SET_SEARCH_ACTIVE": {
            let copyState = {...state};
            let copyLiveSearches = {...copyState.liveSearches};
            if (copyLiveSearches[action.payload.code]) {
                copyLiveSearches[action.payload.code].alive = true;
            }
            return {
                ...state, liveSearches: {...copyLiveSearches}
            }
        }
        case "SET_SEARCH_INACTIVE": {
            let copyState = {...state};
            let copyLiveSearches = {...copyState.liveSearches};
            if (copyLiveSearches[action.payload]) {
                copyLiveSearches[action.payload].alive = false;
            }
            return {
                ...state, liveSearches: {...copyLiveSearches}
            }
        }
        case "REMOVE_SEARCH": {
            let copyState = {...state};
            let copyLiveSearches = {...copyState.liveSearches};
            delete copyLiveSearches[action.payload];
            return {
                ...state, liveSearches: {...copyLiveSearches}
            }
        }
        case "UPDATE_SESSION_ID": {
            let copyState = {...state};
            let copySessId = copyState.POESESSID;
            copySessId = action.payload;
            return { ...state, POESESSID: copySessId }
        }
        case "SET_UPDATE_ACCESS_KEY": {
            let copyState = {...state};
            let copyAccessKey = copyState.accessKey;
            copyAccessKey = action.payload;
            return { ...state, accessKey: copyAccessKey }
        }
        case "UPDATE_SETTING": {
            let copyState = {...state};
            let copySettings = {...copyState.settings};
            copySettings[action.payload.setting].value = action.payload.value;
            return { ...state, settings: copySettings }
        }
        default:
            return state
    }
}