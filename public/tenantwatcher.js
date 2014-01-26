        /**
	*
 	* Front end javascript functions for TENANT Watcher !
 	*
 	*
 	* Alok Pepakayala (c)
 	*/

'use strict';
/* Controllers */

/*
 * Room lobby page ng controller
 *
 */
 function lobbyControl($scope, $http) {

 	$scope.refreshView = function(){
 		$scope.adder = 1;
		$scope.checked = 1;
 		$scope.rooms ={};
 		$scope.tenants = {};
 		$http.get('../rooms').success(function(data) {
 			$scope.rooms = data;
 			$http.get('../tenants',{cache:false}).success(function(data) {
 				$scope.tenants = data;
 				for (var i = $scope.rooms.length - 1; i >= 0; i--) {
					//append occupants to room object here
					$scope.rooms[i]. occupants = $scope.tenantsPerRoom($scope.rooms[i]._id);
				};
			});
 		});
 	}

	$scope.tenantsPerRoom = function(roomId){
		var occupantCount = 0;
		if(roomId && $scope && $scope.tenants && $scope.tenants.length ){
			for (var i = $scope.tenants.length - 1; i >= 0; i--) {
				if ($scope.tenants[i].room_record == roomId) {
					occupantCount = occupantCount + 1;
				};
			};
		}
		return occupantCount;
	}

	$scope.getRoomStatus = function(occupants,capacity,checked){
		if (checked == 0) {
			return "info";
		};
		if (occupants ==0) {
			return "error";
		};
		if ( (capacity - occupants) == 0) {
			return "success";
		} else {
			return "warning";
		}
	}

	$scope.saveRoom = function(id,room,hostel,capacity,tariff){
		var temp = {
			"Proom_id":id,
			"Proom":room,
			"Phostel":hostel,
			"Pcapacity":capacity,
			"Ptariff":tariff
		};
		$http.post('../modifyroom',temp).success(function(data) {
			$scope.refreshView();
		});
	}

	$scope.removeRoom = function(id){
		var temp = {
			"roomID":id
		};
		$http.post('../removeroom',temp).success(function(data) {
			$scope.refreshView();
		});
	}

	$scope.Mad = function(id){
		$http.post('../',id).success(function(data) {
			console.log(data);
		});
	}

	$scope.makeRoom = function(room,hostel,cap,tar){
		cap = parseInt(cap);
		tar = parseInt(tar);

		var temp = {
			"Proom":room,
			"Phostel":hostel,
			"Pcapacity":cap,
			"Ptariff":tar
		};
		$http.post('../makeroom',temp).success(function(data) {
			$scope.newRoomRoom = "";
			$scope.newRoomHostel = "";
			$scope.newRoomCapacity = "";
			$scope.newRoomTariff = "";

			$scope.refreshView();
		});
	}



 	$scope.refreshView();
}
