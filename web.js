/**
 * Tenant Watcher !
 *
 *
 * written by alok pepakayala (c)
 * unconfidential@ovi.com
 *
 *
 *
 * a10k - runtime
 * Database schemas and methods.
 *
 */

/*!
 *
 * Copyright(c) 2013 alok pepakayala <unconfidential@ovi.com>
 *
 *
 *
 *
 */

 var Hello_I_am ="Pingu";

 var express = require("express");
 var app = express();
 var mongoo = require('mongoose');
 var Schema = mongoo.Schema;
 var schedule = require('node-schedule'); // for cron like scheduling
 var rule = new schedule.RecurrenceRule(); //rule for cron like scheduling


 rule.hour = [1,3,5,7,9,11,13,15,17,19,21,23]; //cron times
 rule.minute = 0; //cron times

 //debug mode rule..
 //rule.hour = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
 //rule.minute = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59];

 //debug mode rule..
 //rule.second = [0,20,30,40,50];

 //not working app.use(express.favicon(__dirname + '/public/images/favicon.ico')); //Jan17,2014 from stackoveflow for favicon..
 //app.use(express.logger());
 app.use(express.bodyParser());
 app.enable('trust proxy');
 app.use('/media', express.static(__dirname + '/media'));
 app.use(express.static(__dirname + '/public'));









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
 * Check if given room is unique and make room
 *
 * @Param: room
 * @Param: hostel
 *
 */
 var Check_Room_Unique =function(Proom,Phostel,Pcapacity,Ptariff){
 	roomModel.find({room:Proom,hostel:Phostel},function(err,finding){
 		if (err) {
 			//sorry
 			//
 			//fail

 			return ;
 		} else if (finding.length > 0) {
 			//sorry
 			//
 			//fail

 			//console.log("Already declared !");
 			return ;
 		} else {
 			//done
 			//
 			//here

 			Create_Room(Proom,Phostel,Pcapacity,Ptariff);
 			//console.log("The given room/hostel is unique !");
 		};
 	})
 };
 //Check_Room_Unique("t1","reddy apt");



 /*
 * Check if given room is vacant and remove it !
 *
 * @Param: room id
 *
 */
 var Check_Room_Vacant =function(Proom_id,req,res){
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
 			Remove_Room(Proom_id,req,res);

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
 var Remove_Room =function(Proom_id,req,res){
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
 			res.send(req.body);
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
 		zres.json(results);

 	});
 };
 //Show_All_Notifications();



/**
 * Initiate Minion !!
 *
 * Manually intiate the minion before using the app
 *
 * makeMinion();
 *
 *
 *
 */
 var makeMinion = function(){
 	var Today = new Date();
 	var Tdate = Today.getDate();
 	var Tmonth = Today.getMonth() + 1;
 	var Tyear = Today.getFullYear();

 	var test_minion = new minionModel();

 	test_minion.minion_last_notify.date = Tdate - 1; // initiated with yesterdays date so today's cron can also be used !
 	test_minion.minion_last_notify.month = Tmonth;
 	test_minion.minion_last_notify.year = Tyear;
 	test_minion.minion_action_stack[0] = "Initiated";
 	test_minion.minion_display_stack[0] = "Initiated";
 	test_minion.minion_memo = "Empty, Please Insert Text memo here.. ";
 	test_minion.minion_name = Hello_I_am;

 	test_minion.save(function(err){
 		if (err) {
 			//sorry
 			//
 			//fail

 			return;
 		};
 		console.log("Initiated Minion !!");
 		//done
 		//
 		//here

 	});
 };
 //makeMinion();



 /*
 * Showing all Minions
 *
 */
 var Show_All_Minions = function(zres){
 	minionModel.find({}, function (err, results) {
 		if (err) {
 			//sorry
 			//
 			//fail

 			return;
 		};
 		zres.json(results);

 	});
 };
 //Show_All_Minions();

 /**
 * New Functions for date range
 *
 */
 Date.prototype.addDays = function(days) {
   var dat = new Date(this.valueOf())
   dat.setDate(dat.getDate() + days);
   return dat;
 }
 function getDates(startDate, stopDate) {
   var dateArray = new Array();
   var currentDate = startDate;
   while (currentDate <= stopDate) {
     dateArray.push(currentDate)
     currentDate = currentDate.addDays(1);
   }
   return dateArray;
 }


/**
 * Test
 *
 *
 var dateArray = getDates(new Date(1+'-'+24+'-'+2014), new Date());
 for (dRangeI = 0; dRangeI < dateArray.length; dRangeI ++ ) {

   console.log(dateArray[dRangeI].getDate());
 }*/


