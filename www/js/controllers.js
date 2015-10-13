

angular.module('starter.controllers', [])

.controller('SigninCtrl',function($scope, $http,$ionicLoading,$ionicPopup,$cordovaSQLite,chatappdb,socket) {


 var token = window.localStorage.getItem("token");
 var userdata = window.localStorage.getItem("userdata");

 if(token!=null  )
	{
	var data=JSON.parse(userdata);
	console.log(data['email']);
 
	
    socket.emit('join', data['email']);

 
	window.location.href='#/tab/chats';

	}
// Alert popup code

$scope.showAlert = function(msg) {

   var alertPopup = $ionicPopup.alert({


      template: msg,

   });

   alertPopup.then(function(res) {

      console.log('Thanks');

   });

};




$scope.signin = function() {

  $scope.tabcontain=true;
    var email =$scope.email;
    var password=$scope.password;
 $ionicLoading.show({
                template: 'Signing Up...'
            });
    if(email && password && email!='' && password!='')
    {



			 $http({
				method: "POST",	
	      url: 'http://chatapp.verifiedwork.com/webservices/login.php',
				data: {"email":email,"password":password}
	    }).success(function(result) {
				if(result.code=='400')
				{


				$scope.showAlert(result.msg);
				
				}
				else if(result.code=='200')
				{
		
 				chatappdb.user_add(result.token,result.data);
				console.log(result.data['email']);
			    socket.emit('join', result.data['email']);
 				window.localStorage.setItem("token", result.token);
                window.localStorage.setItem("userdata", JSON.stringify(result.data));
				window.location.href='#/tab/chats';
				
				}	
				 $ionicLoading.hide();	
	    }).error(function(data, status, headers, config) {
					$scope.showAlert('Network Error');
					$ionicLoading.hide();
	    });





   	 }
    	else
   	 {

	 $scope.showAlert('Both email and password needed');
 	 $ionicLoading.hide();
    	 }
	
  }


})



.controller('chatappCtrl', function($scope) {
var user=window.localStorage.getItem("userdata");
var user_id=user.id;
console.log(user);
})




.controller('ChatsCtrl', function($scope,$ionicLoading, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
$ionicLoading.show({
                template: 'loading...'
            });
 Chats.all().then(function(data) {
        $scope.chats= data;
		$ionicLoading.hide();
    });



  //$scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };

})




.controller('ChatDetailCtrl', function($scope, $stateParams,$ionicLoading, Chats) {

$ionicLoading.show({
                template: 'loading...'
            });
 $scope.historys = [];


					
			
				
  $scope.chat = Chats.get($stateParams.chatId);
  Chats.history().then(function(data) {
       // $scope.historys=data;
        $ionicLoading.hide();
    });

	$scope.sendMessage = function (textMessage) {

    $scope.historys.push({
      name: 'You',
      message: textMessage,
      time : getDateTime()
   });

      $scope.textMessage=null;

    }

})




.controller('AccountCtrl', function($scope,$cordovaSQLite,chatappdb,socket) {

$scope.logout = function() {
	var userdata = window.localStorage.getItem("userdata");
	var data=JSON.parse(userdata);
 socket.emit('leave', data['email']);
 window.localStorage.removeItem("token");
 window.localStorage.removeItem("userdata");
 $scope.remove_user();
 
}

$scope.remove_user = function() {
    chatappdb.remove_user().then(function(){
     console.log('user data cleared');
     window.location.href='#/';
     window.location.reload(true);
    });
  }

  

  
});


