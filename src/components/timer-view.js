import {
  html
} from '@polymer/lit-element';
import {
  PageViewElement
} from './page-view-element.js';
import {GestureEventListeners} from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import {
  SharedStyles
} from './shared-styles.js';
import {
  connect
} from 'pwa-helpers/connect-mixin.js';
import './timer-element.js';
import './dots-element.js';
import { NoSleep } from '../lib/NoSleep.js';

// This element is connected to the redux store.
import {
  store
} from '../store.js';

// These are the actions needed by this element.
import {
  decrement,
  startAnimations,
  startTimer,
  stopTimer,
  setTime,
  startWork,
  startBreak,
  transitionToWork,
  transitionToBreak
} from '../actions/timer.js';

import {
  logCompletedSession,
  incrementTodayCount,
  setTodayStart,
} from '../actions/logs.js';

class TimerView extends connect(store)(GestureEventListeners(PageViewElement)) {

  _render(props) {
    // console.log(props);
    const buttonText = (props._running) ? 'Stop' : 'Start';
    const mode = this._modeText(props._mode);
    const completed1 = '\u2022 \u2022 \u2022 \u2022 | \u2022 \u2022  \u2022';
    const completedString = `Completed: ${props._completed}`;
    const image = (props._mode === 'work' || props._mode === 'toWork') ? 'images/coffee.jpg' : 'images/succulent.jpg'
    const timerWidth = (400*this.scale) + 'px'
    const timerMinHeight = (300*this.scale) + 'px';

    const styleForEval = `html\`
      <style>
        section {
          display: flex;
          flex-direction: column;
          padding: 24px 0px 0px 0px;
          max-width: 400px;
          margin: auto;
        }
        img {
          position: relative;
          top: 0px;
        }
        timer-element {
          margin: auto;
          position:relative;
          width: ${timerWidth};
          height: 100%;
          min-height: ${timerMinHeight};
          overflow: hidden;
        }
        #completed-text {
          position: fixed;
          bottom: 30px;
          left: calc(50% - 40px);
          text-align: center;
          width: auto;
          color: var(--app-light-text-color);
          font-family: 'Nunito';
          font-weight: 400;
          font-size: 16px;
          max-width: 100vw;
        }
        h3 {
          font-family: 'Nunito';
          font-weight: 700;
          text-transform: lowercase;
          font-size: 20px;
        }
      </style>
    \``;
    const style = eval(styleForEval);

    return html`
      ${SharedStyles}
      ${style}
      <section class="${props._mode}">
      <h3>${mode}</h3>
      <timer-element 
        id="timer-element-${props._mode}"
        class=${props._mode}
        time="${props._time}"
        running="${props._running}"
        anim="${props._animate}"
        preAnim="${props._starting}"
        on-timer-decremented="${() => {
          store.dispatch(decrement());
        }}"
        mode="${props._mode}"
        on-transition="${() => this._transition()}"
        on-click="${() => this._toggleTimer()}"
      >
    </timer-element>
      <dots-element 
        completed=${props._completed}
      ></dots-element>
      <div id="completed-text">${completedString}</div>
      <audio id="looping" loop>
        <source src="sounds/ticktock.webm" type="audio/webm"/>
      </audio>
      <audio id="non-looping">
        <source src="sounds/pop.webm" type="audio/webm"/>
      </audio>
      </section>
    `;
  }

  static get properties() {
    return {
      // This is the data from the store.
      _time: Number,
      _running: Boolean,
      _animate: Boolean,
      _starting: Boolean,
      _mode: String,
      _completed: Number,
      _todayStart: Number,
    }
  }

