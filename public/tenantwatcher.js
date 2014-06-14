        /**
	*
 	* Front end javascript functions for TENANT Watcher !
 	*
 	*
 	* Alok Pepakayala (c)
 	*/

'use strict';
angular.module('tenantWatcher', ['ui.bootstrap']);
angular.module("lobby", []);
angular.module("people",[]);
angular.module("notif", []);
/* Controllers */


/*
 * start  page ng controller
 *
 */
function notifControl($scope, $http) {
 	$scope.refreshView = function(){
 		$scope.adder = 1;
		$scope.checked = 1;
 		$scope.rooms ={};
 		$scope.people = {};
 		$scope.notif = {};

 		$http.get('../notifications',{cache:false}).success(function(data) {
 			$scope.notif = data;
 		});	
 		$http.get('../tenants',{cache:false}).success(function(data) {
 			$scope.people = data;
 		});
 		$http.get('../rooms',{cache:false}).success(function(data) {
 			$scope.rooms = data;
 		});
 	}

 	$scope.formatRoom= function(roomId){
 		for (var i = $scope.rooms.length - 1; i >= 0; i--) {
			//fomat and return
			if ($scope.rooms[i]._id == roomId) {
				var rString = $scope.rooms[i].hostel+" - " +$scope.rooms[i].room +" ( " + $scope.rooms[i].tariff+" )";
				return rString;
			};
		};
 	}

 	$scope.getName = function(id){
  		for (var i = $scope.people.length - 1; i >= 0; i--) {
			//fomat and return
			if ($scope.people[i]._id == id) {
				return $scope.people[i].name_initial.name;
			};
		};
 	}
 	$scope.getInitial = function(id){
  		for (var i = $scope.people.length - 1; i >= 0; i--) {
			//fomat and return
			if ($scope.people[i]._id == id) {
				return $scope.people[i].name_initial.intial;
			};
		};
 	}

 	$scope.getStatus = function(m,y){
 		var Today = new Date();
		var Tmonth = Today.getMonth() + 1;
		var Tyear = Today.getFullYear();
		if (y < Tyear) {
			return "danger";
		};
		if (m == Tmonth) {
			return "success";
		};
		if (Tmonth - m  == 1 ) {
			return "active";
		}else{
			return "warning";
		}
 	}

 	$scope.remove = function(id){
 		var temp = {
			"Pgiven_id":id
		};
		$http.post('../remnot',temp).success(function(data) {
			$scope.refreshView();
		});
 	}

 	$scope.updateNote = function(id,n){
 		var temp = {
			"Pgiven_id":id,
			"Pnote":n
		};
		$http.post('../modnot',temp).success(function(data) {
			$scope.refreshView();
		});
 	}

 	$scope.refreshView();
}


/*
 * people  page ng controller
 *
 */
function peopleControl($scope, $http) {
 	$scope.refreshView = function(){
 		$scope.adder = 1;
		$scope.checked = 1;
 		$scope.rooms ={};
 		$scope.people = {};
 		$http.get('../tenants',{cache:false}).success(function(data) {
 			$scope.people = data;
 		});
 		$http.get('../rooms',{cache:false}).success(function(data) {
 			$scope.rooms = data;
 		});
 	}

 	$scope.formatRoom= function(roomId){
 		for (var i = $scope.rooms.length - 1; i >= 0; i--) {
			//fomat and return
			if ($scope.rooms[i]._id == roomId) {
				var rString = $scope.rooms[i].hostel+" - " +$scope.rooms[i].room;
				return rString;
			};
		};
 	}
 	$scope.updatePerson = function(oldId,newName,newInit,newContact,newRoomId,newDateY,newDateM,newDateD,newPendingPays){
		var temp = {
			"Pgiven_id":oldId,
			"Pname":newName,
			"Pin":newInit,
			"Pdate":newDateD,
			"Pmn":newDateM,
			"Pyr":newDateY,
			"Ppp":newPendingPays,
			"Proom_id":newRoomId,
			"Pcontact":newContact,
			"Px":0
		};
		$http.post('../changeten',temp).success(function(data) {
			$scope.refreshView();
		});
	}

	$scope.makePerson = function(newName,newInit,newContact,newRoomId,newDateY,newDateM,newDateD){

		var temp = {
			"Pname":newName,
			"Pin":newInit,
			"Pdate":newDateD,
			"Pmn":newDateM,
			"Pyr":newDateY,
			"Ppp":0,
			"Proom_id":newRoomId,
			"Pcontact":newContact,
			"Px":0
		};
		$http.post('../maketen',temp).success(function(data) {
			$scope.refreshView();
		});
	}

	$scope.setSelection = function(roomId){
 		for (var i = $scope.rooms.length - 1; i >= 0; i--) {
			// return room
			if ($scope.rooms[i]._id == roomId) {
				$scope.selectedOption = $scope.rooms[i];
				return;
			};
		};	
	}

	$scope.getStatus = function(pp){
		if (pp == 0) {
			return "active";
		};
		if (pp > 2) {
			return "danger";
		} else {
			return "warning";
		}
	}

	$scope.remove = function(pid){
		var temp = {
			"Pgiven_id":pid
		};
		$http.post('../remten',temp).success(function(data) {
			$scope.refreshView();
		});
	}

 	$scope.refreshView();
}



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
 		$http.get('../rooms',{cache:false}).success(function(data) {
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
			return "active";
		};
		if (occupants == 0 ) {
			return "danger";
		};
		if ( occupants >= capacity) {
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




/*
 * Date picker controll ,very minimalistic
 *
 */
function  pickAdate($scope) {
	$scope.today = function() {
		$scope.dt = new Date();
	};
	$scope.today();

	$scope.open = function($event) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.opened = true;
	};

};

