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


// This is a reusable element. It is not connected to the store. You can
// imagine that it could just as well be a third-party element that you
// got from someone else.
class NumberElement extends LitElement {
  _render(props) {
    let delay = props.startImmediately ? '0s' : '0.50s';
    let templateString = `html\`
    <style>
      svg {
        pointer-events: none;
        fill: white;
      }
    </style>
    <svg>
      <path d="${props.currentPath}" transform="matrix(${props.trans.join(',')})">`

    if (props.animationPaths) templateString += `
      <animate dur="0.55s"
        repeatCount="0"
        begin="${delay}"
        attributeName="d"
        values="${props.animationPaths}"/>`;

    templateString += `
      </path>
    </svg>
    \``;
    if (!props.currentPath) {
      templateString = `html\`\``;
    }
    var template = eval(templateString)
    return template;
  }

  static get properties() { return {
    /* The svg path of the current number */
    currentPath: String,
    /* The svg path of the number to animate to */
    animationPaths: String,
    /* A scaling indicator for the number */
    trans: String,
    /* An index variable to differentiate the SVG elements */
    index: Number,
    /* The char used instead of an svg */
    char: String,
    /* Whether to run the animation immediately */
    startImmediately: Boolean,
  }};

  constructor() {
    super();
  }
}

window.customElements.define('number-element', NumberElement);
