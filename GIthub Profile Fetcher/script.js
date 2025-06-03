// 1. GLOBAL VARIABLES
// These variables store data throughout the app
let currentUser = null;        // Stores the current user's profile data
let currentRepos = [];         // Stores the current user's repositories
// 2. LANGUAGE COLORS MAPPING
// When we show a repository, we use these colors for the language dot
const languageColors = {
  'JavaScript': '#f1e05a',    
  'TypeScript': '#2b7489',  
  'Python': '#3572A5',  
  'Java': '#b07219',    
  'C++': '#f34b7d',  
  'C': '#555555',  
  'C#': '#239120',   
  'PHP': '#4F5D95',    
  'Ruby': '#701516', 
  'Go': '#00ADD8',  
  'Rust': '#dea584',    
  'Swift': '#ffac45',    
  'Kotlin': '#F18E33',    
  'Dart': '#00B4AB',  
  'HTML': '#e34c26', 
  'CSS': '#1572B6',  
  'Vue': '#4FC08D',   
  'React': '#61DAFB',        
  'Angular': '#DD0031', 
  'Node.js': '#339933',   
  'Shell': '#89e051',   
  'PowerShell': '#012456',     
  'Dockerfile': '#384d54',  
  'default': '#858585'  
};
// 3. UTILITY FUNCTIONS
// Function to format large numbers (like 1000 becomes 1k, 1000000 becomes 1M)
function formatNumber(num) {                     //called on 
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';  // Convert to millions
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';     // Convert to thousands
  }
  return num.toString();                      // Return as is if less than 1000
}

// Function to format dates to show "how long ago" something was updated
function formatDate(dateString) {
  const date = new Date(dateString);          // Convert string to Date object
  const now = new Date();                     // Get current date
  const diffTime = Math.abs(now - date);      // Calculate time difference
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert to days

  // Return appropriate format based on how many days ago
  if (diffDays === 1) return 'Updated 1 day ago';
  if (diffDays < 7) return `Updated ${diffDays} days ago`;
  if (diffDays < 30) return `Updated ${Math.ceil(diffDays / 7)} week${Math.ceil(diffDays / 7) > 1 ? 's' : ''} ago`;
  if (diffDays < 365) return `Updated ${Math.ceil(diffDays / 30)} month${Math.ceil(diffDays / 30) > 1 ? 's' : ''} ago`;
  return `Updated ${Math.ceil(diffDays / 365)} year${Math.ceil(diffDays / 365) > 1 ? 's' : ''} ago`;
}

// Function to get the color for a programming language
function getLanguageColor(language) {
  // Return the color from our mapping, or default gray if language not found
  return languageColors[language] || languageColors.default;
}


// 4. API FUNCTIONS
// These functions fetch data from GitHub's API
// Function to fetch user profile data from GitHub
async function fetchGitHubUser(username) {
  console.log(`Fetching user data for: ${username}`);
  // Make API call to GitHub
  const response = await fetch(`https://api.github.com/users/${username}`);
  // Check if the request was successful
  if (!response.ok) {
    throw new Error(`User not found: ${response.status}`);
  }
  // Convert response to JSON and return it
  return await response.json();
}

