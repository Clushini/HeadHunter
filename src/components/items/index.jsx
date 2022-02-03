/* eslint-disable no-restricted-syntax */
/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import Item from './item';
import { addHit, removeHit, removeAllHit, clearEveryHit } from '../../actions/index';

const Items = ({socket}) => {
    const [showNewSearch, setShowNewSearch] = useState(false);
    const liveSearches = useSelector(state => state.mainState.liveSearches);
    
    const dispatch = useDispatch();

    useEffect(() => {

    }, []);

    const clearHitsFromSpecificCode = (code) => {
        dispatch(removeAllHit(code));
    }

    const clearSpecificHit = (code, hit) => {
        const pkg = {
            code,
            hit
        }
        dispatch(removeHit(pkg));
    }

    const copyWhisper = (whisper) => {
        navigator.clipboard.writeText(whisper);
    }

    const clearAll = () => {
        dispatch(clearEveryHit(true));
    }

    return (
        <div className="livesearches_container_items">
            <div className="container_header">
                <h1>Results Feed</h1>
                <div>
                    <Button variant="contained" className="redbutton" onClick={() => clearAll()}>Clear All</Button>
                </div>
            </div>
            <div className="livesearches_container_items_wrap scroll4">
                {
                    Object.keys(liveSearches).map(code => {
                        return <div style={{marginBottom: "20px"}}>
                            <div className="livesearch_hit_header">
                                <div className="hit_title">
                                    <strong className={liveSearches[code].alive ? "hit_title_active" : "hit_title_inactive"}>{liveSearches[code].alive ? "ACTIVE" : "INACTIVE"}</strong>
                                    <div className="hit_title_text">{liveSearches[code].title}</div> <div className="hit_title_total">(<strong>Total: </strong>{liveSearches[code].hits.length})</div>
                                </div>
                                <Button variant="contained" className="clearhitsbutton" onClick={() => clearHitsFromSpecificCode(code)}>CLEAR ALL</Button>
                            </div>
                            {
                                liveSearches[code].hits.map(hit => {
                                    return <Item clearSpecificHit={clearSpecificHit} copyWhisper={copyWhisper} hit={hit} code={code}/>
                                })
                            }
                        </div>
                    })
                }
            </div>
        </div>
    )
}

export default Items;
