var app = angular.module('myApp', ['onsen.directives']);

app.controller("ListCtrl", function(){
    this.num = friendsList.length;
    this.friends = friendsList;
});

app.controller("HomeCtrl", ["$http", function($http){
    this.friendsList={};
    
    ConnectToFB = function(){
        console.log('connect');
        var client_id = '1053296234745144'; //YOUR App ID or API Key
        var client_secret = '24deaa786c26530fbbfd3320ca25f5d9'; //// YOUR App Secret
        var redirect_uri = 'https://www.facebook.com/connect/login_success.html';  //// YOUR CALLBACK URL
        var display = 'touch';
        var authorize_url = "https://graph.facebook.com/v2.5/oauth/authorize?";
        authorize_url += "client_id=" + client_id;
        authorize_url += "&redirect_uri=" + redirect_uri;
        authorize_url += "&display=" + display;
        authorize_url += "&scope=publish_stream,offline_access";
        
         var ref = window.open(authorize_url, '_blank', 'location=yes');
        ref.addEventListener('loadstart', function(event)
        {
            var loc = event.url;
            if(loc.indexOf(redirect_uri + "?") >= 0)
            {
                ref.close();
                var result = loc.split("#")[0];
                var accessToken = result.split("&")[0].split("=")[1];
                
                var url = 'https://graph.facebook.com/v2.5/oauth/access_token?';
                    url += 'client_id=' + client_id;
                    url += '&client_secret=' + client_secret;
                    url += '&code=' + accessToken;
                    url += '&redirect_uri=' + redirect_uri;
        
                $http.post(url,null).success(function(data){
                    accessToken = data.split("&")[0].split("=")[1];
                    url = "https://graph.facebook.com/v2.5/me/taggable_friends?access_token=" + accessToken;
                    $http.get(url).success(function(data){
                        this.friendsList = data.data;
                        ons.navigator.pushPage('list.html',{});
                    });
                });
            }
        });
    }  
}]);

