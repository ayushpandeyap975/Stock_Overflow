from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from .models import CustomUser 
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core.mail import send_mail




User = get_user_model()

RECAPTCHA_SECRET_KEY = "your-secret-key-here"  




def send_welcome_email(email, name):
    try:
        subject = "Welcome to Our Website!"
        from_email = settings.EMAIL_HOST_USER
        recipient_list = [email]
        html_content = render_to_string("reg_email.html", {"user_name": name})
        text_content = strip_tags(html_content)
        email_message = EmailMultiAlternatives(subject, text_content, from_email, recipient_list)
        email_message.attach_alternative(html_content, "text/html")  
        email_message.send()

        return True 
    except Exception as e:
        print(f"Error sending email: {e}") 
        return False  

@csrf_exempt
def registrations(request):
    try:
        if request.method == 'POST':
            name = request.POST.get('name', '').strip()
            email = request.POST.get('email')
            password = request.POST.get('password')
            name_parts = name.split()
            first_name = name_parts[0] if len(name_parts) > 0 else ''
            last_name = " ".join(name_parts[1:]) if len(name_parts) > 1 else ''
            user = User.objects.create(
                first_name=first_name,
                last_name=last_name,
                email=email,
                password=make_password(password),
            )
            send_welcome_email(email, name)
            user = authenticate(request, username=email, password=password)
            if user:
                login(request, user)
                return redirect('dashboard') 
        return render(request, 'sign.html')
    except Exception as e:
        return render(request, 'sign.html')
        
@csrf_exempt    
def login_user(request):
    try:
        if request.method == 'POST':
            email = request.POST.get('email')
            password = request.POST.get('password')
            user = authenticate(request, username=email, password=password)
            if user:
                login(request, user)
                return redirect('dashboard')
            else:
                messages.error(request, 'Invalid email or password')
                return redirect('login')
        return render(request, 'sign.html')

    except Exception as e:
        return render(request, 'sign.html', {'error': str(e)})
    

def dashboard(request):
    try:
        return render(request, 'index.html')
    except Exception as e:
        return render(request, 'index.html')
        
@login_required
def profile(request):
    try:

        data = CustomUser.objects.filter(email=request.user.email)
        print(f'dtaaaaa {data}')
        for i in data:
            print(i.first_name)
        return render(request, 'profile.html', {"data": request.user})
    except Exception as e:
        return render(request, 'profile.html')
    
def logout_user(request):
    try:
        logout(request)
        messages.success(request, 'Logout Successfully')
        return redirect('login')
    except Exception as e:
        return redirect('dashboard')


@csrf_exempt
def check_email(request):
    try:
        email = request.POST.get('email')
        user = User.objects.filter(email=email).exists()
        return JsonResponse({'exists': user})
    except Exception as e:
        return JsonResponse({'exists': False})


def change_password(request):
    try:
        if request.method == 'POST':
            print(request.POST)
            old_password = request.POST.get('old_password')
            new_password = request.POST.get('new_password')
            confirm_password = request.POST.get('confirm_password')
            user = User.objects.get(email=request.user.email)
            if user.check_password(old_password):
                user.set_password(new_password)
                user.save()
                messages.success(request, 'Password changed successfully')
                return redirect('profile')
            else:
                messages.error(request, 'Old password is incorrect')
                return redirect('profile')
        return render(request, 'profile.html')
    except Exception as e:
        return render(request, 'profile.html')


def update_profile(request):
    try:
        if request.method == 'POST':
            user = User.objects.get(email=request.user.email)
            if 'phone' in request.POST and request.POST['phone']:
                user.phone_number = request.POST['phone']
            if 'date_of_birth' in request.POST and request.POST['date_of_birth']:
                user.date_of_birth = request.POST['date_of_birth']
            if 'investment_experience' in request.POST and request.POST['investment_experience']:
                user.investment_experience = request.POST['investment_experience']
            if 'risk_tolerance' in request.POST and request.POST['risk_tolerance']:
                user.risk_tolerance = request.POST['risk_tolerance']
            if 'investment_goals' in request.POST and request.POST['investment_goals']:
                user.investment_goals = request.POST['investment_goals']
            user.save()
            messages.success(request, 'Profile updated successfully')
            return redirect('profile')
        return render(request, 'profile.html')
    except Exception as e:
        messages.error(request, f'Error updating profile: {str(e)}')
        return render(request, 'profile.html')


def forgot_password(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        try:
            user = User.objects.get(email=email) 
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            reset_url = f"http://127.0.0.1:8000/accounts/reset-password/{uid}/{token}"
            
            send_mail(
                'Password Reset Request',
                f'Click the link below to reset your password:\n{reset_url}',
                settings.EMAIL_HOST_USER,
                [email],
                fail_silently=False
            )
            
            messages.success(request, 'Password reset email sent')
            return redirect('login')
        except User.DoesNotExist:
            messages.error(request, 'No account found with this email')

    return render(request, 'forgot_password.html')



def reset_password(request, uidb64, token):
    try:
        uid = urlsafe_base64_decode(uidb64)
        user = User.objects.get(pk=uid)
        if default_token_generator.check_token(user, token):
            if request.method == 'POST':
                password = request.POST.get('password')
                confirm_password = request.POST.get('confirm_password')
                if password == confirm_password:
                    user.set_password(password)
                    user.save()
                    messages.success(request, 'Password reset successfully')
                    return redirect('login')
            return render(request, 'new_password.html')
        return render(request, 'new_password.html')
    except Exception as e:
        return render(request, 'new_password.html')

