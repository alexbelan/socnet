from django.db import models
from users.models import User


class Groups(models.Model):
    id = models.AutoField(primary_key=True, unique=True)
    name = models.CharField(max_length=50)
    image = models.ImageField()
    subscribers = models.ManyToManyField(User, related_name='subscribers')
    admins = models.ManyToManyField(User, related_name='admins')