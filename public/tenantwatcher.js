/*
 *
 * Front end javascript functions for TENANT Watcher !
 *
 *
 * Alok Pepakayala (c)
 */
//alert("Loaded Script Succesfully !! ");
	'use strict';
	/* Controllers */

	/*
	* Function to get all notification objects
	*
	*/
	function NotificationCtrl($scope, $http) {
		$http.get('../notifications').success(function(data) {
			$scope.notifications = data;
		//console.log(data);
  	});


	$http.get('../tenants').success(function(data) {
		$scope.tenants = data;
      	//console.log(data);
  	});


	$http.get('../rooms').success(function(data) {
		$scope.rooms = data;
      	//console.log(data);
  	});

	$scope.orderPropNotifications = 'date';



	$scope.ShowRoomForId = function(par){
		if(par && $scope && $scope.rooms && $scope.rooms.length ){
			for (var i = $scope.rooms.length - 1; i >= 0; i--) {
				if ($scope.rooms[i]._id == par) {
					var R =  $scope.rooms[i].room +" @ "+$scope.rooms[i].hostel;
					return(R);
				};
			};
		}
	}

	$scope.ShowNameForId = function(par){
		if(par && $scope && $scope.tenants && $scope.tenants.length ){
			for (var i = $scope.tenants.length - 1; i >= 0; i--) {
				if ($scope.tenants[i]._id == par) {
					var R =  $scope.tenants[i].name_initial.name +"  "+$scope.tenants[i].name_initial.intial;
					return(R);
				};
			};
		}
	}

	$scope.Mad = function(id){
		$http.post('../',id).success(function(data) {
			console.log(data);
		});
	}

	$scope.makeroom = function(){
		var d = {
			"Proom":"T2",
			"Phostel":"Reddy Apt",
			"Pcapacity":3,
			"Ptariff":5500
		};
		$http.post('../makeroom',d).success(function(data) {
			console.log(data);
		});
	}
	}
