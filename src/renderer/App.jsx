/* eslint-disable prettier/prettier */
import './App.scss';
import io from "socket.io-client";
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Header from '../components/header';
import LiveSearchManager from '../components/LiveSearchManager';
import TitleBar from '../components/titlebar';
import Dashboard from '../components/dashboard';
import { updateSocket, setInitialState } from '../actions/index';
import store from './store';
import { json } from 'stream/consumers';

const newSocket = io(`http://localhost:4001`);

setInterval(() => {
  const state = store.getState();
  const mainState = state.mainState;
  newSocket.emit("saveState", JSON.stringify(mainState));
}, 3000)

const App = () => {
  const [showSnack, setShowSnack] = useState(false)
  const [snackItem, setSnackItem] = useState({})
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const liveSearches = useSelector(state => state.mainState.liveSearches);
  const settings = useSelector(state => state.mainState.settings);
  const sessid = useSelector(state => state.mainState.POESESSID);
  const currentTab = useSelector(state => state.mainState.currentTab);
  const mainState = useSelector(state => state.mainState);
  const dispatch = useDispatch();

  useEffect(() => {
    fetch("http://localhost:4002/cookies")
    newSocket.on("setInitialState", (data) => {
      if (Object.keys(data.userData).length === 0) {
        fetch("http://localhost:4002/logout")
      }
      else {
        setIsLoggedIn(true)
      }
      let copyData = {...data};
      Object.keys(copyData.liveSearches).map(code => {
        copyData.liveSearches[code].alive = false;
      })
      dispatch(setInitialState(copyData))
    })

    newSocket.on("resultFound", (code, itemData) => {
      const item = itemData.result[0];
      const snack = {
        code,
        display: item.listing.price ? `${item.listing.price.type}${item.listing.price.amount} ${item.listing.price.currency}` : `No Price`,
        whisper: item.listing.whisper
      }
      setSnackItem(snack);
      setShowSnack(true);
    })
  }, []);

  useEffect(() => {
    dispatch(updateSocket(newSocket));
  }, [])

  const snackLogic = (val) => {
    setShowSnack(val);
  }

  const snackWhisper = () => {
    navigator.clipboard.writeText(snackItem.whisper);
    setShowSnack(false)
    setSnackItem({})
  }

  const action = (
    <>
      <Button color="secondary" size="small" onClick={() => snackWhisper()}>
        Whisper
      </Button>
    </>
  );

  const getTitleFromCode = (code) => {
    let title = "";
    Object.keys(liveSearches).map(search => {
      if (liveSearches[search].code === code) {
        title = liveSearches[search].title
      }
    })
    return title;
  }

  console.log(mainState);

  return (
    <>
    {
      isLoggedIn && <>
      <Dashboard />
      <div className="main_wrap">
        <TitleBar socket={newSocket}/>
        {/* <Header socket={newSocket}/> */}
        {(sessid && currentTab === "livesearchmanager") && <LiveSearchManager socket={newSocket}/>}
        {!sessid && <div className="sessid_splash"><h1>Please click the gear icon to enter your POESESSID above.</h1></div>}
        {
          settings.notifications.value && <Snackbar
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              open={showSnack}
              onClose={() => snackLogic(false)}
              autoHideDuration={3000}
              message={`(${getTitleFromCode(snackItem.code)}) - ${snackItem.display}`}
              action={action}
            />
        }
      </div>
      </>
    }
    </>
  );
};

export default App;
