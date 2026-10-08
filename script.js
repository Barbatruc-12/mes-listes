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
            boutonSupprimer.textContent = "Supprimer";

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
