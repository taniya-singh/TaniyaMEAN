
var app=angular.module('myApp',["ui.router","ngFileUpload","checklist-model","ngTable"]);
app.config(function($stateProvider,$urlRouterProvider,$httpProvider)
{
	$stateProvider
	.state("index",{
		url:"/",
		templateUrl:"index.html"
		//controller:"myCtrl"

	}) 

	.state("login",{
		url:"/login",
		templateUrl:"login.html",
		controller:"loginctrl"
	})
	.state("signup",{
		url:"/signup",
		templateUrl:"signup.html",
		controller:"signupctrl"
	}) 
	.state("profile",{
		url:"/profile",
		templateUrl:"profile.html",
    controller:"profilectrl"
		})
	.state("admin",{
		url:"/admin",
		templateUrl:"admin.html",
		controller:"adminctrl"
	})
  .state("page1",{
    url:"/page1",
    templateUrl:"page1.html",
    controller:"adminctrl"
  })
  .state("page2",{
    url:"/page2",
    templateUrl:"page2.html",
    controller:"page2"
  })
	$urlRouterProvider.otherwise('index')
   

});



 app.controller('page2', function($scope, $rootScope) 
 {
       
      
      

      });
app.controller('loginctrl',function($scope,$http,$location)
{
	
	$scope.login=function()
    	{
    		
        	$http.post('/login', $scope.log).
        	success(function(data)
        	{
        		if(data.message=="user loged in")
        		{
        			console.log("loggggged in ", data);
          			$location.url("/profile");
				    }
            if(data.message=="login as admin")
            {
              console.log("loged in as admin");
              $location.url("/admin");
            }
				   if(data.message=="" || data.message==undefined)
    				{
    					console.log("try again")
              $location.url("/index");
    				}
          }).error(function(data)
        	{
          			console.log("not logged in ", data);
        	})
      	}
      
	
})

app.controller('signupctrl',function($scope,$http)
{

	$scope.signup = function()
	{
		console.log("hehe in angular");
		$http.post('/signup',$scope.formdata).
		success(function(data)
    	{ 
        	console.log("successfully logged in");
        	if(data)
        	{
          		$scope.successmsg=data.message;
			}
        	else
        	{
          		$scope.errormsg=data.message;
        	}

    	}).error(function(data)
     	 {
     	 	console.log("try again");
       		$scope.errormsg=data.message;
      	})
  
   }
});
var charCode
var len 
     
  app.controller('profilectrl',function($scope,$http,Upload)
  {
      console.log("hi in profilectrl")
      $scope.myFunct = function (e, myValue)
        {
          charCode = (e.which) ? e.which : e.keyCode; 

          console.log("name is", myValue);
          if(!(charCode==undefined || charCode==""))
            {
              
                $scope.$on('$locationChangeStart', function( event )
                {
                  var answer = confirm("Are you sure you want to leave this page?")
                  if (!answer)
                  {
                    event.preventDefault();

                  }else
                  {
                    charCode="";
                  }
                }); 
              
            }
            
        }
  });
      
      
      

  



