    const champTache = document.getElementById("nouvelle-tache");
    const boutonAjouter = document.getElementById("bouton-ajouter");
    const listeTaches = document.getElementById("liste-taches");

    // On récupère les tâches déjà enregistrées.
    let taches = JSON.parse(localStorage.getItem("taches")) || [];

    function sauvegarderTaches() {
        localStorage.setItem("taches", JSON.stringify(taches));
    }

    function afficherTaches() {

        // On vide la liste avant de la reconstruire.
        listeTaches.innerHTML = "";

        taches.forEach(function(tache, index) {

            const ligne = document.createElement("li");
            if (tache.terminee) {
    ligne.classList.add("tache-terminee");
}

            // Case à cocher
            const caseCocher = document.createElement("input");
            caseCocher.type = "checkbox";
            caseCocher.checked = tache.terminee;

            // Texte de la tâche
            const texte = document.createElement("span");
            texte.textContent = tache.texte;

            if (tache.terminee) {
                texte.style.textDecoration = "line-through";
            }

            // Bouton supprimer
            const boutonSupprimer = document.createElement("button");
            boutonSupprimer.textContent = "🗑";
boutonSupprimer.className = "bouton-supprimer";
boutonSupprimer.setAttribute("aria-label", "Supprimer la tâche");
boutonSupprimer.title = "Supprimer la tâche";

            // Quand on coche ou décoche
            caseCocher.addEventListener("change", function() {
                taches[index].terminee = caseCocher.checked;
                sauvegarderTaches();
                afficherTaches();
            });

            // Quand on supprime
            boutonSupprimer.addEventListener("click", function() {
                taches.splice(index, 1);
                sauvegarderTaches();
                afficherTaches();
            });

            ligne.appendChild(caseCocher);
            ligne.appendChild(texte);
            ligne.appendChild(boutonSupprimer);

            listeTaches.appendChild(ligne);
        });
    }

    function ajouterTache() {

        const texteTache = champTache.value.trim();

        if (texteTache !== "") {

            taches.push({
                texte: texteTache,
                terminee: false
            });

            sauvegarderTaches();
            afficherTaches();

            champTache.value = "";
        }
    }

    boutonAjouter.addEventListener("click", ajouterTache);

    afficherTaches();

// NAVIGATION ENTRE LES SECTIONS

const ongletTaches = document.getElementById("onglet-taches");
const ongletCourses = document.getElementById("onglet-courses");

const sectionTaches = document.getElementById("section-taches");
const sectionCourses = document.getElementById("section-courses");

function afficherSection(section) {

    const afficherTaches = section === "taches";

    sectionTaches.hidden = !afficherTaches;
    sectionCourses.hidden = afficherTaches;

    ongletTaches.classList.toggle("actif", afficherTaches);
    ongletCourses.classList.toggle("actif", !afficherTaches);

    ongletTaches.setAttribute("aria-pressed", afficherTaches);
    ongletCourses.setAttribute("aria-pressed", !afficherTaches);
}

ongletTaches.addEventListener("click", function() {
    afficherSection("taches");
});

ongletCourses.addEventListener("click", function() {
    afficherSection("courses");
});

// AJOUTER UNE TÂCHE AVEC ENTRÉE

champTache.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        ajouterTache();
    }
});


// ========================================
// MES LISTES — Gestion des listes thématiques
// ========================================

const champNomListe = document.getElementById("nom-nouvelle-liste");
const boutonCreerListe = document.getElementById("bouton-creer-liste");
const conteneurListes = document.getElementById("conteneur-listes");
const detailListe = document.getElementById("detail-liste");
const titreListe = document.getElementById("titre-liste");
const boutonRetour = document.getElementById("retour-listes");

// Données indépendantes des tâches
let listesCourses = JSON.parse(
    localStorage.getItem("listesCourses")
) || [];

function sauvegarderListes() {
    localStorage.setItem(
        "listesCourses",
        JSON.stringify(listesCourses)
    );
}

function afficherListes() {
    conteneurListes.innerHTML = "";

    listesCourses.forEach(function(liste) {

        const carte = document.createElement("div");
        carte.className = "carte-liste";

        const boutonOuvrir = document.createElement("button");
        boutonOuvrir.className = "ouvrir-liste";
        boutonOuvrir.type = "button";
        const total = liste.articles.length;

const achetes = liste.articles.filter(function(article) {
    return article.achete;
}).length;

boutonOuvrir.textContent =
    "🛒 " + liste.nom +
    " (" + achetes + "/" + total + ")";

        boutonOuvrir.addEventListener("click", function() {
            ouvrirListe(liste.id);
        });

        const boutonSupprimer = document.createElement("button");
        boutonSupprimer.className = "supprimer-liste";
        boutonSupprimer.type = "button";
        boutonSupprimer.textContent = "🗑";
        boutonSupprimer.setAttribute(
            "aria-label",
            "Supprimer " + liste.nom
        );

        boutonSupprimer.addEventListener("click", function() {
            supprimerListe(liste.id);
        });

        carte.appendChild(boutonOuvrir);
        carte.appendChild(boutonSupprimer);
        conteneurListes.appendChild(carte);
    });
}

