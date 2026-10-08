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
        boutonOuvrir.textContent = "🛒 " + liste.nom;

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

function ouvrirListe(id) {
    const liste = listesCourses.find(function(element) {
        return element.id === id;
    });

    if (!liste) return;

    titreListe.textContent = liste.nom;

    document.querySelector(".creation-liste").hidden = true;
    conteneurListes.hidden = true;
    detailListe.hidden = false;
}

function retournerAuxListes() {
    document.querySelector(".creation-liste").hidden = false;
    conteneurListes.hidden = false;
    detailListe.hidden = true;
}

boutonCreerListe.addEventListener("click", creerListe);

champNomListe.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        creerListe();
    }
});

boutonRetour.addEventListener("click", retournerAuxListes);

afficherListes();
