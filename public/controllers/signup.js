angular.module('ForChange')
  .controller('SignupCtrl', function($scope, Auth, $location) {
    $scope.signup = function() {
      Auth.signup({
        username: $scope.displayName,
        email: $scope.email,
        password: $scope.password,
        anonymous: $scope.anonymous
      });
    };
    $scope.pageClass = 'fadeZoom';
  
  });