'use strict';

var date = new Date();
var stamp = date.getHours() * 60 * 60;
stamp += date.getMinutes() * 60;
stamp += date.getSeconds();

var theory1 = [stamp / 8, stamp / 24];

angular.module('myApp.version', [
  'myApp.version.interpolate-filter',
  'myApp.version.version-directive'
]).value('version', theory1[0] + " --- " + theory1[1]);
