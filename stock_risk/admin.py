from django.contrib import admin
from .models import RiskAssessment, StockRiskMetrics, RiskAlert

@admin.register(RiskAssessment)
class RiskAssessmentAdmin(admin.ModelAdmin):
    list_display = ('portfolio', 'risk_level', 'volatility_score', 'diversification_score', 'assessment_date')
    search_fields = ('portfolio__name', 'user__username')
    list_filter = ('risk_level', 'assessment_date')

@admin.register(StockRiskMetrics)
class StockRiskMetricsAdmin(admin.ModelAdmin):
    list_display = ('stock', 'beta', 'volatility', 'var_95', 'max_drawdown', 'last_updated')
    search_fields = ('stock__symbol', 'stock__name')
    list_filter = ('last_updated',)

@admin.register(RiskAlert)
class RiskAlertAdmin(admin.ModelAdmin):
    list_display = ('portfolio', 'alert_type', 'created_at', 'is_read')
    search_fields = ('portfolio__name', 'message')
    list_filter = ('alert_type', 'is_read', 'created_at')
