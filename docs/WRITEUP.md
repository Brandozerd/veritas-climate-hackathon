# Recess Ready: Philadelphia

**Veritas AI Hackathon 2026 · Climate track · Brandon and Faadi Garcia** · *Prototype, not official guidance.*

**Problem.** Philadelphia school staff decide each day whether recess and PE go outside, usually the morning of, by looking out the window. Weather apps give numbers, not a decision, and heat and bad-air days hit students with asthma hardest.

**What's new.** Not another forecast: a *decision* for one user, made the night before, with its reason. And we tested our ML head-to-head against the weather forecast itself.

**What we built.** A planning tool for adult school staff. Each evening it gives one call for tomorrow (indoor recess, outdoor with limits, or outdoor as usual) and the reason, with each forecast number shown next to its danger line. It covers seven dangers: heat, cold, heavy rain, wind, snow, smoke and ozone. It also shows the week ahead, re-checks the forecast every 10 minutes and flags any call that changes, and replays past days against real airport readings. No personal data.

**Approach.** Free Open-Meteo data (weather since 1995, air since 2022). Two random forests (weather and air), each danger with its own alert line, tuned on the 2024-25 school year (a miss costs twice a false alarm). Baselines: "tomorrow like today," and the tougher one, the weather forecast checked against our lines. We split by time and tested once on Sep 2025 to Nov 2026: 270 school days, 70 with a danger.

**Results.**

| Method | Caught /70 | False alarms | F1 |
|---|---|---|---|
| Recess Ready (forecast for weather + our model for air) | 59 | 13 | 0.83 |
| Our ML model alone | 56 | 27 | 0.73 |
| Baseline: "like today" | 47 | 25 | 0.66 |

Recess Ready beat our model (p = 0.006) and the baseline (p = 0.001); our model vs. the baseline was not significant (p = 0.38).

**Research question: can ML beat the forecast plus clear danger lines? Our answer, from two attempts: no.** The forecast alone caught 59 with only 9 false alarms, and our model's air part changed no call. So we tried ML *on top of* the forecast, learning where it goes wrong for heat and cold. We wrote the design down first and ran it once: 49 caught, F1 0.75, worse than the app (p = 0.039). We chose the hybrid after seeing test results, so all of this is exploratory.

**Where it fails.** Too few test days for rain, wind and snow, and no smoke alerts. Thunderstorms and ice are not in the data. Labels are cautious: only 15 of 45 "too cold" days hit 20 °F at recess. One reading covers the whole city, and air data is a model estimate. Scores are risk scores, not percent chances. Checked by season, against the airport station, and across 35 places (details in README).

**Next.** Save forecasts for several years and retry ML on top of them, predict recess-hour conditions, add real air sensors, and test with school staff.

**Sources and AI tools.** Data: [Open-Meteo](https://open-meteo.com/) (weather, air quality, old forecasts; CC BY 4.0), [Iowa Environmental Mesonet](https://mesonet.agron.iastate.edu/request/download.phtml) (PHL airport station), [School District of Philadelphia calendar](https://www.philasd.org/calendar/), [OpenStreetMap](https://www.openstreetmap.org/copyright). Libraries: [pandas](https://pandas.pydata.org/), [scikit-learn](https://scikit-learn.org/), [SciPy](https://scipy.org/), [Matplotlib](https://matplotlib.org/), [Gradio](https://www.gradio.app/), [Leaflet](https://leafletjs.com/). No pretrained models or tutorials used in the project code. AI: [Claude Code](https://www.anthropic.com/claude-code) (wrote code and the video from our instructions), [ChatGPT](https://chatgpt.com/) (judge-style review), [Kokoro TTS](https://huggingface.co/hexgrad/Kokoro-82M) (the video's AI voice). We ran everything and can explain every part. Full credits: [README](https://github.com/Brandozerd/veritas-climate-hackathon#credits).
