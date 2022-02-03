/* eslint-disable promise/always-return */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import NewSearchExample from '../../media/newsearchexample.png';

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

const NewSearchModal = ({open, handleClose, handleSubmit}) => {
    const [search, setSearch] = useState("");
    const [title, setTitle] = useState("");
    const [availableLeagues, setLeagues] = useState([]);
    const [selectedLeague, setSelectedLeague] = useState("");

    const sessId = useSelector(state => state.mainState.POESESSID);
    
    useEffect(() => {
        fetch(`http://localhost:4002/getLeagues/${sessId}`).then(response => {
            let res = response;
            return res.json();
        }).then((data) => {
            let leagues = [];
            data.leagues.map(league => {
                if (league.rules.length < 1) {
                    leagues.push(league.id);
                } else {
                    let noParties = false;
                    league.rules.map(rule => {
                        if (rule.id === "NoParties") noParties = true;
                    })
                    if (!noParties) leagues.push(league.id)
                }
            })
            setLeagues(leagues)
            setSelectedLeague(leagues[0]);
        }).catch(err => {
            throw err
        })
    }, [])

    const handleChange = (e) => {
        setSelectedLeague(e.target.value)
    }

    // console.log(availableLeagues)

    return (
        <div className="livesearches_container">
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Create New Live Search
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <img src={NewSearchExample} alt="newsearch"/>
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <TextField onChange={(e) => setTitle(e.target.value)} value={title} id="outlined-basic" label="Title" variant="outlined" style={{width: "100%"}}/>
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <Box sx={{ minWidth: 120 }}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">League</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectedLeague}
                                label="Leagues"
                                onChange={handleChange}
                            >
                                {
                                    availableLeagues.map(league => {
                                        return <MenuItem value={league}>{league}</MenuItem>
                                    })
                                }
                                </Select>
                            </FormControl>
                        </Box>
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }} style={{display: "flex", justifyContent: "space-between"}}>
                        <TextField onChange={(e) => setSearch(e.target.value)} value={search} id="outlined-basic" label="Search Code (ex: bylKMQzTL)" variant="outlined" style={{width: "33ch"}}/>
                        <Button variant="contained" style={{height: "55px"}} onClick={() => {handleSubmit(search, title, selectedLeague); setTitle(""); setSearch("")}}>Search</Button>
                    </Typography>
                </Box>
            </Modal>
        </div>
    )
}

export default NewSearchModal;
