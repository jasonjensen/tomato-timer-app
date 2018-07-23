/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html } from '@polymer/lit-element';
import { SharedStyles } from './shared-styles.js';
import { PageViewElement } from './page-view-element.js';
import { store } from '../store.js';
import { resetState } from '../actions/settings.js';
import { setTodayStart } from '../actions/logs.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-button/paper-button.js';


class AboutView extends PageViewElement {
  _render(props) {
    return html`
      ${SharedStyles}
      <style>
      h3 {
        font-family: 'Nunito';
        font-weight: 700;
        text-transform: lowercase;
        font-size: 20px;
        text-align: center;
        color: var(--app-dark-text-color);
      }
      p {
        color: var(--app-dark-text-color);
      }
      a {
        color: var(--app-primary-color);
      }
      section {
        margin-bottom: 30px;
      }
      paper-button {
        font-family: 'Nunito';
        font-weight: 700;
        text-transform: lowercase;
        font-size: 16px;
        text-align: center;
        color: var(--app-primary-color);
      }
      paper-button .keyboard-focus {
        font-weight: 400;
      }
    </style>
    <section>
      <h3>about</h3>
      <p>This is an experiment in using some newer web-technologies to create a functioning focus timer which works offline and can be controlled from the lock screen.</p>
      <p>Made by Jason O. Jensen (<a href="https://twitter.com/Jason_Jensen">@jason_jensen</a>).</p>
      <h3>tips</h3>
      <p>Add this to your homescreen to have it work just like a native app.<p>
      <p>Swipe left on a work session or right on a break session to skip it.</p>
      <p>Switch off the sound and still control the timer from your lock screen by enabling the "Always show media controls" option. However, the controls may go away if you play other media.</p>
      <p>This app works better on android than on iPhone - mainly due to limited support for recent web technologies in iOS.</p>
      <p>Reset your settings and logs by tapping <a onclick="${() => this._confirmReset()}">here</a>.
      <h3>privacy</h3>
      <p>This app uses Google Analytics to track anonymous page load and timer completion data.</p>
      <h3>acknowledgements</h3>
      <p>Photos by <a href="https://unsplash.com/@michaelmroczek">Michael Mroczec</a> and <a href="https://unsplash.com/@magrolino">Michael Fruehmann</a>.
      <p>Bird sounds recorded by <a href="https://freesound.org/people/hargissssound/">Hargissssound</a>.
      <p>Built on the PWA Starter Kit from the <a href="https://github.com/Polymer?page=1">Polymer</a> team.
    </section>
    <paper-dialog 
      id="reset-dialog"
      on-iron-overlay-closed="${(e) => this._resetState(e)}"
    >
      <h3>Reset?</h3>
      <p>This will reset your settings and remove all of your logs.</p><p>It cannot be undone.</p>
      <div class="buttons">
        <paper-button dialog-dismiss autofocus>Nevermind</paper-button>
        <paper-button dialog-confirm>Reset</paper-button>
      </div>
    </paper-dialog>
    <paper-dialog 
      id="reset-confirmation" 
    >
      <p>Settings and logs have been reset.</p>
      <div class="buttons">
        <paper-button dialog-confirm autofocus>OK</paper-button>
      </div>
    </paper-dialog>
    `;
  }


  _confirmReset() {
    this.shadowRoot.querySelector('#reset-dialog').open();
    // var r = confirm("This will reset your settings and remove all of your logs. It cannot be undone.")
    // if (r === true) {
    //   store.dispatch(resetState());
    //   store.dispatch(setTodayStart());
    //   alert('Settings and logs have been reset.');
    // }
    
  }

  _resetState(e) {
    if (e.detail && e.detail.confirmed) {
      store.dispatch(resetState());
      store.dispatch(setTodayStart());
      this.shadowRoot.querySelector('#reset-confirmation').open();
    }
  }

  
}

window.customElements.define('about-view', AboutView);