  constructor() {
    super();
    var me = this;
    this.scale = Math.min(document.documentElement.clientWidth / 400, 1);
    this.nextSans = {
      work: 'break',
      toWork: 'work',
      break: 'work',
      toBreak: 'break'
    };
    this.nextAvec = {
      work: 'toBreak',
      break: 'toWork',
      toWork: 'work',
      toBreak: 'break'
    };
    this.mediaData = {
      work: {
        title: 'Working',
        album: 'tomato timer',
        artwork: [],
        // artwork: [
        //   { src: 'images/manifest/icon-96x96.png',   sizes: '96x96',   type: 'image/png' },
        //   { src: 'images/manifest/icon-96x96.png', sizes: '192x192', type: 'image/png' },
        //   { src: 'images/manifest/icon-512x512.png', sizes: '512x512', type: 'image/png' },
        // ]
      },
      break: {
        title: 'Relax',
        album: 'tomato timer',
        artwork: [],
        // artwork: [
        //   { src: 'images/manifest/icon-96x96.png',   sizes: '96x96',   type: 'image/png' },
        //   { src: 'images/manifest/icon-192x192.png', sizes: '192x192', type: 'image/png' },
        //   { src: 'images/manifest/icon-512x512.png', sizes: '512x512', type: 'image/png' },
        // ]
      },
      toWork: {
        title: 'Starting work session',
        album: 'tomato timer',
      },
      toBreak: {
        title: 'Starting break',
        album: 'tomato timer',
      }
    };
    this.noSleep = null;
    if ('mediaSession' in navigator) {
      this.mediaSessionData = new MediaMetadata({
        title: 'Working',
        album: 'tomato timer',
        artist: '25:00',
        artwork: [],
      });
      navigator.mediaSession.metadata = this.mediaSessionData;
      navigator.mediaSession.setActionHandler('play', function () {
        me._toggleTimer();
      });
      navigator.mediaSession.setActionHandler('pause', function () {
        me._toggleTimer();
      });
      navigator.mediaSession.setActionHandler('nexttrack', function () { 
        me._transition();
      });
      
    }
    if (
      navigator.userAgent.toLowerCase().indexOf('safari/') > -1 && 
      navigator.userAgent.toLowerCase().indexOf('chrome/') < 0) {
      this.audioFormat = 'aac';
      setTimeout(me._bindAudioEvents.bind(me), 500);
    } else {
      this.audioFormat = 'webm';
    }
   

    
    // var mediaSessionData = new MediaMetadata(this._getMediaData());
    // Gestures.addListener(this,'track', this._handleTrack.bind(this));
  }

  // These events are fired in iOS when the play and pause button are hit.
  _bindAudioEvents() {
    var me = this;
    try {
      const audio = this.shadowRoot.querySelector('audio#looping');
      audio.addEventListener('pause', (e) => {
        if (me._running) me._toggleTimer();
      });
      audio.addEventListener('play', (e) => {
        if (!me._running) me._toggleTimer();
      });
    } catch(err) {
      setTimeout(me._bindAudioEvents.bind(me), 500);
    }
    
    
  }

  _modeText(mode) {
    if (mode === 'work') {
      return 'Working';
    } else if (mode === 'break') {
      return 'Breaktime'
    } else if (mode === 'toWork') {
      return 'Starting work session...';
    } else if (mode === 'toBreak') {
      return 'Starting break';
    }
  }

  // This is called every time something is updated in the store.
  _stateChanged(state) {
    // console.log(state);
    const timeChange = (this._timer !== state.timer.time);
    const sleepChange = (this._preventSleep !== state.settings.preventSleep); 
    this._time = state.timer.time;
    this._running = state.timer.running;
    this._starting = state.timer.starting;
    this._mode = state.timer.mode;
    this._sound = state.settings.sound;
    this._transitions = state.settings.transitions;
    this._animate = state.settings.animations;
    this._completed = state.logs.today;
    this._todayStart = state.logs.todayStart;
    this._workLength = state.settings.workLength;
    this._breakLength = state.settings.breakLength;
    this._longBreakLength = state.settings.longBreakLength;
    this._preventSleep = state.settings.preventSleep;
    this._showMediaControls = state.settings.showMediaControls;
    if (state.settings.preventSleep && this.noSleep === null) {
      this.noSleep = new NoSleep();
    } else if (!state.settings.preventSleep && this.noSleep !== null) {
      this.noSleep = null;
    }
    if (timeChange) {
      this._updateMediaSession();
      if (this._running  && this._preventSleep && this._time % 60 === 0) this.noSleep.enable();
    }
    
    // console.log(this._completed);
    // console.log(state.logs);
    if (this._running && this._time === 0) this._transition();
  }

  _updateBackground() {
    
    if (this._tracking) {
      this.timerElement.style.backgroundPositionX = this._backgroundX + 'px';
      requestAnimationFrame(this._updateBackground.bind(this));
    }
  }

  _handleTrack(e) {
    
    switch(e.detail.state) {
      case 'start':
        this._tracking = true;
        this.timerElement = this.shadowRoot.querySelector(`timer-element`);
        requestAnimationFrame(this._updateBackground.bind(this));
        break;
      case 'track':
        const base = (this._mode === 'break') ? -400 : 0;
        this._backgroundX = Math.min(Math.max(-400, base + e.detail.dx), 0);
        break;
      case 'end':
        this._tracking = false;
        const selector = `#timer-element-${this._mode}`;
        const position = parseFloat(this.shadowRoot.querySelector(selector).style.backgroundPositionX.replace('px', ''));
        if (
          (this._mode === 'break' && position > -200) ||
          (this._mode === 'work' && position < -200)
        ) {
          const newid = (this._mode === 'work') ? 'timer-element-break' : 'timer-element-work';
          var el = this.shadowRoot.querySelector(selector);
          el.id = newid;
          el.removeAttribute('style');
          this._transition();
        } else {
          this.shadowRoot.querySelector(selector).removeAttribute('style');
        }
        
        break;
    }
  }

