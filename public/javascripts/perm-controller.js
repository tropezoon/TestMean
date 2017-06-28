(function(){
	'use strict';
	
	angular.module('continental')
		.controller('PermisosCtrl', PermisosCtrl);
		
	PermisosCtrl.$inject = ['$scope', 'ContinentalService'];
	
	function PermisosCtrl($scope, ContinentalService){
		var vm = this;
		vm.model = {};
		
		vm.delToken = null;
		
		/*vm.gridOptions = {
			enableRowSelection: false,
			enableRowHeaderSelection: false,
			multiSelect: false,
			enableHorizontalScrollbar: 0,
			enableVerticalScrollbar: 2,
			data: [],
			columnDefs: [
				{name: "Elemento", field: "Elem"}
			]
		};*/
		
		vm.getAllTokens = function(){
			ContinentalService.getAllTokens()
				.then(function(response){
						vm.model = response.data;
					}, function(response){
						console.log(response);
						vm.model = response;
				});
		}
		vm.deleteToken = function(){
			ContinentalService.delToken(vm.delToken)
				.then(function(response){
						vm.model = "Token borrado correctamente";
					}, function(response){
						console.log(response);
						vm.model = "Error borrado token: "+ response;
				});
		}
	}
}());




