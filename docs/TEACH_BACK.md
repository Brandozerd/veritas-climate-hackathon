# Teach-back guide: explain Recess Ready to a judge

Use this on Sunday morning. Take turns: one of you explains a step out loud, the other asks "why?" until the answer is solid. Every number here comes from the saved notebook.

## The project in 30 seconds

> Recess Ready helps a Philadelphia principal decide, the evening before, whether tomorrow's recess needs a change of plan. We built a machine-learning model that beat "tomorrow will be like today", 56 danger days caught against 47, but that difference could be luck (p = 0.38). Then we tested it against the plain weather forecast with our danger lines, and the forecast won on weather dangers. So the app uses the forecast for heat, cold, rain, wind and snow, and our model for smog and smoke. On 270 past school days it caught 59 of 70 danger days with 13 false alarms, clearly better than our model alone (p = 0.006).

## Step by step

| Step | What it does | Say it like this |
|---|---|---|
| 1. Get the data | Loads daily Philadelphia weather since 1995 and air quality since August 2022 from Open-Meteo. | "We use 30 years of weather so the model has seen many unusual winters. Air data only exists for 3 years." |
| 2. Define the dangers | Marks each day true or false for 7 dangers using fixed thresholds, like feels-like 90 °F or 20 °F. | "A danger day is any school day where at least one threshold is crossed. About 1 in 4 school days is one, mostly because of cold." |
| 3. Today to tomorrow | Puts today's inputs next to tomorrow's answers. Adds trends from the last 3 days. | "The model only gets things we'd know this evening. Nothing from tomorrow, so no leakage." |
| 4. Split by time | Trains before September 2025, tests after. | "It's a forecast, so we never let it see the future. No shuffling." |
| 5. Wind and pollution | Averages air quality by wind direction. | "South and southwest winds bring Philadelphia's dirtiest air, AQI 83 against 60 from the north. That's a pattern, not proof of cause." |
| 6. Baseline | Guesses that tomorrow's dangers equal today's. | "This is called persistence. It's surprisingly good, 82% accurate, so it's a fair bar." |
| 7. Train | Two random forests: one for weather dangers, one for air dangers. | "A random forest is many decision trees that vote. We use two because air data only goes back 3 years, and we didn't want that to limit the weather dangers." |
| 8. First try | Alerts whenever a score passes 0.5. | "It failed: 192 false alarms. Heavy rain alone caused 186, for 3 real days." |
| 9. Alert lines | Gives each danger its own cutoff, chosen on a practice year. | "We set each danger's alert line on the 2024-25 school year, counting a miss as twice as bad as a false alarm. We never touched the test period to do it." |
| 10. Confusion matrix | A 2 x 2 table of right and wrong calls. | "56 caught, 14 missed, 27 false alarms, 173 correctly quiet days." |
| 11. Failures | Shows danger days it missed. | "On October 30, 2025 there was an inch of rain and we gave no alert. Rain is one of the dangers we can't predict yet." |
| 12. Seasons | Accuracy by season. | "Better than the baseline in fall and winter, slightly worse in spring and June." |
| 13. Real station | Compares our data and model with the airport's real weather station. | "Our data matched the real station on 98-99% of days. Against the station, we caught 45 and the baseline 38." |
| 14. Hour by hour | Downloads the airport station's real hourly readings. | "Our model uses one wind direction per day, which can hide a storm front. The Past days tab shows what the airport measured each hour, with lunch recess highlighted. The model doesn't use them yet." |
| 15. Region | Runs the same model on 35 nearby places. | "Accuracy stayed between 81% and 86% without retraining. It's weakest in South Jersey near the coast." |
| 9b. Shuffle test | Shuffles one input at a time and counts how much worse the alerts get. | "The 3-day average feels-like low matters most for weather. For air, it's a temperature change, then PM2.5. The quick built-in ranking said wind direction, but the shuffle test proved it barely matters, so we trust the shuffle test." |
| 16. How far ahead? | Feeds the model old forecasts made 2-7 days ahead and scores it on the test days. | "The app shows a week, so we tested the whole week. A week ahead it still caught 45 of 65 weather danger days; the baseline caught 29. Weather dangers only, because there's no archive of old air forecasts." |
| 16b. A tougher baseline | Scores the plain forecast with our danger lines, and the hybrid, with precision, recall, F1 and a paired test. | "The forecast beat our model on weather, because it already knows a cold front is coming. So the app uses each where it tested best. We decided that after seeing the test, and we say so." |
| 17. Week ahead (live) | Downloads the last 3 days and next 7 from Open-Meteo for Philadelphia and 35 places, and scores each day with the same trained model. | "Tomorrow's call uses today's weather, exactly how we tested it. Days 2 to 7 use the forecast instead, which we haven't tested, so we call them an early look." |
| 18. App | Three tabs: the week ahead, past days, and results. | "Week ahead is the real forecast. Past days lets you check any test day: what we would have said, and what actually happened. Results is the scorecard." |

