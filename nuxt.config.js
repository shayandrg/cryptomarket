import colors from 'vuetify/es5/util/colors'

export default {
	// Global page headers: https://go.nuxtjs.dev/config-head
	head: {
		titleTemplate: '%s - CryptoMarket',
		title: 'CryptoMarket',
		htmlAttrs: {
			lang: 'en'
		},
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ hid: 'description', name: 'description', content: '' },
			{ name: 'format-detection', content: 'telephone=no' }
		],
	},

	// Global CSS: https://go.nuxtjs.dev/config-css
	css: [
		'~/assets/css/main.scss'
	],

	// Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
	plugins: [
	],

	// Auto import components: https://go.nuxtjs.dev/config-components
	components: true,

	// Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
	buildModules: [
		'@nuxtjs/vuetify',
		'@nuxtjs/tailwindcss',
	],

	// Modules: https://go.nuxtjs.dev/config-modules
	modules: [
	],

	// Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
	vuetify: {
		treeShake: true,
		rtl: true,
		customVariables: ['~/assets/variables.scss'],
		theme: {
			dark: true,
			themes: {
				dark: {
					primary: colors.red.accent3,
					secondary: colors.blueGrey.darken2,
				},
				light: {
					primary: '#ad9742',
					secondary: colors.blueGrey.darken1,
				}
			}
		},
		// defaultAssets: {
		//     font: false,
		//     icons: false
		// }
	},

	tailwindcss: {
		cssPath: '~/assets/css/tailwind.css',
		configPath: 'tailwind.config.js',
		exposeConfig: false,
		injectPosition: 0,
		viewer: false,
		config: {
			mode: 'jit',
			theme: {
				screens: {
					sm: '600px',
					md: '960px',
					lg: '1264px',
					xl: '1904px'
				},
			},
		}
	},
	// Build Configuration: https://go.nuxtjs.dev/config-build
	build: {
	}
}