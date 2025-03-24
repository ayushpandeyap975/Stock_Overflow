from django.db import models
from django.conf import settings
from stock_market.models import Stock
from stock_portfolio.models import Transaction
from django.contrib.auth import get_user_model

User = get_user_model()

class TaxLot(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE)
    purchase_date = models.DateField()
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2)
    remaining_quantity = models.DecimalField(max_digits=10, decimal_places=2)
    is_closed = models.BooleanField(default=False)
    
    def cost_basis(self):
        return self.purchase_price * self.quantity
    
    def __str__(self):
        return f"{self.stock.symbol} - {self.purchase_date}"

class TaxCalculation(models.Model):
    HOLDING_PERIOD = [
        ('SHORT', 'Short Term'),
        ('LONG', 'Long Term')
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    tax_year = models.IntegerField()
    transaction = models.ForeignKey(Transaction, on_delete=models.CASCADE)
    holding_period = models.CharField(max_length=5, choices=HOLDING_PERIOD)
    capital_gain = models.DecimalField(max_digits=10, decimal_places=2)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2)
    estimated_tax = models.DecimalField(max_digits=10, decimal_places=2)
    calculation_date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Tax Calculation for {self.transaction.stock.symbol} - {self.tax_year}"

class TaxReport(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    tax_year = models.IntegerField()
    total_short_term_gains = models.DecimalField(max_digits=10, decimal_places=2)
    total_long_term_gains = models.DecimalField(max_digits=10, decimal_places=2)
    total_estimated_tax = models.DecimalField(max_digits=10, decimal_places=2)
    generated_date = models.DateTimeField(auto_now_add=True)
    report_data = models.JSONField()  # Stores detailed breakdown
    
    def __str__(self):
        return f"Tax Report {self.tax_year} - {self.user.username}"

class TaxAlert(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Tax Alert for {self.user.username} - {self.created_at.strftime('%Y-%m-%d')}"
