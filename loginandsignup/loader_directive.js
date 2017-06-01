/*directive for loader*/
angular.module('app')
  .directive('showloader', function () {
      return {
        restrict: 'E',
        replace:true,
        template:'<div class = "overlay"><div class="loader"><img src="assets/img/loader.gif"></div></div>',
        link: function (scope, element, attr) {
              scope.$watch('showloader', function (val) {
                  if (val)
                      $(element).show();
                  else
                      $(element).hide();
              });
        }
      }
  })
/*end*/