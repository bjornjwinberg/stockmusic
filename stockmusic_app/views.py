import datetime
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

        fixed_dict = {k: v[0] for k, v in request_dict.items()}
        # print(fixed_dict)

        duration = fixed_dict["duration"]

        start_date = datetime.datetime.strptime(fixed_dict["start_date"], "%Y-%m-%d")

        end_date = start_date + datetime.timedelta(days=int(duration))

        today = datetime.datetime.today()
        # print("todayyy", today, type(today))
        # print("start_date", start_date, type(start_date))
        # print("enddateee", end_date, type(end_date))

        if start_date >= today:
            fixed_dict['start_date'] = today - datetime.timedelta(days=2)

        if end_date > today:
            fixed_dict['end_date'] = today
        else:
            fixed_dict['end_date'] = end_date

        lookup_url = "http://query.yahooapis.com/v1/public/yql?q=%20select%20Adj_Close,Date,Volume%20from%20yahoo.finance.historicaldata%20where%20symbol%20=%20%22{company}%22%20and%20startDate%20=%20%22{start_date}%22%20and%20endDate%20=%20%22{end_date}%22%20&format=json%20&diagnostics=true%20&env=store://datatables.org/alltableswithkeys%20&callback=".format(**fixed_dict)

        r = requests.get(lookup_url+fixed_dict['company'])
        c = str(r.content)
        start = c.find("{")
        sliced = c[start:-3]

        try:
            q = json.loads(sliced)
            quote = q['query']['results']['quote']
            dumberer = [float(quote[idx]['Adj_Close']) for idx in range(len(quote)-1, -1, -1)]
            print("here")
            return JsonResponse({"quote": dumberer, "frequency_sequence": make_notes_v2(dumberer)})
        except:
            return JsonResponse({"error": "Something went horribly, horribly wrong."})


# def make_notes(quotes):
#     major = [261.626, 329.628, 391.995, 466.164]
#     minor = [261.626, 311.127, 369.994, 440.000]
#     frequency_sequence = []
#     octave = 1
#     scaleCounter = 0

#     for index in range(len(quotes)):

#         mood_pitch_price_harmony = dict()

#         if index+3 < len(quotes):
#             if quotes[index] < quotes[index+1] and quotes[index+1] < quotes[index+2] and quotes[index+2] < quotes[index+3]:
#                 mood_pitch_price_harmony["mood"] = "happy"
#             elif quotes[index] > quotes[index+1] and quotes[index+1] > quotes[index+2] and quotes[index+2] > quotes[index+3]:
#                 mood_pitch_price_harmony["mood"] = "sad"
#             else:
#                 mood_pitch_price_harmony["mood"] = "normal"
#         else:
#             mood_pitch_price_harmony["mood"] = "normal"

#         if index + 1 == len(quotes):
#             continue
#         else:
#             if quotes[index] < quotes[index+1]:
#                 if scaleCounter == 3:
#                     scaleCounter = -1
#                     if octave == 0.5:
#                         octave = 1
#                     else:
#                         octave += 1
#                 scaleCounter += 1
#                 scaleCounter = abs(scaleCounter)
#                 mood_pitch_price_harmony["pitch"] = octave * major[scaleCounter % len(major)]
#                 if scaleCounter == 3:
#                     mood_pitch_price_harmony["harmony"] = octave * major[scaleCounter-1 % len(major)]
#                 else:
#                     mood_pitch_price_harmony["harmony"] = octave * major[scaleCounter+1 % len(major)]

#             else:
#                 if scaleCounter == 0:
#                     scaleCounter = 4
#                     if octave > 1:
#                         octave -= 1
#                     else:
#                         octave = 0.5
#                 scaleCounter -= 1
#                 scaleCounter = abs(scaleCounter)
#                 mood_pitch_price_harmony["pitch"] = octave * minor[scaleCounter % len(minor)]
#                 if scaleCounter == 3:
#                     mood_pitch_price_harmony["harmony"] = octave * minor[scaleCounter-1 % len(minor)]
#                 else:
#                     mood_pitch_price_harmony["harmony"] = octave * minor[scaleCounter+1 % len(minor)]

#         mood_pitch_price_harmony["price"] = quotes[index]
#         print(mood_pitch_price_harmony)
#         frequency_sequence.append(mood_pitch_price_harmony)

#     return frequency_sequence


def make_notes_v2(quotes):
    major = [261.626, 329.628, 391.995, 493.883]
    minor = [261.626, 311.127, 369.994, 440.000]
    frequency_sequence = []
    octave = 1
    scaleCounter = 0
    start = 0
    lookback = 4
    for index in range(len(quotes)):

        mood_pitch_price_harmony = dict()
        mood = "normal"

        if index < lookback-1:
            start = 0
        else:
            start = lookback

        current = quotes[start:index+1]
        moving_average = sum(current)/(index+1)

        if quotes[index] > moving_average:
            mood = "happy"
        elif quotes[index] < moving_average:
            mood = "sad"
        mood_pitch_price_harmony["mood"] = mood
        if index + 1 == len(quotes):
            continue
        else:
            if quotes[index] < quotes[index+1]:
                if scaleCounter == 3:
                    scaleCounter = -1
                    if octave <= 0.25:
                        octave = .5
                    else:
                        octave = int(octave+1)
                scaleCounter += 1
                scaleCounter = abs(scaleCounter)
                mood_pitch_price_harmony["pitch"] = octave * major[scaleCounter % len(major)]
                if scaleCounter == 3:
                    mood_pitch_price_harmony["harmony"] = octave * major[scaleCounter-1 % len(major)]
                else:
                    mood_pitch_price_harmony["harmony"] = octave * major[scaleCounter+1 % len(major)]

            else:
                if scaleCounter == 0:
                    scaleCounter = 3
                    if octave > 1:
                        octave -= 1
                    elif octave >= 0.5:
                        octave = octave*0.5

                    # else:
                    #     octave = octave*0.5
                scaleCounter -= 1
                scaleCounter = abs(scaleCounter)
                mood_pitch_price_harmony["pitch"] = octave * minor[scaleCounter % len(minor)]
                if scaleCounter == 3:
                    mood_pitch_price_harmony["harmony"] = octave * minor[scaleCounter-1 % len(minor)]
                else:
                    mood_pitch_price_harmony["harmony"] = octave * minor[scaleCounter+1 % len(minor)]

        mood_pitch_price_harmony["price"] = quotes[index]
        print("octave:", octave)
        print(mood_pitch_price_harmony)
        frequency_sequence.append(mood_pitch_price_harmony)
    return frequency_sequence
