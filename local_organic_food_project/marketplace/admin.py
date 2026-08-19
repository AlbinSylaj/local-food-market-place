from django.contrib import admin
from django.utils.html import format_html
from .models import Profile, SellerProfile, Product

class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "price", "quantity", "seller", "image_tag")
    readonly_fields = ("image_tag",)

    def image_tag(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 80px;"/>', obj.image.url)
        return "-"
    image_tag.short_description = "Image"

class SellerProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "farm_name", "farm_photo_tag")
    readonly_fields = ("farm_photo_tag",)

    def farm_photo_tag(self, obj):
        if obj.farm_photo:
            return format_html('<img src="{}" style="max-height: 80px;"/>', obj.farm_photo.url)
        return "-"
    farm_photo_tag.short_description = "Farm Photo"

admin.site.register(Profile)
admin.site.register(SellerProfile, SellerProfileAdmin)
admin.site.register(Product, ProductAdmin)
