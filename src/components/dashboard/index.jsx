/* eslint-disable no-restricted-syntax */
/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import { useState, useEffect, forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import Skull from '../../media/skull.png';
import Live from '../../media/live.png';
import Recipe from '../../media/recipe.png';
import Code from '../../media/code.png';
import { updateCurrentTab } from '../../actions/index';

const Dashboard = (props) => {
    const settings = useSelector(state => state.mainState.settings);
    const currentTab = useSelector(state => state.mainState.currentTab);
    const dispatch = useDispatch();

    return(
        <div className="dashboard">
            <div className="dashboard_logo_wrap">
                <img src={Skull} alt="headhunter logo" />
            </div>
            <div className="dashboard_buttons_wrap">
                <Button variant="contained" className={currentTab === "livesearchmanager" ? "button_purple_active" : ""} onClick={() => dispatch(updateCurrentTab("livesearchmanager"))}>
                    <img src={Live} alt="Livesearch"/>
                </Button>
                <Button variant="contained" className={currentTab === "1" ? "button_red_active" : "button_grey"} disabled={true}>
                    <img src={Recipe} alt="Recipe"/>
                </Button>
                <Button variant="contained" className={currentTab === "2" ? "button_green_active" : "button_grey"} disabled={true}>
                    <img src={Code} alt="Recipe"/>
                </Button>
            </div>
        </div>
    );
}

export default Dashboard;