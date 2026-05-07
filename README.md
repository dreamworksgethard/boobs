# BOOBS — meme site

Static one-page site for the **BOOBS** Solana meme coin.

## Run locally

Open `index.html` in a browser, or run a tiny server:

```bash
python3 -m http.server 5173
```

Then open `http://localhost:5173`.

## Customize

- **Contract address (CA)**: set `localStorage.boobs_ca` in your browser console, e.g.
  `localStorage.setItem("boobs_ca","YOUR_CA_HERE"); location.reload();`
- **Links**: edit the `href="#"` placeholders in `index.html` under “Official links”.
- **Supply**: edit the `TBA` value in the Tokenomics section in `index.html`.

