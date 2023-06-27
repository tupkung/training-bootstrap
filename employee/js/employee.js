(function (window) {
    "use strict";

    const searchElementEventListener = [];
    const cardContentElementEventListener = [];
    const cardContentLoadMoreEventListener = [];
    let searchElementCheckEnable = true;

    // initial element
    const searchElem = window.searchElem || document.querySelector("#search") || {};
    const searchInputElem = window.searchInputElem || searchElem.querySelector("input[type='text']") || {};
    const searchButtonElem = window.searchButtonElem || searchElem.querySelector("button#button-search") || {};
    const addButtonElem = window.addButtonElem || searchElem.querySelector("li > a.dropdown-item") || {};

    const cardContentElem = window.cardContentElem || document.querySelector("#card-content");
    const cardNoContentElem = window.cardNoContentElem || document.querySelector("#card-no-content")
    const cardContentTemplateElem = window.cardContentTemplateElem || document.querySelector("#card-template");

    const cardLoaderElem = window.cardLoaderElem || document.querySelector("#card-loader") || {};
    const loaderBtn = window.loaderBtn || cardLoaderElem.querySelector("button") || {};

    // set element functions
    searchElem.registerEventListener = function (callback) {
        searchElementEventListener.push(callback);
    }

    cardContentElem.registerEventListener = function (callback) {
        cardContentElementEventListener.push(callback);
    }

    cardContentElem.registerLoadMoreEventListener = function (callback) {
        cardContentLoadMoreEventListener.push(callback);
    }

    cardContentElem.displayNone = function () {
        this.classList.add("d-none");
        cardLoaderElem.classList.add("d-none");
        cardNoContentElem.classList.remove("d-none");
    }

    cardContentElem.displayBlock = function () {
        this.classList.remove("d-none");
        cardLoaderElem.classList.remove("d-none");
        cardNoContentElem.classList.add("d-none");
    }

    cardContentElem.clear = function () {
        this.innerHTML = "";
    }

    cardContentElem.append = function (element) {
        this.appendChild(element);
    }

    cardContentElem.appendTemplate = function (data, index) {
        const template = cardContentTemplateElem.content.cloneNode(true);
        template.querySelector("img.card-img-top").src = "https://picsum.photos/300/200?random=" + index;
        template.querySelector("span[data-card='first-name']").innerHTML = data.first_name;
        template.querySelector("span[data-card='last-name']").innerHTML = data.last_name;
        template.querySelector("span[data-card='salary']").innerHTML = window.thIntl.format(data.salary);
        template.querySelector("a[data-card='detail-btn']").addEventListener("click", function (event) {
            window.modalDetailElem.setData(data);
            window.modalDetailInstance.show();
            cardContentElementEventListener.forEach(callback => callback(data));
        });
        this.append(template);
    }


    // initial event listener  keyCode 13 is == enter
    searchInputElem.addEventListener("keyup", function (event) {
        if (searchElementCheckEnable) {
            const timeout = 1; // seconds

            setTimeout(function () {
                searchElementCheckEnable = true;
            }, timeout * 1000);

            if (event.key === 'Enter' && (this.value.length > 3 || this.value.length === 0)) {
                searchElementCheckEnable = false;
                searchElementEventListener.forEach(callback => callback(this.value));
            }
        }
    });


    searchButtonElem.addEventListener("click", function (event) {
        if (searchElementCheckEnable) {
            const timeout = 1; // seconds

            setTimeout(function () {
                searchElementCheckEnable = true;
            }, timeout * 1000);

            if (searchInputElem.value.length > 3 || searchInputElem.value.length === 0) {
                searchElementCheckEnable = false
                searchElementEventListener.forEach(callback => callback(searchInputElem.value));
            }
        }

    });

    loaderBtn.addEventListener("click", function (event) {
        cardContentLoadMoreEventListener.forEach(callback => callback());
    });


    // config to global
    window.searchElem = searchElem;
    window.cardContentElem = cardContentElem;
    window.cardNoContentElem = cardNoContentElem;
    window.cardContentTemplateElem = cardContentTemplateElem;
    window.searchInputElem = searchInputElem;
    window.searchButtonElem = searchButtonElem;
    window.addButtonElem = addButtonElem;
    window.cardLoaderElem = cardLoaderElem;
    window.loaderBtn = loaderBtn;
})(window);


(function (window) {

    "use strict";

    let offset = 0;
    let pageSize = window.filterObject.option.limit;
    const controller = window.controller || {};

    controller.search = function (keyword) {
        offset = 0;
        if (keyword.length > 0) {
            window.filterObject.filters = [
                {
                    "field": "first_name",
                    "value": keyword
                }
            ];
        } else {
            window.filterObject.filters = [];
        }
        window.filterObject.option.offset = offset;

        window.api.post(window.endpoint.filterEmployee, window.filterObject, function (data) {
            window.cardContentElem.clear();
            if (data.data.employees.length > 0) {
                data.data.employees.forEach(function (item, idx) {
                    window.cardContentElem.appendTemplate(item, idx);
                });
                window.cardContentElem.displayBlock();
            } else {
                window.cardContentElem.displayNone();
            }
        });
    }

    controller.loadmore = function () {
        offset += pageSize;
        window.filterObject.option.offset = offset;
        window.api.post(window.endpoint.filterEmployee, window.filterObject, function (data) {
            if (data.data.employees.length > 0) {
                data.data.employees.forEach(function (item) {
                    window.cardContentElem.appendTemplate(item);
                });
                window.cardContentElem.displayBlock();
                window.cardNoContentElem.displayNone();
            }
        });
    }

    controller.reload = function () {
        window.api.post(window.endpoint.filterEmployee, window.filterObject, function (data) {
            window.cardContentElem.clear();
            if (data.data.employees.length > 0) {
                data.data.employees.forEach(function (item, idx) {
                    window.cardContentElem.appendTemplate(item, idx);
                });
                window.cardContentElem.displayBlock();
            } else {
                window.cardContentElem.displayNone();
            }
        });
    }

    controller.new = function (data) {
        // prepare data
        if (typeof(data.salary) === "string") {
            data.salary = Number(data.salary);
        }
        if (typeof(data.age) === "string") {
            data.age = Number(data.age);
        }
        window.api.post(window.endpoint.employee, data, function (data) {
            window.modalNewEmployeeInstance.hide();
            controller.reload();
        });
    }

    controller.init = function () {

        window.searchElem.registerEventListener(function (keyword) {
            controller.search(keyword);
        });

        window.cardContentElem.registerLoadMoreEventListener(function (data) {
            controller.loadmore();
        });


        window.modalNewEmployeeElem.registerEventListener(function (data) {
            controller.new(data);
        });
        window.addButtonElem.addEventListener("click", function (event) {
            window.modalNewEmployeeInstance.show();
        });
    }


    window.controller = controller;

})(window);




(function (window) {
    "use strict";

    window.controller.init();
    window.controller.search("");

})(window);