## Words to get right

- **Risk score, not percent chance.** We told the forests that rare dangers matter (`class_weight="balanced"`). That pushes rare dangers' scores up, so a score of 60 does not mean a 60% chance.
- **Alert line (cutoff).** The score a danger must pass before we alert. Cold's is 0.50, heat's 0.60, ozone's 0.70. The four rare dangers sit at 0.95, which in practice turns them off.
- **Practice year (validation).** The 2024-25 school year, taken out of the training data and used only to choose alert lines.
- **Test period.** September 2025 to November 2026. Used once, at the end.
- **Leakage.** When the model accidentally sees the answer. We avoid it by using only today-or-earlier inputs, splitting by time, and choosing alert lines on the practice year.
- **Caught / missed / false alarm.** Caught: we alerted and a danger happened. Missed: a danger happened with no alert. False alarm: we alerted and nothing happened.

## Finals Q&A: practice answers

**What does the model predict, and for whom?**
For each of seven dangers, whether it will happen tomorrow in Philadelphia. It's for a principal or teacher planning recess the evening before.

**Why a random forest instead of something else?**
Our data is a small table: about 6,600 rows and 24 inputs. Random forests work well on tables, need little tuning, and we can explain them: trees asking yes/no questions and voting. A neural network would be harder to explain and has no clear advantage on data this size. We did not test other models, so we can't claim this one is the best.

**What's the baseline, and how much better are you?**
Two baselines. "Tomorrow will be like today" caught 47 of 70 danger days with 25 false alarms. Our model alone caught 56 with 27, but a paired test says that gap could be luck (p = 0.38). The tougher baseline is the weather forecast with our danger lines: on weather dangers it beat our model (58 of 65 caught, 10 false alarms, against 52 and 24). So Recess Ready uses the forecast for weather and our model for air: 59 caught, 13 false alarms, F1 0.83. That beats our model alone (p = 0.006) and "like today" (p = 0.001).

**"So why do you need machine learning at all?"**
Honestly, for this decision, our tests say you mostly don't. We started by believing ML would beat simple rules. We tested that against the strongest simple alternative, the weather forecast with our danger lines, and it lost on weather. We kept our model for air quality because there's no archive of old air forecasts to test against, but even there it didn't change a single call on the test period: all 6 ozone days it caught were already flagged for heat. Our contribution is the evaluation, not a claim that ML is always better. Next step: train a model that uses the forecast as an input, and test it on a fresh period.

**"Didn't you overfit to your test set?"**
Partly, yes, and we say so. We didn't tune the model or the alert lines on it, but we looked at test results while building, and we chose the hybrid after seeing the forecast comparison. So our test numbers are exploratory. Our git history shows exactly when each decision was made (README timeline). We also ran a development-period check on the 2024-25 practice year (not independent: our alert lines were chosen there). The finding looked the same: the forecast beat our model on weather (43 caught with 10 false alarms, vs 41 with 21), and the hybrid beat our model alone (p = 0.027).

