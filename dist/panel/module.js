'use strict';

System.register(['lodash', 'jquery', 'moment', 'app/plugins/sdk'], function (_export, _context) {
  "use strict";

  var _, $, moment, PanelCtrl, _createClass, LightStepPanelCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  return {
    setters: [function (_lodash) {
      _ = _lodash.default;
    }, function (_jquery) {
      $ = _jquery.default;
    }, function (_moment) {
      moment = _moment.default;
    }, function (_appPluginsSdk) {
      PanelCtrl = _appPluginsSdk.PanelCtrl;
    }],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      _export('PanelCtrl', LightStepPanelCtrl = function (_PanelCtrl) {
        _inherits(LightStepPanelCtrl, _PanelCtrl);

        function LightStepPanelCtrl($scope, $injector) {
          _classCallCheck(this, LightStepPanelCtrl);

          var _this = _possibleConstructorReturn(this, (LightStepPanelCtrl.__proto__ || Object.getPrototypeOf(LightStepPanelCtrl)).call(this, $scope, $injector));

          var panelDefaults = {
            project: '',
            operationID: ''
          };

          _this.lightstepURL = 'https://app.lightstep.com';
          _this.panel = $scope.ctrl.panel;
          _this.dashboard = $scope.ctrl.dashboard;
          _this.timeSrv = $injector.get('timeSrv');
          _this.refresh = _this._refresh.bind(_this);
          _this.iframeID = Math.floor(Math.random() * 1000) + '-' + _this.panel.operationID + '-ls-panel';

          _.defaults(_this.panel, panelDefaults);

          // There's a race condition where the first refresh event might be called before the iFrame is
          // is rendered with the correct ID meaning jQuery doesn't find it, which is why we make a
          // a delayed call to refresh().
          _this.events.on('refresh', _this.refresh);
          setTimeout(_this.refresh, 500);

          _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
          return _this;
        }

        // _refresh uses jQuery to embed a new link inside the iFrame.


        _createClass(LightStepPanelCtrl, [{
          key: '_refresh',
          value: function _refresh() {
            var lsURL = this.generateLink(this.timeSrv.timeRange(), this.panel.project, this.panel.operationID);
            $('#' + this.iframeID).attr('src', lsURL);
          }
        }, {
          key: 'generateLink',
          value: function generateLink(timeRange, project, operationID) {
            var oldestUnix = timeRange.from.unix();
            var youngestUnix = timeRange.to.unix();
            var range = youngestUnix - oldestUnix;
            var url = this.lightstepURL + '/' + project + '/operation/' + operationID + '/embed?range=' + range + '&anchor=' + youngestUnix;
            if (this.dashboard.timezone === 'utc') {
              url = url + '&utc=true';
            }
            return url;
          }
        }, {
          key: 'onInitEditMode',
          value: function onInitEditMode() {
            this.addEditorTab('LightStep Options', 'public/plugins/lightstep-panel/editor.html');
          }
        }]);

        return LightStepPanelCtrl;
      }(PanelCtrl));

      // We overlay a div in the bottom right corner to prevent the panel resizer from losing control of
      // the mouse to the iFrame.
      LightStepPanelCtrl.template = '<iframe id={{ctrl.iframeID}} height={{ctrl.height}}px width=100% class="lightstep-grafana-panel"></iframe>\n  <div style="position: absolute; bottom: 0; right: 0; height: 50px; width: 50px"></div>';

      _export('PanelCtrl', LightStepPanelCtrl);
    }
  };
});
//# sourceMappingURL=module.js.map
