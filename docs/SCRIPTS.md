# Recess Ready: video and demo scripts

Every number here comes from the saved notebook (`notebooks/main.ipynb`). If the notebook changes, update these.

Before recording: run `git pull` and `python run.py` so the app shows real forecasts. Use dark mode, a 1440-wide browser window, and close other tabs.

---

## 2-minute video (our writer's draft, with real numbers; about 290 spoken words)

Fill the ⟨ ⟩ blanks from the app right before recording (the selected day's big card and Forecast check), and show that same day in the screen recording.

**0:00-0:20 · The problem** *(Schuylkill River Trail, talking to camera)*

> Every day, elementary and middle schools across Philadelphia have to decide whether it's safe for kids to have recess outside. Weather apps give you numbers, not a decision. So staff end up guessing about cold, heat, smog and storms, and students with asthma are hit the hardest. We built Recess Ready to take the guesswork out of recess.

**0:20-1:00 · Live demo** *(screen recording)*

> No login. A teacher opens the website and reads one line: indoor recess, outdoor with limits, or outdoor as usual, and why.
>
> Right now it's calling ⟨CALL⟩ for ⟨DAY⟩. The forecast says a feels-like low of ⟨X⟩ degrees and wind from the ⟨DIRECTION⟩ at up to ⟨Y⟩ miles per hour. Every number sits next to its danger line, so you can see exactly why.
>
> It also checks the whole school day, 7 AM to 6 PM, including after-school sports, where a 4 PM thunderstorm can change the plan.

**1:00-1:40 · How it works, and what we found** *(Results tab, then Past days)*

> We used free weather and air-quality data from Open-Meteo going back to 1995, and trained a machine-learning model on 30 years of Philadelphia weather. Then we tested it on 270 school days it had never seen.
>
> Guessing "tomorrow will be like today" caught 47 of 70 danger days. Our model caught 56. But the plain weather forecast, checked against our danger lines, caught 59, with a third of the false alarms. So we didn't hide that. The app uses what tested best, and you can replay any past day to check our calls.

**1:40-2:00 · What's next** *(trail, walking)*

> It's not perfect: heavy rain, thunderstorms and ice are still blind spots. Next, we want to feed the forecast into our model and test it on new months. Recess Ready: prototype, not official guidance.

**On-screen text while editing:** "Like today: 47 of 70" → "Our model: 56 of 70, 27 false alarms" → "Forecast + danger lines: 59 of 70, 9 false alarms". Chart: `docs/model_vs_baseline.png`.

**Facts to keep straight:** the model makes one call per day (not per hour); the hour-by-hour view is the Open-Meteo forecast. "A third of the false alarms" = 9 vs our model's 27.

---

## 5-minute finals demo

Roles: **Brandon** drives the app and explains the model and results. **Faadi** opens, covers the limits and closes. Each of you talks for about half. Every number below is from the saved notebook or the app.

**Before you start (2 minutes):** run `python run.py`, open the app, leave it on the Week ahead tab in dark mode, and open a second browser tab already on Past days → Mon, Jan 26, 2026. Close everything else.

**0:00-0:40 · The decision (Faadi; Brandon drives)**
*Week ahead tab, the next school day selected.*

> Every evening, a principal in Philadelphia decides whether tomorrow's recess goes outside. Most schools decide the next morning, with no time to plan. Recess Ready makes that call the night before, in one line, with the reason and a plan. This is the real call for the next school day, from tonight's forecast.

**0:40-1:30 · How it works (Brandon)**
*Point at the Forecast check rows, then the risk-score card and its countdown.*

> For heat, cold, rain, wind and snow, we check the forecast against clear danger lines, like a wind chill of 20 degrees or a heat index of 90. For smog and smoke, two random forests trained on 30 years of Philadelphia weather and air quality since 2022 give a risk score. Each danger has its own alert line, chosen on a separate practice year, where a missed danger counts twice as much as a false alarm. And because forecasts change, the app re-checks every 10 minutes: this countdown shows the next check, and if a call flips, a banner says which day changed and why.

**1:30-2:30 · Replay a real day (Brandon)**
*Switch to the second tab: Past days → Mon, Jan 26, 2026.*

> This is Monday, January 26th, a day from our test period that the model never trained on. The evening before, the forecast said a feels-like low of minus 1, past our 20-degree line, so the call was: plan indoor recess. Below is what actually happened at the airport station, hour by hour. At 11 AM, recess time, it felt like 10 degrees. Recess Ready was right. You can replay any of the 270 test days like this, including the ones we got wrong.

**2:30-3:30 · Results (Brandon)**
*Results tab: the research-question box, then the three score cards.*

> Our research question: can machine learning beat the weather forecast plus clear danger lines? On 270 test school days with 70 danger days, "tomorrow will be like today" caught 47. Our model alone caught 56, with 27 false alarms. Recess Ready, the forecast for weather plus our model for air, caught 59 with 13. Then we tried a second time: machine learning on top of the forecast, with the design written down before we ran it. It caught 49. So our honest answer, from two attempts, is no: the forecast was hard to beat, and the app uses what tested best.

**3:30-4:20 · Limits (Faadi)**
*Scroll to "What it can't do yet".*

> Three honest limits. First, we chose the app's design after seeing test results, so our numbers are exploratory, not a clean final exam. Second, our labels use the whole day's coldest or hottest feels-like: at recess time, only 15 of 45 "too cold" days actually hit 20 degrees. Third, heavy rain, wind and snow had only a handful of test days, and thunderstorms and ice aren't in our data at all. If forecast data is missing, the app makes no call instead of a falsely reassuring one.

**4:20-5:00 · Impact (Faadi)**
*Back to Week ahead.*

> Recess Ready is decision support, not an authority: staff make the call, with the evidence in front of them. It knows the school calendar, checks after-school hours, and flags changes before the morning. Next, we'd save several years of forecasts and try machine learning again, add neighborhood air sensors, and test it with real school staff. It's a prototype, not official guidance. Thank you.

**If the live forecast fails on stage:** the Week ahead tab shows the saved backup, labeled "Saved forecast, not live". Say: "No internet here, so it's showing its saved backup and labeling it, which is what it's built to do." Then go straight to Past days.

**Backup plan:** record this whole demo once beforehand. If the app or Wi-Fi fails completely, play the recording and keep talking.

---

**In Q&A:** either of you can answer anything, but split by default: Brandon takes model, data and app questions; Faadi takes limits, impact and "why should schools trust it" questions.

## The five hardest questions (one-line answers; details in `TEACH_BACK.md`)

1. **Why use ML if the forecast is better?** We tested that instead of assuming it, twice (ML alone, and ML on top of the forecast); both times the answer was no, and that's our finding.
2. **Did you overfit your test set?** Partly: we never tuned on it, but we chose the hybrid after looking, so the results are exploratory, and our git history shows when. The second try was written down before it ran.
3. **Do your labels mean a dangerous recess?** Not exactly: they're whole-day extremes; only 15 of 45 "too cold" days crossed 20 °F at recess.
4. **What does your ML add?** On the test period, no changed calls. What it added is evidence: two honest tests showing a good forecast plus clear lines is hard to beat with one city's data.
5. **Would you trust a school to use this?** As decision support, yes; as a safety authority, no. Staff decide, and it shows them why.

---

## Final video: AI voiceover script (1:30, `docs/recess_ready_video.mp4`)

Word for word what the finished video says. The voice is an AI voice (Kokoro TTS). The pictures are flat animation in three colour fields (orange: the problem; off-white: the product; near-black: the test) plus light-mode screenshots of our app's Past days tab for Monday, January 26, 2026, a test-period day. Every number is from the saved notebook or that screen.

| Time | Scene | Voiceover |
|---|---|---|
| 0:00 | The example | Sunday night, January twenty fifth. Tomorrow's low will feel like minus one degree. Every school in Philadelphia has to decide. Is recess safe? |
| 0:09 | The dangers | Cold... heat... smog... and storms. |
| 0:14 | The problem | Most schools decide the morning of, by looking out the window. By then, there's no time to plan. |
| 0:20 | Recess Ready | So we built Recess Ready. It makes the recess call the night before. And it explains why. |
| 0:26 | The call | For that Monday, it said: plan indoor recess. The forecast low, minus one, crossed the twenty degree line. |
| 0:34 | It was right | And it was right. At recess, the airport station felt like ten degrees. |
| 0:39 | The data | It learns from thirty years of Philadelphia weather, and air quality since twenty twenty two. All free, open data. |
| 0:47 | How it works | It watches for seven dangers. Each one has its own alert line. A random forest scores the risk, and the weather forecast checks it. |
| 0:55 | The test | We tested it on fourteen months it never saw. Two hundred seventy school days. Seventy danger days. |
| 1:02 | Results | The simple guess, tomorrow will be like today, caught forty seven. Our model caught fifty six. Recess Ready caught fifty nine, with only thirteen false alarms. |
| 1:13 | The honest part | And the honest part. Our machine learning did not beat the plain forecast. Not alone, and not even built on top of it. Thunderstorms and ice are invisible in our data. |
| 1:23 | Close | Recess Ready. The recess call, made the night before. A prototype, not official guidance. |
