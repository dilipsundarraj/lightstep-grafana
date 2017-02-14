import _ from 'lodash';
import $ from 'jquery';
import moment from 'moment'
import {PanelCtrl} from  'app/plugins/sdk';


class LightStepPanelCtrl extends PanelCtrl {

  constructor($scope, $injector) {
    super($scope, $injector);
    const panelDefaults = {
      project: '',
      operationID: '',
      embed_url: '' // embed_url takes precedence over project and operationID
    }

    this.lightstepURL = 'https://app.lightstep.com';
    this.panel = $scope.ctrl.panel;
    this.dashboard = $scope.ctrl.dashboard;
    this.timeSrv = $injector.get('timeSrv');
    this.refresh = this._refresh.bind(this);
    this.iframeID = `${Math.floor(Math.random()*1000)}-${this.panel.operationID}-ls-panel`

    _.defaults(this.panel, panelDefaults);

    // There's a race condition where the first refresh event might be called before the iFrame is
    // is rendered with the correct ID meaning jQuery doesn't find it, which is why we make a
    // a delayed call to refresh().
    this.events.on('refresh', _.debounce(this.refresh, 500));
    setTimeout(this.refresh, 500);

    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
  }

  // _refresh uses jQuery to embed a new link inside the iFrame.
  _refresh() {
    // The URL gets precedent over the JSON fields component and operation
    if (this.panel.embed_url) {

      // Assumes a well-formed embed URL like:
      // https://app.lightstep.com/loadtest/operation/rmJRsvcR/embed?range=86400
      const split_url = this.panel.embed_url.split('/')
      if (split_url.length > 6) {
        this.panel.project = split_url[3];
        this.panel.operationID = split_url[5];
      }
    }

    const project = this.panel.project;
    const operationID = this.panel.operationID;

    const lsURL = this.generateLink(this.timeSrv.timeRange(), project, operationID);
    $(`#${this.iframeID}`).attr('src', lsURL);
  }

  // generateLink generates a new embedded link based off the current timerange.
  generateLink(timeRange, project, operationID) {
    const oldestUnix = timeRange.from.unix();
    const youngestUnix =  timeRange.to.unix();
    const range  = youngestUnix - oldestUnix;
    let url = `${this.lightstepURL}/${project}/operation/${operationID}/embed?range=${range}&anchor=${youngestUnix}`;
    if (this.dashboard.timezone === 'utc') {
      url = url + '&utc=true';
    }
    return url;
  }

  onInitEditMode() {
    this.addEditorTab('LightStep Options', 'public/plugins/lightstep-panel/editor.html');
  }
}

// We overlay a div in the bottom right corner to prevent the panel resizer from losing control of
// the mouse to the iFrame.
LightStepPanelCtrl.template = `<iframe id={{ctrl.iframeID}} height={{ctrl.height}}px width=100% class="lightstep-grafana-panel"></iframe>
  <div style="position: absolute; bottom: 0; right: 0; height: 50px; width: 50px"></div>`;

export {
  LightStepPanelCtrl as PanelCtrl
};