  _toggleTimer() {
    try {
      Notification.requestPermission((result) => {});
    } catch (err) {}
    if (this._running || this._starting) {
      if (this.noSleep) this.noSleep.disable();
      store.dispatch(stopTimer());
      this._playSounds();
    } else {
      if (this.noSleep) this.noSleep.enable();
      if (this._animate) {
        const me = this;
        store.dispatch(startAnimations());
        setTimeout(() => {
          if (me._starting) {
            store.dispatch(startTimer());
            me._playSounds();
            me._playSilentAlert();
          }
        }, 500);
      } else {
        store.dispatch(startTimer());
        this._playSounds();
        this._playSilentAlert();
      }
      
    }
  }

  _stopSounds() {
    const audio = this.shadowRoot.querySelector('audio#looping');
    audio.pause();
  }

  _silenceSounds() {
    const audio = this.shadowRoot.querySelector('audio#looping');
    audio.volume = 0;
  }

  _getMediaData() {
    const mediaData = this.mediaData[this._mode];
    mediaData.artist = this._textTime(this._time);
    return mediaData;
  }

  _updateMediaSession() {
    if (!this._mode) return;
    if (this.audioFormat === 'aac' && this.shadowRoot) { // iOS
      const audio = this.shadowRoot.querySelector('audio#looping');
      if (!audio) return;
      audio.title = (this._mode === 'work') ? 'Working - ' + this._textTime(this._time) : 'Relax - ' + this._textTime(this._time);
      if (this._running && this._sound.enabled) audio.play();
    }
    if (!('mediaSession' in navigator)) return;
    this.mediaSessionData.title = (this._mode === 'work') ? 'Working' : 'Relax';
    this.mediaSessionData.artist = this._textTime(this._time);
  }

  _playSounds() {
    const MS = ('mediaSession' in navigator);
    const me = this;
    const audio = this.shadowRoot.querySelector('audio#looping');
    if (!this._sound.enabled && !this._showMediaControls) {
      audio.pause();
      return;
    }
    if (this._running) {
      if (this._mode === 'work') {
        if (!this._sound.working && !this._showMediaControls) {
          audio.pause();
          return;
        }
        if (!audio.src.match(/ticktock/)) {
          audio.src = 'sounds/ticktock.' + this.audioFormat;
          audio.title = 'Work';
          audio.playbackRate = 1;
        }
        audio.volume = (this._sound.enabled && this._sound.working) ? 1 : 0;
        audio.play()
          .then(_ => me._updateMediaSession())
          .catch(error => {
            console.log(error)
          });
      } else if (this._mode === 'break') {
        if (!this._sound.break && !this._showMediaControls) {
          audio.pause();
          return;
        }
        if (!audio.src.match(/birds\./)) {
          audio.src = 'sounds/birds.' + this.audioFormat;
          audio.title = 'Relax';
          audio.playbackRate = 1;
        }
        audio.volume = (this._sound.enabled && this._sound.break) ? 1 : 0;
        audio.play()
          .then(_ => me._updateMediaSession())
          .catch(error => {
            console.log(error)
          });
      }
    } else {
      audio.pause();
    }
  }

  // On iOS, the audio element has to be played at least once in response to a touch event.
  _playSilentAlert() {
    if (this.audioFormat === 'webm' || this._didPlaySilentAlert) return;
    const audio = this.shadowRoot.querySelector('audio#non-looping');
    audio.src = 'sounds/silence.aac';
    audio.play();
    this._didPlaySilentAlert = true;
  }

  _playAlert() {
    const MS = ('mediaSession' in navigator);
    const me = this;
    const audio = this.shadowRoot.querySelector('audio#non-looping');
    if (!this._sound.enabled) {
      audio.pause();
      return;
    }
    if (this._mode === 'work') {
      if (!this._sound.workEnd) {
        audio.pause();
        return;
      }
      if (!audio.src.match(/pop\./)) {
        if (me.audioFormat === 'aac') audio.title = 'Time for a break!';
        audio.src = 'sounds/pop.' + me.audioFormat;
      }
    } else if (this._mode === 'break') {
      if (!this._sound.breakEnd) {
        audio.pause();
        return;
      }
      if (!audio.src.match(/ring\./)) {
        if (me.audioFormat === 'aac') audio.title = 'Time to work!';
        audio.src = 'sounds/ring.' + me.audioFormat;
      }
    }
    audio.play()
      .then(_ => { /* nothing */ })
      .catch(error => {
        console.log(error)
      });
  }

