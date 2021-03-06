//Setting up route
angular.module('mean').config(['$stateProvider','$urlRouterProvider', function($stateProvider,$urlRouterProvider) {

    $urlRouterProvider.otherwise(function($injector, $location){
        $injector.invoke(['$state', function($state) {
            $state.go('404');
        }]);
    });
    $stateProvider
        .state('home',{
            url : '/',
            controller : 'mainController',
            templateUrl: 'views/main.html'
        })
        .state('SignIn',{
            url : '/signin',
            templateUrl: 'views/users/signin.html'
        })
        .state('SignUp',{
            url : '/signup',
            templateUrl: 'views/users/signup.html'
        })
        .state('dashboard', {
            url: "/dashboard",
            abstract: true,
            template: '<ui-view></ui-view>',
            ncyBreadcrumb: {
                label: 'Components'
            }
        })
        .state('dashboard.stats', {
            url: '/stats',
            controller : 'statsController',
            templateUrl: 'views/components/stats.html',
            ncyBreadcrumb: {
                label: 'Buttons'
            }
        })
        .state('articles',{
            url : '/article',
            controller : 'ArticlesController',
            templateUrl: 'views/articles/list.html'
        })
        .state('createArticle',{
            url : '/article/create',
            controller : 'ArticlesController',
            templateUrl: 'views/articles/create.html'
        })
        .state('editArticles',{
            url : '/article/{articleId}/edit',
            controller : 'ArticlesController',
            templateUrl: 'views/articles/edit.html'
        })
        .state('viewArticle',{
            url : '/article/{articleId}',
            controller : 'ArticlesController',
            templateUrl: 'views/articles/view.html'
        })
        .state('404',{
            templateUrl: 'views/404.html'
        });
}
]);

//Setting HTML5 Location Mode
angular.module('mean').config(['$locationProvider', function ($locationProvider) {
    $locationProvider.html5Mode(true);

}]);