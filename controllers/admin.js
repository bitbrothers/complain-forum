var Complaint = require('../models/Complaint');
var User = require('../models/User');
var datas = require('../data');

exports.changeToStaff = function(req, res, next){
	User.findById(req.user._id,function(err, user){
		if(err)
			res.send(err);
		else if(!user){
			res.status(404).send(datas.unf);
		}
		else{
			if(user.role == "admin"){
				User.findOne({'profile.slug':req.params.uslug},function(err, user1){///user to be made staff send slug in req.params.uslug
					if(err)
						res.send(err);
					else if(!user){
						res.status(404).send(datas.unf);
					}
					else{
						if(user1.role == "admin"){
							res.status(412).send('User already Admin');
						}
						else {
							if(req.body.result == true){
								user1.role = "staff";
								user1.save(function(err,newuser1){
									if(err)
										res.send(err);
									else{
			                            req.promote = true;
			                            req.to = newuser1.email;
			                            req.subject = "ForChange Role Promotion";
			                            req.email = "You have been promoted to Staff by the current Admin";
			                            next();
									}
								});
							}
							else if(req.body.result == false){
								user1.role = "citizen";
								user1.save(function(err,newuser1){
									if(err)
										res.send(err);
									else{
										req.demote = true;
			                            req.to = newuser1.email;
			                            req.subject = "ForChange Role Demoted";
			                            req.email = "You have been demoted to Citizen by the current Admin";
			                            next();
									}
								});

							}
								else{
									res.status(412).send('Result Not Sent');
								}	
						}
	
					}
				});
			}
			else{
				res.status(401).send('Un-Authorized');
			}
		}
	});
};

exports.changeComplaintStatus = function(req, res, next){
	User.findById(req.user._id,
		function(err, user){
		if(err)
			res.send(err);
		else if(!user){
			res.status(404).send(datas.unf);
		}
		else{
			Complaint.findOne({
				slug:req.params.cslug
			},function(err, complaint){
				if(err)
					res.send(err);
				else if(!complaint){
					res.status(404).send(datas.cnf);
				}
				else{	
					if(user.role == "admin" || user.role == "staff"){
						if(req.body.status){
							//if(req.body.status == "new" || req.body.status == "pending" || req.body.status == "resolved" || )
							complaint.status = req.body.status;
							for(var i = 0;i <= complaint.followers.length-1;i++){
			                    User.findById(complaint.followers[i]._id,function(err, user1){
			                        if(err)
			                            res.send(err);
			                        else if(!user){
			                            console.log(datas.unf);
			                        }
			                        else{
			                            user1.log.push({
			                                entry:"Complaint Status Updated -"+ complaint.title + "--" + complaint.status
			                            });
			                            user1.save(function(err){
			                            	if(err)
			                            		res.send(err);
			                            });
			                        }
			                    });
			                };
							complaint.save(function(err ,newcomplaint){
								if(err)
									res.send(err);
								else{
									req.status = true;
									req.email = "Complaint -" + complaint.title + " status has been changed to " + complaint.status +"\n Unfollow to stop recieving email notifications for this complaint";
									req.followers = newcomplaint.followers;
									next();
								}
							});
						}
						else{
							res.status(412).send('Status Not Sent');
						} 
					}

                    else if(complaint.status == "resolved"){
                        complaint.status = "unresolved";
                        for(var i = 0;i <= complaint.followers.length-1;i++){
		                    User.findById(complaint.followers[i]._id,function(err, user1){
		                        if(err)
		                            res.send(err);
		                        else if(!user){
		                            console.log(datas.unf);
		                        }
		                        else{
		                            user1.log.push({
		                                entry:"Complaint Status Updated -"+ complaint.title + "--" + complaint.status
		                            });
		                            user1.save(function(err){
		                            	if(err)
		                            		res.send(err);
		                            });
		                        }
		                    });
		                };
                        complaint.save(function(err, newcomplaint){
                            if(err)
                                res.send(err);
                            else{
                            	req.status = true;
								req.email = "Complaint -" + complaint.title + " status has been changed to " + complaint.status +"\n Unfollow to stop getting emails for this complaint";
								req.followers = newcomplaint.followers;
								next();
                            }
                        });
                    }

					else{
						console.log('here');
						res.status(401).send(datas.unauth);
					}
				}
			});
		}
	});
};

exports.makeFeatured = function(req, res){
	User.findById(req.user._id,function(err,user){
		if(err)
			res.send(err);
		else if(!user){
			res.status(404).send(datas.unf);
		}
		else{
			Complaint.findOne({slug:req.params.cslug},function(err,complaint){
				if(err)
					res.send(err);
				else if(!complaint){
					res.status(404).send(datas.cnf);
				}
				else{
					if(user.role == "admin" || user.role == "staff"){
						if(req.body.result === true){
                          Complaint.find({featured:true}).count(function(err,count){
                                                          console.log(count);

                            if(err)
                              res.send(err);
                            else if(count>=3){
                              res.status(412).send('Cant make more featured');
                            }
                            else{
                              if(complaint.featured == true){
									res.status(412).send('Complaint Already featured');
								}
								else{
									complaint.featured = true;
									complaint.save(function(err){
										if(err)
											res.send(err);
										else{
											res.json({
												message:'Successfully added featured'
											});
										}
									});
								}
                            }
                          });
						}
						else if(req.body.result === false){
							if(complaint.featured == false){
								res.status(412).send('Complaint Not Featured');
							}
							else{
								complaint.featured = false;
								complaint.save(function(err){
									if(err)
										res.send(err);
									else{
										res.json({
											message:'Successfully removed featured'
										});
									}
								});
							}
						}
						else{
							res.status(412).send('Result Not Found');
						}
					}
					else{
						res.status(401).send(datas.unauth);
					}
				}
			});
		}
	});
};
