# CLAUDE.md: Veritas AI International High School Hackathon

Read this whole file before doing anything in this repo. Follow it every time.

## 1. Who we are

We were 3 high school students; one teammate left during the event, so we are now a **team of 2**. We are beginners in Python, and neither of us had built a machine learning project before. We are competing in the **Climate** track.

| Role | Name | Job |
|---|---|---|
| Video, demo and coding | Brandon | Builds the demo and charts, makes the 2-minute video, drives the app and explains the model and results in the finals |
| Write-up lead | Faadi Garcia | Writes the one-page write-up, tracks sources and AI tools, covers limits and impact in the finals |

Both of us must understand and be able to explain every part of the project. Write and explain code with that in mind.

## 2. The event

- **When:** 48 hours, online. Kickoff Sat Nov 14, 2026 at 12:00 AM ET. Submissions close Sun Nov 15, 2026 at 11:59 PM ET. Late submissions are not accepted. We aim to submit by about 9:00 PM ET Sunday.
- The challenge brief is only revealed at kickoff. Before then, everything in this repo is practice (see section 4).
- **We submit three things:**
  1. Working code: this GitHub repo, which judges must be able to open and run
  2. A one-page write-up: the problem, our approach, and how well it worked
  3. A 2-minute demo video (unlisted YouTube link or direct upload)
- **We're aiming for:** Best Beginner Build (strongest project from a team building with AI for the first time) and Best AI for Good.

### How we're judged

**Round 1 (blind review):**

| Category | Points |
|---|---|
| Technical execution (does it work, is it well built) | 30 |
| Originality | 20 |
| Impact and track fit | 20 |
| Testing and honesty about results (how well it works and where it fails) | 15 |
| Clarity of write-up and video | 15 |

**Finals (live 5-minute demo + Q&A with AI researchers):**

| Category | Points |
|---|---|
| Demo and clarity | 30 |
| Technical depth | 30 |
| Impact | 20 |
| Q&A | 20 |

Final rank = 70% finals + 30% Round 1. This means **a simple model, done carefully and explained honestly, beats a fancy model we can't explain.**

## 3. Hackathon rules (must follow)

- All project code must be written during the 48-hour event.
- AI tools are allowed only if our team understands and can explain every part. We must list every AI tool used in the write-up.
- Cite everything we didn't make: datasets, pretrained models, open-source libraries, tutorial code. Submitting someone else's project is disqualification.
- Public or synthetic data only. Do not collect personal information.
- Fairness and honesty: check whether the model works equally well across groups, and report the results we actually got, including disappointing ones.
- Health and finance projects are prototypes, not advice. For our climate project, any alerts are "prototype, not official guidance."

## 4. Practice vs. the real project

- `practice/` is for learning before Nov 14. **Nothing from `practice/` may be copied into the real project.**
- The real project lives in `project/` (and `notebooks/main.ipynb`) and is started from scratch at kickoff.
- Before kickoff, it's fine to set up: this file, the README template, the folder structure, and a `.gitignore`. Do not write real project code early.

## 5. How to write code for us

- Beginner-friendly Python. Simple and readable over clever. Use pandas, scikit-learn, matplotlib, and (for the demo) Gradio unless there's a strong reason not to.
- Work in small steps. One small notebook cell at a time, each with a short markdown cell above it explaining what it does and why.
- After writing any code, explain it in plain English, line by line if it's new to us. Assume we've never seen the library before.
- **Never invent results.** Every number in the notebook, README, write-up, or video must come from actually running the code.
- Always include a baseline and compare the model against it. For next-day air quality, the default baseline is "tomorrow will be the same as today."
- **Warn us loudly if results look too good** (for example, above 95% accuracy on a real-world problem). Check for data leakage: a feature that gives away the answer, or test data that the model saw during training.
- Split data by time for forecasting (train on earlier dates, test on later dates), not randomly.
- Show where the model fails: a confusion matrix and 2-3 real examples it got wrong.
- Fairness check: report accuracy per group (for example, per city or region), and say honestly if one group does worse.
- Keep it runnable top to bottom with "Run all." If a cell depends on a previous one, it must come after it.
- No paid API keys or secrets. Free, open data and open-source models only.
- When you suggest an approach, give us one recommended option, not five.

## 6. Repo rules (judges must run this with no help)

Target structure:

```
README.md              <- what it is, how to run it, results, credits
run.py                 <- runs the notebook's code and starts the app (python run.py)
requirements.txt       <- every library, with pinned versions
CLAUDE.md              <- this file
notebooks/main.ipynb   <- the main notebook, saved with its outputs
data/                  <- saved data files (the notebook re-downloads them if deleted)
project/static/        <- our map script and the Leaflet library
docs/                  <- the write-up (WRITEUP.md), the demo video, charts, screenshots and the teach-back guide
practice/              <- practice only, never reused
```

