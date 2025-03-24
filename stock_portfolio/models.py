from django.db import models
from django.conf import settings
from stock_market.models import Stock

class Portfolio(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username}'s {self.name} Portfolio"
    
    def get_total_value(self):
        return sum(holding.current_value() for holding in self.holdings.all())

class PortfolioHolding(models.Model):
    portfolio = models.ForeignKey(Portfolio, related_name='holdings', on_delete=models.CASCADE)
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    average_buy_price = models.DecimalField(max_digits=10, decimal_places=2)
    
    def current_value(self):
        return self.quantity * self.stock.current_price
    
    def profit_loss(self):
        return self.current_value() - (self.quantity * self.average_buy_price)
    
    def __str__(self):
        return f"{self.stock.symbol} in {self.portfolio.name}"

class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('BUY', 'Buy'),
        ('SELL', 'Sell')
    ]
    
    portfolio = models.ForeignKey(Portfolio, related_name='transactions', on_delete=models.CASCADE)
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE)
    transaction_type = models.CharField(max_length=4, choices=TRANSACTION_TYPES)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    timestamp = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)
    
    def total_value(self):
        return self.quantity * self.price
    
    def __str__(self):
        return f"{self.transaction_type} {self.quantity} {self.stock.symbol} at {self.price}"
