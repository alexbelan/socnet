from django.contrib import admin
from .models import User, UserData, Friends

admin.site.register(User)
admin.site.register(UserData)
admin.site.register(Friends)
# Register your models here.
