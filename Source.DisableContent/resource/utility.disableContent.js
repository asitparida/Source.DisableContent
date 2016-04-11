﻿(function () {
    "use strict";

    angular.module('utility.disableContent', [])
     .directive("disableContent", ['$rootScope', '$parse', function ($rootScope, $parse) {
         var _focusDisables = {};
         var _focuProps = {};
         var _focusTypes = ['input', 'select', 'button', 'textarea', 'object'];
         return {
             restrict: 'AEC',
             link: function ($scope, elem, attr) {
                 var _rowId = $(elem).attr('id');
                 $scope.$watch(attr['disableContent'], function (newValue) {
                     if (newValue) {
                         _focuProps[_rowId] = { 'available': true, 'stack': [] };
                         /* GET LIST OF ALL ELEMENTS AS DEFINED IN _focusTypes */
                         _.each(_focusTypes, function (type) {
                             var elements = $(elem).find(type);
                             if (elements.length > 0) {
                                 _.each(elements, function (element) {
                                     var _eid = $(element).attr('id');
                                     if (typeof _eid == 'undefined' || _eid == null || _eid == '') {
                                         $(element).attr('id', _.uniqueId('elemid'));
                                         _eid = $(element).attr('id');
                                         $(element).attr('pxed', true);
                                     }
                                     _focuProps[_rowId].stack.push(_eid);
                                 });
                             }
                         });
                         /* PROCESS FOR TAGS WITH TABINDEX VALUE OTHER THAN -1 AND NOT A PART OF _focusTypes */
                         var elements = $(elem).find('[tabindex]');
                         if (elements.length > 0) {
                             _.each(elements, function (element) {
                                 var _tbindex = $(element).attr('tabindex');
                                 var _eid = $(element).attr('id');
                                 if (_tbindex != -1 && _.contains(_focusTypes, element.nodeName.toUpperCase()) == false && _.contains(_focuProps[_rowId].stack, _eid) == false) {
                                     var _eid = $(element).attr('id');
                                     if (typeof _eid == 'undefined' || _eid == null || _eid == '') {
                                         $(element).attr('id', _.uniqueId('elemid'));
                                         _eid = $(element).attr('id');
                                     }
                                     _focuProps[_rowId].stack.push(_eid);
                                 }
                             });
                         }
                         /* GET CURRENT TABINDEX STATE AND SERIALIZE IT */
                         _.each(_focuProps[_rowId].stack, function (_eid) {
                             _focusDisables[_eid] = $('#' + _eid).attr('tabindex') || 0;
                             $('#' + _eid).attr('tabindex', -1);
                         });
                     }
                     else if (newValue == false) {
                         if (typeof _focuProps[_rowId] !== 'undefined' && typeof _focuProps[_rowId].available !== 'undefined' && _focuProps[_rowId].available == true) {
                             _.each(_focuProps[_rowId].stack, function (eid) {
                                 var _origTabIndex = _focusDisables[eid];
                                 $('#' + eid).attr('tabindex', _origTabIndex);
                             });
                             _focuProps[_rowId].available = false;
                         }
                     }
                 });
             }
         };
     }])
})();