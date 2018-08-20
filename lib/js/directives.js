//directivele paginii
app.directive('navbar', function () {
    return {
        restrict: 'E',
        templateUrl: '/lib/html/navbar.html'
    }
});

app.directive('intro', function () {
    return {
        restrict: 'E',
        templateUrl: '/lib/html/intro.html'
    }
});

app.directive('modal', function () {
    return {
        restrict: 'E',
        templateUrl: '/lib/html/modal.html'
    }
});

app.directive('footeer', function () {
    return {
        restrict: 'E',
        templateUrl: '/lib/html/footer.html'
    }
});
