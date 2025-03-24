from django.db import models
from django.conf import settings

class Stock(models.Model):
    symbol = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100)
    current_price = models.DecimalField(max_digits=10, decimal_places=2)
    change_percent = models.DecimalField(max_digits=5, decimal_places=2)
    volume = models.BigIntegerField()
    market_cap = models.BigIntegerField()
    pe_ratio = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    dividend_yield = models.DecimalField(max_digits=5, decimal_places=2, null=True)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.symbol} - {self.name}"

class MarketNews(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    source = models.CharField(max_length=100)
    url = models.URLField()
    image_url = models.URLField(null=True, blank=True)
    published_date = models.DateTimeField()
    related_stocks = models.ManyToManyField(Stock, blank=True)

    class Meta:
        ordering = ['-published_date']

    def __str__(self):
        return self.title

class WatchList(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    stocks = models.ManyToManyField(Stock)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username}'s {self.name} Watchlist"
