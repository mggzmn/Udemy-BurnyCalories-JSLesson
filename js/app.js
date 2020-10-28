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
            var newCalory, id, caloryLength, calArray;
            id = 0;
            caloryLength = storage.allCalories[type].length;
            calArray = storage.allCalories[type];
            if (caloryLength > 0) {
                id = calArray[caloryLength - 1].id + 1;
            } else {
                id = 0;
            }
            if (type === "add") {
                newCalory = new AddCal(id, description, calories, quantity);
            } else if (type === "burn") {
                newCalory = new BurnCal(id, description, calories, quantity);
            }
            storage.allCalories[type].push(newCalory);
            return newCalory;
        },
        result: function() {
            return storage;
        }
    }
})();

var AppUiController = (function() {
    var htmlClassNames = {
        typeClass: '.showForm__type',
        descriptionClass: '.showForm__description__input',
        caloriesClass: '.showForm__add-calories',
        quantityClass: '.quantity',
        addBtnClass: '.showForm__add-btn',
        foodSliderClass: '.food__slider',
        exerciseClass: '.exercise__slider',

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
        addItem: function(itemObj, type) {
            var markup, editedMarkup, sliderContainer;
            if (type === "add") {
            	sliderContainer = htmlClassNames.foodSliderClass;
                markup = '<div class="food-container__foods" id="add-%id%"><div class="food-container__foods--name">%description%</div><div class="food-container__foods--calBalance">Calorie Balance<span class="food-container__foods--cal">%calories% Cal</span><div class="food-container__foods--bar"></div></div><div class="food-container__foods--delete"><button class="btn-deleteItem"><i class="far fa-times-circle"></i></button></div></div>';
            } else if (type === "burn") {
            	sliderContainer = htmlClassNames.exerciseClass;
                markup = '<div class="food-container__foods running-container__name" id="burn-%id%"><div class="food-container__foods--name running-container__name">%description%</div><div class="food-container__foods--calBalance running__calBalance">Calorie Burned<span class="food-container__foods--cal  running__calBalance--cal"> -%calories%Cal</span><div class="food-container__foods--bar  running__calBalance--bar"></div></div><div class="food-container__foods--delete running-container__delete"><button class="btn-deleteItem"><i class="far fa-times-circle"></i></button></div></div>';
            }
            editedMarkup = markup.replace('%id%', itemObj.id);
            editedMarkup = editedMarkup.replace('%description%', itemObj.description);
            editedMarkup = editedMarkup.replace('%calories%', itemObj.calories);
            document.querySelector(sliderContainer).insertAdjacentHTML('beforeend',editedMarkup);
        }
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
        var getFormInput, newAddCalories;
        getFormInput = AppUICtrl.getFormData();
        if (getFormInput.description !== "" && !isNaN(getFormInput.calories) && getFormInput.calories > 0 && !isNaN(getFormInput.quantity) && getFormInput.quantity > 0) {
            newAddCalories = caloriesCtrl.addCalory(getFormInput);
            console.log(caloriesCtrl.result());
            AppUICtrl.addItem(newAddCalories, getFormInput.type);
        }
    }
    return {
        initialize: function() {
            groupEventListeners();
        }
    }
})(caloriesController, AppUiController);
MainController.initialize();