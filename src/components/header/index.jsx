/* eslint-disable prettier/prettier */
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import SettingsModal from './settings';
import { updateSessionId } from '../../actions/index';
import Logo from '../../media/logo.png';
import Gear from '../../media/gear.png';

const Header = ({socket}) => {
    const [showSettingsModal, setShowSettingsModal] = useState(false)
    const dispatch = useDispatch();
    const sessId = useSelector(state => state.mainState.POESESSID);
    return (
        <div className="header_wrap">
            <div className="logo_wrap">
                <img src={Logo} alt="Logo" />
            </div>
            <div>
                <TextField 
                    onChange={(e) => dispatch(updateSessionId(e.target.value))} 
                    value={sessId} 
                    id="outlined-basic" 
                    label="POESESSID (Required)*" 
                    defaultValue={sessId}
                    variant="filled" 
                    style={{width: "27ch"}}
                    InputLabelProps={{ shrink: sessId ? true : false }}
                />
                <Button variant="contained" style={{height: "55px"}} onClick={() => setShowSettingsModal(true)}>
                    <img src={Gear} alt=""/>
                </Button>
            </div>

            <SettingsModal open={showSettingsModal} handleClose={() => setShowSettingsModal(false)} socket={socket}/>
        </div>
    )
}

export default Header;
