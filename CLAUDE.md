# CLAUDE.md: Veritas AI International High School Hackathon

Read this whole file before doing anything in this repo. Follow it every time.

## 1. Who we are

We are a team of 3 high school students. We are beginners in Python: two of us can solve CodingBat-level problems, and none of us has built a machine learning project before. We are competing in the **Climate** track.

| Role | Name | Job |
|---|---|---|
| Main engineer | [NAME] | Writes most of the code in the notebook |
| Video + coding assistant | Brandon | Builds the demo and charts, makes the 2-minute video, helps test code |
| Write-up lead | [NAME] | Writes the one-page write-up, tracks sources and AI tools |

All three of us must understand and be able to explain every part of the project. Write and explain code with that in mind.

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
requirements.txt       <- every library, with pinned versions
CLAUDE.md              <- this file
notebooks/main.ipynb   <- the main notebook (must work in Colab with "Run all")
data/                  <- small data files, or a script that downloads them
project/               <- any helper .py files for the real project
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

## 7. Our practice project (before kickoff only)

**Bad-Air-Day Forecaster: Global Cities**

- Predict whether tomorrow's air quality will be unhealthy in ~15-20 major cities on different continents, using today's weather and air quality.
- Data: Open-Meteo free historical weather + air quality APIs (same format for every city). Start with ONE city end to end, then add more.
- Use ONE definition of "unhealthy" for every city (a PM2.5 threshold based on US AQI or WHO guidelines), and cite it.
- Baseline: "tomorrow = today." Model: random forest from scikit-learn.
- Fairness: accuracy per city and per region, with honest failures.
- Long-term trends: bad-air days per year per city, labeled clearly as historical TRENDS, not predictions.
- Demo: pick a city and date, get a prediction plus a short alert for schools and families, with a "prototype, not official guidance" disclaimer.

At kickoff, we adapt this shape (predict, compare to baseline, check fairness, demo an alert) to whatever the real brief asks for.

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
