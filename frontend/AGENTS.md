# Frontend agent instructions

- The React/TypeScript app uses Vite. Current shopping views, API requests and cart behavior live in `src/App.tsx`; shared visual styles live in `src/index.css`.
- Match backend permissions: shoppers can shop and see their own orders; admins can also manage products and all orders. Send Bearer tokens for protected requests.
- Preserve stable test IDs on interactive controls and add them to new ones. Keep labels, keyboard focus, accessible status/error feedback and responsive layouts usable.
- Show prices in INR. Keep cart state in browser storage and checkout simulated unless the user requests a change.
- Extend the shared light storefront design and restrained, dismissible action notifications. Respect reduced-motion settings and use hover/focus tooltips when they add useful context.
- For UI changes, verify affected flows and shopper/admin visibility in a browser or with an available UI automation tool, including narrow layouts where relevant. Report when visual checks cannot run.