  _requestPermission() {
    if (!('Notification' in window)) {
      console.log('Notification API not supported!');
      return;
    }

    Notification.requestPermission(function (result) {});
  }

  _nonPersistentNotification() {
    if (!('Notification' in window)) {
      console.log('Notification API not supported!');
      return;
    }

    try {
      var notification = new Notification("Hi there - non-persistent!");
    } catch (err) {
      console.log('Notification API error: ' + err);
    }
  }

  _persistentNotification() {
    if (!('Notification' in window) || !('ServiceWorkerRegistration' in window)) {
      console.log('Persistent Notification API not supported!');
      return;
    }

    try {
      navigator.serviceWorker.getRegistration()
        .then(reg => reg.showNotification("Hi there - persistent!"))
        .then(notificationEvent => {
          let notification = notificationEvent.notification;
          setTimeout(() => notification.close(), 5000);
        })
        .catch(err => console.log('Service Worker registration error: ' + err));
    } catch (err) {
      console.log('Notification API error: ' + err);
    }
  }

  _getNextMode() {
    const current = this.currentMode;
  }

  _transition() {
    const me = this;
    // End current mode
    switch (this._mode) {
      case 'work':
        if (this._transitions) {
          this._silenceSounds();
        } else {
          this._stopSounds();
        }
        store.dispatch(stopTimer());
        if (this._time === 0) {
          this._notify('Time for a break!');
          this._playAlert();
          gtag('event', 'completed', {
            'event_category': 'timer_work', 
            'event_label': Math.round(this._workLength / 60) + ' min.',
            'value': this._workLength,
            'non_interaction': true
          });
          if (Date.now() - this._todayStart > 86400000) store.dispatch(setTodayStart());
          store.dispatch(incrementTodayCount());
          store.dispatch(logCompletedSession());
        }
        break;
      case 'break':
        if (this._transitions) {
          this._silenceSounds();
        } else {
          this._stopSounds();
        }
        
        if (this._time === 0) {
          this._notify('Time to work!');
          this._playAlert();
          gtag('event', 'completed', {
            'event_category': 'timer_break', 
            'event_label': Math.round(this._breakLength / 60) + ' min.',
            'value': this._breakLength,
            'non_interaction': true
          });
        }
        store.dispatch(stopTimer());
        break;
      default:
        break;
    }
    // Start next mode;
    // const nextMode = (this._transitions) ? this.nextAvec[this._mode] : this.nextSans[this._mode];
    const nextMode = this.nextSans[this._mode];
    const startAgain = me._toggleTimer.bind(me);
    switch (nextMode) {
      case 'work':
        setTimeout(() => {
          store.dispatch(setTime(me._workLength));
          store.dispatch(startWork());
          if (me._transitions) {
            startAgain();
          }
        }, (me._transitions) ? 1000 : 2000);
        break;
      case 'break':
        setTimeout(() => {
          if (me._completed > 0 && me._completed % 4 === 0) {
            store.dispatch(setTime(me._longBreakLength));
          } else {
            store.dispatch(setTime(me._breakLength));
          }
         
          store.dispatch(startBreak());
          if (me._transitions) {
            startAgain();
          }
        }, (me._transitions) ? 1000 : 2000);
        break;
      case 'toBreak':
        store.dispatch(setTime(5));
        store.dispatch(transitionToBreak());
        me._updateMediaSession();
        setTimeout(startAgain, 1000);
        
        break;
      case 'toWork':
        store.dispatch(setTime(5));
        store.dispatch(transitionToWork());
        me._updateMediaSession();
        setTimeout(startAgain, 1000);
        break;
      default:
        break;
    }
  }

  _textTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const secondsString = (seconds < 10) ? `0${seconds}` : `${seconds}`;
    const minutesString = (minutes < 10) ? ` ${minutes}` : `${minutes}`;
    // console.log(`${minutesString}:${secondsString}`);
    return `${minutesString}:${secondsString}`;
  }

  _notify(message) {
    if (!('Notification' in window)) {
      console.log('Notification API not supported!');
      return;
    }

    try {
      navigator.serviceWorker.getRegistration()
        .then(reg => reg.showNotification(message))
        .catch(err => console.log('Service Worker registration error: ' + err));

      setTimeout(() => {
        navigator.serviceWorker.getRegistration()
          .then(reg => reg.getNotifications())
          .then(notifications => {
            console.log('notifications!', notifications);
            notifications.forEach(notification => notification.close());
          })
          .catch(err => console.log('Service Worker registration error: ' + err));
      }, 4000);
    } catch (err) {
      console.log('Notification API error: ' + err);
    }
  }
}

window.customElements.define('timer-view', TimerView);