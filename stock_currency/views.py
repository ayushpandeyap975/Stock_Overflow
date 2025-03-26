from django.shortcuts import render
from django.shortcuts import render, redirect

# Create your views here.


def currency(request):
    try:
        return render(request,'Currency.html' )
    except Exception as e:
        print(e)
        return redirect('dashboard')
