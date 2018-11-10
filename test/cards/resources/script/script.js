"use strict";

var urls = "{{ get }}";
var app = angular.module("useApp", []);
app.controller("useCtrl", function($scope, $http) {
	var nid = "1";
	$scope.doPost = function(rating) {
		console.log("yello");
		$http({
			url: "db?value=" + nid + "," + rating,
			method: "GET"
		}).then(function(response) {
			// Success
			$scope.refresh();
		}, 
		function(response) { // optional
				// failed
		});
	}
	$scope.refresh = function(){
		$http.get("db").then(function(resp) {
			nid = (resp.data);
			$scope.card_id = nid;
			console.log("http://localhost:8080/test/japanese?value=" + nid)
			$http.get("http://localhost:8080/test/japanese?value=" + nid).then(function(response) {
				$scope.hideAnswer=true;
				$scope.question = response.data.q;
				$scope.answer = response.data.a;
			});
		});
	}
	$scope.$on('parentmethod', function (event, args) {
		$scope.refresh();
	})
	$scope.refresh();
});

app.controller('myCtrl', function($scope, $rootScope, $http) {
	$scope.myFunc = function() {
		$http.get("db?value=japanese")
		$rootScope.$broadcast('parentmethod', { message: "Hello" });
	};
});