(function(){
	'use strict';
	
	angular.module('continental')
		.controller('RegCtrl', RegCtrl);
		
	RegCtrl.$inject = ['$scope', 'ContinentalService'];
	
	function RegCtrl($scope, ContinentalService){
		var vm = this;
		vm.model = {};
		
		vm.inputKey = null;
		
		vm.submitKey = function(){
			var data = {'key': vm.inputKey};
			ContinentalService.searchRegedit(data)
				.then(function(response){
						vm.model = response.data;
					}, function(response){
						console.log(response);
						vm.model = response;
				});
		}
		
		vm.isEmpty = function(value){
			return (value == null || value == "" || value == undefined);
		}
	}
}());