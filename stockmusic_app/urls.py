from django.conf.urls import url
from stockmusic_app.views import Index, Yahoo, About

urlpatterns = [
    url(r'^$', Index.as_view(), name="IndexView"),
    url(r'^prices/', Yahoo.as_view(), name="YahooView"),
    url(r'^about/', About.as_view(), name="AboutView"),
]
