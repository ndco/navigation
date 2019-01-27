/**
 * Navigation React v2.0.3
 * (c) Graham Mendick - http://grahammendick.github.io/navigation/
 * License: Apache-2.0
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.NavigationReact = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";
var LinkUtility = (function () {
    function LinkUtility() {
    }
    LinkUtility.getLink = function (stateNavigator, linkAccessor) {
        try {
            return stateNavigator.historyManager.getHref(linkAccessor());
        }
        catch (e) {
            return null;
        }
    };
    LinkUtility.getData = function (stateNavigator, navigationData, includeCurrentData, currentDataKeys) {
        if (currentDataKeys)
            navigationData = stateNavigator.stateContext.includeCurrentData(navigationData, currentDataKeys.trim().split(/\s*,\s*/));
        if (includeCurrentData)
            navigationData = stateNavigator.stateContext.includeCurrentData(navigationData);
        return navigationData;
    };
    LinkUtility.setActive = function (stateNavigator, props, toProps) {
        if (!props.activeCssClass && !props.disableActive)
            return;
        var active = !!toProps.href;
        for (var key in props.navigationData) {
            var val = props.navigationData[key];
            active = active && (val == null || this.areEqual(val, stateNavigator.stateContext.data[key]));
        }
        if (active && props.activeCssClass)
            toProps.className = !toProps.className ? props.activeCssClass : toProps.className + ' ' + props.activeCssClass;
        if (active && props.disableActive)
            toProps.href = null;
    };
    LinkUtility.areEqual = function (val, currentVal) {
        if (currentVal == null)
            return val == null || val === '';
        var valType = Object.prototype.toString.call(val);
        if (valType !== Object.prototype.toString.call(currentVal))
            return false;
        if (valType === '[object Array]') {
            var active = val.length === currentVal.length;
            for (var i = 0; active && i < val.length; i++) {
                active = this.areEqual(val[i], currentVal[i]);
            }
            return active;
        }
        else {
            return isNaN(val) ? val === currentVal : +val === +currentVal;
        }
    };
    LinkUtility.isValidAttribute = function (attr) {
        return attr !== 'stateNavigator' && attr !== 'stateKey' && attr !== 'navigationData' && attr !== 'includeCurrentData'
            && attr !== 'currentDataKeys' && attr !== 'activeCssClass' && attr !== 'disableActive' && attr !== 'distance'
            && attr !== 'lazy' && attr !== 'historyAction' && attr !== 'navigating' && attr !== 'children';
    };
    LinkUtility.addListeners = function (component, stateNavigator, props, toProps, getLink) {
        var _this = this;
        var lazy = !!props.lazy;
        toProps.onClick = function (e, domId) {
            var element = component['el'];
            var href = element.href;
            if (lazy) {
                component.forceUpdate();
                href = getLink();
                if (href)
                    element.href = href;
            }
            if (!e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey && !e.button) {
                if (href) {
                    var link = stateNavigator.historyManager.getUrl(element);
                    var navigating = _this.getNavigating(props);
                    if (navigating(e, domId, link)) {
                        e.preventDefault();
                        stateNavigator.navigateLink(link, props.historyAction);
                    }
                }
            }
        };
        if (lazy)
            toProps.onContextMenu = function (e) { return component.forceUpdate(); };
    };
    LinkUtility.getNavigating = function (props) {
        return function (e, domId, link) {
            var listener = props.navigating;
            if (listener)
                return listener(e, domId, link);
            return true;
        };
    };
    return LinkUtility;
}());
module.exports = LinkUtility;
},{}],2:[function(_dereq_,module,exports){
(function (global){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var LinkUtility = _dereq_('./LinkUtility');
var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);
var NavigationBackLink = (function (_super) {
    __extends(NavigationBackLink, _super);
    function NavigationBackLink(props, context) {
        var _this = this;
        _super.call(this, props, context);
        this.onNavigate = function () {
            if (_this.state.stateContext !== _this.getStateNavigator().stateContext.url
                || _this.state.crumb !== _this.getNavigationBackLink())
                _this.setState(_this.getNextState());
        };
        this.state = this.getNextState();
    }
    NavigationBackLink.prototype.getStateNavigator = function () {
        return this.props.stateNavigator || this.context.stateNavigator;
    };
    NavigationBackLink.prototype.getNavigationBackLink = function () {
        var _this = this;
        return LinkUtility.getLink(this.getStateNavigator(), function () { return _this.getStateNavigator().getNavigationBackLink(_this.props.distance); });
    };
    NavigationBackLink.prototype.getNextState = function () {
        return {
            stateContext: this.getStateNavigator().stateContext.url,
            crumb: this.getNavigationBackLink()
        };
    };
    NavigationBackLink.prototype.componentDidMount = function () {
        if (!this.props.lazy)
            this.getStateNavigator().onNavigate(this.onNavigate);
    };
    NavigationBackLink.prototype.componentWillReceiveProps = function () {
        this.setState(this.getNextState());
    };
    NavigationBackLink.prototype.componentWillUnmount = function () {
        if (!this.props.lazy)
            this.getStateNavigator().offNavigate(this.onNavigate);
    };
    NavigationBackLink.prototype.render = function () {
        var _this = this;
        var props = { ref: function (el) { return _this['el'] = el; } };
        for (var key in this.props) {
            if (LinkUtility.isValidAttribute(key))
                props[key] = this.props[key];
        }
        props.href = this.getNavigationBackLink();
        LinkUtility.addListeners(this, this.getStateNavigator(), this.props, props, function () { return _this.getNavigationBackLink(); });
        return React.createElement('a', props, this.props.children);
    };
    NavigationBackLink.contextTypes = {
        stateNavigator: React.PropTypes.object
    };
    return NavigationBackLink;
}(React.Component));
;
module.exports = NavigationBackLink;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./LinkUtility":1}],3:[function(_dereq_,module,exports){
(function (global){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var LinkUtility = _dereq_('./LinkUtility');
var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);
var NavigationLink = (function (_super) {
    __extends(NavigationLink, _super);
    function NavigationLink(props, context) {
        var _this = this;
        _super.call(this, props, context);
        this.onNavigate = function () {
            if (_this.state.stateContext !== _this.getStateNavigator().stateContext.url)
                _this.setState(_this.getNextState());
        };
        this.state = this.getNextState();
    }
    NavigationLink.prototype.getStateNavigator = function () {
        return this.props.stateNavigator || this.context.stateNavigator;
    };
    NavigationLink.prototype.getNavigationLink = function () {
        var _this = this;
        var navigationData = LinkUtility.getData(this.getStateNavigator(), this.props.navigationData, this.props.includeCurrentData, this.props.currentDataKeys);
        return LinkUtility.getLink(this.getStateNavigator(), function () { return _this.getStateNavigator().getNavigationLink(_this.props.stateKey, navigationData); });
    };
    NavigationLink.prototype.getNextState = function () {
        return { stateContext: this.getStateNavigator().stateContext.url };
    };
    NavigationLink.prototype.componentDidMount = function () {
        if (!this.props.lazy)
            this.getStateNavigator().onNavigate(this.onNavigate);
    };
    NavigationLink.prototype.componentWillReceiveProps = function () {
        this.setState(this.getNextState());
    };
    NavigationLink.prototype.componentWillUnmount = function () {
        if (!this.props.lazy)
            this.getStateNavigator().offNavigate(this.onNavigate);
    };
    NavigationLink.prototype.render = function () {
        var _this = this;
        var props = { ref: function (el) { return _this['el'] = el; } };
        for (var key in this.props) {
            if (LinkUtility.isValidAttribute(key))
                props[key] = this.props[key];
        }
        props.href = this.getNavigationLink();
        LinkUtility.addListeners(this, this.getStateNavigator(), this.props, props, function () { return _this.getNavigationLink(); });
        if (this.getStateNavigator().stateContext.state && this.getStateNavigator().stateContext.state.key === this.props.stateKey)
            LinkUtility.setActive(this.getStateNavigator(), this.props, props);
        return React.createElement('a', props, this.props.children);
    };
    NavigationLink.contextTypes = {
        stateNavigator: React.PropTypes.object
    };
    return NavigationLink;
}(React.Component));
;
module.exports = NavigationLink;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./LinkUtility":1}],4:[function(_dereq_,module,exports){
"use strict";
var NavigationBackLink = _dereq_('./NavigationBackLink');
var NavigationLink = _dereq_('./NavigationLink');
var RefreshLink = _dereq_('./RefreshLink');
var NavigationReact = (function () {
    function NavigationReact() {
    }
    NavigationReact.NavigationBackLink = NavigationBackLink;
    NavigationReact.NavigationLink = NavigationLink;
    NavigationReact.RefreshLink = RefreshLink;
    return NavigationReact;
}());
module.exports = NavigationReact;
},{"./NavigationBackLink":2,"./NavigationLink":3,"./RefreshLink":5}],5:[function(_dereq_,module,exports){
(function (global){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var LinkUtility = _dereq_('./LinkUtility');
var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);
var RefreshLink = (function (_super) {
    __extends(RefreshLink, _super);
    function RefreshLink(props, context) {
        var _this = this;
        _super.call(this, props, context);
        this.onNavigate = function () {
            if (_this.state.stateContext !== _this.getStateNavigator().stateContext.url)
                _this.setState(_this.getNextState());
        };
        this.state = this.getNextState();
    }
    RefreshLink.prototype.getStateNavigator = function () {
        return this.props.stateNavigator || this.context.stateNavigator;
    };
    RefreshLink.prototype.getRefreshLink = function () {
        var _this = this;
        var navigationData = LinkUtility.getData(this.getStateNavigator(), this.props.navigationData, this.props.includeCurrentData, this.props.currentDataKeys);
        return LinkUtility.getLink(this.getStateNavigator(), function () { return _this.getStateNavigator().getRefreshLink(navigationData); });
    };
    RefreshLink.prototype.getNextState = function () {
        return { stateContext: this.getStateNavigator().stateContext.url };
    };
    RefreshLink.prototype.componentDidMount = function () {
        if (!this.props.lazy)
            this.getStateNavigator().onNavigate(this.onNavigate);
    };
    RefreshLink.prototype.componentWillReceiveProps = function () {
        this.setState(this.getNextState());
    };
    RefreshLink.prototype.componentWillUnmount = function () {
        if (!this.props.lazy)
            this.getStateNavigator().offNavigate(this.onNavigate);
    };
    RefreshLink.prototype.render = function () {
        var _this = this;
        var props = { ref: function (el) { return _this['el'] = el; } };
        for (var key in this.props) {
            if (LinkUtility.isValidAttribute(key))
                props[key] = this.props[key];
        }
        props.href = this.getRefreshLink();
        LinkUtility.addListeners(this, this.getStateNavigator(), this.props, props, function () { return _this.getRefreshLink(); });
        LinkUtility.setActive(this.getStateNavigator(), this.props, props);
        return React.createElement('a', props, this.props.children);
    };
    RefreshLink.contextTypes = {
        stateNavigator: React.PropTypes.object
    };
    return RefreshLink;
}(React.Component));
;
module.exports = RefreshLink;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./LinkUtility":1}]},{},[4])(4)
});