var angularfy = angular.module('angularfy', ['ui.bootstrap', 'ngRoute']);

// Lovingly borrowed from http://scotch.io/tutorials/javascript/single-page-apps-with-angularjs-routing-and-templating
// create the controller and inject Angular's $scope
angularfy.controller('mainController', function($scope) {

  // create a message to display in our view
  $scope.message = 'Everyone come and see how good I look!';
});

// create the controller and inject Angular's $scope
angularfy.controller('locController', function($scope) {

  // create a message to display in our view
  $scope.message = 'So, you want a LOC';
});

// create the controller and inject Angular's $scope
angularfy.controller('loanController', function($scope) {

  // create a message to display in our view
  $scope.message = 'So, you want a loan';
});

angularfy.config(function($provide, $routeProvider) {
  $routeProvider

    // route for the home page
    .when('/', {
      templateUrl : '/loc',
      controller  : 'locController'
    })
    
    // route for the loc page
    .when('/loc', {
      templateUrl : '/loc',
      controller  : 'locController'
    })
    
    // route for the loan page
    .when('/loan', {
      templateUrl : '/loan',
      controller  : 'loanController'
    });

  // Some constants
  $provide.value('questionnaire', [
    {
      name: 'About the Business',
      title: 'Basic Company Information',
      schema: 'v1/entities',
      active: true
    },{
      name: 'About the Owners',
      title: 'About the Owners',
      schema: 'v1/owners'
    },{
      name: 'Goals for this Loan',
      title: 'Goals for this Loan',
      schema: 'v1/goals'
    },{
      name: 'Business Financials',
      title: 'Business Financials',
      schema: 'v1/financials',
      disabled: true
    },{
      name: 'Option 5',
      title: 'Option 5',
      schema: 'v1/options',
      disabled: true
    }
  ]);
});

// Lovingly borrowed from http://angular-ui.github.io/bootstrap

var TabsCtrl = function ($scope, questionnaire) {
  $scope.tabs = questionnaire;

  $scope.tabChanged = function(tab) {
    $scope.$broadcast('tabChanged', tab)
  };
};

function DropdownCtrl($scope) {

  $scope.status = {
    isopen: false
  };

  $scope.toggleDropdown = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.status.isopen = !$scope.status.isopen;
  };
}

angularfy.factory('FormService', function($http) {
  return {
    getSchema: function(name) {
      return $http.get('/api/' + name + '/schema/?format=json/');
    }
  }
});

angularfy.controller('FormCtrl', ['$scope', 'FormService', 'questionnaire',
  function ($scope, FormService, questionnaire) {
    $scope.fields = {};
    $scope.loadForm = function(event, tab) {
      FormService.getSchema(tab.schema).then(function(result) {
        $scope.fields = _.omit(result.data.fields, [
          'created_on',
          'updated_on',
          'resource_uri',
          'id'
        ]);
      });
    };

    $scope.$on('tabChanged', $scope.loadForm);
    $scope.loadForm({}, questionnaire[0]);
  }
]);

angularfy.filter('humanize', function() {
  return function(input) {
    return _(input).humanize();
  };
});
