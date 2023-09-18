from core_app.adapters.orm import Todo
from core_app.domain import models as domain_model
from core_app.service_layer.handlers import UserReference
from users.models import CustomUser


class TodoSQLRepository:
    def __init__(self):
        pass

    def get(self, ref):
        todo = Todo.objects.get(id=ref)
        return domain_model.Todo.construct(
            id=todo.id,
            title=todo.title,
            description=todo.description,
        )

    def add(self, model: domain_model.Todo, user: UserReference):
        todo = Todo.objects.create(
            title=model.title, description=model.description, created_by=CustomUser(user.id)
        )
        return todo
    
    def update(self, model: domain_model.Todo, user):
        task = Todo.objects.get(id=model.id)
        task.title = model.title
        task.description = model.description
        task.updated_by = CustomUser(user.id)
        task.save()
        return task
    
    def delete(self, id):
        Todo.objects.filter(id=id).delete()