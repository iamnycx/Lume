from django.contrib.auth import get_user_model
from rest_framework import serializers
from apps.posts.models import Post, PostResponse, Responses

User = get_user_model()

class PostResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostResponse
        fields = ["id", "post", "response"]

    def create(self, validated_data):
        user = self.context["request"].user
        validated_data["user"] = user
        return super().create(validated_data)

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'avatar']

class PostSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)
    like_count = serializers.SerializerMethodField()
    dislike_count = serializers.SerializerMethodField()
    my_response = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            "id",
            "caption",
            "image",
            "author",
            "created_at",
            "like_count",
            "dislike_count",
            "my_response",
        ]
        read_only_fields = [
            "author",
            "created_at",
            "like_count",
            "dislike_count",
            "my_response",
        ]

    def get_my_response(self, obj):
        request = self.context.get("request")
        if not request or request.user.is_anonymous:
            return None
        pr = obj.responses.filter(user=request.user).first()
        return pr.response if pr else None

    def get_like_count(self, obj):
        return obj.responses.filter(response=Responses.LIKE).count()

    def get_dislike_count(self, obj):
        return obj.responses.filter(response=Responses.DISLIKE).count()
