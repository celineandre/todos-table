// Création du tableau
export function renderTable(headers, data, containerId, mappingColumnNames, options = {}) {
   const {
      sortable = false,
      pagination = false,
      rowsPerPage = 10,
      titleTable = 'caption', // caption or targetId
      titleTableValue = 'Titre du tableau'
   } = options;
   const container = document.getElementById(containerId);
   if (!container) return;

   let currentSort = {
      key: null,
      direction: 'asc'
   };

   // Structure du tableau

   const table = document.createElement('table');
   table.className = 'todo-table';

   // Titre du tableau

   if (titleTable === 'targetId') {
      table.setAttribute('aria-labelledby', titleTableValue);
   }

   if (titleTable === 'caption') {
      const caption = document.createElement('caption');
      caption.textContent = titleTableValue;
      table.appendChild(caption);
   }

   // En-tête du tableau (colonne)

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
         button.textContent = mappingColumnNames[key] || key;
         button.dataset.key = key;

         button.addEventListener('click', () => {
            activateSort(key);
         });

         th.appendChild(button);
      } else {
         th.textContent = mappingColumnNames[key] || key;
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

   // Pagination

   let currentPage = 1;
   const totalPages = pagination ? Math.ceil(data.length / rowsPerPage) : 1;

   // Création des boutons de pagination
   let paginationDiv, prevBtn, nextBtn;
   if (pagination) {
      const paginationDiv = document.createElement('div');
      paginationDiv.className = 'todo-table--pagination';

      // Informations sur le nombre de page
      const pageInfo = document.createElement('p');
      pageInfo.className = 'todo-table--pagination--info';
      pageInfo.textContent = `Page ${currentPage} / ${totalPages}`;
      paginationDiv.appendChild(pageInfo);

      // Bouton "Première page"
      const firstBtn = document.createElement('button');
      firstBtn.setAttribute('title', 'Première page');
      firstBtn.disabled = currentPage === 1;
      firstBtn.addEventListener('click', () => {
         currentPage = 1;
         renderBody(data);
         updatePaginationButtons();
      });
      const firstBtnSpanIcon = document.createElement('span');
      firstBtnSpanIcon.textContent = '⇤';
      firstBtnSpanIcon.setAttribute('aria-hidden', 'true');
      firstBtn.appendChild(firstBtnSpanIcon);
      const firstBtnSpanAlt = document.createElement('span');
      firstBtnSpanAlt.textContent = 'Première page';
      firstBtnSpanAlt.className = 'sr-only';
      firstBtn.appendChild(firstBtnSpanAlt);

      // Bouton "Page précédente"
      const prevBtn = document.createElement('button');
      prevBtn.setAttribute('title', 'Page précédente');
      prevBtn.disabled = currentPage === 1;
      prevBtn.addEventListener('click', () => {
         if (currentPage > 1) {
            currentPage--;
            renderBody(data);
            updatePaginationButtons();
         }
      });
      const prevBtnSpanIcon = document.createElement('span');
      prevBtnSpanIcon.textContent = '⟵';
      prevBtnSpanIcon.setAttribute('aria-hidden', 'true');
      prevBtn.appendChild(prevBtnSpanIcon);
      const prevBtnSpanAlt = document.createElement('span');
      prevBtnSpanAlt.textContent = 'Page précédente';
      prevBtnSpanAlt.className = 'sr-only';
      prevBtn.appendChild(prevBtnSpanAlt);

      // Bouton "Page suivante"
      const nextBtn = document.createElement('button');
      nextBtn.setAttribute('title', 'Page suivante');
      nextBtn.disabled = currentPage === totalPages;
      nextBtn.addEventListener('click', () => {
         if (currentPage < totalPages) {
            currentPage++;
            renderBody(data);
            updatePaginationButtons();
         }
      });
      const nextBtnSpanIcon = document.createElement('span');
      nextBtnSpanIcon.textContent = '⟶';
      nextBtnSpanIcon.setAttribute('aria-hidden', 'true');
      nextBtn.appendChild(nextBtnSpanIcon);
      const nextBtnSpanAlt = document.createElement('span');
      nextBtnSpanAlt.textContent = 'Page suivante';
      nextBtnSpanAlt.className = 'sr-only';
      nextBtn.appendChild(nextBtnSpanAlt);

      // Bouton "Dernière page"
      const lastBtn = document.createElement('button');
      lastBtn.setAttribute('title', 'Dernière page');
      lastBtn.disabled = currentPage === totalPages;
      lastBtn.addEventListener('click', () => {
         currentPage = totalPages;
         renderBody(data);
         updatePaginationButtons();
      });
      const lastBtnSpanIcon = document.createElement('span');
      lastBtnSpanIcon.textContent = '⇥';
      lastBtnSpanIcon.setAttribute('aria-hidden', 'true');
      lastBtn.appendChild(lastBtnSpanIcon);
      const lastBtnSpanAlt = document.createElement('span');
      lastBtnSpanAlt.textContent = 'Dernière page';
      lastBtnSpanAlt.className = 'sr-only';
      lastBtn.appendChild(lastBtnSpanAlt);

      // Ordre d'affichage des boutons
      paginationDiv.appendChild(firstBtn);
      paginationDiv.appendChild(prevBtn);
      paginationDiv.appendChild(nextBtn);
      paginationDiv.appendChild(lastBtn);

      container.appendChild(paginationDiv);

      // Actualisation des états
      function updatePaginationButtons() {
         prevBtn.disabled = currentPage === 1;
         firstBtn.disabled = currentPage === 1;
         nextBtn.disabled = currentPage === totalPages;
         lastBtn.disabled = currentPage === totalPages;

         pageInfo.textContent = `Page ${currentPage} / ${totalPages}`;
      }
   }

   renderBody(data);

   // =============================

   function renderBody(rows) {
      tbody.innerHTML = '';
      const fragment = document.createDocumentFragment(); // Fragment pour limiter les reflows

      const start = pagination ? (currentPage - 1) * rowsPerPage : 0;
      const end = pagination ? start + rowsPerPage : rows.length;
      rows.slice(start, end).forEach(item => {
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
               titleText = `${mappingColumnNames[key] || key} - Tri par ordre croissant`;
               break;

            case 'descending':
               titleText = `${mappingColumnNames[key] || key} - Tri par ordre descendant`;
               break;

            default:
               titleText = `${mappingColumnNames[key] || key}`;
         }

         button.setAttribute('title', titleText);
      });
   }
}
