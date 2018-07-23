import { LitElement, html } from '@polymer/lit-element';
import { ToggleStyles } from './toggle-styles.js';

// This is a reusable element. It is not connected to the store. You can
// imagine that it could just as well be a third-party element that you
// got from someone else.
class ToggleElement extends LitElement {
  _render(props) {
    const checked = (props.checked) ? 'checked' : '';
    const disabled = (props.disabled) ? 'disabled' : '';
    
    return html`
      ${ToggleStyles}
      <div class="setting">
        <label class="label" id="${props.subId}">${props.label}</label>
        <label class="switch">
          <input
            type="checkbox"
            disabled="${disabled}"
            checked="${checked}"
            on-change="${() => this._onChanged()}"
          >
          <span class="slider round"></span>
        </label>
      </div>
      `;
  }

  static get properties() { return {
   /* The label text. */
   label: String,
   /* value */
   checked: Boolean,
   /* The function to call when the value is changed. */
   toggle: Function,
   subId: String,
   disabled: Boolean,
  }};

  constructor() {
    super();
    
  }

  _onChanged() {
    this.dispatchEvent(new CustomEvent('toggle-changed'));
  }
}

window.customElements.define('toggle-element', ToggleElement);
