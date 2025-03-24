from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

# Customize UserAdmin
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ("email", "phone", "first_name", "last_name", "is_staff", "is_active")
    list_filter = ("investment_experience", "risk_tolerance", "is_staff", "is_active")
    ordering = ("email",)
    
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal Info", {"fields": ("first_name", "last_name", "phone", "address", "date_of_birth", "phone_number")}),
        ("Investment Info", {"fields": ("investment_experience", "risk_tolerance", "investment_goals")}),
        ("Permissions", {"fields": ("is_staff", "is_active", "is_superuser")}),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )
    
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "first_name", "last_name", "phone", "phone_number", "date_of_birth", "investment_experience", "risk_tolerance", "investment_goals", "password1", "password2", "is_staff", "is_active"),
        }),
    )

admin.site.register(CustomUser, CustomUserAdmin)
