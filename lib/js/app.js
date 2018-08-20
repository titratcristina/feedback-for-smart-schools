var app = angular.module("myApp", []);
var socket = io();

// apelează funcția pentru actualizarea paginii
socket.on('update', function (msg) {
    angular.element(document.getElementById('main')).scope().get();
});

// request pentru adăugare
function postReview(schoolid, dept) {
    var sel = document.getElementById("id-element-select");
    var strUser = sel.options[sel.selectedIndex].text;
    $.post('/addReview', {
        "id": schoolid,
        "dept": dept,
        "content": document.getElementById('getcontent').value,
        "userName": document.getElementById('getUserName').value,
        "userType": strUser
    }, function (response) {
        console.log(response)
    });
    document.getElementById('getcontent').value = ''; // curăță caseta de comentarii
    document.getElementById('getUserName').value = ''; // curăță caseta cu numele
}

app.controller('mainController', function ($scope, $http, $window) {
    // memorează variabilele pentru afișarea recenziilor corespunzătoare în modal, apoi îl deschide
    $scope.open = function (school, dept) {
        $scope.selectedschool = school;
        $scope.selecteddept = dept;
        $window.openModal();
    }
    // memorează variabilele pentru afișarea recenziilor corespunzătoare în modal, apoi îl deschide
    $scope.postreview = function (index) {
        $window.postReview($scope.data[$scope.selectedschool]._id, index);
    }
    // încarcă datele de pe API în scope
    $scope.get = function () {
        $http.get("/list")
            .then(function (response) {
                $scope.data = response.data;
            });
    }
    // încărcăm o dată la început
    $scope.get();
});
