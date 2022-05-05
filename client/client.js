/* ******************************************************************
 * Constantes de configuration
 * ****************************************************************** */
const apiKey = "ae7e4634-7754-4704-ad5d-86bdbb232c12"; //"69617e9b-19db-4bf7-a33f-18d4e90ccab7";
const serverUrl = "https://lifap5.univ-lyon1.fr";
const login = "p2002495";

/* ******************************************************************
 * Gestion de la boîte de dialogue (a.k.a. modal) d'affichage de
 * l'utilisateur.
 * ****************************************************************** */

/**
 * Fait une requête GET authentifiée sur /whoami
 * @returns une promesse du login utilisateur ou du message d'erreur
 */
function fetchWhoami() {
  return fetch(serverUrl + "/whoami", { headers: { "Api-Key": apiKey } })
    .then((response) => {
      if (response.status === 401) {
        return response.json().then((json) => {
          console.log(json);
          return { err: json.message };
        });
      } else {
        return response.json();
      }
    })
    .catch((erreur) => ({ err: erreur }));
}

/**
 * Fait une requête sur le serveur et insère le login dans la modale d'affichage
 * de l'utilisateur puis déclenche l'affichage de cette modale.
 *
 * @param {Etat} etatCourant l'état courant
 * @returns Une promesse de mise à jour
 */
function lanceWhoamiEtInsereLogin(etatCourant) {
  return fetchWhoami().then((data) => {
    majEtatEtPage(etatCourant, {
      login: data.user, // qui vaut undefined en cas d'erreur
      errLogin: data.err, // qui vaut undefined si tout va bien
      loginModal: true, // on affiche la modale
    });
  });
}

/**
 * Génère le code HTML du corps de la modale de login. On renvoie en plus un
 * objet callbacks vide pour faire comme les autres fonctions de génération,
 * mais ce n'est pas obligatoire ici.
 * @param {Etat} etatCourant
 * @returns un objet contenant le code HTML dans le champ html et un objet vide
 * dans le champ callbacks
 */
function genereModaleLoginBody(etatCourant) {
  const text =
    etatCourant.errLogin !== undefined
      ? etatCourant.errLogin
      : etatCourant.login;
  return {
    html: `
  <section class="modal-card-body">
    <p>${text}</p>
  </section>
  `,
    callbacks: {},
  };
}

/**
 * Génère le code HTML du titre de la modale de login et les callbacks associés.
 *
 * @param {Etat} etatCourant
 * @returns un objet contenant le code HTML dans le champ html et la description
 * des callbacks à enregistrer dans le champ callbacks
 */
function genereModaleLoginHeader(etatCourant) {
  return {
    html: `
<header class="modal-card-head  is-back">
  <p class="modal-card-title">Utilisateur</p>
  <button
    id="btn-close-login-modal1"
    class="delete"
    aria-label="close"
    ></button>
</header>`,
    callbacks: {
      "btn-close-login-modal1": {
        onclick: () => majEtatEtPage(etatCourant, { loginModal: false }),
      },
    },
  };
}

/**
 * Génère le code HTML du base de page de la modale de login et les callbacks associés.
 *
 * @param {Etat} etatCourant
 * @returns un objet contenant le code HTML dans le champ html et la description
 * des callbacks à enregistrer dans le champ callbacks
 */
function genereModaleLoginFooter(etatCourant) {
  return {
    html: `
  <footer class="modal-card-foot" style="justify-content: flex-end">
    <button id="btn-close-login-modal2" class="button">Fermer</button>
  </footer>
  `,
    callbacks: {
      "btn-close-login-modal2": {
        onclick: () => majEtatEtPage(etatCourant, { loginModal: false }),
      },
    },
  };
}

/**
 * Génère le code HTML de la modale de login et les callbacks associés.
 *
 * @param {Etat} etatCourant
 * @returns un objet contenant le code HTML dans le champ html et la description
 * des callbacks à enregistrer dans le champ callbacks
 */
function genereModaleLogin(etatCourant) {
  const header = genereModaleLoginHeader(etatCourant);
  const footer = genereModaleLoginFooter(etatCourant);
  const body = genereModaleLoginBody(etatCourant);
  const activeClass = etatCourant.loginModal ? "is-active" : "is-inactive";
  return {
    html: `
      <div id="mdl-login" class="modal ${activeClass}">
        <div class="modal-background"></div>
        <div class="modal-card">
          ${header.html}
          ${body.html}
          ${footer.html}
        </div>
      </div>`,
    callbacks: { ...header.callbacks, ...footer.callbacks, ...body.callbacks },
  };
}

/* ************************************************************************
 * Gestion de barre de navigation contenant en particulier les bouton Pokedex,
 * Combat et Connexion.
 * ****************************************************************** */

