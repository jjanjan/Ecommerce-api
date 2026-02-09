from django.shortcuts import render
from rest_framework import viewsets
from .models import Customer, Product, Order, OrderItem
from .serializers import CustomerSerializer, ProductSerializer, OrderSerializer, OrderItemSerializer

class CustomerViewSet(viewsets.ModelViewSet):
    """
    API endpoint for Customer CRUD operations
    """
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

class ProductViewSet(viewsets.ModelViewSet):
    """
    API endpoint for Product CRUD operations
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class OrderViewSet(viewsets.ModelViewSet):
    """
    API endpoint for Order CRUD operations
    """
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

class OrderItemViewSet(viewsets.ModelViewSet):
    """
    API endpoint for OrderItem CRUD operations
    """
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer