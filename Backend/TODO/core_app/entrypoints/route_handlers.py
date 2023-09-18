from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.forms.models import model_to_dict

from core_app.adapters.orm import Todo
from core_app.service_layer.serializers import TodoSerializer
from core_app.service_layer import abstracts, handlers, exception
from core_app.domain import commands
from core_app.adapters import repository

from pydantic import ValidationError as PydanticValidationError

class TodoViewset(viewsets.ModelViewSet):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user  # Get the authenticated user
        queryset = self.queryset.filter(created_by=user)  # Filter by the authenticated user
        q = self.request.query_params.get("keyword")
        if q:
            queryset = queryset.filter(title__icontains=q)
        return queryset.order_by("-created_at")

    def create(self, request, *args, **kwargs):
        try:
            validated_data = abstracts.AddTask(**request.data)
            cmd_ = commands.AddTask(**validated_data.__dict__)
            repository_ = repository.TodoSQLRepository()
            response = handlers.add_task(
                cmd=cmd_,
                repository=repository_,
                user=request.user,
            )
            data = model_to_dict(response)
        except exception.TitleCannotBeEmpty as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except PydanticValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(data, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        try:
            validated_data = abstracts.UpdateTask(**request.data)
            cmd_ = commands.UpdateTask(
                **validated_data.__dict__, id=self.kwargs.get("pk")
            )
            repository_ = repository.TodoSQLRepository()
            response = handlers.update_task(
                cmd=cmd_,
                repository=repository_,
                user=request.user,
            )
            data = model_to_dict(response)

    
        except exception.TitleCannotBeEmpty as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        except PydanticValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(data, status=status.HTTP_200_OK)
    

    def destroy(self, request, *args, **kwargs):
        cmd_ = commands.DeleteTask(id=kwargs.get("pk"))
        repository_ = repository.TodoSQLRepository()
        try:
            handlers.delete_task(
                cmd=cmd_,
                repository=repository_,
            )
        except PydanticValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(
            {"success": "Task Successfully deleted"},
            status=status.HTTP_200_OK,
        )