/**
 * Déclenche la mise à jour de la page en changeant l'état courant pour que la
 * modale de login soit affichée
 * @param {Etat} etatCourant
 */
function afficheModaleConnexion(etatCourant) {
  lanceWhoamiEtInsereLogin(etatCourant);
}

/**
 * Génère le code HTML et les callbacks pour la partie droite de la barre de
 * navigation qui contient le bouton de login.
 * @param {Etat} etatCourant
 * @returns un objet contenant le code HTML dans le champ html et la description
 * des callbacks à enregistrer dans le champ callbacks
 */
function genereBoutonConnexion(etatCourant) {
  const html = `
  <div class="navbar-end">
    <div class="navbar-item">
      <div class="buttons">
        <a id="btn-open-login-modal" class="button is-light"> Connexion </a>
      </div>
    </div>
  </div>`;
  return {
    html: html,
    callbacks: {
      "btn-open-login-modal": {
        onclick: () => afficheModaleConnexion(etatCourant),
      },
    },
  };
}

/**
 * Génère le code HTML de la barre de navigation et les callbacks associés.
 * @param {Etat} etatCourant
 * @returns un objet contenant le code HTML dans le champ html et la description
 * des callbacks à enregistrer dans le champ callbacks
 */
function genereBarreNavigation(etatCourant) {
  const connexion = genereBoutonConnexion(etatCourant);
  return {
    html: `
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar">
      <div class="navbar-item"><div class="buttons">
          <a id="btn-pokedex" class="button is-light"> Pokedex </a>
          <a id="btn-combat" class="button is-light"> Combat </a>
      </div></div>
      ${connexion.html}
    </div>
  </nav>`,
    callbacks: {
      ...connexion.callbacks,
      "btn-pokedex": { onclick: () => console.log("click bouton pokedex") },
    },
  };
}

function genereListPokemon(etatCourant)
{
  const ligneTab = etatCourant.Pokemons.map((pokemon) => `<tr id="pokemon-${pokemon.PokedexNumber}" class="${etatCourant.pokemon && etatCourant.pokemon.PokedexNumber == pokemon.PokedexNumber ? "is-selected" : "" }">
  <td><a id="${pokemon.Name}"><img src="${pokemon.Images.Detail}" alt="${pokemon.Name}" width="64" /></a></td>
  <td><div class="content">${pokemon.PokedexNumber}</div></td>
  <td><div class="content">${pokemon.Name}</div></td>
  <td>${pokemon.Abilities.join("\n")}</td>
  <td>${pokemon.Types.join("\n")}</td>
  </tr>`).join("")
  const html = `<table class="table is-fullwidth">
              <thead>
                    <tr>
                        <th id="image">Image</th>
                        <th id="numero">#<i class="fas fa-angle-up"></i></th>
                        <th id="name">Name</th>
                        <th id="abili">Abilities</th>
                        <th id="type">Types</th>
                    </tr>
                </thead>
                <tbody>
                    ${ligneTab}
                </tbody>
              </table>`
    
  const callbacks = etatCourant.Pokemons.map((pokemon) => ({
                [`pokemon-${pokemon.PokedexNumber}`]: {
                    onclick: () => { 
                        console.log("click pokemon", pokemon.PokedexNumber);
                        majEtatEtPage(etatCourant, { pokemon: pokemon });
                    },
                },

            }))
  
    return {
    html : html,

    callbacks : callbacks.reduce((acc, cur) => ({...acc, ...cur }), {})
    

  }
}

function Tripokemon(etatCourant)
{
  const pkmn = genereListPokemon(etatCourant);
  const html = pkmn.html;

  const callbacks = ({
    "numero":{
      onclick: () => {
        console.log("numéro");
        console.log("ordre : ",etatCourant.ordre)
        if(etatCourant.ordre)
        {
          Pokemons = etatCourant.Pokemons.sort((a,b)=>a.PokedexNumber - b.PokedexNumber);
          ordre = false;
          majEtatEtPage(etatCourant,{ordre: ordre});
        }
        else
        {
          Pokemons = etatCourant.Pokemons.sort((a,b)=>b.PokedexNumber - a.PokedexNumber);
          ordre = true;
          majEtatEtPage(etatCourant,{ordre: ordre});
        }
        majEtatEtPage(etatCourant,{Pokemons: Pokemons });
      }
    },
    "name":{
      onclick: () => {
        console.log("name");
        Pokemons =  etatCourant.Pokemons.sort((a,b)=>a.Name.localeCompare(b.Name));
        majEtatEtPage(etatCourant,{Pokemons: Pokemons });
      }
    },
    "abili":{
      onclick: () => {
        console.log("abili");
        Pokemons =  etatCourant.Pokemons.sort((a,b)=>a.Abilities[0].localeCompare(b.Abilities[0]));
        majEtatEtPage(etatCourant,{Pokemons: Pokemons});
      }
    },
    "type":{
      onclick: () => {
        console.log("type");
        Pokemons =  etatCourant.Pokemons.sort((a,b)=>a.Types[0].localeCompare(b.Types[0]));
        majEtatEtPage(etatCourant,{Pokemons: Pokemons});
      }
    },
    ...pkmn.callbacks
  })

  return {
    html : html,
    callbacks: callbacks
  }
}

