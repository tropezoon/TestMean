(function(){
	angular.module('continental')
		.config(['$routeProvider', function config( $routeProvider ) {
			$routeProvider.when('/', {
				controller: 'MainCtrl',
				templateUrl: 'form.html'
			});
			$routeProvider.when('/users', {
				controller: 'MainCtrl',
				templateUrl: 'users.html'
			});
		}]);
}());