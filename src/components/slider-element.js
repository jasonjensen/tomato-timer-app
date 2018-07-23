import { LitElement, html } from '@polymer/lit-element';
import { ToggleStyles } from './toggle-styles.js';
import '@polymer/paper-slider/paper-slider.js'

// This is a reusable element. It is not connected to the store. You can
// imagine that it could just as well be a third-party element that you
// got from someone else.
class SliderElement extends LitElement {
  _render(props) {
    return html`
      ${ToggleStyles}
      <style>
      paper-slider {
        width: 100%;
        --paper-slider-knob-color: var(--app-primary-color);
        --paper-slider-active-color: var(--app-primary-color);
        margin-right: calc(-9px - var(--calculated-paper-slider-height)/2);;
      }
      paper-slider #sliderContainer {
        margin-right: 0px;
        margin-left: 0px;
      }
      .label {
        min-width: 200px;
      }
      @media  only screen and  (max-width: 390px) {
        .label {
          min-width: 100px;
        }
      }
      </style>
      <div class="setting">
        <label class="label">${props.label} (${props.value} min.)</label>
        <paper-slider 
          value="${props.value}" 
          min="1"
          max="60"
          on-immediate-value-change="${() => this._onChanged()}"
        ></paper-slider>
        </label>
      </div>
      `;
  }

  static get properties() { return {
   /* The label text. */
   label: String,
   /* value */
   value: Number,
   /* The function to call when the value is changed. */
   toggle: Function,
   subSetting: Boolean,
   disabled: Boolean,
  }};

  constructor() {
    super();
    
  }

  _onChanged(e) {
    if (!this._sliderEl) {
      this._sliderEl = this.shadowRoot.querySelector('paper-slider');
    }
    const val = this._sliderEl.immediateValue;
    this.dispatchEvent(new CustomEvent('value-changed', {
      detail: {
        value: val,
      }
    }));
  }
}

window.customElements.define('slider-element', SliderElement);
