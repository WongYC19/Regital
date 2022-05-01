
from django.utils.decorators import method_decorator
from django.middleware import csrf
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.generics import CreateAPIView, RetrieveAPIView, RetrieveUpdateAPIView, UpdateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
# from main.models import CustomUser as User, Template
from .serializers import RegistrationSerializer, MyTokenObtainPairSerializer, RetrieveUpdateDestroyUserSerializer, ChangePasswordSerializer, ResetPasswordSerializer, ResetPasswordConfirmSerializer

# Create your views here.

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    permissions_classes = (AllowAny, )
    
    def post(self, request, format=None):
        data = request.data
        serializer = AuthTokenSerializer(data=data)
        if not serializer.is_valid():
            return Response({"server": "Unable to log in with provided credentials."}, status=status.HTTP_401_UNAUTHORIZED)
        return super(MyTokenObtainPairView, self).post(request, format=format)
    
class RegisterView(CreateAPIView):    
    permission_classes = (AllowAny,)
    serializer_class = RegistrationSerializer
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        is_valid = serializer.is_valid()
        
        if not is_valid:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        user = serializer.create(request.data)
        token = MyTokenObtainPairSerializer.get_token(user=user)
        response = {"refresh": str(token), "access": str(token.access_token)}
        return Response(response, status=status.HTTP_201_CREATED)
        

class RetrieveUpdateDestroyProfileView(RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = RetrieveUpdateDestroyUserSerializer
    authentication_classes = (JWTAuthentication,)
    
    def get(self, request):
        user = request.user
        try:
            profile_picture = user.profile_picture.url
        except:
            profile_picture = "/images/profiles/user_avatar.png"
        
        data = dict(
            email=user.email, 
            first_name=user.first_name, 
            last_name=user.last_name, 
            gender=user.gender, 
            location= user.location, 
            profile_picture=profile_picture,
            phone_number= user.phone_number
        )
        
        return Response(data, status=status.HTTP_200_OK)
    
    def patch(self, request):
        """ Update user profile picture """
     
        user = request.user
        serializer = self.get_serializer(user, data=request.data, partial=True)
       
        
        if serializer.is_valid():
            user.profile_picture.delete(save=False)
            serializer.save()            
            return Response({"status": "Success", "profile_picture": user.profile_picture.url}, status=status.HTTP_200_OK)
                    
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def update(self, request, *args, **kwargs):
        jwt_auth = JWTAuthentication()
        response = jwt_auth.authenticate(request)
        
        if response is None:
            return Response("Unauthorized request.", status=status.HTTP_401_UNAUTHORIZED)
        
        serializer = self.get_serializer(data=request.data)
        is_valid = serializer.is_valid()
        
        if not is_valid:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        user, _ = response 
      
        if user is None:
            return Response({"email:", "User is not authenticated."}, status=status.HTTP_401_UNAUTHORIZED)
    
        data = {
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "gender": user.gender,
            "phone_number": user.phone_number,
            "profile_picture": user.profile_picture,
            "location": user.location,
        }
        
        data.update(serializer.data)
        serializer.update(user, data)
        
        refresh = MyTokenObtainPairSerializer.get_token(user)
        token_pair = {"refresh": str(refresh), "access": str(refresh.access_token)}
        data['token'] = token_pair 
        return Response(data, status=status.HTTP_200_OK)
    
    def delete(self, request, *args, **kwargs):
        """ Remove user profile picture """
        user = request.user
        user.profile_picture.delete(save=False)
        return Response({"profile_picture": "images/profile"}, status=status.HTTP_200_OK)
    
class ChangePasswordView(UpdateAPIView):
    permissions_classes = (IsAuthenticated, )
    serializer_class = ChangePasswordSerializer
      
    def update(self, request, *args, **kwargs):
        user = request.user
        
        if user is None:
            return Response({"server": "Invalid credentials."}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = self.get_serializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        serializer.update(user, serializer.data)
        response = dict(server= "Password updated successfully")
        return Response(response, status=status.HTTP_200_OK)
    
class ResetPasswordView(UpdateAPIView):
    # queryset = User.objects.all()
    serializer_class = ResetPasswordSerializer  
    permission_classes = (AllowAny, )
   
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({"server": "The instruction has been sent to your mailbox, please check."}, status=status.HTTP_200_OK)

      
class ResetPasswordConfirmView(UpdateAPIView):
    serializer_class = ResetPasswordConfirmSerializer
    permission_classes = (AllowAny,)
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.validated_data['instance']
        serializer.update(instance, serializer.validated_data)
        return Response({"server": "The password has been updated successfully"}, status=status.HTTP_200_OK)
    
                       
class Routes(RetrieveAPIView):
    queryset = []
    
    permission_classes = (AllowAny,)
    
    @method_decorator(ensure_csrf_cookie)
    def get(self, request):    
        return Response(self.queryset)
    
    
class CSRFTokenView(RetrieveAPIView):
    queryset = []    
    permission_classes = (AllowAny,)
    
    def get(self, request):
        return Response({"csrftoken": csrf.get_token(request)}, status=status.HTTP_200_OK)
    
