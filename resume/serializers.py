from wsgiref import validate
from rest_framework import serializers
from resume.models import Resume, Template, ResumePermission, PublicResume
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ("id","first_name", "last_name", "profile_picture")
        

class ResumeSerializer(serializers.ModelSerializer):
    title = serializers.CharField(source='template.title', read_only=True)
    view_id = serializers.CharField(source="publicresume.public_id", read_only=True)
    permissions = serializers.SerializerMethodField()
    
    class Meta:
        model = Resume
        exclude = ["template"]
        
    def get_permissions(self, obj):
        serializer = ResumePermissionSerializer(obj.resume.all(), many=True)
        data = serializer.data
        return data

class TemplateListSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Template
        fields = "__all__"

class SimpleResumeSerializer(serializers.ModelSerializer):
    """ For shared resume """    
    class Meta:
        model = Resume
        exclude = ("content", )

class SharedResumeSerializer(serializers.ModelSerializer):
    resume = serializers.SerializerMethodField(read_only=True)
    user = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = ResumePermission
        fields = "__all__"

    def get_resume(self, obj):
        serializer = SimpleResumeSerializer(obj.resume)
        data = serializer.data
        return data

    def get_user(self, obj):
        print("Username obj:", obj)
        return obj.user.first_name + " " + obj.user.last_name

class ResumePermissionSerializer(serializers.ModelSerializer):
    allowed_user = serializers.SerializerMethodField(read_only=False)
    resume = serializers.CharField()
    
    class Meta:
        model = ResumePermission
        fields = "__all__"
                    
    def get_allowed_user(self, obj):        
        try:
            instance = obj['user'] # When serialized object is orderedict
        except:
            instance = obj.user # When the object is permission model
            
        serializer = UserSerializer(instance)
        data = serializer.data
        return data
      
    def validate(self, data):
        resume_id = data['resume']
        try:
            resume = Resume.objects.get(resume_id=resume_id)
        except Exception as error:
            raise serializers.ValidationError(error, code=400)
        else:
            data['resume'] = resume   
        
        data['resume_id'] = resume_id                         
        return data
        
    def create(self, validated_data):
        user = validated_data['user']
        resume = validated_data['resume']
        right = validated_data['right']        
        instance = ResumePermission.objects.filter(user=user, resume=resume).first()
    
        if instance is None:
            instance = ResumePermission.objects.create(resume=resume, user=user, right=right)
        else:    
            instance.right = right
        instance.save()
        return instance
    
class PublicResumeSerializer(serializers.ModelSerializer):
    
    resume_id = serializers.UUIDField()

    class Meta:
        model = PublicResume
        fields = "__all__"

    def create(self, validated_data):
        resume_id = validated_data['resume_id']
        resume = Resume.objects.filter(resume_id=resume_id).first()
        public_id = uuid.uuid4()
        try:
            instance = PublicResume.objects.get(resume_id=resume)
            instance.public_id = public_id
        except PublicResume.DoesNotExist:
            instance = PublicResume(resume_id=resume, public_id=public_id)
            
        instance.save()
        return instance
        