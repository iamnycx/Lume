from rest_framework.pagination import PageNumberPagination
from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.posts.models import Post, PostResponse, Responses
from apps.posts.serializers import PostSerializer
from django.db.models import Count, Q

class PostViewSet(ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    pagination_class = PageNumberPagination
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
          return (
            Post.objects
            .annotate(
                like_count=Count(
                    "responses",
                    filter=Q(responses__response=Responses.LIKE)
                ),
                dislike_count=Count(
                    "responses",
                    filter=Q(responses__response=Responses.DISLIKE)
                ),
            )
            .order_by("-created_at")
        )

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
        
    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def react(self, request, pk=None):
        post = self.get_object()
        response_value = request.data.get("response")
        
        if response_value not in (Responses.LIKE, Responses.DISLIKE):
            return Response(
                {"detail": "response must be 'like' or 'dislike'"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        PostResponse.objects.update_or_create(
            post=post,
            user=request.user,
            defaults={"response": response_value},
        )

        
        like_count = post.responses.filter(response=Responses.LIKE).count()
        dislike_count = post.responses.filter(response=Responses.DISLIKE).count()

        return Response({
            "detail": "reaction updated",
            "like_count": like_count,
            "dislike_count": dislike_count,
        })

class SelfPostViewSet(ModelViewSet):
    serializer_class = PostSerializer

    def get_queryset(self):
        return Post.objects.filter(author=self.request.user.id).order_by('-created_at')

