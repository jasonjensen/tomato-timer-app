import { html } from '@polymer/lit-element';
import { PageViewElement } from './page-view-element.js';
import { SharedStyles } from './shared-styles.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import './toggle-element.js';
import './slider-element.js';
import { ToggleStyles } from './toggle-styles.js';

// This element is connected to the redux store.
import { store } from '../store.js';

// These are the actions needed by this element.
import { toggleSound, toggleSoundWorking, toggleSoundBreak, toggleSoundWorkEnd, toggleSoundBreakEnd, toggleTransitions, toggleAnimations, toggleSleepSetting, toggleMediaControls, setWorkLength, setBreakLength, setLongBreakLength } from '../actions/settings.js';

class SettingsView extends connect(store)(PageViewElement) {
  
  _render(props) {
    return html`
      ${SharedStyles}
      ${ToggleStyles}
      <style>
      h3 {
        font-family: 'Nunito';
        font-weight: 700;
        text-transform: lowercase;
        font-size: 20px;
        text-align: center;
        color: var(--app-dark-text-color);
      }
      section {
        margin-bottom: 30px;
      }
    </style>
      <section>
      <h3>Settings</h3>
      <toggle-element 
        label="Sounds"
        checked="${props._sound.enabled}"
        on-toggle-changed="${() => store.dispatch(toggleSound())}"
      ></toggle-element>
      <toggle-element 
        subId="soundWork"
        label="   While working"
        disabled="${!props._sound.enabled}"
        checked="${props._sound.working}"
        on-toggle-changed="${() => store.dispatch(toggleSoundWorking())}"
      ></toggle-element>
      <toggle-element 
        subId="soundBreak"
        label="   During a break"
        disabled="${!props._sound.enabled}"
        checked="${props._sound.break}"
        on-toggle-changed="${() => store.dispatch(toggleSoundBreak())}"
      ></toggle-element>
      <toggle-element 
        subId="soundWorkEnd"
        label="   At the end of work"
        disabled="${!props._sound.enabled}"
        checked="${props._sound.workEnd}"
        on-toggle-changed="${() => store.dispatch(toggleSoundWorkEnd())}"
      ></toggle-element>
      <toggle-element 
        subId="soundBreakEnd"
        label="   At the end of a break"
        disabled="${!props._sound.enabled}"
        checked="${props._sound.breakEnd}"
        on-toggle-changed="${() => store.dispatch(toggleSoundBreakEnd())}"
      ></toggle-element>
      <toggle-element 
        label="Transition automatically"
        checked="${props._transitions}"
        on-toggle-changed="${() => store.dispatch(toggleTransitions())}"
      ></toggle-element>
      <toggle-element 
        label="Animations"
        checked="${props._animations}"
        on-toggle-changed="${() => store.dispatch(toggleAnimations())}"
      ></toggle-element>
      <toggle-element 
        label="Always show media controls"
        checked="${props._showMediaControls}"
        on-toggle-changed="${() => store.dispatch(toggleMediaControls())}"
        ></toggle-element>
      <toggle-element 
        label="Prevent sleep"
        checked="${props._preventSleep}"
        on-toggle-changed="${() => store.dispatch(toggleSleepSetting())}"
      ></toggle-element>
      <slider-element 
        label="Work length"
        value="${props._workLength}"
        on-value-changed="${(e) => store.dispatch(setWorkLength(e.detail.value * 60))}"
      ></slider-element>
      <slider-element 
        label="Break length"
        value="${props._breakLength}"
        on-value-changed="${(e) => store.dispatch(setBreakLength(e.detail.value * 60))}"
      ></slider-element>
      <slider-element 
        label="Long break"
        value="${props._longBreakLength}"
        on-value-changed="${(e) => store.dispatch(setLongBreakLength(e.detail.value * 60))}"
      ></slider-element>
      </section>
    `;
  }

  static get properties() { return {
    // This is the data from the store.
    _sound: Object,
    _transitions: Boolean,
    _animations: Boolean,
    _preventSleep: Boolean,
    _showMediaControls: Boolean,
    _workLength: Number,
    _breakLength: Number,
    _longBreakLength: Number,
  }}

  // This is called every time something is updated in the store.
  _stateChanged(state) {
    this._sound = state.settings.sound;
    this._transitions = state.settings.transitions;
    this._animations = state.settings.animations;
    this._preventSleep = state.settings.preventSleep;
    this._showMediaControls = state.settings.showMediaControls;
    this._workLength = Math.floor(state.settings.workLength / 60);
    this._breakLength = Math.floor(state.settings.breakLength / 60);
    this._longBreakLength = Math.floor(state.settings.longBreakLength / 60);
    if (this._running && this._time === 0) this._transition();
  }

  _settingChanged() {
    // console.log('ChANGE!!!');
  }
}

window.customElements.define('settings-view', SettingsView);
