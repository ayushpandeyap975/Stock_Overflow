import io
import os
import re
import numpy as np
import pandas as pd
import yfinance as yf
import matplotlib
matplotlib.use("Agg")  
import matplotlib.pyplot as plt
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from sklearn.linear_model import LinearRegression
from django.conf import settings
from django.http import HttpResponse, JsonResponse
from .models import Stock
from django.shortcuts import render, redirect
from google import genai
from google.genai import types

import base64

def format_symbol(symbol):
    if not isinstance(symbol, str):  
        return None  
    symbol = symbol.strip().upper()  
    if symbol.isdigit():  
        return f"{symbol}.BO"  
    elif symbol in ["RELIANCE", "TCS", "INFY", "HDFCBANK", "ITC", "SBIN", "WIPRO", "HCLTECH"]:
        return f"{symbol}.NS"  
    else:
        return symbol  

def get_stock_data(symbol, period="5y"):
    try:
        stock = yf.Ticker(symbol)
        data = stock.history(period=period)
        return data[['Close']]
    except Exception as e:
        return None

def predict_stock_price(symbol):
    formatted_symbol = format_symbol(symbol)
    data = get_stock_data(formatted_symbol)
    if data is None or data.empty:
        return None, None, None
    today_price = round(data['Close'].iloc[-1], 2)
    data['Days'] = range(len(data))
    X = np.array(data['Days']).reshape(-1, 1)
    y = np.array(data['Close'])
    model = LinearRegression()
    model.fit(X, y)
    future_days = [len(data) + (365 * i) for i in range(1, 6)]
    predicted_prices = [round(model.predict(np.array([[day]]))[0], 2) for day in future_days]
    return today_price, predicted_prices, data

def generate_graph(request, symbol, today_price, predicted_prices):
    formatted_symbol = format_symbol(symbol)
    data = get_stock_data(formatted_symbol)
    if data is None or data.empty:
        return HttpResponse("Stock data not available", status=404)
    data = data.copy()
    data['Days'] = np.arange(len(data))
    X = np.array(data['Days']).reshape(-1, 1)
    y = np.array(data['Close'])
    model = LinearRegression()
    model.fit(X, y)
    future_days = np.array(range(len(data) + 365 * 5)).reshape(-1, 1)
    predicted_trend = model.predict(future_days)
    plt.figure(figsize=(8, 5))
    plt.plot(data.index, data['Close'], label="Actual Price", color='blue')
    future_dates = pd.date_range(start=data.index[-1], periods=365 * 5)
    plt.plot(
        data.index.append(future_dates),
        predicted_trend, linestyle="dashed", color='red', label="Predicted Trend"
    )
    plt.xlabel("Date")
    plt.ylabel("Stock Price")
    plt.legend()
    plt.title(f"Stock Price Prediction for {symbol}")
    buffer = io.BytesIO()
    canvas = FigureCanvas(plt.gcf())
    canvas.print_png(buffer)
    graph_filename = f"stock_graph_{symbol}.png"
    graph_path = os.path.join(settings.MEDIA_ROOT, "stock_graphs", graph_filename)
    os.makedirs(os.path.dirname(graph_path), exist_ok=True)
    plt.savefig(graph_path)
    plt.close()
    return HttpResponse(buffer.getvalue(), content_type='image/png')

from django.shortcuts import render

def stock_analysis(request):
    today_price = None
    predicted_prices = None
    graph_url = None
    symbol = ""
    if request.method == "POST":
        # breakpoint()
        symbol = request.POST.get("symbol", "").strip().upper()
        today_price, predicted_prices, data = predict_stock_price(symbol)
        if today_price is not None and predicted_prices is not None:
            graph_response = generate_graph(request, symbol, today_price, predicted_prices)
            print(graph_response)
            if graph_response.status_code == 200:
                graph_url = f"stock_graphs/stock_graph_{symbol}.png"
        print(today_price)
        print(predicted_prices)


        save_data, created = Stock.objects.update_or_create(
            user = request.user, 
            symbol=symbol,
            defaults={
                "name": symbol,
                "last_price": today_price,
                "predicted_1y": predicted_prices[0],
                "predicted_2y": predicted_prices[1],
                "predicted_3y": predicted_prices[2],
                "predicted_4y": predicted_prices[3],
                "predicted_5y": predicted_prices[4],
                "graph_path": graph_url,
            }
        )
    
    stock_data = Stock.objects.filter(user=request.user).order_by('-id')

    return render(request, "portfolio.html",  {"stock": stock_data})



def market_update(request):
    try:
        return render(request, "market.html")
    except Exception as e:
        print(e)
        return redirect('dashboard')
    
    
def stockai(request):
    try:
        return render(request, "Stock_eye.html")
    except Exception as e:
        print(e)
        return redirect('dashboard')
    




def generate(user_input):
    client = genai.Client(api_key= "AIzaSyBD_4sYWJqmS2sj3kpeBD-hBbV5Z3voamo")  # Use API key instead of Vertex AI

    model = "gemini-2.0-flash-001"
    contents = [user_input]


    
    generate_content_config = types.GenerateContentConfig(
        temperature=1,
        top_p=0.95,
        max_output_tokens=8192,
        response_modalities=["TEXT"],
        safety_settings=[
            types.SafetySetting(category="HARM_CATEGORY_HATE_SPEECH", threshold="OFF"),
            types.SafetySetting(category="HARM_CATEGORY_DANGEROUS_CONTENT", threshold="OFF"),
            types.SafetySetting(category="HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold="OFF"),
            types.SafetySetting(category="HARM_CATEGORY_HARASSMENT", threshold="OFF")
        ],
        system_instruction=[types.Part.from_text(text="Answer only finance, tax and investment related questions. Do not display any disclaimers like, 'I am a chatbot. Seek professional advice.' ")],
    )

    generated_text = "" 
    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=generate_content_config,
    ):
        generated_text += chunk.text
    generated_text = generated_text.replace("*", "")
    return generated_text


def chat_bot(request):
    try:
        if request.method == 'POST':
            user_input = request.POST.get('message', "")
            bot_response = generate(user_input)
            print(bot_response)
            return JsonResponse({"response": bot_response})
    except Exception as e:
        return False
