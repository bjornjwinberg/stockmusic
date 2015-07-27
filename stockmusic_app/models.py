from django.contrib.auth.hashers import make_password, check_password
from django.db import models


class User(models.Model):
    username = models.CharField(max_length=100, unique=True, blank=False)
    password = models.CharField(max_length=100, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def hash_password(self):
        self.password = make_password(self.password)

    def validate_password(inputted_username, inputted_password):
        retreived_password = User.objects.get(username=inputted_username).password
        return check_password(inputted_password, retreived_password)
