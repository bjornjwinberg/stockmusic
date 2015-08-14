import datetime
import requests
import json
from django.http import JsonResponse
from django.shortcuts import render
from django.views.generic import View


class Index(View):
    def get(self, request):
        return render(request, "stockmusic_app/flocking.html")


class About(View):
    def get(self, request):
        return render(request, "stockmusic_app/homepage.html")


class Yahoo(View):
    def get(self, request):

        request_dict = dict(request.GET)
        fixed_dict = {k: v[0] for k, v in request_dict.items()}

        duration = fixed_dict["duration"]
        lookback = fixed_dict["lookback"]
        instrument = fixed_dict["instrument"]
        up_scale = fixed_dict["up_scale"]
        down_scale = fixed_dict["down_scale"]

        start_date = datetime.datetime.strptime(fixed_dict["start_date"], "%Y-%m-%d")
        end_date = start_date + datetime.timedelta(days=int(duration))
        today = datetime.datetime.today()
        if start_date >= today:
            fixed_dict['start_date'] = today - datetime.timedelta(days=2)

        if end_date > today:
            fixed_dict['end_date'] = today
        else:
            fixed_dict['end_date'] = end_date

        lookup_url = "http://query.yahooapis.com/v1/public/yql?q=%20select%20Adj_Close,Date,Volume%20from%20yahoo.finance.historicaldata%20where%20symbol%20=%20%22{company}%22%20and%20startDate%20=%20%22{start_date}%22%20and%20endDate%20=%20%22{end_date}%22%20&format=json%20&diagnostics=true%20&env=store://datatables.org/alltableswithkeys%20&callback=".format(**fixed_dict)

        try:
            r = requests.get(lookup_url+fixed_dict['company'])
            c = str(r.content)
            start = c.find("{")
            sliced = c[start:-3]
            q = json.loads(sliced)
            quote = q['query']['results']['quote']
            for idx in range(len(quote)):
                quote[idx]["Adj_Close"] = float(quote[idx]["Adj_Close"])
                quote[idx]["Volume"] = int(quote[idx]["Volume"])
            quote.reverse()
            return JsonResponse({"quote": quote, "frequency_sequence": make_notes_v2(quote, int(lookback), up_scale, down_scale), "instrument": instrument, "up_scale": up_scale, "down_scale": down_scale})
        except:
            return JsonResponse({"error": "Invalid ticker and/or date range."})


def make_notes_v2(quotes, lookback, up_scale, down_scale):
    major = [261.626, 329.628, 391.995, 493.883]  # 1, 3, 5, 7
    dominant = [261.626, 329.628, 391.995, 466.164]  # 1, 3, 5, b7
    minor = [261.626, 311.127, 391.995, 466.164]  # 1, b3, 5, b7
    diminished = [261.626, 311.127, 369.994, 440.000]  # 1, b3, b5, bb7
    ascending = None
    descending = None

    frequency_sequence = []
    octave = 1
    scaleCounter = 0
    start = 0

    if up_scale == "major":
        ascending = major
    elif up_scale == "dominant":
        ascending = dominant
    else:
        ascending = "major"

    if down_scale == "minor":
        descending = minor
    elif down_scale == "diminished":
        descending = diminished
    else:
        descending = "minor"

    for index in range(len(quotes)):
        mood_pitch_price_harmony = dict()
        mood = "normal"

        if index < lookback:
            moving_average = 0
        else:
            start = index - lookback+1
            current = quotes[start:index+1]
            moving_average = sum(q["Adj_Close"] for q in current)/lookback
        if moving_average == 0:
            mood = "normal"
        elif quotes[index]["Adj_Close"] > moving_average:
            mood = "happy"
        elif quotes[index]["Adj_Close"] < moving_average:
            mood = "sad"
        mood_pitch_price_harmony["mood"] = mood

        if index == 0:
            mood_pitch_price_harmony["pitch"] = 261.626
            mood_pitch_price_harmony["harmony"] = 261.626
        else:
            if quotes[index-1]["Adj_Close"] < quotes[index]["Adj_Close"]:
                if scaleCounter == 3:
                    scaleCounter = -1
                    if octave <= 0.25:
                        octave = .5
                    else:
                        octave = int(octave+1)
                scaleCounter += 1
                scaleCounter = abs(scaleCounter)
                mood_pitch_price_harmony["pitch"] = octave * ascending[scaleCounter]
                if scaleCounter == 3:
                    mood_pitch_price_harmony["harmony"] = (octave*2) * 293.665
                else:
                    mood_pitch_price_harmony["harmony"] = octave * ascending[scaleCounter+1]
            else:
                if scaleCounter == 0:
                    scaleCounter = 4
                    if octave > 1:
                        octave -= 1
                    elif octave >= 0.5:
                        octave = octave*0.5
                scaleCounter -= 1
                scaleCounter = abs(scaleCounter)
                mood_pitch_price_harmony["pitch"] = octave * descending[scaleCounter % len(descending)]
                if scaleCounter == 3:
                    if descending[scaleCounter] ==  466.164: # minor 7th
                        mood_pitch_price_harmony["harmony"] = (octave*2) * 293.665
                    elif descending[scaleCounter] ==  440.000: # bb7
                        mood_pitch_price_harmony["harmony"] = (octave*2) * 261.626
                else:
                    mood_pitch_price_harmony["harmony"] = octave * descending[scaleCounter+1 % len(descending)]
        mood_pitch_price_harmony["price"] = quotes[index]["Adj_Close"]
        frequency_sequence.append(mood_pitch_price_harmony)
    return frequency_sequence
