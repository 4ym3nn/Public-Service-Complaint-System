from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ("citizen", "Citizen"),
        ("staff", "Staff"),
        ("admin", "Admin"),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="citizen")

    def is_citizen(self):
        return self.role == "citizen"

    def is_staff_member(self):
        return self.role == "staff"

    def is_admin(self):
        return self.role == "admin"
