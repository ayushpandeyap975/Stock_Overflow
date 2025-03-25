from django.contrib import admin
from .models import Stock, MarketNews, WatchList



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

@admin.register(Stock)
class StockAdmin(admin.ModelAdmin):
    list_display = ('user', 'symbol', 'name', 'last_price', 'predicted_1y', 'predicted_2y', 'predicted_3y', 'predicted_4y', 'predicted_5y', 'graph_path')
    search_fields = ('symbol', 'name', 'user__username') 
    list_filter = ('user',) 
    ordering = ('symbol',)