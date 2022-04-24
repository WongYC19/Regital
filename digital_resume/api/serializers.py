# from main.models import CustomUser as User
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from rest_framework import status
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core.mail import send_mail, BadHeaderError
from django.contrib.auth.models import BaseUserManager

User = get_user_model()

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
 
    username_field = User.EMAIL_FIELD
    
    class Meta:
        model = User
        required = ("email", "password")
        fields = ( "email", "password")
        
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        try:
            profile_picture = user.profile_picture.url
        except:
            profile_picture = ""
        
        token['profile_picture'] = profile_picture
        token['full_name'] = user.first_name + " " + user.last_name
        return token
    
    def validate(self, attrs):
        email = attrs.get("email", attrs.get("username"))
        attrs['email'] = email
        attrs["username"] = email
        data = super().validate(attrs)
        
        refresh = self.get_token(self.user)
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)
        return data

class RegistrationSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(validators=[UniqueValidator(queryset=User.objects.all())])

    password = serializers.CharField(validators=[validate_password])
    confirm_password = serializers.CharField(validators=[validate_password])

    class Meta:
        model = User
        fields = ("email", "password", "confirm_password", "first_name", "last_name")
        write_only_fields = ('password', 'confirm_password')
        required = ("email", "password", "confirm_password", "first_name", "last_name")
        extra_kwargs = {"first_name": {"required": True}, "last_name": {"required": True}}

    def validate(self, attrs):
        is_matched = attrs["password"] == attrs["confirm_password"]
        if not is_matched: 
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs            

    def create(self, validated_data):
        user_data = dict(
            email = validated_data["email"],
            first_name = validated_data["first_name"],
            last_name = validated_data["last_name"],
            password = validated_data["password"],
        )        
        user = User.objects.create_user(**user_data)     
        user.save()
        return user
       
class RetrieveUpdateDestroyUserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ("first_name", "last_name", "gender", "location", "phone_number", "profile_picture")
        required = ("first_name", "last_name")
        
    def update(self, instance, validated_data):
        for field, value in validated_data.items():
            if not hasattr(instance, field):
                print(f"Attribute {field} not found in user object.")
                continue
            setattr(instance, field, value)
            
        instance.save()
        
        return instance
    
class ChangePasswordSerializer(serializers.ModelSerializer):
    old_password = serializers.CharField()
    new_password = serializers.CharField(validators=[validate_password])
    confirm_password = serializers.CharField()
    
    class Meta:
        model = User
        fields = ("old_password", "new_password", "confirm_password")
        write_only = ("old_password", "new_password", "confirm_password")
        required = ("old_password", "new_password", "confirm_password")
        
    def validate(self, attrs):
        user = self.context['request'].user
        old_password = attrs['old_password']
        new_password = attrs['new_password']
        confirm_password = attrs['confirm_password']
        
        if not user.check_password(old_password):
            response = {"old_password": ["Wrong password."]}
            raise serializers.ValidationError(response, code=status.HTTP_400_BAD_REQUEST)
        
        if new_password != confirm_password:
            response = {"confirm_password": ["The confirm password is not similar to new password."]}
            raise serializers.ValidationError(response, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            validate_password(new_password, user)
        except Exception as error:
            response = {"new_password": error.messages}
            raise serializers.ValidationError(response, code=status.HTTP_400_BAD_REQUEST)
        
        return attrs
                    
    def update(self, instance, validated_data):
        instance.set_password(validated_data['new_password'])
        instance.save()
        return instance
           
class ResetPasswordSerializer(serializers.ModelSerializer, BaseUserManager):
    email = serializers.EmailField()
    SUBJECT = "Password Reset Requested - The Regital"
    
    class Meta:
        model = User
        fields = ("email", )
    

    def get_email_text(self, email_config):
        url =  email_config['domain']
        return f"""
        Hello,
        <br><br>
            We received a request to reset the password for your account for this email address. To initiate the password reset process for your account, click
            <a href="{url}/password_reset_confirm/{email_config['uid']}/{email_config['token']}/">here</a> to reset password.
        <br>
            This link can only be used once. If you need to reset your password again, please visit <a href="{url}/">Regital Home Page</a> and request another reset.
        <br>
            If you did not make this request, you can simply ignore this email.
        <br><br>
            Sincerely,
        <br>
            The Regital Team

        """

    def get_email_config(self, request, user): 
        return {
            "email": user.email,
            'domain': request.headers['Origin'],
            'site_name': 'Regital',
            "uid": urlsafe_base64_encode(force_bytes(user.pk)),
            'token': default_token_generator.make_token(user),
            'protocol': 'http',
        }
        

    def validate_email(self, email):
        email = self.normalize_email(email)
        user = User.objects.filter(email=email).first()
        request = self.context['request']
        
        if not user:
            raise serializers.ValidationError("User email is invalid.", code=status.HTTP_400_BAD_REQUEST)
            return email 
        
        email_config = self.get_email_config(request, user)
        message = self.get_email_text(email_config)
        to_email = (user.email, )
        
        try:
            send_mail(self.SUBJECT, message=message, html_message=message, from_email=None, recipient_list=to_email, fail_silently=False)
        except BadHeaderError:
            return serializers.ValidationError("Invalid header found", code=status.HTTP_400_BAD_REQUEST)
        except Exception as exception:
            error_message = getattr(exception, "smtp_error", str(exception))
            return serializers.ValidationError(error_message, code=status.HTTP_503_SERVICE_UNAVAILABLE)
        finally:
            return email
    
class ResetPasswordConfirmSerializer(serializers.ModelSerializer):
    new_password = serializers.CharField(validators=[validate_password])
    confirm_password = serializers.CharField(validators=[validate_password])
    uid = serializers.CharField()
    token = serializers.CharField()
    
    class Meta:
        model = User
        fields = ("new_password", "confirm_password", "token", "uid")
        
    def validate(self, attrs):
        print("Attrs:", attrs)
        if attrs['confirm_password'] != attrs['new_password']:
            raise serializers.ValidationError("The confirm password is not similar to new password.", code=status.HTTP_400_BAD_REQUEST)
        
        # 1.  Decode uid and verify the information
        try:
            user_id = force_str(urlsafe_base64_decode(attrs['uid'])) 
        except Exception as exception:
            raise serializers.ValidationError("Invalid URL. Please make a new reset password request.", code=status.HTTP_400_BAD_REQUEST)
            return attrs
            
        user = User.objects.get(pk=user_id)
        if user is None:
            raise serializers.ValidationError("Invalid credentials.", code=status.HTTP_403_FORBIDDEN)
        
        if user.check_password(attrs['new_password']):
            raise serializers.ValidationError("The new password must be different from previous used passwords.", code=status.HTTP_400_BAD_REQUEST)
        
        # 2. Check token expiry
        is_valid_token = default_token_generator.check_token(user, attrs['token'])
        
        if not is_valid_token:
            raise serializers.ValidationError("The token is expired. Please make another request.", code=status.HTTP_403_FORBIDDEN)
        
        attrs['instance'] = user
        return attrs
    
    def update(self, instance, validated_data):
        new_password = validated_data['new_password']
        instance.set_password(new_password)
        instance.save()

        