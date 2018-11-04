"use strict";

var urls = "{{ get }}";
var app = angular.module("useApp", []);
app.controller("useCtrl", function($scope, $http) {
	var nid = "1";
	$scope.doPost = function(rating) {
		console.log("yello");
		$http({
			url: 'use',
			method: "POST",
			data: {
				"card_id": nid,
				"rating" : rating									
			}
		}).then(function(response) {
			// Success
			$scope.refresh();
		}, 
		function(response) { // optional
				// failed
		});
	}
	$scope.refresh = function(){
		$http.get("/use_get").then(function(resp) {
			nid = (resp.data);
			$scope.card_id = nid;
			$http.get("http://localhost:8080/test/japanese?value=2").then(function(response) {
				$scope.hideAnswer=true;
				console.log($scope.showDetails);
				$scope.question = response.data.q;
				$scope.answer = response.data.a;
			});
		});
	}
	$scope.refresh();
});	