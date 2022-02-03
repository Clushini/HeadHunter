/* eslint-disable no-restricted-syntax */
/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import LiveItem from './item';
import Column from './column';
import NewSearchModal from './newsearch';
import { addLiveSearch, setSearchActive, setSearchInactive, removeSearch, updateSetting, addHit } from '../../actions/index';

const Livesearches = ({socket}) => {
    const [showNewSearch, setShowNewSearch] = useState(false);
    const liveSearches = useSelector(state => state.mainState.liveSearches);
    const POESESSID = useSelector(state => state.mainState.POESESSID);
    
    const dispatch = useDispatch();

    useEffect(() => {
        socket.on("opened", (code, league) => {
            const pkg = {
                code, league
            }
            dispatch(setSearchActive(pkg))
        })
    
        socket.on("closed", (code) => {
            dispatch(setSearchInactive(code))
        })

        socket.on("updateSetting", (setting, value) => {
            dispatch(updateSetting({setting, value}))
        })

        socket.on("resultFound", (code, itemData) => {
            const item = itemData.result[0];
            const pkg = {
                code,
                result: item
            }
            dispatch(addHit(pkg));
        })

        socket.emit("getDefaultSettings");
    }, []);

    const handleSubmission = (code, title, league) => {
        const pkg = { code, title, league }
        dispatch(addLiveSearch(pkg))
        socket.emit("stream", code, "start", POESESSID, league);
        setShowNewSearch(false);
    } 

    const stopAllSearches = () => {
        for (const [key, value] of Object.entries(liveSearches)) {
            socket.emit("stream", key, "stop");
        }
    }

    const getCount = () => {
        let count = 0;
        for (const [key, value] of Object.entries(liveSearches)) {
            if (liveSearches[key].alive) {
                count += 1;
            }
        }
        return count;
    }

    const handleRemove = (code, league) => {
        socket.emit("stream", code, "stop", POESESSID, league);
        dispatch(removeSearch(code));
    }

    const handlePause = (code, league) => {
        socket.emit("stream", code, "stop", POESESSID, league);
    }
    
    const handlePlay = (code, league) => {
        socket.emit("stream", code, "start", POESESSID, league);
    }

    return (
        <div className="livesearches_container">
            <NewSearchModal handleSubmit={handleSubmission} open={showNewSearch} handleClose={() => setShowNewSearch(false)}/>
            <div className="container_header">
                <h1>Live Searches <strong>({getCount()} Running)</strong></h1>
                <div>
                    <Button variant="contained" className="greenbutton" onClick={() => setShowNewSearch(true)}>+ New Search</Button>
                    <Button variant="contained" className="redbutton" onClick={() => stopAllSearches()}>Stop All</Button>
                </div>
            </div>
            <div className="livesearches_item_container scroll4">
                <Column />
                {
                    Object.keys(liveSearches).map((key, index) => {
                        return <LiveItem data={liveSearches[key]} num={index + 1} handlePause={handlePause} handlePlay={handlePlay} handleRemove={handleRemove}/>
                    })
                }
            </div>
        </div>
    )
}

export default Livesearches;
