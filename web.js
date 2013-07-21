/*!
 * a10k - runtime
 * Copyright(c) 2013 alok pepakayala <unconfidential@ovi.com>
 * 
 *
 *
 *
 */

/**
 * Main requires
 *
 *
 */
var express = require("express");
var app = express();
app.use(express.logger());



/**
 * Tenant Watcher !
 *
 *
 * written by alok pepakayala (c)
 * unconfidential@ovi.com
 *
 *
 *
 *
 * Database schemas and methods.
 *
 */

 var mongoo = require('mongoose');
 var Schema = mongoo.Schema;



/*
 * Schema for storing tenant records
 *
 */
 var tenantSchema = new Schema({
 	name_initial:{
 		name:String,
 		intial: String,
 	},
 	date_month_year:{
 		date: Number,
 		month: Number,
 		year: Number,
 	},
 	pending_pays: Number,
 	room_record: Schema.Types.ObjectId,
 	contact: Number,
 	extras: Number,
 });



/*
 * Schema for storing room records
 *
 */
 var roomSchema = new Schema({
 	room: String,
 	hostel: String,
 	capacity: Number,
 	tariff: Number,
 });



/*
 * Schema for storing notification records
 *
 */
 var notificationSchema = new Schema({
 	tenant_record: Schema.Types.ObjectId,
 	room_record: Schema.Types.ObjectId,
 	notes: String,
 	date:{ type: Date, default: Date.now }, 
 });



/*
 * Schema for storing minion records
 *
 */
 var minionSchema = new Schema({
 	minion_last_notify:{
 		date: Number,
 		month: Number,
 		year: Number,
 	},
 	minion_action_stack: [String],
 	minion_display_stack: [String],
 	minion_memo: String,
 	minion_name: String,
 });



/*
 * Connection and compilation 
 *
 */
 mongoo.connect('mongodb://a10k:D0r1an_Gray@dharma.mongohq.com:10086/tenantwatcher');
 var tenantModel = mongoo.model('tenantModel',tenantSchema);
 var roomModel = mongoo.model('roomModel',roomSchema);
 var notificationModel = mongoo.model('notificationModel',notificationSchema);
 var minionModel = mongoo.model('minionModel',minionSchema);



/*
 * Creating a tenant
 *
 */
 var Create_Tenant = function(Pname,Pin,Pdate,Pmn,Pyr,Ppp,Proom_id,Pcontact,Px){
 	if ((typeof(Pname)=="string") && (typeof(Pin)=="string") && (typeof(Pdate)=="number") && (typeof(Pmn)=="number") && (typeof(Pyr)=="number") && (typeof(Ppp)=="number") && (typeof(Pcontact)=="number") && (typeof(Px)=="number")) {
 		var test_tenant =new tenantModel();
 		test_tenant.name_initial.name = Pname;
 		test_tenant.name_initial.intial = Pin;
 		test_tenant.date_month_year.date = Pdate;
 		test_tenant.date_month_year.month = Pmn;
 		test_tenant.date_month_year.year = Pyr;
 		test_tenant.pending_pays = Ppp;
 		test_tenant.room_record = Proom_id
 		test_tenant.contact = Pcontact;
 		test_tenant.extras = Px;
 		test_tenant.save(function(err){
 			if(err){
 				//sorry
 				//
 				//fail

 				return;
 			};
 			console.log("Saved Tenant: %s \n",Pname);
 			//done
 			//
 			//here

 		});
 	};
 };
 //Create_Tenant("alok","p",10,4,2013,0,"51eaa6f48facad5a04000001",9160299552,0);



 /*
 * Modify a tenant
 *
 */
 var Modify_Tenant = function(Pgiven_id,Pname,Pin,Pdate,Pmn,Pyr,Ppp,Proom_id,Pcontact,Px){
 	if ((Pgiven_id) && (typeof(Pname)=="string") && (typeof(Pin)=="string") && (typeof(Pdate)=="number") && (typeof(Pmn)=="number") && (typeof(Pyr)=="number") && (typeof(Ppp)=="number") && (typeof(Pcontact)=="number") && (typeof(Px)=="number")) {
 		var modifed = {
 			name_initial:{
 				name: Pname,
 				intial: Pin,
 			},
 			date_month_year:{
 				date: Pdate,
 				month: Pmn,
 				year: Pyr,
 			},
 			pending_pays: Ppp,
 			room_record: Proom_id,
 			contact: Pcontact,
 			extras: Px,
 		};
 		tenantModel.findByIdAndUpdate(Pgiven_id,modifed,null,function(err){
 			if(err){
				//sorry
				//
				//fail

				return;
			};
			console.log('Tenant Modified');
			//done 
			//
			//here

		});
 	};
 };
