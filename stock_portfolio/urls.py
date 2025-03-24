"""
URL configuration for stockoverflow project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from stock_portfolio import views
urlpatterns = [
    path('portfolio_dashboard/', views.portfolio_list, name='portfolio_dashboard'),
    path('<int:portfolio_id>/', views.portfolio_detail, name='portfolio_detail'),
    path('create/', views.create_portfolio, name='create_portfolio'),
    path('transaction/add/', views.add_transaction, name='add_transaction'),
    path('<int:portfolio_id>/performance/', views.portfolio_performance, name='portfolio_performance'),


]
