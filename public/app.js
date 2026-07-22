var app = angular.module('brickbloomSite', []);

app.controller('mainController', function ($scope, $http) {
  $scope.formats = [];
  $scope.sourcingHubs = [];
  $scope.qualityNotes = [];
  $scope.overview = '';
  $scope.form = { name: '', email: '', company: '', message: '' };
  $scope.notice = '';

  $http.get('/api/market-intelligence').then(function (response) {
    $scope.formats = response.data.formats;
    $scope.sourcingHubs = response.data.sourcingHubs;
    $scope.qualityNotes = response.data.qualityNotes;
    $scope.overview = response.data.overview;
  });

  $scope.submitLead = function () {
    $http.post('/api/leads', $scope.form).then(function (response) {
      $scope.notice = response.data.message;
      $scope.form = { name: '', email: '', company: '', message: '' };
    }, function (error) {
      $scope.notice = error.data.message || 'We could not submit the request. Please try again.';
    });
  };
});
