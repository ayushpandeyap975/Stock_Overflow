from django.db import models
from django.conf import settings

class Currency(models.Model):
    code = models.CharField(max_length=3, unique=True)  # ISO 4217 currency code
    name = models.CharField(max_length=50)
    symbol = models.CharField(max_length=5)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.code} - {self.name}"
    
    class Meta:
        verbose_name_plural = "Currencies"

class ExchangeRate(models.Model):
    from_currency = models.ForeignKey(Currency, on_delete=models.CASCADE, related_name='rates_from')
    to_currency = models.ForeignKey(Currency, on_delete=models.CASCADE, related_name='rates_to')
    rate = models.DecimalField(max_digits=12, decimal_places=6)
    last_updated = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.from_currency.code}/{self.to_currency.code}"
    
    class Meta:
        unique_together = ('from_currency', 'to_currency')

class CurrencyConversion(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    from_currency = models.ForeignKey(Currency, on_delete=models.CASCADE, related_name='conversions_from')
    to_currency = models.ForeignKey(Currency, on_delete=models.CASCADE, related_name='conversions_to')
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    converted_amount = models.DecimalField(max_digits=15, decimal_places=2)
    rate_used = models.DecimalField(max_digits=12, decimal_places=6)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.amount} {self.from_currency.code} to {self.to_currency.code}"

class CurrencyAlert(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    from_currency = models.ForeignKey(Currency, on_delete=models.CASCADE, related_name='alerts_from')
    to_currency = models.ForeignKey(Currency, on_delete=models.CASCADE, related_name='alerts_to')
    target_rate = models.DecimalField(max_digits=12, decimal_places=6)
    is_above = models.BooleanField()  # True if alert when rate goes above target
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        condition = "above" if self.is_above else "below"
        return f"Alert when {self.from_currency.code}/{self.to_currency.code} goes {condition} {self.target_rate}"
