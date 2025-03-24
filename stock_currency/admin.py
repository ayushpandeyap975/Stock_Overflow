from django.contrib import admin
from .models import Currency, ExchangeRate, CurrencyConversion, CurrencyAlert

@admin.register(Currency)
class CurrencyAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'symbol', 'is_active')
    search_fields = ('code', 'name')
    list_filter = ('is_active',)

@admin.register(ExchangeRate)
class ExchangeRateAdmin(admin.ModelAdmin):
    list_display = ('from_currency', 'to_currency', 'rate', 'last_updated')
    search_fields = ('from_currency__code', 'to_currency__code')
    list_filter = ('last_updated',)

@admin.register(CurrencyConversion)
class CurrencyConversionAdmin(admin.ModelAdmin):
    list_display = ('user', 'from_currency', 'to_currency', 'amount', 'converted_amount', 'timestamp')
    search_fields = ('user__username', 'from_currency__code', 'to_currency__code')
    list_filter = ('timestamp',)

@admin.register(CurrencyAlert)
class CurrencyAlertAdmin(admin.ModelAdmin):
    list_display = ('user', 'from_currency', 'to_currency', 'target_rate', 'is_above', 'is_active')
    search_fields = ('user__username', 'from_currency__code', 'to_currency__code')
    list_filter = ('is_above', 'is_active', 'created_at')
