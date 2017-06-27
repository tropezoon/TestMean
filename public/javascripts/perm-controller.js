(function(){
	'use strict';
	
	angular.module('continental')
		.controller('PermisosCtrl', PermisosCtrl);
		
	PermisosCtrl.$inject = ['$scope', 'ContinentalService'];
	
	function PermisosCtrl($scope, ContinentalService){
		var vm = this;
		vm.model = {};
		
		vm.gridOptions = {
			enableRowSelection: false,
			enableRowHeaderSelection: false,
			multiSelect: false,
			enableHorizontalScrollbar: 0,
			enableVerticalScrollbar: 2,
			data: [],
			columnDefs: [
				{name: "Elemento", field: "Elem"}
			]
		};
	}
}());




