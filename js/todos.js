// Récupérer les données stocker dans le fichiers JSON
fetch('data/todos.data.json')
   .then(function (response) {
      return response.json();
   }).then(function (apiJsonData) {
      // console.log(apiJsonData);
      renderDataInTheTable(apiJsonData, "html-todo-table");
   })

/**
 * Permet d'ajouter dans le tableau ciblé les données sur de nouvelle lignes
 */
function renderDataInTheTable(contentTable, idTable) {
   const mytable = document.getElementById(idTable);
   contentTable.forEach(todo => {
      let newRow = document.createElement("tr");
      Object.values(todo).forEach((value) => {
         let cell = document.createElement("td");
         cell.innerText = value;
         newRow.appendChild(cell);
      })
      mytable.appendChild(newRow);
   });
}
