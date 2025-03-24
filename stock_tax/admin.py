from django.contrib import admin
from .models import TaxLot, TaxCalculation, TaxReport

@admin.register(TaxLot)
class TaxLotAdmin(admin.ModelAdmin):
    list_display = ('user', 'stock', 'purchase_date', 'quantity', 'purchase_price', 'remaining_quantity', 'is_closed')
    search_fields = ('user__username', 'stock__symbol')
    list_filter = ('purchase_date', 'is_closed')

@admin.register(TaxCalculation)
class TaxCalculationAdmin(admin.ModelAdmin):
    list_display = ('user', 'tax_year', 'transaction', 'holding_period', 'capital_gain', 'estimated_tax')
    search_fields = ('user__username', 'transaction__stock__symbol')
    list_filter = ('tax_year', 'holding_period', 'calculation_date')

@admin.register(TaxReport)
class TaxReportAdmin(admin.ModelAdmin):
    list_display = ('user', 'tax_year', 'total_short_term_gains', 'total_long_term_gains', 'total_estimated_tax')
    search_fields = ('user__username',)
    list_filter = ('tax_year', 'generated_date')
