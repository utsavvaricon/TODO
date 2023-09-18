from django.db import models
from users.models import CustomUser  # Import your CustomUser model

class Todo(models.Model):
    title = models.CharField(max_length=255, null=False)
    description = models.CharField(max_length=1023, null=True, blank=True)
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True)
    created_by = models.ForeignKey(
        CustomUser,
        blank=True,
        null=True,
        on_delete=models.SET_NULL,
        related_name="user_created_by"
    )
    updated_by = models.ForeignKey(
        CustomUser,
        blank=True,
        null=True,
        on_delete=models.SET_NULL,
        related_name="user_updated_by"
    )
