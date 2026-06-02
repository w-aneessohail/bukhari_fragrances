var config = {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                heading: ["Cormorant Garamond", "serif"],
                body: ["Inter", "sans-serif"]
            },
            colors: {
                bg: {
                    primary: "var(--bg-primary)",
                    secondary: "var(--bg-secondary)"
                },
                text: {
                    primary: "var(--text-primary)",
                    secondary: "var(--text-secondary)"
                },
                accent: {
                    gold: "var(--accent-gold)",
                    warm: "var(--accent-warm)"
                },
                border: "var(--border-color)",
                card: "var(--card-bg)",
                navbar: "var(--navbar-bg)",
                input: "var(--input-bg)"
            },
            boxShadow: {
                luxury: "var(--shadow)"
            }
        }
    },
    plugins: []
};
export default config;
