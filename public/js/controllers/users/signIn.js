angular.module('mean.auth').controller('signIn', ['$scope', '$window', 'Global', '$state', 'LogIn','$cookieStore', '$rootScope', function ($scope, $window, Global, $state, LogIn, $cookieStore,$rootScope) {
    $scope.global = Global;

    $scope.success = false;
    $scope.loginError = false;

    $rootScope.userName = $cookieStore.get('name');
    if($rootScope.userName){
        $scope.success = true;
        $scope.loginError = false;
        $scope.successMsg = 'Welcome back '+$scope.userName;
        $state.go('home');
    }

    $scope.signIn = function(user) {

        var logIn = new LogIn({
            email: user.email,
            password: user.password
        });

        logIn.$save(function(response) {
            console.log(response);
            if(response.status === 'success'){
                var expireDate = new Date();
                expireDate.setDate(expireDate.getDate() + 1);
                // Setting a cookie
                $cookieStore.put('name', response.name, {'expires': expireDate});
                $cookieStore.put('email', response.email, {'expires': expireDate});
                $scope.success = true;
                $scope.loginError = false;
                $scope.successMsg = response.message;
                $window.location.href = '/';
            }else{
                $scope.success = false;
                $scope.loginError = true;
                $scope.errorMsg = 'Wrong credentials';
            }
        });
    };


}]);