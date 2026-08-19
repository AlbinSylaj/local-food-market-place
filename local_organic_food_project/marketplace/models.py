from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    ROLE_CHOICES = (
        ('buyer', 'Buyer'),
        ('seller', 'Seller'),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} - {self.role}"


from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance, role='buyer')
    elif hasattr(instance, 'profile'):
        instance.profile.save()



# seller profile --- seller profile --- seller profile --- seller profile


from django.db import models
from django.contrib.auth.models import User

class SellerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    farm_name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    farm_photo = models.ImageField(upload_to='farms/', blank=True, null=True)

    def __str__(self):
        return self.farm_name


class Product(models.Model):
    CATEGORY_CHOICES = (
        ('vegetables', 'Vegetables'),
        ('fruits', 'Fruits'),
        ('eggs', 'Eggs'),
        ('honey', 'Honey'),
        ('milk', 'Milk'),
        ('cheese', 'Cheese'),
        ('meat', 'Meat'),
        ('herbs', 'Herbs'),
        ('homemade', 'Homemade Products'),
    )

    seller = models.ForeignKey(SellerProfile, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    quantity = models.PositiveIntegerField()
    image = models.ImageField(upload_to='products/', blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.category})"

