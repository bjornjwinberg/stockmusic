import requests
import json
from django.http import JsonResponse
from django.shortcuts import render
from django.views.generic import View


def make_notes(quotes):
    # major = [261.626, 293.665, 329.628, 349.228, 391.995, 440.000, 493.883]
    major = [261.626, 329.628, 391.995, 493.883]
    minor = [261.626, 311.127, 391.995, 415.305]
    frequency_sequence = []
    # pitch_and_mood = []
    octave = 1
    scaleCounter = 0

    for index in range(len(quotes)):
        # pitch_and_mood = []

        if index + 1 == len(quotes):
            continue
        else:
            if quotes[index] < quotes[index+1]:
                if scaleCounter == 3:
                    scaleCounter = -1
                    if octave == 0.5:
                        octave = 1
                    else:
                        octave += 1
                scaleCounter += 1
                scaleCounter = abs(scaleCounter)
                frequency_sequence.append(octave * major[scaleCounter % len(major)])
            else:
                if scaleCounter == 0:
                    scaleCounter = 4
                    if octave > 1:
                        octave -= 1
                    else:
                        octave = 0.5
                scaleCounter -= 1
                scaleCounter = abs(scaleCounter)
                frequency_sequence.append(octave * minor[scaleCounter % len(major)])
    return frequency_sequence


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
        return JsonResponse({"quote": dumberer, "frequency_sequence": make_notes(dumberer)})






            # if index+2 < len(quotes):
            #     if quotes[index] < quotes[index+1] and quotes[index+1] < quotes[index+2]:
            #         pitch_and_mood.append("happy")
            #     else:
            #         pitch_and_mood.append("normal")

            # if quotes[index] > quotes[index+1] and quotes[index+1] > quotes[index+2]:
            #     pitch_and_mood.append("sad")
            # else:
            #     pitch_and_mood.append("normal")