function creerListe() {
    const nom = champNomListe.value.trim();

    if (nom === "") {
        return;
    }

    const nouvelleListe = {
        id: crypto.randomUUID(),
        nom: nom,
        articles: []
    };

    listesCourses.push(nouvelleListe);
    sauvegarderListes();
    afficherListes();

    champNomListe.value = "";
}

function supprimerListe(id) {
    const liste = listesCourses.find(function(element) {
        return element.id === id;
    });

    if (!liste) return;

    const confirmation = confirm(
        "Supprimer définitivement la liste « " +
        liste.nom + " » ?"
    );

    if (!confirmation) return;

    listesCourses = listesCourses.filter(function(element) {
        return element.id !== id;
    });

    sauvegarderListes();
    afficherListes();
}


let listeOuverteId = null;

function ouvrirListe(id) {
    const liste = listesCourses.find(function(element) {
        return element.id === id;
    });

    if (!liste) return;

    listeOuverteId = id;
    titreListe.textContent = liste.nom;

    document.querySelector(".creation-liste").hidden = true;
    conteneurListes.hidden = true;
    detailListe.hidden = false;

    afficherArticles();
}


function retournerAuxListes() {
    document.querySelector(".creation-liste").hidden = false;
    conteneurListes.hidden = false;
    detailListe.hidden = true;
    listeOuverteId = null;
}

boutonCreerListe.addEventListener("click", creerListe);

champNomListe.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        creerListe();
    }
});

boutonRetour.addEventListener("click", retournerAuxListes);

afficherListes();


// ========================================
// MES LISTES V0.5.2 — ARTICLES
// ========================================

const champArticle = document.getElementById("nouvel-article");
const boutonAjouterArticle = document.getElementById("bouton-ajouter-article");
const listeArticles = document.getElementById("liste-articles");
const messageListeVide = document.getElementById("message-liste-vide");
const boutonViderListe = document.getElementById("vider-liste");

// Récupérer la liste actuellement ouverte
function obtenirListeOuverte() {
    return listesCourses.find(function(liste) {
        return liste.id === listeOuverteId;
    });
}

// Ajouter un article
function ajouterArticle() {
    const nom = champArticle.value.trim();
    const liste = obtenirListeOuverte();

    if (!nom || !liste) return;

    liste.articles.push({
        id: crypto.randomUUID(),
        nom: nom,
        quantite: "",
        achete: false
    });

    sauvegarderListes();
    afficherArticles();

    champArticle.value = "";
    champArticle.focus();
}

// Afficher les articles
function afficherArticles() {
    const liste = obtenirListeOuverte();

    listeArticles.innerHTML = "";

    if (!liste) return;

    messageListeVide.hidden = liste.articles.length > 0;

    liste.articles.forEach(function(article) {

        const ligne = document.createElement("li");
        ligne.className = "ligne-article";

        if (article.achete) {
            ligne.classList.add("article-achete");
        }

        // Case à cocher
        const caseCocher = document.createElement("input");
        caseCocher.type = "checkbox";
        caseCocher.checked = article.achete;
        caseCocher.setAttribute(
            "aria-label",
            "Article acheté : " + article.nom
        );

        caseCocher.addEventListener("change", function() {
            article.achete = caseCocher.checked;
            sauvegarderListes();
            afficherArticles();
        });

        // Nom de l'article
        const nomArticle = document.createElement("span");
        nomArticle.className = "nom-article";
        nomArticle.textContent = article.nom;

        // Quantité modifiable
        const quantite = document.createElement("input");
        quantite.type = "text";
        quantite.className = "quantite-article";
        quantite.placeholder = "Qté";
        quantite.value = article.quantite;
        quantite.maxLength = 20;
        quantite.setAttribute(
            "aria-label",
            "Quantité pour " + article.nom
        );

        quantite.addEventListener("input", function() {
            article.quantite = quantite.value;
            sauvegarderListes();
        });

        ligne.appendChild(caseCocher);
        ligne.appendChild(nomArticle);
        ligne.appendChild(quantite);

        listeArticles.appendChild(ligne);
    });

    afficherListes();
}

// Vider la liste complète
function viderListe() {
    const liste = obtenirListeOuverte();

    if (!liste || liste.articles.length === 0) return;

    const confirmation = confirm(
        "Supprimer tous les articles de « " +
        liste.nom + " » ?"
    );

    if (!confirmation) return;

    liste.articles = [];

    sauvegarderListes();
    afficherArticles();
}

// Événements
boutonAjouterArticle.addEventListener("click", ajouterArticle);

champArticle.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        ajouterArticle();
    }
});

boutonViderListe.addEventListener("click", viderListe);

