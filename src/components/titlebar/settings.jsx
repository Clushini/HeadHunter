/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { updateSessionId, updateAccessKey } from '../../actions/index';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 395,
    bgcolor: 'rgb(255, 2555, 255)',
    borderRadius: "10px",
    boxShadow: 24,
    color: "#0c0b1a",
    p: 4,
};

const SettingsModal = ({open, handleClose, handleSubmit, socket}) => {
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const dispatch = useDispatch();
    const sessId = useSelector(state => state.mainState.POESESSID);
    const accessKey = useSelector(state => state.mainState.accessKey);
    const settings = useSelector(state => state.mainState.settings);
    const updateSetting = (value, setting, isPremium) => {
        socket.emit("updateSetting", setting, value, isPremium);
    } 

    return (
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    General Settings
                </Typography>

                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    <TextField 
                        onChange={(e) => dispatch(updateSessionId(e.target.value))} 
                        value={sessId} 
                        id="outlined-basic" 
                        label="POESESSID (Required)*" 
                        defaultValue={sessId}
                        variant="filled" 
                        style={{width: "44ch"}}
                        InputLabelProps={{ shrink: sessId ? true : false }}
                    />
                </Typography>

                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    {Object.keys(settings).map(setting => {
                        return  <div className="setting_wrap">
                                    {settings[setting].display}
                                    <Switch
                                        checked={settings[setting].value}
                                        onChange={(e) => updateSetting(e.target.checked, setting, settings[setting].premium)}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                    />
                                </div>
                    })}
                </Typography>
            </Box>
        </Modal>
    )
}

export default SettingsModal;
