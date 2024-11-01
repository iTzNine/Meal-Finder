document.addEventListener("DOMContentLoaded", () => {
    const plannerForm = document.getElementById("plannerForm");
    const plannerList = document.getElementById("plannerList");
    const saveButton = document.getElementById("saveButton");

    // Load meals from local storage when the page loads
    loadList();

    // Handle adding a meal when the form is submitted
    plannerForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const mealInput = document.getElementById("plannerMeal");
        const mealName = mealInput.value.trim();

        if (mealName) {
            addToPlanner(mealName);
            mealInput.value = ""; // Clear input field
        }
    });

    // Handle saving meals as a .txt file
    saveButton.addEventListener("click", () => {
        const plannedMeals = JSON.parse(localStorage.getItem("mealPlanner")) || [];
        if (plannedMeals.length > 0) {
            const textContent = plannedMeals.join("\n");
            const blob = new Blob([textContent], { type: 'text/plain' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'meal-planner.txt';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            alert("No meals to save.");
        }
    });
});

// Add a meal to the planner and update local storage
function addToPlanner(mealName) {
    const plannedMeals = JSON.parse(localStorage.getItem("mealPlanner")) || [];
    if (!plannedMeals.includes(mealName)) {
        plannedMeals.push(mealName);
        localStorage.setItem("mealPlanner", JSON.stringify(plannedMeals));
        loadList(); // Refresh the list display
        showNotification(`"${mealName}" added to the planner!`);
    } else {
        alert(`"${mealName}" is already in the planner.`);
    }
}

// Load and display meals from local storage
function loadList() {
    const plannerList = document.getElementById("plannerList");
    const plannedMeals = JSON.parse(localStorage.getItem("mealPlanner")) || [];
    plannerList.innerHTML = ""; // Clear previous items

    plannedMeals.forEach((mealName) => {
        const mealItem = document.createElement("li");
        const mealText = document.createElement("span");
        mealText.textContent = mealName;
        mealItem.appendChild(mealText);

        // Add an edit button
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.onclick = () => {
            const newMealName = prompt("Edit meal name:", mealText.textContent);
            if (newMealName && newMealName.trim() !== "" && newMealName.trim() !== mealText.textContent) {
                updateMealInStorage(mealText.textContent, newMealName.trim());
                mealText.textContent = newMealName.trim();
            }
        };

        // Add a remove button
        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.onclick = () => {
            removeFromStorage(mealText.textContent);
            mealItem.remove();
        };

        mealItem.appendChild(editButton);
        mealItem.appendChild(removeButton);
        plannerList.appendChild(mealItem);
    });
}

// Update the meal name in local storage
function updateMealInStorage(oldName, newName) {
    let plannedMeals = JSON.parse(localStorage.getItem("mealPlanner")) || [];
    plannedMeals = plannedMeals.map((meal) => (meal === oldName ? newName : meal));
    localStorage.setItem("mealPlanner", JSON.stringify(plannedMeals));
}

// Remove a meal from local storage
function removeFromStorage(mealName) {
    const plannedMeals = JSON.parse(localStorage.getItem("mealPlanner")) || [];
    const updatedMeals = plannedMeals.filter((meal) => meal !== mealName);
    localStorage.setItem("mealPlanner", JSON.stringify(updatedMeals));
}

// Show a notification (you can replace this with a custom notification if needed)
function showNotification(message) {
    alert(message);
}

// Go back function for navigation
function goBack() {
    window.history.back();
}