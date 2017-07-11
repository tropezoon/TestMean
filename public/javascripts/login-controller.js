(function(){
	'use strict';
	
	angular.module('continental')
		.controller('LoginCtrl', LoginCtrl);
		
	LoginCtrl.$inject = ['$scope', 'ContinentalService', '$auth', '$window'];
	
	function LoginCtrl($scope, ContinentalService, $auth, $window){
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
						vm.groupsData = {};
				});
		}
		
		//ESTA FUNCIÓN NO PASA POR FACTORY
		vm.loginLdapToken = function(){
			var data = {'username': vm.inputUser, 'password': vm.inputPass};
			$auth.login({
				username: data.username,
				password: data.password
			})
			.then(function(data){
				// Si se ha logueado correctamente, lo tratamos aquí.
				// Podemos también redirigirle a una ruta
				//$window.location.href = "/test_entro";
				vm.userData = data.data;
				$window.localStorage.setItem('testMean_superTok', vm.userData.token);
				//console.log($window.localStorage);
			})
			.catch(function(response){
				console.log(response);
			});
		}
		
		vm.logout = function(){
			$auth.logout()
				.then(function(){
					//$window.location.href = "/";
				});
		}
		
		vm.isEmpty = function(value){
			return (value == null || value == "" || value == undefined);
		}
	}
}());
