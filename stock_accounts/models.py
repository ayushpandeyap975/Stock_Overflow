from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

# Custom User Manager
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)
    
INVESTMENT_EXPERIENCE_CHOICES = [
('beginner', 'Beginner'),
('intermediate', 'Intermediate'),
('advanced', 'Advanced'),
]

RISK_TOLERANCE_CHOICES = [
('low', 'Low'),
('medium', 'Medium'),
('high', 'High'),
]



# Custom User Model
class CustomUser(AbstractUser):

    username = None  # Remove username field
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True)
    investment_experience = models.CharField(
        max_length=20,
        choices=INVESTMENT_EXPERIENCE_CHOICES,
        default='beginner'
    )
    risk_tolerance = models.CharField(
        max_length=10,
        choices=RISK_TOLERANCE_CHOICES,
        default='medium'
    )
    date_of_birth = models.DateField(null=True, blank=True)
    investment_goals = models.TextField(blank=True)
    
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email
