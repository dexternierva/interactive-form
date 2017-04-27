(function () {

	// Give focus to the first text field.
	document.querySelector('#name').focus();

	// Create a text field that will be revealed when the "Other" option is selected from the "Job Role" drop down menu.
	const title = document.querySelector('#title');
	const otherTitle = document.createElement('input');
	otherTitle.type = 'text';
	otherTitle.id = 'other-title';
	otherTitle.placeholder = 'Your Job Role';

	title.addEventListener('change', function () {
		if ( title.value === 'other' ) {
			title.insertAdjacentElement('afterend', otherTitle);
			otherTitle.style.display = '';
		} else {
			otherTitle.style.display = 'none';
		}
	});

	// Display the color options that match the design selected in the "Design" menu.
	const design = document.querySelector('#design');
	const colorsDIV = document.querySelector('.colors-js-puns');
	const color = document.querySelector('#color');

	colorsDIV.style.display = 'none'; // Hide the "Color" label and select menu until a T-Shirt design is selected from the "Design" menu.

	design.addEventListener('change', function () {
		var designIndex = design.selectedIndex;
		var designValue = design[designIndex].value;

		if ( designValue === 'js puns' ) {
			for ( var i = 0; i < color.length; i++ ) {
				color.options[i].style.display = 'none';

				if ( color.options[i].text.indexOf('JS Puns shirt only') > 0 ) {
					color.options[i].style.display = '';
				}
			}
		} else {
			for ( var i = 0; i < color.length; i++ ) {
				color.options[i].style.display = 'none';

				if ( color.options[i].text.indexOf('JS shirt only') > 0 ) {
					color.options[i].style.display = '';
				}
			}
		}

		// Hide the "Color" label and select menu until a T-Shirt design is selected from the "Design" menu.
		if ( designValue === 'Select Theme') {
			colorsDIV.style.display = 'none';
		} else {
			colorsDIV.style.display = '';
		}

		var selOption = [];
		for ( var i = 0; i < color.length; i++ ) {
			if ( !(color.options[i].style.display === 'none')  ) {
				selOption.push(color.options[i]);
			}
		}
		selOption[0].selected = 'selected';

	});

	// "Register for Activities” section of the form
	// Display Price
	const activities = document.querySelector('.activities');
	var price = 0;
	var priceText = document.createElement('p');
	priceText.className = 'price';

	activities.addEventListener('change', function (evt) {
		const isChecked = evt.target.checked;
		const checked = evt.target;

		deactivateSameTime(checked);

		if (isChecked) {
			(evt.target.name === 'all') ? price += 200 : price += 100;
		} else {
			(evt.target.name === 'all') ? price -= 200 : price -= 100;
		}

		priceText.innerText = 'Total: $' + price;
	});

	activities.appendChild(priceText);

	// Deactivate conflicting schedules
	var activitiesLabel = document.querySelectorAll('.activities label');
	var amActivities = [];
	var pmActivities = [];

	for ( var i = 0; i < activitiesLabel.length; i++ ) {
		if ( activitiesLabel[i].textContent.indexOf('9am-12pm') > 0 ) {
			amActivities.push(activitiesLabel[i]);
		} else if ( activitiesLabel[i].textContent.indexOf('1pm-4pm') > 0 ) {
			pmActivities.push(activitiesLabel[i]);
		}
	}

	var deactivateSameTime = function (selectedTime) {
		if (selectedTime.parentNode.textContent.indexOf('9am-12pm') > 0) {
			if(selectedTime.checked) {
				for ( var i = 0; i < amActivities.length; i++ ) {
					amActivities[i].querySelector('input').disabled = true;
					amActivities[i].style.color = '#666';
				}

				selectedTime.disabled = false;
				selectedTime.parentNode.style.color = '#000';
			} else {
				for ( var i = 0; i < amActivities.length; i++ ) {
					amActivities[i].querySelector('input').disabled = false;
					amActivities[i].style.color = '#000';
				}
			}
		}

		if (selectedTime.parentNode.textContent.indexOf('1pm-4pm') > 0) {
			if(selectedTime.checked) {
				for ( var i = 0; i < pmActivities.length; i++ ) {
					pmActivities[i].querySelector('input').disabled = true;
					pmActivities[i].style.color = '#666';
				}

				selectedTime.disabled = false;
				selectedTime.parentNode.style.color = '#000';
			} else {
				for ( var i = 0; i < amActivities.length; i++ ) {
					pmActivities[i].querySelector('input').disabled = false;
					pmActivities[i].style.color = '#000';
				}
			}
		}
	}

	// PAYMENT INFORMATION SECTION
	const userPayment = document.querySelector('#payment');
	const creditCard = document.querySelector('.credit-card');
	const paypal = document.querySelector('.paypal');
	const bitcoin = document.querySelector('.bitcoin');

	function hidePaymentInfo () {
		var paymentContainers = document.querySelectorAll('#payment ~ div');

		for (var i = 0; i < paymentContainers.length; i++) {
			paymentContainers[i].style.display = 'none';
		}
	}

	hidePaymentInfo(); // Hide all payment info
	creditCard.style.display = ''; // Show credit card info by default

	userPayment.addEventListener('change', function () {
		var selectedPayment = userPayment.selectedIndex;
		var selectedValue = userPayment[selectedPayment].value;
		var selectedValueDiv = document.querySelector('.' + selectedValue);

		if (selectedValueDiv === null) {
			hidePaymentInfo();
			return false;
		}

		hidePaymentInfo();
		selectedValueDiv.style.display = '';
	});


	/**
	 * FORM VALIDATION
	 *
	 */

 	const inputFields = document.theForm.getElementsByTagName("input");
	const activitiesCheckbox = document.querySelectorAll('.activities input');

	for (key in inputFields) {
		var theField = inputFields[key];
		var error = document.querySelector('.error');

		theField.onchange = function () {
			var thePattern = this.pattern;
			var thePlaceholder = this.placeholder;
			var isValid = this.value.search(thePattern) >= 0;

			if ( !(isValid) ) {
				error.innerHTML = "Input does not match pattern. " + thePlaceholder;
				this.className = "warning";
			} else {
				error.innerHTML = "";
				this.classList.remove('warning');
			}
		};
	}

	// CHECK REQUIRED FIELDS ON SUBMIT
	document.theForm.onsubmit = function () {
		// ADD CREDIT CARD NUMBER, ZIP AND CCV AS REQUIRED WHEN CREDIT CARD IS SELECTED AS PAYMENT
		if (userPayment.selectedIndex == 1) {
			var validationInfo = {
				'name'   : { 'required' : true },
				'mail'   : { 'required' : true },
				'cc-num' : { 'required' : true },
				'zip'    : { 'required' : true },
				'cvv'    : { 'required' : true }
			};
		} else {
			var validationInfo = {
				'name' : { 'required' : true },
				'mail' : { 'required' : true }
			};
		}

		for (key in validationInfo) {
			var field = document.getElementById(key);

			if ( (validationInfo[key].required) && (field.value == '') ) {
				error.innerHTML = 'Required field ' + key + ' not filled';
				field.className = "warning";
				field.select();
				return false;
			}
		}

		// ATLEAST ONE CHECKBOX SHOULD BE CHECKED UNDER 'REGISTER FOR ACTIVITIES'
		const activitiesCheckbox = document.querySelectorAll('.activities input');

		var selectedCheckbox = 0;
		for (var i = 0; i < activitiesCheckbox.length; i++) {
			if (activitiesCheckbox[i].checked) {
				selectedCheckbox += 1;
			}
		}

		if (selectedCheckbox === 0) {
			error.innerHTML = 'Must select at least one checkbox under the "Register for Activities"';
			return false;
		}

		return true;
	}

}());
