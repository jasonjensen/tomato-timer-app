import { html } from '@polymer/lit-element';
import { PageViewElement } from './page-view-element.js';
import { SharedStyles } from './shared-styles.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import './toggle-element.js';
import { ToggleStyles } from './toggle-styles.js';

// This element is connected to the redux store.
import { store } from '../store.js';

// Actions
import { toggleEmptyDaysInclusion, toggleWeekendInclusion } from '../actions/logs.js';

class StatsView extends connect(store)(PageViewElement) {

  _render(props) {
    const count = props._logs.length;
    const parsed = this._parseLogs(props._logs);
    const maxAvg = Math.round(parsed.maxAverage * 10) / 10 + 0.1;
    
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
      .chart {
        position: relative;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
        height: 350px;
        margin-bottom: 30px;
      }
      .column {
        width: 20%;
        height: 100%
      }
      .footer {
        position: absolute;
        top: 100%;
        font-size: 10pt;
        text-align: center;
      }
      @keyframes stretchBar0 {
        0% {
            height: 0;
        }
        100% {
            height: ${Math.round(parsed.weeklyAverages[0] / maxAvg*100) + '%'};
        }
      }
      @keyframes shrinkBar0 {
        0% {
            height: 100%;
        }
        100% {
            height: ${(100 - Math.round(parsed.weeklyAverages[0] / maxAvg*100)) + '%'};
        }
      }
      @keyframes stretchBar1 {
        0% {
            height: 0;
        }
        100% {
            height: ${Math.round(parsed.weeklyAverages[1] / maxAvg*100) + '%'};
        }
      }
      @keyframes shrinkBar1 {
        0% {
            height: 100%;
        }
        100% {
            height: ${(100 - Math.round(parsed.weeklyAverages[1] / maxAvg*100)) + '%'};
        }
      }
      @keyframes stretchBar2 {
        0% {
            height: 0;
        }
        100% {
            height: ${Math.round(parsed.weeklyAverages[2] / maxAvg*100) + '%'};
        }
      }
      @keyframes shrinkBar2 {
        0% {
            height: 100%;
        }
        100% {
            height: ${(100 - Math.round(parsed.weeklyAverages[2] / maxAvg*100)) + '%'};
        }
      }
      @keyframes stretchBar3 {
        0% {
            height: 0;
        }
        100% {
            height: ${Math.round(parsed.weeklyAverages[3] / maxAvg*100) + '%'};
        }
      }
      @keyframes shrinkBar3 {
        0% {
            height: 100%;
        }
        100% {
            height: ${(100 - Math.round(parsed.weeklyAverages[3] / maxAvg*100)) + '%'};
        }
      }
      .bar {
        background: var(--app-primary-color);
        text-align: center;
        font-weight: bold;
        color: var(--app-header-background-color);
        
      }
      .bar, .top {
        -webkit-transition: height 1s; /* Safari */
        transition: height 1s;
        animation-duration: 1s; /* the duration of the animation */
        animation-timing-function: ease-out; /* how the animation will behave */
        animation-delay: 0s; /* how long to delay the animation from starting */
        animation-iteration-count: 1; /* how many times the animation will play */
      }
      .top.c0 {
        animation-name: shrinkBar0; /* the name of the animation we defined above */  
      }
      .top.c1 {
        animation-name: shrinkBar1; /* the name of the animation we defined above */  
      }
      .top.c2 {
        animation-name: shrinkBar2; /* the name of the animation we defined above */  
      }
      .top.c3 {
        animation-name: shrinkBar3; /* the name of the animation we defined above */  
      }
      .bar.c0 {
        animation-name: stretchBar0; /* the name of the animation we defined above */  
      }
      .bar.c1 {
        animation-name: stretchBar1; /* the name of the animation we defined above */  
      }
      .bar.c2 {
        animation-name: stretchBar2; /* the name of the animation we defined above */  
      }
      .bar.c3 {
        animation-name: stretchBar3; /* the name of the animation we defined above */  
      }
      @media (min-width: 460px) {
        .chart {
          height: 400px;
        }
      }
      </style>
      <section>
      <h3>weekly averages</h3>
      <p style="text-align: center; display: ${count > 0 ? 'none' : 'block'};">You do not yet have any completed work timers.</p>
      <div class="chart" style="display: ${count > 0 ? 'flex' : 'none'};">
        <div class="column">
          <div class="footer">-3 weeks</div>
          <div class="top c3" style="height: ${(100 - Math.round(parsed.weeklyAverages[3] / maxAvg*100)) + '%'};"></div>
          <div class="bar c3" style="height: ${Math.round(parsed.weeklyAverages[3] / maxAvg*100) + '%'};">${parsed.weeklyAverages[3].toFixed(1)}</div>
        </div>
        <div class="column">
          <div class="footer">-2 weeks</div>
          <div class="top c2" style="height: ${(100 - Math.round(parsed.weeklyAverages[2] / maxAvg*100)) + '%'};"></div>
          <div class="bar c2" style="height: ${Math.round(parsed.weeklyAverages[2] / maxAvg*100) + '%'};">${parsed.weeklyAverages[2].toFixed(1)}</div>
        </div>
        <div class="column">
          <div class="footer">last week</div>
          <div class="top c1" style="height: ${(100 - Math.round(parsed.weeklyAverages[1] / maxAvg*100)) + '%'};"></div>
          <div class="bar c1" style="height: ${Math.round(parsed.weeklyAverages[1] / maxAvg*100) + '%'};">${parsed.weeklyAverages[1].toFixed(1)}</div>
        </div>
        <div class="column">
          <div class="footer">this week</div>
          <div class="top c0" style="height: ${(100 - Math.round(parsed.weeklyAverages[0] / maxAvg*100)) + '%'};"></div>
          <div class="bar c0" style="height: ${Math.round(parsed.weeklyAverages[0] / maxAvg*100) + '%'};">${parsed.weeklyAverages[0].toFixed(1)}</div>
        </div>
      </div>
      <toggle-element 
      style="display: ${count > 0 ? 'block' : 'none'};" 
        label="Include days with no completions"
        checked="${props._includeEmptyDays}"
        on-toggle-changed="${() => store.dispatch(toggleEmptyDaysInclusion())}"
      ></toggle-element>
      <toggle-element 
      style="display: ${count > 0 ? 'block' : 'none'};"
        label="Include weekends"
        checked="${props._includeWeekends}"
        on-toggle-changed="${() => store.dispatch(toggleWeekendInclusion())}"
      ></toggle-element>
      </section>
    `;
  }

  _generateDates() {
    let times = [];
    let now = date.now.getTime();
    let dayLength = 60*60*24*1000;
    for (var i = 0; i<40; i++ ) {
      var numberForDay = Math.round(Math.random() * 8);
      for (var j = 0; j < numberForDay; j++) {
        times.push(now - dayLength * i - j * 60000);
      }
    }
    return times;
  }
 

  static get properties() { return {
    // This is the data from the store.
    _logs: Array,
    _includeEmptyDays: Boolean,
    _includeWeekends: Boolean,

  }}

  // This is called every time something is updated in the store.
  _stateChanged(state) {
    this._logs = state.logs.previous;
    this._includeEmptyDays = state.logs.includeEmptyDays;
    this._includeWeekends = state.logs.includeWeekends;
    this._parsedLogs = this._parseLogs(state.logs.previous);
  }

  _parseLogs() {
    const dayLength = 60*60*24*1000;

    const weekStart = new Date();
    weekStart.setHours(4,0,0,0);
    const today = weekStart.getDay() || 7;
    
    const dayStart = new Date();
    dayStart.setHours(4,0,0,0);

    const daily = [];
    for (let i = 0; i < today + 21; i++) {
      daily.push(
        this._logs.filter( x => 
          x <= dayStart.getTime() + dayLength - dayLength * i  && 
          x >= dayStart.getTime() - dayLength * i
        ).length
      );
    }
    
    const weekly = [];
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    let maxAvg = 0;
    for (let i = 0; i < 4; i++) {
      const weekLength = (i === 0) ? today : 7;
      let subset = daily.slice(
        Math.max(0, i-1) * weekLength + Math.min(1, i) * today, 
        today + weekLength * i
      );
      if (!this._includeWeekends && subset.length > 5) subset = subset.slice(subset.length - 5,subset.length);

      let denominator = this._includeEmptyDays ? subset.length :  subset.filter(x => x > 0).length;
      let avg = subset.reduce(reducer) / denominator || 0;
      maxAvg = Math.max(avg, maxAvg);
      weekly.push(avg);
    }
   
    return {
      dailyCounts: daily,
      weeklyAverages: weekly,
      maxAverage: maxAvg,
    };
  }
}

window.customElements.define('stats-view', StatsView);
