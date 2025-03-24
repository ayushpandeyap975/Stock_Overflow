from django.contrib import admin
from .models import Stock, MarketNews, WatchList

@admin.register(Stock)
class StockAdmin(admin.ModelAdmin):
    list_display = ('symbol', 'name', 'current_price', 'change_percent', 'volume', 'last_updated')
    search_fields = ('symbol', 'name')
    list_filter = ('last_updated',)

@admin.register(MarketNews)
class MarketNewsAdmin(admin.ModelAdmin):
    list_display = ('title', 'source', 'published_date')
    search_fields = ('title', 'content')
    list_filter = ('source', 'published_date')
    filter_horizontal = ('related_stocks',)

@admin.register(WatchList)
class WatchListAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'created_at')
    search_fields = ('name', 'user__username')
    filter_horizontal = ('stocks',)
