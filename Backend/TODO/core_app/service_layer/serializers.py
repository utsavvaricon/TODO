from rest_framework import serializers
from core_app.adapters.orm import Todo


class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model =  Todo
        fields = ['id', 'title', 'description', 'created_at', 'updated_at', 'created_by', 'updated_by']

  

    