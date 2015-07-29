import requests
import json
from django.http import JsonResponse
from django.shortcuts import render
from django.views.generic import View


class IndexView(View):

    def get(self, request):
        return render(request, "stockmusic_app/flocking.html")


class YahooView(View):

    def get(self, request):

        request_dict = dict(request.GET)
        fixed_dict = {k:v[0] for k,v in request_dict.items()}

        lookup_url = "http://query.yahooapis.com/v1/public/yql?q=%20select%20Adj_Close,Date,Volume%20from%20yahoo.finance.historicaldata%20where%20symbol%20=%20%22{company}%22%20and%20startDate%20=%20%22{start_date}%22%20and%20endDate%20=%20%22{end_date}%22%20&format=json%20&diagnostics=true%20&env=store://datatables.org/alltableswithkeys%20&callback=".format(**fixed_dict)

        r = requests.get(lookup_url+fixed_dict['company'])
        c = str(r.content)
        start = c.find("{")
        sliced = c[start:-3]
        q = json.loads(sliced)
        quote = q['query']['results']['quote']
        dumberer = [float(quote[idx]['Adj_Close']) for idx in range(len(quote)-1, -1, -1)]
        return JsonResponse({"quote": dumberer})
