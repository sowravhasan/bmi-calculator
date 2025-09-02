// Add additional event handler for gender button clicks
document.addEventListener('DOMContentLoaded', function() {
    const genderMaleBtn = document.getElementById('genderMaleBtn');
    const genderFemaleBtn = document.getElementById('genderFemaleBtn');
    const genderInput = document.getElementById('genderInput');

    // Function to handle gender button clicks
    function handleGenderButtonClick(gender) {
        // Update the hidden input value
        genderInput.value = gender;
        
        // Update button styling
        if (gender === 'male') {
            genderMaleBtn.classList.add('selected');
            genderFemaleBtn.classList.remove('selected');
        } else {
            genderFemaleBtn.classList.add('selected');
            genderMaleBtn.classList.remove('selected');
        }
        
        // Trigger change event for live calculations
        const event = new Event('change');
        genderInput.dispatchEvent(event);
    }
    
    // Add click event listeners to gender buttons
    if (genderMaleBtn) {
        genderMaleBtn.addEventListener('click', function() {
            handleGenderButtonClick('male');
        });
    }
    
    if (genderFemaleBtn) {
        genderFemaleBtn.addEventListener('click', function() {
            handleGenderButtonClick('female');
        });
    }
});
