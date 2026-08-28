# SAT Engineering Rules

SAT is a standalone trading-intelligence platform. Do not modify or depend on HAT application code.

Rules:
- Human approval is mandatory before execution; never silently place trades.
- Never fabricate live data, historical results, or backtest results.
- Stale/incomplete evidence must reduce confidence or suppress recommendations.
- Every multi-leg strategy must expose every leg and payoff/risk fields.
- Risk gates run before a recommendation becomes actionable.
- Historical replay must prevent look-ahead/data leakage.
- Keep live data, historical memory, intelligence, strategy, risk, broker and UI boundaries separate.
- Add tests with each feature and run `npm test` and syntax checks before completion.
