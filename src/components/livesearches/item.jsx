/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable prettier/prettier */
import Pause from '../../media/pause.png';
import Play from '../../media/play.png';
import Remove from '../../media/remove.png';

const LiveItem = ({data, num, handlePause, handleRemove, handlePlay}) => {
    const isLive = data.alive;
    console.log(data)
    return (
        <div className={isLive ? "livesearch_item_wrap" : "livesearch_item_wrap item_is_offline"}>
            <div className="livesearch_icon">
                <div className="livesearch_icon_number">#{num}</div>
                <div className="livesearch_icon_label">LIVE</div>
            </div>
            <div className="livesearch_item_information_wrap">
                <div className="livesearch_title">{data.title}</div>
                <div className="livesearch_code">{data.code}</div>
                <div className="livesearch_datestart">{new Date(data.startDate).toLocaleDateString()}</div>
                <div className="livesearch_timerunning">{new Date(data.startDate).toLocaleTimeString('en-US')}</div>
                <div className="livesearch_hits"><strong>{data.hits.length}</strong> hits</div>
                <div className="livesearch_controls">
                    {data.alive && <div onClick={() => handlePause(data.code, data.league)}><img src={Pause} alt="pause"/></div>}
                    {!data.alive && <div onClick={() => handlePlay(data.code, data.league)}><img src={Play} alt="pause"/></div>}
                    <div onClick={() => handleRemove(data.code, data.league)}><img src={Remove} alt="remove"/></div>
                </div>
            </div>
        </div>
    )
}

export default LiveItem;
