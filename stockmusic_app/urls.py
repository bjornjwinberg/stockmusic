from django.conf.urls import url
from stockmusic_app.views import *

urlpatterns = [
    url(r'^$', IndexView.as_view(), name="IndexView"),
    # url(r'^login/', LoginView.as_view(), name="LoginView"),
    # url(r'^welcome/(?P<sessionid>[0-9]+)$', WelcomeView.as_view(), name="WelcomeView"),
    # url(r'^create/', CreateView.as_view(), name="CreateView"),
    # url(r'^balance/', BalanceView.as_view(), name="BalanceView"),
    # url(r'^deposit/', DepositView.as_view(), name="DepositView"),
    # url(r'^withdraw/', WithdrawView.as_view(), name="WithdrawView"),
    # url(r'^home/', HomeView.as_view(), name="HomeView"),
    # url(r'^close/', CloseView.as_view(), name="CloseView"),
    # url(r'^logout/', LogoutView.as_view(), name="LogoutView"),
]
