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
      embed_url: '', // embed_url takes precedence over all other options.
      y_max: '',
    }

    this.lightstepURL = 'https://app.lightstep.com';
    this.panel = $scope.ctrl.panel;
    this.dashboard = $scope.ctrl.dashboard;
    this.timeSrv = $injector.get('timeSrv');
    this.refresh = _.debounce(this._refresh.bind(this), 500);
    this.iframeID = `${Math.floor(Math.random()*1000)}-${this.panel.operationID}-ls-panel`

    _.defaults(this.panel, panelDefaults);

    // There's a race condition where the first refresh event might be called before the iFrame is
    // is rendered with the correct ID meaning jQuery doesn't find it, which is why we make a
    // a delayed call to refresh().
    this.events.on('refresh', this.refresh);
    setTimeout(this.refresh, 500);

    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
  }

  // _refresh uses jQuery to embed a new link inside the iFrame.
  _refresh() {
    // The URL gets precedent over the JSON fields component and operation
    if (this.panel.embed_url) {
      // URI Parsing based on gist.github.com/jlong/2428561
      // Assumes a well-formed embed URL like:
      // https://app.lightstep.com/loadtest/operation/rmJRsvcR/embed?range=86400
      var parser = document.createElement('a');
      parser.href = this.panel.embed_url;
      const split_url = parser.pathname.split('/')
      if (split_url.length > 4) {
        this.panel.project = decodeURI(split_url[1]);
        this.panel.operationID = decodeURI(split_url[3]);
      }
      // parser.search returns "?k=v" so we slice off the '?', then break the string into an array
      // of kv pairs.
      const params_arr = parser.search.slice(1).split('&');
      let params = {};
      params_arr.forEach((param) => {
        const kv = param.split("=");
        params[decodeURI(kv[0])] = decodeURI(kv[1]);
      })
      this.panel.y_max = params['ymax'];
    }

    const project = this.panel.project;
    const operationID = this.panel.operationID;

    const lsURL = this.generateLink(this.timeSrv.timeRange(), project, operationID);
    $(`#${this.iframeID}`).attr('src', lsURL);
  }

  // generateLink generates a new embedded link based off the current timerange.
  generateLink(timeRange, project, operationID) {
    const proj = encodeURIComponent(project);
    const opID = encodeURIComponent(operationID);
    const oldestUnix = timeRange.from.unix();
    const youngestUnix =  timeRange.to.unix();
    const range  = youngestUnix - oldestUnix;
    let query = {
      'range': range,
      'anchor': youngestUnix
    }
    if (this.dashboard.timezone === 'utc') {
     query['utc'] = 'true';
    }
    const y_max = this.panel.y_max;
    if (y_max !== null && y_max !== '') {
      query['ymax'] = this.panel.y_max;
    }
    let queryString = _.join(_.map(query, (val, key) => { return `${key}=${val}` }), '&')
    let url = `${this.lightstepURL}/${proj}/operation/${opID}/embed?${queryString}`
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