// Function to fetch user's repositories from GitHub
async function fetchUserRepos(username) {
  console.log(`Fetching repositories for: ${username}`);
  // Make API call to GitHub (sorted by stars, max 30 repos)
  const response = await fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=30`);
  // Check if the request was successful
  if (!response.ok) {
    throw new Error(`Failed to fetch repositories: ${response.status}`);
  }
  // Convert response to JSON and return it
  return await response.json();
}

// 5. UI UPDATE FUNCTIONS
// These functions update the HTML elements with new data
// Function to update the profile section with user data
function updateProfileUI(user) {
  console.log('Updating profile UI with user data:', user);
  // Update avatar image
  document.getElementById('userAvatar').src = user.avatar_url;
  document.getElementById('userAvatar').alt = `${user.login} avatar`;
  // Update name and username
  document.getElementById('userName').textContent = user.name || user.login;
  document.getElementById('userLogin').textContent = `@${user.login}`;
  // Update bio (or show default message if no bio)
  document.getElementById('userBio').textContent = user.bio || 'No bio available';
  // Update location, company, and join date
  updateUserDetails(user);
  // Update stats (repos, followers, following)
  document.getElementById('totalRepos').textContent = formatNumber(user.public_repos);    // function at line number at 37
  document.getElementById('totalFollowers').textContent = formatNumber(user.followers);   // function at line number at 37  
  document.getElementById('totalFollowing').textContent = formatNumber(user.following);   // function at line number at 37
}
// Function to update user details (location, company, join date)
function updateUserDetails(user) {
  const locationEl = document.getElementById('userLocation');
  const companyEl = document.getElementById('userCompany');
  const joinedEl = document.getElementById('userJoined');
  // Update location (hide if not available)
  if (user.location) {
    locationEl.style.display = 'flex';
    locationEl.querySelector('span').textContent = user.location;
  } else {
    locationEl.style.display = 'none';
  }
  // Update company (hide if not available)
  if (user.company) {
    companyEl.style.display = 'flex';
    companyEl.querySelector('span').textContent = user.company;
  } else {
    companyEl.style.display = 'none';
  }
  // Update join date
  const joinedYear = new Date(user.created_at).getFullYear();
  joinedEl.querySelector('span').textContent = `Joined ${joinedYear}`;
}
// Function to update the repositories section with repos data
function updateRepositoriesUI(repos) {
  console.log('Updating repositories UI with repos data:', repos);
  const reposGrid = document.getElementById('repositoriesGrid');
  const repoCount = document.getElementById('repoCount');
  // Update repository count
  repoCount.textContent = `(${repos.length})`;
  // Calculate total stars across all repositories
  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  document.getElementById('totalStars').innerHTML = `★ ${formatNumber(totalStars)}`;  // at 47
  // Clear existing repository cards
  reposGrid.innerHTML = '';
  // Create a card for each repository
  repos.forEach(repo => {
    const repoCard = createRepositoryCard(repo);
    reposGrid.appendChild(repoCard);
  });
}
// Function to create a single repository card
function createRepositoryCard(repo) {
  // Create the main card element
  const card = document.createElement('div');
  card.className = 'bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:transform hover:scale-105 group cursor-pointer';
  // Determine repository type (Fork, Private, or Public)
  const isPrivate = repo.private;
  const repoType = repo.fork ? 'Fork' : (isPrivate ? 'Private' : 'Public');
  const typeColor = repo.fork ? 'green' : (isPrivate ? 'yellow' : 'blue');
  // Create the HTML content for the card
  card.innerHTML = `
    <div class="flex items-start justify-between mb-4">
      <h4 class="font-semibold text-white text-lg group-hover:text-blue-300 transition-colors truncate pr-2">${repo.name}</h4>
      <span class="px-2 py-1 bg-${typeColor}-500/20 text-${typeColor}-300 text-xs rounded-full border border-${typeColor}-500/30 whitespace-nowrap">${repoType}</span>
    </div>
    <p class="text-gray-300 text-sm mb-4 line-clamp-3">
      ${repo.description || 'No description available'}
    </p>
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4 text-sm text-gray-400">
        ${repo.language ? `
          <span class="flex items-center gap-1">
            <div class="w-3 h-3 rounded-full" style="background-color: ${getLanguageColor(repo.language)}"></div>
            ${repo.language}
          </span>
        ` : ''}
        <span class="flex items-center gap-1">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
          ${formatNumber(repo.stargazers_count)}
        </span>
      </div>
      <span class="text-xs text-gray-500">${formatDate(repo.updated_at)}</span>
    </div>
  `;
  // Add click event to open repository in new tab
  card.addEventListener('click', () => {
    window.open(repo.html_url, '_blank');
  });
  return card;
}
// 6. ERROR AND LOADING STATE FUNCTIONS
// These functions handle showing errors and loading states
// Function to show error messages to the user
function showError(message) {
  console.log('Showing error:', message);
  const errorEl = document.getElementById('errorMessage');
  errorEl.textContent = message;
  errorEl.classList.remove('hidden');
  errorEl.classList.add('error-shake');  // Add shake animation
  // Remove shake animation after it completes
  setTimeout(() => {
    errorEl.classList.remove('error-shake');
  }, 820);
  // Hide error after 5 seconds
  setTimeout(() => {
    errorEl.classList.add('hidden');
  }, 5000);
}
// Function to hide error messages
function hideError() {
  document.getElementById('errorMessage').classList.add('hidden');
}
// Function to show/hide loading state for search button
function setLoadingState(isLoading) {
  const searchBtn = document.getElementById('searchBtn');
  const searchBtnText = document.getElementById('searchBtnText');
  const usernameInput = document.getElementById('usernameInput');
  if (isLoading) {
    // Disable button and input, show loading spinner
    searchBtn.disabled = true;
    usernameInput.disabled = true;
    searchBtnText.innerHTML = `
      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Searching...
    `;
  } else {
    // Enable button and input, show normal search icon
    searchBtn.disabled = false;
    usernameInput.disabled = false;
    searchBtnText.innerHTML = `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
      </svg>
      Search
    `;
  }
}
// Function to show/hide loading state for repositories
function setReposLoadingState(isLoading) {
  const reposGrid = document.getElementById('repositoriesGrid');
  const reposLoading = document.getElementById('reposLoading');
  if (isLoading) {
    // Hide repo grid, show loading skeletons
    reposGrid.style.display = 'none';
    reposLoading.classList.remove('hidden');
  } else {
    // Show repo grid, hide loading skeletons
    reposGrid.style.display = 'grid';
    reposLoading.classList.add('hidden');
  }
}
// 7. MAIN SEARCH FUNCTION
// This is the main function that handles the search process
async function searchGitHubUser() {
  // Get the username from the input field
  const username = document.getElementById('usernameInput').value.trim();
  // Check if username is empty
  if (!username) {
    showError('Please enter a GitHub username');
    return;
  }
  // Hide any existing errors and show loading state
  hideError();
  setLoadingState(true);
  try {
    // Step 1: Fetch user profile data
    console.log(`Starting search for user: ${username}`);
    const user = await fetchGitHubUser(username);   // line 69 , 82
    currentUser = user;
    // Update the profile UI with user data
    updateProfileUI(user);
    // Step 2: Fetch user's repositories
    setReposLoadingState(true);
    const repos = await fetchUserRepos(username);   // line 69 , 82
    currentRepos = repos;
    // Update the repositories UI with repos data
    updateRepositoriesUI(repos);
    setReposLoadingState(false);
    console.log('Search completed successfully');
  } catch (error) {
    // Handle any errors that occurred during the search
    console.error('Error during search:', error);
    if (error.message.includes('User not found')) {
      showError(`User "${username}" not found. Please check the username and try again.`);
    } else if (error.message.includes('API rate limit')) {
      showError('GitHub API rate limit exceeded. Please try again later.');
    } else {
      showError('Failed to fetch GitHub data. Please check your internet connection and try again.');
    }
  } finally {
    // Always turn off loading states, regardless of success or failure
    setLoadingState(false);
    setReposLoadingState(false);
  }
}
// 8. EVENT LISTENERS
// This section sets up all the event listeners when the page loads
document.addEventListener('DOMContentLoaded', function() {
  console.log('GitHub Profile Vista initialized');
  // Get references to the search button and input field
  const searchBtn = document.getElementById('searchBtn');
  const usernameInput = document.getElementById('usernameInput');
  // Add click event listener to search button
  searchBtn.addEventListener('click', searchGitHubUser);   // line number 322
  // Add keypress event listener to input field (for Enter key)
  usernameInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      searchGitHubUser();
    }
  });
  // Clear error message when user starts typing
  usernameInput.addEventListener('input', hideError);
});

