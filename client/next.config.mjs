import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,      // Enable React strict mode for improved error handling
    swcMinify: true,            // Enable SWC minification for improved performance
    compiler: {
        removeConsole: process.env.NODE_ENV !== "development"     // Remove console.log in production
    },
    webpack(config) {
        // Trouve la règle existante pour les fichiers SVG
        const fileLoaderRule = config.module.rules.find(rule => rule.test?.test?.('.svg'));

        config.module.rules.push(
            // Réapplique la règle existante, mais seulement pour les imports SVG se terminant par ?url
            {
                ...fileLoaderRule,
                test: /\.svg$/i,
                resourceQuery: /url/ // *.svg?url
            },
            // Convertit tous les autres imports *.svg en composants React
            {
                test: /\.svg$/i,
                issuer: fileLoaderRule.issuer,
                resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclut *.svg?url
                use: ['@svgr/webpack']
            }
        );

        // Modifie la règle du file loader pour ignorer les *.svg, car ils sont gérés maintenant
        fileLoaderRule.exclude = /\.svg$/i;

        return config;
    },
};

export default withPWA({
    dest: "public",         // Répertoire de destination pour les fichiers PWA
    disable: process.env.NODE_ENV === "development",        // Désactive la PWA en mode développement
    register: true,         // Enregistre le service worker PWA
    skipWaiting: true,      // Active le service worker immédiatement sans attente
})(nextConfig);
