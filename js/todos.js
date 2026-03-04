// Entêtes du tableau
const tableHeaders = ['id', 'title', 'completed'];

// Mapping clé JSON → nom affiché dans l'en-tête
const columnNames = {
  id: 'Priorité',
  title: 'Tâche',
  completed: 'Terminé'
};

// Chargement des données stocker dans le fichiers JSON
async function loadData() {
   try {
      const response = await fetch('data/todos.data.json');
      const data = await response.json();
      renderTable(tableHeaders, data, 'html-todo-table', {
         sortable: true
      });
   } catch (error) {
      console.error('Erreur lors du chargement des données :', error);
   }
}

// Création du tableau
function renderTable(headers, data, containerId, options = {}) {
   const { sortable = false } = options;
   const container = document.getElementById(containerId);
   if (!container) return;

   let currentSort = { key: null, direction: 'asc' };

   // Structure et titre du tableau

   const table = document.createElement('table');
   table.className = 'todo-table';
   table.setAttribute('aria-labelledby', 'title-table');

   // En-tête du tableau

   const thead = document.createElement('thead');
   thead.className = 'todo-table--head';

   const headerRow = document.createElement('tr');

   headers.forEach(key => {
      const th = document.createElement('th');
      th.className = `todo-table--head--title title__${key}`;
      th.scope = 'col';
      th.setAttribute('aria-sort', 'none');

      if (sortable) {
         const button = document.createElement('button');
         button.type = 'button';
         button.className = 'todo-table--head--button';
         button.textContent = columnNames[key] || key;
         button.dataset.key = key;

         button.addEventListener('click', () => {
            activateSort(key);
         });

         th.appendChild(button);
      } else {
         th.textContent = columnNames[key] || key;
      }

      headerRow.appendChild(th);
   });

   thead.appendChild(headerRow);
   table.appendChild(thead);

   // Contenu du tableau

   const tbody = document.createElement('tbody');
   tbody.className = 'todo-table--body';
   table.appendChild(tbody);
   container.appendChild(table);

   renderBody(data);

   // =============================

   function renderBody(rows) {
      tbody.innerHTML = '';
      const fragment = document.createDocumentFragment(); // Fragment pour limiter les reflows

      rows.forEach(item => {
         const tr = document.createElement('tr');

         headers.forEach(key => {
            const td = document.createElement('td');
            td.textContent = item[key];
            td.className = 'todo-table--body--content';
            tr.appendChild(td);
         });

         fragment.appendChild(tr);
      });

      tbody.appendChild(fragment);
   }

   function activateSort(key) {
      const direction =
         currentSort.key === key && currentSort.direction === 'asc'
            ? 'desc'
            : 'asc';

      currentSort = { key, direction };

      updateAriaSort();
      sortData(key, direction);
   }

   function sortData(key, direction) {
      const sorted = [...data].sort((a, b) => {
         const valueA = a[key];
         const valueB = b[key];

         if (typeof valueA === 'number') {
            return direction === 'asc'
               ? valueA - valueB
               : valueB - valueA;
         }

         return direction === 'asc'
            ? String(valueA).localeCompare(String(valueB))
            : String(valueB).localeCompare(String(valueA));
      });

      renderBody(sorted);
   }

   function updateAriaSort() {
      const ths = thead.querySelectorAll('th');

      ths.forEach((th, index) => {
         const key = headers[index];
         const button = th.querySelector('button');

         let state = 'none';

         if (key === currentSort.key) {
            state = currentSort.direction === 'asc'
               ? 'ascending'
               : 'descending';
         }

         // Mise à jour aria-sort
         th.setAttribute('aria-sort', state);

         if (!button) return;

         // Mise à jour du title dynamique
         let titleText;

         switch (state) {
            case 'ascending':
               titleText = `${columnNames[key] || key} - Tri par ordre croissant`;
               break;

            case 'descending':
               titleText = `${columnNames[key] || key} - Tri par ordre descendant`;
               break;

            default:
               titleText = `${columnNames[key] || key}`;
         }

         button.setAttribute('title', titleText);
      });
   }
}

// Lancer le chargement
loadData();
