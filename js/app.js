var caloriesController = (function() {
    var AddCal = function(id, description, calories, quantity) {
        this.id = id;
        this.description = description;
        this.calories = calories;
        this.quantity = quantity;
    };
    var BurnCal = function(id, description, calories, quantity) {
        this.id = id;
        this.description = description;
        this.calories = calories;
        this.quantity = quantity;
    };
    var storage = {
        allCalories: {
            add: [],
            burn: []
        }

    };
    return {
        addCalory: function({ type, description, calories, quantity }) {
            var newCalory, id;
            id = 0;
            if (type === "add") {
                newCalory = new AddCal(id, description, calories, quantity);
            } else if (type === "burn") {
                newCalory = new BurnCal(id, description, calories, quantity);
            }
            storage.allCalories[type].push(newCalory);
            
        },
         result: function({
             return: storage;
         })
    }
})();

var AppUiController = (function() {
    var htmlClassNames = {
        typeClass: '.showForm__type',
        descriptionClass: '.showForm__description__input',
        caloriesClass: '.showForm__add-calories',
        quantityClass: '.quantity',
        addBtnClass: '.showForm__add-btn',

    };
    return {
        getFormData: function() {
            return {
                type: document.querySelector(htmlClassNames.typeClass).value,
                description: document.querySelector(htmlClassNames.descriptionClass).value,
                calories: parseFloat(document.querySelector(htmlClassNames.caloriesClass).value),
                quantity: parseInt(document.querySelector(htmlClassNames.quantityClass).value),
            };
        },
        getHtmlClassName: function() {
            return htmlClassNames;
        },
    }
})();

var MainController = (function(caloriesCtrl, AppUICtrl) {

    var htmlClassNames = AppUICtrl.getHtmlClassName();
    var groupEventListeners = function() {

        document.querySelector(htmlClassNames.addBtnClass).addEventListener('click', function(e) {
            addCalories();
            e.preventDefault();
        });

        document.addEventListener('keypress', function(e) {
            if (e.keyCode === 13) {
                addCalories();
                e.preventDefault();
            }
        });
    };
    var addCalories = function() {
        var getFormInput = AppUICtrl.getFormData();
        if (getFormInput.description !== "" && !isNaN(getFormInput.calories) && getFormInput.calories > 0 && !isNaN(getFormInput.quantity) && getFormInput.quantity > 0) {
            caloriesCtrl.addCalory(getFormInput);
        }
    }
    return {
        initialize: function() {
            groupEventListeners();
        }
    }
})(caloriesController, AppUiController);
MainController.initialize();