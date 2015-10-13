var app =angular.module('starter.services', []);

app.factory('Chats', function($http,chatappdb) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = '';

  return {
  

     all: function() {
             //return the promise directly.
             return $http.get('http://chatapp.verifiedwork.com/webservices/userlist.php')
                       .then(function(result) {
					  
                            //resolve the promise as the data
			    chats = JSON.parse(JSON.stringify(result.data));
			    app.value('chats',chats);
				//chatappdb.add_friends(result.data);
                            return result.data;
                        });
        },
    history: function() {
             //return the promise directly.
             return $http.get('http://chatapp.verifiedwork.com/webservices/userlist.php')
                       .then(function(result) {
                            //resolve the promise as the data
			    var history = JSON.parse(JSON.stringify(result.data));
                            return history;
                        });
        },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },

	

    get: function(chatId) {
    
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id == parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})


.factory('DBA', function($cordovaSQLite, $q, $ionicPlatform) {
  var self = this;

  // Handle query's and potential errors
  self.query = function (query, parameters) {
    parameters = parameters || [];
    var q = $q.defer();

    $ionicPlatform.ready(function () {
      $cordovaSQLite.execute(db, query, parameters)
        .then(function (result) {
          q.resolve(result);
        }, function (error) {
          console.warn('I found an error');
          console.warn(error);
          q.reject(error);
        });
    });
    return q.promise;
  }

  // Proces a result set
  self.getAll = function(result) {
    var output = [];

    for (var i = 0; i < result.rows.length; i++) {console.log(result.rows.item(i));
      output.push(result.rows.item(i));
    }
    return output;
  }

  // Proces a single result
  self.getById = function(result) {
    var output = null;
    output = angular.copy(result.rows.item(0));
    return output;
  }

  return self;
})



.factory('chatappdb', function($cordovaSQLite, DBA) {
  var self = this;

  self.get_user = function() {
    return DBA.query("SELECT token,data FROM user")
      .then(function(result){
        return DBA.getAll(result);
      });
  }

 self.user_add = function(token,data) {
    var parameters = [token,data];
    return DBA.query("INSERT INTO user (token, data) VALUES (?,?)", parameters);
  }

 self.remove_user = function() {
   
    return DBA.query("DELETE FROM user");
  }
  
   self.add_friends = function(data) {
    var parameters = [data];
    return DBA.query("INSERT INTO friend_lists (data) VALUES (?)", parameters);
   }
  
  self.get_friends = function() {
    return DBA.query("SELECT data FROM friend_lists")
      .then(function(result){
        return DBA.getAll(result);
      });
  }
  

  return self;
})


.factory('socket', function socket($rootScope) {
  var socket = io.connect('http://localhost:3000');
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
})

