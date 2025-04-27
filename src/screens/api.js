export const fetchRecipesFromAPI = async (searchTerm = '') => {
    try {
      let url = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
      if (searchTerm) {
        url += searchTerm;
      }
      const response = await fetch(url);
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error("Error fetching from MealDB API:", error);
      return [];
    }
  };
  
  export const fetchCategoriesFromAPI = async () => {
    try {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
      const data = await response.json();
      return data.categories || [];
    } catch (error) {
      console.error("Error fetching categories from MealDB API:", error);
      return [];
    }
  };
  
  export const fetchRecipesByCategory = async (categoryName) => {
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`);
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error("Error fetching recipes by category:", error);
      return [];
    }
  };
  
  export const fetchRecipeById = async (id) => {
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
      const data = await response.json();
      return data.meals ? data.meals[0] : null;
    } catch (error) {
      console.error("Error fetching recipe details:", error);
      return null;
    }
  };
  
  // Additional useful API functions based on the available endpoints
  
  export const fetchRandomMeal = async () => {
    try {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
      const data = await response.json();
      return data.meals ? data.meals[0] : null;
    } catch (error) {
      console.error("Error fetching random meal:", error);
      return null;
    }
  };
  
  export const fetchMealsByFirstLetter = async (letter) => {
    try {
      if (!letter || letter.length !== 1) {
        throw new Error("Please provide a single letter");
      }
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error("Error fetching meals by first letter:", error);
      return [];
    }
  };
  
  export const fetchAreaList = async () => {
    try {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error("Error fetching area list:", error);
      return [];
    }
  };
  
  export const fetchIngredientList = async () => {
    try {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error("Error fetching ingredient list:", error);
      return [];
    }
  };
  
  export const fetchMealsByIngredient = async (ingredient) => {
    try {
      const formattedIngredient = ingredient.replace(/\s+/g, '_');
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${formattedIngredient}`);
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error("Error fetching meals by ingredient:", error);
      return [];
    }
  };
  
  export const fetchMealsByArea = async (area) => {
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error("Error fetching meals by area:", error);
      return [];
    }
  };
  
  // Helper function to get ingredient thumbnail URLs
  export const getIngredientImageUrl = (ingredient, size = 'small') => {
    if (!ingredient) return '';
    
    const formattedIngredient = ingredient.toLowerCase().replace(/\s+/g, '-');
    
    if (size === 'small') {
      return `https://www.themealdb.com/images/ingredients/${formattedIngredient}-small.png`;
    } else if (size === 'medium') {
      return `https://www.themealdb.com/images/ingredients/${formattedIngredient}-medium.png`;
    } else if (size === 'large') {
      return `https://www.themealdb.com/images/ingredients/${formattedIngredient}-large.png`;
    } else {
      return `https://www.themealdb.com/images/ingredients/${formattedIngredient}.png`;
    }
  };