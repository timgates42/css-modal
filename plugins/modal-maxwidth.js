/*
 * CSS Modal Plugin for setting a max-width for modals
 *
 * @author Hans Christian Reinl
 * @date 2014-05-27
 *
 */
(function (global) {
	'use strict';

	/**
	 * Main modal object
	 */
	var CSSModal;
	var _currentMaxWidth;

	// Config: margin for modal when too narrow to show max width
	// can be overwritten with `data-cssmodal-margin` attribute
	var _margin = 20;

	var MODAL_SMALL_BREAKPOINT = 480;

	/**
	 * Include styles into the DOM
	 * @param {string} rule Styles to inject into the DOM
	 * @param {string} id   Unique ID for styles
	 */
	var _injectStyles = function (rule, id) {
		var element = document.createElement('div');

		id = 'modal__rule--' + (id || '');

		// Remove all current rules
		if (document.getElementById(id)) {
			document.getElementById(id).parentNode.removeChild(document.getElementById(id));
		}

		element.id = id;
		element.innerHTML = '<style>' + rule + '</style>';

		// Append a new rule
		document.body.appendChild(element);
	};

	/**
	 * Scale the modal according to its custom width
	 */
	var _scale = function () {
		var element = CSSModal.activeElement;

		_currentMaxWidth = element.getAttribute('data-cssmodal-maxwidth');
		_currentMaxWidth = parseInt(_currentMaxWidth, 10);

		if (_currentMaxWidth) {
			_injectStyles('[data-cssmodal-maxwidth] .modal-inner {' +
				'max-width: ' + _currentMaxWidth + 'px;' +
				'margin-left: -' + (_currentMaxWidth / 2) + 'px;' +
			'}' +

			'[data-cssmodal-maxwidth] .modal-close:after {' +
				'margin-right: -' + (_currentMaxWidth / 2) + 'px !important;' +
			'}', element.id);
		}
	};

	var _scaleLower = function () {
		var innerWidth = global.innerWidth || document.documentElement.clientWidth;
		var element = CSSModal.activeElement;
		var closeButtonMarginRight = '-' + Math.floor(_currentMaxWidth / 2);

		// Skip if there is no max width or the window is wider
		if (!_currentMaxWidth || innerWidth > _currentMaxWidth) {
			return;
		}

		if (innerWidth < MODAL_SMALL_BREAKPOINT) {
			closeButtonMarginRight = 10;
		}

		// Window width minus margin left and right
		_margin = parseInt(element.getAttribute('data-cssmodal-margin'), 10) || _margin;
		_currentMaxWidth = innerWidth - (_margin * 2);

		_injectStyles('[data-cssmodal-maxwidth] .modal-inner {' +
			'max-width: ' + _currentMaxWidth + 'px;' +
			'margin-left: -' + (_currentMaxWidth / 2) + 'px;' +
		'}' +

		'[data-cssmodal-maxwidth] .modal-close:after {' +
			'margin-right: ' + closeButtonMarginRight + 'px !important;' +
		'}', element.id);
	};

	/**
	 * Plugin API
	 */
	var _api = {
		scaleMaxSize: _scale
	};

	/**
	 * Initial call
	 */
	var init = function (modal) {
		CSSModal = modal;

		/*
		 * Assign basic event handlers
		 */
		CSSModal.on('cssmodal:show', document, _scale);
		CSSModal.on('cssmodal:show', document, _scaleLower);

		CSSModal.on('resize', window, _scale);
		CSSModal.on('resize', window, _scaleLower);

		// Public API
		return _api;
	};

	/*
	 * AMD, module loader, global registration
	 */

	// Expose modal for loaders that implement the Node module pattern.
	if (typeof module === 'object' && module && typeof module.exports === 'object') {
		module.exports = _api;

	// Register as an AMD module
	} else if (typeof define === 'function' && define.amd) {

		define(['CSSModal'], init);

	// Export CSSModal into global space
	} else if (typeof global === 'object' && typeof global.document === 'object') {
		init(global.CSSModal);
	}

}(window));
