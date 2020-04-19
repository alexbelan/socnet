from django.utils import timezone

from django.db import models
from users.models import User


class Chat(models.Model):
    id = models.AutoField(primary_key=True, unique=True)
    users = models.ManyToManyField(User)


class Message(models.Model):
    id = models.AutoField(primary_key=True, unique=True)
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    text = models.CharField(max_length=255)
    date = models.DateTimeField(auto_now=True)
    chat = models.ForeignKey(Chat, on_delete=models.DO_NOTHING)
