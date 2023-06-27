(function(window) {
    "use strict";
    const api = window.api || {};
    api.get = function(url, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onload = function() {
            if (xhr.status === 200) {
                callback(JSON.parse(xhr.responseText));
            } else {
                callback(null);
            }
        };
        xhr.send();
    }


    api.post = function(url, data, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function() {
            if (xhr.status === 200) {
                callback(JSON.parse(xhr.responseText));
            } else {
                callback(null);
            }
        };
        xhr.send(JSON.stringify(data));
    }

    api.postFilterDummyData = function(url, data, callback) {
        callback(window.dummyData);
    }

    api.postDummyData = function(url, data, callback) {
        callback(window.dummyCreateData);
    }

    window.api = api;

})(window);
