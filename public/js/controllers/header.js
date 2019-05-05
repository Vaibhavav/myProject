angular.module('mean').controller('HeaderController', ['$scope', 'Global', 'SignOut', '$state','$cookieStore', function ($scope, Global, SignOut, $state,$cookieStore) {
    // $scope.global = Global;
    //
    // $scope.menu = [{
    //     "title": "Articles",
    //     "state": "articles"
    // }, {
    //     "title": "Create New Article",
    //     "state": "createArticle"
    // }];
    // $scope.userName = $cookieStore.remove('name');
    // if(!$scope.userName){
    //     $scope.SignOut();
    // }
    // $scope.isCollapsed = false;
    //
    // $scope.SignOut = function(){
    //     SignOut.get(function(response){
    //         if(response.status === 'success'){
    //             $cookieStore.remove('name');
    //             $cookieStore.remove('email');
    //             $scope.global = null;
    //             $state.go('SignIn');
    //         }
    //     });
    // }


}]);