/**
 * The job to be done by scheduler and also on app start..
 *
 *
 */
 var fingerJob = function(){
	//Executes once per every 2 hrs !!
	var Today = new Date();
	var Tdate = Today.getDate();
	var Tmonth = Today.getMonth() + 1;
	var Tyear = Today.getFullYear();
	minionModel.findOne({"minion_name":Hello_I_am},function (err, minio) {
		if (err || !(minio)) {
 			// sorry
 			//
 			// fail

 			return;
 		};
 		//now check if minio last notify is not today and proceed...
 		if (minio.minion_last_notify.date == Tdate &&
 			minio.minion_last_notify.month == Tmonth &&
 			minio.minion_last_notify.year == Tyear) {
 		  	// Do Nothing !
 		  	//
 		  	// Already updated notifications for today !!

 		  } else{
 		  	/** copy new logic here..done **/
 		  	var dateArray = getDates(new Date(minio.minion_last_notify.month+'-'+minio.minion_last_notify.date+'-'+minio.minion_last_notify.year), new Date());
 		  	for (dRangeI = 0; dRangeI < dateArray.length; dRangeI ++ ) {
 		  		Today = dateArray[dRangeI];
 		  		Tdate = Today.getDate();
 		  		Tmonth = Today.getMonth() + 1;
 		  		Tyear = Today.getFullYear();
         //console.log(Tdate+" "+Tmonth+" "+Tyear);
         if (minio.minion_last_notify.date == Tdate &&
         	minio.minion_last_notify.month == Tmonth &&
         	minio.minion_last_notify.year == Tyear) {
 		  	// Do Nothing !
 		  	//
 		  	// Already updated notifications for today !!

 		  } else{
      		// Notification not updated today
 			//
 			// Update now !!

 			if (Tdate == 29 && Tmonth == 2){
 				// Ignore this
 				//
 				// Date !!

 				//return;
 			}else if (
 				(Tdate <= 27)||
 				((Tdate == 28)&&(Tmonth != 2))||
 				((Tdate == 29)&&(Tmonth != 2))||
 				(
 					(Tdate == 30)&&
 					((Tmonth == 1)||(Tmonth == 3)||(Tmonth == 5)||(Tmonth == 7)||(Tmonth == 8)||(Tmonth == 10)||(Tmonth == 12))
 					)||
 				(Tdate == 31)
 				){
 				// Normal dates
 				//
 				// Update for today only !!

 				tenantModel.find().where('date_month_year.date').equals(Tdate).exec(function(err,results){
 					if (err || !(results)) {
 						// sorry
 						//
 						// fail

 					};
 					for (var i = results.length - 1; i >= 0; i--) {
 							// Done
 							//
 							// here

 							Create_Notification(results[i]._id);
 						};
 					});
 			} else{
 				// 28 feb and months with only 30 days get here
 				//
 				// Update records with date as today and above

 				tenantModel.find().where('date_month_year.date').gte(Tdate).exec(function(err,results){
 					if (err || !(results)) {
 						//sorry
 						//
 						//fail

 					};
 					for (var i = results.length - 1; i >= 0; i--) {
 							// Done
 							//
 							// here

 							Create_Notification(results[i]._id);
 						};
 					});
 			};
 			// Update the minion record
 			//
 			// here !!

 			minio.minion_last_notify.date = Tdate;
 			minio.minion_last_notify.month = Tmonth;
 			minio.minion_last_notify.year = Tyear;
 			var mesg = "Updated Minion on " + Tdate + " - " + Tmonth + " - " + Tyear + " !!";
 			minio.minion_action_stack.push(mesg);
 			minio.save();
 		}

     }
 };
});
}

/**
 * Fingermen Job - cron like scheduled function
 *
 */
 var fingermen = schedule.scheduleJob(rule, fingerJob);



/**
 * Handlers
 *
 */
 app.get('/minions', function(req, res){
 	Show_All_Minions(res);
 });
 app.get('/tenants', function(req, res){
 	Show_All_Tenants(res);
 });
 app.get('/rooms', function(req, res){
 	Show_All_Rooms(res);
 });
 app.get('/notifications', function(req,res){
 	Show_All_Notifications(res);
 });
 app.post('/makeroom',function(req,res){
 	if ((req.body.Proom)&&(req.body.Phostel)&&(req.body.Pcapacity)&&(req.body.Ptariff)) {
 		Check_Room_Unique(req.body.Proom,req.body.Phostel,req.body.Pcapacity,req.body.Ptariff);
 		res.send(req.body);
 	};
 });
 app.post('/modifyroom',function(req,res){
 	if ((req.body.Proom_id)&&(req.body.Proom)&&(req.body.Phostel)&&(req.body.Pcapacity)&&(req.body.Ptariff)) {
 		Modify_Room(req.body.Proom_id, req.body.Proom, req.body.Phostel, parseInt(req.body.Pcapacity), parseInt(req.body.Ptariff));
 	};
 });
 app.post('/removeroom',function(req,res){
 	Check_Room_Vacant(req.body.roomID,req,res);//note that it also removes the room
 });
 app.post('/',function(req,res){
 	res.send(req.body);
 });




/**
 * Listeners
 *
 */
 var port = process.env.PORT || 5000;
 app.listen(port, function() {
    console.log("Listening on " + port);
    fingerJob(); //To perform the sceduled job also at startup..!
 });



console.log("TENENT WATCHER APP \nALOK PEPAKAYALA");