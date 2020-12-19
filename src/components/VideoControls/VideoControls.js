import React, { useEffect, useState, useRef } from 'react';
import playIcon from '../../play.svg';
import speakerIcon from '../../volume-up.svg';
import fullscreenIcon from '../../expand.svg';
import disableFullscreenIcon from '../../compress.svg';
import pauseIcon from '../../pause.svg';
import mutedIcon from '../../volume-mute.svg';
import { secondsToTime } from '../CustomVideoControls/time';
import './VideoControls.css';

const VideoControls = (props) => {
  const { video, videoContainer } = props;
  const [pausePlayIcon, setPauseplayIcon] = useState(pauseIcon);
  const [muteUnmuteIcon, setMuteUnmuteIcon] = useState(speakerIcon);
  const [
    enableDisableFullscreenIcon,
    setEnableDisableFullscreenIcon,
  ] = useState(fullscreenIcon);
  const [totalDuration, setTotalDuration] = useState(secondsToTime(0));
  const [realTime, setRealTime] = useState(secondsToTime(0));

  const progress = useRef(null);
  const volumeSlider = useRef(null);
  const seek = useRef(null);
  const controls = useRef(null);

  useEffect(() => {
    video.addEventListener('loadedmetadata', () => {
      setTotalDuration(secondsToTime(video.duration));
    });
    video.addEventListener('timeupdate', () => {
      setRealTime(secondsToTime(video.currentTime));
      const progressWidth = (video.currentTime / video.duration) * 100;
      progress.current.style.width = `${progressWidth}%`;
    });
    video.addEventListener('ended', () => {
      setPauseplayIcon(playIcon);
    });
    video.addEventListener('click', () => {
      playVideo();
    });
    videoContainer.addEventListener('mouseout', () => { 
      if (document.fullscreenElement === null){
        hideControls();
      }
    });
    videoContainer.addEventListener('mousemove', () => {
        showControls();
        setTimeout(hideControls, 10000);
    })
   
  }, [video]);

  const showControls = () => {
    controls.current.classList.remove('hide');
  };

  const hideControls = () => {
    controls.current.classList.add('hide');
  };

  const playVideo = () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
    setPauseplayIcon(video.paused ? playIcon : pauseIcon);
  };

  const muteVideo = () => {
    video.muted = !video.muted;
    setMuteUnmuteIcon(video.muted ? mutedIcon : speakerIcon);
  };

  const volumeChange = () => {
    video.volume = volumeSlider.current.value / 1;
    setMuteUnmuteIcon(video.volume === 0 ? mutedIcon : speakerIcon);
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement === null) {
      videoContainer.requestFullscreen();
      controls.current.style.top = '90%';
    } else {
      document.exitFullscreen();
      controls.current.style.top = '';
    }
    setEnableDisableFullscreenIcon(
      document.fullscreenElement ? fullscreenIcon : disableFullscreenIcon
    );
  };

  const scrub = (e) => {
    const seekPercentage =
      (e.nativeEvent.offsetX / seek.current.offsetWidth) * 100;
    video.currentTime = (video.duration * seekPercentage) / 100;
  };

  return (
    <div>
      <div className='controls hide' ref={controls} >
        <div className='progress-bar' onClick={scrub} ref={seek}>
          <div className='progress-fill' ref={progress}></div>
        </div>
        <div className='controls-grid'>
          <div className='time'>
            {realTime} / {totalDuration}
          </div>
          <button onClick={playVideo} className='control-button'>
            <img
              src={pausePlayIcon}
              width='15px'
              alt='play'
              className='click'
            />
          </button>
          <button onClick={muteVideo} className='control-button'>
            <img
              src={muteUnmuteIcon}
              width='20px'
              alt='mute'
              className='click'
            />
          </button>
          <input
            type='range'
            ref={volumeSlider}
            className='volume'
            min={0}
            max={1}
            step='0.1'
            defaultValue={1}
            onChange={volumeChange}
          />
          <button onClick={toggleFullscreen} className='control-button'>
            <img
              src={enableDisableFullscreenIcon}
              width='16px'
              alt='fullscreen'
              className='click'
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoControls;