- `README.md` must always be up to date with:
  - a 2-3 sentence summary of the project
  - an "Open in Colab" badge linking to `notebooks/main.ipynb`
  - exact local run steps (`pip install -r requirements.txt`, then how to run)
  - what output to expect
  - results (model vs. baseline, fairness by group), with real numbers
  - credits: datasets, models, libraries, tutorials
  - AI tools used
- `requirements.txt` must list every library with pinned versions.
- Data: either include a small file in `data/`, or download it automatically in the notebook. Judges should never have to find files themselves.
- Before submitting, a teammate clones the repo fresh and follows only the README. If they get stuck, fix it.

## 7. Our real project: Recess Ready (Philadelphia)

**What it is:** a planning tool for principals, teachers and school staff. Each evening it says whether tomorrow's recess needs a change of plan, and why. The audience is adult school staff: write for them, never for students, and never collect personal information.

**How it works (all in `notebooks/main.ipynb`, Steps 1-18):**
- Data: Open-Meteo daily weather since 1995 and air quality since August 2022, saved in `data/`. No API keys.
- Seven dangers: too hot, too cold, heavy rain, dangerous wind, heavy snow, smoke and particles, ozone smog. Thunderstorms and ice were dropped because the data never records them.
- Baseline: "tomorrow will be like today."
- Model: two random forests (weather dangers on 30 years, air dangers on 2022 onward), with trend inputs.
- Each danger has its own alert line, chosen on the 2024-25 practice year with `MISS_COST = 2`. Never tune anything on the test period (September 2025 to November 2026).
- Checks: by season, against the real PHL airport station, and across 35 places in the region.
- Step 14 downloads the PHL airport station's real hourly readings (saved as `data/phl_station_hourly.csv`). The app's Past days tab shows them hour by hour; the model does not use them.
- After Step 9, a shuffle test (permutation importance, with the real alert lines) shows which inputs matter. Saved as `docs/feature_importance.png`.
- Step 16 tests calls made 1-7 days ahead on Open-Meteo's archive of old forecasts (Previous Runs API, saved as `data/phl_old_forecasts.csv`): weather dangers only, gusts estimated from wind speed. Saved as `docs/days_ahead.png`. The app quotes these results for each day.
- After Step 16, a chart cell saves `docs/model_vs_baseline.png` and `docs/by_season.png` (the video charts, with `docs/days_ahead.png`).
- Step 16 also scores a tougher baseline, the forecast for each day with our danger lines, and the hybrid the app uses, with precision, recall, F1 and McNemar paired tests (`eval_table`, `PAIRED`, `HYBRID`, `fc1`).
- Step 17 is the live week ahead: `get_live()` downloads the last 3 days and next 7 for Philadelphia and the 35 places (four downloads at once, 20-second limit) and scores each day with the trained model (no retraining). Day 1 is the tested next-day call; days 2-7 use forecast inputs (tested in Step 16). Air scores are blank past the ~5-day air forecast. Each successful download is saved to `data/live_forecast_saved.json`; if a later download fails, `saved_live()` loads it and the app labels it "Saved forecast from [date], not live" (`LIVE["saved"]`). With no saved copy, `LIVE` is None and the app says so.
- App (Step 18): Gradio, with three tabs: "Week ahead" (day cards, per-day panels with an Activities card: recess/PE follow the call, after-school 3-6 PM is checked against the hourly forecast by `activities_html()`; the forecast reloads on every page open via `demo.load`, no refresh button; while open, `gr.Timer` re-checks every `CHECK_MINUTES` (10) and `call_changes()` adds a "The forecast changed a call" banner (`changes_html()`, `CHANGES`) when a school day's call flips; each day's risk-score card ends with a live countdown to the next check (`next_check_html()`, ticked by `recess_maps.js`); wind map, forecast map, week graph; day switching happens in the browser), "Past days" (`recess_check()` replays a test-period day: the call, what happened, the station's hourly readings and the wind map) and "Results" (test results). Dashboard layout: day cards with a big card for the picked day, a chance-of-rain chart, a "Why trust this call?" card (`evidence_html()`) and an "Across the region" column (`region_side_html()`). Opens in dark mode; a light/dark switch in the header (styles in `DARK_CSS`, put in the page head because Gradio rewrites selectors in its own CSS). Maps are drawn by `project/static/recess_maps.js` (Leaflet + OpenStreetMap). It shows US units and calls the model's output a "risk score," not a percent chance.

**Results we report (from the saved notebook, Step 16):** on 270 test school days with 70 danger days, Recess Ready (the hybrid: forecast + danger lines for weather, our model for air) caught 59, missed 11, 13 false alarms (F1 0.83). Our model alone caught 56, missed 14, 27 false alarms (F1 0.73). "Like today" caught 47, missed 23, 25 false alarms (F1 0.66). Paired tests: hybrid vs model p = 0.006, hybrid vs baseline p = 0.001, model vs baseline p = 0.38 (not significant). The forecast alone (weather only) caught 59 with 9 false alarms. We chose the hybrid after seeing these results; say so. Our model's air part changed no call on the test period (all 6 ozone catches were already heat days; 4 ozone false alarms made normal days "with limits"). The F1 95% CIs overlap for the hybrid (0.76-0.89) and forecast alone (0.79-0.92). Labels are cautious: only 15 of 45 "too cold" days were at or below 20 °F at recess at the airport. Step 16 also runs a development-period check (2024-25 practice year, NOT independent: alert lines were chosen there) with `tuner`: hybrid 46 caught / 12 false alarms (F1 0.84), model alone 44 / 21 (0.75), forecast alone 44 / 9 (0.84), baseline 35 / 18 (0.67); hybrid vs model p = 0.027. Accuracy across both periods (486 days, descriptive only, not validation): forecast 0.92, hybrid 0.91, model 0.86, baseline 0.83. Week-block bootstrap F1 intervals: hybrid 0.72-0.91, forecast 0.76-0.92. Weather-only (65 days): forecast 58 caught / 10 FA, model 52 / 24. Second try (Step 16, after the practice-year check; design written into the notebook before running, run once): ML on top of the forecast for heat and cold, trained on the 2024-25 practice year (216 days), alert lines by blocked CV: 49 caught / 21 missed / 11 false alarms (F1 0.75); vs the hybrid p = 0.039, vs forecast alone p = 0.004; heat 7 of 16 (forecast 15), cold 36 of 45 (forecast 41). Variables `FA_TABLE`, `FA_PAIRED`, `FA_CUT`. The app was not changed. Research question: can ML beat the forecast + danger lines? Our answer, from two attempts: no. If the notebook's output changes, update the README, the write-up and the video to match.

**Demo video:** `docs/recess_ready_video.mp4` (1:30, 1080p, AI voiceover with Kokoro TTS, flat animation drawn in Python on three colour fields: orange (problem), bone (product), near-black (test); real light-mode app screenshots of Mon Jan 26, 2026; original piano music). Its script is at the end of `docs/SCRIPTS.md`; the one-page write-up is `docs/WRITEUP.md`. If a result changes, update both and re-make the video.

**Known limits to say out loud:** our ML model lost to the plain forecast on weather dangers; heavy rain, wind and snow have too few test days; no smoke alerts; thunderstorms and ice are invisible; one reading for the whole city; air data is a model estimate; the test counts every weekday as a school day (the live week ahead skips federal holidays and the district days in `NO_SCHOOL_DAYS`); scores are not percent chances.

**Before changing the model:** re-run the notebook, save it with outputs (`RECESS_SKIP_APP=1 jupyter nbconvert --to notebook --execute --inplace main.ipynb` from `notebooks/`), and update every number in the README.

The practice project (a global bad-air-day forecaster) was only for learning before kickoff. Nothing from it is used.

## 8. Brandon's jobs (video + demo)

When Brandon asks for help, he usually needs:

- A Gradio demo that runs in Colab: simple inputs, a clear prediction, and a short plain-English message.
- 2-3 clean charts for the video: model vs. baseline, accuracy by group, and one chart that shows the real-world problem.
- A 2-minute video script with timestamps:
  - 0:00-0:20 the problem (one relatable example)
  - 0:20-1:10 live demo
  - 1:10-1:40 results vs. baseline, plus one honest failure
  - 1:40-2:00 who it helps and what's next
- Explanations of any code he didn't write, until he can explain it to a judge.

## 9. Weekend schedule (Nov 14-15)

| Time (ET) | Goal |
|---|---|
| Sat 12-2 AM | Read the brief, pick the idea, set up the real repo, then sleep |
| Sat morning | Load and clean data; baseline working |
| Sat afternoon | Model working and compared to baseline |
| Sat night | Fairness check, failure examples, start the Gradio demo and charts |
| Sun morning | Teach-back: each person explains every part to the others |
| Sun afternoon | Finish write-up and video using real numbers |
| Sun ~9 PM | Fresh-clone test, "Run all" in Colab, submit |

## 10. Finals Q&A prep

Help us practice answers to:

- What does the model predict, and for whom?
- Why this model instead of something else?
- What's the baseline, and how much better are we?
- Why do you trust your accuracy? How did you check for leakage?
- Where does it fail, and why?
- Does it work equally well across groups?
- What would you do with more time?
