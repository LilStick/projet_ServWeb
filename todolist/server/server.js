document.addEventListener('DOMContentLoaded', function () {
    const taskList = document.getElementById('task-list');
    const loadMoreButton = document.getElementById('load-more');

  
    let page = 1;
 

    function loadTasks() {
        fetch(`/tasks?page=${page}`)
            .then(response => response.json())
            .then(tasks => {
                tasks.forEach(addTaskToList);
                page++;
                // Afficher ou masquer le bouton "Charger plus" en fonction des tâches restantes
                loadMoreButton.style.display = tasks.length < 10 ? 'none' : 'block';
            })
            .catch(error => {
                console.error('Erreur lors du chargement des tâches :', error);
            });
    }

    function addTaskToList(task) {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>${task.description}</span>
            <button class="delete" data-id="${task._id}">Supprimer</button>
            <button class="complete" data-id="${task._id}">Terminé</button>
        `;
        if (task.completed) {
            listItem.classList.add('completed');
        }

        taskList.appendChild(listItem);

        const deleteButton = listItem.querySelector('.delete');
        deleteButton.addEventListener('click', function () {
            deleteTask(task._id);
        });

        const completeButton = listItem.querySelector('.complete');
        completeButton.addEventListener('click', function () {
            completeTask(task._id);
        });
    }

    function deleteTask(id) {
        fetch(`/tasks/${id}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    document.querySelector(`[data-id="${id}"]`).parentElement.remove();
                }
            })
            .catch(error => {
                console.error('Erreur lors de la suppression de la tâche :', error);
            });
    }

    function completeTask(id) {
        fetch(`/tasks/${id}`, {
            method: 'PUT',
        })
            .then(response => {
                if (response.ok) {
                    const listItem = document.querySelector(`[data-id="${id}"]`).parentElement;
                    listItem.classList.add('completed');
                }
            })
            .catch(error => {
                console.error('Erreur lors du marquage de la tâche comme terminée :', error);
            });
    }

    // Écouteur d'événements pour le bouton "Charger plus"
    loadMoreButton.addEventListener('click', loadTasks);

    // Chargement initial des tâches
    loadTasks();
});

