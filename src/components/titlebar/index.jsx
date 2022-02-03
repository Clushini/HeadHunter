/* eslint-disable prettier/prettier */
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SettingsModal from './settings';
import Gear from '../../media/gear.png';
import Logo from '../../media/logo.png';
const { ipcRenderer, remote } = require('electron');

const TitleBar = ({socket}) => {
    const [showSettingsModal, setShowSettingsModal] = useState(false)
    const dispatch = useDispatch();
    const sessId = useSelector(state => state.mainState.POESESSID);
    const userData = useSelector(state => state.mainState.userData);
    // const isPremium = userData['http://localhost:4002/data/premium'];
    const isPremium = true;
    return (
        <div className="title_bar_wrap drag">
            <div className="title_bar_title_wrap">
                <img src={Logo} alt="Logo" />
                <div>Version: 1.0.1 BETA</div>
            </div>

            <div className="title_bar_controls">
                 {
                    isPremium && <>
                        <div className="ispremium_badge">
                            PREMIUM
                        </div>
                    </>
                 }
                <Button variant="contained" onClick={() => fetch("http://localhost:4002/logout")} className="no-drag">
                    Logout
                </Button>
                <Button variant="contained" onClick={() => setShowSettingsModal(true)} className="no-drag">
                    <img src={Gear} alt=""/>
                </Button>
                <Button variant="contained" className="no-drag" onClick={() => ipcRenderer.send('min-btn', 'ping')}>
                    🗕
                </Button>
                <Button variant="contained" className="no-drag" onClick={() => ipcRenderer.send('max-btn', 'ping')}>
                    🗖
                </Button>
                <Button variant="contained" className="no-drag" onClick={() => ipcRenderer.send('close-btn', 'ping')}>
                    🗙
                </Button>
            </div>
            <SettingsModal open={showSettingsModal} handleClose={() => setShowSettingsModal(false)} socket={socket}/>
        </div>
    )
}

export default TitleBar;
