## Jmeter-blazedemo-performance-testing
End-to-End Performance Testing Project using Apache JMeter on BlazeDemo flight booking application including load testing, parameterization, correlation, assertions and HTML dashboard reporting.

## JMeter Performance Testing Project – BlazeDemo

## Project Overview:-

This project demonstrates **end-to-end performance testing using Apache JMeter** on the BlazeDemo flight booking application.

The test simulates multiple users performing a **flight booking workflow** and measures system performance under load.

---

## Test Scenario

The following user journey was automated for performance testing:

1. Open BlazeDemo home page
2. Search for available flights
3. Select a flight
4. Enter passenger details
5. Complete purchase

---

## Tools & Technologies Used

* Apache JMeter
* CSV Data Parameterization
* Regular Expression Extractor (Correlation)
* Assertions
* Timers
* HTML Dashboard Report
* GitHub

---

## Key Concepts Implemented

✔ Thread Groups (Virtual Users)
✔ Parameterization using CSV Data Set Config
✔ Correlation using Regular Expression Extractor
✔ Response Assertions
✔ Duration Assertions
✔ Think Time using Timers
✔ Non-GUI test execution
✔ HTML Performance Dashboard

---

## Performance Report

The test generates an **HTML dashboard report** which includes:

* Average Response Time
* Throughput
* Error Percentage
* 90th & 95th Percentile
* Active Threads
* Response Time Graphs

To view the report:

Open:

```
reports/index.html
```

---

## How to Run the Test

Run JMeter in **Non-GUI mode**:

```
jmeter -n -t BlazeDemo_Performance_Test.jmx -l results.jtl -e -o reports
```

---

## Project Structure

```
jmeter-blazedemo-performance-testing
│
├── test-plan
│   └── BlazeDemo_Performance_Test.jmx
│
├── test-data
│   └── testdata.csv
│
├── results
│   └── results.jtl
│
├── reports
│   └── index.html
│
└── README.md
```

| Test Type   | Users | Avg Response Time | Error % | Throughput |
| ----------- | ----- | ----------------- | ------- | ---------- |
| Load Test   | 100   | 4800 ms           | 0%      | 18 req/min |
| Stress Test | 300   | 7200 ms           | 2%      | 35 req/min |
| Spike Test  | 500   | 9500 ms           | 5%      | 50 req/min |

```
## Author
Rakshit Kohli
QA Automation / Performance Testing Enthusiast
