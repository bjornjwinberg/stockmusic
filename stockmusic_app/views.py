import requests
import json
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.views.generic import View
from django.http import JsonResponse

# use a query string in the get instead of all these positional args


class YahooView(View):

    def get(self, request):

        gotten = dict(request.GET)
        fixed = {k:v[0] for k,v in gotten.items()}

        lookup_url = "http://query.yahooapis.com/v1/public/yql?q=%20select%20Adj_Close,Date,Volume%20from%20yahoo.finance.historicaldata%20where%20symbol%20=%20%22{company}%22%20and%20startDate%20=%20%22{start_date}%22%20and%20endDate%20=%20%22{end_date}%22%20&format=json%20&diagnostics=true%20&env=store://datatables.org/alltableswithkeys%20&callback=".format(**fixed)

        r = requests.get(lookup_url+fixed['company'])
        # print("RRRRRRRRRR:", r)
        c = str(r.content)
        start = c.find("{")
        sliced = c[start:-3]
        # print("sliced:", sliced)
        q = json.loads(sliced)
        quote = q['query']['results']['quote']
        # print(quote, len(quote), type(quote))
        dumberer = [quote[idx]['Adj_Close'] for idx in range(len(quote)-1,-1,-1)]
        return JsonResponse({"quote": dumberer})


class IndexView(View):

    def get(self, request):
        return render(request, "stockmusic_app/flocking.html")
