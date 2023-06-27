// initial endpoint, filter object and currency format
(function(window){
    "use strict";

    const endpoint = window.endpoint || {};
    endpoint.url = "http://localhost:6001";
    endpoint.employee = endpoint.url + "/v1/employee";
    endpoint.filterEmployee = endpoint.url + "/v1/employee/filter";

    endpoint.dummyImageUrl = "https://dummyimage.com/300x200/09f/fff.png"
    endpoint.loremImageUrl = "https://picsum.photos/300/200?random="


    /* ex:
              {
                "field": "first_name",
                "value": "Kong"
            }
     */
    const filterObject = window.filterObject || {
        "filters": [

        ],
        "option": {
            "limit": 10,
            "offset": 0,
            "sorts": [
                {
                    "field": "update_time",
                    "order": "desc"
                }
            ]
        }
    };


    const dummyData = window.dummyData || {
        "employees": [
            {
                "employee_code": "2Rlo8rxLgLfEvafhWGeWe3pQwfm",
                "first_name": "John",
                "last_name": "Doe",
                "age": 40,
                "email": "john@mymail.com",
                "department": "IT",
                "salary": 20000
            },
            {

                "employee_code": "2Rlo8rxLgLfEvafhWGeWe3pQwfy",
                "first_name": "Michale",
                "last_name": "Angelo",
                "age": 40,
                "email": "michale@mymail.com",
                "department": "IT",
                "salary": 10000
            }
        ]
    };

    const dummyCreateData = window.dummyCreateData || {
        "first_name": "Kongsak",
        "last_name": "Limpitikeat",
        "email": "keng@mymail.com",
        "age": 40,
        "department": "IT",
        "salary": 20000
    } || {};


    const thIntl = window.thIntl || new Intl.NumberFormat("th-TH", {style: 'currency', currency: 'THB'});

    window.endpoint = endpoint;
    window.thIntl = thIntl;
    window.dummyData = dummyData;
    window.dummyCreateData = dummyCreateData;
    window.filterObject = filterObject;

})(window);


// Modal Detail
(function(window) {
    "use strict";


    const modalDetailElem = window.modalDetailElem || document.getElementById("modalDetail") || {};
    const modalDetailInstance = window.modalDetailInstance || bootstrap.Modal.getOrCreateInstance(modalDetailElem) || {};

    modalDetailElem.setData = function(data) {
        this.querySelector("span[data-modal-detail='first-name']").innerText = data.first_name;
        this.querySelector("span[data-modal-detail='last-name']").innerText = data.last_name;
        this.querySelector("span[data-modal-detail='salary']").innerText = window.thIntl.format(data.salary);
        this.querySelector("span[data-modal-detail='age']").innerText = data.age;
        this.querySelector("span[data-modal-detail='email']").innerText = data.email;
        this.querySelector("span[data-modal-detail='department']").innerText = data.department;
    }




    window.modalDetailElem = modalDetailElem;
    window.modalDetailInstance = modalDetailInstance;
})(window);





// Modal New Employee Form
(function(window) {
    "use strict";

    const modalNewEmployeeEventListener = [];


    const modalNewEmployeeElem = window.modalNewEmployeeElem || document.getElementById("modalNewEmployee") || {};
    const modalNewEmployeeInstance = window.modalNewEmployeeInstance || bootstrap.Modal.getOrCreateInstance(modalNewEmployeeElem) || {};
    const modalNewEmployeeFormElem = modalNewEmployeeElem.querySelector("form") || {};


    modalNewEmployeeElem.registerEventListener = function(callback) {
        modalNewEmployeeEventListener.push(callback);
    }


    modalNewEmployeeElem.clearForm = function() {
        modalNewEmployeeFormElem.reset();
    }

    modalNewEmployeeFormElem.addEventListener("submit", function(event) {
        event.preventDefault();
        if (!modalNewEmployeeFormElem.checkValidity()){
            event.stopPropagation();
        } else {
            const formData = new FormData(this);
            let jsonData = {};
            formData.forEach(function(value, key) {
                jsonData[key] = value;
            });
            modalNewEmployeeEventListener.forEach(function(callback) {
                callback(jsonData);
            });
        }
        modalNewEmployeeFormElem.classList.add('was-validated');
    });


    window.modalNewEmployeeElem = modalNewEmployeeElem;
    window.modalNewEmployeeInstance = modalNewEmployeeInstance;

})(window);
