(function(){
	'use strict';
	
	angular.module('continental')
		.controller('LoginCtrl', LoginCtrl);
		
	LoginCtrl.$inject = ['$scope', 'ContinentalService'];
	
	function LoginCtrl($scope, ContinentalService){
		var vm = this;
		vm.model = {};
		
		vm.inputUser = null;
		vm.inputPass = null;
		
		vm.userData = {};
		vm.groupsData = {};
		
		vm.submitLogin = function(){
			var data = {'username': vm.inputUser, 'password': vm.inputPass};
			ContinentalService.postLogin(data)
				.then(function(response){
						vm.userData = response.data;
					}, function(response){
						console.log(response);
						vm.userData = response;
				});
		}
		vm.busquedaSinBind = function(){		// <---------
			ContinentalService.searchSinBind()
				.then(function(response){
						vm.userData = response.data;
					}, function(response){
						console.log(response);
						vm.userData = {};
				});
		}
		
		vm.loginConLdap = function(){
			var data = {'username': vm.inputUser, 'password': vm.inputPass};
			ContinentalService.loginConLdap(data)
				.then(function(response){
						vm.userData = response.data;
						
						ContinentalService.userInGroups({'username':vm.inputUser})
							.then(function(response){
									vm.groupsData = response.data;
								}, function(response){
									//console.log(response);
									vm.groupsData = response;
							});
					}, function(err){
						//console.log(err);
						vm.userData = err;
				});
		}
		
		vm.isEmpty = function(value){
			return (value == null || value == "" || value == undefined);
		}
	}
}());
