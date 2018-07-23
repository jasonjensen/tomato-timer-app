/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html } from '@polymer/lit-element';
import { ButtonSharedStyles } from './button-shared-styles.js';
import { numPathsMontserrat } from '../lib/svgNumbers.js';
import { morphsMontserrat } from '../lib/morphPaths.js';
import {GestureEventListeners} from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import * as Gestures from '@polymer/polymer/lib/utils/gestures.js';
import './number-element.js';
// import { interpolate } from '../lib/polymorph.js';


// I will store the numbers here and pass down the transforms - this will reduce code-copying.



// This is a reusable element. It is not connected to the store. You can
// imagine that it could just as well be a third-party element that you
// got from someone else.
class TimerElement extends GestureEventListeners(LitElement) {
  _textTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const secondsString = (seconds < 10) ? `0${seconds}` : `${seconds}`;
    const minutesString = (minutes < 10) ? `.${minutes}` : `${minutes}`;
    // console.log(`${minutesString}:${secondsString}`);
    return `${minutesString}:${secondsString}`.split('');
  }

  _getCharAt(index) {
    const numString = this.textTime();
    const indexChar = numString.charAt(index);
    if (indexChar === ':') return 99;
    if (indexChar === '.') return 88;
    return parseInt(indexChar);
  }

  _render(props) {
    if (props.running && this.time > 0) {
      setTimeout(this._onDecrement.bind(this), 1000)
    }
    const chars = this._textTime(props.time);
    if (chars[0] === '.') chars[0] = '';
    const currentPaths = [
      numPathsMontserrat['number' + chars[0]] || '',
      numPathsMontserrat['number' + chars[1]],
      numPathsMontserrat.colon,
      numPathsMontserrat['number' + chars[3]],
      numPathsMontserrat['number' + chars[4]],
    ];
    const nextChars = this._textTime(props.time - 1);
    if (nextChars[0] === '.') nextChars[0] = '';
    let interpolations = [null,null,null,null,null];
    if ((props.running || props.preAnim) && props.anim) {
      interpolations = [
        (chars[0] === nextChars[0]) ? null : morphsMontserrat[`${chars[0]}to${nextChars[0]}`],
        (chars[1] === nextChars[1]) ? null : morphsMontserrat[`${chars[1]}to${nextChars[1]}`],
        (chars[2] === nextChars[2]) ? null : morphsMontserrat[`${chars[2]}to${nextChars[2]}`],
        (chars[3] === nextChars[3]) ? null : morphsMontserrat[`${chars[3]}to${nextChars[3]}`],
        (chars[4] === nextChars[4]) ? null : morphsMontserrat[`${chars[4]}to${nextChars[4]}`]
      ];
    }
    /*
    // Keep this here to generate other interpolations in the future
    // const interpolations = [];
    for (let i = 0; i < 5; i++) {
      if (chars[i] === nextChars[i]) {
        interpolations[i] = null;
      } else {
        const interpolator = interpolate([currentPaths[i], numPathsMontserrat['number' + nextChars[i]]], {
          addPoints: 0,
          origin: { x: 0, y: 0 },
          optimize: 'fill',
          precision: 0
       })
       interpolations[i] = `${interpolator(0.0)};${interpolator(0.1)};${interpolator(0.2)};${interpolator(0.3)};${interpolator(0.4)};${interpolator(0.5)};${interpolator(0.6)};${interpolator(0.7)};${interpolator(0.8)};${interpolator(0.9)};${interpolator(1)};`;
      }
      console.log('MORPH:', chars[i], 'to', nextChars[i]);
      console.log(interpolations[i]);
    }
    */

    const transform = this._scale(numPathsMontserrat.transform);
    let transformColon = numPathsMontserrat.transform.slice(0);
    transformColon[4] += 15;
    transformColon = this._scale(transformColon);

    const tapText1 = (props.running || props.preAnim) ? 'Tap to stop' : 'Tap to start'
    const left = (props.mode === 'break') ? (-400 * this.scale) + 'px' : 0;
    const reversed =  (props.mode === 'break') ? '0px' : (-400 * this.scale) + 'px';
    const imageWidth = (800 * this.scale) + 'px';
    const imageMinHeight = (300 * this.scale) + 'px';
    const numWidth = (55 * this.scale) + 'px';
    const numTop = (100 * this.scale) + 'px';
    const numLeft = (65 * this.scale) + 'px';
    const tapTop = (200 * this.scale) + 'px';
    const style = eval(
      `html\`
      <style>
      div.numbers-container { 
        display: flex;
        flexDirection: row;
        height: 100px;
        position: absolute; 
        top: ${numTop};
        left: ${numLeft};
        z-index: 10;
      }
      div.tap-text {
        position: absolute;
        left: 0px;
        top: ${tapTop};
        width: 100%;
        text-align: center;
        color: white;
        font-family: 'Nunito';
        font-weight: 400;
        text-transform: lowercase;
        font-size: 16px;
        z-index: 10;
      }
      img#background-container {
        position: absolute;
        top: 0;
        left: ${left};
        width: ${imageWidth};
        height: 100%;
        min-height: ${imageMinHeight};
        z-index: 0;
        will-change: left;
        transition: left 0.5s;
      }
      img.reversed {
        left: ${reversed};
      }
      number-element {
        width: ${numWidth};
        height: 100;
      }
    </style>
      \``
    )
    return html`
      ${ButtonSharedStyles}
      ${style}
      <div class="numbers-container">
        <number-element
          index=${0}
          char=${chars[0]}
          currentPath="${currentPaths[0]}" 
          animationPaths="${interpolations[0]}" 
          trans=${transform}
          startImmediately=${props.preAnim}
        ></number-element>
        <number-element
          index=${1}
          char=${chars[1]}
          currentPath="${currentPaths[1]}" 
          animationPaths="${interpolations[1]}" 
          trans=${transform}
          startImmediately=${props.preAnim}
        ></number-element>
        <number-element
          index=${2}
          char=${chars[2]}
          currentPath="${currentPaths[2]}" 
          animationPaths="${interpolations[2]}" 
          trans=${transformColon}
          startImmediately=${props.preAnim}
        ></number-element>
        <number-element
          index=${3}
          char=${chars[3]}
          currentPath="${currentPaths[3]}" 
          animationPaths="${interpolations[3]}" 
          trans=${transform}
          startImmediately=${props.preAnim}
        ></number-element>
        <number-element
          index=${4}
          char=${chars[4]}
          currentPath="${currentPaths[4]}" 
          animationPaths="${interpolations[4]}" 
          trans=${transform}
          startImmediately=${props.preAnim}
        ></number-element>
      </div>
      <div class="tap-text">
        ${tapText1}
      </div>
      <img 
        class="${props.mode}"
        id="background-container" 
        src="images/circles.jpg" 
      />
      
    `;
  }

  static get properties() { return {
    /* The current time. */
    time: Number,
    /* Whether the timer is running. */
    running: Boolean,
    anim: Boolean,
    preAnim: Boolean,
    mode: String,
  }};

  constructor() {
    super();
    this.scale = Math.min(document.documentElement.clientWidth / 400, 1);
    Gestures.addListener(this,'track', this._handleTrack.bind(this));
    this.addEventListener('drag', this._handleTrack.bind(this));
    this.addEventListener('dragstart', this._handleTrack.bind(this));
    this.addEventListener('dragend', this._handleTrack.bind(this));
  }

  _onDecrement() {
    if (this.running) {
      this.dispatchEvent(new CustomEvent('timer-decremented'));
    }
  }

  _updateBackground() {
    if (this._tracking) {
      this._backgroundEl.style.left = this._backgroundX + 'px';
      if (this._stillStuck) {
        this._backgroundEl.style.transition = 'left 0s';
        this._stillStuck = false;
      }
      requestAnimationFrame(this._updateBackground.bind(this));
    }
  }

  _handleTrack(e) {
    const state = e.detail.state || e.type;
    const base = (this.mode === 'break') ? -400 * this.scale : 0;
    switch(state) {
      case 'start':
      case 'dragstart':
        this._tracking = true;
        this._stillStuck = true;
        this._backgroundEl = this.shadowRoot.querySelector('#background-container');
        this._backgroundX = (this.mode === 'break') ? -400 * this.scale : 0;
        requestAnimationFrame(this._updateBackground.bind(this));
        if (state === 'dragstart') this._dragStart = e.x + 0;
        break;
      case 'track':
        this._backgroundX = Math.min(Math.max(-400 * this.scale, base + e.detail.dx), 0);
        break;
      case 'drag':
        this._backgroundX = Math.min(Math.max(-400 * this.scale, base + e.x - this._dragStart), 0);
        break;
      case 'end':
      case 'dragend':
        this._tracking = false;
        const position = parseFloat(this._backgroundEl.style.left.replace('px', ''));
        if (
          (this.mode === 'break' && position > -250) ||
          (this.mode === 'work' && position < -150)
        ) {
          console.log('Should transition!');
          this._backgroundEl.style.left = (this.mode === 'break') ? '0px' : (-400 * this.scale) + 'px';
          var me = this;
          setTimeout(() => { me._backgroundEl.style.left = ''}, 1500);
          this.dispatchEvent(new CustomEvent('transition'));
        } else {
          this._backgroundEl.style.left = '';
          // this._backgroundEl.style.left = (this.mode === 'break') ? '-400px' : '0px';
          // this._backgroundEl.removeAttribute('style');
        }
        this._backgroundEl.style.transition = 'left 0.5s';
        break;
    }
    e.preventDefault();
    return false;
  }

  _scale(t) {
    return [
      t[0] * this.scale,
      t[1],
      t[2],
      t[3] * this.scale,
      t[4] * this.scale,
      t[5] * this.scale,
    ];
  }
}

window.customElements.define('timer-element', TimerElement);
