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

Roles: **Brandon** drives the app and explains the model and results. **Write-up lead** opens, covers the limits and closes. Switch speakers at the marked times, so each of you talks for about half.

**0:00-0:40 · The decision (Write-up lead; Brandon drives)**
*Week ahead tab, next school day selected.*

> Every evening a principal decides whether tomorrow's recess goes outside. Recess Ready answers that in one line, with the reason and a plan. This is tomorrow's real call for Philadelphia, made from tonight's forecast.

**0:40-1:30 · How it works (Brandon)**
*Point at the Forecast check, then the risk-score panel.*

> Two parts. For heat, cold, rain, wind and snow, we check the weather forecast against fixed danger lines: wind chill 20, heat index 90, and so on. For air quality, we trained two random forests on 30 years of Philadelphia weather and 3 years of air data. Those give risk scores, not percent chances: we told the model to pay extra attention to rare dangers, so its scores run high. Each danger has an alert line chosen on a separate practice year.

**1:30-2:30 · Historical replay (Brandon)**
*Past days tab → Dec 3, 2025.*

> Here's December 3rd, 2025. On the left is everything we knew the evening before: the forecast said a feels-like low of 22, just above our line, so the call was outdoor recess. Below is what actually happened: no danger. Recess Ready was right. Our model alone raised a false alarm here, and "like today" was right too. Every test day can be checked like this.
>
> *(Optional second day: Dec 4, 2025, a correct cold alert.)*

**2:30-3:30 · Results (Brandon)**
*Results tab: research question box, then the all-dangers table.*

> Our research question: can machine learning beat the forecast plus clear danger lines? Our answer is no. On 270 test school days with 70 danger days, the forecast caught 59 with 9 false alarms. Our model alone caught 56 with 27. Our hybrid, what the app uses, caught 59 with 13. Our model did beat "tomorrow will be like today," which caught 47, but a paired test says that gap could be luck. We checked a second period, the 2024-25 school year, and the finding looked the same.

**3:30-4:20 · Limits (Write-up lead)**
*Scroll to "How we tested" and the label note.*

> Three honest limits. First, we chose the hybrid after seeing test results, so these numbers are exploratory. Second, our labels use the whole day's coldest or hottest feels-like. At the airport during recess, only 15 of our 45 "too cold" days were actually below 20. Third, heavy rain, wind and snow had only a handful of test days, and thunderstorms and ice aren't in our data at all. If forecast data is missing, the app makes no call instead of a reassuring one.

**4:20-5:00 · Impact (Write-up lead)**
*Back to Week ahead, click Copy message for staff.*

> Recess Ready is decision support, not an authority: staff make the call, with the evidence in front of them. It knows the school calendar, checks after-school hours, and one click shares the plan. Next, we'd train a model that uses the forecast as an input, test it on fresh months, and add neighborhood air sensors. Thank you.

**Backup plan:** record this whole demo once beforehand. If the live app or Wi-Fi fails, play the recording and keep talking.

---

**In Q&A:** either of you can answer anything, but split by default: Brandon takes model, data and app questions; the Write-up lead takes limits, impact and "why should schools trust it" questions.

## The five hardest questions (one-line answers; details in `TEACH_BACK.md`)

1. **Why use ML if the forecast is better?** We tested that hypothesis instead of assuming it; the answer was no, and that's our finding.
2. **Did you overfit your test set?** Partly: we didn't tune on it, but we chose the hybrid after looking, so the results are exploratory, and our git timeline shows when.
3. **Do your labels mean a dangerous recess?** Not exactly: they're whole-day extremes; only 15 of 45 "too cold" days crossed 20 °F at recess.
4. **What does your ML add?** On the test period, no changed calls; on the practice year, 2 more danger days caught for 3 more false alarms.
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
