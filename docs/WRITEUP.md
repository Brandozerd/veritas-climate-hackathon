# Recess Ready: Philadelphia

**Veritas AI International High School Hackathon 2026 · Climate track · Team of 2**

## The problem

Every school day, staff in Philadelphia decide whether recess and PE go outside. Weather apps give numbers, not a decision, so the call is often made the morning of, by looking out the window. That leaves no time to plan indoor space, and it is hardest on students with asthma on smoggy days. As the climate warms, hot days and bad-air days are a bigger part of the school year.

## What we built

Recess Ready is a planning tool for adult school staff. Each evening it gives one call for tomorrow (indoor recess, outdoor with limits, or outdoor as usual) and the reason, with every forecast number shown next to its danger line. It covers seven dangers: too hot, too cold, heavy rain, dangerous wind, heavy snow, smoke and particles, and ozone smog. It also shows the week ahead, checks after-school hours (3 to 6 PM), and lets you replay any past test day against the real hourly readings from the Philadelphia airport weather station. It collects no personal information.

## Our approach

- **Data:** Open-Meteo daily weather for Philadelphia since 1995 and air quality since August 2022. Free, public, no API keys.
- **Baseline:** "tomorrow will be like today."
- **Model:** two random forests (one for weather dangers, one for air dangers) with trend inputs. Each danger has its own alert line, chosen on the 2024-25 school year with one rule: a missed danger day costs twice as much as a false alarm.
- **Tougher baseline:** the weather forecast itself, checked against our danger lines.
- **Test:** split by time. We tested once on September 2025 to November 2026, which the model never saw: 270 school days, 70 with a danger.

**Our research question:** can machine learning beat the weather forecast plus clear danger lines?

## How well it worked

| Method | Caught (of 70) | Missed | False alarms | F1 |
|---|---|---|---|---|
| Recess Ready (forecast for weather, our model for air) | 59 | 11 | 13 | 0.83 |
| Our machine-learning model alone | 56 | 14 | 27 | 0.73 |
| Baseline: "like today" | 47 | 23 | 25 | 0.66 |

Paired tests: Recess Ready vs our model p = 0.006; vs the baseline p = 0.001. Our model vs the baseline p = 0.38, so that gap could be luck.

**Our answer is no.** The forecast with our danger lines, on its own, caught 59 danger days with only 9 false alarms. Our model did not beat it on weather, and our model's air-quality part changed no call on the test period. We chose the final design (the hybrid) after seeing these results, so they are exploratory, not independent proof. The same pattern showed up on the 2024-25 practice year (hybrid F1 0.84, model alone 0.75), but our alert lines were chosen there, so that is not independent either.

## Where it fails

- Heavy rain, dangerous wind and heavy snow had too few test days to trust. Smoke never triggered an alert.
- Thunderstorms and ice are invisible: the data never records them.
- Our labels are cautious. Only 15 of 45 "too cold" days were at or below 20 °F at recess time at the airport.
- One reading stands for the whole city, and the air data is a computer-model estimate, not a sensor.
- The scores are risk scores, not percent chances.
- **Fairness:** we checked by season, against the real airport station, and across 35 places in the region. Results are in the README.

## Impact and what's next

A principal gets the recess call the night before, with the reason, in one line. Next we would predict conditions at recess hour instead of whole-day extremes, add real air sensors, and test with school staff.

*Prototype, not official guidance. Always follow National Weather Service alerts and school district policy.*

## Sources and AI tools

- **Data:** Open-Meteo (weather, air quality, old forecasts; CC BY 4.0); Iowa Environmental Mesonet (PHL airport station); School District of Philadelphia 2026-27 calendar; OpenStreetMap.
- **Libraries:** pandas, NumPy, scikit-learn, SciPy, Matplotlib, Gradio, Leaflet.
- **AI tools:** Claude Code (wrote most of the code from our instructions, and built the video); ChatGPT (reviewed the project like a judge); Kokoro TTS (the AI voice in the video). We ran everything ourselves and can explain every part. Full list in the README.
