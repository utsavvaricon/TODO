import typing
from pydantic import BaseModel, constr


class Todo(BaseModel):

    title: constr(strip_whitespace=True, max_length=255)
    description: typing.Optional[constr(strip_whitespace=True)]

    def __str__(self):
        return self.title

    def update(self, **mapping: typing.Dict):
        """
        method to update employement type
        """
        return self.copy(update=mapping)


def todo_factory(
    title: constr(strip_whitespace=True, max_length=255),
    description: typing.Optional[constr(strip_whitespace=True)],
):
    return Todo(
        title=title,
        description=description,
    )
