from django.conf.urls import url
from stockmusic_app.views import IndexView, YahooView

urlpatterns = [
    url(r'^$', IndexView.as_view(), name="IndexView"),
    url(r'^prices/', YahooView.as_view(), name="YahooView"),
]