function genereInfoPokemon(etatCourant)
{
  const pkmn = etatCourant.pokemon;
  if(!pkmn) return{html:"",callbacks:{}};
  console.log(pkmn);
  console.log(pkmn.Against);
  const html = `<div class="column">
                    <div class="card">
                      <div class="card-header">
                        <div class="card-header-title">${pkmn.JapaneseName} (#${pkmn.PokedexNumber})</div>
                      </div>
                      <div class="card-content">
                        <article class="media">
                          <div class="media-content">
                            <h1 class="title">${pkmn.Name}</h1>
                          </div>
                        </article>
                      </div>
                      <div class="card-content">
                        <article class="media">
                          <div class="media-content">
                            <div class="content has-text-left">
                              <p>Hit point : ${pkmn.Attack}</p>
                              <h3>Abilities</h3>
                              <ul>
                                <li>${pkmn.Abilities.join("</li><li>")}</li>
                              </ul>
                              <h3>Resistant against</h3>
                              <ul>
                                <li>${Object.keys(pkmn.Against).filter(x => pkmn.Against[x] < 1).join("</li><li>")}</li>
                              </ul>
                              <h3>Weak against</h3>
                              <ul><li> ${Object.keys(pkmn.Against).filter(x => pkmn.Against[x] > 1).join("</li><li>")} </li></ul>
                            </div>
                          </div>
                          <figure class="media-right">
                            <figure class="image is-475x475">
                              <img
                               class src = ${pkmn.Images.Full}
                               alt = "${pkmn.Name}"
                              />
                            </figure>
                          </figure>
                        </article>
                      </div>
                      <div class="card-footer">
                        <article class="media">
                          <div class="media-content">
                            <button class="is-success button" tabindex="0">
                              Ajouter à mon deck
                            </button>
                          </div>
                        </article>
                      </div>
                    </div>
                  </div>
              `
    const callback = {}
    return {
        html : html,
        callbacks : callback,
    }
}

function genereDeck(etatCourant)
{
  const ligneTab = etatCourant.Deck.map((pokemon) => `<tr id="pokemon-${pokemon.PokedexNumber}">
  <td><img src="${pokemon.Images.Detail}" alt="${pokemon.Name}"/></td>
  <td>${pokemon.PokedexNumber}</td>
  <td>${pokemon.Name}</td>
  <td>${pokemon.Abilities.join("\n")}</td>
  <td>${pokemon.Types.join("\n")}</td>
  </tr>`).join("")

  const html = `<table class="table is-fullwidth">
  <thead>
        <tr>
            <th>Image</th>
            <th>#<i class="fas fa-angle-up"></i></th>
            <th>Name</th>
            <th>Abilities</th>
            <th>Types</th>
        </tr>
    </thead>
    <tbody>
        ${ligneTab}
    </tbody>
  </table>`

  return {
    html : html,
    callbacks : {}

  }
}

function generePokedex(etatCourant)
{
  const pkmn = Tripokemon(etatCourant);
  const infoPkmn = genereInfoPokemon(etatCourant);

  const html = `<div class="columns">
                    <div class="column">
                        <div class="tabs is-centered">
                         <ul>
                            <li class="is-active" id="tab-all-pokemons">
                              <a>Tous les pokemons</a>
                            </li>
                            <li id="tab-tout"><a>Mes pokemons</a></li>
                          </ul>
                       </div>
                      <div id="tbl-pokemons">
                        ${pkmn.html}
                      </div>
                    </div>
                    ${infoPkmn.html}
                  </div>
                `
  const callback =  {...pkmn.callbacks, ...infoPkmn.callbacks}

  return{
    html: html,
    callbacks : callback
  }
}



/**
 * Génére le code HTML de la page ainsi que l'ensemble des callbacks à
 * enregistrer sur les éléments de cette page.
 *
 * @param {Etat} etatCourant
 * @returns un objet contenant le code HTML dans le champ html et la description
 * des callbacks à enregistrer dans le champ callbacks
 */
