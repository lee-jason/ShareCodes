(function(){
	var app = angular.module('sharer', ['ngResource']);
	
	app.controller('appController', ['Email', function(Email){
		var self = this;
		this.haveEmails = [];
		this.wantEmails = [];
		
		var getHaveEmails = function(){
			Email.haveEmail.get().$promise.then(function(emails){
				self.haveEmails = emails;
			});
		}
		var getWantEmails = function(){
			Email.wantEmail.get().$promise.then(function(emails){
				self.wantEmails = emails;
			});
		}
		
		getHaveEmails();
		getWantEmails();
	}]);
	
	app.factory('Email', ['$resource', function($resource){
		return {
			haveEmail: $resource('/haveEmails', '', {'get': {isArray: true}}),
			wantEmail: $resource('/wantEmails', '', {'get': {isArray: true}})
		};
	}]);
	
	app.directive('tooltip', ['$timeout', function($timeout){
		return{
			restrict: 'A',
			link: function(scope, elem, attr){
				console.log($(elem));
				$timeout(function(){
					$(elem).tooltip();
				}, 200)
			}
		};
	}]);
})();