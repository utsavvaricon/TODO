import typing
from django.db import transaction

from core_app.adapters.orm import Todo
from core_app.domain import models as domain_model
from core_app.domain import commands

UserReference = typing.NewType("UserReference", int)

def add_task(
    cmd: commands.AddTask, repository, user: UserReference
) -> Todo:
    domain_model_response = domain_model.todo_factory(**cmd.__dict__)
    with transaction.atomic():
        response = repository.add(model=domain_model_response, user=user)
    return response


def update_task(
    cmd: commands.UpdateTask, repository, user: UserReference
) -> Todo:

    with transaction.atomic():
        task = repository.get(ref=cmd.id)
        domain_model_response = task.update(**cmd.__dict__)
        response = repository.update(model=domain_model_response, user=user)

    return response


def delete_task(cmd: commands.DeleteTask, repository) -> None:
    repository.delete(cmd.id)
