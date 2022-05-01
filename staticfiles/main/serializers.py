from rest_framework  import serializers
from .models import Profile
class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = "__all__"
        read_only_field = ["created_date", "last_modified_date"]

