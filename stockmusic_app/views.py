import requests
import json
from django.http import JsonResponse
from django.shortcuts import render
from django.views.generic import View
from django.http import JsonResponse

# use a query string in the get instead of all these positional args


class Yahoo(View):

    def get(self, company, start_year, start_month, start_day, end_year, end_month, end_day):

        # company = request.GET.get("company", False)
        # start_year() = request.GET.get("company", False)

        lookup_url = "http://query.yahooapis.com/v1/public/yql?q=%20select%20Adj_Close,Date,Volume%20from%20yahoo.finance.historicaldata%20where%20symbol%20=%20%22{}%22%20and%20startDate%20=%20%22{}-{}-{}%22%20and%20endDate%20=%20%22{}-{}-{}%22%20&format=json%20&diagnostics=true%20&env=store://datatables.org/alltableswithkeys%20&callback=".format(company, start_year, start_month, start_day, end_year, end_month, end_day)

        r = requests.get(lookup_url + company)
        c = str(r.content)
        start = c.find("{")
        sliced = c[start:-3]
        q = json.loads(sliced)
        quote = q['query']['results']['quote']
        print(quote, len(quote), type(quote))
        return

# foo = Yahoo()
# foo.get("ip", "2015", "01", "03", "2015", "02", "03")

class IndexView(View):

    def get(self, request):
        return render(request, "stockmusic_app/flocking.html")
