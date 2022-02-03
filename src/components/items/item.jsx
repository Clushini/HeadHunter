/* eslint-disable no-restricted-syntax */
/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import { useState, useEffect, forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Whisper from '../../media/whisper.png';
import Remove from '../../media/remove.png';
import { addHit, removeHit, removeAllHit, clearEveryHit } from '../../actions/index';

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Item = (props) => {
    const [showSnack, setShowSnack] = useState(false)
    const [isHovered, setisHovered] = useState(false);
    const settings = useSelector(state => state.mainState.settings);
    const hit = props.hit;
    const code = props.code;

    const snackLogic = (val) => {
        setShowSnack(val);
    }


    return(
        <div className="livesearch_hit_wrap" onMouseEnter={() => setisHovered(true)} onMouseLeave={() => setisHovered(false)}>
            <div style={{display: "flex", width: "100%"}}>
                <img src={hit.item.icon} alt={hit.item.name}/>
                <div className="hit_name">{hit.item.name && hit.item.name} {hit.item.baseType && hit.item.baseType}</div>
                <div className="hit_price">{hit.listing.price ? `${hit.listing.price.type} ${hit.listing.price.amount} ${hit.listing.price.currency}` : "No Price"}</div>
            </div>
            {
                isHovered && <div className="hit_controls" style={{display: "flex"}}>
                    <div onClick={() => {props.copyWhisper(hit.listing.whisper); setShowSnack(true)}}>
                        <img src={Whisper} alt="whisper" />
                    </div>
                    <div onClick={() => props.clearSpecificHit(code, hit)}>
                        <img src={Remove} alt="remove" />
                    </div>

                    {/* <Button variant="contained" className="clearhitbutton" onClick={() => props.clearSpecificHit(code, hit)}>CLEAR</Button>
                    <Button variant="contained" className="whisperhitbutton" onClick={() => props.copyWhisper(hit.listing.whisper)}>WHISPER</Button> */}
                </div>
            }
            {
                settings.notifications.value && <Snackbar
                    anchorOrigin={{ vertical: "bottom", horizontal: "middle" }}
                    open={showSnack}
                    onClose={() => snackLogic(false)}
                    autoHideDuration={1000}
                >
                    <Alert onClose={() => setShowSnack(true)} severity="success" sx={{ width: '30%' }}>
                        Whisper copied to clipboard!
                    </Alert>
                </Snackbar>
            }
        </div>
    );
}

export default Item;