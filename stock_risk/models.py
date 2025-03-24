from django.db import models
from django.conf import settings
from stock_market.models import Stock
from stock_portfolio.models import Portfolio

class RiskAssessment(models.Model):
    RISK_LEVELS = [
        ('LOW', 'Low Risk'),
        ('MEDIUM', 'Medium Risk'),
        ('HIGH', 'High Risk')
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE)
    risk_level = models.CharField(max_length=6, choices=RISK_LEVELS)
    volatility_score = models.DecimalField(max_digits=5, decimal_places=2)
    diversification_score = models.DecimalField(max_digits=5, decimal_places=2)
    sharpe_ratio = models.DecimalField(max_digits=5, decimal_places=2)
    assessment_date = models.DateTimeField(auto_now_add=True)
    recommendations = models.TextField()
    
    def __str__(self):
        return f"Risk Assessment for {self.portfolio.name}"

class StockRiskMetrics(models.Model):
    stock = models.OneToOneField(Stock, on_delete=models.CASCADE)
    beta = models.DecimalField(max_digits=5, decimal_places=2)
    volatility = models.DecimalField(max_digits=5, decimal_places=2)
    var_95 = models.DecimalField(max_digits=5, decimal_places=2)  # Value at Risk (95% confidence)
    max_drawdown = models.DecimalField(max_digits=5, decimal_places=2)
    last_updated = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Risk Metrics for {self.stock.symbol}"

class RiskAlert(models.Model):
    ALERT_TYPES = [
        ('VOLATILITY', 'High Volatility'),
        ('CONCENTRATION', 'Portfolio Concentration'),
        ('DRAWDOWN', 'Significant Drawdown'),
        ('CORRELATION', 'High Correlation')
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE)
    alert_type = models.CharField(max_length=20, choices=ALERT_TYPES)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.alert_type} Alert for {self.portfolio.name}"
