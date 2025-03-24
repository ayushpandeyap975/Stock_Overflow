from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.db.models import Sum, F
from .models import Portfolio, PortfolioHolding, Transaction
from stock_market.models import Stock
from decimal import Decimal

# @login_required
def portfolio_list(request):
    portfolios = Portfolio.objects.all()
    total_value = sum(portfolio.get_total_value() for portfolio in portfolios)
    
    context = {
        'portfolios': portfolios,
        'total_value': total_value,
    }
    return render(request, 'portfolio.html', context)

@login_required
def portfolio_detail(request, portfolio_id):
    portfolio = get_object_or_404(Portfolio, id=portfolio_id, user=request.user)
    holdings = portfolio.holdings.all()
    
    # Calculate portfolio metrics
    total_value = portfolio.get_total_value()
    total_profit_loss = sum(holding.profit_loss() for holding in holdings)
    
    # Get recent transactions
    recent_transactions = portfolio.transactions.all().order_by('-timestamp')[:10]
    
    context = {
        'portfolio': portfolio,
        'holdings': holdings,
        'total_value': total_value,
        'total_profit_loss': total_profit_loss,
        'recent_transactions': recent_transactions,
    }
    return render(request, 'portfolio_detail.html', context)

@login_required
def add_transaction(request):
    if request.method == 'POST':
        portfolio_id = request.POST.get('portfolio_id')
        symbol = request.POST.get('symbol')
        transaction_type = request.POST.get('transaction_type')
        quantity = Decimal(request.POST.get('quantity'))
        price = Decimal(request.POST.get('price'))
        
        portfolio = get_object_or_404(Portfolio, id=portfolio_id, user=request.user)
        stock = get_object_or_404(Stock, symbol=symbol)
        
        # Create the transaction
        transaction = Transaction.objects.create(
            portfolio=portfolio,
            stock=stock,
            transaction_type=transaction_type,
            quantity=quantity,
            price=price
        )
        
        # Update or create portfolio holding
        holding, created = PortfolioHolding.objects.get_or_create(
            portfolio=portfolio,
            stock=stock,
            defaults={'quantity': 0, 'average_buy_price': 0}
        )
        
        if transaction_type == 'BUY':
            # Update average buy price
            total_cost = (holding.quantity * holding.average_buy_price) + (quantity * price)
            total_quantity = holding.quantity + quantity
            holding.average_buy_price = total_cost / total_quantity if total_quantity > 0 else 0
            holding.quantity = total_quantity
        else:  # SELL
            holding.quantity -= quantity
        
        holding.save()
        
        return redirect('stock_portfolio:portfolio_detail', portfolio_id=portfolio_id)
    
    portfolios = Portfolio.objects.filter(user=request.user)
    return render(request, 'add_transaction.html', {'portfolios': portfolios})

@login_required
def create_portfolio(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        description = request.POST.get('description', '')
        
        Portfolio.objects.create(
            user=request.user,
            name=name,
            description=description
        )
        return redirect('stock_portfolio:portfolio_list')
    
    return render(request, 'create_portfolio.html')

@login_required
def portfolio_performance(request, portfolio_id):
    portfolio = get_object_or_404(Portfolio, id=portfolio_id, user=request.user)
    holdings = portfolio.holdings.all()
    
    # Calculate performance metrics
    performance_data = {
        'total_value': portfolio.get_total_value(),
        'holdings': [
            {
                'symbol': holding.stock.symbol,
                'name': holding.stock.name,
                'quantity': holding.quantity,
                'current_value': holding.current_value(),
                'profit_loss': holding.profit_loss(),
                'profit_loss_percent': (holding.profit_loss() / (holding.quantity * holding.average_buy_price)) * 100
                if holding.quantity * holding.average_buy_price != 0 else 0
            }
            for holding in holdings
        ]
    }
    
    return JsonResponse(performance_data)
