/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import Livesearches from '../livesearches/index';
import Items from '../items/index';

const LiveSearchManager = ({socket}) => {
    return (
        <div className="content_wrap">
            <Livesearches socket={socket}/>
            <Items socket={socket}/>
        </div>
    )
}

export default LiveSearchManager;
