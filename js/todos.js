// Titres du tableau
let tableHeaders = new Array();
tableHeaders.push(["userId", "id", "title", "completed"]);

// Récupérer les données stocker dans le fichiers JSON
fetch('data/todos.data.json')
   .then(function (response) {
      return response.json();
   })
   .then(function (apiJsonData) {
      // console.log(apiJsonData);
      renderDataInTheTable(tableHeaders, apiJsonData, "html-todo-table");
   })

/**
 * Permet d'ajouter dans le tableau ciblé les données sur de nouvelle lignes
 */
function renderDataInTheTable(dataHeadingTable, dataContentTable, idTable) {
   const globalTable = document.getElementById(idTable);

   // TABLEAU

   const table = document.createElement("table");
   table.className = 'todo-table';
   globalTable.appendChild(table);

   // TITRE DU TABLEAU

   const headTable = document.createElement("thead");
   headTable.className = 'todo-table--head';
   table.appendChild(headTable);

   dataHeadingTable.forEach(todoHead => {
      let headTr = document.createElement("tr");

      Object.values(todoHead).forEach((value) => {
         let cell = document.createElement("th");
         cell.className = 'todo-table--head--title title__' + value;
         cell.innerText = value;
         headTr.appendChild(cell);
      })

      headTable.appendChild(headTr);
   });

   // CONTENU DU TABLEAU

   const bodyTable = document.createElement("tbody");
   bodyTable.className = 'todo-table--body';
   table.appendChild(bodyTable);

   dataContentTable.forEach(todoBody => {
      let newRow = document.createElement("tr");

      Object.values(todoBody).forEach((value) => {
         let cell = document.createElement("td");
         cell.className = 'todo-table--body--content';
         cell.innerText = value;
         newRow.appendChild(cell);
      })

      bodyTable.appendChild(newRow);
   });
}