var det;
app.controller('adminctrl',function($scope,$http,NgTableParams,$window)
  {
    $scope.active='true'
    $scope.status = "all";
    $scope.sortType='';
    $scope.sortOrder = undefined;
    $scope.showloader = true;
    $scope.selectenable = false;
    $scope.checkAll = {};
    sortOrder:$scope.sortOrder;

    $scope.selectedEmployee = {
        employee: []
    };
    $scope.selectedAction = 0;
    $(document).ready(function(){
        $("body").removeClass("events");
    });

     $scope.getIcon = function(column) {
    
            if ($scope.sortType == column) {
              
              return $scope.sortOrder == 1
              ? 'fa-caret-up'
                : 'fa-caret-down';
            }
            return 'fa-sort';
    }

     $scope.getuser = function() 
     {
      //  $scope.showloader = true;
        //if ($scope.sortType == '') {
          //  $scope.sortType = 'created_date';
           // $scope.sortOrder = -1;
       // }
        
        $scope.tableParams = new NgTableParams({
            count: ($scope.count) ? $scope.count : 10,
            page: ($scope.pageNum) ? $scope.pageNum : 1
        }, {
            getData: function(params) {
                $scope.pageNum = params.page(); 
                return $http.post("/getuser",
                 {
                    count: params.count(),
                    page: params.page(),
                    status:$scope.status,
                    //search: search,
                    //status:$scope.status,
                    //owner_id: SessionService.currentUser._id,
                   // role: SessionService.currentUser.roles[0]
                }).then(function(response) {
                  $scope.showloader = false;
           //         $scope.visibility = true
                    params.total(response.data.total); // recal. page nav controls
                    $scope.empData = response.data.data;
                    $scope.totalRecords = response.data.total;
                    $scope.count = params.count();

             //       $scope.haveResult = true;
               //     if (!response.data.total) {
                 //       $scope.haveResult = false;
                   // }
                    return $scope.empData;
                })
            }
        });
    }
    $scope.reset_page=function() {
        $scope.pageNum = 1;
        $scope.getuser();
    }

      $scope.checkAll.val= false;
    $scope.selectAllGroup = function(check) {
      console.log("hi in select all group",check);
            $scope.flag = {};
            $scope.flag.enable = false;
            if (check) {
              console.log("hi in if");
                $scope.selectedEmployee.employee = $scope.empData.map(function(item) {
                  //console.log("inside function",item)
                    return item._id;
                });
                $scope.selectenable = true;
            } else {
              console.log("hi in else")
                $scope.selectedEmployee.employee = [];
                $scope.checkAll.val= false;
                $scope.selectenable = false;
            }
    }

$scope.chk_status=function(newValue){
  console.log("hello in check status")
        if(newValue=='true'){
            $scope.empData=$scope.activedata;
        }
        else if(newValue=='false'){
              $scope.empData=$scope.inactivedata;
        }
        else{
            $scope.empData=$scope.all_Data;
        }
        $scope.getuser();
        $scope.$apply();
    }
 

    $scope.update_status=function($index,data) {
      $scope.detail=$index;
        $http.post("/updatestatus",$scope.detail).
        success(function(response) {
          console.log(response.data)
            if(response.data){
              console.log("helloo")
                $scope.getuser();
                /*$window.location.reload();*/
            
                //toastr.success("Successfully updated.");
                
            }
        }).error(function(err)
        {
          console.log("err");
        })
    }

$scope.performAction = function() {
  console.log("in perform action")
        $scope.selectedAction = selectedAction.value;
        console.log("selectaction",selectedAction.value)
        
        
        if ($scope.selectedAction == 0) {
            toastr.error("Please select some selection.");
        }else if ($scope.selectedEmployee.employee.length == 0) {
            toastr.error("Please select atleast one checkbox.");
        }
        
        if ($scope.selectedAction != 0 && $scope.selectedAction == 1 && $scope.selectedEmployee.employee.length > 0) {
            $scope.enbl = true;
        }else if ($scope.selectedAction != 0 && $scope.selectedAction == 2 && $scope.selectedEmployee.employee.length > 0) {
            $scope.enbl = false;
        }else if ($scope.selectedAction != 0 && $scope.selectedAction == 3 && $scope.selectedEmployee.employee.length > 0) {
            $scope.cnfrm_pwd($scope.selectedEmployee.employee);
        }
        
        
        if( $scope.selectedEmployee.employee.length > 0 && $scope.selectedAction > 0 && $scope.selectedAction < 3){
            $http.post("/enableemployees", {
                'enabled': $scope.enbl,
                'allChecked': $scope.selectenable,
                "employee": $scope.selectedEmployee.employee
            }).then(function(response) {
              console.log("the response is",response)
                $scope.empData = response.data.data;
                //angular.element('#selectedAction').val(0);
                $scope.getuser();
                $scope.successmsg="updated successfully"
                //toastr.success("Successfully updated.");
                $scope.selectedEmployee.employee = [];
                $scope.checkAll.val = false;
            })
        }

    }
    $scope.bulkaction=function()
    {
      $scope.detail=$scope.selectedEmployee.employee;
      
      $http.post('/bulkaction',$scope.detail).
      success(function(response){
        $scope.empData = response.data;
        $scope.getuser();
        $scope.successmsg="updated successfully"
        $scope.selectedEmployee.employee = [];
        $scope.checkAll.val = false;

      }).error(function(data){
        console.log("try again");
      })

    }

    $scope.deleteuser=function(detail)
    {
      //var befkuf=detail.email
      console.log("here in delete",detail);
      $scope.detail=detail;
      $http.post('/deleteuser',$scope.detail).
      success(function(data)
      {
        $scope.successmsg=false;
        $scope.errormsg=false;
        if(data.status==true)
        {
           console.log("deleted ");
           $scope.successmsg=data.message;

        }
        else
        {
          $scope.errormsg=data.message;
        }
       
      }).error(function(data)
      {
        console.log("sorry");
      })
    }
    $scope.select=function(modell)
    {
      $scope.modell=modell;

    }

    $scope.upuser=function(modell)
    {
      console.log("hello in upuser",modell)
    
      $http.post('/updateuser',$scope.modell).
      success(function(data)
      {
          /*$scope.modell=data */
        $scope.errormsg=false;
        $scope.successmsg=false;

        console.log(data);

        

        if(data.success)
        {
        $scope.successmsg_update=data.message;
        }
        else
        {
        console.log("product dsnt exists,Try Again");
        }
        $window.location.reload();
      }).error(function(data)
        {
        console.log("try again");
        $window.location.reload();
        })
     }





});


  

  