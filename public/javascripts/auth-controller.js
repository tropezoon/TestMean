(function(){
	'use strict';
	
	angular.module('continental')
		.controller('AuthController', AuthController);
		
	AuthController.$inject = ['$auth','$location'];
	
	function AuthController($auth, $location){	
		var vm = this;	
		this.login = function(){
			$auth.login({
				email: vm.email,
				password: vm.password
			})
			.then(function(){
				// Si se ha logueado correctamente, lo tratamos aquí.
				// Podemos también redirigirle a una ruta
				$location.path("/test_entro");
			})
			.catch(function(response){
				// Si ha habido errores llegamos a esta parte
			});
		}
		this.logout = function(){
			$auth.logout()
			.then(function() {
				// Desconectamos al usuario y lo redirijimos
				$location.path("/")
			});
		}
	}
}());
