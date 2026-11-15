# Teach-back guide: explain Recess Ready to a judge

Use this on Sunday morning. Take turns: one person explains a step out loud, the others ask "why?" until the answer is solid. Every number here comes from the saved notebook.

## The project in 30 seconds

> Recess Ready helps a Philadelphia principal decide, the evening before, whether tomorrow's recess needs a change of plan. It looks at today's weather and air and gives each of seven dangers a risk score. On 270 school days it had never seen, it caught 56 of the 70 danger days. Just assuming "tomorrow will be like today" caught 47. It is reliable for heat, cold and ozone, and we show clearly that it can't yet handle rare dangers like heavy rain.

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
The baseline says tomorrow's dangers equal today's. On the test period it caught 47 danger days, missed 23 and raised 25 false alarms. We caught 56, missed 14 and raised 27. So 9 more danger days caught for 2 more false alarms. Accuracy is 0.85 against 0.82.

**Why do you trust your accuracy? How did you check for leakage?**
Four things. Inputs only come from today or earlier. We split by time, so the test period comes after all training data. Alert lines were chosen on a separate practice year. And 85% is a modest number: it isn't suspiciously high. We also scored the model against a real weather station it never trained on, and it still beat the baseline (45 caught against 38).

**Where does it fail, and why?**
Three places. It gives no alerts for heavy rain, wind, snow or smoke, because they were too rare in our practice year to set an alert line; those dangers happened 14 times in the test period and we caught none. It can't see thunderstorms or ice at all, because our weather history never records them; the airport reported 12 thunderstorm days and 4 freezing-rain days. And ozone alerts are noisy: 6 caught but 10 false alarms.

**Does it work equally well across groups?**
Not equally. By season, it beats the baseline in fall (0.93 against 0.88) and winter (0.77 against 0.72), and is slightly behind in spring (0.82 against 0.83) and June (0.73 against 0.77). By place, accuracy across 35 places in the region ranges from 0.81 to 0.86, weakest in South Jersey.

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

## Before you submit

- [ ] Each person has explained every step out loud once.
- [ ] Add your names in `README.md` and `CLAUDE.md`.
- [ ] List every AI tool anyone used in the README.
- [ ] Open the links in the README's Credits section and check they work.
- [ ] Do a fresh-clone test: follow only the README on a clean computer or Codespace.
- [ ] Open every submission link in a private browser window.
