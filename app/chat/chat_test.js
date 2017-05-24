'use strict';

describe('myApp.chat module', function() {

  beforeEach(module('myApp.chat'));

  describe('office controller', function(){

    it('should ....', inject(function($controller) {
      //spec body
      var adminCtrl = $controller('ChatCtrl');
      expect(adminCtrl).toBeDefined();
    }));

  });
});