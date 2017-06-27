(function(){
	'use strict';
	
	angular.module('continental')
		.controller('MainCtrl', MainCtrl);
		
	MainCtrl.$inject = ['$scope', 'ContinentalService'];
	
	function MainCtrl($scope, ContinentalService){
		var vm = this;
		vm.model = {"inicio": "esto"};
		
		vm.campo1 = "";
		
		vm.llamadaTest = function(){
			if (vm.campo1 === "" || vm.campo1 === null){
				ContinentalService.getIndex()
					.then(function(response){
							vm.model = response.data;
						}, function(response){
							console.log(response);
							vm.model = {};
					});
			} else {
				ContinentalService.postIndex(vm.campo1)
					.then(function(response){
							vm.model = response.data;
						}, function(response){
							console.log(response);
							vm.model = {};
					});
			}
		}
	}
}());




