from django.contrib.auth import get_user_model
from djoser.serializers import UserSerializer as BaseUserSerializer , UserCreateSerializer as BaseUserCreateSerializer

from apps.posts.serializers import PostSerializer

User = get_user_model()

class UserCreateSerializer(BaseUserCreateSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        model = User
        fields = ['id', 'name', 'email', 'password', 'birth_date', 'avatar', 'gender']
        extra_kwargs = {
            'password': {'write_only': True},
        }   

class UserSerializer(BaseUserSerializer):
    posts = PostSerializer(many=True, read_only=True)

    class Meta(BaseUserSerializer.Meta):
        model = User
        fields = [ 'id', 'name', 'email', 'birth_date', 'date_joined', 'posts', 'avatar', 'gender' ]
        read_only_fields = ['date_joined', 'email']
