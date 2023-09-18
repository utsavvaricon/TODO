import typing
from dataclasses import dataclass
from pydantic import constr


class Command:
    pass


@dataclass
class AddTask(Command):
    title: constr(strip_whitespace=True, min_length=1, max_length=255)
    description: typing.Optional[constr(strip_whitespace=True, max_length=1023)]


@dataclass
class UpdateTask(AddTask):
    id: int

@dataclass
class DeleteTask(Command):
    id: int
