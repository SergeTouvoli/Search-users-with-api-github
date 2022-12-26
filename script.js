// URL de l'API GitHub
const API_URL = 'https://api.github.com/users/';

// Références aux éléments HTML
const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

/**
 * Récupère les données d'un utilisateur à partir de son nom d'utilisateur sur GitHub
 * @param {string} username - Nom d'utilisateur GitHub
 */
async function getUser(username) {
  try {
    // Récupère les données de l'utilisateur à partir de l'API GitHub
    const { data } = await axios(API_URL + username);

    createUserCard(data);
    getRepos(username);

  } catch (err) {
    // Si l'utilisateur n'est pas trouvé, affiche un message d'erreur
    if (err.response.status == 404) {
      createErrorCard('Aucun profil avec ce nom d\'utilisateur');
    }
  }
}

/**
 * Récupère les repos d'un utilisateur à partir de son nom d'utilisateur sur GitHub
 * @param {string} username - Nom d'utilisateur GitHub
 */
async function getRepos(username) {
  try {
    // Récupère les repos de l'utilisateur à partir de l'API GitHub
    const { data } = await axios(API_URL + username + '/repos?sort=created');

    // Ajoute les dépôts à la carte d'utilisateur
    addReposToCard(data);
  } catch (err) {
    // Si il y a un problème lors de la récupération des dépôts, affiche un message d'erreur
    createErrorCard('Problème lors de la récupération des repos');
  }
}

/**
 * Crée une carte d'utilisateur à partir des données d'un utilisateur
 * @param {object} user - Données d'un utilisateur
 */
function createUserCard(user) {
    // Use the user's name if available, otherwise use their login name
    const userId = user.name || user.login;
    // Use the user's bio if available, otherwise leave it blank
    const userBio = user.bio ? `<p>${user.bio}</p>` : '';
    // Create the HTML for the card
    const cardHtml = `
      <div class="card">
        <div>
          <img src="${user.avatar_url}" alt="${user.name}" class="avatar">
        </div>
        <div class="user-info">
          <h2>${userId}</h2>
          ${userBio}
          <ul>
            <li>${user.followers} <strong>Followers</strong></li>
            <li>${user.following} <strong>Following</strong></li>
            <li>${user.public_repos} <strong>Repos</strong></li>
          </ul>
          <div id="repos"></div>
        </div>
      </div>
    `;
    // Set the HTML of the main element to the card HTML
    main.innerHTML = cardHtml;
}



/**
 * Crée une carte d'erreur avec le message donné.
 * @param {string} msg - Le message à afficher dans la carte d'erreur.
 */
function createErrorCard(msg) {
    // Crée le HTML de la carte d'erreur
    const cardHtml = `
      <div class="card">
        <h1>${msg}</h1>
      </div>
    `;
  
    // Définit le HTML de l'élément principal sur le HTML de la carte d'erreur
    main.innerHTML = cardHtml;
  }
  
  
/**
 * Ajoute les dépôts au profil de l'utilisateur.
 * @param {Array} repos - La liste des dépôts à ajouter au profil.
 */
function addReposToCard(repos) {
    // Récupère l'élément qui va contenir les dépôts
    const reposEl = document.getElementById('repos');
  
    // Crée un élément ancre pour chaque dépôt
    repos
      .slice(0, 5) // Affiche seulement les 5 premiers dépôts
      .forEach((repo) => {
        const repoEl = document.createElement('a');
        repoEl.classList.add('repo');
        repoEl.href = repo.html_url;
        repoEl.target = '_blank';
        repoEl.innerText = repo.name;
  
        // Ajoute l'élément ancre au conteneur des dépôts
        reposEl.appendChild(repoEl);
      });
}
  
  // Lorsque le formulaire est soumis, empêchez l'action par défaut et récupérez les données de l'utilisateur
  form.addEventListener('submit', (e) => {
    e.preventDefault();
  
    const user = search.value;
  
    if (user) {
      // Récupérer les données utilisateur et effacer l'entrée de recherche
      getUser(user);
      search.value = '';
    }
  });
  