(function(){
	'use strict';
	angular.module('continental', [
		'ngRoute',
		'satellizer'
	])
	
	/*.config(['$httpProvider', 'SatellizerConfig', function($httpProvider, conf) {
		conf.loginUrl = "loginLdapToken";
		conf.httpInterceptor = true;
        conf.tokenName = "superTok";
        conf.tokenPrefix = "testMean";
		
      $httpProvider.interceptors.push('interceptor', ['$q', function($q) {
		$log.debug(tokenName);
        return {
          request: function(httpConfig) {
            //if (localStorage.getItem(tokenName)) {
              httpConfig.headers['Authorization'] = 'Bearer ' + localStorage.getItem(tokenName);
            //}
            return httpConfig;
          },
          responseError: function(response) {
            if (response.status === 401) {
              localStorage.removeItem(tokenName);
            }
            return $q.reject(response);
          }
        };
      }]);
    }]);*/
	
	/*.config(function($httpProvider, $authProvider) {
		$authProvider.loginUrl = "loginLdapToken";
		$authProvider.httpInterceptor = true;
        $authProvider.tokenName = "superTok";
        $authProvider.tokenPrefix = "testMean";
		
		$httpProvider.interceptors.push(['$q', function($q) {
			var tokenName = $authProvider.tokenPrefix ? $authProvider.tokenPrefix + '_' + $authProvider.tokenName : $authProvider.tokenName;
			return {
				request: function(httpConfig) {
				var token = localStorage.getItem(tokenName);
					if (token && $authProvider.httpInterceptor) {
						token = $authProvider.authHeader === 'Authorization' ? 'Bearer ' + token : token;
						httpConfig.headers.authorization = token;
						//httpConfig.headers.Authorization = token;
					}
					return httpConfig;
				},
				responseError: function(response) {
					return $q.reject(response);
				}
			};
		}]);
		$httpProvider.interceptors.push(function($q) {
			return {
				'request': function(config) {
					var tokenName = $authProvider.tokenPrefix ? $authProvider.tokenPrefix + '_' + $authProvider.tokenName : $authProvider.tokenName;
					var token = localStorage.getItem(tokenName);
					//if (token){
						config.headers['authorization'] = token;
					//}
					return config;
				}
			};
		});
    });*/
	
	.factory('httpRequestInterceptor', ['$q', function($q){
		//var tokenName = $authProvider.tokenPrefix ? $authProvider.tokenPrefix + '_' + $authProvider.tokenName : $authProvider.tokenName;
		return {
			request: function(config){
				var token = localStorage.getItem("testMean_superTok");
				if (token) {
					//token = $authProvider.authHeader === 'Authorization' ? 'Bearer ' + token : token;
					token = 'Bearer '+ token;
					//config.headers['authorization'] = token;
				}
				return config;
			}
		};
	}])
	
	.config(function($authProvider, $httpProvider){
		$authProvider.loginUrl = "loginLdapToken";
		$authProvider.httpInterceptor = true;
		$authProvider.tokenName = "superTok";
		$authProvider.tokenPrefix = "testMean";
		
		$httpProvider.interceptors.push('httpRequestInterceptor');
	});
}());

