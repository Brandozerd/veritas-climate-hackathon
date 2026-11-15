# Recess Ready: video and demo scripts

Every number here comes from the saved notebook (`notebooks/main.ipynb`). If the notebook changes, update these.

Before recording: run `git pull` and `python run.py` so the app shows real forecasts. Use dark mode, a 1440-wide browser window, and close other tabs.

---

## 2-minute video (about 280 spoken words)

**0:00-0:20 · The problem**
*Screen: the app's header and Week ahead tab. (Optional: a few seconds of an empty schoolyard you film yourself.)*

> Every evening, someone at a Philadelphia school has to decide: does recess go outside tomorrow? Since September 2025, 45 school days have had a wind chill of 20 degrees or colder. Heat, smog and storms make it harder. Most schools decide at the last minute.

**0:20-1:10 · Live demo**
*Screen: click the selected school day's big card, then scroll slowly.*

> This is Recess Ready. Each evening it makes the call for tomorrow: indoor recess, outdoor with limits, or outdoor as usual, and why.
>
> Here's the forecast check. Every number sits next to its danger line, so staff can see exactly why we made the call.
>
> It covers the whole day: lunch recess, and after-school sports from 3 to 6, where a 4 PM thunderstorm can change the plan.
>
> *(Click Past days, pick Dec 3, 2025.)* And because it's a prototype, we can replay any past day. Here's what we knew the evening before, what actually happened, and whether we were right.

**1:10-1:40 · Results, and the honest twist**
*Screen: Results tab, the research question box, then the table.*

> We started out trying to prove machine learning would beat the weather forecast. It didn't. On 270 school days we'd never trained on, our random forest caught 56 of 70 danger days. The plain forecast with our danger lines caught 59, with a third of the false alarms. A forecast already knows a cold front is coming; our model only sees today. So the app uses what tested best, and we report where it fails, like heavy rain and thunderstorms.

**1:40-2:00 · Who it helps and what's next**
*Screen: back to the Week ahead, Copy message for staff button.*

> Recess Ready is for principals, teachers and coaches. One click copies a message for the staff chat. Next, we want to train a model that uses the forecast as an input, and test it on months nobody has seen. Prototype, not official guidance.

**On-screen text to add while editing (optional):**
- 1:15 → "Our model: 56 of 70 caught, 27 false alarms"
- 1:20 → "Forecast + danger lines: 59 of 70, 9 false alarms"
- Chart to flash: `docs/model_vs_baseline.png`

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
