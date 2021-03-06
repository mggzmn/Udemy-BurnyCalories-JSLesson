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
    var totalCalories = function(type) {
        var total = 0;
        storage.allCalories[type].forEach(function(current) {
            total += (current.calories) * (current.quantity);
        });
        storage.all[type] = total;
    };
    var storage = {
        allCalories: {
            add: [],
            burn: [],
        },
        all: {
            add: 0,
            burn: 0,
        },
        totalCaloriesPerDay: 0,
        minCalPerDay: 2000,
        percentage: 0,
        remaining: 0
    };
    //PUBLIC
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
        computedCalories: function() {
            totalCalories('add');
            totalCalories('burn');
            storage.totalCaloriesPerDay = storage.all.add - storage.all.burn;
            storage.remaining = storage.minCalPerDay - storage.totalCaloriesPerDay;
            storage.percentage = Math.round((storage.totalCaloriesPerDay / storage.minCalPerDay) * 100);
        },
        returnCalories: function() {
            return {
                totalCalories: storage.totalCaloriesPerDay,
                totalAdded: storage.all.add,
                totalBurned: storage.all.burn,
                percentage: storage.percentage,
                remaining: storage.remaining
            }
        },
        result: function() {
            return storage;
        },
        deleteCalory(id, type) {
            var arrayIds, currentPosition;
            arrayIds = storage.allCalories[type].map(function(current) {
                return current.id;
            });
            currentPosition = arrayIds.indexOf(id);
            if (currentPosition !== -1) {
                storage.allCalories[type].splice(currentPosition, 1);
            }
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
        foodBtn: '.btn-panel__food--apple',
        excerciseBtn: '.btn-panel__food--fire',
        frontAppResultRemainingCal: '.totalCal__remaining',
        frontAppFoodPanelCal: '.main-panel__result--food-cal',
        frontAppExercisePanelCal: '.main-panel__result--exercise-cal',
        frontAppRemainText: '.remaining',
        frontAppPercentageValue: '.circlePercentageValue',
        frontAppChart: '.chart__circle',
        frontAppDatePercent: '.main-panel__date--percent',
        mainPanel: '.main-panel',
        frontAppDate: '.main-panel__date--text',
        errorNotification: '.error',
    };
    var months = {
        0: 'January',
        1: 'February',
        2: 'March',
        3: 'April',
        4: 'May',
        5: 'June',
        6: 'July',
        7: 'August',
        8: 'September',
        9: 'October',
        10: 'November',
        11: 'December'
    };
    var days = [
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat'
    ];

    var formatCalories = function(num) {
        var splitArrNum, firstInt, decimalPart, formattedNum;
        num = Math.abs(num);
        num = num.toFixed(2);
        splitArrNum = num.split('.');
        firstInt = splitArrNum[0];
        decimalPart = splitArrNum[1];
        if (firstInt.length > 3) {
            firstInt = firstInt.substr(0, firstInt.length - 3) + ',' + firstInt.substr(firstInt.length - 3, 3);
        }
        formattedNum = firstInt + '.' + decimalPart;
        return formattedNum;
    };


    var formatRemaining = function(num) {
        num = Math.round(num);
        num = num.toString();
        if (num.length > 3) {
            num = num.substr(0, num.length - 3) + ',' + num.substr(num.length - 3, 3);
        }
        return num;
    };

    var list = function(formFields) {
        return Array.prototype.slice.call(formFields);
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
            var markup, editedMarkup, sliderContainer, notification;
            if (type === "add") {
                sliderContainer = htmlClassNames.foodSliderClass;
                notification = '<i class="fas fa-apple-alt"></i><span class="btn-panel__food--text">+ Food</span><div class="circle-container"><div class="pulsate"></div><div class="circle"></div></div>'
                markup = '<div class="food-container__foods" id="add-%id%"><div class="food-container__foods--name">%description%</div><div class="food-container__foods--calBalance">Calorie Balance<span class="food-container__foods--cal">%calories% Cal</span><div class="food-container__foods--bar"></div></div><div class="food-container__foods--delete"><button class="btn-deleteItem"><i class="far fa-times-circle"></i></button></div></div>';
                document.querySelector(htmlClassNames.excerciseBtn).innerHTML = '<i class="fas fa-fire"></i><span class="btn-panel__food--text exercise-burn-text"> - Exercise</span>'
                document.querySelector(htmlClassNames.foodBtn).innerHTML = notification;
            } else if (type === "burn") {
                sliderContainer = htmlClassNames.exerciseClass;
                notification = '<i class="fas fa-fire"></i><span class="btn-panel__food--text exercise-burn-text"> - Exercise</span><div class="circle-container"><div class="pulsate"></div><div class="circle"></div></div> '
                markup = '<div class="food-container__foods running-container__name" id="burn-%id%"><div class="food-container__foods--name running-container__name">%description%</div><div class="food-container__foods--calBalance running__calBalance">Calorie Burned<span class="food-container__foods--cal  running__calBalance--cal"> -%calories%Cal</span><div class="food-container__foods--bar  running__calBalance--bar"></div></div><div class="food-container__foods--delete running-container__delete"><button class="btn-deleteItem"><i class="far fa-times-circle"></i></button></div></div>';
                document.querySelector(htmlClassNames.foodBtn).innerHTML = '<i class="fas fa-apple-alt"></i><span class="btn-panel__food--text">+ Food</span>';
                document.querySelector(htmlClassNames.excerciseBtn).innerHTML = notification;
            }
            editedMarkup = markup.replace('%id%', itemObj.id);
            editedMarkup = editedMarkup.replace('%description%', itemObj.description);
            editedMarkup = editedMarkup.replace('%calories%', formatCalories(itemObj.calories));
            document.querySelector(sliderContainer).insertAdjacentHTML('beforeend', editedMarkup);
        },
        displayFrontAppCalories: function(calObj) {
            var editedPercentagePath = '';
            var todayCalories, totalAdded, totalBurned, remaining, percentage;
            todayCalories = calObj.todayCalories;
            totalAdded = calObj.totalAdded;
            totalBurned = calObj.totalBurned;
            remaining = calObj.remaining;
            percentage = calObj.percentage;
            var percentagePath = '<path class="circle-bg"d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/> <path class="circle circlePercentageValue"stroke-dasharray="%percentage%, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>';
            document.querySelector(htmlClassNames.frontAppRemainText).innerHTML = '<span class="remaining">Remaining</span>';

            document.querySelector(htmlClassNames.frontAppFoodPanelCal).textContent = '+ ' + formatCalories(totalAdded);
            document.querySelector(htmlClassNames.frontAppExercisePanelCal).textContent = '- ' + formatCalories(totalBurned);
            document.querySelector(htmlClassNames.frontAppDatePercent).textContent = percentage + '%';

            if (remaining > 1300) {
                document.querySelector(htmlClassNames.frontAppResultRemainingCal).innerHTML = '<span style="color:#CBFF69;">' + formatRemaining(remaining) + '</span>';
                editedPercentagePath = percentagePath.replace('%percentage%', percentage);
                document.querySelector(htmlClassNames.frontAppChart).innerHTML = editedPercentagePath;
            } else if (remaining < 1300 && remaining > 500) {
                document.querySelector(htmlClassNames.frontAppResultRemainingCal).innerHTML = '<span style="color:#FF765C;">' + formatRemaining(remaining) + '</span>';
                editedPercentagePath = percentagePath.replace('%percentage%', percentage);
                document.querySelector(htmlClassNames.frontAppChart).innerHTML = editedPercentagePath;
            } else if (remaining < 500 && remaining > 0) {
                document.querySelector(htmlClassNames.frontAppRemainText).innerHTML = '<span class="remaining" style="color:white"><i class="fa fa-exclamation-circle fa-spin fa-3x fa-fw" style="font-size:22px;"></i>Remaining</span>';
                document.querySelector(htmlClassNames.frontAppResultRemainingCal).innerHTML = '<span style="color:#E48FFF;">' + formatRemaining(remaining) + '</span>';
                editedPercentagePath = percentagePath.replace('%percentage%', percentage);
                document.querySelector(htmlClassNames.frontAppChart).innerHTML = editedPercentagePath;
            } else if (remaining < 0) {
                document.querySelector(htmlClassNames.frontAppRemainText).innerHTML = '<span class="remaining" style="color:#76ff7b;"><i class="fa fa-exclamation-circle fa-spin fa-3x fa-fw" style="font-size:38px;"></i>Over The Limit</span>';
                document.querySelector(htmlClassNames.frontAppResultRemainingCal).innerHTML = '<span style="color:#82FFCD;">' + formatRemaining(remaining) + '!!</span>';
                editedPercentagePath = percentagePath.replace('%percentage%', percentage);
                document.querySelector(htmlClassNames.frontAppChart).innerHTML = editedPercentagePath;
            }
        },
        deleteCaloryFrontIU: function(divId) {
            var parentPanel, actualChild;
            parentPanel = document.getElementById(divId).parentNode;
            console.log(parentPanel);
            actualChild = document.getElementById(divId);
            parentPanel.removeChild(actualChild);
        },
        displayDate: function() {
            var today, year, date, monthName, dayName, formatedText;
            today = new Date();
            year = today.getFullYear();
            date = today.getDate();
            monthName = months[today.getMonth()];
            dayName = days[today.getDay()];
            formatedText = `${dayName},${date} ${monthName} ${year}`;
            document.querySelector(htmlClassNames.frontAppDate).innerHTML = '<span>' + formatedText + '</span>';
        },
        clearForm: function() {
            var formFields, formFieldsArr;
            formFields = document.querySelectorAll(htmlClassNames.descriptionClass + ',' + htmlClassNames.caloriesClass + ',' + htmlClassNames.quantityClass);
            formFieldsArr = list(formFields);
            formFieldsArr.forEach(function(curr, index, arr) {
                curr.value = '';
            });
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

        document.querySelector(htmlClassNames.mainPanel).addEventListener('click', function(e) {
            deleteCalories(e);
        });
    };

    var deleteCalories = function(e) {
        var parentNode, getId, id, type;
        parentNode = e.target.parentNode.parentNode.parentNode.id;
        if (parentNode) {
            getId = parentNode.split('-');
            id = parseInt(getId[1]);
            type = getId[0];
            //eliminas del controlador
            caloriesCtrl.deleteCalory(id, type);
            //actualizas la UI
            AppUICtrl.deleteCaloryFrontIU(parentNode);
            //actualizas el conteo de calorías
            calculateCalories();
        }
    };


    var addCalories = function() {
        var getFormInput, newAddCalories;
        getFormInput = AppUICtrl.getFormData();
        if (getFormInput.description !== "" && !isNaN(getFormInput.calories) && getFormInput.calories > 0 && !isNaN(getFormInput.quantity) && getFormInput.quantity > 0) {
            newAddCalories = caloriesCtrl.addCalory(getFormInput);
            AppUICtrl.addItem(newAddCalories, getFormInput.type);
            calculateCalories();
            AppUICtrl.clearForm();
        }
    };

    var calculateCalories = function() {
        var calories;
        caloriesCtrl.computedCalories();
        calories = caloriesCtrl.returnCalories();
        AppUICtrl.displayFrontAppCalories(calories);

    }
    //public
    return {
        initialize: function() {
            emptyCalories = {
                todayCalories: 0,
                totalAdded: 0,
                totalBurned: 0,
                remaining: 2000,
                percentage: 0,

            }
            AppUICtrl.displayFrontAppCalories(emptyCalories);
            groupEventListeners();
            AppUICtrl.displayDate();

        }
    }
})(caloriesController, AppUiController);
MainController.initialize();