**"Do your danger labels match a dangerous recess?"**
Not exactly. "Too cold" uses the day's lowest feels-like, usually at dawn. At the airport during recess, only 15 of the 45 "too cold" days were actually at or below 20 °F; the typical recess value was about 23 °F. So our labels are cautious: they flag more days than recess-hour readings alone would.

**"Are your p-values the main result?"**
No. The error counts are. The p-values are for one paired question (was the "any danger" call right, one school day at a time), and the hybrid was chosen after looking. The confidence intervals show the hybrid and the forecast alone can't be told apart.

**Why do you trust your accuracy? How did you check for leakage?**
Inputs only come from today or earlier, and tomorrow's answers are shifted correctly. We split by time, so the test period comes after all training data. Alert lines were chosen on a separate practice year with a separate model. The forecast results use forecasts as they were issued the day before, not the weather that happened. We also checked against a real weather station. And we're honest about one weakness: we looked at test results while building, and chose the hybrid after seeing the forecast comparison, so a fresh test period would be stricter.

**Where does it fail, and why?**
First, our own model lost to the forecast on weather dangers. Second, rain, wind and snow had only 3, 5 and 1 test days, so nothing about them is well tested, and our model never alerts on smoke. It can't see thunderstorms or ice at all, because our weather history never records them; the airport reported 12 thunderstorm days and 4 freezing-rain days. And ozone alerts are noisy: 6 caught but 10 false alarms.

**Does it work equally well across groups?**
These checks are for our model alone; we didn't have time to repeat them for the hybrid. Not equally. By season, it beats the baseline in fall (0.93 against 0.88) and winter (0.77 against 0.72), and is slightly behind in spring (0.82 against 0.83) and June (0.73 against 0.77). By place, accuracy across 35 places in the region ranges from 0.81 to 0.86, weakest in South Jersey.

**What would you do with more time?**
First, fix the rare dangers: use tomorrow's weather forecast as an input, since a forecast knows a storm is coming and yesterday's weather doesn't. Second, train a thunderstorm alert on the airport's decades of real storm reports. Third, use the airport's hourly readings in the model itself, so it can make a call for the recess hours instead of the whole day. Fourth, use real air sensors or NASA's TEMPO satellite so each neighborhood gets its own air reading. Fifth, add the real school calendar and let a district set its own thresholds.

## Questions a judge might push on

- **"Is tonight's call accurate?"** We don't know yet, and we say so. Our accuracy numbers come from the test period. Tonight's call is a new prediction we can only score after tomorrow happens. The hourly strip, week graph and map colors are Open-Meteo's own forecast, not our model.
- **"How can a next-day model predict 7 days out?"** It can't on its own. For day 3, we give it the weather forecast for day 2 as if it were measured. So it's only as good as the forecast. We tested that on a year of old forecasts (Step 16): 52 of 65 weather danger days caught for tomorrow, still 45 a week out, against 29 for the baseline. The app quotes the result for each day. It's still labeled "an early look."
- **"Which inputs matter most?"** Show the shuffle test chart. Mention that the built-in ranking disagreed and why we trust the shuffle test: it measures what actually happens to the alerts.

