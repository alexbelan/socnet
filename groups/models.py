from django.db import models
from users.models import User


class Groups(models.Model):
    id = models.AutoField(primary_key=True, unique=True)
    name = models.CharField(max_length=50)
    image = models.ImageField()
    subscribers = models.ManyToManyField(User, related_name='subscribers')
    admins = models.ManyToManyField(User, related_name='admins')


class Posts(models.Model):
    id = models.AutoField(primary_key=True, unique=True)
    text = models.TextField(blank=True, null=True)
    image = models.ImageField(blank=True, null=True, upload_to='img/photo_post/')
    group = models.ForeignKey(Groups, on_delete=models.DO_NOTHING)
    author = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    reposts = models.ManyToManyField(User, related_name='reposts')
    likes = models.ManyToManyField(User, related_name='likes')
    # time = models.DateTimeField()