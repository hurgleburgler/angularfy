var angularfy = angular.module('angularfy', ['ui.bootstrap', 'ngRoute', 'angular_taglist_directive']);

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
      icon: 'icon-briefcase',
      schema: 'v1/entities',
      relations: {
        industry: {
          src: 'v1/industries',
          key: 'description',
          show: 'description'
        },
        owners: {
          src: 'v1/owners',
          key: 'last_name',
          show: ['first_name', 'last_name']
        }
      },
      active: true
    },{
      name: 'About the Owners',
      title: 'About the Owners',
      icon: 'icon-users',
      schema: 'v1/owners',
      disabled: true
    },{
      name: 'Goals for this Loan',
      title: 'Goals for this Loan',
      icon: 'icon-signup',
      schema: 'v1/goals',
      disabled: true
    },{
      name: 'Business Financials',
      title: 'Business Financials',
      schema: 'v1/financials',
      icon: 'icon-coin',
      disabled: true
    },{
      name: 'Option 5',
      title: 'Option 5',
      schema: 'v1/options',
      icon: 'icon-shield',
      disabled: true
    }
  ]);
});


// Lovingly borrowed from http://angular-ui.github.io/bootstrap

var TabsCtrl = function ($scope, questionnaire) {
  $scope.tabs = questionnaire;

  $scope.updateInputs = function(event, key) {
console.log($scope);
console.log(event);
console.log(key);
  };

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

angularfy.controller('TypeaheadCtrl', ['$scope', '$http', 'questionnaire',
  function($scope, $http, questionnaire) {
    var table = $scope.tab.relations[$scope.key];
    $scope.getTypeahead = function(val) {
      params = {};
      params[table.key + '__icontains'] = val;
      return $http.get('/api/' + table.src + '/?format=json', {params: params}).then(function(res){
        var entries = [];
        angular.forEach(res.data.objects, function(item){
          if(_.isArray(table.show)) {
            var this_entry = [];
            _.each(table.show, function(i, e) {
              this_entry.push(item[i]);
            });
            entries.push(this_entry.join(' '));
          } else {
            entries.push(item[table.show]);
          }
        });
        $scope.entries;
        return entries;
      });
    };
  }
]);

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
        $scope.tab = tab;
        $scope.name = tab.name;
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

angularfy.controller('InputCtrl', ['$scope', 'questionnaire',
  function ($scope, questionnaire) {
    $scope.has_value = false;
    $scope.data = {};
    $scope.data.message = '';
  }
]);

angularfy.filter('humanize', function() {
  return function(input) {
    return _(input).humanize();
  };
});

// Lovingly borrowed from https://github.com/chrispittman/angular-taglist/blob/master/js/angular-taglist-directive.js 
var angular_taglist_directive = angular.module('angular_taglist_directive', []);

angular_taglist_directive.directive('taglist', ['$timeout', function ($timeout) {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            tagData: '=',
            taglistBlurTimeout: '='
        },
        transclude: true,
        template: '<div class="taglist">\
<span class="tag well" data-ng-repeat="tag in tagData">\
<a href data-ng-click="tagData.splice($index, 1)">x</a> <span>{{tag}}</span></span>\
<div class="tag-input" ng-transclude></div><div class="tags_clear"></div></div>',
        compile: function (tElement, tAttrs, transcludeFn) {
            return function (scope, element, attrs) {
                element.bind('click', function () {
                    element[0].getElementsByTagName('input')[0].focus();
                });

                var input = angular.element(element[0].getElementsByTagName('div')[0].getElementsByTagName('input')[0]);
                input.bind('blur', function (evt, foo) {
                    if (scope.taglistBlurTimeout) {
                        $timeout(function() {
                            addTag(input[0]);
                        }, scope.taglistBlurTimeout);
                    } else {
                        addTag(input[0]);
                    }
                });
                input.bind('keydown', function (evt) {
                    if (evt.altKey || evt.metaKey || evt.ctrlKey || evt.shiftKey) {
                        return;
                    }
                    if (evt.which == 188 || evt.which == 13) { // 188 = comma, 13 = return
                        evt.preventDefault();
                        addTag(this);
                    } else if (evt.which == 8 /* 8 = delete */
                        && this.value.trim().length == 0
                        && element[0].getElementsByClassName('tag').length > 0) {
                        evt.preventDefault();
                        scope.$apply(function () {
                            scope.tagData.splice(scope.tagData.length - 1, 1);
                        });
                    }
                });

                function addTag(element) {
                    if (!scope.tagData) {
                        scope.tagData = [];
                    }
                    var val = element.value.trim();
                    if (val.length === 0) {
                        return;
                    }
                    if (scope.tagData.indexOf(val) >= 0) {
                        return;
                    }
                    scope.$apply(function () {
                        scope.tagData.push(val);
                        element.value = "";
                    });
                }
            }
        }
    }
}]);