//Modify_Tenant("51eaf5a7d024a0a105000001","raj","anr",10,4,2013,0,"51eaa6f48facad5a04000001",9160299552,0);



/*
 * Showing all tenants
 *
 */
 var Show_All_Tenants = function(zres){
 	tenantModel.find({}, function (err, results) {
 		if (err) {
 			//sorry
 			//
 			//fail

 			return;
 		};
 		zres.send(results);
 	});
 };
 //Show_All_Tenants();



/*
 * Remove a tenant,make sure no notifications for given tenant id. (will cause serious errors otherwise)
 * Workaround is dont remove if pending pay is > 0
 *
 * @Param: tenant id
 *
 */
 var Remove_Tenant = function(Pgiven_id){
 	tenantModel.findById(Pgiven_id, function (err, tenant) {
 		if (err) {
 			//sorry
 			//
 			//fail

 			return;
 		};
 		if (tenant && tenant.pending_pays > 0) {
 			console.log("Not removing the tenant");
 			//pending notifications
 			//
 			//fail

 		} else if(tenant && tenant.pending_pays === 0){
 			tenant.remove(function(err){
 				if (err) {
 					//sorry
 					//
 					//fail

 					return;
 				};
 				console.log("Removed tenant");
 				//done
 				//
 				//here

 			});
 		} else {
 			//sorry
 			//
 			//fail

 			console.log("No such tenant found");
 		};
 	});
 };
 //Remove_Tenant("51ead9766d5ca21705000001");



/*
 * Creating a room,make sure room is unique
 *
 * 
 */
 var Create_Room = function(Proom,Phostel,Pcapacity,Ptariff){
 	if((typeof(Proom)=="string") && (typeof(Phostel)=="string") && (typeof(Pcapacity)=="number") && (typeof(Ptariff)=="number")){
 		var test_room = new roomModel();
 		test_room.room = Proom;
 		test_room.hostel = Phostel;
 		test_room.capacity = Pcapacity;
 		test_room.tariff = Ptariff;
 		test_room.save(function(err){
 			if (err) {
 				//sorry
 				//
 				//fail

 				return;
 			};
 			console.log("Saved Room %s in %s",Proom,Phostel);
 			//done 
 			//
 			//here

 		});
 	};
 };
 //Create_Room("xyz","abc",1,5000);



/*
 * Check if given room is unique
 *
 * @Param: room
 * @Param: hostel
 *
 */
 var Check_Room_Unique =function(Proom,Phostel){
 	roomModel.find({room:Proom,hostel:Phostel},function(err,finding){
 		if (err) {
 			//sorry
 			//
 			//fail

 			return;
 		} else if (finding.length > 0) {
 			//sorry
 			//
 			//fail

 			console.log("Already declared !");
 			return;
 		} else {
 			//done
 			//
 			//here

 			console.log("The given room/hostel is unique !");
 		};
 	})
 };
 //Check_Room_Unique("t1","reddy apt");



 /*
 * Check if given room is vacant
 *
 * @Param: room id
 *
 */
 var Check_Room_Vacant =function(Proom_id){
 	tenantModel.find({room_record:Proom_id},function(err,finding){
 		if (err) {
 			//sorry
 			//
 			//fail

 			return;
 		};
 		if (finding && finding.length == 0) {
 			//done
 			//
 			//here
 			console.log("Vacant !");

 		} else{
 			//sorry
 			//
 			//fail

 			console.log("Occupied ");
 		};
 	});
 };
//Check_Room_Vacant("51eada6f4ed2101c05000001");



/*
 * Remove a room,make sure room is vacant before doing this.
 *
 * @Param: room id
 *
 */
 var Remove_Room =function(Proom_id){
 	roomModel.findById(Proom_id,function(err,room){
 		if (err || !(room)) {
 			//sorry
 			//
 			//fail
 			console.log("No Such room.");
 			return;
 		};	
 		room.remove(function(err){
 			if (err) {
 				//sorry
 				//
 				//fail

 				return;
 			};
 			console.log("Removed the room");
 		})
 	});
 };
 //Remove_Room("51eaa692126b135904000001");



