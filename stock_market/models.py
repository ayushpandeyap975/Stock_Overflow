from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model


User = get_user_model() 

class Stock(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    symbol = models.CharField(max_length=100, blank=True, null=True)
    name = models.CharField(max_length=100, blank=True, null=True)
    last_price = models.FloatField(null=True, blank=True)
    predicted_1y = models.FloatField(null=True, blank=True)
    predicted_2y = models.FloatField(null=True, blank=True)
    predicted_3y = models.FloatField(null=True, blank=True)
    predicted_4y = models.FloatField(null=True, blank=True)
    predicted_5y = models.FloatField(null=True, blank=True)
    graph_path = models.ImageField(upload_to="stock_graphs/", max_length=255, blank=True, null=True)  

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
