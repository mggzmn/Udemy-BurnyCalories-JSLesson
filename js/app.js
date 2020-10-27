var caloriesController = (function() {})();

var AppUiController = (function() {
    var htmlClassNames = {
        typeClass: '.showForm__type',
        descriptionClass: '.showForm__description__input',
        quantityClass: '.quantity',
        caloriesClass: '.showForm__add-calories',
        addBtnClass: '.showForm__add-btn'
    };
    return {
        getFormData: function() {
            return {
                type: document.querySelector(htmlClassNames.typeClass).value,
                description: document.querySelector(htmlClassNames.descriptionClass).value,
                quantity: document.querySelector(htmlClassNames.quantityClass).value,
                calories: document.querySelector(htmlClassNames.caloriesClass).value,

            }
        },
        getHtmlClassName: function(){
        	return htmlClassNames;
        }
    }
})();

var MainController = (function(caloriesCtrl, AppUiCtrl) {
    var htmlClassNames = AppUiCtrl.getHtmlClassName();
    document.querySelector(htmlClassNames.addBtnClass).addEventListener('click', function(e) {
        addCalories();
        e.preventDefault();
    });
    document.addEventListener('keypress', function(e) {
        if (e.keycode === 13) {
            addCalories();
            e.preventDefault();
        }
    });
    var addCalories = function() {
        var getFormInput = AppUiCtrl.getFormData();
        console.log("hola")
    }
})(caloriesController, AppUiController)