function generePage(etatCourant) {
  const barredeNavigation = genereBarreNavigation(etatCourant);
  const modaleLogin = genereModaleLogin(etatCourant);
  const Pokedex = generePokedex(etatCourant);
  const deck = genereDeck(etatCourant);
  // remarquer l'usage de la notation ... ci-dessous qui permet de "fusionner"
  // les dictionnaires de callbacks qui viennent de la barre et de la modale.
  // Attention, les callbacks définis dans modaleLogin.callbacks vont écraser
  // ceux définis sur les mêmes éléments dans barredeNavigation.callbacks. En
  // pratique ce cas ne doit pas se produire car barreDeNavigation et
  // modaleLogin portent sur des zone différentes de la page et n'ont pas
  // d'éléments en commun.
  return {
    html: barredeNavigation.html + modaleLogin.html + deck.html + Pokedex.html,
    callbacks: { ...barredeNavigation.callbacks, ...modaleLogin.callbacks, ...deck.callbacks, ...Pokedex.callbacks},
  };
}

/* ******************************************************************
 * Initialisation de la page et fonction de mise à jour
 * globale de la page.
 * ****************************************************************** */

/**
 * Créée un nouvel état basé sur les champs de l'ancien état, mais en prenant en
 * compte les nouvelles valeurs indiquées dans champsMisAJour, puis déclenche la
 * mise à jour de la page et des événements avec le nouvel état.
 *
 * @param {Etat} etatCourant etat avant la mise à jour
 * @param {*} champsMisAJour objet contenant les champs à mettre à jour, ainsi
 * que leur (nouvelle) valeur.
 */
function majEtatEtPage(etatCourant, champsMisAJour) {
  const nouvelEtat = { ...etatCourant, ...champsMisAJour };
  majPage(nouvelEtat);
}

/**
 * Prend une structure décrivant les callbacks à enregistrer et effectue les
 * affectation sur les bon champs "on...". Par exemple si callbacks contient la
 * structure suivante où f1, f2 et f3 sont des callbacks:
 *
 * { "btn-pokedex": { "onclick": f1 },
 *   "input-search": { "onchange": f2,
 *                     "oninput": f3 }
 * }
 *
 * alors cette fonction rangera f1 dans le champ "onclick" de l'élément dont
 * l'id est "btn-pokedex", rangera f2 dans le champ "onchange" de l'élément dont
 * l'id est "input-search" et rangera f3 dans le champ "oninput" de ce même
 * élément. Cela aura, entre autres, pour effet de délclencher un appel à f1
 * lorsque l'on cliquera sur le bouton "btn-pokedex".
 *
 * @param {Object} callbacks dictionnaire associant les id d'éléments à un
 * dictionnaire qui associe des champs "on..." aux callbacks désirés.
 */
function enregistreCallbacks(callbacks) {
  Object.keys(callbacks).forEach((id) => {
    const elt = document.getElementById(id);
    if (elt === undefined || elt === null) {
      console.log(
        `Élément inconnu: ${id}, impossible d'enregistrer de callback sur cet id`
      );
    } else {
      Object.keys(callbacks[id]).forEach((onAction) => {
        elt[onAction] = callbacks[id][onAction];
      });
    }
  });
}

/**
 * Mets à jour la page (contenu et événements) en fonction d'un nouvel état.
 *
 * @param {Etat} etatCourant l'état courant
 */
function majPage(etatCourant) {
  console.log("CALL majPage");
  const page = generePage(etatCourant);
  document.getElementById("root").innerHTML = page.html;
  enregistreCallbacks(page.callbacks);
}

/**
 * Appelé après le chargement de la page.
 * Met en place la mécanique de gestion des événements
 * en lançant la mise à jour de la page à partir d'un état initial.
 */
async function initClientPokemons() {
  console.log("CALL initClientPokemons");
  const etatInitial = {
    loginModal: false,
    login: undefined,
    errLogin: undefined,
    ordre: true,
    Pokemons: (await getPokemon()).sort((a,b)=>a.PokedexNumber - b.PokedexNumber),
    Deck : await getDeck(),
    
  };
  majPage(etatInitial);
}

// Appel de la fonction init_client_duels au après chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  console.log("Exécution du code après chargement de la page");
  initClientPokemons();
});

function getPokemon() {
  return fetch(serverUrl + "/pokemon", { headers: { "Api-Key": apiKey } })
    .then((response) => {
      if (response.status === 401) {
        return response.json().then((json) => {
          console.log(json);
          return { err: json.message };
        });
      } else {
        return response.json();
      }
    })
    .catch((erreur) => ({ err: erreur }));
}

function getDeck() {
  return fetch(serverUrl + "/deck/" + login, { headers: { "Api-Key": apiKey } })
    .then((response) => {
      if (response.status === 401) {
        return response.json().then((json) => {
          ;
          console.log(json);
          return { err: json.message };
        });
      } else {
        return response.json();
      }
    })
    .catch((erreur) => ({ err: erreur }));
}