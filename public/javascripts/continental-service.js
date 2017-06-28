(function(){
	'use strict';
	
	angular.module('continental')
		.factory('ContinentalService', ContinentalService);
		
	ContinentalService.$inject = ['$http'];
	
	function ContinentalService($http){
		var factory = {};
		
		//INDEX
		factory.getIndex = function(){
			return $http.get('/prueba');
		}
		factory.postIndex = function(username){
			return $http.post('/prueba', {'username': username});
		}
		
		//LOGIN
		factory.postLogin = function(data){
			return $http.post('/submitLogin', data);
		}
		
		factory.searchSinBind = function(){		// <-------
			return $http.post('/searchSinBind');
		}
		
		factory.loginConLdap = function(data){
			return $http.post('/loginConLdap', data);
		}
		
		factory.userInGroups = function(data){
			return $http.post('/userInGroups', data);
		}
		
		//REG
		factory.searchRegedit = function(data){
			return $http.post('/searchRegedit', data);
		}
		
		//PERMISOS
		factory.getAllTokens = function(){
			return $http.get('/token/getAll');
		}
		
		factory.delToken = function(data){
			return $http.post('/token/reject', {'refreshToken': data});
		}
	
		return factory;
	}
}());