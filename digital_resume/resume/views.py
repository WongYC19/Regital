from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.authentication import JWTAuthentication 
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework.response import Response

from resume.models import Resume, Template, ResumePermission, PublicResume
from resume.serializers import (
    ResumeSerializer, 
    TemplateListSerializer, 
    ResumePermissionSerializer, 
    PublicResumeSerializer, 
    UserSerializer,
    SharedResumeSerializer
)
from resume.permissions import ResumePermissionControl
from django.db.models import Q

# Create your views here.

class ResumeView(ModelViewSet):
    serializer_class = ResumeSerializer
    permission_classes = (IsAuthenticated, ResumePermissionControl,)
    authentication_classes = (JWTAuthentication,)
    
    def list(self, request):        
        resume_list = Resume.objects.filter(created_by=request.user)                         
        serializer = ResumeSerializer(resume_list, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user
        template_id = request.data['template']
        template = Template.objects.filter(pk=template_id).first()
        serializer.save(created_by=user, template=template)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
    def retrieve(self, request, pk=None):
        try:
            instance = Resume.objects.get(resume_id=pk)
        except Exception as error:
            return Response(f"Invalid request: {error}", status=status.HTTP_400_BAD_REQUEST)

        self.check_object_permissions(request, instance)
        serializer = self.get_serializer(instance=instance)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def update(self, request, pk=None):
        try: 
            instance = Resume.objects.get(resume_id=pk)            
        except Exception as error:
            return Response(f"Invalid request: {error}", status=status.HTTP_400_BAD_REQUEST)
                    
        self.check_object_permissions(request, instance)
        serializer = self.get_serializer(instance=instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def destroy(self, request, pk=None):
        try:
            instance = Resume.objects.get(resume_id=pk)
        except Exception as error:
            return Response(f"Invalid request: {error}", status=status.HTTP_400_BAD_REQUEST)
        
        self.check_object_permissions(request, instance)
        instance.delete()
        return Response("Resume has been deleted.", status=status.HTTP_200_OK)
    
class TemplateListView(ModelViewSet):
    serializer_class = TemplateListSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JWTAuthentication,)
    queryset = Template.objects.all()

class SharedResumeView(ModelViewSet):
    serializer_class = SharedResumeSerializer
    permission_classess = (IsAuthenticated, ResumePermissionControl)
    authentication_classes = (JWTAuthentication, )
    
    def list(self, request):
        allowed_resume = ResumePermission.objects.filter(user=request.user)
        serializer = self.serializer_class(allowed_resume, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class PermissionView(ModelViewSet):
    serializer_class = ResumePermissionSerializer
    permission_classes = (IsAuthenticated, ResumePermissionControl)
    authentication_classes = (JWTAuthentication,)
    
    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.create(serializer.validated_data)
        message = {"message": "User permission granted successfully"}
        response = {** serializer.data, **message}
        return Response(response, status=status.HTTP_201_CREATED)
        
    def destroy(self, request, pk=None):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        resume = data['resume']
        allowed_user = data['user']
        
        instance = ResumePermission.objects.filter(
            resume=resume,
            user=allowed_user).first()
        
        if instance is None:
            return Response("Resume or user not found.", status=status.HTTP_400_BAD_REQUEST)
        
        instance.delete()
        message = {"message": "The permission has been revoked successfully"}
        response = {**serializer.data, **message}
        return Response(response, status=status.HTTP_200_OK)

# class SharedResumeView(ModelViewSet):
#      serializer_class = ResumePermissionSerializer
#      permission_classes = (IsAuthenticated, ResumePermissionControl)
#      authentication_classes = (JWTAuthentication,)
     
    #  def get_queryset(self):
    #     allowed_resume = ResumePermission.objects.filter(user=self.request.user)
    #     resume_ids = allowed_resume.values_list('resume_id', flat=True)
    #     allowed_resume_list = Resume.objects.filter(pk__in=resume_ids) 
    #     return allowed_resume_list
         
    #  def list(self, request):
    #     allowed_resume = ResumePermission.objects.filter(user=request.user)
    #     serializer = self.serializer_class(allowed_resume, many=True)
    #     return Response(serializer.data, status=status.HTTP_200_OK)

class PublicResumeView(ModelViewSet):
    
    serializer_class = PublicResumeSerializer
    permission_classes = (AllowAny,)
    queryset = PublicResume.objects.all()
    
    def retrieve(self, request, pk=None):
        print("Public ID:", pk)
        try:
            instance = PublicResume.objects.get(public_id=pk)
        except PublicResume.DoesNotExist as error:
            return Response("Page not found.", status=status.HTTP_404_NOT_FOUND)
        except Exception as error:
            return Response("Invalid URL", status=status.HTTP_400_BAD_REQUEST)
        
        response = {"content": instance.resume_id.content, "template_id": instance.resume_id.template_id}
        return Response(response, status=status.HTTP_200_OK)

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.create(serializer.validated_data)
        return Response({"view_id": instance.public_id}, status=status.HTTP_200_OK)

class UserView(ModelViewSet):
    
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JWTAuthentication,)
    
    def get_queryset(self):
        user = self.request.user
        User = UserSerializer.Meta.model
        return User.objects.filter(~Q(pk=user.pk))