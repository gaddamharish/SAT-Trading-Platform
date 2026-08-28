# SAT — Smart Analytics & Trading Platform

Standalone AI-assisted market intelligence, research, recommendation and position-monitoring platform for Indian markets, initially focused on Nifty/Bank Nifty derivatives.

## Decision pipeline

freshness → features → regime → confirmations → historical analogues → opportunity ranking → exact strategy/legs → payoff & risk → hard risk gates → explainable SAT Verdict → human review → manual broker execution → broker confirmation → position health

SAT is advisory-first. It does not silently place trades.

## Repository status

The repository contains the validated SAT foundation and test suite. Live NSE/Dhan connectivity, production persistence, credentials/secrets and browser E2E remain integration gates and are not faked.
