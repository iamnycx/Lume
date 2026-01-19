from django.db import models
from django.db.models import Count, Q
from django.conf import settings
from apps.posts.validators import validate_file_size

class Responses(models.TextChoices):
    LIKE = "like", "Like"
    DISLIKE = "dislike", "Dislike"

class Post(models.Model):
    caption = models.CharField(max_length=255)
    image = models.ImageField(upload_to='post/images', validators=[validate_file_size])
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='posts')

    
class PostResponse(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='post_responses')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='responses')
    response = models.CharField(max_length=10, choices=Responses.choices, default=Responses.LIKE)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "post"],
                name="unique_user_post_response"
            )
        ]
        
