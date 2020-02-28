import datetime

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
import jsonfield


class MyUserManager(BaseUserManager):
    def _create_user(self, email, username, password, **extra_fields):
        if not email:
            raise ValueError("Вы не ввили Email")
        if not username:
            raise ValueError("Вы не ввели Логин")

        user_data = UserData()
        user_data.save()

        user = self.model(
            email=self.normalize_email(email),
            username=username,
            user_data=user_data,
            **extra_fields,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, username, password):
        return self._create_user(email, username, password)

    def create_superuser(self, email, username, password):
        return self._create_user(email, username, password, is_staff=True, is_superuser=True)


class UserData(models.Model):
    STATUS = (
        ('0', ''),
        ('1', 'Не женат'),
        ('2', 'Встречаюсь'),
        ('3', 'Женат'),
        ('4', 'Влюблён'),
        ('5', 'Всё сложно'),
        ('6', 'В активном поиске'),
    )
    GENDER = (
        ('0', ''),
        ('1', 'Мужчина'),
        ('2', 'Женьшина'),
    )
    id = models.AutoField(primary_key=True, unique=True)
    avatar = models.ImageField(upload_to='avatar/<int:pk>')
    first_name = models.CharField(max_length=50, unique=False, default='')
    last_name = models.CharField(max_length=50, unique=False, default='')
    gender = models.CharField(max_length=1, choices=GENDER, default='')
    about_myself = models.CharField(max_length=255, default='')
    status = models.CharField(max_length=1, choices=STATUS, default='')
    year_of_birth = models.DateField(default=datetime.date(2000, 4, 15))
    friends = jsonfield.JSONField()


class User(AbstractBaseUser, PermissionsMixin):
    id = models.AutoField(primary_key=True, unique=True)
    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(max_length=100, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    user_data = models.OneToOneField(UserData, on_delete=models.CASCADE)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = MyUserManager()

    def __str__(self):
        return self.email

    # def has_perm(self, perm, obj=None):
    #     return self.is_admin

    # def has_module_perms(self, app_label):
    #     return True

