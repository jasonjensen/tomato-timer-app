import { html } from '@polymer/lit-element';

export const ToggleStyles = html`
  <style>
    .setting {
      display: flex;
      clear: both;
      flex-direction: row;
      justify-content: space-between;
      margin-top: 20px;
      margin-left: auto;
      margin-right: auto;
      max-width: 600px;
    }

    .label {
      font-family: 'Nunito';
      font-size: 14pt;
      padding-left: 0px;
      width: auto;
    }

    #soundWork,
    #soundBreak,
    #soundWorkEnd,
    #soundBreakEnd {
      font-family: 'Nunito';
      font-size: 14pt;
      padding-left: 40px;
      width: auto;
    }

    



    /* The switch - the box around the slider */
    .switch {
      position: relative;
      display: inline-block;
      align: right;
      width: 50px;
      height: 24px;
      float: right;
    }

    @media only screen and (max-width: 768px) {
      .setting {
        width: calc(100% - 40px);
        margin-right: 20px;
        margin-left: 20px;
        color: var(--app-dark-text-color);
      }

      .label {
        font-family: Nunito,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
        font-size: 12pt;
        padding-left: 0px;
        width: auto;
      }
  
      #soundWork,
      #soundBreak,
      #soundWorkEnd,
      #soundBreakEnd {
        font-family: Nunito,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
        font-size: 12pt;
        padding-left: 20px;
        width: auto;
      }
      
    }

    /* Hide default HTML checkbox */
    .switch input {display:none;}

    /* The slider */
    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: var(--app-secondary-color);
      -webkit-transition: .4s;
      transition: .4s;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 4px;
      bottom: 3px;
      background-color: white;
      -webkit-transition: .4s;
      transition: .4s;
    }

    input:checked + .slider {
      background-color: var(--app-primary-color);
    }

    input:checked + .slider:before {
      -webkit-transform: translateX(25px);
      -ms-transform: translateX(25px);
      transform: translateX(25px);
    }

    input:disabled + .slider {
      background-color: #ccc;
    }

    input:focus + .slider {
      box-shadow: 0 0 1px #2196F3;
    }

    

    /* Rounded sliders */
    .slider.round {
      border-radius: 24px;
    }

    .slider.round:before {
      border-radius: 50%;
    }

    @media only screen and (max-width: 390px) {

      .switch {
        width: 40px;
      }

      input:checked + .slider:before {
        -webkit-transform: translateX(15px);
        -ms-transform: translateX(15px);
        transform: translateX(15px);
      }
    }
   </style>
`;


