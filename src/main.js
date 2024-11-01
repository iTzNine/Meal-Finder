document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "https://www.themealdb.com/api/json/v1/1";

  async function searchMeal() {
    const ingredient = document.getElementById("ingredient").value;
    const category = document.getElementById("category").value;

    if (!ingredient || !category) {
      alert("Please select both an ingredient and a category.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/filter.php?i=${ingredient}&c=${category}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      displayMeals(data.meals);
    } catch (error) {
      console.error("Error fetching meals:", error);
      alert("Failed to fetch meals. Please try again later.");
    }
  }

  function displayMeals(meals) {
    const mealContainer = document.getElementById("mealResults");
    mealContainer.innerHTML = ""; // Clear previous results

    if (meals && meals.length > 0) {
      meals.forEach(meal => {
        const mealElement = document.createElement("div");
        mealElement.classList.add("meal-item");
        mealElement.innerHTML = `
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
          <h3>${meal.strMeal}</h3>
          <button onclick="addToPlanner('${meal.strMeal}')">Add to Planner</button>
        `;
        mealElement.onclick = () => displayMeal(meal.idMeal);
        mealContainer.appendChild(mealElement);
      });
    } else {
      mealContainer.textContent = "No meals found.";
    }
  }

  // Attach searchMeal function to the button
  document.querySelector(".search-button").addEventListener("click", searchMeal);
  
  // Function for displaying meal details in a modal
  async function displayMeal(id) {
    try {
      const response = await fetch(`${apiUrl}/lookup.php?i=${id}`);
      const data = await response.json();
      const meal = data.meals[0];
      const mealInfo = document.getElementById('mealInfo');

      mealInfo.innerHTML = `
        <h2>${meal.strMeal}</h2>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <p>${meal.strInstructions}</p>
        <h3>Ingredients:</h3>
        <ul>
          ${Array.from({ length: 20 }, (_, i) => {
            const ingredient = meal[`strIngredient${i + 1}`];
            const measure = meal[`strMeasure${i + 1}`];
            return ingredient ? `<li>${measure} ${ingredient}</li>` : '';
          }).join('')}
        </ul>
        <a href="${meal.strYoutube}" target="_blank">Watch on YouTube</a>
      `;

      const modal = document.getElementById('mealModal');
      modal.style.display = 'block';
    } catch (error) {
      console.error('Error fetching meal details:', error);
    }
  }

  // Close modal function
  document.querySelector('.close').addEventListener('click', closeModal);
  window.onclick = function(event) {
    const modal = document.getElementById('mealModal');
    if (event.target === modal) {
      closeModal();
    }
  };

  // Close modal function implementation
  function closeModal() {
    document.getElementById('mealModal').style.display = 'none';
  }

  // Load meal planner from localStorage on page load
  loadList(document.getElementById('plannedMeals'), 'mealPlanner');

  // Load and display list items from localStorage
  function loadList(listElement, storageKey) {
    const items = JSON.parse(localStorage.getItem(storageKey)) || [];
    listElement.innerHTML = '';
    items.forEach((item, index) => {
      createListItem(listElement, storageKey, item, index);
    });
  }

  // Function to add meal to planner
  function addToPlanner(mealName) {
    const plannedMeals = document.getElementById('plannedMeals');
    const mealItem = document.createElement('li');
    mealItem.textContent = mealName;

    const removeButton = document.createElement('button');
    removeButton.textContent = "Remove";
    removeButton.onclick = () => {
      mealItem.remove();
      removeFromStorage('mealPlanner', mealName);
    };

    mealItem.appendChild(removeButton);
    plannedMeals.appendChild(mealItem);
    
    saveToStorage('mealPlanner', mealName);
    showNotification(`"${mealName}" added to planner!`);
  }

  // Notification display
  function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.innerText = message;
    notification.style.display = 'block';

    setTimeout(() => {
      notification.style.display = 'none';
    }, 3000);
  }

  // LocalStorage functions
  function saveToStorage(storageKey, itemValue) {
    const items = JSON.parse(localStorage.getItem(storageKey)) || [];
    items.push(itemValue);
    localStorage.setItem(storageKey, JSON.stringify(items));
  }

  function removeFromStorage(storageKey, itemValue) {
    const items = JSON.parse(localStorage.getItem(storageKey)) || [];
    const newItems = items.filter(item => item !== itemValue);
    localStorage.setItem(storageKey, JSON.stringify(newItems));
  }
});

// Sample meal data
const meals = [
  { id: 1, name: "Grilled Chicken Salad" },
  { id: 2, name: "Beef Stir Fry" },
  { id: 3, name: "Vegetarian Pasta" },
];

// Populate meals in the results area
function displayMeals() {
  const mealResults = document.getElementById("mealResults");
  mealResults.innerHTML = ""; // Clear previous results

  meals.forEach(meal => {
      const mealItem = document.createElement("div");
      mealItem.classList.add("meal-item");

      mealItem.innerHTML = `
          <h3>${meal.name}</h3>
          <button onclick="addToPlanner(${meal.id})">Add to Planner</button>
      `;

      mealResults.appendChild(mealItem);
  });
}
// Function to add a meal to the planner
function addToPlanner(mealName) {
  const plannedMeals = document.getElementById("plannedMeals");
  
  // Create a new list item for the meal
  const plannedMealItem = document.createElement("li");
  plannedMealItem.textContent = mealName;
  
  // Append the new meal to the planned meals list
  plannedMeals.appendChild(plannedMealItem);
}

function addToPlanner(mealName) {
  // Retrieve existing planned meals from localStorage or set to an empty array
  let plannedMeals = JSON.parse(localStorage.getItem('plannedMeals')) || [];
  plannedMeals.push(mealName);

  // Update localStorage with the new meal list
  localStorage.setItem('plannedMeals', JSON.stringify(plannedMeals));

  // Redirect to the planner page to see updated meals
  window.location.href = 'planner.html';
}

// Example function for when a meal is selected from Meal Finder
function selectMealFromFinder(mealName) {
  addToPlanner(mealName); // Add the meal directly to the planner
}

document.addEventListener("DOMContentLoaded", () => {
  loadList(); // Load meals from local storage when the page loads
});

function loadList() {
  const plannedMealsList = document.getElementById('plannedMeals');
  const plannedMeals = JSON.parse(localStorage.getItem('mealPlanner')) || [];
  plannedMealsList.innerHTML = ''; // Clear previous items

  plannedMeals.forEach((mealName) => {
    const mealItem = document.createElement('li');
    mealItem.textContent = mealName;

    const removeButton = document.createElement('button');
    removeButton.textContent = "Remove";
    removeButton.onclick = () => {
      removeFromStorage(mealName);
      mealItem.remove();
    };

    mealItem.appendChild(removeButton);
    plannedMealsList.appendChild(mealItem);
  });
}

function addToPlanner(mealName) {
  const plannedMeals = JSON.parse(localStorage.getItem('mealPlanner')) || [];
  if (!plannedMeals.includes(mealName)) {
    plannedMeals.push(mealName);
    localStorage.setItem('mealPlanner', JSON.stringify(plannedMeals));
    showNotification(`"${mealName}" added to planner!`);
  } else {
    alert(`"${mealName}" is already in the planner.`);
  }
}

function removeFromStorage(mealName) {
  const plannedMeals = JSON.parse(localStorage.getItem('mealPlanner')) || [];
  const updatedMeals = plannedMeals.filter((meal) => meal !== mealName);
  localStorage.setItem('mealPlanner', JSON.stringify(updatedMeals));
}