- **"You tried several versions. Did you tune on the test set?"** Be honest: we saw test results from earlier versions during the weekend (3 years of data, one shared cutoff), and those failures pushed us to change the design. The final alert lines come only from the practice year. A stricter test would be a fresh period nobody has looked at, such as the months after November 2026.
- **"Why is heavy rain 'not reliable' instead of just removed?"** Because a principal should know it's a blind spot. Hiding it would make the tool look more complete than it is.
- **"Your air data is a model estimate. Is that a problem?"** It's a limit. We checked the weather side against real sensors (98-99% agreement) but could not do the same for air quality. Real monitors are a next step.
- **"Is 'feels like 20 °F' an official rule?"** No. The heat and wind thresholds follow National Weather Service levels and the air thresholds follow EPA levels, but the cold, rain and snow thresholds are our own settings. A district would use its own policy.
- **"Your wind direction looks wrong for some days."** The model's wind input is one daily average from weather-model data, so it can hide changes during the day and runs low on gusts. The Past days tab shows the airport's real hourly readings, and the week ahead shows the hour-by-hour forecast. Using hourly data in the model is our next step.
- **"Who wrote the code?"** An AI coding assistant wrote most of it from our instructions. We chose the problem, the user and the rules, ran every version, and can explain each step. (Then explain a step.)

- **"My phone's weather app says something different."** Different source, and we show feels-like (wind chill and heat index), not the air temperature. Against the airport's real sensors, our data is typically 3-4 °F off and runs 2-3 °F colder on average. The day-before forecast is typically about 2 °F off. We report these numbers instead of hiding them.

- **"If a free forecast with simple thresholds does as well, why use Recess Ready?"** Our tests don't show it predicts better than that, and we say so. What it adds is the school-specific part: the call and plan in plain words, the danger lines shown next to each number, the school calendar, after-school checks, and a record of past calls against what happened. Showing that this improves real decisions is the next step.
- **"Your statistics assume each day is independent."** Right, and weather comes in streaks. Resampling whole weeks gives wider intervals (hybrid 0.72-0.91, forecast alone 0.76-0.92), and we say our day-level tests may overstate certainty.
- **"Was the forecast really available the evening before?"** The archive stores the value forecast 24 hours before each hour, so the day's high and low were forecast by the afternoon or dawn before. Late-evening hours came after an 8 PM decision, which barely affects highs and lows.

## The two big questions: "what did the ML add?" and "what's new?"

**Explain the second try in 30 seconds (both of you should be able to say this):**
Our first model only saw today's weather, so it was racing a physics forecast it couldn't beat. So we gave ML a fairer job: start from the forecast and learn where it goes wrong for heat and cold. For example, does a forecast of 21 °F feels-like with strong wind usually end up colder? We wrote the whole design into the notebook *before* running it, so we couldn't tweak it after seeing the answer. Then we ran it once. It lost: 49 of 70 danger days caught against the app's 59 (p = 0.039). It caught only 7 of 16 hot days, because it had just 11 hot days to learn from and became too cautious.

- **"So what did the ML add?"** Honestly, no better calls, and we tested that two ways. What the ML work added is the answer itself: we now know that for next-day recess calls in Philadelphia, a good forecast plus clear danger lines is hard to beat, and why (one year of saved forecasts is too little to learn a physics model's mistakes). The app uses what tested best. A principal gets a tool built on evidence, not on the assumption that ML must be better.
- **"Why write the design down first?"** We had already seen the test period. If we tried many versions and kept the best, we'd fool ourselves. Writing it down first and running once is called pre-registration. Scientists use it for the same reason.
- **"What would make the second try work?"** Several years of saved old forecasts, not one. Then the model has enough heat waves and cold snaps to learn the forecast's habits.
- **"What's original here? Weather alerts already exist."** Three things. (1) It's a decision, not a forecast: one call for tomorrow's recess, for school staff, the night before, with the reason and the danger line next to each number. (2) We tested our own ML head-to-head against the weather forecast, and reported that it lost. Most student projects only compare against an easy baseline. (3) You can replay any past day and check our call against what the airport station actually measured, hour by hour.

## Before you submit

- [ ] Each person has explained every step out loud once.
- [ ] Add your names in `README.md` and `CLAUDE.md`.
- [ ] List every AI tool anyone used in the README.
- [ ] Open the links in the README's Credits section and check they work.
- [ ] Do a fresh-clone test: follow only the README on a clean computer or Codespace.
- [ ] Open every submission link in a private browser window.
