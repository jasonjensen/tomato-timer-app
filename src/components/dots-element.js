import { LitElement, html } from '@polymer/lit-element';

// This is a reusable element. It is not connected to the store. You can
// imagine that it could just as well be a third-party element that you
// got from someone else.
class DotsElement extends LitElement {
  _render(props) {
    let htmlString = `html\`
      <style>
        .dots {
          color: var(--app-secondary-color);
          clear: both;
          text-align: center;
          margin-bottom: -10px;
        }
      </style>
    `

    let displayed = 0;
    const rowStrings = [];
    while (displayed < props.completed) {
      const thisRow = Math.min(4, props.completed - displayed);
      displayed += thisRow;
      const rowString = '\u2022 '.repeat(thisRow).trim();
      rowStrings.unshift(`<div class="dots">${rowString}</div>`);
    }
    htmlString += rowStrings.join('');
    htmlString += `\``;

    const template = eval(htmlString);
    return template;
  }



  static get properties() { return {
    /* The total number of completed pomodoros. */
    completed: Number,

  }};

  constructor() {
    super();
    this.completed = 0;
    this.value = 0;
  }
}

window.customElements.define('dots-element', DotsElement);
