// Entêtes du tableau
const tableHeaders = ['userId', 'id', 'title', 'completed'];

// Chargement des données stocker dans le fichiers JSON
async function loadData() {
   try {
      const response = await fetch('data/todos.data.json');
      const data = await response.json();
      renderTable(tableHeaders, data, 'html-todo-table');
   } catch (error) {
      console.error("Erreur lors du chargement des données :", error);
   }
}

// Création du tableau
function renderTable(headers, data, containerId) {
   const container = document.getElementById(containerId);
   if (!container) return;

   // Structure et titre du tableau

   const table = document.createElement('table');
   table.className = 'todo-table';
   table.setAttribute('aria-labelledby', 'title-table');

   // En-tête du tableau

   const thead = document.createElement('thead');
   thead.className = 'todo-table--head';

   const headerRow = document.createElement('tr');

   headers.forEach(header => {
      const th = document.createElement('th');
      th.className = `todo-table--head--title title__${header}`;
      th.textContent = header;
      th.scope = 'col';
      headerRow.appendChild(th);
   });

   thead.appendChild(headerRow);
   table.appendChild(thead);

   // Contenu du tableau

   const tbody = document.createElement('tbody');
   tbody.className = 'todo-table--body';

   // Fragment pour limiter les reflows
   const fragment = document.createDocumentFragment();

   data.forEach(item => {
      const tr = document.createElement('tr');

      headers.forEach(key => {
         const td = document.createElement('td');
         td.className = 'todo-table--body--content';
         td.textContent = item[key];
         tr.appendChild(td);
      });

      fragment.appendChild(tr);
   });

   tbody.appendChild(fragment);
   table.appendChild(tbody);
   container.appendChild(table);
}

// Lancer le chargement
loadData();
