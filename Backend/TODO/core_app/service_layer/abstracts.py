import typing
from pydantic import BaseModel, validator, constr

from core_app.service_layer.exception import TitleCannotBeEmpty


class AddTask(BaseModel):
    title: constr(strip_whitespace=True, min_length=1, max_length=255)
    description: typing.Optional[constr(strip_whitespace=True, max_length=1023)]

    @validator("title", pre=True, always=True, allow_reuse=True)
    def title_must_not_be_empty_or_whitespace_or_null(cls, v):
        if not v or v.strip() == "" or v == "":
            raise TitleCannotBeEmpty(
                "Title cannot be empty or whitespace or null!"
            )
        return v


class UpdateTask(AddTask):
    pass