/*
 * Modify a room
 *
 * 
 */
 var Modify_Room = function(Proom_id,Proom,Phostel,Pcapacity,Ptariff){
 	if((Proom_id) && (typeof(Proom)=="string") && (typeof(Phostel)=="string") && (typeof(Pcapacity)=="number") && (typeof(Ptariff)=="number")){
 		var modifed = {
 			room: Proom,
 			hostel: Phostel,
 			capacity: Pcapacity,
 			tariff: Ptariff,
 		};
 		roomModel.findByIdAndUpdate(Proom_id,modifed,null,function(err){
 			if(err){
				//sorry
				//
				//fail

				console.log("No such room.");
				return;
			};
			console.log('Room Modified');
			//done 
			//
			//here

		});
 	};
 };
 //Modify_Room("51eaa6f48facad5a04000001","T2","reddy apt",1,2700);



/*
 * Showing all rooms
 *
 */
 var Show_All_Rooms = function(zres){
 	roomModel.find({}, function (err, results) {
 		if (err) {
 			//sorry
 			//
 			//fail

 			return;
 		};
 		zres.send(results);
 	});
 };
 //Show_All_Rooms();



/*
 * Creating a notification and also update pending pays,tenant and room records must be available.
 *
 * @Param: Tenant id
 *
 */
 var Create_Notification = function(Pgiven_id){
 	tenantModel.findOne({_id:Pgiven_id},function (err, tenant) {
 		if (err || !(tenant)) {
 			//sorry
 			//
 			//fail
 			return;
 		};
 		var test_notification = new notificationModel();
 		test_notification.tenant_record = tenant._id ;
 		test_notification.room_record = tenant.room_record;
 		test_notification.notes = "Please enter a note.. ";
 		test_notification.save(function(err){
 			if (err) {
				//sorry
				//
				//fail
				return;
			};
			console.log('Saved notification');	
			var new_pending_pays = tenant.pending_pays + 1;
			tenantModel.findByIdAndUpdate(tenant._id,{pending_pays:new_pending_pays},null,function(err){
				if(err){
					//sorry
					//
					//fail
					return;
				};
				console.log('Tenant pending pays Updated');
				//done 
				//
				//here

			});
		});
 	});
 };
//Create_Notification("51eaf5a7d024a0a105000001");



/*
 * Remove notification and update pending pays,must have the respective tenant record active.
 *
 * @Param: Notification id
 *
 */
 var Remove_Notification = function(PNotification_id){
 	notificationModel.findById(PNotification_id, function (err, notification) {
 		if (err || !(notification)) {
 			//sorry
 			//
 			//fail

 			console.log("No Notification !!");
 			return;
 		};
 		tenantModel.findById(notification.tenant_record,function(err,tenant){
 			if (err || !(tenant)) {
 				//sorry
 				//
 				//fail

 				console.log("No tenant !!");
 				return;
 			};
 			var new_pending_pays = tenant.pending_pays - 1;
 			tenantModel.findByIdAndUpdate(notification.tenant_record,{pending_pays:new_pending_pays},null,function(err){
 				if(err){
 					//sorry
 					//
 					//fail

 					return;
 				};
 				console.log('Tenant pending pays Updated');
 				notification.remove(function(err){
 					if (err) {
 						//sorry
 						//
 						//fail

 						return;
 					};
 					console.log("Notification Removed !");
 					//done
 					//
 					//here

 				});
 			});
 		});
 	});
 };
//Remove_Notification("51eafb42383529b605000001");



/*
 * Modify notification,returns success even if not done.
 *
 * @Param: Notification id
 * @Param: New message
 *
 */
 var Modify_Notification = function(PNotification_id,updated_note){
 	notificationModel.findByIdAndUpdate(PNotification_id,{notes:updated_note},null,function(err){
 		if (err) {
 			//sorry
 			//
 			//fail

 			return;
 		}else{
 			console.log("Updated Note");
 			//done
 			//
 			//here
 		};
 	});
 };
 //Modify_Notification("51eaca53541b57e404000001","New note 2");



/*
 * Showing all notifications
 *
 */
 var Show_All_Notifications = function(zres){
 	notificationModel.find({}, function (err, results) {
 		if (err) {
 			//sorry
 			//
 			//fail

 			return;
 		};
 		zres.json(200,results);
 		
 	});
 };
 //Show_All_Notifications();













/**
 * Handlers
 *
 */

 //app.use(express.bodyParser());

 app.get('/tenants', function(req, res){
 	Show_All_Tenants(res);
 });
 app.get('/rooms', function(req, res){
 	Show_All_Rooms(res);
 });
 app.get('/notifications', function(req,res){
 	Show_All_Notifications(res);
 });

/*app.post('/',function(req,res){

	console.log(req.body.abc);

});*/








app.get('/', function(request, response) {
	response.send('Hello World!');
});












/**
 * Listeners
 *
 */
var port = process.env.PORT || 5000;
app.listen(port, function() {
	console.log("Listening on " + port);
});
