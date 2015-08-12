from django.conf.urls import include, url

urlpatterns = [
    url(r'^stockmusic_app/', include('stockmusic_app.urls', namespace='stockmusic_app')),
]
