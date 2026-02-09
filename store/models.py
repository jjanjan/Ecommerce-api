from django.db import models

class Customer(models.Model):
    customer_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    
    def __str__(self):
        return self.name

class Product(models.Model):
    product_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)
    quantity = models.IntegerField(default=0)
    
    def __str__(self):
        return self.name

class Order(models.Model):
    order_id = models.AutoField(primary_key=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='orders')
    order_date = models.DateField(auto_now_add=True)
    
    def __str__(self):
        return f"Order {self.order_id} by {self.customer.name}"

class OrderItem(models.Model):
    """Junction table for Many-to-Many relationship between Order and Product"""
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='order_items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='order_items')
    quantity = models.IntegerField(default=1)
    
    class Meta:
        unique_together = ['order', 'product']
    
    def __str__(self):
        return f"{self.product.name} x{self.quantity} in Order {self.order.order_id}"
