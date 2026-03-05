import { renderTable } from './table.js';

// Entêtes du tableau donnant l'ordre d'affichage
const tableHeaders = ['id', 'title', 'completed'];

// Mapping clé JSON → nom affiché dans l'en-tête
const columnNames = {
  id: 'Priorité',
  title: 'Tâche',
  completed: 'Terminé'
};

// Chargement des données stocker dans le fichiers JSON
export async function loadDataTodos() {
   try {
      const response = await fetch('data/todos.data.json');
      const data = await response.json();
      renderTable(tableHeaders, data, 'html-todo-table', columnNames, {
         sortable: true,
         pagination: true,
         rowsPerPage: 10,
         titleTable: 'targetId',
         titleTableValue: 'title-table'
      });
   } catch (error) {
      console.error('Erreur lors du chargement des données :', error);
   }
}

// Lancer le chargement
loadDataTodos();
