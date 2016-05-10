from django.contrib import admin
from main_app.models import UserProfile, WebsiteCategory, WebsitePage
# from main_app.models import Category, Page
# Register your models here.

# admin.site.register(Category)
# admin.site.register(Page)
admin.site.register(UserProfile)
admin.site.register(WebsiteCategory)
admin.site.register(WebsitePage)