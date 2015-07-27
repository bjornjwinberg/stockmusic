from django.conf.urls import include, url
from django.contrib import admin

urlpatterns = [
    url(r'^stockmusic_app/', include('stockmusic_app.urls', namespace='stockmusic_app')),
    url(r'^admin/', include(admin.site.urls)),
]
