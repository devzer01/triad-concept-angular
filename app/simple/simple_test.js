'use strict';

describe('myApp.office module', function() {

  beforeEach(module('myApp.simple'));

  describe('office controller', function(){

    it('should ....', inject(function($controller) {
      //spec body
      var simpleCtrl = $controller('SimpleCtrl');
      expect(simpleCtrl).toBeDefined();
    }));

  });
});